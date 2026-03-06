import { Pin } from "lucide-react";

export default function CustomMarker() {
  return (
    <div className="relative w-10 h-10 cursor-pointer">
      <div
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: "rgba(74,127,167,0.3)", animationDuration: "2s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-9 h-9 border-2 border-white"
        style={{
          background: "linear-gradient(135deg, #4A7FA7 0%, #1A3D63 100%)",
          borderRadius: "50% 50% 50% 0",
          transform: "translate(-50%, -60%) rotate(-45deg)",
          boxShadow: "0 0 24px rgba(74,127,167,0.5), 0 4px 12px rgba(10,25,49,0.4)",
        }}
      />
      <div
        className="absolute text-sm z-10"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -70%)" }}
      >
        <Pin size={16} color="#fff" />
      </div>
    </div>
  );
}
