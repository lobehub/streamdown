import { BentoCard, BentoGrid } from "@lobehub/ui/awesome";

import {
  CodeFenceDemo,
  HeroStreamDemo,
  LatexDemo,
  ProfilerDemo,
  RemendDemo,
  WordFadeDemo,
} from "./demos";
import { renderLink } from "./renderLink";

export function BentoGallery() {
  return (
    <BentoGrid>
      <BentoCard
        colSpan={2}
        hint={"GFM · code · math"}
        href={"/components/streamdown"}
        renderLink={renderLink}
        rowSpan={2}
        title={"<Streamdown />"}
      >
        <HeroStreamDemo />
      </BentoCard>
      <BentoCard
        colSpan={2}
        hint={"latexGuard"}
        href={"/guide/latex"}
        renderLink={renderLink}
        title={"LaTeX that never flashes"}
      >
        <LatexDemo />
      </BentoCard>
      <BentoCard
        hint={"granularity"}
        href={"/guide/animation"}
        renderLink={renderLink}
        title={"Word fade"}
      >
        <WordFadeDemo />
      </BentoCard>
      <BentoCard
        hint={"raw → rendered"}
        href={"/guide/remend"}
        renderLink={renderLink}
        title={"remend"}
      >
        <RemendDemo />
      </BentoCard>
      <BentoCard
        colSpan={2}
        hint={"open fences render as code"}
        href={"/guide/code-fences"}
        renderLink={renderLink}
        title={"Code fences"}
      >
        <CodeFenceDemo />
      </BentoCard>
      <BentoCard
        colSpan={2}
        hint={"@lobehub/streamdown/profiler"}
        href={"/components/profiler"}
        renderLink={renderLink}
        title={"Profiler"}
      >
        <ProfilerDemo />
      </BentoCard>
    </BentoGrid>
  );
}
