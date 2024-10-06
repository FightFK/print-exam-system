'use client';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline'; 
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // นำเข้า Supabase

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserFullName, setNewUserFullName] = useState('');
  const [newUserRole, setNewUserRole] = useState('User'); // ค่าดีฟอลต์เป็น User
  const [newField, setNewField] = useState(''); // แก้ไขให้ไม่มีค่าดีฟอลต์
  const [users, setUsers] = useState([]); // สถานะสำหรับเก็บข้อมูลผู้ใช้
  const [editUser, setEditUser] = useState(null); // สถานะสำหรับเก็บข้อมูลผู้ใช้ที่แก้ไข

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users') // ตารางที่เก็บข้อมูลผู้ใช้
      .select('id, full_name, email, role, Field'); 
    if (error) {
      console.error('Error fetching users:', error.message);
    } else {
      setUsers(data); // ตั้งค่าให้กับสถานะผู้ใช้
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // รีเซ็ตฟิลด์ข้อมูล
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserFullName('');
    setNewUserRole('User'); // คืนค่าดีฟอลต์
    setNewField(''); // คืนค่าใหม่ให้เป็นค่าว่าง
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditUser(null);
  };

  // ฟังก์ชันเพิ่มผู้ใช้
  const handleAddUser = async () => {
    try {
      const response = await fetch('/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
          full_name: newUserFullName,
          role: newUserRole,
          Field: newField, // ส่ง Field ไปใน request
        }),
      });
  
      // ตรวจสอบสถานะการตอบกลับ
      if (!response.ok) {
        const errorData = await response.text(); // อ่านข้อมูลดิบ
        throw new Error(`Error: ${response.status} - ${errorData}`); // แสดงสถานะและข้อความผิดพลาด
      }
  
      const data = await response.json(); // แปลงข้อมูลเป็น JSON
  
      console.log('User created');
      fetchUsers(); // อัปเดตข้อมูลผู้ใช้ในตาราง
      closeModal();
    } catch (error) {
      console.error('Error creating user:', error.message);
    }
  };
  
  // ฟังก์ชันแก้ไขผู้ใช้
  const handleEditUser = (user) => {
    setEditUser(user); // ตั้งค่าผู้ใช้ที่จะแก้ไข
    setIsEditModalOpen(true);
  };

  const saveEditUser = async () => {
    if (!editUser) return;

    const { id, full_name, role, Field } = editUser;

    try {
      const { data, error } = await supabase
        .from('users')
        .update({ full_name, role, Field }) // อัปเดต Field ด้วย
        .eq('id', id); // ค้นหาผู้ใช้ตาม ID

      if (error) {
        throw new Error(error.message);
      }

      console.log('User updated:', data);
      fetchUsers(); // อัปเดตข้อมูลผู้ใช้ในตาราง
      closeEditModal();
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
        console.log('Deleting user with ID:', userId); // เช็ค userId ที่จะลบ
        const response = await fetch('/api/deleteUser', {
            method: 'POST', // เปลี่ยนเป็น POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }), // ส่ง userId ไปใน request
        });

        // ตรวจสอบสถานะการตอบกลับ
        if (!response.ok) {
            const errorData = await response.json(); // อ่านข้อมูลที่ส่งกลับ
            throw new Error(`Error: ${response.status} - ${errorData.error}`);
        }

        const data = await response.json(); // แปลงข้อมูลเป็น JSON
        console.log(data.message); // แสดงข้อความที่ส่งกลับ

        fetchUsers(); // อัปเดตข้อมูลผู้ใช้ในตาราง
    } catch (error) {
        console.error('Error deleting user:', error.message);
    }
};

  
  
  
  
  

  return (
    <div className="flex flex-col h-full bg-slate-300">
        {/* แทบค้นหาและ ตัว add ที่เพิ่มมา*/}
        <div className="p-7 bg-pink-500 flex items-center justify-between">
          <button 
            onClick={() => setIsModalOpen(true)} // เปิด modal เมื่อคลิกปุ่ม
            className="bg-white text-red-500 font-semibold py-2 px-6 rounded-full hover:bg-gray-100">
            Add
          </button>
        </div>
        
        <div className="flex-1 p-6">
            {/* ตารางผู้ใช้งาน */}
            <div className="mt-6 overflow-y-auto max-h-[500px]"> {/* กำหนด max-height และ overflow */}
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="w-full bg-pink-500 border-b">
                    <th className="p-4 text-left text-white px-4 py-2">Name</th>
                    <th className="p-4 text-left text-white px-4 py-2">Field of Study</th>
                    <th className="p-4 text-left text-white px-4 py-2">Email</th>
                    <th className="p-4 text-left text-white px-4 py-2">Role</th>
                    <th className="p-4 text-white text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {users.map((user) => (
                    <tr key={user.id} className="border-opacity-100">
                      <td className="p-4 text-black border">{user.full_name}</td>
                      <td className="p-4 text-black border">{user.Field}</td>
                      <td className="p-4 text-black border">{user.email}</td>
                      <td className="p-4 text-black border">{user.role}</td>
                      <td className="p-4 border">
                          <div className="flex space-x-2 justify-center">
                            {/* ปุ่ม Edit */}
                            <button
                              className="bg-yellow-300 hover:bg-yellow-400 text-gray-800 px-3 py-2 rounded-lg flex items-center mr-10"
                              onClick={() => handleEditUser(user)} // เรียกใช้ฟังก์ชันแก้ไข
                            >
                              <PencilIcon className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            {/* ปุ่ม Delete */}
                            <button 
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center"
                              onClick={() => handleDeleteUser(user.id)} // ส่ง ID ไปยังฟังก์ชันลบ
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

      {/* Modal สำหรับเพิ่มผู้ใช้ */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-black text-2xl font-bold mb-4">Add User</h2>
            <label className="block mb-2 text-gray-700">Email:</label>
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)} // อัปเดตอีเมล
              className="border rounded p-2 mb-4 w-full"
              required
            />
            <label className="block mb-2 text-gray-700">Password:</label>
            <input
              type="password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)} // อัปเดตพาสเวิร์ด
              className="border rounded p-2 mb-4 w-full"
              required
            />
            <label className="block mb-2 text-gray-700">Full Name:</label>
            <input
              type="text"
              value={newUserFullName}
              onChange={(e) => setNewUserFullName(e.target.value)} // อัปเดตชื่อผู้ใช้
              className="border rounded p-2 mb-4 w-full"
              required
            />
            <label className="block mb-2 text-gray-700">Role:</label>
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)} // อัปเดตบทบาท
              className="border rounded p-2 mb-4 w-full"
            >
                 <option value="Admin">Admin</option>
                <option value="Tech">Tech</option>
                <option value="Officer">Officer</option>
                <option value="Teacher">Teacher</option>
            </select>

            <label className="block mb-2 text-gray-700">Field of Study</label>
            <select
              value={newField}
              onChange={(e) => setNewField(e.target.value)} // อัปเดตค่า Field
              className="border rounded p-2 mb-4 w-full"
            >
              <option value="">Select Field</option>
              <option value="ComputerSci">Com-Sci</option>
              <option value="Bio">Biology</option>
              <option value="Chem">Chemistry</option>
              {/* เพิ่มตัวเลือกอื่นๆ ตามที่ต้องการ */}
            </select>

            <div className="flex justify-between mt-4">
              <button onClick={closeModal} className="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
              <button onClick={handleAddUser} className="bg-blue-500 text-white px-4 py-2 rounded">Add User</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal สำหรับแก้ไขผู้ใช้ */}
      {isEditModalOpen && editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-black text-2xl font-bold mb-4">Edit User</h2>
            <label className="block mb-2 text-gray-700">Email:</label>
            <input
              type="email"
              value={editUser.email}
              readOnly
              className="border rounded p-2 mb-4 w-full"
            />
            <label className="block mb-2 text-gray-700">Full Name:</label>
            <input
              type="text"
              value={editUser.full_name}
              onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value })} // อัปเดตชื่อผู้ใช้
              className="border rounded p-2 mb-4 w-full"
              required
            />
            <label className="block mb-2 text-gray-700">Role:</label>
            <select
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })} // อัปเดตบทบาท
              className="border rounded p-2 mb-4 w-full"
            >
             <option value="Admin">Admin</option>
              <option value="Tech">Tech</option>
              <option value="Officer">Officer</option>
              <option value="Teacher">Teacher</option>
              
            </select>

            <label className="block mb-2 text-gray-700">Field of Study</label>
            <select
              value={editUser.Field}
              onChange={(e) => setEditUser({ ...editUser, Field: e.target.value })} // อัปเดตค่า Field
              className="border rounded p-2 mb-4 w-full"
            >
              <option value="">Select Field</option>
              <option value="ComputerSci">Com-Sci</option>
              <option value="Bio">Biology</option>
              <option value="Chem">Chemistry</option>
          
          
            </select>

            <div className="flex justify-between mt-4">
              <button onClick={closeEditModal} className="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
              <button onClick={saveEditUser} className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
