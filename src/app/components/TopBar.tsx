import { User, Bell } from 'lucide-react';
import { useState } from 'react';
import logoImage from 'figma:asset/7f4c2830fbeab039f2bfb2e66991fbd14cd52b08.png';

export function TopBar() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-20 z-50">
      <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl border-b-4 border-red-500" />
      {/* Comic book accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
      
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="group cursor-pointer flex items-center overflow-hidden h-20">
          <img
            src={logoImage}
            alt="The FictionVerse"
            className="h-[450px] w-auto object-contain translate-y-[16px] -translate-x-[20px]"
          />
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button className="w-11 h-11 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center border-2 border-yellow-400 hover:border-white transition-all transform hover:scale-105 shadow-lg hover:shadow-yellow-500/50 relative">
            <Bell className="w-6 h-6 text-white" strokeWidth={2.5} />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-slate-900 rounded-full text-[10px] font-black text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center border-2 border-blue-400 hover:border-yellow-400 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
            >
              <User className="w-6 h-6 text-white" strokeWidth={2.5} />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-3 w-56 bg-slate-800 rounded-xl shadow-2xl border-3 border-yellow-400 overflow-hidden z-50">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
                  <div className="p-2 pt-3">
                    <button className="w-full px-4 py-3 text-left text-sm font-bold text-white hover:bg-red-500 rounded-lg transition-all">
                      Profile
                    </button>
                    <button className="w-full px-4 py-3 text-left text-sm font-bold text-white hover:bg-blue-500 rounded-lg transition-all">
                      Settings
                    </button>
                    <div className="h-px bg-yellow-400/30 my-2 mx-2" />
                    <button className="w-full px-4 py-3 text-left text-sm font-bold text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}