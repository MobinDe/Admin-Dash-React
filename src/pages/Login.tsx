import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Zap, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/'); // هدایت به داشبورد
    } catch {
      // خطا توسط هوک مدیریت می‌شود
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* لوگو و عنوان */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">ورود به ادمین پنل</h1>
          <p className="text-gray-400 mt-2">فروشگاه آنلاین</p>
        </div>

        {/* فرم ورود */}
        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl space-y-5">
          {/* پیام خطا */}
          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* فیلد ایمیل */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">ایمیل</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                required
                className="w-full bg-gray-700 text-gray-100 placeholder-gray-400 rounded-lg py-2.5 pl-10 pr-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* فیلد رمز */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">رمز عبور</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-gray-700 text-gray-100 placeholder-gray-400 rounded-lg py-2.5 pl-10 pr-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* دکمه ورود */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                در حال ورود...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                ورود
              </>
            )}
          </button>

          {/* اطلاعات آزمایشی */}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <p className="text-xs text-gray-500 mb-2">اطلاعات تست (هر یک از کاربران داخل db.json)</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div className="bg-gray-700/50 p-2 rounded-lg">
                <span className="text-gray-500">مدیر:</span> sara@example.com
              </div>
              <div className="bg-gray-700/50 p-2 rounded-lg">
                <span className="text-gray-500">رمز:</span> 123456
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}