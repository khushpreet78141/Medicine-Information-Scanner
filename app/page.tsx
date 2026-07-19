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
  useEffect(() => {
    const getUserApi = async()=>{
       
  const {
  data: { user },
    } = await supabase.auth.getUser();
    if(user){
      setShowLogin(false);
    }
    }
    getUserApi();
  }, []);
 
  useServiceWorker();
    
  return (
    
    <div className="">
        {/*<Upload/>*/}
        {/*<Search/>*/}
        {!showLogin && <Reminder/>}
        {/*<Login/>*/}
        {showLogin && <Register/>}
        {/*<Register/>*/}

    </div>
  );
}
