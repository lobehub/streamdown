import { FeatureGrid, type FeatureGridItem } from "@lobehub/ui/awesome";
import {
  Activity,
  Blocks,
  Gauge,
  Paintbrush,
  Sigma,
  Sparkles,
} from "lucide-react";

import { renderLink } from "./renderLink";

const FEATURES: FeatureGridItem[] = [
  {
    description:
      "Finished blocks memoize, so each commit re-lexes and re-renders only the open tail.",
    href: "/guide/streaming",
    icon: Blocks,
    title: "Block cache",
  },
  {
    description:
      "Three presets turn bursty chunks into a steady reveal: realtime, balanced and silky.",
    href: "/guide/smooth-reveal",
    icon: Activity,
    title: "Smooth reveal",
  },
  {
    description:
      "New characters or words fade in through CSS animation-delay, not per-frame renders.",
    href: "/guide/animation",
    icon: Sparkles,
    title: "Per-character fade",
  },
  {
    description:
      "Incomplete formulas hold the last good frame, and preprocessLaTeX cleans model output.",
    href: "/guide/latex",
    icon: Sigma,
    title: "LaTeX guard",
  },
  {
    description:
      "No stylesheet and no component dependencies; swap elements through react-markdown components.",
    href: "/guide/getting-started",
    icon: Paintbrush,
    title: "Headless",
  },
  {
    description:
      "Measure root and block commit cost, reveal frames and input chunks in your own app.",
    href: "/components/profiler",
    icon: Gauge,
    title: "Built-in profiler",
  },
];

export function FeatureSection() {
  return <FeatureGrid items={FEATURES} renderLink={renderLink} />;
}
