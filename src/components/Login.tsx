"use client";

import Link from "next/link";
import { Pill, Activity } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export default function Login() {

  const [loginData, setLoginData] = useState({
    email:"",
    password:""
  })

  const handleSubmit = async()=>{
    try{
      const res = await axios.post("/api/login",{loginData});
      console.log("Logged in User",res.data.data)
    }catch(error){
      console.error("Error ",error)
    }
      
  }


  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">

        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center px-12 py-16 border-r border-zinc-800">

          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8">
            <Pill className="text-black w-8 h-8" />
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight">
            Medicine
            <br />
            Information
            <br />
            Scanner
          </h1>

          <p className="text-zinc-400 mt-5 text-lg">
            Scan. Understand. Stay Healthy.
          </p>

          {/* ECG Line */}
          <div className="mt-10">
            <Activity className="w-full h-10 text-white" strokeWidth={1.5} />
          </div>

          <p className="text-zinc-500 mt-6 text-sm leading-7">
            Securely manage your medicines, reminders, and health information
            in one place.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center px-8 py-16">

          <div className="w-full max-w-md">

            <h2 className="text-3xl font-bold text-white">
              Welcome Back
            </h2>

            <p className="text-zinc-400 mt-2">
              Sign in to continue.
            </p>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>

              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  onChange={(e)=>setLoginData({...loginData,email:e.target.value})}
                  placeholder="johndoe@example.com"
                  className="w-full bg-transparent border-b border-zinc-700 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-white transition"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  onChange={(e)=>setLoginData({...loginData,password:e.target.value})}
                  className="w-full bg-transparent border-b border-zinc-700 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-white transition"
                />
              </div>

              <button
                className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-zinc-200 transition duration-300"
              >
                Secure Login
              </button>
            </form>

            <p className="text-center text-zinc-400 mt-8">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-white font-semibold hover:underline"
              >
                Register
              </Link>
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}
