import {
  ClaudeCode,
  Codex,
  Cursor,
  GithubCopilot,
  Windsurf,
} from "@lobehub/icons";
import { Flexbox, Text } from "@lobehub/ui";
import {
  AgentSkillCard,
  LandingHero,
  LandingSection,
} from "@lobehub/ui/awesome";
import { GithubIcon } from "@lobehub/ui/icons";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

import Playground from "../../src/Streamdown/demos/Playground";
import { Features } from "./Features";
import { HeroDemo } from "./HeroDemo";
import { renderLink } from "./renderLink";

const SITE_URL = "https://streamdown.lobehub.com";
const REPO = "https://github.com/lobehub/streamdown";
const NPM = "https://www.npmjs.com/package/@lobehub/streamdown";

const AGENTS = [
  { avatar: ClaudeCode.Avatar, title: "Claude Code" },
  { avatar: Codex.Avatar, title: "Codex" },
  { avatar: Cursor.Avatar, title: "Cursor" },
  { avatar: GithubCopilot.Avatar, title: "GitHub Copilot" },
  { avatar: Windsurf.Avatar, title: "Windsurf" },
];

// Standard landing hero (building-landing-home) with the original hero stream below it, then the
// original Vite site's sections (f3ba7b3:site/src/App.tsx): Features → Playground → footer.
export default function Home({ description }: { description: string }) {
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
          { href: REPO, icon: GithubIcon, label: "GitHub" },
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
            human={{
              code: "pnpm add @lobehub/streamdown",
              description: "Install Streamdown into your React project",
            }}
          />
        }
        description={
          <span data-pagefind-meta="description">{description}</span>
        }
        onNavigate={navigate}
      />

      {/* Outside LandingHero so body text is not centered by the hero's textAlign. */}
      <div style={{ marginBlock: 8, textAlign: "left", width: "100%" }}>
        <HeroDemo />
      </div>

      <LandingSection id={"home-features"}>
        <Features />
      </LandingSection>

      <div id={"playground"}>
        <LandingSection
          id={"home-playground"}
          title={"Playground"}
          description={
            "Tune the stream and watch the profiler respond in real time."
          }
        >
          <Playground />
          <Text as={"p"} fontSize={13} type={"secondary"}>
            Reveal commits sit deliberately below the display refresh —
            per-character stagger rides CSS <code>animation-delay</code>, not a
            re-render every frame.
          </Text>
        </LandingSection>
      </div>

      <Flexbox
        horizontal
        align={"center"}
        gap={16}
        paddingBlock={32}
        width={"100%"}
      >
        <Text fontSize={13} type={"secondary"}>
          MIT © LobeHub
        </Text>
        <a href={REPO} rel={"noreferrer"} target={"_blank"}>
          GitHub
        </a>
        <a href={NPM} rel={"noreferrer"} target={"_blank"}>
          npm
        </a>
        <span style={{ flex: 1 }} />
        <Text fontSize={13} type={"secondary"}>
          Headless by design
        </Text>
      </Flexbox>
    </>
  );
}
