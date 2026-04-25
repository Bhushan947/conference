// Edited by Milad Ajaz 
// https://m4milaad.github.io/ 

import Navbar from "./Navbar";

function PageLayout({ children, title, subtitle, showHeader = true }) {
  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Navbar />
      
      {showHeader && (
        <div className="border-b border-black/[0.06] bg-white/45 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <p className="terminal-label mb-4">2AI-2026 · Conference Section</p>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-950 mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-zinc-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 w-full">
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
