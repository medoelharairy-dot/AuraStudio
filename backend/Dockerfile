FROM python:3.10-slim

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . .

# Start FastAPI server on port 7860 (Hugging Face standard port)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
