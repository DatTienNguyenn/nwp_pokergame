"use client";

import { useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { mockTables } from "../data/mockTables";
import "../styles/lobby.css";

export default function LobbyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tables, setTables] = useState(mockTables);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to the Lobby!", type: "info" },
  ]);
  const [formData, setFormData] = useState({
    name: "",
    minBet: "1",
    maxPlayers: "6",
  });
  const [joinTableId, setJoinTableId] = useState("");

  const handleRefreshTables = useCallback(() => {
    setTables([...mockTables]);
    addNotification("Table list refreshed!", "info");
  }, []);

  const handleReturnHome = useCallback(() => {
    router.push("/home");
  }, [router]);

  const handleCreateTable = () => {
    setShowCreateModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitCreateTable = (e) => {
    e.preventDefault();
    const newTable = {
      id: `table-${Date.now()}`,
      name: formData.name,
      minBet: parseInt(formData.minBet),
      maxPlayers: parseInt(formData.maxPlayers),
      currentPlayers: 1,
      status: "active",
      players: [{ name: user.username, chips: user.chips, position: 0 }],
    };
    setTables((prev) => [newTable, ...prev]);
    addNotification(
      `Table "${newTable.name}" created successfully!`,
      "success"
    );
    setShowCreateModal(false);
    setFormData({
      name: "",
      minBet: "1",
      maxPlayers: "6",
    });
  };

  const handleJoinTableWithId = () => {
    const table = tables.find((t) => t.id === joinTableId);
    if (table) {
      addNotification(`Joined table: ${table.name}`, "success");
      setJoinTableId("");
      // Navigate to game with table info
      router.push(`/game?tableId=${joinTableId}`);
    } else {
      addNotification("Table not found!", "error");
    }
  };

  const handleJoinTable = (tableId) => {
    const table = tables.find((t) => t.id === tableId);
    if (table && table.currentPlayers < table.maxPlayers) {
      addNotification(`Joined table: ${table.name}`, "success");
      router.push(`/game?tableId=${tableId}`);
    } else {
      addNotification("Table is full or not found!", "error");
    }
  };

  const addNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  if (!user) return null;

  return (
    <div className="lobby-container">
      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map((notif) => (
          <div key={notif.id} className={`notification ${notif.type}`}>
            <span className="notif-icon">
              {notif.type === "success"
                ? "✓"
                : notif.type === "error"
                ? "✕"
                : "ℹ"}
            </span>
            {notif.message}
          </div>
        ))}
      </div>

      <div className="lobby-content">
        {/* Sidebar */}
        <aside className="lobby-sidebar">
          <div className="sidebar-header">
            <h2>🎮 Actions</h2>
          </div>

          <div className="sidebar-actions">
            <button
              className="action-btn create-btn"
              onClick={handleCreateTable}
            >
              <span className="btn-icon">➕</span>
              <span>Create Table</span>
            </button>

            <button
              className="action-btn refresh-btn"
              onClick={handleRefreshTables}
            >
              <span className="btn-icon">🔄</span>
              <span>Refresh List</span>
            </button>

            <button
              className="action-btn return-btn"
              onClick={handleReturnHome}
            >
              <span className="btn-icon">🏠</span>
              <span>Return Home</span>
            </button>
          </div>

          <div className="join-table-section">
            <h3>Join by ID</h3>
            <input
              type="text"
              placeholder="Enter table ID"
              value={joinTableId}
              onChange={(e) => setJoinTableId(e.target.value)}
              className="table-id-input"
            />
            <button
              className="action-btn join-id-btn"
              onClick={handleJoinTableWithId}
              disabled={!joinTableId}
            >
              <span className="btn-icon">🔗</span>
              <span>Join Table</span>
            </button>
          </div>

          <div className="sidebar-info">
            <div className="info-item">
              <span className="label">Your Chips:</span>
              <span className="value">${user.chips.toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="label">Username:</span>
              <span className="value">{user.username}</span>
            </div>
            <div className="info-item">
              <span className="label">Level:</span>
              <span className="value">{user.level}</span>
            </div>
          </div>
        </aside>

        {/* Main Content - Tables List */}
        <main className="lobby-main">
          <div className="tables-header">
            <h1>🎲 Available Tables</h1>
            <p className="tables-count">Total: {tables.length} tables</p>
          </div>

          {tables.length === 0 ? (
            <div className="empty-state">
              <p>No tables available. Create one to get started!</p>
              <button
                className="action-btn create-btn"
                onClick={handleCreateTable}
              >
                Create Table
              </button>
            </div>
          ) : (
            <div className="tables-list">
              {tables.map((table) => (
                <div key={table.id} className="table-row">
                  <div className="table-col table-name">
                    <div className="table-title">{table.name}</div>
                    <div className="table-id">ID: {table.id}</div>
                  </div>

                  <div className="table-col">
                    <div className="stat-label">Min Bet</div>
                    <div className="stat-value">${table.minBet}</div>
                  </div>

                  <div className="table-col">
                    <div className="stat-label">Players</div>
                    <div className="stat-value">
                      <span
                        className={
                          table.currentPlayers >= table.maxPlayers ? "full" : ""
                        }
                      >
                        {table.currentPlayers}/{table.maxPlayers}
                      </span>
                    </div>
                  </div>

                  <div className="table-col">
                    <div className="stat-label">Status</div>
                    <div className="stat-value">{table.status}</div>
                  </div>

                  <div className="table-col table-action">
                    <button
                      className={`join-btn ${
                        table.currentPlayers >= table.maxPlayers ? "full" : ""
                      }`}
                      onClick={() => handleJoinTable(table.id)}
                      disabled={table.currentPlayers >= table.maxPlayers}
                    >
                      {table.currentPlayers >= table.maxPlayers
                        ? "FULL"
                        : "JOIN"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Table Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setShowCreateModal(false)}
            >
              ✕
            </button>

            <h2>Create New Table</h2>

            <form onSubmit={handleSubmitCreateTable}>
              <div className="form-group">
                <label htmlFor="name">Table Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g., High Roller Table"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxPlayers">Max Players *</label>
                <select
                  id="maxPlayers"
                  name="maxPlayers"
                  value={formData.maxPlayers}
                  onChange={handleFormChange}
                  required
                >
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>8</option>
                  <option>9</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="minBet">Min Bet ($) *</label>
                <input
                  id="minBet"
                  type="number"
                  name="minBet"
                  value={formData.minBet}
                  onChange={handleFormChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
