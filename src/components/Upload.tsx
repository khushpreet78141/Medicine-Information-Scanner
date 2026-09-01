
//"use client"
//import { HtmlContext } from 'next/dist/shared/lib/html-context.shared-runtime'
//import React, { useRef } from 'react'
//import Image from 'next/image'
//import axios from "axios";
//import { useState } from 'react'

//const Upload = () => {

//  const videoRef = useRef<HTMLVideoElement>(null);
//  const streamRef = useRef<MediaStream | null>(null);
//  const canvasRef = useRef<HTMLCanvasElement>(null);
//  let width = 400;
//  let height = 400;
//  const [video, setVideo] = useState(false);
//  const [showPreview, setShowPreview] = useState(false);
//  const [capturedImage, setCapturedImage] = useState<File | null>(null);
//  const [previewUrl, setPreviewUrl] = useState<string>("");
//  const [analysis, setAnalysis] = useState("");


//  const handleCapture = async () => {
//    setVideo(true)
//    navigator.mediaDevices
//      .getUserMedia({ video: true, audio: false })
//      .then(async (stream) => {
//        streamRef.current = stream;
//        if (videoRef.current) {
//          videoRef.current.srcObject = stream;
//          await videoRef.current.play();
//        }
//      })
//      .catch((err) => {
//        console.error(`An error occurred: ${err}`);
//      });

//  }
//  const streaming = useRef(false);

//  const handleSelectFile = (
//  e: React.ChangeEvent<HTMLInputElement>
//) => {

//  const file = e.target.files?.[0];
//  if (!file) return;
//  const imageUrl = URL.createObjectURL(file);
//  setCapturedImage(file)
  
//  setPreviewUrl(imageUrl)
//  setShowPreview(true);
  
//};

//  const handleVideoListener = () => {
//    if (!canvasRef.current || !videoRef.current) return;

//    if (!streaming.current) {

//      height = videoRef.current.videoHeight / (videoRef.current.videoWidth / width);
//videoRef.current.width = width;
//videoRef.current.height = height;

//canvasRef.current.width = width;
//canvasRef.current.height = height;
//      streaming.current = true;

//    }
//  }




//  const handleStartButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
//    takePicture();
//    ev.preventDefault();
//  }

//  const handlePreview = () => {

//    setShowPreview(true);
//  }
//  function takePicture() {
//    if (!canvasRef.current || !videoRef.current) return;

//    const context = canvasRef.current.getContext("2d");
//    if (!context) return;
//    if (width && height) {
//      canvasRef.current.width = width;
//      canvasRef.current.height = height;
//      context.drawImage(videoRef.current, 0, 0, width, height);

//      //const data = canvasRef.current.toDataURL("image/png");
//      canvasRef.current?.toBlob((blob) => {
//  if (!blob) return;

//  const file = new File([blob], "captured-image.png", {
//    type: "image/png",
//  });

//  setCapturedImage(file);

//  const url = URL.createObjectURL(file);
//  setPreviewUrl(url);
//});
      
//    } else {
//      //clearPhoto();
//    }
//  }

//  const handleStopScanning = () => {
//    if (streamRef.current) {
//      streamRef.current.getTracks().forEach((track) => {
//        track.stop();
//      });
//      streamRef.current = null;
//    }
//    if (videoRef.current) {
//      videoRef.current.srcObject = null;
//    }
//    setVideo(false);
//  };

//  const handleCallGeminiApi = async()=>{
//    const formData = new FormData();
//    if(!capturedImage) return;
//  formData.append("image", capturedImage);

//      const res = await axios.post("/api/uploadToGemini",formData,{
//      headers: {
//        "Content-Type": "multipart/form-data",
//      },
//    }
//  );

//  console.log(res.data.result);
//  setAnalysis(res.data.result); 

//  console.log("Calling Gemini API ",res.data.result);
  
//  }
//1
  
