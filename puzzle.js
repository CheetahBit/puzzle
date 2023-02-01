class Puzzle {

    constructor(id, size = 50) {
        this.id = id;
        this.size = size
    }

    initialze(row, col) {
        this.row = row;
        this.col = col;
        const cellsCount = (row * col) - 1
        this.sortedArray = Array.from({ length: cellsCount }, (_, i) => i + 1);
        this.sortedArray.push(null)
        this._randomize()
    }


    _randomize() {
        const randomArray = [...this.sortedArray].sort(() => 0.5 - Math.random());
        if (this._solvable(randomArray)) {
            this.cells = [...this._chunks(randomArray, this.col)];
            this._render()
        } else this._randomize(this.row, this.col)
    }

    * _chunks(a, n) {
        for (let i = 0; i < a.length; i += n) {
            yield a.slice(i, i + n);
        }
    }


    _render() {
        const board = document.createElement('div');
        board.classList.add('board');
        board.style.width = this.col * (+this.size + 2) + 'px';
        board.style.height = this.row * (+this.size + 2) + 'px';
        board.id = this.id
        this.cells.forEach((row, i) => {
            row.forEach((col, j) => {
                if (col) {
                    const cell = document.createElement('span');
                    cell.id = [i, j]
                    cell.innerText = col
                    cell.classList.add('cell')
                    cell.style.top = (i * (+this.size + 2)) + 'px';
                    cell.style.left = (j * (+this.size + 2)) + 'px';
                    cell.style.width = this.size + 'px';
                    cell.style.height = this.size + 'px';
                    cell.addEventListener('click', (event) => this._move(event.target))
                    board.appendChild(cell)
                }
            });
        });
        document.getElementById('app').appendChild(board)
    }

    _move(target) {
        const [row, col] = target.id.split(',').map(v => +v)
        const checkAround = this._checkAround(row, col)
        if (checkAround.length == 2) {
            const [i, j] = checkAround
            this.cells[i][j] = this.cells[row][col]
            this.cells[row][col] = null
            target.id = [i, j]
            if (i == row)
                target.style.left = (j * (+this.size + 2)) + 'px';
            else if (j == col)
                target.style.top = (i * (+this.size + 2)) + 'px';
            this._validate()
        }

    }

    _checkAround(row, col) {
        const checkRow = (r) => this.cells?.[r]?.[col] === null ? [r, +col] : false
        const checkCol = (c) => this.cells?.[row]?.[c] === null ? [+row, c] : false
        return checkRow(row - 1) || checkRow(row + 1) || checkCol(col - 1) || checkCol(col + 1) || []
    }

    _validate() {
        let count = 0
        const temp = this.cells.reduce((total, row) => total.concat(row))
        temp.forEach((v, i) => { if (this.sortedArray[i] == v) count++ })
        console.log(this.sortedArray, temp);
        if (count == temp.length) setTimeout(() => {
            alert("Win!")
        }, 400);
    }

    _solvable(array) {
        const isEven = (num) => num % 2 == 0
        let count = 0;
        for (let i = 0; i < array.length - 1; i++)
            if (array[i] < array[i + 1]) count++
        const position = this.row - Math.ceil((array.indexOf(null) + 1) / this.row)
        return (!isEven(this.col) && isEven(count)) || isEven(this.col) || (!isEven(count) && isEven(position))
    }
}