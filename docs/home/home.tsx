import {
  ClaudeCode,
  Codex,
  Cursor,
  GithubCopilot,
  Windsurf,
} from "@lobehub/icons";
import {
  AgentSkillCard,
  InstallBanner,
  LandingHero,
  LandingSection,
} from "@lobehub/ui/awesome";
import { GithubIcon } from "@lobehub/ui/icons";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { CodeShowcaseSection } from "./CodeShowcase";
import { FeatureSection } from "./FeatureSection";
import { renderLink } from "./renderLink";

const SITE_URL = "https://streamdown.lobehub.com";
const INSTALL_COMMAND = "pnpm add @lobehub/streamdown";

const AGENTS = [
  { avatar: ClaudeCode.Avatar, title: "Claude Code" },
  { avatar: Codex.Avatar, title: "Codex" },
  { avatar: Cursor.Avatar, title: "Cursor" },
  { avatar: GithubCopilot.Avatar, title: "GitHub Copilot" },
  { avatar: Windsurf.Avatar, title: "Windsurf" },
];

export default function Home({
  description,
  getStartedPathname,
}: {
  description: string;
  getStartedPathname: string;
}) {
  const navigate = useNavigate();

  return (
    <>
      <LandingHero
        accent={"Streaming Markdown"}
        renderLink={renderLink}
        title={<span data-pagefind-meta="title">Streamdown</span>}
        actions={[
          {
            href: "/guide/getting-started",
            icon: ArrowRight,
            iconPlacement: "end",
            label: "Get Started",
            primary: true,
          },
          {
            href: "https://github.com/lobehub/streamdown",
            icon: GithubIcon,
            label: "GitHub",
          },
        ]}
        aside={
          <AgentSkillCard
            agents={AGENTS}
            agent={{
              code: `Read ${SITE_URL}/skills.md and follow it to render streaming LLM markdown with @lobehub/streamdown.`,
              description:
                "Send this prompt to your agent to wire up Streamdown",
            }}
            footer={
              <>
                <a href={"/skills.md"} rel={"noreferrer"} target={"_blank"}>
                  skills.md
                </a>
                <a href={"/llms.txt"} rel={"noreferrer"} target={"_blank"}>
                  llms.txt
                </a>
              </>
            }
          />
        }
        badge={
          <Link to={"/components/streamdown#playground"}>
            Try the playground: tune the stream and watch the profiler →
          </Link>
        }
        description={
          <span data-pagefind-meta="description">{description}</span>
        }
        onNavigate={navigate}
      />

      <LandingSection
        eyebrow={"Why Streamdown"}
        eyebrowColor={"orange"}
        id={"home-features"}
        renderLink={renderLink}
        title={"Built for token streams"}
        actions={[
          { href: "/guide/introduction", label: "Why streaming markdown" },
        ]}
        description={
          "Each feature answers one way token streams break ordinary markdown renderers."
        }
        onNavigate={navigate}
      >
        <FeatureSection />
      </LandingSection>

      <LandingSection
        actions={[{ href: "/guide/getting-started", label: "Getting started" }]}
        eyebrow={"Usage"}
        eyebrowColor={"green"}
        id={"home-showcase"}
        renderLink={renderLink}
        title={"Drop in, then tune"}
        description={
          "The snippet on the left drives the live stream on the right."
        }
        onNavigate={navigate}
      >
        <CodeShowcaseSection />
      </LandingSection>

      <InstallBanner
        command={INSTALL_COMMAND}
        title={"Start streaming with Streamdown"}
        footnote={
          <>
            Open source · MIT license ·{" "}
            <Link to={getStartedPathname}>Get Started →</Link>
          </>
        }
      />
    </>
  );
}
