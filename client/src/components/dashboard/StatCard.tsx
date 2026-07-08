type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:border-cyan-500">
      <h3 className="text-sm text-slate-400">{title}</h3>

      <p className="mt-3 text-3xl font-bold text-white">
        {value}
      </p>

      {subtitle && (
        <p className="mt-2 text-sm text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}