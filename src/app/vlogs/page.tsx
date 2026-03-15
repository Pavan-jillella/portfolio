import { redirect } from "next/navigation";

export default function VlogsRedirect() {
  redirect("/blog?tab=videos");
}
