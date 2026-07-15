"use client"

import Image from "next/image";
import Upload from "@/src/components/Upload";
import Search from "@/src/components/Search";
import Reminder from "@/src/components/Reminder";
import Login from "@/src/components/Login";
import Register from "@/src/components/Register";
import useServiceWorker from "@/src/hooks/useServiceWorker";
export default function Home() {
  useServiceWorker();
  return (
    
    <div className="">
        {/*<Upload/>*/}
        {/*<Search/>*/}
        {/*<Reminder/>*/}
        {/*<Login/>*/}
        <Register/>
        
    </div>
  );
}
