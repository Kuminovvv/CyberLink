"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { loadInventory, loadProgress } from "@shared/lib/storage";
import type { Inventory, Progress } from "@shared/types/content";

export function Header() {
  const pathname = usePathname();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(loadProgress());
    setInventory(loadInventory());
  }, []);

  // Не показываем на главной и онбординге
  if (pathname === "/" || pathname === "/onboarding") return null;

  if (!mounted) return null;

  const navLinks = [
    { href: "/learn", label: "Обучение", icon: "📚" },
    { href: "/review", label: "Повторы", icon: "🔄" },
    { href: "/glossary", label: "Глоссарий", icon: "📖" },
    { href: "/profile", label: "Профиль", icon: "👤" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Лого и основная навигация */}
        <div className="flex items-center gap-6">
          <Link href="/learn" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              CyberLink
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? "bg-secondary text-secondary-foreground font-medium"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <span className="mr-1.5">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Статистика пользователя */}
        {progress && inventory && (
          <div className="flex items-center gap-4">
            {/* XP */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
              <span className="text-base">⭐</span>
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                {progress.xp}
              </span>
            </div>

            {/* Streak */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
              <span className="text-base">🔥</span>
              <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                {progress.streak}
              </span>
            </div>

            {/* Hearts */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <span className="text-base">❤️</span>
              <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                {inventory.hearts}
              </span>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
              <span className="text-base">🪙</span>
              <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                {inventory.coins}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Мобильная навигация */}
      <nav className="md:hidden border-t">
        <div className="container mx-auto flex justify-around py-2 px-4">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-xs">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
