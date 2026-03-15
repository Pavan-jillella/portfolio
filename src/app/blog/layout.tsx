import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Pavan Jillella",
  description: "Thoughts on technology, education, and finance. Written to clarify my own thinking and share what I learn.",
  openGraph: {
    title: "Blog | Pavan Jillella",
    description: "Thoughts on technology, education, and finance.",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
