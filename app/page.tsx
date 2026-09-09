//"use client"

//import Image from "next/image";
//import Upload from "@/src/components/Upload";
//import Search from "@/src/components/Search";
//import Reminder from "@/src/components/Reminder";
//import Login from "@/src/components/Login";
//import Register from "@/src/components/Register";
//import Prescription from "@/src/components/Prescription";
//import useServiceWorker from "@/src/hooks/useServiceWorker";
//import supabase from "@/src/lib/supabase";
//import History from "@/src/components/History";
//import { useState } from "react";
//import { useEffect } from "react";
//import { HeartPulse } from 'lucide-react';
//import { BriefcaseMedical } from 'lucide-react';
//import { ScanQrCode } from 'lucide-react';


//export default function Home() {
//  const [showLogin, setShowLogin] = useState(true);
//  const [loadingStateLogin, setLoadingStateLogin] = useState(false)
//  const [activeField, setActiveField] = useState("upload");
// useEffect(() => {
//  setLoadingStateLogin(true)
//  const {
//    data: { subscription },
//  } = supabase.auth.onAuthStateChange((event, session) => {
//    setShowLogin(!session);
    
//  });
//  setLoadingStateLogin(false)
//    console.log("Get user subscription API has been called....")

//  return () => subscription.unsubscribe();
//}, []);
 
//  useServiceWorker();
//  if(loadingStateLogin){
//    return <div className="text-3xl font-bold bg-blue-950 text-white ">Loading ....</div>
//  }

//  return (
    
//    <div className="relative">
//      <div className="bg-blue-950 fixed top-0 left-0 w-full text-white h-16 flex border-b border-white items-center justify-between gap-5 px-20"><div className="flex items-center gap-2 font-extrabold"><ScanQrCode />MEDSCAN</div><div className="flex items-center gap-5"><BriefcaseMedical /> Medicine Information Scanner , <HeartPulse />Stay healthy ... Live healthy ...</div></div>
//    <div className="flex">
//    <div className="leftSideBar w-80 min-h-screen p-7 bg-blue-950 border-r rounded-r-3xl flex flex-col gap-9 border-r fixed top-16 border-white">
//        <button
//            className={`border-b border-gray-400 hover:border-white p-2 text-center hover:text-white text-gray-400 ${
//                activeField === "upload" && "text-white border-white"
//            }`}
//            onClick={() => setActiveField("upload")}
//        >
//            Upload
//        </button>

//        <button
//            className={`border-b border-gray-400 hover:border-white p-2 text-center hover:text-white text-gray-400 ${
//                activeField === "search" && "text-white border-white"
//            }`}
//            onClick={() => setActiveField("search")}
//        >
//            Search
//        </button>

//        <button
//            className={`border-b border-gray-400 hover:border-white p-2 text-center hover:text-white text-gray-400 ${
//                activeField === "reminder" && "text-white border-white"
//            }`}
//            onClick={() => setActiveField("reminder")}
//        >
//            Reminder
//        </button>

//        <button
//            className={`border-b border-gray-400 hover:border-white p-2 text-center hover:text-white text-gray-400 ${
//                activeField === "prescription" && "text-white border-white"
//            }`}
//            onClick={() => setActiveField("prescription")}
//        >
//            Prescription Scanner
//        </button>

//        <button
//            className={`border-b border-gray-400 hover:border-white p-2 text-center hover:text-white text-gray-400 ${
//                activeField === "history" && "text-white border-white"
//            }`}
//            onClick={() => setActiveField("history")}
//        >
//            History
//        </button>
//    </div>

//    <div className="flex-1 ml-80 pt-20">
//        {activeField === "upload" && <Upload />}
//        {activeField === "search" && <Search />}
//        {activeField === "reminder" && <Reminder />}
//        {activeField === "prescription" && <Prescription/>}
//        {activeField === "history" && <History/>}
//    </div>
//</div>

//        {/*<Upload/>
//        <Search/>*/}
//      {/*{showLogin ? <Login/> : <Reminder/>}*/}
//        {/*<Login/>*/}
//        {/*<Register/>*/}
//    </div>
//  );
//}



