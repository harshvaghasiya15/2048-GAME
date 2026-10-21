import json
import os

SAVE_FILE = "2048.save.txt"


def save_game(board, score,high_score):
    """
    Save the current game state to 2048.save.txt file.
    The data is stored in JSON format.
    """
    data = {
        "board": board,
        "score": score,
        "high score":high_score,
    }

    try:
        with open(SAVE_FILE, "w") as file:
            json.dump(data, file)
        print("\n   Game saved successfully!\n")
    except Exception as e:
        print(f"Error saving game: {e}")


def load_game():
    """
    Load the saved game state from 2048.save.txt file.
    Returns:
        dict with keys 'board', 'score', 'high_score' if file exists,
        otherwise returns None.
    """
    if os.path.getsize(SAVE_FILE) == 0:
        print("\nStarting a New game.\n")
        return None

    try:
        with open(SAVE_FILE, "r") as file:
            data = json.load(file)
        return data
    except Exception as e:
        print(f"Error loading game: {e}")
        return None


def reset_game():
    """
    Deletes the saved game file (used for 'New Game' option).
    """
    print("\nGame Reset.")
