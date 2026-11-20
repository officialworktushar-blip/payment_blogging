import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface LegacyPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LegacyPostPage({ params }: LegacyPostPageProps) {
  const { slug } = await params;
  redirect(`/blog/${slug}`);
}
