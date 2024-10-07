"use client";
import React, { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [searchCode, setSearchCode] = useState(''); // state สำหรับการค้นหา

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

  const handleAddSubject = async () => {
    const response = await fetch('/api/addSubject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        SubID: subjectCode,
        SubName: subjectName,
        UID: userId,
        Year: year,
        Terms: terms,
        Semester: semester,
        Nums_of_student: numsOfStudents,
      }),
    });
    

    if (response.ok) {
      console.log('Subject added successfully');
      setIsModalOpen(false);
      fetchSubjects();
      setSubjectCode('');
      setSubjectName('');
      setUserId('');
      setYear('');
      setTerms('');
      setSemester('');
      setNumsOfStudents('');
    } else {
      console.error('Failed to add subject');
    }
  };

  // ฟังก์ชันสำหรับกรอง subjects ตามรหัสวิชา
  const filteredSubjects = subjects.filter(subject =>
    subject.Subid.toLowerCase().includes(searchCode.toLowerCase())
  );

  const handleDeleteSubject = async (SubID) => {
    try {
        const response = await fetch('/api/deleteSubject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ SubjectID: SubID }), // เปลี่ยนชื่อเป็น SubjectID
        });
        
    } catch (error) {
        console.error('Error deleting Subject:', error.message);
    }
    fetchSubjects();
};

  

  return (
    <div className="flex flex-col h-full bg-gray-200">
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
            placeholder="ค้นหารหัสวิชา"
            value={searchCode} // เพิ่มค่า value
            onChange={(e) => setSearchCode(e.target.value)} // เพิ่ม onChange
            className="pl-20 pr-20 py-2 bg-white rounded-full focus:outline-none text-gray-700"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-white text-red-500 font-semibold py-2 px-6 rounded-full hover:bg-gray-100"
        >
          Add
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 h-100">
            <h2 className="text-lg font-bold mb-4">Add Subject</h2>
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
              <button onClick={handleAddSubject} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                Add Subject
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
              <th className="py-2 px-4 text-white">จัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredSubjects.map((subject) => ( // ใช้ filteredSubjects แทน subjects
              <tr key={subject.SubID} className="border-b">
                <td className="py-2 px-4">{subject.Subid}</td>
                <td className="py-2 px-4">{subject.Subname}</td>
                <td className="py-2 px-4">{tutorNames[subject.UID]}</td>
                <td className="py-2 px-4">{subject.Year}</td>
                <td className="py-2 px-4">{subject.Terms}</td>
                <td className="py-2 px-4">{subject.Semester}</td>
                <td className="py-2 px-4">{subject.Nums_of_student}</td>
                <td className="py-2 px-4">
                <button className="bg-yellow-400 text-black font-semibold py-2 px-4 rounded inline-flex items-center">
                <PencilIcon className="h-5 w-5 mr-2" />
                        Edit
                </button>
                  <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded ml-2 inline-flex items-center" onClick={() => handleDeleteSubject(subject.Subid)}>
                <TrashIcon className="h-5 w-5 mr-2" />
                       Delete
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
