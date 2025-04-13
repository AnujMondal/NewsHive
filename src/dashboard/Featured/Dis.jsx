import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const Dis = ({title}) => {
  const videoRef = useRef(null);
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);
  const socketRef = useRef(null);
  const [status, setStatus] = useState("Initializing...");
  const [streamId] = useState("67fa94cac23e87148090dc9c");
  const bufferQueueRef = useRef([]);

  const initMediaSource = () => {
    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;
    videoRef.current.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('sourceopen', () => {
      setStatus("Creating video decoder...");
      createSourceBuffer();
    });
  };

  const createSourceBuffer = () => {
    const codecs = [
      'video/webm; codecs="vp9,opus"',
      'video/webm; codecs="vp8,opus"',
      'video/webm'
    ];

    for (const mime of codecs) {
      if (MediaSource.isTypeSupported(mime)) {
        try {
          const sourceBuffer = mediaSourceRef.current.addSourceBuffer(mime);
          sourceBuffer.mode = 'sequence';
          sourceBufferRef.current = sourceBuffer;

          sourceBuffer.addEventListener('updateend', () => {
            if (bufferQueueRef.current.length > 0 && !sourceBuffer.updating) {
              processBuffer();
            }
            if (videoRef.current.paused) {
              videoRef.current.play().catch(e => console.log("Play attempt:", e));
            }
          });
          
          setStatus("Ready for stream");
          return;
        } catch (e) {
          console.warn(`Failed with ${mime}:`, e);
        }
      }
    }
    setStatus("No supported codecs available");
  };

  const processBuffer = () => {
    const sourceBuffer = sourceBufferRef.current;
    if (!sourceBuffer || sourceBuffer.updating) return;

    const chunk = bufferQueueRef.current.shift();
    if (!chunk) return;

    try {
      sourceBuffer.appendBuffer(chunk);
    } catch (e) {
      console.error("Append error:", e);
      bufferQueueRef.current.unshift(chunk);
      setTimeout(processBuffer, 100);
    }
  };

  const handleStreamChunk = (chunk) => {
    try {
      const uint8Chunk = new Uint8Array(chunk);
      bufferQueueRef.current.push(uint8Chunk);
      processBuffer();
    } catch (e) {
      console.error("Chunk processing error:", e);
    }
  };

  useEffect(() => {
    initMediaSource();

    const socket = io("https://newshive-express-1.onrender.com", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("Connecting to stream...");
      socket.emit("join-stream", streamId);
    });

    socket.on("stream-ready", () => {
      setStatus("Connected to stream");
    });

    socket.on("stream-init", ({ chunks }) => {
      console.log("Receiving initial buffer");
      chunks.forEach(chunk => {
        bufferQueueRef.current.push(new Uint8Array(chunk));
      });
      processBuffer();
    });

    socket.on("live-chunk", ({ chunk }) => {
      handleStreamChunk(chunk);
    });

    socket.on("disconnect", (reason) => {
      setStatus(`Disconnected: ${reason}`);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setStatus(`Connection failed: ${err.message}`);
    });

    videoRef.current?.addEventListener('error', () => {
      const error = videoRef.current.error;
      console.error("Video error:", error);
      setStatus(`Playback error: ${error.message}`);
    });

    return () => {
      socket.disconnect();
      if (mediaSourceRef.current?.readyState === 'open') {
        mediaSourceRef.current.endOfStream();
      }
    };
  }, [streamId]);

  return (
      // <video
      //   ref={videoRef}
      //   autoPlay
      //   muted
      //   playsInline
      //   controls
      //   className="rounded-2xl border-4 border-green-500 w-full max-w-xl shadow-lg"
      // />
<div className="bg-white border border-red-700 p-6 rounded-2xl shadow-2xl w-full max-w-3xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-red-700 tracking-wide uppercase">
          {title}
        </h2>
        <span className="bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full animate-pulse">
          🔴 LIVE
        </span>
      </div>
      <div className="flex justify-center items-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-xl border-4 border-red-600 w-full max-w-2xl shadow-lg"
        onCanPlay={(e) => { e.target.volume = 1.0; }} // Set full volume
        />
      </div>
    </div>
  );
};

export default Dis;