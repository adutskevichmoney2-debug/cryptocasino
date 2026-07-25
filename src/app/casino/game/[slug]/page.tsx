import { notFound } from "next/navigation";
import { GAMES, gameBySlug } from "@/lib/data/games";
import { GameView } from "@/components/casino/GameView";

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = gameBySlug(slug);
  if (!game) notFound();
  // key={slug} сбрасывает состояние (режим real/demo) при переходе между играми
  return <GameView key={slug} slug={slug} />;
}
