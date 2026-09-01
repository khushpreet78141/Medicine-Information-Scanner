"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  RiQrScan2Line,
  RiUploadCloud2Line,
} from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import {
  IoCameraOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import axios from "axios";

interface Medicine {
  medicineName: string;
  explanation: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  meal: string;
}

const Prescription = () => {
  const [scanByCamera, setScanByCamera] = useState(false);
  const [video, setVideo] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streaming = useRef(false);

  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<Medicine[]>([]);

  const width = 400;
  const [height, setHeight] = useState(400);

 

  const handleCapture = async () => {
    try {
      setVideo(true);
      setScanByCamera(true);
      streaming.current = false;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);

      setVideo(false);
      setScanByCamera(false);
    }
  };

  const handleVideoListener = () => {
    if (!canvasRef.current || !videoRef.current) return;

    if (!streaming.current) {
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;

      if (!videoWidth || !videoHeight) return;

      const calculatedHeight =
        videoHeight / (videoWidth / width);

      setHeight(calculatedHeight);

      videoRef.current.width = width;
      videoRef.current.height = calculatedHeight;

      canvasRef.current.width = width;
      canvasRef.current.height = calculatedHeight;

      streaming.current = true;
    }
  };


  const handleStartButton = (
    ev: React.MouseEvent<HTMLButtonElement>
  ) => {
    ev.preventDefault();
    takePicture();
  };

  const takePicture = () => {
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
        "captured-prescription.png",
        {
          type: "image/png",
        }
      );

      setCapturedImage(file);

      // Remove old preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      stopCamera();
    }, "image/png");
  };



  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    streaming.current = false;

    setVideo(false);
    setScanByCamera(false);
  };

  const handleStopScanning = () => {
    stopCamera();
  };

  // --------------------------------------------------
  // FILE UPLOAD
  // --------------------------------------------------

  const handleSelectFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setCapturedImage(file);

    // Remove old preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const imageUrl = URL.createObjectURL(file);

    setPreviewUrl(imageUrl);

    // If camera was running, stop it
    stopCamera();
  };

  // --------------------------------------------------
  // RETAKE
  // --------------------------------------------------

  const handleRetake = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setCapturedImage(null);

    setAnalysis([]);

    handleCapture();
  };

  // --------------------------------------------------
  // GEMINI API
  // --------------------------------------------------

  const handleCallGeminiApi = async () => {
    if (!capturedImage) {
      alert("Please upload or capture a prescription first.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "prescriptionImage",
        capturedImage
      );

      const res = await axios.post(
        "/api/uploadForPrescription",
        formData
      );

      console.log(
        "Prescription analysis:",
        res.data.result
      );

      setAnalysis(res.data.result || []);
    } catch (error) {
      console.error(
        "Error analyzing prescription:",
        error
      );

      alert(
        "Something went wrong while analyzing the prescription."
      );
    }
  };



  useEffect(() => {
    return () => {
      // Stop camera when component unmounts
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }

      // Remove object URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);



  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-gray-900">
          Prescription Scanner
        </h1>

        <p className="text-gray-500 mt-2">
          Upload your prescription and we'll extract
          the medicines for you.
        </p>
      </div>

      {/* STEP 1 + STEP 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CARD 1 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

          <div className="flex items-start gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl text-purple-600 flex items-center justify-center font-bold">
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

          {/* UPLOAD / CAMERA AREA */}

          {video ? (
            <>
              <div className="flex justify-center">
                <video
                  ref={videoRef}
                  className="rounded-2xl w-full max-w-md"
                  onCanPlay={handleVideoListener}
                  autoPlay
                  playsInline
                />
              </div>

              <div className="mx-3 text-center mt-3">

                <button
                  className="bg-blue-950 text-white m-2 p-2 rounded-xl px-4"
                  onClick={handleStartButton}
                >
                  Take Snapshot
                </button>

                <button
                  onClick={handleStopScanning}
                  className="bg-gray-700 text-white m-2 p-2 rounded-xl px-4"
                >
                  Stop Scanning
                </button>

              </div>
            </>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-2xl h-72 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">

              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">

                <RiUploadCloud2Line className="text-blue-700 text-3xl" />

              </div>

              <h3 className="font-semibold text-gray-800">
                Upload your prescription
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG or JPEG
              </p>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="mt-5 px-4 py-2.5 bg-blue-700 text-white rounded-xl font-medium hover:bg-purple-700 transition"
                onChange={handleSelectFile}
              />

            </div>
          )}

          {/* CAMERA BUTTON */}

          <div className="flex justify-center mt-5">

            <button
              onClick={handleCapture}
              disabled={video}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-100 transition disabled:opacity-50"
            >
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

          {/* PREVIEW */}

          <div className="border border-gray-200 rounded-2xl h-72 bg-gray-100 flex items-center justify-center overflow-hidden">

            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Scanned prescription"
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            ) : (
              <div className="text-center text-gray-400">

                <RiUploadCloud2Line className="text-5xl mx-auto mb-3" />

                <p className="font-medium">
                  Prescription preview
                </p>

                <p className="text-sm mt-1">
                  Your uploaded image will appear here
                </p>

              </div>
            )}

          </div>

          {/* Hidden canvas */}

          <canvas
            ref={canvasRef}
            className="hidden"
          />

          {/* ACTIONS */}

          <div className="flex gap-3 mt-5">

            <button
              onClick={handleRetake}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
            >
              <IoRefreshOutline />
              Retake
            </button>

            <button
              onClick={handleCallGeminiApi}
              disabled={!capturedImage}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RiQrScan2Line className="text-xl" />
              Scan & Analyze
            </button>

          </div>

        </div>

      </div>

      {/* STEP 3 */}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-6">

        {/* HEADER */}

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

          {analysis.length > 0 && (
            <span className="bg-green-100 text-green-700 rounded-full px-3 py-1.5 text-xs font-medium">
              ✓ All extracted
            </span>
          )}

        </div>

        {/* WARNING */}

        <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-xl p-4 mt-6 text-sm">

          <strong>Review carefully:</strong>{" "}
          Please verify the extracted information before
          saving it. You can edit any details if needed.

        </div>

        {/* MEDICINES */}

        {analysis.length > 0 ? (
          analysis.map((item, index) => (

            <div
              key={index}
              className="border border-gray-200 rounded-2xl p-5 mt-5 hover:shadow-sm transition"
            >

              {/* MEDICINE HEADER */}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                <div>

                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Medicine
                  </p>

                  <h3 className="font-bold text-lg text-gray-900 mt-1">
                    {item.medicineName || "Unknown medicine"}
                  </h3>

                </div>

                <div className="flex items-center gap-3">

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    Extracted
                  </span>

                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                    type="button"
                  >
                    <AiFillEdit className="text-gray-600" />
                  </button>

                </div>

              </div>

              {/* EXPLANATION */}

              <div className="mt-5">

                <p className="text-sm text-gray-500">
                  Explanation
                </p>

                <p className="text-gray-800 mt-1">
                  {item.explanation || "No explanation available."}
                </p>

              </div>

              {/* MEDICINE DETAILS */}

              <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-6">

                {/* STRENGTH */}

                <div>
                  <p className="text-sm text-gray-500">
                    Strength
                  </p>

                  <p className="font-medium text-gray-900 mt-1">
                    {item.strength || "Not specified"}
                  </p>
                </div>

                {/* DOSAGE */}

                <div>
                  <p className="text-sm text-gray-500">
                    Dosage
                  </p>

                  <p className="font-medium text-gray-900 mt-1">
                    {item.dosage || "Not specified"}
                  </p>
                </div>

                {/* FREQUENCY */}

                <div>
                  <p className="text-sm text-gray-500">
                    Frequency
                  </p>

                  <p className="font-medium text-gray-900 mt-1">
                    {item.frequency || "Not specified"}
                  </p>
                </div>

                {/* DURATION */}

                <div>
                  <p className="text-sm text-gray-500">
                    Duration
                  </p>

                  <p className="font-medium text-gray-900 mt-1">
                    {item.duration || "Not specified"}
                  </p>
                </div>

                {/* MEAL */}

                <div>
                  <p className="text-sm text-gray-500">
                    Meal
                  </p>

                  <p className="font-medium text-gray-900 mt-1">
                    {item.meal || "Not specified"}
                  </p>
                </div>

              </div>

            </div>

          ))
        ) : (
          <div className="text-center py-12 text-gray-400">
            <RiQrScan2Line className="text-5xl mx-auto mb-3" />

            <p className="font-medium">
              No medicines extracted yet
            </p>

            <p className="text-sm mt-1">
              Upload a prescription and click
              "Scan & Analyze".
            </p>
          </div>
        )}

        {/* ADD ANOTHER MEDICINE */}

        {analysis.length > 0 && (
          <button
            type="button"
            className="mt-5 text-purple-600 font-medium text-sm hover:text-purple-700"
          >
            + Add another medicine
          </button>
        )}

        {/* SAVE */}

        {analysis.length > 0 && (
          <div className="flex justify-end mt-6">

            <button
              type="button"
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
            >
              Save Medicines
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default Prescription;