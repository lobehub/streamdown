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

import { BentoGallery } from "./BentoGallery";
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
            href: getStartedPathname,
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
        eyebrow={"Live"}
        eyebrowColor={"blue"}
        id={"home-gallery"}
        renderLink={renderLink}
        title={"Render markdown as it arrives"}
        actions={[
          {
            href: "/components/streamdown",
            icon: ArrowRight,
            iconPlacement: "end",
            label: "Open the playground",
          },
        ]}
        description={
          "Every tile below is a live Streamdown render, replaying a simulated LLM stream."
        }
        onNavigate={navigate}
      >
        <BentoGallery />
      </LandingSection>

      <LandingSection
        actions={[{ href: "/guide/getting-started", label: "Getting started" }]}
        eyebrow={"Usage"}
        eyebrowColor={"green"}
        id={"home-showcase"}
        renderLink={renderLink}
        title={"One component, a few props"}
        description={
          "Switch tabs: each snippet on the left runs live on the right."
        }
        onNavigate={navigate}
      >
        <CodeShowcaseSection />
      </LandingSection>

      <LandingSection
        actions={[{ href: "/guide/streaming", label: "How it works" }]}
        eyebrow={"Foundations"}
        eyebrowColor={"orange"}
        id={"home-features"}
        renderLink={renderLink}
        title={"Built for token streams"}
        description={
          "What happens between the network chunk and the painted character."
        }
        onNavigate={navigate}
      >
        <FeatureSection />
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
