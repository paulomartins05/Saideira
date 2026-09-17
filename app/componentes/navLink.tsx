"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void; 
}

export default function NavLink({ href, children, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

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