import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline'; 

export default function Page() {
  return (
    <div className="flex flex-col h-full bg-gray-200">
      {/* แทบค้นหาและ ตัว add ที่เพิ่มมา*/}
      <div className="p-7 bg-pink-500 flex items-center justify-between">
        <div className="relative flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 4a8 8 0 100 16 8 8 0 000-16z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35"
            />
          </svg>
          <input
            type="text"
            placeholder="รหัสวิชา"
            className="pl-20 pr-20 py-2 bg-white rounded-full focus:outline-none text-gray-700"
          />
        </div>
        <button className="bg-white text-red-500 font-semibold py-2 px-6 rounded-full hover:bg-gray-100">
          Add
        </button>
      </div>

      {/*  ตัวตาราง */}
      <div className="flex-1 p-6 overflow-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-pink-500 text-white">
              <th className="px-4 py-2">Course code</th>
              <th className="px-4 py-2">Subject name</th>
              <th className="px-4 py-2">Tutor</th>
              <th className="px-4 py-2">Tool</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              <td className="border px-4 py-2">340-100</td>
              <td className="border px-4 py-2">Technology-together</td>
              <td className="border px-4 py-2">Chinnapong</td>
              <td className="border px-4 py-2 flex justify-around">
                  {/*  ปุ่ม edit  */}
                <button className="bg-yellow-300 hover:bg-yellow-400 text-gray-800 px-3 py-2 rounded-lg flex items-center">
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </button>
                  {/*  ปุ่ม Delete */}
                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center">
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
