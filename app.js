document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const blockWidth = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    //making Tetrominoes
    const lTetromino = [
        [1, blockWidth + 1, blockWidth * 2 + 1, 2],
        [blockWidth, blockWidth + 1, blockWidth + 2, blockWidth * 2 + 2],
        [1, blockWidth + 1, blockWidth * 2 + 1, blockWidth * 2],
        [blockWidth, blockWidth * 2, blockWidth * 2 + 1, blockWidth * 2 + 2]
    ]

    const zTetromino = [
        [0, blockWidth, blockWidth + 1, blockWidth * 2 + 1],
        [blockWidth + 1, blockWidth + 2, blockWidth * 2, blockWidth * 2 + 1],
        [0, blockWidth, blockWidth + 1, blockWidth * 2 + 1],
        [blockWidth + 1, blockWidth + 2, blockWidth * 2, blockWidth * 2 + 1]
    ]

    const tTetromino = [
        [1, blockWidth, blockWidth + 1, blockWidth + 2],
        [1, blockWidth, blockWidth + 1, blockWidth * 2 + 1],
        [blockWidth, blockWidth + 1, blockWidth + 2, blockWidth * 2 + 1],
        [1, blockWidth + 1, blockWidth + 2, blockWidth * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, blockWidth, blockWidth + 1],
        [0, 1, blockWidth, blockWidth + 1],
        [0, 1, blockWidth, blockWidth + 1],
        [0, 1, blockWidth, blockWidth + 1]
    ]

    const iTetromino = [
        [1, blockWidth + 1, blockWidth * 2 + 1, blockWidth * 3 + 1],
        [blockWidth, blockWidth + 1, blockWidth + 2, blockWidth + 3],
        [1, blockWidth + 1, blockWidth * 2 + 1, blockWidth * 3 + 1],
        [blockWidth, blockWidth + 1, blockWidth + 2, blockWidth + 3]
    ]

    const allTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    //randomly select a tetromino
    let random = Math.floor(Math.random() * allTetrominos.length)
    let current = allTetrominos[random][currentRotation]


    //draw that tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    //you drew it, so we undrawing it now
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    //assign functions to keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    //move down function
    function moveDown() {
        undraw()
        currentPosition += blockWidth
        draw()
        freeze()
    }

    //freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition + index + blockWidth].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new one
            random = nextRandom
            nextRandom = Math.floor(Math.random() * allTetrominos.length)
            current = allTetrominos[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    //move tetromino to left unless at edge or blocked
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % blockWidth === 0)

        if (!isAtLeftEdge) currentPosition -= 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw()
    }

    //move tetromino to right unless at edge or blocked
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % blockWidth === blockWidth - 1)

        if (!isAtRightEdge) currentPosition += 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }

        draw()
    }

    //rotate that thing
    function rotate() {
        undraw()
        currentRotation++
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = allTetrominos[random][currentRotation]
        draw()
    }

    //show next tetromino in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    //all tetrominoes w/o rotation
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetro
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetro
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetro
        [0, 1, displayWidth, displayWidth + 1], //oTetro
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetro
    ]

    //display shape in mini-grid
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //add functionality to that start/pause button
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * allTetrominos.length)
            displayShape()
        }
    })

    //add score
    function addScore() {
        for (let i = 0; i < 199; i += blockWidth) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, blockWidth)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    //game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }
})