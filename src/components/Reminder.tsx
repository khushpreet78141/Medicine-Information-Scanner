"use client"
import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { FaTablets } from "react-icons/fa";
import { MdAddAlarm } from "react-icons/md";
const Reminder = () => {


  const [formData, setFormData] = useState({
  medicine: "",
  quantity: "",
  frequency: "",
  meal: "",
  startingDate:"",
  endingDate:"",
  timing: "",
})
  const [addReminder, setAddReminder] = useState<Boolean>(false)
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setSubmitting(true)
    if(!formData.frequency || !formData.meal || !formData.quantity || !formData.timing || !formData.medicine || !formData.startingDate || !formData.endingDate){
      return;
    };
    const res = await axios.post("/api/reminder",{formData});
    console.log(res.data);
    setSubmitting(false)
  }


  const handleAddReminder = () => {
    setAddReminder(prev => !prev);
  }

  const [showNotifications, setShowNotifications] = useState(true);
  

  return (
    <div className="relative min-h-screen">
      <div className='ml-72 mt-20'>
        <h1 className='font-black font-bold text-5xl'>Reminders</h1>
        <p>Daily Reminders , Weekly Reminders  , Monthly Reminders</p>
        <div className=''><input type="checkbox" name="" id="" checked={} onChange={setShowNotifications}/>Show Notifications</div>
        <button className='flex items-center min-w-4xl m-2 my-8 p-1 justify-center rounded-4xl bg-black text-white px-3 gap-5 text-2xl' onClick={handleAddReminder}> <MdAddAlarm />Add Reminder</button>
        <div className='border border-gray-400 w-max p-3 rounded-4xl'>
          <h1 className='my-1 flex'><span className='flex items-center gap-2 text-xl font-bold'><FaTablets />Paracetamol</span><span className='ml-4 mb-2 mr-0 text-sm text-gray-500'>500mg or tablets</span></h1>
          <div><h1>Time Intervals</h1><h2>8:00AM</h2>
            <h2>9:00PM</h2></div>
          <p className='mt-1'>Frequency : Twice</p>
          <div className='flex gap-3 mt-3'>
            <div className='border border-gray-400 text-gray-500 rounded-4xl p-1 text-sm'>Before Meal</div>
            <div className='border border-gray-400 text-gray-500 rounded-4xl p-1 text-sm'>After Meal</div>
            <div className='border border-gray-400 text-gray-500 rounded-4xl p-1 text-sm'>With Meal</div>
          </div>
          <div className='flex gap-3 items-center justify-evenly mt-4'><button className='bg-black text-white px-5  rounded-3xl cursor-pointer '>Edit</button><button className='bg-black text-white px-5 cursor-pointer rounded-3xl'>Pause</button><button className='bg-black text-white px-5 cursor-pointer rounded-3xl'>Delete</button></div>

        </div>


        {addReminder && (
          <> 
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm "
              onClick={() => setAddReminder(false)}
            ></div>
            {/* Popup Form */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none" >
              <div className="bg-white rounded-3xl shadow-2xl w-[500px] p-8 pointer-events-auto">

                <form action="post" onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }} className='flex flex-col gap-3 border border-black max-w-4xl rounded-3xl px-15 pt-5 '>

                  <input type="text" className="outline-0 border border-gray-400 p-1  rounded-xl w-full" placeholder='Enter medicine name' onChange={(e)=>setFormData({...formData,medicine:e.target.value.trim()})} />
                  <input type="text" className="outline-0 border border-gray-400 p-1 rounded-xl " placeholder='Enter quantity' onChange={(e)=>setFormData({...formData,quantity:e.target.value.trim()})} />
                  <input type="text" className="outline-0 border border-gray-400 p-1  rounded-xl" placeholder='Frequency of medicine ex:once or twice' onChange={(e)=>setFormData({...formData,frequency:e.target.value.trim()})} />
                  <input type="text" className="outline-0 border border-gray-400 p-1  rounded-xl" placeholder='Before Meal/ After Meal / With Meal' onChange={(e)=>setFormData({...formData,meal:e.target.value.trim()})} />
                  <div className='outline-0 border border-gray-400 p-1  rounded-xl flex justify-evenly items-center'><span>Starting Date: </span><input type="date" className="outline-0 border border-gray-400 p-1  rounded-xl" placeholder='Starting Time' onChange={(e)=>setFormData({...formData,startingDate:e.target.value.trim()})} /></div>
                  <div className='outline-0 border border-gray-400 p-1  rounded-xl flex justify-evenly items-center'><span>Ending Date: </span> <input type="date" className="outline-0 border border-gray-400 p-1  rounded-xl" placeholder='Ending Time' onChange={(e)=>setFormData({...formData,endingDate:e.target.value.trim()})} /></div>
                  <input type="text" className="outline-0 border border-gray-400 p-1  rounded-xl" placeholder='Timing : ex:9:00AM , 12:00PM ' onChange={(e)=>setFormData({...formData,timing:e.target.value.trim()})} />
                  <button type="submit" className='bg-black  text-white font-bold p-1 rounded-xl mb-3 disabled:bg-gray-700' disabled={submitting}>Save</button> 
                </form>      
              </div>  
            </div>  
          </>  
        )} 
                
      </div> 
    </div> 
  )
}

export default Reminder
