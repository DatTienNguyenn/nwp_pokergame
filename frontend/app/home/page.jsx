"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { mockUserStats, mockRecentGames, mockTables } from "../data/mockTables";
import "../styles/home.css";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(null);

  if (!user) return null;

  const closeModal = () => setActiveSection(null);

  const handlePlayNow = () => {
    router.push("/game");
  };

  const handleViewTables = () => {
    router.push("/lobby");
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome back, {user.username}! 👋</h1>
        <p className="balance-info">Balance: ${user.chips.toLocaleString()}</p>
      </div>

      <div className="main-buttons-grid">
        <button className="main-button" onClick={handleViewTables}>
          <div className="button-icon">🎲</div>
          <div className="button-text">
            <h2>Tables</h2>
            <p>Browse & Join Tables</p>
          </div>
        </button>

        <button className="main-button play-now" onClick={handlePlayNow}>
          <div className="button-icon">⚡</div>
          <div className="button-text">
            <h2>Play Now</h2>
            <p>Start a Quick Game</p>
          </div>
        </button>

        <button
          className="main-button"
          onClick={() => setActiveSection("scoreboard")}
        >
          <div className="button-icon">🏆</div>
          <div className="button-text">
            <h2>Scoreboard</h2>
            <p>View Rankings</p>
          </div>
        </button>

        <button
          className="main-button"
          onClick={() => setActiveSection("friends")}
        >
          <div className="button-icon">👥</div>
          <div className="button-text">
            <h2>Friends</h2>
            <p>Connect & Compete</p>
          </div>
        </button>
      </div>

      {/* Modal Overlay */}
      {activeSection && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              ✕
            </button>

            {/* Tables Section */}
            {activeSection === "tables" && (
              <div className="modal-section">
                <h2>Available Tables</h2>
                <div className="tables-grid">
                  {mockTables.map((table) => (
                    <div key={table.id} className="table-card">
                      <div className="table-header">
                        <h3>{table.name}</h3>
                        <span
                          className={`limit-badge ${table.type.toLowerCase()}`}
                        >
                          {table.type}
                        </span>
                      </div>
                      <div className="table-stats">
                        <div className="stat">
                          <span className="label">Stakes:</span>
                          <span className="value">
                            ${table.minBet}/${table.maxBet}
                          </span>
                        </div>
                        <div className="stat">
                          <span className="label">Players:</span>
                          <span className="value">
                            {table.players}/{table.maxPlayers}
                          </span>
                        </div>
                        <div className="stat">
                          <span className="label">Avg Pot:</span>
                          <span className="value">${table.avgPot}</span>
                        </div>
                      </div>
                      <button className="join-btn">Join Table</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scoreboard Section */}
            {activeSection === "scoreboard" && (
              <div className="modal-section">
                <h2>Top Players</h2>
                <div className="user-stats">
                  <div className="stat-item">
                    <span className="label">Games Played:</span>
                    <span className="value">{mockUserStats.totalGames}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Win Rate:</span>
                    <span className="value">{mockUserStats.winRate}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Current Streak:</span>
                    <span className="value">
                      {mockUserStats.currentStreak} wins
                    </span>
                  </div>
                </div>

                <h3>Achievements</h3>
                <div className="achievements-grid">
                  {mockUserStats.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`achievement-badge ${
                        achievement.unlocked ? "unlocked" : "locked"
                      }`}
                    >
                      <span className="achievement-icon">
                        {achievement.icon}
                      </span>
                      <span className="achievement-name">
                        {achievement.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Friends Section */}
            {activeSection === "friends" && (
              <div className="modal-section">
                <h2>Friends List</h2>
                <div className="friends-list">
                  <div className="friend-item">
                    <div className="friend-avatar">👤</div>
                    <div className="friend-info">
                      <h4>Friend coming soon</h4>
                      <p>Add friends to compete together!</p>
                    </div>
                    <button className="action-btn">Add</button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Games */}
            {activeSection !== "friends" && (
              <div className="modal-section recent-games">
                <h2>Recent Games</h2>
                <div className="games-list">
                  {mockRecentGames.map((game) => (
                    <div key={game.id} className="game-item">
                      <div className="game-info">
                        <span className="game-table">{game.table}</span>
                        <span className="game-duration">{game.duration}</span>
                      </div>
                      <div className="game-result">
                        <span
                          className={`game-status ${game.result.toLowerCase()}`}
                        >
                          {game.result}
                        </span>
                        <span
                          className={`game-profit ${
                            game.profit > 0 ? "positive" : "negative"
                          }`}
                        >
                          {game.profit > 0 ? "+" : ""}${game.profit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
