from fastapi import FastAPI, File, UploadFile
import librosa
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
import io
from mangum import Mangum

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipe = pipeline("automatic-speech-recognition", model="sujith013/whisper-medium-tamil")


@app.post("/transcribe-audio/")
async def transcribe_audio(file: UploadFile = File(...)):
    audio_bytes = await file.read()

    audio_np, sr = librosa.load(io.BytesIO(audio_bytes), sr=16000)
    print("running the pipeline")
    transcription = pipe(audio_np)
    print(transcription)

    return {"filename": file.filename, "transcription": transcription["text"]}

handler = Mangum(app)
