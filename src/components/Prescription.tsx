import React from "react";
import { RiQrScan2Line, RiUploadCloud2Line } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import { IoCameraOutline, IoRefreshOutline } from "react-icons/io5";
import { useState, useRef } from "react";
const Prescription = () => {
  const [scanByCamera, setScanByCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streaming = useRef(false);
  let width = 400;
  let height = 400;
  const [video, setVideo] = useState(false);
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");


  const handleCapture = async () => {
    setVideo(true)
    setScanByCamera(true);
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

  const handleVideoListener = () => {
    if (!canvasRef.current || !videoRef.current) return;

    if (!streaming.current) {

      height = videoRef.current.videoHeight / (videoRef.current.videoWidth / width);
      videoRef.current.width = width;
      videoRef.current.height = height;

      canvasRef.current.width = width;
      canvasRef.current.height = height;
      streaming.current = true;

    }
  }

  const handleStartButton = (ev: React.MouseEvent<HTMLButtonElement>) => {

    takePicture();
    ev.preventDefault();

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

    const handleSelectFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
  
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setCapturedImage(file)
    
    setPreviewUrl(imageUrl)
   
    
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-gray-900">
          Prescription Scanner
        </h1>

        <p className="text-gray-500 mt-2">
          Upload your prescription and we'll extract the medicines for you.
        </p>
      </div>

      {/* STEP 1 + STEP 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CARD 1 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl  text-purple-600 flex items-center justify-center font-bold">
              1
            </div>

            <div>
              <h2 className="font-bold text-xl text-gray-900">
                Upload Prescription
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Upload a clear image of your prescription.
              </p>

            </div>
          </div>

          {/* Upload Area */}

          {video ? <><div ><video ref={videoRef} className="rounded-2xl" onCanPlay={handleVideoListener} autoPlay></video></div> <div className="mx-3 text-center mt-1 "><button className="bg-blue-950 text-white m-2 p-1 rounded-xl px-2" onClick={handleStartButton}>Take Snapshot</button> <button onClick={handleStopScanning} className="bg-blue-950 text-white m-2 p-1 rounded-xl px-2 ">Stop Scanning</button></div></> :

            <div className="border-2 border-dashed border-gray-300 rounded-2xl h-72 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">

              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <RiUploadCloud2Line className="text-purple-600 text-3xl" />
              </div>

              <h3 className="font-semibold text-gray-800">
                Upload your prescription
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG or JPEG
              </p>

              <input type="file" name="" id="" className="mt-5 px-4   py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition " onClick={handleSelectFile}/>

              {/*<button onClick={()=>setSelectFileOpen(true)} className="mt-5 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition">
              Choose Image
            </button>*/}
            </div>
          }

          {/* Camera */}
          <div className="flex justify-center mt-5">

            <button onClick={handleCapture} className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-100 transition">
              <IoCameraOutline className="text-xl" />
              Capture with Camera
            </button>

          </div>
        </div>


        {/* CARD 2 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl text-blue-600 flex items-center justify-center font-bold">
              2
            </div>

            <div>
              <h2 className="font-bold text-xl text-gray-900">
                Review Prescription
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Check your uploaded image before scanning.
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="border border-gray-200 rounded-2xl h-72 bg-gray-100 flex items-center justify-center">

            <div className="text-center text-gray-400">
              <RiUploadCloud2Line className="text-5xl mx-auto mb-3" />

              <p className="font-medium">
                Prescription preview
              </p>

              <p className="text-sm mt-1">
                Your uploaded image will appear here
              </p>

            </div>

          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-5">

            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition">
              <IoRefreshOutline />
              Retake
            </button>
              
              
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition">
              <RiQrScan2Line className="text-xl" />
              Scan & Analyze
            </button>

          </div>

        </div>

      </div>


      {/* STEP 3 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <div className="flex items-start gap-3">

            <div className="w-10 h-10 rounded-xl text-green-600 flex items-center justify-center font-bold">
              3
            </div>

            <div>
              <h2 className="font-bold text-xl text-gray-900">
                Extracted Medicines
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Review the information extracted from your prescription.
              </p>
            </div>

          </div>

          <span className="bg-green-100 text-green-700 rounded-full px-3 py-1.5 text-xs font-medium">
            ✓ All extracted
          </span>

        </div>


        {/* Warning */}
        <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-xl p-4 mt-6 text-sm">
          <strong>Review carefully:</strong> Please verify the extracted
          information before saving it. You can edit any details if needed.
        </div>


        {/* Medicine Card */}
        <div className="border border-gray-200 rounded-2xl p-5 mt-5 hover:shadow-sm transition">

          {/* Medicine Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Medicine
              </p>

              <h3 className="font-bold text-lg text-gray-900 mt-1">
                Medicine Name
              </h3>
            </div>

            <div className="flex items-center gap-3">

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                95% Confidence
              </span>

              <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                <AiFillEdit className="text-gray-600" />
              </button>

            </div>

          </div>


          {/* Medicine Details */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-6">

            <div>
              <p className="text-sm text-gray-500">
                Strength
              </p>

              <p className="font-medium text-gray-900 mt-1">
                500mg
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Dosage
              </p>

              <p className="font-medium text-gray-900 mt-1">
                1 tablet
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Frequency
              </p>

              <p className="font-medium text-gray-900 mt-1">
                Twice Daily
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Duration
              </p>

              <p className="font-medium text-gray-900 mt-1">
                5 Days
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Meal
              </p>

              <p className="font-medium text-gray-900 mt-1">
                After Food
              </p>
            </div>

          </div>

        </div>


        {/* Add another medicine */}
        <button className="mt-5 text-purple-600 font-medium text-sm hover:text-purple-700">
          + Add another medicine
        </button>
        {/* Bottom Action */}
        <div className="flex justify-end mt-6">
          <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition">
            Save Medicines
          </button>
        </div>

      </div>

    </div>
  );
};

export default Prescription;
