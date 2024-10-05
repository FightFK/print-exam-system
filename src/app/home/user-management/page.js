"use client"; // ระบุว่าเป็น Client Component

import React, { useState } from 'react';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPermission, setNewPermission] = useState('');

  const handleEdit = (user) => {
    setSelectedUser(user);
    setNewPermission(user.permission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handlePermissionChange = (e) => {
    setNewPermission(e.target.value); // อัปเดตค่า permission ใหม่
  };

  const users = [
    { name: 'John Doe', permission: 'Admin' },
    { name: 'Jane Smith', permission: 'User' }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800">User-Management Page</h1>

        {/* ตารางผู้ใช้งาน */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border border-black">
            <thead>
              <tr className="w-full bg-pink-500 border-b">
                <th className="p-4 text-left text-white px-4 py-2">Name</th>
                <th className="p-4 text-left text-white px-4 py-2">Permission</th>
                <th className="p-4 text-left text-white ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-4 text-black">{user.name}</td>
                  <td className="p-4 text-black">{user.permission}</td>
                  <td className="p-4">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button className="ml-4 text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-black text-2xl font-bold mb-4">Edit User</h2>
            <p className="text-black mb-2">Name: {selectedUser.name}</p>
            <label className="block mb-2 text-gray-700">Permission:</label>
            <select
              value={newPermission} // ค่าปัจจุบันของ dropdown
              onChange={handlePermissionChange} // ฟังก์ชันที่ทำงานเมื่อมีการเลือกค่าใหม่
              className="border rounded p-2 mb-4 w-full"
            >
              <option value="User" className="text-black">User</option>
              <option value="Admin" className="text-black">Admin</option>
            </select>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={closeModal}>
              Save
            </button>
            <button className="bg-red-600 px-4 py-2 rounded" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
