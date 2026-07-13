"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  User, Package, MapPin, LogOut, Edit3,
  CheckCircle, Clock, Truck, ChevronRight, Loader2
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Link from "next/link";

const tabs = ["Orders", "Profile", "Address"] as const;
type Tab = typeof tabs[number];

const statusColors: Record<string, string> = {
  CONFIRMED: "text-green-400",
  PENDING: "text-yellow-400",
  PROCESSING: "text-blue-400",
  SHIPPED: "text-purple-400",
  DELIVERED: "text-green-500",
  CANCELLED: "text-red-400",
};

const statusIcons: Record<string, React.ElementType> = {
  CONFIRMED: CheckCircle,
  PENDING: Clock,
  PROCESSING: Loader2,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: Clock,
};

export function ProfileContent() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("Orders");
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [saving, setSaving] = useState(false);

  // Get Supabase user
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setLoading(false);
      // Prefill from user metadata if available
      setProfile((p) => ({
        ...p,
        fullName: user.user_metadata?.full_name ?? "",
        phone: user.user_metadata?.phone ?? "",
      }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push("/login");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  // Load orders when tab changes
  useEffect(() => {
    if (activeTab === "Orders" && user) {
      setOrdersLoading(true);
      fetch(`/api/orders/user?email=${encodeURIComponent(user.email ?? "")}`)
        .then((r) => r.json())
        .then((data) => setOrders(Array.isArray(data) ? data : []))
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab, user]);

  async function handleSignOut() {
    await signOut();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.updateUser({
        data: { full_name: profile.fullName, phone: profile.phone },
      });
      // Save to our DB
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, email: user?.email, userId: user?.id }),
      });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-obsidian-light border-t-crimson rounded-full animate-spin" />
      </div>
    );
  }

  // User ID display (short version)
  const userId = user?.id?.slice(0, 8).toUpperCase() ?? "XXXXXXXX";

  return (
    <div className="min-h-screen bg-obsidian py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-obsidian-mid border border-obsidian-light p-6 mb-6 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-crimson rounded-full flex items-center justify-center font-black text-pearl text-xl">
              {(profile.fullName || user?.email || "U")[0].toUpperCase()}
            </div>
            <div>
              <p className="font-black text-pearl text-lg tracking-wide">
                {profile.fullName || "My Account"}
              </p>
              <p className="text-pearl/60 text-sm">{user?.email}</p>
              {/* Personal ID */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-pearl/40 tracking-widest uppercase">ID:</span>
                <span className="text-[11px] font-black text-sand tracking-[0.2em] bg-sand/10 px-2 py-0.5 border border-sand/20">
                  RJ-{userId}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 border border-obsidian-light text-pearl/60 hover:text-pearl hover:border-pearl text-xs font-bold tracking-widest uppercase px-4 py-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> LOGOUT
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-obsidian-light mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-black tracking-widest uppercase transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-crimson text-pearl"
                  : "border-transparent text-pearl/50 hover:text-pearl"
              }`}
            >
              {tab === "Orders" && <Package className="w-3.5 h-3.5" />}
              {tab === "Profile" && <User className="w-3.5 h-3.5" />}
              {tab === "Address" && <MapPin className="w-3.5 h-3.5" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === "Orders" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {ordersLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-obsidian-light border-t-crimson rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 border border-obsidian-light bg-obsidian-mid">
                <Package className="w-12 h-12 text-obsidian-light mx-auto mb-3" />
                <p className="text-pearl/60 text-sm font-bold tracking-wider uppercase">No orders yet</p>
                <p className="text-pearl/40 text-xs mt-1">Start shopping to see your orders here</p>
                <Link
                  href="/store"
                  className="inline-block mt-4 bg-crimson hover:bg-crimson-mid text-pearl text-xs font-black tracking-widest uppercase px-6 py-2.5 transition-colors"
                >
                  SHOP NOW
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order: Record<string, unknown>) => {
                  const StatusIcon = statusIcons[order.status as string] ?? Clock;
                  const items = order.items as Record<string, unknown>[];
                  return (
                    <div key={order.id as string} className="bg-obsidian-mid border border-obsidian-light p-5">
                      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                        <div>
                          <p className="text-[10px] text-pearl/40 tracking-widest uppercase">Order ID</p>
                          <p className="text-crimson font-black tracking-wider text-sm">
                            {order.orderNumber as string}
                          </p>
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-bold tracking-wider ${
                          order.status === "CONFIRMED" ? "text-emerald-400" :
                          order.status === "PENDING" ? "text-sand" :
                          order.status === "PROCESSING" ? "text-blue-400" :
                          order.status === "SHIPPED" ? "text-purple-400" :
                          order.status === "DELIVERED" ? "text-emerald-300" :
                          "text-crimson"
                        }`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {order.status as string}
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-pearl/40 tracking-widest uppercase">Total</p>
                          <p className="text-pearl font-black">{formatPrice(order.total as number)}</p>
                        </div>
                      </div>

                      {/* Order items preview */}
                      <div className="flex gap-2 flex-wrap">
                        {items?.slice(0, 3).map((item: Record<string, unknown>, i: number) => (
                          <div key={i} className="relative w-12 h-14 bg-obsidian-light overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image as string}
                              alt={item.name as string}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        ))}
                        {items?.length > 3 && (
                          <div className="w-12 h-14 bg-obsidian-light flex items-center justify-center text-xs text-pearl/40 font-bold">
                            +{items.length - 3}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-obsidian-light">
                        <p className="text-[10px] text-pearl/40">
                          {new Date(order.createdAt as string).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </p>
                        <button className="flex items-center gap-1 text-xs text-pearl/50 hover:text-pearl transition-colors">
                          View Details <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === "Profile" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <form onSubmit={handleSaveProfile} className="bg-obsidian-mid border border-obsidian-light p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Edit3 className="w-4 h-4 text-crimson" />
                <h2 className="text-sm font-black tracking-widest uppercase text-pearl">Personal Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-pearl/60 mb-1.5">
                    Full Name
                  </label>
                  <input
                    value={profile.fullName}
                    onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                    className="w-full bg-obsidian border border-obsidian-light text-pearl text-sm px-4 py-3 focus:outline-none focus:border-sand"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-pearl/60 mb-1.5">
                    Email
                  </label>
                  <input
                    value={user?.email ?? ""}
                    disabled
                    className="w-full bg-obsidian-light/30 border border-obsidian-light text-pearl/50 text-sm px-4 py-3 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-pearl/60 mb-1.5">
                    Phone
                  </label>
                  <input
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-obsidian border border-obsidian-light text-pearl text-sm px-4 py-3 focus:outline-none focus:border-sand"
                    placeholder="10-digit number"
                    maxLength={10}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-pearl/60 mb-1.5">
                    Member Since
                  </label>
                  <input
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN") : ""}
                    disabled
                    className="w-full bg-obsidian-light/30 border border-obsidian-light text-pearl/50 text-sm px-4 py-3 cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-crimson hover:bg-crimson-mid disabled:opacity-50 text-pearl text-xs font-black tracking-widest uppercase px-8 py-3 transition-colors"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                SAVE CHANGES
              </button>
            </form>
          </motion.div>
        )}

        {/* Address Tab */}
        {activeTab === "Address" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <form onSubmit={handleSaveProfile} className="bg-obsidian-mid border border-obsidian-light p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-crimson" />
                <h2 className="text-sm font-black tracking-widest uppercase text-pearl">Saved Address</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-pearl/60 mb-1.5">Address</label>
                  <input
                    value={profile.address}
                    onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                    className="w-full bg-obsidian border border-obsidian-light text-pearl text-sm px-4 py-3 focus:outline-none focus:border-sand"
                    placeholder="Street address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-pearl/60 mb-1.5">City</label>
                    <input
                      value={profile.city}
                      onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                      className="w-full bg-obsidian border border-obsidian-light text-pearl text-sm px-4 py-3 focus:outline-none focus:border-sand"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-pearl/60 mb-1.5">State</label>
                    <input
                      value={profile.state}
                      onChange={(e) => setProfile((p) => ({ ...p, state: e.target.value }))}
                      className="w-full bg-obsidian border border-obsidian-light text-pearl text-sm px-4 py-3 focus:outline-none focus:border-sand"
                      placeholder="State"
                    />
                  </div>
                </div>
                <div className="w-1/2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-pearl/60 mb-1.5">PIN Code</label>
                  <input
                    value={profile.pincode}
                    onChange={(e) => setProfile((p) => ({ ...p, pincode: e.target.value }))}
                    className="w-full bg-obsidian border border-obsidian-light text-pearl text-sm px-4 py-3 focus:outline-none focus:border-sand"
                    placeholder="6-digit PIN"
                    maxLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-crimson hover:bg-crimson-mid disabled:opacity-50 text-pearl text-xs font-black tracking-widest uppercase px-8 py-3 transition-colors"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                SAVE ADDRESS
              </button>
            </form>
          </motion.div>
        )}

      </div>
    </div>
  );
}
