import SideNav from '../components/navside';

export const metadata = {
  title: 'Print Exam App',
  description: 'This is my awesome app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          {/* SideNav */}
          <div className="flex-shrink-0 p-0"> {/* Ensure no padding/margins */}
            <SideNav />
          </div>

          {/* Main content */}
          <div className="flex-1  bg-gray-100 h-full overflow-y-auto">
            <div className="container mx-auto">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

