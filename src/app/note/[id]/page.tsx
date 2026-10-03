import type { Metadata } from "next";
import { NotePage } from "@/components/NotePage";

// Notes are saved on the device, so these pages have nothing to index.
export const metadata: Metadata = { title: "Note", robots: { index: false } };

export default async function Page({ params }: PageProps<"/note/[id]">) {
  const { id } = await params;
  return <NotePage key={id} id={id} />;
}
