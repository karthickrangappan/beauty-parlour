import React from "react";
import { Search } from "lucide-react";

const UserSection = ({ users, userSearch, setUserSearch, updateUserRole }) => {
  const [sortBy, setSortBy] = React.useState("newest");

  const sortedUsers = [...users]
    .filter(
      (u) =>
        !userSearch ||
        (u.name || u.displayName)
          ?.toLowerCase()
          .includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "alphabetical") return (a.name || a.displayName || "").localeCompare(b.name || b.displayName || "");
      if (sortBy === "points-high") return (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0);
      if (sortBy === "points-low") return (a.loyaltyPoints || 0) - (b.loyaltyPoints || 0);
      return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-8 gap-4">
        <div className="flex flex-1 gap-4 items-center">
          <div className="relative flex-1 max-w-none sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search Name or Email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full bg-white border border-neutral-100 py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-gold-500"
            />
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="hidden md:block bg-white border border-neutral-100 px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-neutral-500 focus:outline-none focus:border-gold-500"
          >
            <option value="newest">Latest Joiners</option>
            <option value="alphabetical">A - Z Order</option>
            <option value="points-high">Points: High to Low</option>
            <option value="points-low">Points: Low to High</option>
          </select>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 hidden md:block">
          {sortedUsers.length} registered accounts
        </p>
      </div>


      <div className="bg-white border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh] custom-scrollbar pb-2">
          <table className="w-full text-left min-w-[700px]">

          <thead className="bg-cream-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                UID
              </th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Name / Email
              </th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Points
              </th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Role
              </th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-sm">
            {sortedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500">
                    {u.id.slice(0, 10)}…
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-neutral-800 font-medium">
                      {u.name || u.displayName || "—"}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      {u.email}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gold-600 font-medium">
                    {u.loyaltyPoints ?? 0}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${u.role === "admin" ? "bg-violet-100 text-violet-700" : "bg-neutral-100 text-neutral-600"}`}
                    >
                      {u.role || "customer"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role || "customer"}
                      onChange={(e) => updateUserRole(u.id, e.target.value)}
                      className="text-xs border border-neutral-200 bg-white p-1 text-neutral-600 focus:outline-none"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-neutral-400 text-sm italic"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

    </div>
  );
};

export default UserSection;
