"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  if (!user || pathname === "/login") return null;

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);

  const isGamePage = pathname === "/game";

  const handleButtonClick = () => {
    if (isGamePage) {
      if (
        confirm("Are you sure you want to quit the game and return to home?")
      ) {
        router.push("/home");
      }
    } else {
      logout();
    }
  };

  return (
    <>
      {/* Hover trigger area at top */}
      <div
        className="nav-trigger"
        onMouseEnter={handleMouseEnter}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "10px",
          zIndex: 999,
          cursor: "pointer",
        }}
      />

      {/* Navigation Bar */}
      <nav
        className="poker-nav"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="nav-container">
          <div className="nav-brand">
            <Link href="/home">
              <h2>🃏 Poker Online</h2>
            </Link>
          </div>
          <div className="nav-links">{/* Navigation links removed */}</div>
          <div className="nav-user">
            <span className="user-info">
              💰 ${user.chips} | {user.username}
            </span>
            <button
              onClick={handleButtonClick}
              className={isGamePage ? "quit-nav-btn" : "logout-btn"}
            >
              {isGamePage ? "Quit Room" : "Logout"}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
