// components/dashboard/WorkerZoneCard.jsx
import { MapPin, Bike, Building2 } from "lucide-react";

export default function WorkerZoneCard({ data = {}, lang = "en", t = () => "" }) {
  const {
    name = "Rahul Kumar",
    zone = "Andheri West",
    platform = "Zomato",
    
    status = "active",
    phone = "+91 98765 43210",
    memberSince = "June 2024",
  } = data;

  // const vehicleEmoji = {
  //   bicycle: "🚲",
  //   scooter: "🛵",
  //   motorcycle: "🏍️",
  //   cycle_ev: "⚡",
  // }[vehicle] || "🛵";

  return (
    <div className="glass-card gradient-border rounded-2xl p-6 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">
            {t("workerProfile", lang)}
          </p>
          <h3 className="font-display text-xl font-semibold text-white">{name}</h3>
          <p className="text-slate-400 text-sm mt-0.5">{phone}</p>
        </div>
        <span className={status === "active" ? "badge-active" : "badge-inactive"}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {status === "active" ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 bg-navy-800/60 rounded-xl px-4 py-3">
          <MapPin className="w-4 h-4 text-rain-400 flex-shrink-0" />
          <div>
            <p className="text-slate-400 text-xs">{t("deliveryZone", lang)}</p>
            <p className="text-white font-medium text-sm">{zone}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* <div className="flex items-center gap-3 bg-navy-800/60 rounded-xl px-4 py-3"> */}
            {/* <span className="text-xl">{vehicleEmoji}</span> */}
            {/* <div> */}
              {/* <p className="text-slate-400 text-xs">{t("vehicle", lang)}</p> */}
              {/* <p className="text-white font-medium text-sm capitalize">{vehicle}</p> */}
            {/* </div> */}
          {/* </div> */}
          <div className="flex items-center gap-3 bg-navy-800/60 rounded-xl px-4 py-3">
            <Building2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-slate-400 text-xs">{t("platform", lang)}</p>
              <p className="text-white font-medium text-sm">{platform}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-navy-800/60 rounded-xl px-4 py-3">
          <span className="text-slate-400 text-xs">{t("memberSince", lang)}</span>
          <span className="text-white text-sm font-medium">{memberSince}</span>
        </div>
      </div>
    </div>
  );
}
