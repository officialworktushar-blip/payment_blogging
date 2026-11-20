import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface LegacyCategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LegacyCategoryPage({ params }: LegacyCategoryPageProps) {
  const { slug } = await params;
  redirect(`/${slug}`);
}
