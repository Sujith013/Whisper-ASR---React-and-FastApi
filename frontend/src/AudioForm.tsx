import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function AudioForm() {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!file) {
      alert("Please select an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true); // Start spinner

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_FASTAPI_IP}/transcribe-audio`,
        formData,
        {
          headers: {
        "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log("Transcription:", response.data);
      setTranscription(response.data.transcription);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to transcribe audio.");
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <div className="main-page">
      <section className="hero">
        <h1><span>AI Speech </span>Recognition</h1>
        <p>Transform your audio files into accurate text transcriptions using advanced AI technology.</p>
        <div className="features">
          <span>🎵 Multiple Formats</span>
          <span>⚡ Fast Processing</span>
        </div>
      </section>

      <section className="upload-section">
        <div className="upload-card">
          <h2>Upload Your Audio File</h2>
          <p>Drag and drop your audio file or click to browse</p>
          <label className="upload-box">
            <input type="file" accept="audio/*" onChange={handleFileChange} />
            {file ? (
              <span className="file-name">📄 {file.name}</span>
            ) : (
              <>
                <span>📤 Drop your audio file here</span>
                <p className="formats">MP3, WAV, M4A, FLAC</p>
              </>
            )}
          </label>

          <button
            type="submit"
            className="transcribe-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            🎙️ Transcribe Audio
          </button>

          {loading && (
            <div className="spinner"></div>
          )}

          {!loading && transcription && (
            <div className="output">
              <h3>Transcription:</h3>
              <p>{transcription}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AudioForm;