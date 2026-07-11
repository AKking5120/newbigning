"use client";

const announcements = [
  "🚚 FREE SHIPPING ON ORDERS OVER ₹2,000",
  "🔥 LAUNCH OFFER: EXTRA 10% OFF | CODE: SUMMIT10",
  "🔄 30-DAY RETURNS & EASY EXCHANGES",
  "✨ NEW ARRIVALS: SUMMER COLLECTION NOW LIVE",
  "💳 EMI AVAILABLE ON ALL ORDERS ABOVE ₹3,000",
];

export function AnnouncementBar() {
  const content = [...announcements, ...announcements];

  return (
    <div className="bg-zinc-900 border-b border-zinc-800 py-2 overflow-hidden">
      <div className="ticker-wrap">
        <div className="ticker-content">
          {content.map((item, i) => (
            <span key={i} className="text-xs font-semibold tracking-widest text-white mx-12">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
