const cells = [];
let isAIStep = false;
let isGameStopped = false;

const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const modalBtn = document.getElementById('modal-close');

document
    .querySelectorAll('.cell')
    .forEach((el, index, arr) => {
        cells.push(el)
    });

const matrix = cells
    .reduce((acc, item) => {
        const row = item.dataset.row;
        const cell = item.dataset.cell;

        item.addEventListener('click', handleClick)

        // Если нет ряда -- создаем ряд
        if (!acc[row]) {
            acc[row] = [];
        }

        // Если нет элемента -- добавлем
        if (!acc[row][cell]) {
            acc[row][cell] = item;
        }

        return acc;
    }, [])

const reverseMatrix  = cells.reduce((acc, item) => {
    const cell = item.dataset.row;
    const row = item.dataset.cell;

    item.addEventListener('click', handleClick)

    // Если нет ряда -- создаем ряд
    if (!acc[row]) {
        acc[row] = [];
    }

    // Если нет элемента -- добавлем
    if (!acc[row][cell]) {
        acc[row][cell] = item;
    }

    return acc;
}, [])

function handleClick(e) {
    if (isAIStep) {
        return;
    }

    const { target } = e;

    setCell(target, true);

    if (!isGameStopped) {
        setTimeout(() => {
            pseudoAI();
        }, 0)
    }
}

function setCell(cell, player = false) {
    if (cell.dataset.block || isGameStopped || !isCanGame()) {
        return;
    }

    if (player) {
        cell.innerText = 'X'
    } else {
        cell.innerText = 'O'
    }

    cell.dataset.block = true;
    isAIStep = !isAIStep;

    if (checkEndGame(true)) {
        return;
    } else if (checkEndGame(false)) {
        return;
    } else if (isCanGame()){
        return;
    }
}

function pseudoAI () {
    if (isGameStopped || !isCanGame()) {
        return;
    }

    const x = Math.floor(Math.random() * matrix[0].length);
    const y = Math.floor(Math.random() * matrix.length);

    const cell = matrix[y][x];

    if (cell.dataset.block) {
        pseudoAI();
    } else {
        setCell(cell);
    }
}


function isPlayerCell(isPlayer = false) {
    return function (cell) {
        return !!cell.dataset.block && (cell.innerText === (isPlayer ? 'X' : 'O'))
    }
}

function checkEndGame(isPlayer) {
    const row = !!matrix.find(row => row.every(isPlayerCell(isPlayer)));
    const cell = !!reverseMatrix.find(row => row.every(isPlayerCell(isPlayer)));

    const d1 = isPlayerCell(isPlayer)(matrix[0][0]) && isPlayerCell(isPlayer)(matrix[1][1]) && isPlayerCell(isPlayer)(matrix[2][2]);
    const d2 = isPlayerCell(isPlayer)(matrix[0][2]) && isPlayerCell(isPlayer)(matrix[1][1]) && isPlayerCell(isPlayer)(matrix[2][0]);

    const res = row || cell || d1 || d2;

    if (res) {
        message(isPlayer ? 'Вы выиграли' : 'Вы проиграли')
        gameStop();
    }
    return res
}

function gameStop() {
    isGameStopped = true
}

function isCanGame() {
    const hasCell = !!cells.find(cell => !cell.dataset.block)

    if (!hasCell) {
        message('Ничья')
        gameStop();
    }

    return hasCell
}

function message(text) {
    modal.style.display = 'flex';
    modalMessage.innerText = text;
}

modalBtn.onclick = function restart() {
    modal.style.display = 'none';

    cells.forEach(cell => {
        delete cell.dataset.block;
        cell.innerText = '';
    })

    isAIStep = false;
    isGameStopped = false;
}