"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import { mockTables } from "../data/mockTables";
import "../styles/tables.css";

export default function TablesPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (!user) return null;

  const filteredTables = mockTables.filter((table) => {
    const matchesSearch = table.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "available" && table.status !== "full") ||
      (filter === "full" && table.status === "full") ||
      (filter === "affordable" && table.minBuy <= user.chips);

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: "Active", className: "status-active" },
      waiting: { text: "Waiting", className: "status-waiting" },
      full: { text: "Full", className: "status-full" },
    };
    return badges[status] || badges.active;
  };

  const canJoinTable = (table) => {
    return table.status !== "full" && user.chips >= table.minBuy;
  };

  return (
    <div className="tables-container">
      <div className="tables-header">
        <h1>Poker Tables</h1>
        <p>Choose a table and start playing</p>
      </div>

      <div className="tables-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Tables
          </button>
          <button
            className={`filter-btn ${filter === "available" ? "active" : ""}`}
            onClick={() => setFilter("available")}
          >
            Available
          </button>
          <button
            className={`filter-btn ${filter === "affordable" ? "active" : ""}`}
            onClick={() => setFilter("affordable")}
          >
            Affordable
          </button>
          <button
            className={`filter-btn ${filter === "full" ? "active" : ""}`}
            onClick={() => setFilter("full")}
          >
            Full
          </button>
        </div>
      </div>

      <div className="tables-grid">
        {filteredTables.map((table) => {
          const status = getStatusBadge(table.status);
          const joinable = canJoinTable(table);

          return (
            <div key={table.id} className="table-card">
              <div className="table-card-header">
                <div>
                  <h3>{table.name}</h3>
                  <span className="game-type">{table.gameType}</span>
                </div>
                <span className={`status-badge ${status.className}`}>
                  {status.text}
                </span>
              </div>

              <div className="table-card-body">
                <div className="table-info-grid">
                  <div className="info-item">
                    <span className="info-label">Buy-in</span>
                    <span className="info-value">
                      ${table.minBuy} - ${table.maxBuy}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Blinds</span>
                    <span className="info-value">
                      ${table.smallBlind}/${table.bigBlind}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Players</span>
                    <span className="info-value">
                      {table.currentPlayers}/{table.maxPlayers}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Seats</span>
                    <span className="info-value">
                      {table.maxPlayers - table.currentPlayers} available
                    </span>
                  </div>
                </div>

                <div className="players-preview">
                  <h4>Current Players:</h4>
                  <div className="players-chips">
                    {table.players.slice(0, 4).map((player, idx) => (
                      <span key={idx} className="player-chip">
                        {player.name}
                      </span>
                    ))}
                    {table.players.length > 4 && (
                      <span className="player-chip more">
                        +{table.players.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="table-card-footer">
                  {joinable ? (
                    <Link href="/game" className="join-btn">
                      Join Table
                    </Link>
                  ) : (
                    <button className="join-btn disabled" disabled>
                      {table.status === "full"
                        ? "Table Full"
                        : "Insufficient Chips"}
                    </button>
                  )}
                  <button className="spectate-btn">Spectate</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTables.length === 0 && (
        <div className="no-tables">
          <p>No tables found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
