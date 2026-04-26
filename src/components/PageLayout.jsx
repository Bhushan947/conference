// Edited by Milad Ajaz 
// https://m4milaad.github.io/ 

import Navbar from "./Navbar";
import { useYear } from "../context/yearContext";

function PageLayout({ children, title, subtitle, showHeader = true }) {
  const { selectedYear } = useYear();
  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Navbar />
      
      {showHeader && (
        <div className="border-b border-black/[0.06] bg-white/45 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-12 md:py-14">
            <p className="terminal-label mb-4 text-zinc-600">2AI-{selectedYear} · Conference Section</p>
            <h1 className="text-3xl font-bold text-zinc-950 md:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-700 md:text-lg">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-7xl px-6 py-10 md:py-12">
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
