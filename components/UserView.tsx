import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { User, AdminSettings } from '../types';

type Step = 'welcome' | 'form' | 'success' | 'gift';

const BotMessage: React.FC<{ children: React.ReactNode; delay: number; onDone: () => void }> = ({ children, delay, onDone }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      onDone();
    }, delay);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  if (!visible) return null;

  return (
    <div className="flex justify-start mb-4 animate-fade-in-up">
      <div className="bg-gray-700 rounded-lg rounded-br-none px-4 py-3 max-w-sm">
        <p className="text-gray-200">{children}</p>
      </div>
    </div>
  );
};

const UserView: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState<Step>('welcome');
  const [messages, setMessages] = useState<number>(0);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [users, setUsers] = useLocalStorage<User[]>('webinar-users', []);
  const [adminSettings] = useLocalStorage<AdminSettings>('webinar-settings', {
      giftFile: 'کتاب الکترونیکی فتوشاپ.pdf',
      referralBannerImage: 'https://picsum.photos/800/400',
      referralBannerText: 'دوست من، با این لینک در مدرسه پولسازی فتوشاپ ثبت نام کن و کلی آموزش رایگان ببین!',
      isSmsActive: false,
      smsText: ''
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refId = urlParams.get('ref');

    if (refId) {
        setUsers(prevUsers => {
            if (prevUsers.find(u => u.id === refId)) {
                const newUrl = window.location.pathname + window.location.search.replace(`&ref=${refId}`, '').replace(`?ref=${refId}`, '');
                window.history.replaceState({}, document.title, newUrl);
                
                return prevUsers.map(u => {
                    if (u.id === refId) {
                        return { ...u, referrals: u.referrals + 1, giftsReceived: u.giftsReceived + 1 };
                    }
                    return u;
                });
            }
            return prevUsers;
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount to process referral link


  const handleMessageDone = () => {
    setMessages(prev => prev + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const source = new URLSearchParams(window.location.search).get('source') || 'مستقیم';
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      phone,
      source,
      referrals: 0,
      giftsReceived: 0,
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setStep('success');
    setMessages(0); // Reset for next step
  };

  const welcomeMessages = [
    "سلام! آماده‌ای که فتوشاپ رو یاد بگیری؟",
    "آماده‌ای که باهاش کسب درآمد کنی؟",
    "نه لازمه پول پرداخت کنی، نه لازمه کسی رو دعوت کنی.",
    "فقط عضو مدرسه پولسازی با فتوشاپ شو و هرچی که لازمه رو رایگان از استاد دریافت کن.",
  ];

  if (!isStarted) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 flex justify-center items-center min-h-[60vh]">
          <button
            onClick={() => setIsStarted(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-full transition-transform transform hover:scale-105 shadow-lg text-xl"
          >
            🚀 شروع
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 min-h-[60vh]">
        
        {step === 'welcome' && (
          <div>
            {welcomeMessages.map((msg, index) => (
              <BotMessage key={index} delay={index * 1500 + 500} onDone={handleMessageDone}>
                {msg}
              </BotMessage>
            ))}
            {messages >= welcomeMessages.length && (
              <div className="flex justify-end pt-4 animate-fade-in">
                <button
                  onClick={() => {
                    setStep('form');
                    setMessages(0);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
                >
                  ادامه و ثبت نام
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'form' && (
           <div className="animate-fade-in">
            <BotMessage delay={100} onDone={() => {}}>لطفا نام و نام خانوادگی خود را وارد کنید:</BotMessage>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: سارا احمدی"
                    required
                    className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-md py-3 px-4 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                <BotMessage delay={200} onDone={() => {}}>لطفا شماره موبایل خود را وارد کنید:</BotMessage>
                <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: 09123456789"
                    required
                    className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-md py-3 px-4 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105">
                        ثبت نام
                    </button>
                </div>
            </form>
           </div>
        )}
        
        {step === 'success' && currentUser && (
          <div className="animate-fade-in space-y-4">
            <BotMessage delay={100} onDone={() => {}}>ثبت نام شما با موفقیت انجام شد.</BotMessage>
            <BotMessage delay={1100} onDone={() => {}}>از طریق لینک زیر می‌تونید وارد کانال مدرسه پولسازی با فتوشاپ شوید:</BotMessage>
            <div className="flex justify-center p-4">
                <a href="#" className="text-cyan-400 hover:text-cyan-300 underline font-semibold break-all text-center">
                    {`https://t.me/photoshop_school?start=${currentUser.source}_${currentUser.id}`}
                </a>
            </div>
            <BotMessage delay={2100} onDone={handleMessageDone}>همچنین امروز یک هدیه ارزشمند برای شما در نظر گرفته‌ایم که می‌توانید روی دکمه زیر بزنید و دریافتش کنید.</BotMessage>
            
            {messages >= 1 && (
                <div className="flex justify-center space-x-4 space-x-reverse pt-4 animate-fade-in">
                    <button onClick={() => setStep('gift')} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-5 rounded-lg transition-transform transform hover:scale-105">
                        🎁 دریافت هدیه ویژه امروز
                    </button>
                     <button onClick={() => setStep('gift')} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-5 rounded-lg transition-transform transform hover:scale-105">
                        📊 آمار معرفی‌ها
                    </button>
                </div>
            )}
          </div>
        )}

        {step === 'gift' && currentUser && (
            <div className="animate-fade-in-up space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-center text-teal-300">آمار معرفی‌های شما</h3>
                    <div className="flex justify-around text-center">
                        <div>
                            <p className="text-2xl font-bold">{currentUser.referrals}</p>
                            <p className="text-gray-400">تعداد معرفی</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{currentUser.giftsReceived}</p>
                            <p className="text-gray-400">هدایای دریافتی</p>
                        </div>
                    </div>
                </div>

                <p className="text-gray-300 text-center">
                    برای دریافت هدیه، پست زیر که با لینک اختصاصی شما هست را به یک دوست علاقه‌مند به فتوشاپ ارسال کنید. پس از عضویت دوست شما از طریق این لینک، هدیه برای شما فعال می‌شود.
                </p>
                <p className="text-sm text-gray-400 text-center">این در راستای حمایت شما از مدرسه پولسازی با فتوشاپ است و برای ما بسیار ارزشمند است.</p>
                
                <div className="border border-dashed border-gray-600 rounded-xl p-4 mt-4">
                    <p className="text-center mb-4 font-semibold text-gray-200">این بنر را برای دوستانت بفرست 👇</p>
                    <img src={adminSettings.referralBannerImage} alt="Referral Banner" className="rounded-lg w-full object-cover" />
                    <p className="mt-4 text-gray-300">{adminSettings.referralBannerText}</p>
                    <div className="mt-4 bg-gray-900 p-3 rounded-lg text-center">
                        <p className="text-cyan-400 break-all font-mono">
                           {`${window.location.origin}/?ref=${currentUser.id}`}
                        </p>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default UserView;