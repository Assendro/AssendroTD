class Enemy extends Sprite{
    constructor({position = { x: 0, y: 0 }, enemyImageSrc, type, frames = {currentX: 0, currentY: 0}}) {
        super({ 
            position, 
            imageSrc: enemyImageSrc,
            frames: {
                maxX: 3,
                maxY: 4,
                currentX: frames.currentX,
                currentY: frames.currentY
            }
        })
        this.type = type

        this.position = position
        this.width = 50
        this.height = 50
        this.waypointIndex = 0

        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }
        this.radius = 25

        this.health = 100 
        this.velocity = {
            x: 0,
            y: 0
        }
        this.speed = 0.5 * this.type
    }
    

    draw() {
        super.draw()
        /* отрисовка хп */ 
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x + 10, this.position.y - 8, this.width - 20 , 5)


        ctx.fillStyle = 'green'
        ctx.fillRect(this.position.x + 10, this.position.y - 8, (this.width - 20) * this.health / 100 , 5)
    }

    update() {
        this.draw()
        super.update()


        

        /* вычисление угла атаки врага */
        const waypoint = waypoints[this.waypointIndex]
        const yDistance = waypoint.y - this.center.y
        const xDistance = waypoint.x -this.center.x
        const angle = Math.atan2(yDistance, xDistance)

        this.velocity.x = Math.cos(angle) * this.speed
        this.velocity.y = Math.sin(angle) * this.speed

        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y 

        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }


        if (
            Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < Math.abs(this.velocity.x) &&
            Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) < Math.abs(this.velocity.y) && 
            this.waypointIndex < waypoints.length - 1
        )   {
            this.waypointIndex++
        }
    }
}