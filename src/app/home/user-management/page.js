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
  const [users, setUsers] = useState([]); // สถานะสำหรับเก็บข้อมูลผู้ใช้
  const [editUser, setEditUser] = useState(null); // สถานะสำหรับเก็บข้อมูลผู้ใช้ที่แก้ไข

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users') // ตารางที่เก็บข้อมูลผู้ใช้
      .select('id, full_name, email, role'); // เลือกฟิลด์ที่ต้องการ
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
    setNewUserRole('User');
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      console.log('User created:', data.user);
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

    const { id, full_name, role } = editUser;

    try {
      const { data, error } = await supabase
        .from('users')
        .update({ full_name, role })
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

  const handleDeleteUser = async (email) => {
    try {
      // ค้นหา UUID ของผู้ใช้จากอีเมล
      const { data: users, error: fetchError } = await supabase
        .from('users') // ตารางที่เก็บข้อมูลผู้ใช้
        .select('id') // เลือก ID (UUID)
        .eq('email', email); // กรองตามอีเมล
  
      if (fetchError) {
        throw new Error(fetchError.message);
      }
  
      if (users.length === 0) {
        console.error('User not found');
        return;
      }
  
      const userId = users[0].id; // รับ UUID ของผู้ใช้
  
      // ลบผู้ใช้โดยใช้ UUID
      const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
      if (deleteError) {
        throw new Error(deleteError.message);
      }
  
      console.log('User deleted successfully');
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
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="w-full bg-pink-500 border-b">
                <th className="p-4 text-left text-white px-4 py-2">Name</th>
                <th className="p-4 text-left text-white px-4 py-2">Email</th>
                <th className="p-4 text-left text-white px-4 py-2">Role</th>
                <th className="p-4 text-left text-white text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {users.map((user) => (
                <tr key={user.id} className="border-opacity-100">
                  <td className="p-4 text-black border">{user.full_name}</td>
                  <td className="p-4 text-black border">{user.email}</td>
                  <td className="p-4 text-black border">{user.role}</td>
                  <td className="p-4 border">
                    {/* ปุ่ม edit */}
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
                        onClick={() => handleDeleteUser(user.email)} // เรียกใช้ฟังก์ชันลบผู้ใช้
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
              onChange={(e) => setNewUserPassword(e.target.value)} // อัปเดตรหัสผ่าน
              className="border rounded p-2 mb-4 w-full"
              required
            />
            <label className="block mb-2 text-gray-700">Full Name:</label>
            <input
              type="text"
              value={newUserFullName}
              onChange={(e) => setNewUserFullName(e.target.value)} // อัปเดตชื่อเต็ม
              className="border rounded p-2 mb-4 w-full"
              required
            />
            <label className="block mb-2 text-gray-700">Role:</label>
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)} // อัปเดตบทบาท
              className="border rounded p-2 mb-4 w-full"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={closeModal} // ปิด modal
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser} // เพิ่มผู้ใช้
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal สำหรับแก้ไขผู้ใช้ */}
      {isEditModalOpen && editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-black text-2xl font-bold mb-4">Edit User</h2>
            <label className="block mb-2 text-gray-700">Full Name:</label>
            <input
              type="text"
              value={editUser.full_name}
              onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value })} // อัปเดตชื่อเต็ม
              className="border rounded p-2 mb-4 w-full"
              required
            />
            <label className="block mb-2 text-gray-700">Role:</label>
            <select
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })} // อัปเดตบทบาท
              className="border rounded p-2 mb-4 w-full"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={closeEditModal} // ปิด modal
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={saveEditUser} // บันทึกการเปลี่ยนแปลง
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
