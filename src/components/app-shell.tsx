import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "总览" },
  { href: "/matches", label: "赛程" },
  { href: "/standings", label: "积分" },
  { href: "/predictions", label: "预测" },
  { href: "/data", label: "数据" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="回到总览">
          <span className="brand-mark">26</span>
          <span>
            <strong>WorldPath 26</strong>
            <small>世界杯成绩与冠军预测</small>
          </span>
        </Link>
        <nav className="primary-nav" aria-label="主导航">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="data-pill">Live 数据</div>
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
}