//return (
//  <>
//    <div className='bg-blue-900 h-15 text-white text-center p-3 font-bold text-2xl'>
//      <h1>Identify medicines and understand their usage through AI image analysis</h1>
//    </div>
//    <div className='flex justify-center items-center gap-30 mt-20'>
//      <div className='flex flex-col justify-end items-center gap-5 '>
//        <h1 className='text-blue-700 text-2xl font-bold'>Upload Image</h1>
//        <div className='border-dashed  rounded-lg border-3 border-gray-400 w-80 h-40  flex overflow-y-scroll text-gray-500 ml-8 pl-13 items-center'>
//          <input type="file" accept='image/*' onChange={handleSelectFile} />
//        </div>
//      </div>

//      <div className=' flex items-center flex-col gap-3 '>
//        <h2 className='text-blue-700 text-2xl font-bold'>Scan Image</h2>
//        <div className='w-80 relative h-[240px] object-cover border-3 border border-gray-400 rounded-lg flex items-center justify-center'>
//          <button onClick={handleCapture} className='bg-blue-700 text-white p-2 font-bold rounded-2xl px-6 '>Capture</button>
//          {video && <div className='absolute z-10 top-0'><video ref={videoRef} onCanPlay={handleVideoListener} autoPlay></video>
//            <div className='mt-5 flex items-center justify-center gap-5'> <button onClick={handleStartButton} className='bg-green-600 text-white font-bold text-sm p-2 rounded-2xl'>Take Snapshot</button>
//              <button className='bg-blue-600 text-white font-bold text-sm p-2 rounded-2xl' onClick={handlePreview}>Preview</button></div>
//          </div>
//          }
//        </div>
//      </div>
//    </div>
//    {video && <button className='bg-red-700 text-white absolute top-40 right-20 p-2 rounded-2xl cursor-pointer hover:bg-red-800' onClick={handleStopScanning}>Stop Scanning</button>}
//    <div>
      
//      <canvas ref={canvasRef} className="hidden"></canvas>

//      {showPreview && previewUrl && (
//        <>
//          <div className='ml-90 mt-30 flex gap-32 items-start'>
//            <Image
//              src={previewUrl}
//              alt="Captured Image"
//              className="rounded-lg border"
//              width={320}
//              height={320}
//            />
//           {analysis ? <div>
//      {/*{analysis && <>*/}
//      <div className='bg-green-700 absolute w-[550px] min-h-30 p-5 right-12 mt-18 text-white rounded-2xl'>
//        hii
//        {analysis}</div>
//        {/*</>}*/}
//    </div>: <button className='bg-blue-700 p-2 text-white text-lg rounded-2xl' onClick={handleCallGeminiApi}>Start Analyzing </button>} 
//          </div>
//        </>
//      )}
//    </div>
//  </>
//)
//}

//export default Upload


"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";

