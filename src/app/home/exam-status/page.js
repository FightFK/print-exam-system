import React from 'react';

export default function Page() {
  return (
    <div className="flex flex-col h-full"> {/* ใช้ flex-col เพื่อให้พื้นที่เต็มความสูง */}
      {/* เนื้อหาของหน้าโฮม */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to the Exam Status Page!</h1>
        <p className="mt-4 text-gray-600">
          This is the main content area where you can add more details about your application.
        </p>
      </div>
    </div>
  );
}
