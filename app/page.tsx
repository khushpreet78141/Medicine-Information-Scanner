"use client"

import Image from "next/image";
import Upload from "@/src/components/Upload";
import Search from "@/src/components/Search";
import Reminder from "@/src/components/Reminder";
import useServiceWorker from "@/src/hooks/useServiceWorker";
export default function Home() {
  useServiceWorker();
  return (
    
    <div className="">
        {/*<Upload/>*/}
        {/*<Search/>*/}
        <Reminder/>
        
    </div>
  );
}