const Upload = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streaming = useRef(false);

  let width = 400;
  let height = 400;

  const [video, setVideo] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [analysis, setAnalysis] = useState("");

  const handleCapture = async () => {
    setVideo(true);

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
        console.error("Camera error:", err);
        setVideo(false);
      });
  };

  const handleSelectFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setCapturedImage(file);
    setPreviewUrl(imageUrl);
    setShowPreview(true);
    setAnalysis("");
  };

  const handleVideoListener = () => {
    if (!canvasRef.current || !videoRef.current) return;

    if (!streaming.current) {
      height =
        videoRef.current.videoHeight /
        (videoRef.current.videoWidth / width);
      videoRef.current.width = width;
      videoRef.current.height = height;

      canvasRef.current.width = width;
      canvasRef.current.height = height;

      streaming.current = true;
    }
  };

  const handleStartButton = (
    ev: React.MouseEvent<HTMLButtonElement>
  ) => {
    ev.preventDefault();
    takePicture();
  };

  function takePicture() {
    if (!canvasRef.current || !videoRef.current) return;

    const context = canvasRef.current.getContext("2d");

    if (!context) return;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    context.drawImage(
      videoRef.current,
      0,
      0,
      width,
      height
    );

    canvasRef.current.toBlob((blob) => {
      if (!blob) return;

      const file = new File(
        [blob],
        "captured-image.png",
        {
          type: "image/png",
        }
      );

      setCapturedImage(file);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowPreview(true);
      setAnalysis("");
    });
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

    streaming.current = false;
    setVideo(false);
  };

  const handleCallGeminiApi = async () => {
    if (!capturedImage) return;
    console.log("Handle Gemini API Called....")
    try {
      const formData = new FormData();

      formData.append("image", capturedImage);

      const res = await axios.post(
        "/api/uploadToGemini",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAnalysis(res.data.result);
      console.log("AI result data comes ",res.data.result);
    } catch (error) {
      console.error("Analysis error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold">
              M
            </div>

            <div>
              <h1 className="text-xl font-semibold">
                Medicine Scanner
              </h1>

              <p className="text-sm text-gray-500">
                Identify medicines and understand their usage
              </p>
            </div>
          </div>
        </div>
      </header>


      {/* Main */}
      <section className="max-w-6xl mx-auto px-6 py-12">

        {/* Page heading */}
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900">
            Scan a medicine
          </h2>

          <p className="mt-2 text-gray-500">
            Upload a clear photo of the medicine package or
            scan it using your camera.
          </p>
        </div>


        {/* Upload / Camera */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Upload Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-7">

            <div className="mb-6">
              <h3 className="text-lg font-semibold">
                Upload image
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Choose an image from your device.
              </p>
            </div>

            <label className="block cursor-pointer">

              <div className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50/30 transition">

                <div className="text-gray-400 text-3xl mb-3">
                  ↑
                </div>

                <p className="text-sm font-medium text-gray-700">
                  Choose an image
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG or JPEG
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSelectFile}
                  className="hidden"
                />

              </div>

            </label>
          </div>


          {/* Camera Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-7">

            <div className="mb-6">
              <h3 className="text-lg font-semibold">
                Scan with camera
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Use your device camera to capture the medicine.
              </p>
            </div>

            <div className="relative h-48 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">

              {!video && (
                <button
                  onClick={handleCapture}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
                >
                  Open Camera
                </button>
              )}

              {video && (
                <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">

                  <video
                    ref={videoRef}
                    onCanPlay={handleVideoListener}
                    autoPlay
                    className="w-full h-full object-cover absolute"
                  />
                  
                  <div className="absolute bottom-3 flex gap-2">

                    <button
                      onClick={handleStartButton}
                      className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium shadow"
                    >
                      Take Snapshot
                    </button>

                    <button
                      onClick={handleStopScanning}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Stop
                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>


        {/* Hidden Canvas */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />


        {/* Preview Section */}
        {showPreview && previewUrl && (

          <section className="mt-10">

            <div className="mb-5">

              <h3 className="text-xl font-semibold">
                Selected image
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Review the image before starting the analysis.
              </p>

            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Image */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">

                <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">

                  <Image
                    src={previewUrl}
                    alt="Selected medicine"
                    fill
                    className="object-contain"
                  />

                </div>

              </div>


              {/* Analysis */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">

                <div className="flex items-center justify-between mb-5">

                  <div>
                    <h3 className="text-lg font-semibold">
                      Medicine information
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      AI-assisted image analysis
                    </p>
                  </div>

                </div>


                {!analysis ? (

                  <div className="h-full min-h-60 flex flex-col items-center justify-center text-center">

                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 text-xl mb-4">
                      +
                    </div>

                    <p className="text-gray-600 text-sm mb-5">
                      Ready to identify the medicine in your image.
                    </p>

                    <button
                      onClick={handleCallGeminiApi}
                      className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
                    >
                      Analyze Image
                    </button>

                  </div>

                ) : (

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">

                    <p className="text-sm leading-6 text-gray-700 whitespace-pre-wrap">
                      {analysis}
                    </p>

                  </div>

                )}

              </div>

            </div>

          </section>

        )}

      </section>

    </main>
  );
};

export default Upload;



