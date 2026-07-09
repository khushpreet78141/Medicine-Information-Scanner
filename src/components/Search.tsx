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

    const medicineData = [
        {
            name:"Amoxicillin",
            quantity:"500 mg. capsule",
            category:"Antibiotic",
            link:"link for that medicine"

        }
    ]

    const handleChangeSearch = (e)=>{
        setSearchInput(e.target.value.trim());
        
    }

    const handleSelectCategory = (item:String)=>{
        setSelectedCategory(item);

    }

    const handleRequestSearch = async(e)=>{
      if(e.key === 'Enter'){
          const res = await axios.get(`/api/medicineAPI/?name=${searchInput}`);
          console.log(res.data.result);
          medicineData.push(res.data.result);

      }
      
    }

    
  return (
    <div className='ml-72 '>
      <h1 className='mt-20 text-4xl font-bold'> Medicine Search </h1>
      <p className='mt-4 ml-1 text-gray-600'>Search by name, generic compound, or category</p>
      <input type="text" onKeyDown={handleRequestSearch} value={searchInput} className='w-4xl focus:outline-0 border border-gray-400 p-2 text-[20px] rounded-2xl mt-4' placeholder='🔍 e.g. Amoxicillin,paracetamol,antibiotic..' onChange={handleChangeSearch}/>
      <div className='flex gap-4 m-4'>
        {category.map((item,index)=>(
          <button onClick={()=>handleSelectCategory(item)} key={index} className={`border  p-1 px-3 border rounded-4xl text-gray-500 border-black ${selectedCategory === item && "bg-black text-white "}`}>{item}</button>
        ))}
      </div>
      <div>
         {medicineData.map((item,index)=>(
            <div key={index} className='max-w-96 max-h-56 border border-gray-400 rounded-2xl p-2 hover:transition-all hover:scale-103 hover:border-black hover:duration-200'>
               
            <div className='text-2xl m-1'><GiMedicines /></div>
            <h1 className='text-xl font-bold'>{item.name}</h1>
            <h2 className='text-[12px] text-gray-500'>{item.quantity}</h2>
            <h2  className='text-[12px] text-gray-500'>{item.category}</h2>
            <div className='m-1 '>{item.link}</div>
        </div>
         ))}
        
      </div>

    </div>
  )
}

export default Search
