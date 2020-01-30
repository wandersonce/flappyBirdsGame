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
    this.setX = () => this.element.style.left = `${x}px`
    this.getWidht = () => this.element.clientWidth

    this.sortOpen()
    this.setX(x)
}
