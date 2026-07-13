import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Shield, Edit } from 'lucide-react';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // دریافت کاربر از localStorage (ذخیره‌شده توسط useAuth هنگام ورود)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch {
        setUser(null);
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-700 border border-gray-600 rounded-xl p-8 text-center max-w-md w-full">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-200 mb-2">وارد نشده‌اید</h2>
          <p className="text-gray-400 mb-6">برای مشاهده پروفایل خود ابتدا وارد شوید.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            رفتن به صفحه ورود
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* هدر */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-100">👤 پروفایل من</h1>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
            <Edit className="h-4 w-4" />
            ویرایش پروفایل
          </button>
        </div>

        {/* کارت اطلاعات */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div className="text-center sm:text-right">
              <h2 className="text-2xl font-bold text-gray-100">{user.name}</h2>
              <p className="text-gray-400 mt-1">{user.role === 'Admin' ? 'مدیر' : user.role === 'Editor' ? 'ویرایشگر' : 'بازدیدکننده'}</p>
              <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                user.status === 'Active' ? 'bg-green-900/60 text-green-200' : 'bg-red-900/60 text-red-200'
              }`}>
                <span className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-green-400' : 'bg-red-400'}`} />
                {user.status === 'Active' ? 'فعال' : 'غیرفعال'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-gray-700/50 p-4 rounded-lg">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">ایمیل</p>
                <p className="text-gray-200">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-700/50 p-4 rounded-lg">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">نقش</p>
                <p className="text-gray-200">
                  {user.role === 'Admin' ? 'مدیر' : user.role === 'Editor' ? 'ویرایشگر' : 'بازدیدکننده'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-700/50 p-4 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">تاریخ عضویت</p>
                <p className="text-gray-200">{user.joined}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-700/50 p-4 rounded-lg">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">شناسه کاربری</p>
                <p className="text-gray-200">#{user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}