import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Nav, type NavKey } from "./Nav";

type Props = {
  children: ReactNode;
  current?: NavKey;
  nav?: "site" | "auth";
  footer?: "full" | "compact" | "minimal";
  stickyNav?: boolean;
};

/** Cadre d'une page publique : lien d'évitement + Nav + <main> + Footer. */
export function SiteShell({ children, current, nav = "site", footer = "full", stickyNav = true }: Props) {
  return (
    <>
      <a href="#contenu" className="nc-skip-link">
        Aller au contenu
      </a>
      <Nav variant={nav} current={current} sticky={stickyNav} />
      <main id="contenu">{children}</main>
      <Footer variant={footer} />
    </>
  );
}
