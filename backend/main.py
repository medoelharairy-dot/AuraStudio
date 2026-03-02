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
    vton_client = Client("yisol/IDM-VTON")
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
        result = vton_client.predict(
            {"background": bg_path, "layers": [], "composite": None}, # Background Image
            gm_path, # Garment Image
            garment_description,  # Garment description prompt
            is_checked,           # is_checked boolean
            is_checked_crop,      # is_checked_crop boolean
            denoise_steps,        # Denoising steps
            seed,                 # Seed
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
