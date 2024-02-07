const SPEED = 0.02

export default class Paddle {
    constructor(paddleElem) {

        if(!paddleElem) throw new Error("Paddle element is not defined")
        this.paddleElem = paddleElem
        this.reset()
    }

    get position() {
        return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue("--position"))
    }

    set position(value) {
        this.paddleElem.style.setProperty("--position", value)

    }

    rect() {
        return this.paddleElem.getBoundingClientRect()
    }

    reset() {
        if(this.paddleElem)
        {
            this.position = 50
        }
    }

    update(delta, ballHeight) {
        this.position += SPEED * delta * (ballHeight - this.position)
    }
}