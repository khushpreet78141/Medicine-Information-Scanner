
"use client";

import React from "react";
import { useState } from "react";
import axios from "axios";
import {
  Search as SearchIcon,
  Pill,
  AlertCircle,
  CircleCheck,
} from "lucide-react";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [showSearching, setShowSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const category = [
    "All",
    "Antibiotic",
    "Antidiabetic",
    "Antihistamine",
    "Proton pump inhibitor",
    "Stalin",
  ];

  const [medicineData, setMedicineData] = useState([
    {
      name: "Amoxicillin",
      quantity: "500 mg. capsule",
      category: "Antibiotic",
      uses: "Used to treat bacterial infections.",
      side_effects: ["Nausea", "Diarrhea"],
    },
    {
      name: "Amoxicillin",
      quantity: "500 mg. capsule",
      category: "Antibiotic",
      uses: "Used to treat bacterial infections.",
      side_effects: ["Nausea", "Diarrhea"],
    },
  ]);

  const handleChangeSearch = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInput(e.target.value);
  };

  const handleSelectCategory = (item: string) => {
    setSelectedCategory(item);
  };

  const handleRequestSearch = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && searchInput.trim()) {
      setShowSearching(true);

      try {
        const res = await axios.get(
          `/api/medicineAPI/?name=${searchInput.trim()}`
        );

        console.log(res.data.result.results);

        setMedicineData(res.data.result.results ?? []);
      } catch (error) {
        console.error("Medicine search failed:", error);
        setMedicineData([]);
      } finally {
        setShowSearching(false);
      }
    }
  };

  const filteredMedicines =
    selectedCategory === "All"
      ? medicineData
      : medicineData.filter(
          (item) => item.category === selectedCategory
        );

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">

        <div className="mb-8">

          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <Pill size={18} className="text-blue-700" />
            </div>

            <span className="text-sm font-semibold text-blue-700">
              Medicine library
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
            Medicine Search
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Search for medicine names, generic compounds, or categories.
          </p>

        </div>


        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

          <div className="relative">

            <SearchIcon
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={searchInput}
              onKeyDown={handleRequestSearch}
              onChange={handleChangeSearch}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 transition"
              placeholder="Search Amoxicillin, Paracetamol, antibiotic..."
            />

          </div>


          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">

            {category.map((item) => {

              const isSelected = selectedCategory === item;

              return (
                <button
                  onClick={() => handleSelectCategory(item)}
                  key={item}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold border transition ${
                    isSelected
                      ? "bg-blue-700 border-blue-700 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-700"
                  }`}
                >
                  {item}
                </button>
              );
            })}

          </div>

        </div>


        <div className="flex items-center justify-between mt-8 mb-4">

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Medicine Information
            </h2>

            {!showSearching && (
              <p className="text-xs text-slate-400 mt-1">
                {filteredMedicines.length} medicine
                {filteredMedicines.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>

        </div>


        {showSearching && (
          <div className="bg-white border border-slate-200 rounded-2xl min-h-[350px] flex items-center justify-center">

            <div className="text-center">

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <SearchIcon
                  size={22}
                  className="text-blue-700 animate-pulse"
                />
              </div>

              <p className="font-semibold text-slate-700">
                Searching medicines...
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Looking for reliable medicine information
              </p>

            </div>

          </div>
        )}


        {!showSearching && filteredMedicines.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl min-h-[350px] flex items-center justify-center">

            <div className="text-center max-w-sm">

              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle
                  size={25}
                  className="text-slate-400"
                />
              </div>

              <h3 className="font-bold text-slate-700">
                No medicines found
              </h3>

              <p className="text-sm text-slate-400 mt-2">
                Try searching with another medicine name or choose a
                different category.
              </p>

            </div>

          </div>
        )}


        {!showSearching && filteredMedicines.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {filteredMedicines.map((item, index) => (

              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200"
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Pill
                        size={21}
                        className="text-blue-700"
                      />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        {item.name}
                      </h3>

                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.quantity}
                      </p>
                    </div>

                  </div>

                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 whitespace-nowrap">
                    {item.category}
                  </span>

                </div>


                <div className="border-t border-slate-100 my-5" />


                <div className="mb-4">

                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                    Uses
                  </p>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.uses}
                  </p>

                </div>


                <div>

                  <div className="flex items-center gap-1.5 mb-2">

                    <AlertCircle
                      size={14}
                      className="text-amber-500"
                    />

                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Common side effects
                    </p>

                  </div>

                  <div className="space-y-1.5">

                    {item.side_effects.map(
                      (effect, effectIndex) => (
                        <div
                          key={effectIndex}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          {effect}
                        </div>
                      )
                    )}

                  </div>

                </div>


                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">

                  <CircleCheck
                    size={14}
                    className="text-emerald-500"
                  />

                  <span>
                    Information available
                  </span>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default Search;


