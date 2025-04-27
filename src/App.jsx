import { useState, useEffect } from "react";
import "./App.css";

const moods = [
  { emoji: "😊", name: "Happy" },
  { emoji: "😢", name: "Sad" },
  { emoji: "😡", name: "Angry" },
  { emoji: "😴", name: "Tired" },
  { emoji: "😍", name: "Loved" },
  { emoji: "😐", name: "Neutral" },
];

export default function App() {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("moodHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [note, setNote] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem("moodHistory", JSON.stringify(history));
  }, [history]);

  const handleMoodClick = (mood) => {
    const today = new Date();
    const dateString = today.toLocaleDateString();
    const timeString = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setHistory([
      { 
        date: dateString, 
        time: timeString,
        mood: mood.emoji, 
        moodName: mood.name,
        note,
        id: Date.now()
      },
      ...history,
    ]);
    setNote("");
    setSelectedMood(null);
  };

  const deleteEntry = (id) => {
    setHistory(history.filter(entry => entry.id !== id));
  };

  return (
    <div className="container">
      <h1 className="title">Mood Tracker</h1>

      <div className="mood-selection">
        <h2 className="subtitle">How are you feeling today?</h2>
        <div className="mood-buttons">
          {moods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => setSelectedMood(mood)}
              className={`mood-button ${selectedMood?.name === mood.name ? "selected" : ""}`}
              aria-label={mood.name}
            >
              {mood.emoji}
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="note-section">
            <label htmlFor="note">Add a note (optional):</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Why are you feeling this way?"
              rows={3}
            />
            <button 
              onClick={() => handleMoodClick(selectedMood)}
              className="submit-button"
            >
              Record My Mood
            </button>
          </div>
        )}
      </div>

      <div className="history">
        <h2 className="subtitle">Mood History:</h2>
        {history.length === 0 ? (
          <p className="empty-history">No mood entries yet. Select a mood above!</p>
        ) : (
          <ul className="history-list">
            {history.map((entry) => (
              <li key={entry.id} className="history-item">
                <div className="entry-header">
                  <span className="entry-date">{entry.date} at {entry.time}</span>
                  <button 
                    onClick={() => deleteEntry(entry.id)}
                    className="delete-button"
                    aria-label="Delete entry"
                  >
                    ×
                  </button>
                </div>
                <div className="entry-content">
                  <span className="mood-emoji">{entry.mood}</span>
                  <span className="mood-name">{entry.moodName}</span>
                </div>
                {entry.note && <p className="entry-note">"{entry.note}"</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}