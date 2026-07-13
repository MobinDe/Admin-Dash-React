import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

interface Review {
  id: number;
  productId: number;
  productName: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  reply: string | null;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // پاسخ‌دهی
  const [replyText, setReplyText] = useState<{ [id: number]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);

  // دریافت داده‌ها
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get('/db.json');
        setReviews(data.reviews || []);
      } catch (err: any) {
        setError(err.message || 'خطا در دریافت نظرات');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // تغییر وضعیت (تأیید/رد)
  const updateStatus = (id: number, newStatus: 'approved' | 'rejected') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  // حذف نظر
  const deleteReview = (id: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // ارسال پاسخ
  const submitReply = (id: number) => {
    if (!replyText[id]?.trim()) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, reply: replyText[id] } : r
      )
    );
    setActiveReplyId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full ml-3" />
        در حال بارگذاری نظرات...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg">
        خطا: {error}
      </div>
    );
  }

  // رندر ستاره‌ها
  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-900/60 text-yellow-200',
      approved: 'bg-green-900/60 text-green-200',
      rejected: 'bg-red-900/60 text-red-200',
    };
    const labels: Record<string, string> = {
      pending: 'در انتظار',
      approved: 'تأیید شده',
      rejected: 'رد شده',
    };
    return (
      <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-800 p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">💬 مدیریت نظرات</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-400">هیچ نظری ثبت نشده است.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-750 border border-gray-700 rounded-xl p-4 md:p-5 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-200 font-semibold">{review.userName}</span>
                    <span className="text-gray-500 text-sm">برای {review.productName}</span>
                    <span className="text-yellow-300 text-sm">{renderStars(review.rating)}</span>
                    {statusBadge(review.status)}
                  </div>
                  <p className="text-gray-300 mt-2">{review.comment}</p>
                  <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                </div>
              </div>

              {/* پاسخ ادمین (اگر وجود داشته باشد) */}
              {review.reply && (
                <div className="bg-indigo-900/20 border border-indigo-800 rounded-lg p-3 mr-4">
                  <p className="text-xs text-indigo-300 mb-1">پاسخ ادمین:</p>
                  <p className="text-gray-200 text-sm">{review.reply}</p>
                </div>
              )}

              {/* عملیات */}
              <div className="flex items-center gap-2 flex-wrap">
                {review.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(review.id, 'approved')}
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-md text-xs"
                    >
                      تأیید
                    </button>
                    <button
                      onClick={() => updateStatus(review.id, 'rejected')}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md text-xs"
                    >
                      رد
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setActiveReplyId(activeReplyId === review.id ? null : review.id);
                    if (!replyText[review.id]) {
                      setReplyText({ ...replyText, [review.id]: review.reply || '' });
                    }
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-md text-xs"
                >
                  {review.reply ? 'ویرایش پاسخ' : 'پاسخ'}
                </button>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="text-red-400 hover:text-red-300 text-xs px-2"
                >
                  حذف
                </button>
              </div>

              {/* فیلد پاسخ */}
              {activeReplyId === review.id && (
                <div className="mt-3 flex gap-2">
                  <textarea
                    value={replyText[review.id] || ''}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [review.id]: e.target.value })
                    }
                    className="flex-1 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg p-2 text-sm"
                    rows={2}
                    placeholder="پاسخ خود را بنویسید..."
                  />
                  <button
                    onClick={() => submitReply(review.id)}
                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-md text-xs self-end"
                  >
                    ثبت
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}