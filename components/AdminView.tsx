import React, { useState, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { User, AdminSettings } from '../types';
import MessageIcon from './icons/MessageIcon';
import GiftIcon from './icons/GiftIcon';
import SettingsIcon from './icons/SettingsIcon';
import LinkIcon from './icons/LinkIcon';

const AdminView: React.FC = () => {
  const [users, setUsers] = useLocalStorage<User[]>('webinar-users', []);
  const [settings, setSettings] = useLocalStorage<AdminSettings>('webinar-settings', {
    giftFile: 'کتاب الکترونیکی فتوشاپ.pdf',
    referralBannerImage: 'https://picsum.photos/800/400',
    referralBannerText: 'دوست من، با این لینک در مدرسه پولسازی فتوشاپ ثبت نام کن و کلی آموزش رایگان ببین!',
    isSmsActive: false,
    smsText: 'ثبت نام شما در مدرسه پولسازی فتوشاپ با موفقیت انجام شد.',
  });

  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [notification, setNotification] = useState('');
  
  const sourceStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    users.forEach(user => {
      stats[user.source] = (stats[user.source] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [users]);
  
  const showNotification = (message: string) => {
      setNotification(message);
      setTimeout(() => setNotification(''), 3000);
  };
  
  const handleSettingsChange = <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) => {
      setSettings(prev => ({...prev, [key]: value}));
  };

  const generateSourceLink = () => {
    if (!sourceName) return;
    const link = `${window.location.origin}/?source=${encodeURIComponent(sourceName)}`;
    setGeneratedLink(link);
  };

  return (
    <div className="container mx-auto max-w-7xl p-4 text-gray-200">
        {notification && (
            <div className="fixed top-20 right-1/2 translate-x-1/2 bg-green-500 text-white py-2 px-6 rounded-lg shadow-lg animate-fade-in-down z-50">
                {notification}
            </div>
        )}
      <h1 className="text-4xl font-bold mb-8 text-center text-teal-400">پنل مدیریت ربات وبینار</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* User Stats */}
        <div className="md:col-span-2 lg:col-span-1 bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-center">آمار کاربران</h2>
          <div className="text-5xl font-bold text-center text-indigo-400 mb-6">{users.length}</div>
          <h3 className="text-lg font-semibold mb-2">کاربران بر اساس منبع ورودی:</h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {sourceStats.map(([source, count]) => (
              <li key={source} className="flex justify-between items-center bg-gray-700 p-2 rounded-md">
                <span>{source}</span>
                <span className="font-bold bg-indigo-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">{count}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Settings */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-center flex items-center justify-center gap-2"><SettingsIcon className="w-7 h-7" />تنظیمات ربات</h2>
            
            {/* Gift */}
            <div className="space-y-2">
                <label className="font-semibold flex items-center gap-2"><GiftIcon className="w-5 h-5 text-amber-400"/>فایل هدیه</label>
                <div className="flex items-center bg-gray-700 rounded-md border border-gray-600">
                    <span className="px-4 text-gray-400">{settings.giftFile}</span>
                    <input id="gift-upload" type="file" onChange={e => handleSettingsChange('giftFile', e.target.files?.[0]?.name || '')} className="hidden" />
                    <label htmlFor="gift-upload" className="mr-auto bg-gray-600 hover:bg-gray-500 cursor-pointer text-white py-2 px-4 rounded-l-md transition">انتخاب فایل</label>
                </div>
            </div>

            {/* Referral Banner */}
            <div className="space-y-2">
                <label className="font-semibold">بنر دعوت از دوستان</label>
                <input type="text" value={settings.referralBannerImage} onChange={e => handleSettingsChange('referralBannerImage', e.target.value)} placeholder="URL تصویر بنر" className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:ring-indigo-500 focus:outline-none"/>
                <textarea value={settings.referralBannerText} onChange={e => handleSettingsChange('referralBannerText', e.target.value)} placeholder="متن روی بنر" rows={2} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:ring-indigo-500 focus:outline-none"></textarea>
            </div>

            {/* SMS */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="font-semibold">پیامک پس از ثبت نام</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.isSmsActive} onChange={e => handleSettingsChange('isSmsActive', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-teal-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                </div>
                {settings.isSmsActive && (
                    <textarea value={settings.smsText} onChange={e => handleSettingsChange('smsText', e.target.value)} placeholder="متن پیامک" rows={2} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:ring-teal-500 focus:outline-none animate-fade-in"></textarea>
                )}
            </div>
             <div className="flex justify-end">
                <button onClick={() => showNotification('تنظیمات با موفقیت ذخیره شد!')} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105">
                    ذخیره تنظیمات
                </button>
            </div>
        </div>

        {/* Broadcast & Link Generator */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><MessageIcon className="w-6 h-6"/>ارسال پیام همگانی</h2>
                <textarea value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} rows={4} placeholder="پیام خود را اینجا بنویسید..." className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:ring-indigo-500 focus:outline-none"></textarea>
                <button onClick={() => { setBroadcastMessage(''); showNotification('پیام برای همه کاربران ارسال شد!'); }} className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition">ارسال</button>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                 <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><LinkIcon className="w-6 h-6"/>ساخت لینک ورودی</h2>
                <div className="flex gap-2">
                    <input type="text" value={sourceName} onChange={e => setSourceName(e.target.value)} placeholder="نام منبع (e.g. instagram)" className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:ring-indigo-500 focus:outline-none"/>
                    <button onClick={generateSourceLink} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition shrink-0">ساخت</button>
                </div>
                {generatedLink && (
                    <div className="mt-4 bg-gray-900 p-3 rounded-lg text-center break-all font-mono text-cyan-400 animate-fade-in">{generatedLink}</div>
                )}
            </div>
        </div>

        {/* User Table */}
        <div className="lg:col-span-3 bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">لیست کاربران ثبت نام شده</h2>
            <div className="overflow-x-auto max-h-96">
                <table className="w-full text-right">
                    <thead className="sticky top-0 bg-gray-800">
                        <tr className="border-b border-gray-600">
                            <th className="p-3">نام و نام خانوادگی</th>
                            <th className="p-3">شماره موبایل</th>
                            <th className="p-3">منبع</th>
                            <th className="p-3 text-center">معرفی‌ها</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-3">{user.name}</td>
                                <td className="p-3">{user.phone}</td>
                                <td className="p-3"><span className="bg-gray-600 text-gray-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">{user.source}</span></td>
                                <td className="p-3 text-center font-bold">{user.referrals}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {users.length === 0 && <p className="text-center py-8 text-gray-400">هنوز کاربری ثبت نام نکرده است.</p>}
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminView;
