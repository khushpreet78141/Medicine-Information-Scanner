"use client"
import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { FaTablets } from "react-icons/fa";
import { MdAddAlarm } from "react-icons/md";
import supabase from '../lib/supabase';
import type { ChangeEvent } from "react";
import { User } from "@supabase/supabase-js";
import { IoIosAddCircleOutline } from "react-icons/io";
const Reminder = () => {

  const [formData, setFormData] = useState({
    medicine: "",
    quantity: "",
    frequency: "",
    meal: "",
    startingDate: "",
    endingDate: "",
    timing: [""],
  })

  const [addReminder, setAddReminder] = useState<Boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [times, setTimes] = useState([""])
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allStoredReminders, setAllStoredReminders] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null)
  useEffect(() => {
      const getUser = async()=>{
        const {
      data: { user },
    } = await supabase.auth.getUser();
      setCurrentUser(user)
      }
      getUser();
  }, [])
  
  const handleSubmit = async () => {
    setSubmitting(true)
    console.log("Handle Reminder Submit Called !!!")
    if (!formData.frequency || !formData.meal || !formData.quantity || !formData.timing || !formData.medicine || !formData.startingDate || !formData.endingDate) {
      setSubmitting(false);
      return;
    };
    if (!currentUser) {
      return "User not authenticated"
    }
    if(editingId){
      const { data: reminder, error } = await supabase.from("reminders").update({

      user_id: currentUser.id,
      quantity: formData.quantity,
      frequency: formData.frequency,
      meal: formData.meal,
      start_date: formData.startingDate,
      end_date: formData.endingDate,
      medicine_name: formData.medicine

    }).select().single();
    if (!reminder || error) {
      console.log("data insertion is failed!")
    }

    for (const time of formData.timing) {
      const { data, error } = await supabase
        .from("Reminder_Times")
        .update({
          time: time.trim(),
          reminder_id: reminder.id,
        });

      if (error) {
        console.log(error);
      }
    }
    setEditingId(null);

    }else{
         const { data: reminder, error } = await supabase.from("reminders").insert({

      user_id: currentUser.id,
      quantity: formData.quantity,
      frequency: formData.frequency,
      meal: formData.meal,
      start_date: formData.startingDate,
      end_date: formData.endingDate,
      medicine_name: formData.medicine

    }).select().single();
    if (!reminder || error) {
      console.log("data insertion is failed!")
    }

    for (const time of formData.timing) {
      const { data, error } = await supabase
        .from("Reminder_Times")
        .insert({
          time: time.trim(),
          reminder_id: reminder.id,
        });

      if (error) {
        console.log(error);
      }
    }
    setSubmitting(false);
    setAddReminder(false);

    }
   
    

  }

  const handleAddReminder = () => {
    setAddReminder(prev => !prev);
  }

  const [showNotifications, setShowNotifications] = useState(false);


  const showNotificationFunction = (e: ChangeEvent<HTMLInputElement>) => {
    setShowNotifications(e.target.checked);
    async function showNotification() {
      const result = await Notification.requestPermission();

      if (result === "granted") {
        const serviceWorkerRegistration = await navigator.serviceWorker.ready;

        serviceWorkerRegistration.showNotification("Vibration Sample", {
          body: "Buzz! Buzz!",
          icon: "../images/touch/chrome-touch-icon-192x192.png",
          //vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: "vibration-sample",
        });

        // Get a PushSubscription object
        const pushSubscription =
          await serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY });
        console.log("pushSubscription", pushSubscription);

        const res = await axios.post("/api/pushSubscription", { pushSubscription });
        console.log(res.data);

      }
    }
    if (e.target.checked) {
      showNotification();
    }
  }
  if (submitting) {
    return <div className='text-blue-950 w-full min-h-screen text-2xl font-bold flex items-center justify-center'>
      Loading State Submitting .......</div>
  }
  const addMoreTimes = () => {

    setFormData((prev) => ({
      ...prev,
      timing: [...prev.timing, ""],
    }));

    //setFormData({...formData,timing:[...formData.timing,""]});
  
  }
  

  useEffect(() => {
    const getAllReminders = async () => {
      if(!currentUser) return;
      const { data: allReminders, error: allReminderError } = await supabase.from("reminders").select(`
    *,
    Reminder_Times (
      time
    )
  `).eq("user_id", currentUser.id);

        console.log("Reminder all log",allReminders);
      if(!allReminders){ 
        return 
      }
      if(!allReminderError ){
        setAllStoredReminders(allReminders);
      }

    }
    getAllReminders();
    
  }, [currentUser])

  const handleEdit = async(id:number)=>{
    if(!id){
      return
    }
    const {data:editReminder,error:editReminderError} = await supabase.from("reminders").select(`*, Reminder_Times (
      time
    )`).eq("id",id).single();
    
    if(!editReminder){
      return;
    }

    setAddReminder(true);
    setFormData({
  medicine: editReminder.medicine_name,
  quantity: editReminder.quantity,
  frequency: editReminder.frequency,
  meal: editReminder.meal,
  startingDate: editReminder.start_date,
  endingDate: editReminder.end_date,
  timing: editReminder.Reminder_Times.map((item:{time:string}) => item.time),
})
setEditingId(id);
  }

  const handlePause = async(id:number)=>{
      const {error:pausedError} = await supabase.from("reminders").update({is_paused:true}).eq("id",id)
      if(pausedError){
        console.log(pausedError);
      }
      setAllStoredReminders((prev)=>prev.map((item)=>(item.id===id ? {...item,is_paused:true}:item)));
  }

  const handleResume = async(id:number)=>{
    const {error:resumedError} = await supabase.from("reminders").update({is_paused:false}).eq("id",id);;
    if(resumedError){
      console.log(resumedError);
    }
    setAllStoredReminders((prev)=>prev.map((item)=>(item.id === id ? {...item,is_paused:false}:item)));
  }

  const handleDelete = async(id:number)=>{
     const { error: timeError } = await supabase
    .from("Reminder_Times")
    .delete()
    .eq("reminder_id", id);

  if (timeError) {
    console.log(timeError);
    return;
  }

    const {error:deleteError} = await supabase.from("reminders").delete().eq("id",id);
    if (deleteError) {
    console.log(deleteError);
    return;
  }
    setAllStoredReminders((prev)=>prev.filter((item)=>item.id!==id));
  }


  return (
    <div className="relative min-h-screen">
      <div className=' text-blue-950'>
        <h1 className='font-black font-bold text-4xl'>Reminders</h1>
        <p className='my-1 '>Daily Reminders , Weekly Reminders  , Monthly Reminders</p>
        <div className='ml-[800px] flex items-center gap-1 font-extrabold'><input type="checkbox" name="" id="" checked={showNotifications} onChange={showNotificationFunction} />Show Notifications</div>
        <button className='flex items-center min-w-4xl m-2 my-8 p-1 justify-center rounded-4xl bg-blue-950 text-white px-3 gap-5 text-2xl' onClick={handleAddReminder}> <MdAddAlarm />Add Reminder</button>
        {allStoredReminders.length === 0 && <h1 className='text-gray-600 font-bold text-center mt-40 text-2xl'>No Reminders Yet</h1>}
      <div className='flex overflow-auto ml-15 flex-wrap  gap-10 mt-10 p-5'> {allStoredReminders.length !== 0 && (
      
        allStoredReminders.map((item,index)=>(
        
          <div key={index} className='border border-gray-400 text-blue-950 w-max p-3 rounded-4xl relative hover:scale-105'>
          <h1 className='my-1 flex'><span className='flex items-center gap-2 text-xl font-bold'><FaTablets />{item.medicine_name}</span><span className='ml-4 mb-2 mr-0 text-sm text-gray-500'>{item.quantity}</span> {item.is_paused === true &&<span className='bg-green-200 rounded-2xl text-green-900 px-2 text-sm flex justify-end  items-center absolute right-3 '>Paused</span>}</h1>
          
          <div><h1>Time Intervals : </h1>{item.Reminder_Times.map((item2:{time:string})=>(
            <h2 key={item2.time} className='ml-4'>{item2.time}</h2> 

          ))}</div>
          

          <p className='mt-1'>Frequency : {item.frequency}</p>
          <div className='flex gap-3 mt-3'>
            <div className={`border border-gray-400 text-gray-500 rounded-4xl p-1 text-sm ${item.meal === "Before Meal" && "bg-blue-950 textwhite"}`}>Before Meal</div> 
            <div className={`border border-gray-400 text-gray-500 rounded-4xl p-1 text-sm ${item.meal === "After Meal" && "bg-blue-950 text-white"}`}>After Meal</div> 
            <div className={`border border-gray-400 text-gray-500 rounded-4xl p-1 text-sm ${item.meal === "With Meal" && "bg-blue-950 text-white"}`}>With Meal</div> 
          </div>
          <div className='flex gap-3 items-center justify-evenly mt-4'><button className='bg-black text-white px-5  rounded-3xl cursor-pointer ' onClick={()=>handleEdit(item.id)}>Edit</button>
          {item.is_paused === false ? <button className='bg-black text-white px-5 cursor-pointer rounded-3xl' onClick={()=>handlePause(item.id)}>Pause</button>:<button className='bg-black text-white px-5 cursor-pointer rounded-3xl' onClick={()=>handleResume(item.id)}>Resume</button>}
          
          <button className='bg-black text-white px-5 cursor-pointer rounded-3xl' onClick={()=>handleDelete(item.id)}>Delete</button></div>
        </div>
          
        ))
       )} </div>

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

                  <input type="text" className="outline-0 border border-gray-400 p-1  rounded-xl w-full" placeholder='Enter medicine name' onChange={(e) => setFormData({ ...formData, medicine: e.target.value.trim() })} />
                  <input type="text" className="outline-0 border border-gray-400 p-1 rounded-xl " placeholder='Enter quantity' onChange={(e) => setFormData({ ...formData, quantity: e.target.value.trim() })} />
                  <input type="text" className="outline-0 border border-gray-400 p-1  rounded-xl" placeholder='Frequency of medicine ex:once or twice' onChange={(e) => setFormData({ ...formData, frequency: e.target.value.trim() })} />
                  {/*<input type="text" className="outline-0 border border-gray-400 p-1  rounded-xl" placeholder='Before Meal/ After Meal / With Meal' onChange={(e) => setFormData({ ...formData, meal: e.target.value.trim() })} />*/}
                    <select name="meal" id="" className='outline-0 border border-gray-400 p-1  rounded-xl' onChange={(e) => setFormData({ ...formData, meal: e.target.value.trim() })}>
                      <option value="Before Meal">Before Meal</option>
                      <option value="With Meal">With Meal</option>
                      <option value="After Meal">After Meal</option>
                    </select>
                  <div className='outline-0 border border-gray-400 p-1  rounded-xl flex justify-evenly items-center'><span>Starting Date: </span><input type="date" className="outline-0 border border-gray-400 p-1  rounded-xl" placeholder='Starting Time' onChange={(e) => setFormData({ ...formData, startingDate: e.target.value.trim() })} /></div>
                  <div className='outline-0 border border-gray-400 p-1  rounded-xl flex justify-evenly items-center'><span>Ending Date: </span> <input type="date" className="outline-0 border border-gray-400 p-1  rounded-xl" placeholder='Ending Time' onChange={(e) => setFormData({ ...formData, endingDate: e.target.value.trim() })} /></div>
                  

                  <div className='ml-3 font-bold '>Set Time : </div>
                  {formData.timing.map((item, index) => (
                    <input key={index} type="time" className="outline-0 w-56 border ml-8 border-gray-400 p-1  rounded-xl" onChange={(e) => {
                      const updatedTimes = [...formData.timing];
                      updatedTimes[index] = e.target.value;

                      setFormData({
                        ...formData,
                        timing: updatedTimes,
                      });

                    }} />
                  ))}
                  
                  <button onClick={addMoreTimes} type='button' className='flex items-center justify-center bg-blue-900 text-white w-fit m-auto rounded-2xl p-1 px-6'><IoIosAddCircleOutline />Add more times</button>
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
