import SideNav from '../components/navside';

export const metadata = {
  title: 'Print Exam App',
  description: 'This is my awesome app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en"> {/* ปิดแท็กให้ถูกต้อง */}
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* Favicon */}
        <link rel="icon" href="/images/background.png" type="image/x-icon" />
      </head>

      <body>
        <div className="flex h-screen">
          {/* SideNav */}
          <div className="flex-shrink-0 p-0"> {/* Ensure no padding/margins */}
            <SideNav />
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 bg-gray-100 h-full overflow-y-auto">
            <div className="container mx-auto">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
