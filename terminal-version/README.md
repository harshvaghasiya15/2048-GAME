# 🎯 2048 GAME – COMPLETE PROJECT README  

## 🧩 1. **Project Overview**

The **2048 Game** is a number-merging puzzle played on a **4×4 grid**.  
You slide numbered tiles up, down, left, or right.  
When two identical numbers collide, they **merge** into a tile with double their value.

Your ultimate goal?  
👉 **Create the 2048 tile!**

This project is written in **Python** with a clean and modular structure.

---

## 📁 2. **Project File Structure**

```
📦 2048-Game
 ├── main.py
 ├── board.py
 ├── game_logic.py
 ├── file_manager.py
 └── README.md
```

### 🔹 `main.py`
- Acts as the entry point  
- Displays menu: *New Game, Load Game, Exit*  
- Controls the game loop  

### 🔹 `board.py`
- Creates the 4×4 game board  
- Handles board display  
- Spawns new tiles (2 or 4)  

### 🔹 `game_logic.py`
- Implements movement: **Up, Down, Left, Right**
- Tile merging rules  
- Score calculation  
- Detects **Game Over**  

### 🔹 `file_manager.py`
- Saves game state (board + score)  
- Loads previously saved games  

---

## ▶️ 3. **How to Run**

Make sure all `.py` files are inside the same folder.

Run using:

```bash
python main.py
```

---

## 🎮 4. **How to Play**

### Controls:
|  Key  |  Action |
|-------|---------|
| **W** | Move Up |
| **A** | Move Left |
| **S** | Move Down |
| **D** | Move Right |
| **Q** | Quit (option to save) |
| **R** | Reset (new game, delete save) |
| **H** | Help (show controls) |

### ⭐ Game Rules
- Matching tiles merge into one tile with double the number  
- A new tile (2 or 4) spawns after every move  
- The game ends if no valid moves remain  
- Score increases with each merge  

---

## 🖼️ 5. **Sample Board (ASCII)**

```
+------+------+------+------+
|  2   |      |  4   |      |
+------+------+------+------+
|      |  2   |      |      |
+------+------+------+------+
|  8   |      |  2   |      |
+------+------+------+------+
|      |      |      |      |
+------+------+------+------+
```

---

## 🧪 6. **Test Cases**

### ✔ Test Case 1 – Merge Left
```
Input:  [2, 2, 4, 4]
Output: [4, 8, 0, 0]
```

### ✔ Test Case 2 – No Incorrect Merges
```
Input:  [2, 4, 8, 16]
Output: [2, 4, 8, 16]   # No merges
```
## 🧩 Example Test Cases
| Input Board | Move | Expected Output |
|--------------|------|----------------|
| `[2,2,0,0]` | Left | `[4,0,0,0]` |
| `[2,2,2,0]` | Left | `[4,2,0,0]` |
| `[4,4,4,4]` | Left | `[8,8,0,0]` |
| `[0,2,0,4]` | Left | `[2,4,0,0]` |
| Any board with tile `2048` | — | Win detected ✅ |

### ✔ Test Case 3 – Game Over Detection
A grid full with **no adjacent equal tiles** → Game Over.

---

## 💾 7. **Saving & Loading**

The game allows:
- Saving the current board  
- Saving the score  
- Loading a previous session  

Managed by `file_manager.py`.

---

## 🚀 8. **Future Improvements**

- Undo button  
- Colorful terminal output  
- High score system  
- Auto-play AI mode  
- Smooth animations  

---

## ✔ 9. **End of README**
Thank you for reviewing the project!
