"use client";

import { useEffect } from "react";

/**
 * Amélioration progressive : marque l'item du sommaire correspondant à la section lue.
 * N'affiche rien et ne rend aucun contenu. Sans JavaScript, le sommaire reste pleinement utilisable.
 */
export function TocSpy() {
  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-toc] a[href^='#']"));
    const targets = links
      .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;

    const setActive = () => {
      const line = window.innerHeight * 0.3;
      let current = targets[0];
      for (const t of targets) {
        if (t.getBoundingClientRect().top <= line) current = t;
      }
      for (const a of links) {
        if (a.hash.slice(1) === current.id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      }
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(setActive);
    };
    setActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
