"use client"
import React from 'react'
import { GiMedicines } from "react-icons/gi";
import { useState } from 'react';
import axios from 'axios';
const Search = () => {
    const [searchInput, setSearchInput] = useState<String>("")
    const [selectedCategory, setSelectedCategory] = useState<String>("")
    const category = [
        "All",
        "Antibiotic",
        "Antidiabetic",
        "Antihistamine",
        "Proton pump inhibitor",
        "Stalin"
    ]

    //const medicineData = [
    //    {
    //        name:"Amoxicillin",
    //        quantity:"500 mg. capsule",
    //        category:"Antibiotic",
    //        link:"link for that medicine"

    //    }
    //]
    const [medicineData, setMedicineData] = useState([{
           name:"Amoxicillin",
           quantity:"500 mg. capsule",
         category:"Antibiotic",
         uses:"kkf",
       
          side_effects:["fkf"]

        },
      {
           name:"Amoxicillin",
           quantity:"500 mg. capsule",
         category:"Antibiotic",
         uses:"kkf",
         
          side_effects:["fkf"]

        }])

    const handleChangeSearch = (e)=>{
        setSearchInput(e.target.value.trim());
        
    }

    const handleSelectCategory = (item:String)=>{
        setSelectedCategory(item);

    }

    const handleRequestSearch = async(e)=>{
      if(e.key === 'Enter'){
          const res = await axios.get(`/api/medicineAPI/?name=${searchInput}`);
          console.log(res.data.result.results);
          
         setMedicineData(res.data.result.results ?? []);

      }
      
    }

    
  return (
    <div className=' '>
      <h1 className=' text-4xl text-blue-950 font-bold'> Medicine Search </h1>
      <p className='mt-4 ml-1 text-gray-600'>Search by name, generic compound, or category</p>
      <input type="text" onKeyDown={handleRequestSearch} value={searchInput} className='w-4xl focus:outline-0 border border-gray-400 p-2 text-[20px] rounded-2xl mt-4' placeholder='🔍 e.g. Amoxicillin,paracetamol,antibiotic..' onChange={handleChangeSearch}/>
      <div className='flex gap-4 m-4'>
        {category.map((item,index)=>(
          <button onClick={()=>handleSelectCategory(item)} key={index} className={`border  p-1 px-3 border rounded-4xl text-gray-500 border-blue-950 ${selectedCategory === item && "bg-black text-white "}`}>{item}</button>
        ))}
      </div>
      <div className='flex gap-5 overflow-auto mt-5'>
         {medicineData.map((item,index)=>(
            <div key={index} className='max-w-96 min-h-60 border border-gray-400 rounded-2xl p-2 hover:transition-all hover:scale-103 hover:border-blue-950 hover:duration-200'>
               
            <div className='text-2xl m-1 text-blue-950 '><GiMedicines /></div>
            <h1 className='text-xl font-bold text-blue-950'>{item.name}</h1>
            <h2 className='text-[12px] text-gray-500'>{item.quantity}</h2>
            <h2  className='text-[12px] text-gray-500'>{item.category}</h2>
              <h2  className='text-[12px] text-gray-500'>{item.uses}</h2>
              <div  className='text-[12px] text-gray-500'>{item.side_effects.map((item,index)=>(
                <h2 key={index}>{item}</h2>
              ))}</div>
            
        </div>
         ))}
        
      </div>

    </div>
  )
}

export default Search
