import React, { useRef, useState, useEffect } from 'react';
import { io } from "socket.io-client";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
const Live = () => {
  const [streamId] = useState("67fa94cac23e87148090dc9c");
  const [isLive, setIsLive] = useState(false);
  const [status, setStatus] = useState("Ready");
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);
  const streamRef = useRef(null);
  const isFirstChunkRef = useRef(true);
  const location = useLocation();
  const { Sid } = location.state || {};
  useEffect(() => {
    socketRef.current = io("https://newshive-express-1.onrender.com", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000
    });

    return () => {
      stopStreaming();
      socketRef.current?.disconnect();
    };
  }, []);
  useEffect(()=>{
    if(Sid == null || Sid.length == 0)
    {
      useNavigate("/");
    }
  },[]);

  const validateWebMHeader = (chunk) => {
    return chunk && chunk.length >= 4 && 
           chunk[0] === 0x1A && 
           chunk[1] === 0x45 && 
           chunk[2] === 0xDF && 
           chunk[3] === 0xA3;
  };

  const startStreaming = async () => {
    try {
      console.log(Sid);
      let check = await axios.get("https://newshive-express-1.onrender.com/LiveStart/"+Sid);
      console.log(check);
      if(check.status == 200)
      {
        setStatus("Starting stream...");
        isFirstChunkRef.current = true;
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          },
          audio: true
        });
        streamRef.current = stream;

        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        socketRef.current.emit('start-stream', { streamId });
        setStatus("Initializing recorder...");

        const options = {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 2500000,
          audioBitsPerSecond: 128000
        };

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = async (e) => {
          if (e.data.size > 0) {
            try {
              const buffer = await e.data.arrayBuffer();
              const chunk = new Uint8Array(buffer);
              
              if (isFirstChunkRef.current) {
                if (!validateWebMHeader(chunk)) {
                  console.error("Invalid WebM header in first chunk");
                  setStatus("Stream format error");
                  stopStreaming();
                  return;
                }
                isFirstChunkRef.current = false;
              }
              
              socketRef.current.emit('stream-chunk', chunk);
            } catch (err) {
              console.error("Error sending chunk:", err);
            }
          }
        };

        mediaRecorder.onerror = (e) => {
          console.error("Recorder error:", e);
          setStatus(`Recorder error: ${e.error.name}`);
        };

        mediaRecorder.start(1000); // 1 second chunks
        setIsLive(true);
        setStatus("Live - broadcasting");
      }
    } catch (err) {
      console.error("Start stream error:", err);
      setStatus(`Error: ${err.message}`);
      stopStreaming();
    }
  };

  const stopStreaming = async () => {
    try {
      console.log(Sid);
      let check = await axios.get("https://newshive-express-1.onrender.com/LiveStop/"+Sid);
      console.log(check);
      setStatus("Stopping stream...");
      
      if (mediaRecorderRef.current?.state !== 'inactive') {
        mediaRecorderRef.current?.stop();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      socketRef.current.emit('stop-stream');
      setIsLive(false);
      setStatus("Ready");
    } catch (err) {
      console.error("Stop stream error:", err);
      setStatus(`Stop error: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold">Live Broadcast</h1>
      <div className="text-sm text-gray-300">{status}</div>
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        className="rounded-2xl border-4 border-red-500 w-full max-w-xl shadow-lg"
      />
      {!isLive ? (
        <button
          onClick={startStreaming}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-xl font-semibold"
          disabled={status.includes("Starting")}
        >
          Start Broadcast
        </button>
      ) : (
        <button
          onClick={stopStreaming}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-xl font-semibold"
        >
          Stop Broadcast
        </button>
      )}
    </div>
  );
};

export default Live;