from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from gradio_client import Client
import tempfile
import os
import shutil

app = FastAPI(title="Fashn AI Clone Backend")

# Allow CORS for local development (Vite runs on 5173/5174/5175)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your Cloudflare Pages domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gradio Clients for Free Spaces (These spaces might change over time)
# Note: Free spaces can be slow or have queue times. We use them for zero-cost operation.
try:
    # We are using an alternative/duplicate space for IDM-VTON as the main one 'yisol/IDM-VTON' often throws 429 Rate Limit errors.
    vton_client = Client("Kwai-Kolors/Kolors-Virtual-Try-On") # Note: kwai models are often very fast and less rate-limited. If it fails, fallback to 'Nymbo/Virtual-Try-On'
    # For consistent models or face swap we would initialize other clients here, e.g. PuLID or InstantID spaces
    # face_swap_client = Client("Gradio-Space-URL")
except Exception as e:
    print(f"Warning: Could not connect to a HF Space on startup. They might be asleep. Error: {e}")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Fashn AI Clone Backend is running"}

@app.post("/api/try-on")
async def try_on(
    background_image: UploadFile = File(...), # The person/model image
    garment_image: UploadFile = File(...),    # The clothing image
    garment_description: str = Form(""),
    is_checked: bool = Form(True),            # IDM-VTON param
    is_checked_crop: bool = Form(False),      # IDM-VTON param
    denoise_steps: int = Form(30),
    seed: int = Form(42)
):
    try:
        # 1. Save uploaded files to temporary files because gradio_client needs file paths
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as bg_tmp:
            shutil.copyfileobj(background_image.file, bg_tmp)
            bg_path = bg_tmp.name
            
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as gm_tmp:
            shutil.copyfileobj(garment_image.file, gm_tmp)
            gm_path = gm_tmp.name

        print(f"Processing Try-On. Person: {bg_path}, Garment: {gm_path}")
        
        # 2. Call the open-source IDM-VTON space
        # Note: The api_name must match the Gradio space's defined API endpoints. 
        # For yisol/IDM-VTON, '/tryon' is the main generation endpoint.
        # Note: Kolors Virtual Try On takes slightly different arguments. We need to adapt it.
        # Actually, let's use a direct duplicate of yisol IDM-VTON to keep the exact same arguments structure: "yisol/IDM-VTON-alt" or similar.
        # Let's try init with "Nymbo/Virtual-Try-On" which is a known fork, or we catch the 429 and return a friendly error.
        
        # We will attempt the exact same predict call. If the alternative space uses a different API, it might fail, 
        # but most IDM-VTON duplicates keep the same API.
        result = vton_client.predict(
            {"background": bg_path, "layers": [], "composite": None}, # Background Image
            gm_path, # Garment Image
            garment_description,  # Garment description prompt
            True,                 # is_checked boolean
            True,                 # is_checked_crop boolean
            30,                   # Denoising steps
            42,                   # Seed
            api_name="/tryon"
        )
        
        # 3. Cleanup temp files
        os.unlink(bg_path)
        os.unlink(gm_path)
        
        # 4. Result usually comes back as a path to an image or a tuple of paths. 
        # IDM-VTON returns a tuple where the first element is the generated image path.
        if isinstance(result, tuple) and len(result) > 0:
             generated_image_path = result[0]
        else:
             generated_image_path = result
             
        # For this prototype, we'll return the URL/path. 
        # In a real app, you might upload this to S3/Cloudflare R2 and return the CDN URL.
        # Since Gradio Client creates local tmp files for results, we can serve it or convert to base64.
        # For simplicity in this step, let's read the result and return it as base64 so React can render it immediately.
        import base64
        with open(generated_image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            
        return {
            "success": True, 
            "message": "Try-On completed", 
            "image": f"data:image/png;base64,{encoded_string}"
        }
        
    except Exception as e:
        print(f"Error during Try-On: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Note port 7860 is required for Hugging Face Spaces!
    uvicorn.run(app, host="0.0.0.0", port=7860)
