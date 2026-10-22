import { FeatureGrid, type FeatureGridItem } from "@lobehub/ui/awesome";
import { Activity, Rows2, Scan, Shield } from "lucide-react";

// Copy from the original site (f3ba7b3:site/src/sections/Features.tsx).
const FEATURES: FeatureGridItem[] = [
  {
    description: "Character or word granularity with three cadence presets.",
    icon: Activity,
    title: "Smooth reveal",
  },
  {
    description: "Finished blocks memoize. Only the tail block re-renders.",
    icon: Rows2,
    title: "Block cache",
  },
  {
    description:
      "Unbalanced delimiters stay inert until the stream closes them.",
    icon: Shield,
    title: "LaTeX guard",
  },
  {
    description:
      "No stylesheet, no component dependencies. Bring your own CSS.",
    icon: Scan,
    title: "Headless",
  },
];

export const Features = () => <FeatureGrid columns={4} items={FEATURES} />;
