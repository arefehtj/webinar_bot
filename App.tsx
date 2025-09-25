import React, { useState } from 'react';
import UserView from './components/UserView';
import AdminView from './components/AdminView';
import UserIcon from './components/icons/UserIcon';
import AdminIcon from './components/icons/AdminIcon';

type View = 'user' | 'admin';

const App: React.FC = () => {
  const [view, setView] = useState<View>('user');

  return (
    <div className="bg-gray-900 min-h-screen text-white antialiased">
      <div className="fixed top-4 left-4 z-50 bg-gray-800 rounded-full p-1 flex items-center space-x-1 shadow-lg">
        <button
          onClick={() => setView('user')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 flex items-center gap-2 ${
            view === 'user' ? 'bg-indigo-600 text-white' : 'bg-transparent text-gray-300 hover:bg-gray-700'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          نمای کاربر
        </button>
        <button
          onClick={() => setView('admin')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 flex items-center gap-2 ${
            view === 'admin' ? 'bg-teal-600 text-white' : 'bg-transparent text-gray-300 hover:bg-gray-700'
          }`}
        >
          <AdminIcon className="w-5 h-5" />
          پنل ادمین
        </button>
      </div>

      <main className="pt-20">
        {view === 'user' ? <UserView /> : <AdminView />}
      </main>
    </div>
  );
};

export default App;
