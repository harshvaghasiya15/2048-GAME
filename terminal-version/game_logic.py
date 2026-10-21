score = 0


def move_left(matrix):
    global check
    check = True
    def compress(matrix):
        new_matrix=[]
        for row in matrix:
            new_row=[]
            for x in row:
                if x!=0 :
                    new_row.append(x)
            while len(new_row)<4:
                new_row.append(0)
            new_matrix.append(new_row)
        return new_matrix

    def merge(matrix):
        global score
        for i in range(0,4):
            for j in range(0,3):
                if matrix[i][j]==matrix[i][j+1]:
                    matrix[i][j]+=matrix[i][j+1]
                    score+=matrix[i][j]
                    matrix[i][j+1]=0
        return matrix
    
    original = [row[:] for row in matrix]
    matrix=compress(matrix)
    matrix=merge(matrix)
    matrix=compress(matrix)

    if matrix == original:
        check = False

    return matrix


def move_right(matrix):

    def mirror_image(matrix):
        new_matrix=[]
        for row in matrix:
            new_row=[]
            for i in range(3,-1,-1):
                new_row.append(row[i])
            new_matrix.append(new_row)
        return new_matrix
    
    matrix=mirror_image(matrix)
    matrix=move_left(matrix)
    matrix=mirror_image(matrix)    
    return matrix

def move_up(matrix):

    def transpose(matrix):
        return [[row[i] for row in matrix] for i in range(4)]
    
    matrix=transpose(matrix)
    matrix=move_left(matrix)
    matrix=transpose(matrix)

    return matrix

def move_down(matrix):

    def transpose(matrix):
        return [[row[i] for row in matrix] for i in range(4)]
    
    matrix=transpose(matrix)
    matrix=move_right(matrix)
    matrix=transpose(matrix)

    return matrix

def Game_win(matrix):
    result=False
    for row in matrix:
        for x in row:
            if x>=2048:
                result=True

    return result
                
def Game_over(matrix):

    def transpose(matrix):
        return [[row[i] for row in matrix] for i in range(4)]
    
    for i in range(4):
        for j in range(4):
            if matrix[i][j] == 0:
                return False
    transpose_matrix=transpose(matrix)
    for i in range(4):
        for j in range(3):
            if (matrix[i][j]==matrix[i][j+1] or transpose_matrix[i][j]==transpose_matrix[i][j+1]):
                return False
            
    return True
