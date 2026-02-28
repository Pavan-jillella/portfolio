import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const components = {
  h1: (props: any) => <h1 className="font-display font-bold text-3xl md:text-4xl text-white mt-12 mb-6" {...props} />,
  h2: (props: any) => <h2 className="font-display font-semibold text-2xl text-white mt-10 mb-4" {...props} />,
  h3: (props: any) => <h3 className="font-display font-semibold text-xl text-white mt-8 mb-3" {...props} />,
  p: (props: any) => <p className="font-body text-white/60 leading-relaxed mb-6" {...props} />,
  a: (props: any) => <a className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-2 border-blue-500/40 pl-6 my-6 italic text-white/50" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside space-y-2 mb-6 text-white/60" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside space-y-2 mb-6 text-white/60" {...props} />,
  pre: (props: any) => <pre className="glass-card rounded-2xl p-5 overflow-x-auto mb-6 text-sm" {...props} />,
  code: (props: any) => {
    const isInline = !props.className;
    if (isInline) {
      return <code className="bg-white/8 rounded px-1.5 py-0.5 text-sm font-mono text-blue-300" {...props} />;
    }
    return <code className="font-mono text-sm" {...props} />;
  },
  img: (props: any) => <img className="rounded-2xl my-8 w-full" {...props} />,
  hr: () => <hr className="border-white/5 my-10" />,
  table: (props: any) => <div className="overflow-x-auto mb-6"><table className="w-full text-sm text-white/60" {...props} /></div>,
  th: (props: any) => <th className="text-left font-semibold text-white/80 p-2 border-b border-white/10" {...props} />,
  td: (props: any) => <td className="p-2 border-b border-white/5" {...props} />,
};

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose-custom">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
          },
        }}
      />
    </div>
  );
}
