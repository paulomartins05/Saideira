// Arquivo: app/_components/Header/NavLink.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "desktop" | "mobile";
  onClick?: () => void;
}

export default function NavLink({ href, children, variant = "desktop", onClick }: NavLinkProps) {
  const pathname = usePathname();

  const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));

  if (variant === "desktop") {
    return (
      <Link
        href={href}
        className={cn(
          "text-[13.5px] py-1 border-b-2 transition-colors",
          isActive
            ? "font-semibold text-amber border-amber"
            : "font-semibold text-paper/70 border-transparent hover:text-white"
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "font-inter text-sm md:text-base font-medium transition-all duration-200",
        isActive
          ? "text-amber font-bold cursor-default"
          : "text-paper/80 hover:text-white"
      )}
    >
      {children}
    </Link>
  );
}
