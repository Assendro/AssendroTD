class Projectile extends Sprite {
    constructor({position = {x: 0, y: 0}, enemy, lvl, imageSrc }) {
        super({
            position,
            imageSrc: imageSrc,
            frames: {
                maxX: 6, 
                maxY: 1, 
                currentX: 0, 
                currentY: 0
            }
            
        })
        this.velocity = {
            x: 0,
            y: 0
        }
        this.lvl = lvl
        this.dmg = 20
        this.color = 'orange'
        this.enemy = enemy
        this.speed = 12


    }

    update() {
        this.draw()

        const angle = Math.atan2(
            this.enemy.center.y - this.position.y,
            this.enemy.center.x - this.position.x
        )

        this.velocity.x = Math.cos(angle) * this.speed
        this.velocity.y = Math.sin(angle) * this.speed

        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y 
    }
}