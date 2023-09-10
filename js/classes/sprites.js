class Sprite {
    constructor({position = { x: 0, y: 0 }, imageSrc, frames = {maxX: 1, maxY: 1, currentX: 0, currentY: 0}, placementLvl, offset = {x: 0, y:0}}) {
        this.position = position
        if (placementLvl != undefined) {
            this.plaplacementLvl = placementLvl
        }
        this.image = new Image()
        this.image.src = imageSrc
        this.frames = {
            maxX: frames.maxX,
            maxY: frames.maxY,
            currentX: frames.currentX,
            currentY: frames.currentY,
            elapsed: 0,
            hold: 5,
        }
        this.offset = offset
    }

    draw() {
        const cropWidth = this.image.width / this.frames.maxX
        const cropHeight = this.image.height / this.frames.maxY



        const crop = {
            position: {
                x: cropWidth * this.frames.currentX, 
                y: cropHeight * this.frames.currentY, 
            },
            width: cropWidth,
            height: cropHeight 
        }

        

        ctx.drawImage(
                this.image,
                crop.position.x, 
                crop.position.y, 
                crop.width, 
                crop.height, 
                this.position.x + this.offset.x,
                this.position.y + this.offset.y,
                crop.width,
                crop.height
            )

    }
    update() {
        // настройки смены кадров анимации
        this.frames.elapsed++
        if (this.waypointIndex === 1 || this.waypointIndex === 2 || this.waypointIndex === 3 || this.waypointIndex === 7 ) {
            this.frames.currentY = 1
        } else if (this.waypointIndex === 4 || this.waypointIndex === 6 || this.waypointIndex === 8 || this.waypointIndex === 7) {
            this.frames.currentY = 3
        } else if (this.waypointIndex === 9 || this.waypointIndex === 11 || this.waypointIndex === 5 ) {
            this.frames.currentY = 2
        } else if (this.waypointIndex === 10) {
            this.frames.currentY = 0  
        }
            
        if (this.frames.elapsed % this.frames.hold === 0) {
                this.frames.currentX++
                

                if (this.frames.currentX >= this.frames.maxX) {
                    this.frames.currentX = 0
                }
        }
    }
}