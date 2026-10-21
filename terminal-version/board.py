import random

class Board: 
    def __init__(self):
        self.rows=[[0]*4 for _ in range(4)]
        self.add_random_tile()
        self.add_random_tile()
    

    def get_empty_cell(self):
        return [(i, j) for i in range(4) for j in range(4) if self.rows[i][j] == 0]
    
    def add_random_tile(self):
        empty_cells = self.get_empty_cell()
        if empty_cells:
            i, j = random.choice(empty_cells)
            self.rows[i][j] = random.choice([2,2,2,2,2,2,2,2,2,4])

    def display(self):
        print()
        print("+----" * 4 + "+")
        for row in self.rows:
            for cell in row:
                if cell == 0:
                    print(f"|{' ':^4}", end="")
                else:
                    print(f"|{cell:^4}", end="")
            print("|")
            print("+----" * 4 + "+")

a = Board()