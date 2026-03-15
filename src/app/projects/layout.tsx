import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Pavan Jillella",
  description: "Open source tools, libraries, and applications built by Pavan Jillella.",
  openGraph: {
    title: "Projects | Pavan Jillella",
    description: "Open source tools, libraries, and applications.",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
