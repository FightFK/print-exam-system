"use client"
import React, { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // state สำหรับเช็คว่าเป็นการแก้ไขหรือไม่
  const [currentSubject, setCurrentSubject] = useState(null); // เก็บข้อมูลวิชาที่กำลังแก้ไข
  const [userId, setUserId] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [year, setYear] = useState('');
  const [terms, setTerms] = useState('');
  const [semester, setSemester] = useState('');
  const [numsOfStudents, setNumsOfStudents] = useState('');
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [tutorNames, setTutorNames] = useState({});
  const [searchCode, setSearchCode] = useState('');

  const fetchTutors = async () => {
    const response = await fetch('/api/getUsers');
    const data = await response.json();
    setTutors(data);
  };

  const fetchSubjects = async () => {
    const response = await fetch('/api/getSubjects');
    const data = await response.json();
    setSubjects(data);
    fetchTutorNames(data);
  };

  const fetchTutorNames = async (subjects) => {
    const uniqueUserIds = [...new Set(subjects.map((subject) => subject.UID))];

    const tutorPromises = uniqueUserIds.map(async (uid) => {
      const response = await fetch(`/api/findUser?uid=${uid}`);
      const data = await response.json();
      return { uid, name: data.name };
    });

    const tutorData = await Promise.all(tutorPromises);
    const tutorNameMap = tutorData.reduce((acc, tutor) => {
      acc[tutor.uid] = tutor.name;
      return acc;
    }, {});

    setTutorNames(tutorNameMap);
  };

  useEffect(() => {
    fetchTutors();
    fetchSubjects();
  }, []);

  const handleAddOrUpdateSubject = async () => {
    const url = isEditing ? '/api/updateSubject' : '/api/addSubject'; // เปลี่ยน URL ตามการแก้ไขหรือเพิ่ม
    const method = isEditing ? 'PUT' : 'POST'; // เปลี่ยน method ตามการแก้ไขหรือเพิ่ม
    const body = {
      SubID: subjectCode,
      SubName: subjectName,
      UID: userId,
      Year: year,
      Terms: terms,
      Semester: semester,
      Nums_of_student: numsOfStudents,
    };

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      console.log(`${isEditing ? 'Subject updated' : 'Subject added'} successfully`);
      setIsModalOpen(false);
      fetchSubjects();
      resetForm();
    } else {
      console.error(`${isEditing ? 'Failed to update subject' : 'Failed to add subject'}`);
    }
  };

  const resetForm = () => {
    setSubjectCode('');
    setSubjectName('');
    setUserId('');
    setYear('');
    setTerms('');
    setSemester('');
    setNumsOfStudents('');
    setCurrentSubject(null);
    setIsEditing(false); // reset editing state
  };

  const handleEditSubject = (subject) => {
    setCurrentSubject(subject);
    setSubjectCode(subject.Subid);
    setSubjectName(subject.Subname);
    setUserId(subject.UID);
    setYear(subject.Year);
    setTerms(subject.Terms);
    setSemester(subject.Semester);
    setNumsOfStudents(subject.Nums_of_student);
    setIsEditing(true); // เปลี่ยนสถานะเป็นการแก้ไข
    setIsModalOpen(true);
  };

  const handleDeleteSubject = async (SubID) => {
    try {
      const response = await fetch('/api/deleteSubject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ SubjectID: SubID }),
      });

      if (response.ok) {
        console.log('Subject deleted successfully');
        fetchSubjects();
      }
    } catch (error) {
      console.error('Error deleting Subject:', error.message);
    }
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.Subid.toLowerCase().includes(searchCode.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-gray-200">
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
            placeholder="ค้นหารหัสวิชา"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="pl-10 pr-20 py-2 bg-white rounded-full focus:outline-none text-gray-700"
          />
        </div>
        <button 
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }} 
          className="bg-white text-red-500 font-semibold py-2 px-6 rounded-full hover:bg-gray-100"
        >
          Add
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 h-100">
            <h2 className="text-lg font-bold mb-4">{isEditing ? 'Edit Subject' : 'Add Subject'}</h2>
            <input
              type="text"
              placeholder="Course code"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Subject name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="border p-2 rounded mb-2 w-full"
            />
            <select 
              value={userId}
              onChange={(e) => setUserId(e.target.value)} 
              className="border p-2 rounded mb-2 w-full"
            >
              <option value="">Select Tutor</option>
              {tutors.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.id} - {tutor.full_name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Terms"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Number of Students"
              value={numsOfStudents}
              onChange={(e) => setNumsOfStudents(e.target.value)}
              className="border p-2 rounded mb-4 w-full"
            />

            <div className="flex justify-end">
              <button onClick={handleAddOrUpdateSubject} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                {isEditing ? 'Update Subject' : 'Add Subject'}
              </button>
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-black px-4 py-2 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <table className="min-w-full mt-5">
          <thead className="w-full bg-pink-500 border-b">
            <tr className="w-full bg-pink-500 border-b">
              <th className="py-2 px-4 text-white">รหัสวิชา</th>
              <th className="py-2 px-4 text-white">ชื่อวิชา</th>
              <th className="py-2 px-4 text-white">ผู้สอน</th>
              <th className="py-2 px-4 text-white">ปีการศึกษา</th>
              <th className="py-2 px-4 text-white">เทอม</th>
              <th className="py-2 px-4 text-white">ภาคการศึกษา</th>
              <th className="py-2 px-4 text-white">จำนวนผู้เรียน</th>
              <th className="py-2 px-4 text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredSubjects.map((subject) => (
              <tr key={subject.Subid} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{subject.Subid}</td>
                <td className="py-2 px-4">{subject.Subname}</td>
                <td className="py-2 px-4">{tutorNames[subject.UID] || 'Unknown'}</td>
                <td className="py-2 px-4">{subject.Year}</td>
                <td className="py-2 px-4">{subject.Terms}</td>
                <td className="py-2 px-4">{subject.Semester}</td>
                <td className="py-2 px-4">{subject.Nums_of_student}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <button onClick={() => handleEditSubject(subject)}>
                    <PencilIcon className="w-5 h-5 text-blue-500" />
                  </button>
                  <button onClick={() => handleDeleteSubject(subject.SubID)}>
                    <TrashIcon className="w-5 h-5 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
