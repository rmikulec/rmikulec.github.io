import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a project's markdown `description`. Kept dependency-light and styled
 * with utility classes (no @tailwindcss/typography plugin required).
 */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-4 text-slate-200/90 leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p) => <h1 className="text-2xl font-bold text-white mt-6 mb-2" {...p} />,
          h2: (p) => <h2 className="text-xl font-semibold text-white mt-6 mb-2" {...p} />,
          h3: (p) => <h3 className="text-lg font-semibold text-white mt-4 mb-1" {...p} />,
          p: (p) => <p className="text-slate-200/90" {...p} />,
          a: (p) => (
            <a
              className="text-sky-400 underline underline-offset-2 hover:text-sky-300"
              target="_blank"
              rel="noopener noreferrer"
              {...p}
            />
          ),
          ul: (p) => <ul className="list-disc pl-6 space-y-1" {...p} />,
          ol: (p) => <ol className="list-decimal pl-6 space-y-1" {...p} />,
          code: (p) => (
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-sky-200" {...p} />
          ),
          pre: (p) => (
            <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 text-sm" {...p} />
          ),
          blockquote: (p) => (
            <blockquote className="border-l-2 border-sky-500/50 pl-4 italic text-slate-300" {...p} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
