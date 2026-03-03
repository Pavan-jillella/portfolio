import { redirect } from "next/navigation";

export default function AdminNewBlogPage() {
  redirect("/blog/write");
}
