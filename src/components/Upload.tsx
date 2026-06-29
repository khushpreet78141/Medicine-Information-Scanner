
"use client"
import { HtmlContext } from 'next/dist/shared/lib/html-context.shared-runtime'
import React, { useRef } from 'react'
import Image from 'next/image'
import axios from "axios";
import { useState } from 'react'

const Upload = () => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let width = 400;
  let height = 400;
  const [video, setVideo] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [capturedImage, setCapturedImage] = useState<File|null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [analysis, setAnalysis] = useState("");


  const handleCapture = async () => {
    setVideo(true)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(async (stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });

  }
  const streaming = useRef(false);

  const handleSelectFile = (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  const file = e.target.files?.[0];
  if (!file) return;
  const imageUrl = URL.createObjectURL(file);
  setCapturedImage(file)
  
  setPreviewUrl(imageUrl)
  setShowPreview(true);
  
};

  const handleVideoListener = () => {
    if (!canvasRef.current || !videoRef.current) return;

    if (!streaming.current) {

      height = videoRef.current.videoHeight / (videoRef.current.videoWidth / width);

      videoRef.current.setAttribute("width", width);
      videoRef.current.setAttribute("height", height);
      canvasRef.current.setAttribute("width", width);
      canvasRef.current.setAttribute("height", height);
      streaming.current = true;

    }
  }


  const handleStartButton = (ev) => {
    takePicture();
    ev.preventDefault();
  }

  const handlePreview = () => {

    setShowPreview(true);
  }
  function takePicture() {
    if (!canvasRef.current || !videoRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (!context) return;
    if (width && height) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      context.drawImage(videoRef.current, 0, 0, width, height);

      //const data = canvasRef.current.toDataURL("image/png");
      canvasRef.current?.toBlob((blob) => {
  if (!blob) return;

  const file = new File([blob], "captured-image.png", {
    type: "image/png",
  });

  setCapturedImage(file);

  const url = URL.createObjectURL(file);
  setPreviewUrl(url);
});
      
    } else {
      //clearPhoto();
    }
  }

  const handleStopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setVideo(false);
  };

  const handleCallGeminiApi = async()=>{
    const formData = new FormData();

  formData.append("image", capturedImage);

      const res = await axios.post("/api/uploadToGemini",formData,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(res.data.result);
  setAnalysis(res.data.result); 
  }

return (
  <>
    <div className='bg-blue-900 h-15 text-white text-center p-3 font-bold text-2xl'>
      <h1>Identify medicines and understand their usage through AI image analysis</h1>
    </div>
    <div className='flex justify-center items-center gap-30 mt-20'>
      <div className='flex flex-col justify-end items-center gap-5 '>
        <h1 className='text-blue-700 text-2xl font-bold'>Upload Image</h1>
        <div className='border-dashed  rounded-lg border-3 border-gray-400 w-80 h-40  flex overflow-y-scroll text-gray-500 ml-8 pl-13 items-center'>
          <input type="file" accept='image/*' onChange={handleSelectFile} />
        </div>
      </div>

      <div className=' flex items-center flex-col gap-3 '>
        <h2 className='text-blue-700 text-2xl font-bold'>Scan Image</h2>
        <div className='w-80 relative h-[240px] object-cover border-3 border border-gray-400 rounded-lg flex items-center justify-center'>
          <button onClick={handleCapture} className='bg-blue-700 text-white p-2 font-bold rounded-2xl px-6 '>Capture</button>
          {video && <div className='absolute z-10 top-0'><video ref={videoRef} onCanPlay={handleVideoListener} autoPlay></video>
            <div className='mt-5 flex items-center justify-center gap-5'> <button onClick={handleStartButton} className='bg-green-600 text-white font-bold text-sm p-2 rounded-2xl'>Take Snapshot</button>
              <button className='bg-blue-600 text-white font-bold text-sm p-2 rounded-2xl' onClick={handlePreview}>Preview</button></div>
          </div>
          }
        </div>
      </div>
    </div>
    {video && <button className='bg-red-700 text-white absolute top-40 right-20 p-2 rounded-2xl cursor-pointer hover:bg-red-800' onClick={handleStopScanning}>Stop Scanning</button>}
    <div>
      <canvas ref={canvasRef} className="hidden"></canvas>

      {showPreview && previewUrl && (
        <>
          <div className='ml-90 mt-30 flex gap-32 items-start'>
            <Image
              src={previewUrl}
              alt="Captured Image"
              className="rounded-lg border"
              width={320}
              height={320}
            />
           {analysis ? <div>
      {/*{analysis && <>*/}
      <div className='bg-green-700 absolute w-[550px] min-h-30 p-5 right-12 mt-18 text-white rounded-2xl'>
        hii
        {analysis}</div>
        {/*</>}*/}
    </div>: <button className='bg-blue-700 p-2 text-white text-lg rounded-2xl' onClick={handleCallGeminiApi}>Start Analyzing </button>} 
          </div>
        </>
      )}
    </div>
  </>
)
}


export default Upload

