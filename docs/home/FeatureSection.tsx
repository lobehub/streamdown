import { FeatureGrid, type FeatureGridItem } from "@lobehub/ui/awesome";
import {
  Activity,
  Blocks,
  Paintbrush,
  Sigma,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { renderLink } from "./renderLink";

const FEATURES: FeatureGridItem[] = [
  {
    description:
      "Unclosed bold, inline code and links render formatted from the first character.",
    href: "/features/incomplete-markdown",
    icon: WandSparkles,
    title: "Half-typed syntax",
  },
  {
    description:
      "Finished blocks are frozen and memoized; each commit re-parses only the open tail.",
    href: "/features/blocks",
    icon: Blocks,
    title: "Block cache",
  },
  {
    description:
      "Bursty chunks become a steady per-character flow: realtime, balanced or silky.",
    href: "/features/smooth-reveal",
    icon: Activity,
    title: "Smooth reveal",
  },
  {
    description:
      "New characters or words fade in through CSS animation-delay, not per-frame renders.",
    href: "/features/animation",
    icon: Sparkles,
    title: "Per-character fade",
  },
  {
    description:
      "Incomplete formulas hold the last good frame; preprocessLaTeX cleans model output.",
    href: "/content/latex",
    icon: Sigma,
    title: "LaTeX guard",
  },
  {
    description:
      "No stylesheet or highlighter bundled; bring react-markdown components and plugins.",
    href: "/content/components",
    icon: Paintbrush,
    title: "Headless",
  },
];

export function FeatureSection() {
  return <FeatureGrid items={FEATURES} renderLink={renderLink} />;
}
