"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // ใช้ useRouter จาก next/navigation
import { supabase } from '@/lib/supabase';

export default function Page() {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // ใช้ useRouter

  const login = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า
    try {
      let { data: loginData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (loginData) {
        router.push('/home'); // นำทางไปยังหน้าหลังล็อกอิน
      }
      if (error) {
        setErrorMessage(error.message); // แสดงข้อความข้อผิดพลาด
      }
    } catch (error) {
      setErrorMessage("Something went wrong!"); // ข้อความข้อผิดพลาดทั่วไป
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center w-screen h-screen"
      style={{ backgroundImage: 'url("/images/background.png")' }}
    >
      <div className="p-6 max-w-sm bg-white rounded-xl shadow-lg space-y-4">
        <div className="text-center">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-left">Print</h1>
            <h1 className="text-4xl font-bold text-left ml-4 text-red-500">
              Exam System
            </h1>
          </div>
        </div>
        {errorMessage && (
          <div className="text-red-500 text-sm text-center">
            {errorMessage} {/* แสดงข้อความข้อผิดพลาด */}
          </div>
        )}
        {/* ฟอร์มล็อคอิน */}
        <form className="space-y-4" onSubmit={login}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Email"
              name="email"
              value={data.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
