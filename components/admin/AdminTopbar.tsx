"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";

const pageTitles: Record<string, string> = {
  "/admin": "Home",
  "/admin/orders": "Orders",
  "/admin/inventory": "Inventory",
  "/admin/products": "Products",
  "/admin/products/new": "Add Product",
  "/admin/users": "Users",
  "/admin/categories": "Category",
  "/admin/business": "Business Dashboard",
};

export function AdminTopbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const title = pageTitles[pathname] ?? "Admin";

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left — page title */}
      <div>
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-56">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-700 focus:outline-none placeholder:text-gray-400 w-full"
          />
        </div>

        {/* Bell */}
        <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-black">
            {user?.email?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">Admin</p>
            <p className="text-xs text-gray-500 truncate max-w-32">{user?.email ?? ""}</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden md:block" />
        </div>
      </div>
    </header>
  );
}
