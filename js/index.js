
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 960
canvas.height = 640

ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.width, canvas.height)

const towerPlacementsData2D = []

for (let i = 0; i < towerPlacementsData.length; i+=30) {
    towerPlacementsData2D.push(towerPlacementsData.slice(i, i + 30))
}



const placementTiles = []

towerPlacementsData2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 1 || symbol === 2) {
            placementTiles.push(
                new PlacementTile({
                    position: {
                        x: x * 32,
                        y: y * 32
                    }
                })
            )
        }
    })

})

/* отрисовка */
const image = new Image()

image.onload = () => {
    animate()  
}

function soundBack() {
    var audio = new Audio(); 
    audio.src = './sounds/Back.mp3';
    audio.autoplay = true;
    audio.volume = 0.1
} 
function soundHit(lvl) {
    var audio = new Audio(); 
    audio.src = `./sounds/hit${lvl}.mp3`;
    audio.autoplay = true;
    audio.volume = 0.01
}; 




image.src = './img/Background.png'



const enemies = []
let  enemyType = 1


function spawnEnemies(enemyQuantity, enemyType) {
    for (let i = 1; i < enemyQuantity + 1; i++) {
        const yOffset = i * 100
        const enemyImageSrcs = `./img/lvl${enemyType} enemy.png`
        
        enemies.push( new Enemy({
            position: { x: waypoints[0].x, y: waypoints[0].y + yOffset }, 
            enemyImageSrc: enemyImageSrcs,
            type: enemyType,
            frames: {currentX: 0, currentY: 0}
        })) 
    }
}
spawnEnemies(1, enemyType)

const buildings = []
let activeTile = undefined

// Настройки игры 

const enemyQuantity = 4
let dificultyLvl = 1
let hearts = 20
let gold = 20
let lvl = 0;
let waveQnt = 1;

const explosions = []


/* функция цикличной отрисовки */

function animate () {
    
    const animationId = requestAnimationFrame(animate) 

    ctx.drawImage(image, 0, 0)

    for (let i = enemies.length - 1; i >= 0; i-- ) {
        const enemy = enemies[i]
        enemy.update()




        if (enemy.center.x > canvas.width + 25) { 
            enemies.splice(i, 1)


            hearts -= 1 * (enemyType * 2) 
            document.querySelector('.hpQuantity').innerHTML = hearts
            if (hearts < 10 && document.querySelector('.hpQuantity').style.right != '50px') {
                document.querySelector('.hpQuantity').style.right = '50px'

            }

            if (hearts <= 0) {
                cancelAnimationFrame(animationId)
                document.querySelector(".gameOver").style.display = 'flex' 
            }
        }

    }

    for (let i = explosions.length - 1; i >= 0; i-- ) {
        const explosion = explosions[i]
        explosion.draw()
        explosion.update()

        if (explosion.frames.currentX >= explosion.frames.maxX -1) {
            explosions.splice(i, 1)
        }
    }
    /* настройки волн */
    if (enemies.length === 0) {
        soundBack()
        waveQnt++
        document.querySelector('.waveQuantity').innerHTML = waveQnt

        if (+dificultyLvl > 2 && enemyType === 1) {
            enemyType++
        } else if (+dificultyLvl > 4 && enemyType === 2) {
            enemyType++
        }

        spawnEnemies(enemyQuantity + dificultyLvl*2 , enemyType)
        dificultyLvl++
    }

    placementTiles.forEach((tile) => {
        tile.update(mouse)
        
    })

    buildings.forEach((building) => {

        building.update()


        building.target = null
        
        const validEnemies = enemies.filter(enemy => {
            const xDifference = enemy.center.x - building.center.x
            const yDifference = enemy.center.y - building.center.y
            const distance = Math.hypot(xDifference, yDifference)

            return distance < enemy.radius + building.strikeRadius + 50 * building.lvl
        })

        building.target = validEnemies[0]

        for (let i = building.projectiles.length - 1; i >= 0; i--) {
            const projectile = building.projectiles[i]

            projectile.update()
            
            /* рассчёт расстояния до врага и обработка попадания */ 
            
            const xDifference = projectile.enemy.center.x - projectile.position.x
            const yDifference = projectile.enemy.center.y - projectile.position.y
            const distance = Math.hypot(xDifference, yDifference)
            
             if (distance < projectile.enemy.radius) {
                explosions.push(new Sprite({
                    position: { x: projectile.position.x, y: projectile.position.y },
                    imageSrc: `./img/lvl${projectile.lvl} explosion.png`,
                    frames: {maxX: 9, maxY: 1, currentX: 0, currentY: 0},
                    offset: {x: -32, y:-32}
                }))

                projectile.enemy.health -= projectile.dmg * projectile.lvl / enemyType 
                soundHit(projectile.lvl)
                
                if (projectile.enemy.health <= 0) {
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectile.enemy === enemy
                    })
                    if (enemyIndex > -1) {
                        enemies.splice(enemyIndex, 1) 
                        gold += 2 * enemyType
                        document.querySelector('.goldQuantity').innerHTML = gold

                        if (gold >= 100 && document.querySelector('.goldQuantity').style.right != '15px') {
                            document.querySelector('.goldQuantity').style.right = '15px'
                        } else if (gold < 100 && gold > 10  &&  document.querySelector('.goldQuantity').style.right != '35px') {
                            document.querySelector('.goldQuantity').style.right = '35px'
                        } else if (gold < 10  && document.querySelector('.goldQuantity').style.right != '50px') {
                            document.querySelector('.goldQuantity').style.right = '50px'
                        }
                    }
                }
                


                building.projectiles.splice(i, 1)


            } 
        }
    })
}

