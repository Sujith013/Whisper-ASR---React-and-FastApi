import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function AudioForm() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");

  const handleFileChange = (event:any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event:any) => {
    event.preventDefault();

    if (!file) {
      alert("Please select an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/transcribe-audio/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("Transcription:", response.data);
      setTranscription(response.data.transcription);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to transcribe audio.");
    }
  };

  return (
    <div className='form'>
      <h2>Upload Audio for Transcription</h2>
      <form onSubmit={handleSubmit}>
        <input className='button' type="file" accept="audio/*" onChange={handleFileChange} />
        <button className='button' type="submit">Transcribe</button>
      </form>
      {transcription && (
        <div className='trans'>
          <p>Transcription: {transcription}</p>
        </div>
      )}
    </div>
  );
}

export default AudioForm;
