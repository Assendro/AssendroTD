class PlacementTile {
    constructor({position = {x: 0, y: 0}}) {
        this.position = position
        
        this.lvl = 0
        this.width = 32
        this.height = 32
        this.color = 'rgba(255, 255, 255, 0.2)'
        this.occupied = false
        this.image = new Image()
        this.offset = {
            x: 0,
            y: -96
        }
        this.costIndex = 1
        this.cost = 5 * this.costIndex
        
    }

    draw() {
        // ctx.fillStyle = this.color
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

        if (this.lvl > 0) {
            this.image.src = `./img/tower1.${this.lvl}.png`

            ctx.drawImage(
                this.image,
                this.position.x + this.offset.x,
                this.position.y + this.offset.y,
            )
        }

    }

    update(mouse) {
        this.draw()

        if (mouse.x > this.position.x  && 
            mouse.x < this.position.x + this.width * 2 &&
            mouse.y > this.position.y - this.height && 
            mouse.y < this.position.y + this.height 
        ) {
            this.color = 'white'
        } else {
            this.color = 'rgba(255, 255, 255, 0.2)'
        }
    }
}