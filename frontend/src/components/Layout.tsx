import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BackgroundDecor from './layout/BackgroundDecor';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen relative bg-black">
      {/* Background Decoration Layer */}
      <BackgroundDecor />

      {/* Main Content Layer */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-white via-gray-200 to-gray-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Meeting Minutes</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  location.pathname === '/'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Home
              </Link>
              <Link
                to="/upload"
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  location.pathname === '/upload'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Upload
              </Link>
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  location.pathname === '/dashboard'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-12 glass">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-300 font-medium">
              Wyni Technology
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

