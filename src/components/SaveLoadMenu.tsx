import { useState } from "react";
import { Save, Download, Upload, Trash2 } from "lucide-react";
import { useGameState } from "../GameState";
import { SaveSystem } from "../functions/SaveSystem";
import { observer } from "mobx-react-observer";

export const SaveLoadMenu = observer(function SaveLoadMenu() {
  const gameState = useGameState();
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [showMenu, setShowMenu] = useState(false);

  const handleSave = () => {
    const success = SaveSystem.saveGame(gameState, selectedSlot);
    if (success) {
      alert(`Game saved to slot ${selectedSlot}!`);
      setShowMenu(false);
    } else {
      alert("Failed to save game.");
    }
  };

  const handleLoad = () => {
    if (!SaveSystem.hasSave(selectedSlot)) {
      alert(`No save found in slot ${selectedSlot}.`);
      return;
    }

    if (confirm(`Load game from slot ${selectedSlot}? This will overwrite current progress.`)) {
      const success = SaveSystem.loadGame(gameState, selectedSlot);
      if (success) {
        alert(`Game loaded from slot ${selectedSlot}!`);
        setShowMenu(false);
      } else {
        alert("Failed to load game.");
      }
    }
  };

  const handleDelete = () => {
    if (!SaveSystem.hasSave(selectedSlot)) {
      alert(`No save found in slot ${selectedSlot}.`);
      return;
    }

    if (confirm(`Delete save slot ${selectedSlot}?`)) {
      SaveSystem.deleteSave(selectedSlot);
      alert(`Save slot ${selectedSlot} deleted.`);
    }
  };

  const getSaveInfo = (slot: number) => {
    const metadata = SaveSystem.getSaveMetadata(slot);
    if (!metadata.exists) {
      return "Empty";
    }
    return `Day ${metadata.dateTime?.day || 0}, ${(metadata.dateTime?.time || 0).toFixed(1)}h`;
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost"
        onClick={() => setShowMenu(!showMenu)}
      >
        <Save className="size-4" />
        Save/Load
      </div>
      {showMenu && (
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-2 shadow-lg border"
        >
          <li className="menu-title">
            <span>Save Slots</span>
          </li>
          {[1, 2, 3].map((slot) => (
            <li key={slot}>
              <div className="flex items-center justify-between">
                <button
                  className={selectedSlot === slot ? "active" : ""}
                  onClick={() => setSelectedSlot(slot)}
                >
                  Slot {slot}: {getSaveInfo(slot)}
                </button>
              </div>
            </li>
          ))}
          <li className="divider"></li>
          <li>
            <button onClick={handleSave}>
              <Download className="size-4" />
              Save to Slot {selectedSlot}
            </button>
          </li>
          <li>
            <button onClick={handleLoad}>
              <Upload className="size-4" />
              Load from Slot {selectedSlot}
            </button>
          </li>
          <li>
            <button onClick={handleDelete} className="text-error">
              <Trash2 className="size-4" />
              Delete Slot {selectedSlot}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
});
