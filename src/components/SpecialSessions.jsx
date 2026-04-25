import PageLayout from "./PageLayout";
import { Star, Users, Target, BookOpen } from "lucide-react";
import { useYear } from "../context/yearContext";
import conferenceData from "../content/conferenceData";

function SpecialSessions() {
  const { selectedYear } = useYear();
  const yearData = conferenceData[selectedYear];
  const ssData = yearData?.specialSessions;

  if (!ssData) {
    return (
      <PageLayout 
        title="Special Sessions"
        subtitle="Focused sessions on cutting-edge AI topics"
      >
        <div className="linear-card p-12">
          <div className="flex flex-col items-center justify-center text-center min-h-[400px]">
            <Star size={64} className="text-[#c9a86a] mb-6" />
            <h2 className="text-3xl font-bold text-zinc-950 dark:text-zinc-100 mb-4">
              Special Sessions Coming Soon
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Special sessions will feature focused discussions on cutting-edge topics in applied artificial intelligence. Details about session topics, organizers, and submission guidelines will be announced soon.
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Special Sessions"
      subtitle={`Collaborative and technical tracks for 2AI-${selectedYear}`}
    >
      <div className="space-y-8">
        {/* Overview Section */}
        <div className="linear-card p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Star size={24} />
            </div>
            <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-100">Overview</h2>
          </div>
          <p className="text-zinc-700 dark:text-zinc-400 leading-relaxed text-lg">
            {ssData.overview}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Invited Participants */}
          <div className="linear-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-100">Invited Participants</h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ssData.invitedParticipants.map((p, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Purpose Section */}
          <div className="linear-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-100">Purpose</h3>
            </div>
            <ul className="space-y-4">
              {ssData.purposes.map((purpose, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                  <div className="mt-1 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                    <CheckCircle size={12} />
                  </div>
                  {purpose}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Publication Section */}
        <div className="linear-card p-8 border-l-4 border-amber-500/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <BookOpen size={24} />
            </div>
            <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-100">Publication Opportunity</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-amber-500/[0.03] dark:bg-amber-500/[0.06] p-5 border border-amber-500/10">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2 uppercase tracking-widest">Pre-Conference</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{ssData.publication.proceedings}</p>
            </div>
            <div className="bg-amber-500/[0.03] dark:bg-amber-500/[0.06] p-5 border border-amber-500/10">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2 uppercase tracking-widest">Final Publication</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{ssData.publication.submission}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-600/5 dark:bg-purple-400/5 border border-purple-500/20 p-8 text-center">
          <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-wide">Conduct a Special Session</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">We were open to proposals for conducting Special Sessions during 2AI-2024.</p>
          <div className="inline-block bg-purple-600/50 dark:bg-purple-400/20 text-purple-700 dark:text-purple-300 px-6 py-2 border border-purple-500/30 font-bold cursor-not-allowed uppercase tracking-widest text-xs">
            Call for Proposals Closed
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// Internal component for check icon
function CheckCircle({ size }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default SpecialSessions;