const mouse = {
    x: undefined,
    y: undefined
}



canvas.addEventListener('click', (event) => {
    
        if (activeTile && !activeTile.isOccupied && gold - activeTile.cost >= 0) {
            gold -= activeTile.cost
            document.querySelector('.goldQuantity').innerHTML = gold
            

            if (gold >= 100 && document.querySelector('.goldQuantity').style.right != '15px') {
                document.querySelector('.goldQuantity').style.right = '15px'
            } else if (gold < 100 && gold > 10  && document.querySelector('.goldQuantity').style.right != '35px') {
                document.querySelector('.goldQuantity').style.right = '35px'
            } else if (gold < 10  && document.querySelector('.goldQuantity').style.right != '50px') {
                document.querySelector('.goldQuantity').style.right = '50px'
            }

            activeTile.lvl++
            activeTile.cost = (activeTile.cost + 10) * activeTile.lvl
            if (activeTile.lvl === 1) {
                buildings.push(
                    new Building({
                        position: {
                            x: activeTile.position.x,
                            y: activeTile.position.y
                        },
                        lvl: activeTile.lvl,
                        offset: {
                            x: -32,
                            y: -95 - 9 * activeTile.lvl
                        }
                    }
                    )
                )
            } else if (activeTile.lvl === 2) {
                for (let i = buildings.length - 1; i >= 0; i--) { 
                    if (buildings[i].position.x == activeTile.position.x && buildings[i].position.y == activeTile.position.y) {
                        buildings.splice(i, 1)
                    }
                }
                buildings.push(
                    new Building({
                        position: {
                            x: activeTile.position.x,
                            y: activeTile.position.y
                        },
                        lvl: activeTile.lvl,
                        offset: {
                            x: -32,
                            y: -95 - 9 * activeTile.lvl
                        }
                    }
                    )
                )
                //buildings.find(building => building.position.x === activeTile.position.x && building.position.y === activeTile.position.y).lvl = activeTile.lvl


            } else if (activeTile.lvl === 3) {
                for (let i = buildings.length - 1; i >= 0; i--) { 
                    if (buildings[i].position.x == activeTile.position.x && buildings[i].position.y == activeTile.position.y) {
                        buildings.splice(i, 1)
                    }
                }
                buildings.push(
                    new Building({
                        position: {
                            x: activeTile.position.x,
                            y: activeTile.position.y
                        },
                        lvl: activeTile.lvl,
                        offset: {
                            x: -32,
                            y: -95 - 9 * activeTile.lvl
                        }
                    }
                    )
                )
                
                activeTile.isOccupied = true
                activeTile.cost += 10
            }

            buildings.sort((a, b) => {
                return a.position.y - b.position.y

            })
        }
}) 

const windowWidth = window.innerWidth

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX - (windowWidth - canvas.width) /2
    mouse.y = event.clientY


    activeTile = null
    
    for (let i = 0; i < placementTiles.length; i++) {
        const tile = placementTiles[i]
        
        
        if (mouse.x > tile.position.x  && 
            mouse.x < tile.position.x + tile.width * 2 &&
            mouse.y > tile.position.y - tile.height && 
            mouse.y < tile.position.y + tile.height 
        ) {
            activeTile = tile
            break
        }    
    }
    
})






