// Edited by Milad Ajaz 
// https://m4milaad.github.io/ 

import { FileDown, MapPin, BookOpen, CalendarDays, BadgeCheck, Users, Globe, Mic } from "lucide-react";
import { useTheme } from "../context/themeContext";

const NotificationBar = () => {
  const { isDark } = useTheme();
  const items = [
    {
      icon: MapPin,
      text: "Exclusive Offer: Free one day local Kashmir trip for limited participants.",
      tone: "text-[#1A5C38]",
    },
    {
      icon: FileDown,
      text: "Download Conference Brochure",
      href: "/brochure.pdf",
      download: "2AI_2026_Brochure.pdf",
      tone: "text-[#E8A020]",
    },
    {
      icon: BookOpen,
      text: "Selected and presented papers will be considered for Springer CCIS proceedings (Scopus indexed).",
      tone: "text-[#7B4FFF]",
    },
    {
      icon: CalendarDays,
      text: "Pre-conference workshop: 17 June 2026 | Main conference: 18-19 June 2026.",
      tone: "text-[#0F766E]",
    },
    {
      icon: BadgeCheck,
      text: "Accepted papers must be presented by at least one registered author.",
      tone: "text-[#2563EB]",
    },
    {
      icon: Users,
      text: "Networking sessions with researchers, students, and industry delegates.",
      tone: "text-[#7C3AED]",
    },
    {
      icon: Globe,
      text: "Hybrid participation supported for both in-person and remote attendees.",
      tone: "text-[#0369A1]",
    },
    {
      icon: Mic,
      text: "Keynote and invited speaker tracks run across both conference days.",
      tone: "text-[#BE123C]",
    },
  ];

  const doubled = [...items, ...items];
  const shellClass = isDark
    ? "relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A] shadow-[0_10px_26px_rgba(0,0,0,0.32)]"
    : "relative overflow-hidden rounded-2xl border border-black/[0.08] bg-[#FFFDF7] shadow-sm";
  const glowClass = isDark
    ? "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(201,168,106,0.07),transparent_34%),radial-gradient(circle_at_88%_82%,rgba(94,106,210,0.08),transparent_36%)]"
    : "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(232,160,32,0.05),transparent_34%),radial-gradient(circle_at_88%_82%,rgba(123,79,255,0.04),transparent_36%)]";
  const baseItemClass = isDark
    ? "mx-2 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-1.5 text-sm md:text-[15px] font-medium text-zinc-200 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#c9a86a]/45 hover:bg-white/[0.09]"
    : "mx-2 inline-flex items-center gap-2 rounded-full border border-black/[0.1] bg-white px-4 py-1.5 text-sm md:text-[15px] font-medium text-zinc-800 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#E8A020]/45 hover:bg-white";

  return (
    <div className={shellClass}>
      <div className={glowClass} />

      <div className="notification-marquee relative flex w-max items-center whitespace-nowrap py-3 hover:[animation-play-state:paused]">
        {doubled.map((item, idx) => {
          const Icon = item.icon;

          if (item.href) {
            return (
              <a key={`${item.text}-${idx}`} href={item.href} download={item.download} className={`${baseItemClass} hover:text-[#E8A020]`}>
                <Icon size={16} className={`${item.tone} flex-shrink-0`} />
                {item.text}
              </a>
            );
          }

          return (
            <span key={`${item.text}-${idx}`} className={baseItemClass}>
              <Icon size={16} className={`${item.tone} flex-shrink-0`} />
              {item.text}
            </span>
          );
        })}
      </div>

    </div>
  );
};

export default NotificationBar;
