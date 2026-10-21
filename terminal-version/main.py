import board
import game_logic
import file_manager
import os

print("\n          WELCOME TO ",end='')
print("\033[91m2\033[0m\033[93m0\033[0m\033[92m4\033[0m\033[94m8\033[0m")
print("GOAL : To achieve 2048 in one of the grid.\n")
print("              # RULES #               ")
print("\nW → For moving grid in upward direction. ")
print("A → For moving grid in left direction. ")
print("S → For moving grid in downward direction. ")
print("D → For moving grid in right direction. ")
print("Q → To quit the game.")
print("R → To reset the game.")
print("H → HELP \n")

data = file_manager.load_game()
if data is None:
    board.a.display()
    game_logic.score = 0
    high_score = 0
    print("\n     Your Score is :",game_logic.score)
    print("\n     High score is :",high_score)
else:
    k = input("What you want to do?\n Continue game ( C ) \n New game      ( N )\n ").strip().lower()
    if k == 'c':
    
        print("Game continued successfully!\n")
        board.a.rows = data.get("board")
        game_logic.score = data.get("score")
        high_score=data.get("high score")
        board.a.display()
        print("\n     Your Score is :",game_logic.score)
        print("\n     High score is :",high_score)
    else:
    
        board.a.display()
        game_logic.score = 0
        high_score = data.get("high score")
        print("\n     Your Score is :",game_logic.score)
        print("\n     High score is :",high_score)


while True:

    if game_logic.Game_over(board.a.rows):
        if data:
            if(game_logic.score > data.get("high score")):
                file_manager.save_game(data.get("board"),data.get("score"),game_logic.score)
                data = file_manager.load_game()

        if(game_logic.Game_win(board.a.rows)):
            print("\n    # CONGRATULATIONS #")
            print("\n     Your Score is :",game_logic.score)
        else:
            print("\n    # HARD LUCK #")
            print("\n     Your Score is :",game_logic.score,"\n")
        l = input(" Do you want to start a new game ?\n YES ( Y )\n NO  ( N )\n ").strip().lower()
        if l == "y":
        
            board.a.rows = [[0]*4 for _ in range(4)]
            board.a.add_random_tile()
            board.a.add_random_tile()
            board.a.display()
            game_logic.score = 0
            if data:
                high_score=data.get("high score")
            print("\n     Your Score is :",game_logic.score)
            print("\n     High score is :",high_score)
        else:
            break

    move = input("\nEnter your move : ").strip().lower()
    if move == 'w':
        board.a.rows=game_logic.move_up(board.a.rows)
        if game_logic.check:
        
            board.a.add_random_tile()
            board.a.display()
            print("\n     Your Score is :",game_logic.score)
            if (game_logic.score > high_score):
                high_score = game_logic.score
            print("\n     High score is :",high_score)
        else:
            print("\nYou can't move upward.")
    elif move == 's':
        board.a.rows=game_logic.move_down(board.a.rows)
        if game_logic.check:
        
            board.a.add_random_tile()
            board.a.display()
            print("\n     Your Score is :",game_logic.score)
            if (game_logic.score > high_score):
                high_score = game_logic.score
            print("\n     High score is :",high_score)
        else:
            print("\nYou can't move downward.")
    elif move == 'a':
        board.a.rows=game_logic.move_left(board.a.rows)
        if game_logic.check:
        
            board.a.add_random_tile()
            board.a.display()
            print("\n     Your Score is :",game_logic.score)
            if (game_logic.score > high_score):
                high_score = game_logic.score
            print("\n     High score is :",high_score)
        else:
            print("\nYou can't move left side.")
    elif move == 'd':
        board.a.rows=game_logic.move_right(board.a.rows)
        if game_logic.check:
        
            board.a.add_random_tile()
            board.a.display()
            print("\n     Your Score is :",game_logic.score)
            if (game_logic.score > high_score):
                high_score = game_logic.score
            print("\n     High score is :",high_score)
        else:
            print("\nYou can't move right side.")
    elif move == 'q':
        y = input("Do you want to save?\n YES ( Y ) \n NO  ( N )\n ").strip().lower()
        if y == "y":
            file_manager.save_game(board.a.rows,game_logic.score,high_score)
            k = input(" New Game      (       1       )\n Continue Game (       2       )\n Exit          ( Press any key )\n ")
            if k == "1":
            
                board.a.rows = [[0]*4 for _ in range(4)]
                board.a.add_random_tile()
                board.a.add_random_tile()
                board.a.display()
                game_logic.score = 0
                data = file_manager.load_game()
                high_score = data.get("high score")
                print("\n     Your Score is :",game_logic.score)
                print("\n     High score is :",high_score)
            elif k == '2':
            
                print("Game loaded successfully!")
                data = file_manager.load_game()
                board.a.rows = data.get("board")
                game_logic.score = data.get("score")
                high_score = data.get("high score")
                board.a.display()
                print("\n     Your Score is :",game_logic.score)
                print("\n     High score is :",high_score)
            else:
                break
        else:
            o = input(" New Game (       1       ) \n Exit     ( Press any key )\n ")
            if o == "1":
            
                board.a.rows = [[0]*4 for _ in range(4)]
                board.a.add_random_tile()
                board.a.add_random_tile()
                board.a.display()
                game_logic.score = 0
                high_score = data.get("high score")
                print("\n     Your Score is :",game_logic.score)
                print("\n     High score is :",high_score)
            else:
                break
    elif move == 'r':
        file_manager.reset_game()
    
        board.a.rows = [[0]*4 for _ in range(4)]
        board.a.add_random_tile()
        board.a.add_random_tile()
        board.a.display()
        game_logic.score = 0
        print("\n     Your Score is :",game_logic.score)
        print("\n     High score is :",high_score)
    elif move == 'h':
    
        print("\n             # RULES #                   ")
        print("\nW → For moving grid in upward direction. ")
        print("A → For moving grid in left direction. ")
        print("S → For moving grid in downward direction. ")
        print("D → For moving grid in right direction. ")
        print("Q → To quit the game.")
        print("R → To reset the game.")

    else:
        print("\n INVALID INPUT \n For HELP press \'H\'")
    
        