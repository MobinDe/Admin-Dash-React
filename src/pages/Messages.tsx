import { useState } from 'react';

interface Message {
  id: number;
  sender: string;
  email: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  reply: string | null;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    sender: 'سارا احمدی',
    email: 'sara@example.com',
    subject: 'مشکل در ثبت سفارش',
    body: 'سلام، من دیروز سفارش ثبت کردم ولی هنوز تأیید نشده. لطفاً پیگیری کنید.',
    date: '۱۴۰۳/۰۴/۱۵',
    read: false,
    reply: null,
  },
  {
    id: 2,
    sender: 'رضا محمدی',
    email: 'reza@example.com',
    subject: 'پیشنهاد همکاری',
    body: 'با عرض سلام و احترام، در زمینه فروش محصولات شما پیشنهاد همکاری دارم. لطفاً با من تماس بگیرید.',
    date: '۱۴۰۳/۰۴/۱۴',
    read: true,
    reply: 'ممنون از پیشنهاد شما، کارشناسان ما به زودی تماس خواهند گرفت.',
  },
  {
    id: 3,
    sender: 'علی قاسمی',
    email: 'ali@example.com',
    subject: 'سوال درباره گارانتی',
    body: 'مدت گارانتی هدفون بی‌سیم چقدره؟ و شرایط استفاده از آن چیست؟',
    date: '۱۴۰۳/۰۴/۱۳',
    read: false,
    reply: null,
  },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');

  // فیلتر پیام‌ها بر اساس جستجو (نام فرستنده یا موضوع)
  const filtered = messages.filter(
    (msg) =>
      msg.sender.includes(search) || msg.subject.includes(search)
  );

  // علامت‌گذاری به‌عنوان خوانده‌شده هنگام انتخاب
  const openMessage = (msg: Message) => {
    if (!msg.read) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
      );
    }
    setSelectedMessage(msg);
    setReplyText(''); // پاک کردن فیلد پاسخ
  };

  // بستن جزئیات
  const closeMessage = () => {
    setSelectedMessage(null);
    setReplyText('');
  };

  // ارسال پاسخ
  const handleReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === selectedMessage.id ? { ...m, reply: replyText } : m
      )
    );
    setSelectedMessage((prev) => (prev ? { ...prev, reply: replyText } : null));
    setReplyText('');
  };

  // حذف پیام
  const handleDelete = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 p-4 md:p-6 space-y-6">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-100">✉️ پیام‌ها</h1>
        <span className="text-sm text-gray-400">
          {messages.filter((m) => !m.read).length} پیام خوانده‌نشده
        </span>
      </div>

      {/* جستجو */}
      <div className="relative">
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="جستجو در پیام‌ها..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-700 text-gray-100 placeholder-gray-400 rounded-lg py-2.5 pr-10 pl-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* لیست پیام‌ها */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-8">هیچ پیامی یافت نشد.</p>
        ) : (
          filtered.map((msg) => (
            <div
              key={msg.id}
              onClick={() => openMessage(msg)}
              className={`bg-gray-750 border border-gray-700 rounded-xl p-4 cursor-pointer transition-colors hover:bg-gray-700/50 ${
                !msg.read ? 'border-indigo-500/50' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-200">{msg.sender}</h3>
                    {!msg.read && (
                      <span className="w-2 h-2 bg-indigo-400 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{msg.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">{msg.date}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(msg.id);
                  }}
                  className="text-red-400 hover:text-red-300 text-sm flex-shrink-0"
                >
                  حذف
                </button>
              </div>
              {/* پاسخ موجود (اگر داشته باشد) */}
              {msg.reply && (
                <div className="mt-2 bg-indigo-900/20 border border-indigo-800 rounded-lg p-2">
                  <p className="text-xs text-indigo-300">پاسخ شما:</p>
                  <p className="text-sm text-gray-200">{msg.reply}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal جزئیات پیام و پاسخ */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-100">{selectedMessage.subject}</h2>
              <button
                onClick={closeMessage}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-gray-300 space-y-2">
              <p><span className="text-gray-400">فرستنده:</span> {selectedMessage.sender} ({selectedMessage.email})</p>
              <p><span className="text-gray-400">تاریخ:</span> {selectedMessage.date}</p>
              <div className="bg-gray-700 rounded-lg p-3 mt-2">
                <p className="whitespace-pre-wrap">{selectedMessage.body}</p>
              </div>
            </div>

            {/* بخش پاسخ */}
            <div className="mt-6">
              <label className="block text-sm text-gray-300 mb-1">پاسخ شما</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
                className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-lg p-2 text-sm"
                placeholder="پاسخ خود را بنویسید..."
              />
              <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                ارسال پاسخ
              </button>
            </div>

            {/* دکمه بستن */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeMessage}
                className="text-gray-400 hover:text-gray-200 text-sm"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}