import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, Users, IndianRupee, Search, Mail, Calendar, Sparkles } from "lucide-react";
import { api } from "../services/api";
import { ClayCard } from "../components/ui/ClayCard";
import { ClayInput } from "../components/ui/ClayInput";
import { ClayBadge } from "../components/ui/ClayBadge";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AdminMetrics {
  totalRevenue: number;
  activePremiumUsers: number;
}

export default function AdminDashboard() {
  const [search, setSearch] = useState("");

  const { data: users, isLoading: loadingUsers } = useQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: async () => (await api.get("/admin/users")).data.data,
  });

  const { data: metrics, isLoading: loadingMetrics } = useQuery<AdminMetrics>({
    queryKey: ["admin-metrics"],
    queryFn: async () => (await api.get("/admin/revenue")).data.data,
  });

  const filteredUsers = users?.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold flex items-center gap-2">
          <Shield className="text-primary" /> Admin Control Center
        </h1>
        <p className="text-sm text-muted">Monitor placement metrics, user accounts, and platform subscription metrics.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        <ClayCard className="flex items-center gap-4">
          <div className="clay-inset rounded-clay-sm p-3.5 text-primary">
            <IndianRupee size={22} />
          </div>
          <div>
            <p className="text-2xl font-mono font-bold">
              {loadingMetrics ? "..." : `₹${(metrics?.totalRevenue ?? 0) / 100}`}
            </p>
            <p className="text-xs text-muted font-medium">Total Platform Revenue</p>
          </div>
        </ClayCard>

        <ClayCard className="flex items-center gap-4">
          <div className="clay-coin w-12 h-12 rounded-full grid place-items-center text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-2xl font-mono font-bold">
              {loadingMetrics ? "..." : metrics?.activePremiumUsers ?? 0}
            </p>
            <p className="text-xs text-muted font-medium">Active Premium Subscriptions</p>
          </div>
        </ClayCard>

        <ClayCard className="flex items-center gap-4 sm:col-span-2 md:col-span-1">
          <div className="clay-inset rounded-clay-sm p-3.5 text-sprout">
            <Users size={22} />
          </div>
          <div>
            <p className="text-2xl font-mono font-bold">
              {loadingUsers ? "..." : users?.length ?? 0}
            </p>
            <p className="text-xs text-muted font-medium">Total Registered Users</p>
          </div>
        </ClayCard>
      </div>

      {/* Users Database */}
      <ClayCard className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-surfaceDeep pb-4">
          <h2 className="font-display text-lg font-bold text-ink">User Database</h2>
          <div className="w-64 relative">
            <ClayInput
              placeholder="Search user or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
            <Search size={14} className="absolute left-3 top-3.5 text-muted" />
          </div>
        </div>

        {loadingUsers ? (
          <p className="p-6 text-center text-muted">Retrieving user profiles...</p>
        ) : filteredUsers?.length === 0 ? (
          <p className="p-6 text-center text-muted">No matching users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-surfaceDeep text-xs font-mono uppercase text-muted">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">Account ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surfaceDeep text-ink">
                {filteredUsers?.map((u) => (
                  <tr key={u.id} className="hover:bg-surfaceLight transition-colors">
                    <td className="py-4 px-4 flex flex-col">
                      <span className="font-semibold text-sm">{u.name}</span>
                      <span className="text-xs text-muted flex items-center gap-1 mt-0.5">
                        <Mail size={12} /> {u.email}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <ClayBadge
                        tone={
                          u.role === "ADMIN"
                            ? "violet"
                            : u.role === "PREMIUM"
                            ? "ember"
                            : "sprout"
                        }
                      >
                        {u.role}
                      </ClayBadge>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-muted truncate max-w-[120px]">
                      {u.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ClayCard>
    </div>
  );
}
