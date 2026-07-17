"use client";

import Link from "next/link";
import { Pill, Activity } from "lucide-react";
import { useState } from "react";
import axios from "axios";
const Register = () => {
   const [registerData, setRegisterData] = useState({
      name:"",
      email:"",
      password:""
    });

    const [temporaryPass, setTemporaryPass] = useState("")

    const handleSubmit = async()=>{
      if(temporaryPass != registerData.password){
        console.log("Password Didn't match");
        return  
      }
      try{

        const res = await axios.post("/api/register",{registerData});
        console.log("frontend response for register",res.data.data);
      }catch(err){
        console.error("error",err);
      }
    }
    
    
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">

        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center px-12 py-16 border-r border-zinc-800">

          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8">
            <Pill className="text-black w-8 h-8" />
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight">
            Join
            <br />
            Medicine
            <br />
            Scanner
          </h1>

          <p className="text-zinc-400 mt-5 text-lg">
            Create your secure healthcare account.
          </p>

          <div className="mt-10">
            <Activity className="w-full h-10 text-white" strokeWidth={1.5} />
          </div>

          <p className="text-zinc-500 mt-6 text-sm leading-7">
            Save medicines, receive reminders, scan prescriptions,
            and manage your health information securely.
          </p>

        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center px-8 py-16">

          <div className="w-full max-w-md">

            <h2 className="text-3xl font-bold text-white">
              Create Account
            </h2>

            <p className="text-zinc-400 mt-2">
              Start your healthcare journey today.
            </p>

            <form className="mt-10 space-y-6" method="post" onSubmit={handleSubmit}>
              
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="John Doe"
                  onChange={(e)=>setRegisterData({...registerData,name:e.target.value})}
                  className="w-full bg-transparent border-b border-zinc-700 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-white transition"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="johndoe@example.com"
                  onChange={(e)=>setRegisterData({...registerData,email:e.target.value})}
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
                  onChange={(e)=>setTemporaryPass(e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-700 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-white transition"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  onChange={(e)=>setRegisterData({...registerData,password:e.target.value})}
                  className="w-full bg-transparent border-b border-zinc-700 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-white transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-zinc-200 transition duration-300"
              >
                Create Account
              </button>

            </form>

            <p className="text-center text-zinc-400 mt-8">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-white font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Register;
