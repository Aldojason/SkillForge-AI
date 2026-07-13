import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex flex-col gap-2 w-64 shrink-0 p-4">
        <div className="clay-raised rounded-clay p-4 flex flex-col gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton h-10 rounded-clay-sm" />
          ))}
        </div>
      </div>
      {/* Content skeleton */}
      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="skeleton h-8 w-48 rounded-clay-sm" />
          <div className="skeleton h-4 w-64 rounded" />
          <div className="grid sm:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
          <div className="skeleton h-32 rounded-clay" />
        </div>
      </div>
    </div>
  );
}

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSkeleton />;
  }
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