"use client";

import Upload from "@/src/components/Upload";
import Search from "@/src/components/Search";
import Reminder from "@/src/components/Reminder";
import Prescription from "@/src/components/Prescription";
import History from "@/src/components/History";
import Login from "@/src/components/Login";
import Register from "@/src/components/Register";

import useServiceWorker from "@/src/hooks/useServiceWorker";

import { useState } from "react";
import {
  HeartPulse,
  BriefcaseMedical,
  ScanQrCode,
  UploadCloud,
  Search as SearchIcon,
  Bell,
  FileText,
  History as HistoryIcon,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const [showLogin, setShowLogin] = useState(true);
  const [loadingStateLogin, setLoadingStateLogin] = useState(false);
  const [activeField, setActiveField] = useState("upload");
  // useEffect(() => {
//  setLoadingStateLogin(true)
//  const {
//    data: { subscription },
//  } = supabase.auth.onAuthStateChange((event, session) => {
//    setShowLogin(!session);
    
//  });
//  setLoadingStateLogin(false)
//    console.log("Get user subscription API has been called....")

//  return () => subscription.unsubscribe();
//}, []);
 

  useServiceWorker();

  const navigation = [
    {
      id: "upload",
      label: "Scan Medicine",
      description: "Identify a medicine",
      icon: UploadCloud,
    },
    {
      id: "search",
      label: "Search",
      description: "Find medicine information",
      icon: SearchIcon,
    },
    {
      id: "reminder",
      label: "Reminders",
      description: "Manage your medicines",
      icon: Bell,
    },
    {
      id: "prescription",
      label: "Prescription",
      description: "Read your prescription",
      icon: FileText,
    },
    {
      id: "history",
      label: "History",
      description: "View previous scans",
      icon: HistoryIcon,
    },
  ];

  if (loadingStateLogin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading MEDSCAN...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-white border-b border-slate-200">
        <div className="h-full px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center shadow-sm">
              <ScanQrCode size={22} className="text-white" />
            </div>

            <div>
              <h1 className="font-bold text-slate-900 tracking-tight">
                MEDSCAN
              </h1>

              <p className="text-[11px] text-slate-500">
                Medicine information
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-slate-500">
            <div className="flex items-center gap-2">
              <HeartPulse size={18} className="text-blue-600" />
              <span className="text-sm">
                Take control of your medication
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-50 border border-emerald-100">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">
                Your health matters
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-700">
                M
              </span>
            </div>
          </div>
        </div>
      </header>

      <aside className="fixed top-[72px] left-0 bottom-0 z-40 w-[280px] bg-white border-r border-slate-200">
        <div className="h-full flex flex-col">
          <div className="px-6 pt-7 pb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Workspace
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Everything you need to understand and manage your medicines.
            </p>
          </div>

          <nav className="px-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeField === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveField(item.id)}
                  className={`w-full group flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                      isActive
                        ? "bg-blue-700 text-white shadow-sm"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    }`}
                  >
                    <Icon size={19} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        isActive
                          ? "text-blue-700"
                          : "text-slate-700"
                      }`}
                    >
                      {item.label}
                    </p>

                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {item.description}
                    </p>
                  </div>

                  {isActive && (
                    <ChevronRight
                      size={16}
                      className="text-blue-500"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto p-4">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BriefcaseMedical
                    size={15}
                    className="text-blue-700"
                  />
                </div>

                <span className="text-xs font-semibold text-slate-700">
                  MEDSCAN
                </span>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-500">
                Keep your medicine information organized and easy to
                understand.
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-[280px] pt-[72px] min-h-screen">
        <div className="p-6 lg:p-10 max-w-[1500px]">
          {activeField === "upload" && <Upload />}
          {activeField === "search" && <Search />}
          {activeField === "reminder" && <Reminder />}
          {activeField === "prescription" && <Prescription />}
          {activeField === "history" && <History />}
        </div>
      </main>
    </div>
  );
}



