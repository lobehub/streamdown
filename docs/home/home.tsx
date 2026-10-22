import { Flexbox, Snippet, Text } from "@lobehub/ui";
import { LandingHero, LandingSection } from "@lobehub/ui/awesome";
import { ArrowRight } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router";

import Playground from "../../src/Streamdown/demos/Playground";
import { ApiSection } from "./ApiSection";
import { Features } from "./Features";
import { HeroDemo } from "./HeroDemo";
import { renderLink } from "./renderLink";

const REPO = "https://github.com/lobehub/streamdown";
const NPM = "https://www.npmjs.com/package/@lobehub/streamdown";
const INSTALL_COMMAND = "pnpm add @lobehub/streamdown";

// Mirrors the original Vite site (f3ba7b3:site/src/App.tsx): Hero → Features → Playground → API.
export default function Home({ description }: { description: string }) {
  const navigate = useNavigate();
  // In-page anchors (#playground, #api) scroll; everything else goes through the router.
  const onNavigate = useCallback(
    (href: string) => {
      if (href.startsWith("#")) {
        document
          .getElementById(href.slice(1))
          ?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      navigate(href);
    },
    [navigate],
  );

  return (
    <>
      <span hidden data-pagefind-meta={`description:${description}`} />
      <LandingHero
        accent={"as it arrives"}
        renderLink={renderLink}
        actions={[
          {
            href: "/guide/getting-started",
            icon: ArrowRight,
            iconPlacement: "end",
            label: "Get Started",
            primary: true,
          },
          { href: "#playground", label: "Try the playground" },
        ]}
        badge={
          <span>
            <b>New</b> Block-level caching, 2× less main-thread time
          </span>
        }
        description={
          "A headless streaming markdown engine for React. Per-character reveal, block-level caching, and a LaTeX guard that keeps half-typed math from breaking mid-stream. Ships zero styles."
        }
        title={
          <span data-pagefind-meta="title:Streamdown">Render markdown</span>
        }
        onNavigate={onNavigate}
      >
        <Flexbox align={"center"} gap={32} width={"100%"}>
          <Snippet language={"sh"}>{INSTALL_COMMAND}</Snippet>
          <HeroDemo />
        </Flexbox>
      </LandingHero>

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

      <div id={"api"}>
        <LandingSection
          id={"home-api"}
          title={"API"}
          description={
            <>
              Props on the <code>&lt;Streamdown /&gt;</code> component, rendered
              by Streamdown itself.
            </>
          }
        >
          <ApiSection />
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
