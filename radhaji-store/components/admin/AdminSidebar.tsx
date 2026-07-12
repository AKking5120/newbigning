"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Package,
  Users, Tag, LogOut, ExternalLink, Menu, X,
} from "lucide-react";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Categories", href: "/admin/categories", icon: Tag },
];

function SidebarInner({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-gray-200 flex-shrink-0">
        <Link href="/admin" onClick={onClose} className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-red-600 flex items-center justify-center font-black text-white text-sm rounded">
            R
          </div>
          <div>
            <p className="font-black text-gray-900 text-sm tracking-wider leading-none">WALKUS</p>
            <p className="text-[9px] text-gray-400 tracking-widest leading-none mt-0.5">ADMIN PANEL</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase px-3 mb-2">
          MAIN MENU
        </p>
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-red-50 text-red-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? "text-red-600" : "text-gray-400"}`} style={{ width: 18, height: 18 }} />
              {item.label}
              {active && (
                <div className="ml-auto w-1.5 h-1.5 bg-red-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-200 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <ExternalLink className="text-gray-400 flex-shrink-0" style={{ width: 18, height: 18 }} />
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="text-red-500 flex-shrink-0" style={{ width: 18, height: 18 }} />
          Logout
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-60 flex-shrink-0 h-screen sticky top-0">
        <SidebarInner />
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border border-gray-200 shadow p-2 rounded-lg text-gray-700"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <aside className="w-60 h-full shadow-xl">
            <SidebarInner onClose={() => setMobileOpen(false)} />
          </aside>
          <button
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 left-64 bg-white rounded-full p-1 shadow"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}
    </>
  );
}
