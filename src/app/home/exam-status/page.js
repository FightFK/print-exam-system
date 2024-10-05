import React from 'react';

export default function Page() {
  return (
    <div className="flex flex-col h-full bg-gray-200"> {/* สีพิ้นหลัง */}
      {/* แทบค้นหา */}
      <div className="p-7 bg-pink-500 flex items-center">
        <div className="relative">
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
      </div>

      {/* ตาราง */}
      <div className="flex-1 p-6 overflow-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-pink-500 text-white">
              <th className="px-4 py-2">Course code</th>
              <th className="px-4 py-2">Subject name</th>
              <th className="px-4 py-2">Tutor</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              <td className="border px-4 py-2">342-110</td>
              <td className="border px-4 py-2">Technology-together</td>
              <td className="border px-4 py-2">Chinnapong</td>
              <td className="border px-4 py-2">Waiting for sending</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="border px-4 py-2">344-101</td>
              <td className="border px-4 py-2">Programming </td>
              <td className="border px-4 py-2">Ronaldo</td>
              <td className="border px-4 py-2">Failed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
