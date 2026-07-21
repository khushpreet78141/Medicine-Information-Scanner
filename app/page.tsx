"use client"

import Image from "next/image";
import Upload from "@/src/components/Upload";
import Search from "@/src/components/Search";
import Reminder from "@/src/components/Reminder";
import Login from "@/src/components/Login";
import Register from "@/src/components/Register";
import useServiceWorker from "@/src/hooks/useServiceWorker";
import supabase from "@/src/lib/supabase";
import { useState } from "react";
import { useEffect } from "react";

export default function Home() {
  const [showLogin, setShowLogin] = useState(true);
  const [loadingStateLogin, setLoadingStateLogin] = useState(false)

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
    return <div className="text-3xl font-bold bg-black text-white ">Loading ....</div>
  }
    
  return (
    
    <div className="">

        {/*<Upload/>*/}
        {/*<Search/>*/}
      
      {showLogin ? <Login/> : <Reminder/>}
        {/*<Login/>*/}
      
        {/*<Register/>*/}

    </div>
  );
}

