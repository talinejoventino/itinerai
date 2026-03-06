import { MapPin } from "lucide-react";

export default function PlaceMarker({ emoji }: { emoji?: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        filter: "drop-shadow(0 3px 10px rgba(10,25,49,0.7))",
      }}
    >
      <div style={{ position: "relative", width: 44, height: 44 }}>
        <div
          className="animate-ping"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(179,207,229,0.25)",
            animationDuration: "1.5s",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 40,
            height: 40,
            borderRadius: "50% 50% 50% 0",
            transform: "translate(-50%, -62%) rotate(-45deg)",
            background: "linear-gradient(135deg, #B3CFE5 0%, #4A7FA7 100%)",
            border: "2.5px solid #fff",
            boxShadow: "0 0 20px rgba(179,207,229,0.5), 0 4px 14px rgba(10,25,49,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ transform: "rotate(45deg)", fontSize: 14, lineHeight: 1 }}>
            {emoji ?? <MapPin size={14} color="#0A1931" />}
          </span>
        </div>
      </div>
    </div>
  );
}
