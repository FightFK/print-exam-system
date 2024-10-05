import SideNav from '../components/navside';

export const metadata = {
  title: 'My App',
  description: 'This is my awesome app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen"> {/* เพิ่ม h-screen เพื่อให้เต็มความสูง */}
          {/* ใส่ SideNav */}
          <div className="flex-shrink-0"> {/* ป้องกันการหดตัว */}
            <SideNav />
          </div>

          {/* เนื้อหาของหน้า */}
          <div className="flex-1 p-6 bg-gray-100"> {/* ไม่ต้องกำหนด h-screen ที่นี่ */}
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
