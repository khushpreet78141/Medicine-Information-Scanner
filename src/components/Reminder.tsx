
"use client";

import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { FaTablets } from "react-icons/fa";
import { MdAddAlarm } from "react-icons/md";
import supabase from "../lib/supabase";
import type { ChangeEvent } from "react";
import { User } from "@supabase/supabase-js";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
  Bell,
  Clock3,
  CalendarDays,
  Pencil,
  Pause,
  Play,
  Trash2,
  Plus,
  X,
} from "lucide-react";

const Reminder = () => {
  const [formData, setFormData] = useState({
    medicine: "",
    quantity: "",
    frequency: "",
    meal: "",
    startingDate: "",
    endingDate: "",
    timing: [""],
  });

  const [addReminder, setAddReminder] = useState<Boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allStoredReminders, setAllStoredReminders] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setCurrentUser(user);
    };

    getUser();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);

    if (
      !formData.frequency ||
      !formData.meal ||
      !formData.quantity ||
      !formData.timing ||
      !formData.medicine ||
      !formData.startingDate ||
      !formData.endingDate
    ) {
      setSubmitting(false);
      return;
    }

    if (!currentUser) {
      setSubmitting(false);
      return;
    }

    if (editingId) {
      const { data: reminder, error } = await supabase
        .from("reminders")
        .update({
          user_id: currentUser.id,
          quantity: formData.quantity,
          frequency: formData.frequency,
          meal: formData.meal,
          start_date: formData.startingDate,
          end_date: formData.endingDate,
          medicine_name: formData.medicine,
        })
        .eq("id", editingId)
        .select()
        .single();

      if (!reminder || error) {
        setSubmitting(false);
        return;
      }

      for (const time of formData.timing) {
        const { error } = await supabase
          .from("Reminder_Times")
          .update({
            time: time.trim(),
            reminder_id: reminder.id,
          })
          .eq("reminder_id", reminder.id);

        if (error) {
          console.log(error);
        }
      }

      setEditingId(null);
    } else {
      const { data: reminder, error } = await supabase
        .from("reminders")
        .insert({
          user_id: currentUser.id,
          quantity: formData.quantity,
          frequency: formData.frequency,
          meal: formData.meal,
          start_date: formData.startingDate,
          end_date: formData.endingDate,
          medicine_name: formData.medicine,
        })
        .select()
        .single();

      if (!reminder || error) {
        setSubmitting(false);
        return;
      }

      for (const time of formData.timing) {
        const { error } = await supabase.from("Reminder_Times").insert({
          time: time.trim(),
          reminder_id: reminder.id,
        });

        if (error) {
          console.log(error);
        }
      }
    }

    setSubmitting(false);
    setAddReminder(false);

    const { data } = await supabase
      .from("reminders")
      .select(`
        *,
        Reminder_Times (
          time
        )
      `)
      .eq("user_id", currentUser.id);

    if (data) {
      setAllStoredReminders(data);
    }
  };

  const handleAddReminder = () => {
    setEditingId(null);

    setFormData({
      medicine: "",
      quantity: "",
      frequency: "",
      meal: "",
      startingDate: "",
      endingDate: "",
      timing: [""],
    });

    setAddReminder(true);
  };

  const showNotificationFunction = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setShowNotifications(e.target.checked);

    async function showNotification() {
      const result = await Notification.requestPermission();

      if (result === "granted") {
        const serviceWorkerRegistration =
          await navigator.serviceWorker.ready;

     const responseNotification =    serviceWorkerRegistration.showNotification(
          "MEDSCAN Reminder",
          {
            body: "Your medicine reminder notifications are enabled.",
            tag: "medscan-reminder",
          }
        );

        console.log("Response Notification",responseNotification);

        const pushSubscription =
          await serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:
              process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          });

        await axios.post("/api/pushSubscription", {
          pushSubscription,
        });
      }
    }

    if (e.target.checked) {
      showNotification();
    }
  };

  useEffect(() => {
    const getAllReminders = async () => {
      if (!currentUser) return;

      const { data: allReminders, error: allReminderError } =
        await supabase
          .from("reminders")
          .select(`
            *,
            Reminder_Times (
              time
            )
          `)
          .eq("user_id", currentUser.id);

      if (!allReminderError && allReminders) {
        setAllStoredReminders(allReminders);
      }
    };

    getAllReminders();
  }, [currentUser]);

  const handleEdit = async (id: number) => {
    const { data: editReminder } = await supabase
      .from("reminders")
      .select(`
        *,
        Reminder_Times (
          time
        )
      `)
      .eq("id", id)
      .single();

    if (!editReminder) return;

    setAddReminder(true);

    setFormData({
      medicine: editReminder.medicine_name,
      quantity: editReminder.quantity,
      frequency: editReminder.frequency,
      meal: editReminder.meal,
      startingDate: editReminder.start_date,
      endingDate: editReminder.end_date,
      timing: editReminder.Reminder_Times.map(
        (item: { time: string }) => item.time
      ),
    });

    setEditingId(id);
  };

  const handlePause = async (id: number) => {
    const { error } = await supabase
      .from("reminders")
      .update({ is_paused: true })
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    setAllStoredReminders((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_paused: true } : item
      )
    );
  };

  const handleResume = async (id: number) => {
    const { error } = await supabase
      .from("reminders")
      .update({ is_paused: false })
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    setAllStoredReminders((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_paused: false } : item
      )
    );
  };

  const handleDelete = async (id: number) => {
    const { error: timeError } = await supabase
      .from("Reminder_Times")
      .delete()
      .eq("reminder_id", id);

    if (timeError) {
      console.log(timeError);
      return;
    }

    const { error: deleteError } = await supabase
      .from("reminders")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.log(deleteError);
      return;
    }

    setAllStoredReminders((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const addMoreTimes = () => {
    setFormData((prev) => ({
      ...prev,
      timing: [...prev.timing, ""],
    }));
  };

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-700 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">
            Saving reminder...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                <Bell size={18} className="text-blue-700" />
              </div>

              <span className="text-sm font-semibold text-blue-700">
                Medication schedule
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Reminders
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Keep track of when you need to take your medicines.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <label className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer shadow-sm">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-slate-500" />

                <span className="text-sm font-medium text-slate-700">
                  Notifications
                </span>
              </div>

              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showNotifications}
                  onChange={showNotificationFunction}
                />

                <div className="w-10 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-700 transition" />

                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition peer-checked:translate-x-5" />
              </div>
            </label>

            <button
              onClick={handleAddReminder}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition"
            >
              <Plus size={17} />
              Add Reminder
            </button>

          </div>
        </div>

        {allStoredReminders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl min-h-[420px] flex items-center justify-center">
            <div className="text-center max-w-sm">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                <MdAddAlarm size={30} className="text-blue-700" />
              </div>

              <h2 className="text-xl font-bold text-slate-800">
                No reminders yet
              </h2>

              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Add your first medicine reminder so MEDSCAN can help you
                stay on schedule.
              </p>

              <button
                onClick={handleAddReminder}
                className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Create your first reminder
              </button>

            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {allStoredReminders.map((item, index) => (

              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                      <FaTablets className="text-blue-700 text-xl" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-800">
                        {item.medicine_name}
                      </h2>

                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.quantity}
                      </p>
                    </div>

                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      item.is_paused
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {item.is_paused ? "Paused" : "Active"}
                  </span>

                </div>

                <div className="mt-5 space-y-3">

                  <div className="flex items-start gap-3">

                    <Clock3
                      size={17}
                      className="text-slate-400 mt-0.5"
                    />

                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Time
                      </p>

                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {item.Reminder_Times.map(
                          (item2: { time: string }) => (
                            <span
                              key={item2.time}
                              className="text-sm font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg"
                            >
                              {item2.time}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="flex items-start gap-3">

                    <CalendarDays
                      size={17}
                      className="text-slate-400 mt-0.5"
                    />

                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Schedule
                      </p>

                      <p className="text-sm text-slate-700 mt-1">
                        {item.frequency}
                      </p>
                    </div>

                  </div>

                </div>

                <div className="flex gap-2 mt-5">

                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      item.meal === "Before Meal"
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                  >
                    Before Meal
                  </span>

                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      item.meal === "With Meal"
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                  >
                    With Meal
                  </span>

                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      item.meal === "After Meal"
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                  >
                    After Meal
                  </span>

                </div>

                <div className="border-t border-slate-100 mt-5 pt-4 flex items-center gap-2">

                  <button
                    onClick={() => handleEdit(item.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  {item.is_paused === false ? (
                    <button
                      onClick={() => handlePause(item.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition"
                    >
                      <Pause size={14} />
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={() => handleResume(item.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
                    >
                      <Play size={14} />
                      Resume
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      {addReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setAddReminder(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? "Edit Reminder" : "Add Reminder"}
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Set your medicine schedule below.
                </p>
              </div>

              <button
                onClick={() => setAddReminder(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
              >
                <X size={17} />
              </button>

            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
            >

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Medicine name
                </label>

                <input
                  type="text"
                  value={formData.medicine}
                  className="w-full outline-none border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-xl text-sm transition"
                  placeholder="e.g. Paracetamol"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medicine: e.target.value.trim(),
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Quantity
                  </label>

                  <input
                    type="text"
                    value={formData.quantity}
                    className="w-full outline-none border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-xl text-sm transition"
                    placeholder="e.g. 1 tablet"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: e.target.value.trim(),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Frequency
                  </label>

                  <input
                    type="text"
                    value={formData.frequency}
                    className="w-full outline-none border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-xl text-sm transition"
                    placeholder="e.g. Twice daily"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        frequency: e.target.value.trim(),
                      })
                    }
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Meal timing
                </label>

                <select
                  value={formData.meal}
                  className="w-full outline-none border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-xl text-sm transition bg-white"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meal: e.target.value,
                    })
                  }
                >
                  <option value="">Select meal timing</option>
                  <option value="Before Meal">Before Meal</option>
                  <option value="With Meal">With Meal</option>
                  <option value="After Meal">After Meal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Starting date
                  </label>

                  <input
                    type="date"
                    value={formData.startingDate}
                    className="w-full outline-none border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-xl text-sm transition"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startingDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Ending date
                  </label>

                  <input
                    type="date"
                    value={formData.endingDate}
                    className="w-full outline-none border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-xl text-sm transition"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endingDate: e.target.value,
                      })
                    }
                  />
                </div>

              </div>

              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="text-xs font-semibold text-slate-600">
                    Reminder times
                  </label>

                  <button
                    type="button"
                    onClick={addMoreTimes}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800"
                  >
                    <IoIosAddCircleOutline size={16} />
                    Add time
                  </button>

                </div>

                <div className="space-y-2">

                  {formData.timing.map((item, index) => (
                    <input
                      key={index}
                      type="time"
                      value={item}
                      className="w-full outline-none border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-xl text-sm transition"
                      onChange={(e) => {
                        const updatedTimes = [...formData.timing];
                        updatedTimes[index] = e.target.value;

                        setFormData({
                          ...formData,
                          timing: updatedTimes,
                        });
                      }}
                    />
                  ))}

                </div>

              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition"
              >
                {editingId ? "Update Reminder" : "Save Reminder"}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Reminder;


