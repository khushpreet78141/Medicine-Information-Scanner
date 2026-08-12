"use client"

import Image from "next/image";
import Upload from "@/src/components/Upload";
import Search from "@/src/components/Search";
import Reminder from "@/src/components/Reminder";
import Login from "@/src/components/Login";
import Register from "@/src/components/Register";
import Prescription from "@/src/components/Prescription";
import useServiceWorker from "@/src/hooks/useServiceWorker";
import supabase from "@/src/lib/supabase";
import History from "@/src/components/History";
import { useState } from "react";
import { useEffect } from "react";
import { HeartPulse } from 'lucide-react';
import { BriefcaseMedical } from 'lucide-react';
import { ScanQrCode } from 'lucide-react';


export default function Home() {
  const [showLogin, setShowLogin] = useState(true);
  const [loadingStateLogin, setLoadingStateLogin] = useState(false)
  const [activeField, setActiveField] = useState("upload");
 useEffect(() => {
  setLoadingStateLogin(true)
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    setShowLogin(!session);
    
  });
  setLoadingStateLogin(false)
    console.log("Get user subscription API has been called....")

  return () => subscription.unsubscribe();
}, []);
 
  useServiceWorker();
  if(loadingStateLogin){
    return <div className="text-3xl font-bold bg-blue-950 text-white ">Loading ....</div>
  }

  return (
    
    <div className="">
      <div className="bg-blue-950 text-white h-16 flex border-b border-white items-center justify-between gap-5 px-20"><div className="flex items-center gap-2 font-extrabold"><ScanQrCode />MEDSCAN</div><div className="flex items-center gap-5"><BriefcaseMedical /> Medicine Information Scanner , <HeartPulse />Stay healthy ... Live healthy ...</div></div>
    <div className="flex">
    <div className="leftSideBar w-80 min-h-screen p-7 bg-blue-950 border-r rounded-r-3xl flex flex-col gap-9 border-r border-white">
        <button
            className={`border-b border-gray-400 hover:border-white p-2 text-center hover:text-white text-gray-400 ${
                activeField === "upload" && "text-white border-white"
            }`}
            onClick={() => setActiveField("upload")}
        >
            Upload
        </button>

        <button
            className={`border-b border-gray-400 hover:border-white p-2 text-center hover:text-white text-gray-400 ${
                activeField === "search" && "text-white border-white"
            }`}
            onClick={() => setActiveField("search")}
        >
            Search
        </button>

        <button
            className={`border-b border-gray-400 hover:border-white p-2 text-center hover:text-white text-gray-400 ${
                activeField === "reminder" && "text-white border-white"
            }`}
            onClick={() => setActiveField("reminder")}
        >
            Reminder
        </button>

        <button
            className={`border-b border-gray-400 hover:border-white p-2 text-center hover:text-white text-gray-400 ${
                activeField === "prescription" && "text-white border-white"
            }`}
            onClick={() => setActiveField("prescription")}
        >
            Prescription Scanner
        </button>

        <button
            className={`border-b border-gray-400 hover:border-white p-2 text-center hover:text-white text-gray-400 ${
                activeField === "history" && "text-white border-white"
            }`}
            onClick={() => setActiveField("history")}
        >
            History
        </button>
    </div>

    <div className="flex-1 min-h-screen   p-8">
        {activeField === "upload" && <Upload />}
        {activeField === "search" && <Search />}
        {activeField === "reminder" && <Reminder />}
        {activeField === "prescription" && <Prescription/>}
        {activeField === "history" && <History/>}
    </div>
</div>

        {/*<Upload/>
        <Search/>*/}
      {/*{showLogin ? <Login/> : <Reminder/>}*/}
        {/*<Login/>*/}
        {/*<Register/>*/}
    </div>
  );
}

