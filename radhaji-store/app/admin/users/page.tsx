"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, User } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  createdAt: string;
  _count: { orders: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const r = await fetch(`/api/admin/users?${params}`);
    const data = await r.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">Users</h1>
          <p className="text-zinc-500 text-sm mt-1">{users.length} registered users</p>
        </div>
        <button onClick={fetchUsers} className="flex items-center gap-2 border border-zinc-700 text-zinc-400 hover:text-white px-4 py-2 text-xs font-bold tracking-widest uppercase transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm pl-9 pr-4 py-2.5 focus:outline-none focus:border-red-500 placeholder:text-zinc-600" />
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-red-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-600 text-sm">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950">
                  {["User", "Contact", "Location", "Orders", "Joined"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-black tracking-widest uppercase text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                          {(user.fullName || user.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-xs font-bold">{user.fullName ?? "—"}</p>
                          <p className="text-zinc-500 text-[10px]">RJ-{user.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-zinc-300 text-xs">{user.email}</p>
                      <p className="text-zinc-500 text-[10px]">{user.phone ?? "—"}</p>
                    </td>
                    <td className="px-5 py-4 text-zinc-400 text-xs">
                      {user.city && user.state ? `${user.city}, ${user.state}` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-red-600/20 text-red-400 text-[10px] font-black px-2 py-0.5 border border-red-600/30">
                        {user._count.orders} orders
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-500 text-xs whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
