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
  const [newTele,setNewTele] = useState('');
  const [users, setUsers] = useState([]); // สถานะสำหรับเก็บข้อมูลผู้ใช้
  const [editUser, setEditUser] = useState(null); // สถานะสำหรับเก็บข้อมูลผู้ใช้ที่แก้ไข
  const [searchTerm, setSearchTerm] = useState(''); // สถานะสำหรับเก็บค่าค้นหา

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users') // ตารางที่เก็บข้อมูลผู้ใช้
      .select('id, full_name, email, role, Field,Tele'); 
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
    setNewTele(''); // คืนค่า
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
          Tele: newTele,
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

    const { id, full_name, role, Field ,Tele} = editUser;

    try {
      const { data, error } = await supabase
        .from('users')
        .update({ full_name, role, Field,Tele }) // อัปเดต Field ด้วย
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

  // ฟังก์ชันสำหรับกรองผู้ใช้ตามค่าค้นหา
  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-300">
        {/* แทบค้นหาและ ตัว add ที่เพิ่มมา*/}
        <div className="p-7 bg-pink-500 flex items-center justify-between">
          <div className="relative flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 absolute left-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              placeholder="ค้นหาชื่อผู้ใช้"
              className="pl-10 pr-20 py-2 bg-white rounded-full focus:outline-none text-gray-700"
              value={searchTerm} // เชื่อมโยงกับ state ค้นหา
              onChange={(e) => setSearchTerm(e.target.value)} // อัปเดตค่าค้นหา
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)} // เปิด modal เมื่อคลิกปุ่ม
            className="bg-white text-red-500 font-semibold py-2 px-6 rounded-full hover:bg-gray-100"
          >
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
                  <th className="p-4 text-left text-white px-4 py-2">Telephone Nums</th>
                  <th className="p-4 text-white text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white">
              {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-opacity-100">
                    <td className="p-4 text-black border">{user.full_name}</td>
                    <td className="p-4 text-black border">{user.Field}</td>
                    <td className="p-4 text-black border">{user.email}</td>
                    <td className="p-4 text-black border">{user.role}</td>
                    <td className="p-4 text-black border">{user.Tele}</td>
                    <td className="p-4 text-black border text-center">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="mr-2 text-yellow-500 hover:text-yellow-700"
                      >
                        <PencilIcon className="h-5 w-5 inline-block" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5 inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal สำหรับเพิ่มผู้ใช้ */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-lg font-semibold mb-4">Add User</h2>
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
            <label className="block mb-2 text-gray-700">Telephone</label>
              <input
                type="text"
                placeholder="Telephone"
                className="border rounded p-2 mb-4 w-full"
                value={newTele}
                onChange={(e) => setNewTele(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="mr-2 text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}



        {/* Modal สำหรับแก้ไขผู้ใช้ */}
        {isEditModalOpen && editUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-lg font-semibold mb-4">Edit User</h2>
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
            <label className="block mb-2 text-gray-700">Telephone</label>
              <input
                type="text"
                placeholder="Telephone"
                className="border rounded p-2 mb-4 w-full"
                value={editUser.Tele}
                onChange={(e) => setEditUser({ ...editUser, Tele: e.target.value })}
              />
              <div className="flex justify-end">
              <button
                  onClick={saveEditUser}
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-10"
                >
                  Save
                </button>
                <button
                  onClick={closeEditModal}
                  className="mr-2 text-gray-500"
                >
                  Cancel
                </button>
                
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
