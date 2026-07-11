import { Truck, ShieldCheck, Award, RefreshCw } from "lucide-react";

const items = [
  {
    icon: Truck,
    title: "FREE SHIPPING",
    sub: "On orders over ₹2,000",
  },
  {
    icon: ShieldCheck,
    title: "SECURE PAYMENT",
    sub: "100% secure checkout",
  },
  {
    icon: Award,
    title: "PREMIUM QUALITY",
    sub: "Engineered fabrics",
  },
  {
    icon: RefreshCw,
    title: "EASY RETURNS",
    sub: "30-day return policy",
  },
];

export function TrustBar() {
  return (
    <section className="bg-white text-black py-6 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <item.icon className="w-7 h-7 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-black tracking-widest uppercase">
                  {item.title}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
