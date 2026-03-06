export default function TabSkeleton() {
  return (
    <div className="px-5 pt-4 pb-6 space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl animate-pulse"
          style={{
            height: "80px",
            background: "rgba(26,61,99,0.4)",
            border: "1px solid rgba(179,207,229,0.08)",
            borderLeft: "3px solid rgba(74,127,167,0.3)",
          }}
        />
      ))}
    </div>
  );
}
