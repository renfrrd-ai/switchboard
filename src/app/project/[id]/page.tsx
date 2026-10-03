import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";

// Projects are saved on the device, so these pages have nothing to index.
export const metadata: Metadata = { title: "Project", robots: { index: false } };

export default async function Page({ params }: PageProps<"/project/[id]">) {
  const { id } = await params;
  return <ProjectPage id={id} />;
}
