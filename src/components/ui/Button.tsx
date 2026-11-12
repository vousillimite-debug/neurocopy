import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "outline" | "white" | "text";
type Size = 44 | 48 | 52 | 56;

type CommonProps = {
  variant?: Variant;
  size?: Size;
  /** Pleine largeur sous 768 px. */
  fullWidthMobile?: boolean;
  children: ReactNode;
  className?: string;
};

type LinkProps = CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className">;
type ButtonProps = CommonProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className">;

/**
 * Bouton du design system.
 * Règle : un seul bouton « primary » (pilule jaune) par écran.
 * Avec `href` → lien ; sans → <button>.
 */
export function Button(props: LinkProps | ButtonProps) {
  const { variant = "primary", size = 52, fullWidthMobile, children, className, ...rest } = props;
  const cls = [
    styles.btn,
    styles[variant],
    styles[`s${size}`],
    fullWidthMobile ? styles.fullMobile : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...aProps } = rest as LinkProps;
    return (
      <Link href={href} className={cls} {...aProps}>
        {children}
      </Link>
    );
  }
  const { type = "button", ...bProps } = rest as ComponentPropsWithoutRef<"button">;
  return (
    <button type={type} className={cls} {...bProps}>
      {children}
    </button>
  );
}
