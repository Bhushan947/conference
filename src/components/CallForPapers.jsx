// Edited by Milad Ajaz 
// https://m4milaad.github.io/ 

import PageLayout from "./PageLayout";
import { FileText, Shield, Presentation, FileDown, ExternalLink } from "lucide-react";
import { useTheme } from "../context/themeContext";

function CallForPapers() {
  const { isDark } = useTheme();
  const pdfUrl = `${import.meta.env.BASE_URL}copyright.pdf`;
  const sections = [
    {
      id: 1,
      title: "Paper Submission Instructions",
      icon: <FileText className="w-6 h-6 text-[#E8A020]" />,
      content: (
        <ul className="list-disc list-inside space-y-2 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
          <li>All authors must comply with guidelines while preparing their manuscripts</li>
          <li>The images and tables must be self-drawn or must be used with proper permissions and copyrights</li>
          <li>All the equations used in the manuscript must be written using equation editor</li>
          <li>The similarity index/plagiarism should not be more than <strong>5%</strong> from a single source and must be less than <strong>15%</strong> (including self-plagiarism)</li>
          <li>It is mandatory to use Mendeley software for referencing in the manuscript</li>
          <li className="mt-3">
            <a
              href="https://cmt3.research.microsoft.com/AAI2026"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#5E6AD2] dark:text-[#c9a86a] font-semibold hover:underline"
            >
              Submit your paper via Microsoft CMT
              <ExternalLink size={14} />
            </a>
          </li>
        </ul>
      ),
    },
    {
      id: 2,
      title: "Copyright Form",
      icon: <Shield className="w-6 h-6 text-[#1A5C38]" />,
      content: (
        <ul className="list-disc list-inside space-y-2 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
          <li>You will have to send us the signed copy of Copyright form as a scanned PDF, after the acceptance of your manuscript</li>
          <li>The corresponding author should be available to check the paper before it is published</li>
          <li>Please note that once a paper has been delivered to Springer, changes relating to the authorship of the paper cannot be made</li>
          <li>Once paper is delivered to Springer Author's names cannot be added or deleted, their order cannot be changed, and the corresponding author cannot be altered</li>
          <li>The corresponding author signing the copyright form should match the corresponding author marked on the paper</li>
        </ul>
      ),
    },
    {
      id: 3,
      title: "Presentation Guidelines",
      icon: <Presentation className="w-6 h-6 text-[#7B4FFF]" />,
      content: (
        <div className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
          <p>Oral presentations should strictly comply with the content of the corresponding paper. The duration of the presentation will be determined before the event, authors will be informed with sufficient time.</p>
          <p className="mt-2">Speakers must be registered in the conference, just like any other attendee.</p>
        </div>
      ),
    },
    {
      id: 4,
      title: "Paper Template",
      icon: <FileDown className="w-6 h-6 text-[#5E6AD2]" />,
      content: (
        <div className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
          <p className="mb-3">
            Those who are interested in submitting their papers to the conference should use the{" "}
            <a
              href="https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5E6AD2] dark:text-[#c9a86a] font-semibold hover:underline"
            >
              CCIS SpringerNature
            </a>{" "}
            Template. You can also use{" "}
            <a
              href="https://www.overleaf.com/latex/templates/springer-conference-proceedings-template-updated-2022-01-12/wcvbtmwtykqj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5E6AD2] dark:text-[#c9a86a] font-semibold hover:underline"
            >
              Overleaf
            </a>{" "}
            for editing your article.
          </p>
          <p>The Full-Length Paper should not exceed 15 pages and the file size should not exceed 10 MB. Any submissions below 12 pages will be considered a Short Paper.</p>
        </div>
      ),
    }
  ];

  return (
    <PageLayout 
      title="Call For Papers"
      subtitle="Submit your original research to the 2026 International Conference on Applied Artificial Intelligence"
    >
      <div
        className={`mb-6 overflow-hidden rounded-2xl p-6 ${
          isDark
            ? "border border-[#7B4FFF]/55 bg-gradient-to-r from-[#0A0F1E] via-[#111831] to-[#1A1230] text-[#F0EDE6] shadow-[0_0_30px_rgba(123,79,255,0.24)]"
            : "border border-[#E8A020]/45 bg-gradient-to-r from-[#FFF8E8] via-[#F8F0DC] to-[#F4E7C7] text-zinc-900 shadow-[0_10px_30px_rgba(232,160,32,0.16)]"
        }`}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className={`text-xs uppercase tracking-[0.2em] ${isDark ? "text-[#E8A020]" : "text-[#1A5C38]"}`}>Call For Papers</p>
            <h3 className={`mt-2 text-2xl font-bold ${isDark ? "text-[#F0EDE6]" : "text-[#0A0F1E]"}`}>Paper Submission</h3>
            <p className={`mt-2 text-sm ${isDark ? "text-[#F0EDE6]/85" : "text-zinc-700"}`}>
              Authors are invited to submit original, unpublished research aligned with the conference tracks.
            </p>
          </div>
          <a
            href="https://cmt3.research.microsoft.com/AAI2026"
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center justify-center gap-2 rounded-md border px-5 py-2.5 text-sm font-semibold transition ${
              isDark
                ? "border-[#E8A020] bg-transparent text-[#E8A020] hover:bg-[#E8A020]/12"
                : "border-[#E8A020] bg-[#E8A020] text-[#0A0F1E] hover:brightness-105 hover:shadow-[0_6px_18px_rgba(232,160,32,0.35)]"
            }`}
          >
            Submit Paper via Microsoft CMT
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div
        className={`mb-6 rounded-2xl p-6 shadow-sm ${
          isDark
            ? "border border-white/15 bg-black"
            : "border border-[#E8A020]/18 bg-[#FFFEF8]"
        }`}
      >
        <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-100 mb-2">Copyright Form</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Download and review the copyright form. You can also view it directly below.
        </p>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#5E6AD2] dark:text-[#c9a86a] font-semibold hover:underline mb-4"
        >
          Open Copyright PDF
          <ExternalLink size={14} />
        </a>
        <div className={`rounded overflow-hidden ${isDark ? "border border-white/15" : "border border-black/15"}`}>
          <object data={pdfUrl} type="application/pdf" className="w-full h-[700px]">
            <embed src={pdfUrl} type="application/pdf" className="w-full h-[700px]" />
            <div className="p-4 text-sm text-zinc-700 dark:text-zinc-300">
              PDF preview is not available in this browser.{" "}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5E6AD2] dark:text-[#c9a86a] font-semibold underline"
              >
                Open or download the copyright form
              </a>
              .
            </div>
          </object>
        </div>
      </div>

      {/* Guidelines Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className={`rounded-2xl p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              isDark
                ? "border border-white/15 bg-black"
                : "border border-[#E8A020]/18 bg-[#FFFEF8]"
            }`}
          >
            <div className="mb-4 flex items-center gap-3 border-b border-black/15 pb-3 dark:border-white/15">
              {sec.icon}
              <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-100">
                {sec.title}
              </h3>
            </div>
            {sec.content}
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

export default CallForPapers;
