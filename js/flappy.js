function newElement(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function BarrerCreate(reverse = false) {
    this.element = newElement('div', 'barrer')

    const edge = newElement('div', 'edge')
    const bodyCol = newElement('div', 'bodyCol')

    this.element.appendChild(reverse ? bodyCol : edge)
    this.element.appendChild(reverse ? edge : bodyCol)

    this.setHeight = heightBarrer => bodyCol.style.height = `${heightBarrer}px`
}

function BarrerPair(barrerHeight, barrerOpen, x) {
    this.element = newElement('div', 'wallsPair')

    this.top = new BarrerCreate(true)
    this.botton = new BarrerCreate(false)

    this.element.appendChild(this.top.element)
    this.element.appendChild(this.botton.element)

    this.sortOpen = () => {
        const topOpen = Math.random() * (barrerHeight - barrerOpen)
        const bottonOpen = barrerHeight - barrerOpen - topOpen
        this.top.setHeight(topOpen)
        this.botton.setHeight(bottonOpen)
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidht = () => this.element.clientWidth

    this.sortOpen()
    this.setX(x)
}

function Barrers(height, gameWidht, barrerOpen, spaceBetween, notifyPoint) {
    this.pairs = [
        new BarrerPair(height, barrerOpen, gameWidht),
        new BarrerPair(height, barrerOpen, gameWidht + spaceBetween),
        new BarrerPair(height, barrerOpen, gameWidht + spaceBetween * 2),
        new BarrerPair(height, barrerOpen, gameWidht + spaceBetween * 3),
    ]

    const movingPx = 3
    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - movingPx)

            // quando o elemento sair da área do jogo
            if (pair.getX() < -pair.getWidht()) {
                pair.setX(pair.getX() + spaceBetween * this.pairs.length)
                pair.sortOpen()
            }

            const middle = gameWidht / 2
            const crossMiddle = pair.getX() + movingPx >= middle
                && pair.getX() < middle
            if (crossMiddle) notifyPoint()
        })
    }
}

function Bird(gameHeight) {
    let flying = false

    this.element = newElement('img', 'bird')
    this.element.src = 'img/bird.png'

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`

    window.onkeydown = e => flying = true
    window.onkeyup = e => flying = false

    this.animateBird = () => {
        const newY = this.getY() + (flying ? 8 : -5)
        const maxHeight = gameHeight - this.element.clientHeight

        if (newY <= 0) {
            this.setY(0)
        } else if (newY >= maxHeight) {
            this.setY(maxHeight)
        } else {
            this.setY(newY)
        }
    }

    this.setY(gameHeight / 2)
}

function Progress() {
    this.element = newElement('span', 'progress')
    this.attPoints = points => {
        this.element.innerHTML = points
    }
    this.attPoints(0)
}

function behindObj(elementA, elementB) {
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
    return horizontal && vertical
}

function colision(bird, barrers) {
    let colision = false
    barrers.pairs.forEach(barrerPair => {
        if (!colision) {
            const superior = barrerPair.top.element
            const inferior = barrerPair.botton.element
            colision = behindObj(bird.element, superior)
                || behindObj(bird.element, inferior)
        }
    })
    return colision
}

function FlappyBird() {
    let points = 0

    const gameArea = document.querySelector('.gameBlock')
    const gameHeight = gameArea.clientHeight
    const gameWidht = gameArea.clientWidth

    const progress = new Progress()
    const barrers = new Barrers(gameHeight, gameWidht, 200, 400,
        () => progress.attPoints(++points))
    const bird = new Bird(gameHeight)

    gameArea.appendChild(progress.element)
    gameArea.appendChild(bird.element)
    barrers.pairs.forEach(pair => gameArea.appendChild(pair.element))

    this.start = () => {
        const temp = setInterval(() => {
            barrers.animate()
            bird.animateBird()

            if (colision(bird, barrers)) {
                clearInterval(temp)
            }
        }, 20);
    }
}

new FlappyBird().start()
