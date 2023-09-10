class Building extends Sprite{
    constructor({position = {x: 0, y: 0}, frames = {currentX: 0, currentY: 0}, lvl, offset = {x: -32, y: -104}}) {
        super({
            position,
            imageSrc: `./img/lvl${lvl} weapon2.png`,
            frames: {
                maxX: 17, 
                maxY: 1,
                currentX: frames.currentX,
                currentY: frames.currentY
            }, 
            offset
                /*
                -104
                -113

                */
        }) 

        this.lvl = lvl
        this.width = 32 * 2 
        this.height = 32 * 4
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y
        }
        this.projectiles = []
        this.strikeRadius = 100 
        this.strikeRadiusColor = 'rgba(0, 255, 127, 0.2)'
        this.target 
        this.rapidity = 100

        
    }

    draw() {


        super.draw()

        

        if (this.target || !this.target && this.frames.currentX !== 0 ) {

            super.update()


        }  
  





        /*ctx.beginPath() 
        ctx.arc(this.center.x, this.center.y, this.strikeRadius, 0, Math.PI * 2)
        ctx.fillStyle = this.strikeRadiusColor
        ctx.fill()*/

    }

    update() { 

        this.draw()



        if (this.target && this.frames.currentX === 6 && this.frames.elapsed % this.frames.hold === 0) {

            this.shoot()


        }
        

    }

    shoot() {
        this.projectiles.push(
            new Projectile({
                position: {
                    x: this.center.x - 10, 
                    y: this.center.y - this.height / 2 - 30
                }, 
                enemy: this.target,
                lvl: this.lvl,
                imageSrc: `./img/lvl${this.lvl} projectile.png`
                
            })
            
        )
        
    }
}