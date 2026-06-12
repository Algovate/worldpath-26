import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "总览" },
  { href: "/matches", label: "赛程" },
  { href: "/standings", label: "积分" },
  { href: "/predictions", label: "预测" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="回到总览">
          <span className="brand-mark">26</span>
          <span>
            <strong>世界杯追踪器</strong>
            <small>成绩查看与预测</small>
          </span>
        </Link>
        <nav className="primary-nav" aria-label="主导航">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="data-pill">模拟数据</div>
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
}
