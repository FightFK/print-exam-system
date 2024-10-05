import React from 'react'
import Image from 'next/image'

export default function Page() {
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center w-screen h-screen" 
      style={{ backgroundImage: 'url("/background.png")' }}>
      <div className="p-6 max-w-sm bg-white rounded-xl shadow-lg space-y-4">
        <div className="text-center">
        <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-left">Print</h1>
            <h1 className="text-4xl font-bold text-left ml-4 text-red-500">Exam System</h1> {/* เพิ่มระยะจากซ้ายด้วย ml-4 */}
        </div>
        </div>
        {/* ฟอร์มล็อคอิน */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
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
  )
}
