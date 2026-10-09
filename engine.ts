// BLOCK MUNCHER ENGINE
// This file is the game itself: the world, punching, crafting, animals,
// mobs, horses, day and night. The tuning knobs live in main.ts, which
// is the part you edit in Blocks.
//
// main.ts runs LAST, after this file. So nothing out here may read a
// knob directly; anything that needs one goes inside startTheGame().

namespace SpriteKind {
    export const Tree = SpriteKind.create()
    export const Stone = SpriteKind.create()
    export const Iron = SpriteKind.create()
    export const Pig = SpriteKind.create()
    export const Cow = SpriteKind.create()
    export const Sheep = SpriteKind.create()
    export const Chicken = SpriteKind.create()
    export const Horse = SpriteKind.create()
    export const Gold = SpriteKind.create()
    export const Coal = SpriteKind.create()
    export const Furnace = SpriteKind.create()
    export const Bed = SpriteKind.create()
    export const Zombie = SpriteKind.create()
    export const Spider = SpriteKind.create()
    export const Creeper = SpriteKind.create()
    export const Skeleton = SpriteKind.create()
    export const Table = SpriteKind.create()
    export const Box = SpriteKind.create()
    export const Hud = SpriteKind.create()
    export const Decor = SpriteKind.create()
}

let hero: Sprite = null
let hud: Sprite = null
// Event handlers below are registered as soon as this file loads, but the
// hero and the text bar only exist once the start block runs. Handlers that
// touch them wait for this.
let gameStarted = false

// ===== INVENTORY =====
let wood = 0
let stone = 0
let iron = 0
let boxes = 0
let food = 0
let wool = 0
let leather = 0
let sand = 0
let hasShovel = false
let gold = 0
let rawGold = 0
let coal = 0
let glass = 0
let apples = 0
let goldenApples = 0
let hasFurnace = false
let hasGoldPickaxe = false
let hasGoldArmor = false
// What the furnace is cooking, how many, and how many seconds are left.
let smeltWhat = ""
let smeltCount = 0
let smeltLeft = 0
let hasIronPickaxe = false
let hasSaddle = false
let horseArmors = 0
let day = 1
let hasBed = false

// ===== THE CLOCK =====
let isNight = false
let secondsLeft = 0
let lastHurt = 0

// ===== HORSE RIDING =====
let ridden: Sprite = null
let horseNearby: Sprite = null
let horseHearts = 0
// Every horse wearing armor, and every armored horse that has been hit once.
// Lists remember each horse separately, so getting off and on again does not
// heal a horse, and armoring a second horse does not forget the first.
let armoredHorses: Sprite[] = []
let woundedHorses: Sprite[] = []
let hasTable = false
let hasPickaxe = false
let hasArmor = false

// ===== PUNCH MEMORY: which block you are hitting, and how many times =====
let target: Sprite = null
let lastTarget: Sprite = null
let hitsSoFar = 0

// ===== THE WORLD =====
// The ground is a tilemap: grass, then a beach, then the ocean on the
// right-hand side. The shoreline wiggles a little from row to row.
let grassTile = img`
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    `
let sandTile = img`
    d d d d d d d d d d d d d d d d
    d d d d d d d d d d d b d d d d
    d d b d d d d d d d d d d d d d
    d d d d d d d d d d d d d d d d
    d d d d d d d b d d d d d d d d
    d d d d d d d d d d d d d d b d
    d d d d d d d d d d d d d d d d
    d b d d d d d d d d d d d d d d
    d d d d d d d d d d b d d d d d
    d d d d d b d d d d d d d d d d
    d d d d d d d d d d d d d d d d
    d d d d d d d d d d d d d b d d
    d d d b d d d d d d d d d d d d
    d d d d d d d d b d d d d d d d
    d d d d d d d d d d d d d d d d
    d d d d d d d d d d d d d d d d
    `
let waterTile = img`
    8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
    8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
    8 8 9 9 8 8 8 8 8 8 8 8 8 8 8 8
    8 9 8 8 9 8 8 8 8 8 8 8 8 8 8 8
    8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
    8 8 8 8 8 8 8 8 8 8 8 9 9 8 8 8
    8 8 8 8 8 8 8 8 8 8 9 8 8 9 8 8
    8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
    8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
    8 8 8 8 8 9 9 8 8 8 8 8 8 8 8 8
    8 8 8 8 9 8 8 9 8 8 8 8 8 8 8 8
    8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
    8 8 8 8 8 8 8 8 8 8 8 8 8 9 9 8
    8 8 8 8 8 8 8 8 8 8 8 8 9 8 8 9
    8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
    8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
    `
// A hole where you dug sand. It fills back in every morning.
let holeTile = img`
    d d d d d d d d d d d d d d d d
    d d d d d d d d d d d d d d d d
    d d d d b b b b b b b b d d d d
    d d d b e e e e e e e e b d d d
    d d b e e e e e e e e e e b d d
    d d b e e e e e e e e e e b d d
    d d b e e e e e e e e e e b d d
    d d b e e e e e e e e e e b d d
    d d b e e e e e e e e e e b d d
    d d b e e e e e e e e e e b d d
    d d b e e e e e e e e e e b d d
    d d b e e e e e e e e e e b d d
    d d d b e e e e e e e e b d d d
    d d d d b b b b b b b b d d d d
    d d d d d d d d d d d d d d d d
    d d d d d d d d d d d d d d d d
    `
// Tile numbers in the map.
let GRASS = 0
let SAND = 1
let WATER = 2
let HOLE = 3
// The same map with darker tiles for night. Both share one set of tiles,
// so a hole dug in the day is still there at night.
let dayMap: tiles.TileMapData = null
let nightMap: tiles.TileMapData = null
// Everything left of landRight is grass. Animals stay left of seaLeft.
let landRight = 0
let seaLeft = 0
let heroSpeed = 0
let digCol = -1
let digRow = -1
let digsSoFar = 0

function buildWorld () {
    // The world is made of 16x16 tiles, so round the size down to whole tiles.
    let cols = Math.max(12, Math.idiv(WORLD_WIDTH, 16))
    let rows = Math.max(8, Math.idiv(WORLD_HEIGHT, 16))
    WORLD_WIDTH = cols * 16
    WORLD_HEIGHT = rows * 16
    // Two extra rows under the world so its bottom can scroll up above the
    // text bar. They are walls, so nothing walks into them.
    let mapRows = rows + 2
    let ocean = Math.constrain(OCEAN_TILES, 0, cols - 6)
    let beach = Math.constrain(BEACH_TILES, 0, cols - 6 - ocean)
    let data = control.createBuffer(4 + cols * mapRows)
    data.setNumber(NumberFormat.UInt16LE, 0, cols)
    data.setNumber(NumberFormat.UInt16LE, 2, mapRows)
    let walls = image.create(cols, mapRows)
    let wiggle = 0
    landRight = WORLD_WIDTH
    seaLeft = WORLD_WIDTH
    for (let row = 0; row < mapRows; row++) {
        if (row < rows) {
            wiggle = Math.constrain(wiggle + randint(-1, 1), -1, 1)
        } else {
            // 2 is the number the tilemap uses for "wall".
            walls.fillRect(0, row, cols, 1, 2)
        }
        // The sea keeps at least one tile of water on every row, and the
        // beach at least one tile of sand, however the shore wiggles.
        let waterStart = cols
        if (ocean > 0) {
            waterStart = Math.constrain(cols - ocean + wiggle, 4, cols - 1)
        }
        let sandStart = waterStart
        if (beach > 0) {
            sandStart = Math.constrain(waterStart - beach + randint(-1, 0), 4, waterStart - 1)
        }
        landRight = Math.min(landRight, sandStart * 16)
        seaLeft = Math.min(seaLeft, waterStart * 16)
        for (let col = 0; col < cols; col++) {
            let tile = GRASS
            if (col >= waterStart) {
                tile = WATER
            } else if (col >= sandStart) {
                tile = SAND
            }
            data.setUint8(4 + col + row * cols, tile)
        }
    }
    dayMap = tiles.createTilemap(data, walls, [grassTile, sandTile, waterTile, holeTile], TileScale.Sixteen)
    nightMap = tiles.createTilemap(data, walls, [darker(grassTile), darker(sandTile), darker(waterTile), darker(holeTile)], TileScale.Sixteen)
    tiles.setCurrentTilemap(dayMap)
}

// Night colours: each colour swapped for a darker one.
function darker (tile: Image) {
    let dark = tile.clone()
    dark.replace(6, 8)
    dark.replace(7, 6)
    dark.replace(8, 12)
    dark.replace(9, 8)
    dark.replace(11, 12)
    dark.replace(13, 11)
    dark.replace(14, 15)
    return dark
}

// Which tile (GRASS, SAND, WATER or HOLE) is under a sprite.
function tileUnder (who: Sprite) {
    return game.currentScene().tileMap.getTileIndex(who.x >> 4, who.y >> 4)
}

// Swimming is slow. Riding is fast (unless your horse is swimming too).
function setHeroSpeed () {
    let speed = 100
    if (ridden != null) {
        speed = RIDE_SPEED
    }
    if (tileUnder(hero) == WATER) {
        speed = SWIM_SPEED
    }
    if (speed != heroSpeed) {
        heroSpeed = speed
        controller.moveSprite(hero, speed, speed)
    }
}

// Dig the sand you are standing on. Needs a shovel.
function dig () {
    let col = hero.x >> 4
    let row = hero.y >> 4
    if (tileUnder(hero) != SAND) {
        return false
    }
    if (!(hasShovel)) {
        hero.sayText("I need a shovel", 800, false)
        return true
    }
    if (col != digCol || row != digRow) {
        digCol = col
        digRow = row
        digsSoFar = 0
    }
    digsSoFar += 1
    if (digsSoFar >= SAND_DIGS) {
        game.currentScene().tileMap.setTileAt(col, row, HOLE)
        sand += 1
        digCol = -1
        digsSoFar = 0
        hero.sayText("+1 sand", 600, false)
        updateHud()
    }
    return true
}

// Every morning the holes fill back in.
function fillHoles () {
    let map = game.currentScene().tileMap
    for (let col = 0; col < map.areaWidth() >> 4; col++) {
        for (let row = 0; row < map.areaHeight() >> 4; row++) {
            if (map.getTileIndex(col, row) == HOLE) {
                map.setTileAt(col, row, SAND)
            }
        }
    }
}

// Blocks and grass only go on grass.
function randomSpotX () {
    return randint(10, Math.max(10, landRight - 10))
}

function randomSpotY () {
    return randint(16, WORLD_HEIGHT - 16)
}

// Where the camera is looking. It follows you, but stops at the world's edge.
function cameraX () {
    return Math.constrain(hero.x, 80, WORLD_WIDTH - 80)
}

function cameraY () {
    // +28 so the bottom of the world can scroll up above the text bar
    return Math.constrain(hero.y, 60, WORLD_HEIGHT - 60 + 28)
}

// Animals walk anywhere on land (the beach too), and turn around at the
// world's edge and at the water.
function keepInWorld (kind: number) {
    for (let critter of sprites.allOfKind(kind)) {
        if (critter == ridden) {
            // A horse you are riding goes where you go, even into the sea.
            continue
        }
        if (critter.x < 8) {
            critter.x = 8
            critter.vx = Math.abs(critter.vx)
        } else if (critter.x > seaLeft - 8) {
            critter.x = seaLeft - 8
            critter.vx = 0 - Math.abs(critter.vx)
        }
        if (critter.y < 8) {
            critter.y = 8
            critter.vy = Math.abs(critter.vy)
        } else if (critter.y > WORLD_HEIGHT - 8) {
            critter.y = WORLD_HEIGHT - 8
            critter.vy = 0 - Math.abs(critter.vy)
        }
    }
}

game.onUpdate(function () {
    if (!(gameStarted)) {
        return
    }
    hero.x = Math.constrain(hero.x, 8, WORLD_WIDTH - 8)
    hero.y = Math.constrain(hero.y, 8, WORLD_HEIGHT - 8)
    scene.centerCameraAt(cameraX(), cameraY())
    setHeroSpeed()
    if (ridden != null) {
        ridden.setPosition(hero.x, hero.y + 4)
        ridden.vx = 0
        ridden.vy = 0
    }
    keepInWorld(SpriteKind.Pig)
    keepInWorld(SpriteKind.Cow)
    keepInWorld(SpriteKind.Sheep)
    keepInWorld(SpriteKind.Chicken)
    keepInWorld(SpriteKind.Horse)
})

// Little grass tufts and flowers, so you can see yourself moving.
function plantGrass () {
    for (let index = 0; index < GRASS_TUFTS; index++) {
        let tuft: Sprite = null
        if (Math.percentChance(25)) {
            tuft = sprites.create(img`
                . . . . . . . .
                . . . 5 . . . .
                . . 5 2 5 . . .
                . . . 5 . . . .
                . . . 6 . . . .
                . . 6 6 . . . .
                . . . 6 . . . .
                . . . . . . . .
                `, SpriteKind.Decor)
        } else {
            tuft = sprites.create(img`
                . . . . . . . .
                . . . . . . . .
                . . . . . . . .
                . 6 . . 6 . . .
                . 6 . 6 . . 6 .
                . . 6 6 . 6 . .
                . . . 6 6 . . .
                . . . . . . . .
                `, SpriteKind.Decor)
        }
        tuft.setPosition(randomSpotX(), randomSpotY())
        tuft.z = -10
    }
}

// ===== SPAWNING BLOCKS =====
function spawnBlock () {
    let roll = randint(1, 10)
    let block: Sprite = null
    if (day >= GOLD_FROM_DAY && Math.percentChance(GOLD_CHANCE)) {
        block = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . b b b b b b . . . . .
            . . . b b b 5 5 b b b b b . . .
            . . b b b 5 4 b b b d b b b . .
            . b b d b b b b b 5 5 b b b b .
            . b b b b b b b 5 4 b b b c b .
            . b c b b 5 5 b b b b b b b b .
            b b b b 5 4 b b b d b b 5 5 b b
            b b d b b b b b b b b 5 4 b b b
            b b b b b b 5 5 b b b b b b c b
            b b b c b 5 4 b b b b d b b b b
            . b b b b b b b b 5 5 b b b b .
            . b b d b b b b 5 4 b b b b b .
            . . b b b b c b b b b b d b . .
            . . . c c c c c c c c c c . . .
            . . . . . . . . . . . . . . . .
            `, SpriteKind.Gold)
    } else if (roll <= 5) {
        block = sprites.create(img`
            . . . . . 7 7 7 7 7 7 . . . . .
            . . . 7 7 7 7 6 7 7 7 7 7 . . .
            . . 7 7 6 7 7 7 7 7 6 7 7 7 . .
            . 7 7 7 7 7 7 7 7 7 7 7 7 7 7 .
            . 7 6 7 7 7 6 7 7 7 7 7 6 7 7 .
            . 7 7 7 7 7 7 7 7 6 7 7 7 7 7 .
            . . 7 7 6 7 7 7 7 7 7 7 7 7 . .
            . . . 7 7 7 7 7 6 7 7 7 7 . . .
            . . . . . 7 7 e e 7 7 . . . . .
            . . . . . . e e e e . . . . . .
            . . . . . . e e e e . . . . . .
            . . . . . . e e e e . . . . . .
            . . . . . . e e e e . . . . . .
            . . . . . . e e e e . . . . . .
            . . . . . e e e e e e . . . . .
            . . . . . . . . . . . . . . . .
            `, SpriteKind.Tree)
    } else if (roll <= 7) {
        block = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . b b b b b b . . . . .
            . . . b b b d b b b b b b . . .
            . . b b d b b b b c b b b b . .
            . b b b b b b c b b b d b b b .
            . b c b b b b b b b b b b c b .
            . b b b d b b b c b b b b b b .
            b b b b b b b b b b b d b b b b
            b b c b b b d b b b b b b c b b
            b b b b b b b b b c b b b b b b
            b b b d b b b b b b b b d b b b
            . b b b b c b b d b b b b b b .
            . b b b b b b b b b c b b b b .
            . . b b d b b b b b b b d b . .
            . . . c c c c c c c c c c . . .
            . . . . . . . . . . . . . . . .
            `, SpriteKind.Stone)
    } else if (roll == 8) {
        block = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . b b b b b b . . . . .
            . . . b b b f b b b b b b . . .
            . . b b f b b b b f b b b b . .
            . b b b b b b f b b b f b b b .
            . b f b b b b b b b b b b f b .
            . b b b f b b b f b b b b b b .
            b b b b b b b b b b b f b b b b
            b b f b b b f b b b b b b f b b
            b b b b b b b b b f b b b b b b
            b b b f b b b b b b b b f b b b
            . b b b b f b b f b b b b b b .
            . b b b b b b b b b f b b b b .
            . . b b f b b b b b b b f b . .
            . . . f c f c f c f c f c . . .
            . . . . . . . . . . . . . . . .
            `, SpriteKind.Coal)
    } else {
        block = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . b b b b b b . . . . .
            . . . b b b 4 4 b b b b b . . .
            . . b b b 4 4 b b b d b b b . .
            . b b d b b b b b 4 4 b b b b .
            . b b b b b b b 4 4 b b b c b .
            . b c b b 4 4 b b b b b b b b .
            b b b b 4 4 b b b d b b 4 4 b b
            b b d b b b b b b b b 4 4 b b b
            b b b b b b 4 4 b b b b b b c b
            b b b c b 4 4 b b b b d b b b b
            . b b b b b b b b 4 4 b b b b .
            . b b d b b b b 4 4 b b b b b .
            . . b b b b c b b b b b d b . .
            . . . c c c c c c c c c c . . .
            . . . . . . . . . . . . . . . .
            `, SpriteKind.Iron)
    }
    block.setPosition(randomSpotX(), randomSpotY())
}

// ===== ANIMALS =====
function spawnAnimal () {
    let roll = randint(1, 5)
    let animal: Sprite = null
    if (roll == 1) {
        animal = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . 3 3 3 3 3 3 3 3 3 . . . .
            . . 3 3 3 3 3 3 3 3 3 3 3 3 3 .
            . . 3 3 3 3 3 3 3 3 3 3 f 3 3 .
            . 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
            . 3 3 3 3 3 3 3 3 3 3 3 3 2 2 3
            . 3 3 3 3 3 3 3 3 3 3 3 3 2 2 3
            . . 3 3 3 3 3 3 3 3 3 3 3 3 3 .
            . . 3 3 3 3 3 3 3 3 3 3 3 . . .
            . . 3 3 . 3 3 . . 3 3 . 3 3 . .
            . . 3 3 . 3 3 . . 3 3 . 3 3 . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            `, SpriteKind.Pig)
    } else if (roll == 2) {
        animal = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . 1 . .
            . . . . . . . . . . . . f f f .
            . . f f f f 1 1 1 f f f f f f f
            . . f 1 1 f f 1 1 1 f f f 1 f f
            . . f 1 1 1 f f f 1 1 f f f d d
            . f f f 1 1 1 1 f f 1 f f f d d
            . f f f f 1 1 1 1 1 1 f f . f f
            . f 1 1 f f f 1 1 f f f f . . .
            . . 1 1 1 f f f f f 1 1 f . . .
            . . f f f 1 1 1 1 1 1 f f . . .
            . . f f . f f . . f f . f f . .
            . . f f . f f . . f f . f f . .
            . . e e . e e . . e e . e e . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            `, SpriteKind.Cow)
    } else if (roll == 3) {
        animal = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . 1 1 1 1 1 1 1 . . . . .
            . . . 1 1 1 1 1 1 1 1 1 1 . . .
            . . 1 1 1 1 1 1 1 1 1 1 1 d d .
            . 1 1 1 1 1 1 1 1 1 1 1 d d d d
            . 1 1 1 1 1 1 1 1 1 1 1 d f d d
            . 1 1 1 1 1 1 1 1 1 1 1 d d d d
            . 1 1 1 1 1 1 1 1 1 1 1 1 d d .
            . . 1 1 1 1 1 1 1 1 1 1 1 . . .
            . . 1 1 1 1 1 1 1 1 1 1 . . . .
            . . . d d . d d . d d . d d . .
            . . . d d . d d . d d . d d . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            `, SpriteKind.Sheep)
    } else if (roll == 5) {
        animal = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . f f . . .
            . . . . . . . . . . f e e e . .
            . . . . . . . . . f e e f e . .
            . . . . . . . . f e e e e e e .
            . . . . . . . . f e e e . e e .
            . . e e e e e e e e e e . . . .
            . e e e e e e e e e e e . . . .
            . e e e e e e e e e e e . . . .
            . f e e e e e e e e e . . . . .
            . f . e e . . . . e e . . . . .
            . . . e e . . . . e e . . . . .
            . . . e e . . . . e e . . . . .
            . . . f f . . . . f f . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            `, SpriteKind.Horse)
    } else {
        animal = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . 2 2 . . . .
            . . . . . . . . . 1 1 1 1 . . .
            . . . . . . . . . 1 f 1 1 5 5 .
            . . . . . . . . . 1 1 1 1 5 5 .
            . . . . . . . . . 1 1 1 2 . . .
            . . 1 1 . . . . 1 1 1 1 . . . .
            . . 1 1 1 1 1 1 1 1 1 1 . . . .
            . . . 1 1 1 1 1 1 1 1 1 . . . .
            . . . 1 1 1 d d 1 1 1 . . . . .
            . . . . 1 1 1 1 1 1 . . . . . .
            . . . . . . 5 . 5 . . . . . . .
            . . . . . . 5 . 5 . . . . . . .
            . . . . . 5 5 . 5 5 . . . . . .
            . . . . . . . . . . . . . . . .
            `, SpriteKind.Chicken)
    }
    animal.setPosition(randomSpotX(), randomSpotY())
}

function wanderAll (kind: number) {
    for (let critter of sprites.allOfKind(kind)) {
        if (critter == ridden) {
            // the horse you ride goes where you go
        } else if (Math.percentChance(40)) {
            critter.vx = 0
            critter.vy = 0
        } else {
            critter.vx = randint(0 - ANIMAL_SPEED, ANIMAL_SPEED)
            critter.vy = randint(0 - ANIMAL_SPEED, ANIMAL_SPEED)
        }
    }
}

function isAnimal (thing: Sprite) {
    return thing.kind() == SpriteKind.Pig || thing.kind() == SpriteKind.Cow || thing.kind() == SpriteKind.Sheep || thing.kind() == SpriteKind.Chicken || thing.kind() == SpriteKind.Horse
}

function animalCount () {
    return sprites.allOfKind(SpriteKind.Pig).length + sprites.allOfKind(SpriteKind.Cow).length + sprites.allOfKind(SpriteKind.Sheep).length + sprites.allOfKind(SpriteKind.Chicken).length + sprites.allOfKind(SpriteKind.Horse).length
}

// ===== MOBS (they only come at night) =====
function spawnMob () {
    let roll = randint(1, 4)
    let mob: Sprite = null
    if (roll == 1) {
        mob = sprites.create(img`
            . . . . 7 7 7 7 7 7 7 7 . . . .
            . . . . 7 7 6 7 7 7 7 7 . . . .
            . . . . 7 f f 7 7 f f 7 . . . .
            . . . . 7 7 7 7 7 7 7 7 . . . .
            . . . . 7 7 6 f f 6 7 7 . . . .
            . . . . 7 7 7 7 7 7 7 7 . . . .
            . 7 7 9 9 9 9 9 9 9 9 9 9 7 7 .
            . 7 7 9 9 9 9 9 9 9 9 9 9 7 7 .
            . . . 9 9 9 9 9 9 9 9 9 9 . . .
            . . . 9 9 9 9 9 9 9 9 9 9 . . .
            . . . 8 8 8 8 8 8 8 8 8 8 . . .
            . . . 8 8 8 8 . . 8 8 8 8 . . .
            . . . 8 8 8 8 . . 8 8 8 8 . . .
            . . . 8 8 8 8 . . 8 8 8 8 . . .
            . . . c c c c . . c c c c . . .
            . . . . . . . . . . . . . . . .
            `, SpriteKind.Zombie)
        mob.follow(hero, ZOMBIE_SPEED)
    } else if (roll == 2) {
        mob = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . f . . . . . . . . . . . . f .
            . . f . . . . . . . . . . f . .
            f . . f . f f f f f f . f . . f
            . f . . f f f f f f f f . . f .
            . . f f f 2 f f f f 2 f f f . .
            . . . . f 2 2 f f 2 2 f . . . .
            . . f f f f f f f f f f f f . .
            . f . . f f f f f f f f . . f .
            f . . f . f f f f f f . f . . f
            . . f . . . . . . . . . . f . .
            . f . . . . . . . . . . . . f .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            `, SpriteKind.Spider)
        mob.follow(hero, SPIDER_SPEED)
    } else if (roll == 3) {
        mob = sprites.create(img`
            . . . . 7 7 7 7 7 7 7 7 . . . .
            . . . . 7 6 7 7 7 7 6 7 . . . .
            . . . . 7 f f 7 7 f f 7 . . . .
            . . . . 7 f f 7 7 f f 7 . . . .
            . . . . 7 7 7 f f 7 7 7 . . . .
            . . . . 7 7 f f f f 7 7 . . . .
            . . . . 7 7 f 7 7 f 7 7 . . . .
            . . . . 7 6 7 7 7 7 6 7 . . . .
            . . . . . 7 7 6 7 7 7 . . . . .
            . . . . . 7 7 7 7 6 7 . . . . .
            . . . . . 7 6 7 7 7 7 . . . . .
            . . . . . 7 7 7 7 7 7 . . . . .
            . . . . 7 7 7 . . 7 7 7 . . . .
            . . . . 7 6 7 . . 7 6 7 . . . .
            . . . . 7 7 7 . . 7 7 7 . . . .
            . . . . . . . . . . . . . . . .
            `, SpriteKind.Creeper)
        mob.follow(hero, CREEPER_SPEED)
    } else {
        mob = sprites.create(img`
            . . . . 1 1 1 1 1 1 1 1 . . . .
            . . . . 1 d d 1 1 d d 1 . . . .
            . . . . 1 f f 1 1 f f 1 . . . .
            . . . . 1 1 1 1 1 1 1 1 . . . .
            . . . . 1 f 1 f 1 f 1 1 . . . .
            . . . . 1 1 1 1 1 1 1 1 . . . .
            . . . . . . . d d . . . . . . .
            . . . d d . 1 1 1 1 . d d . . .
            . . . d . . 1 b b 1 . . d . . .
            . . . d . . 1 1 1 1 . . d . . .
            . . . . . . 1 b b 1 . . . . . .
            . . . . . . . d d . . . . . . .
            . . . . . . d . . d . . . . . .
            . . . . . . d . . d . . . . . .
            . . . . . . d . . d . . . . . .
            . . . . . 1 1 . . 1 1 . . . . .
            `, SpriteKind.Skeleton)
    }
    // Mobs come in from just past the edge of what you can see.
    let side = randint(1, 4)
    let mobX = 0
    let mobY = 0
    if (side == 1) {
        mobX = cameraX() - 88
        mobY = randint(cameraY() - 50, cameraY() + 30)
    } else if (side == 2) {
        mobX = cameraX() + 88
        mobY = randint(cameraY() - 50, cameraY() + 30)
    } else if (side == 3) {
        mobX = randint(cameraX() - 70, cameraX() + 70)
        mobY = cameraY() - 68
    } else {
        mobX = randint(cameraX() - 70, cameraX() + 70)
        mobY = cameraY() + 50
    }
    mob.setPosition(Math.constrain(mobX, 8, WORLD_WIDTH - 8), Math.constrain(mobY, 8, WORLD_HEIGHT - 8))
}

function isMob (thing: Sprite) {
    return thing.kind() == SpriteKind.Zombie || thing.kind() == SpriteKind.Spider || thing.kind() == SpriteKind.Creeper || thing.kind() == SpriteKind.Skeleton
}

function mobCount () {
    return sprites.allOfKind(SpriteKind.Zombie).length + sprites.allOfKind(SpriteKind.Spider).length + sprites.allOfKind(SpriteKind.Creeper).length + sprites.allOfKind(SpriteKind.Skeleton).length
}

function clearMobs () {
    for (let zombie of sprites.allOfKind(SpriteKind.Zombie)) {
        zombie.destroy(effects.fire, 300)
    }
    for (let spider of sprites.allOfKind(SpriteKind.Spider)) {
        spider.destroy()
    }
    for (let creeper of sprites.allOfKind(SpriteKind.Creeper)) {
        creeper.destroy()
    }
    for (let skeleton of sprites.allOfKind(SpriteKind.Skeleton)) {
        skeleton.destroy(effects.fire, 300)
    }
    for (let arrow of sprites.allOfKind(SpriteKind.Projectile)) {
        arrow.destroy()
    }
}

// ===== GETTING HURT =====
// You cannot be hurt twice in one second, so one touch is one hit.
function hurt (amount: number) {
    if (game.runtime() - lastHurt > HURT_COOLDOWN_MS && ridden != null) {
        // Riding: your horse takes the hit instead of you.
        lastHurt = game.runtime()
        horseHearts += -1
        scene.cameraShake(4, 200)
        if (horseHearts <= 0) {
            let lostHorse = ridden
            getOffHorse()
            armoredHorses.removeElement(lostHorse)
            woundedHorses.removeElement(lostHorse)
            lostHorse.destroy(effects.spray, 300)
            hero.sayText("My horse!", 1000, false)
        } else {
            woundedHorses.push(ridden)
        }
    } else if (game.runtime() - lastHurt > HURT_COOLDOWN_MS) {
        lastHurt = game.runtime()
        let damage = amount
        if (hasArmor || hasGoldArmor) {
            let blockChance = 50
            if (hasGoldArmor) {
                // Gold armor blocks 3 hits out of 4.
                blockChance = 75
            }
            if (damage > 1) {
                damage = damage - 1
            } else if (Math.percentChance(blockChance)) {
                damage = 0
                hero.sayText("Blocked!", 500, false)
            }
        }
        if (damage > 0) {
            info.changeLifeBy(0 - damage)
            scene.cameraShake(4, 200)
        }
    }
}

// Push a mob back so it does not stand on you.
function knockBack (mob: Sprite) {
    mob.x += mob.x - hero.x
    mob.y += mob.y - hero.y
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.Zombie, function (sprite, otherSprite) {
    hurt(1)
    knockBack(otherSprite)
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Spider, function (sprite, otherSprite) {
    hurt(1)
    knockBack(otherSprite)
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Creeper, function (sprite, otherSprite) {
    otherSprite.destroy(effects.fire, 400)
    scene.cameraShake(8, 400)
    lastHurt = 0
    hurt(2)
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite, otherSprite) {
    otherSprite.destroy()
    hurt(1)
})

// Skeletons keep their distance, then shoot.
game.onUpdate(function () {
    for (let skeleton of sprites.allOfKind(SpriteKind.Skeleton)) {
        let dx = hero.x - skeleton.x
        let dy = hero.y - skeleton.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        if (distance > 60) {
            skeleton.vx = dx / distance * SKELETON_SPEED
            skeleton.vy = dy / distance * SKELETON_SPEED
        } else {
            skeleton.vx = 0
            skeleton.vy = 0
        }
    }
})

game.onUpdateInterval(2000, function () {
    for (let skeleton of sprites.allOfKind(SpriteKind.Skeleton)) {
        let dx = hero.x - skeleton.x
        let dy = hero.y - skeleton.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        if (distance > 0) {
            sprites.createProjectileFromSprite(img`
                . . . . . . . .
                . . . . . . . .
                . . . . . . . .
                e e e e e e b b
                . . . . . . . .
                . . . . . . . .
                . . . . . . . .
                . . . . . . . .
                `, skeleton, dx / distance * ARROW_SPEED, dy / distance * ARROW_SPEED)
        }
    }
})

// ===== DAY AND NIGHT =====
function startNight () {
    isNight = true
    secondsLeft = NIGHT_SECONDS
    tiles.setCurrentTilemap(nightMap)
    game.splash("NIGHT " + day, "The mobs are coming!")
    updateHud()
}

function startDay () {
    isNight = false
    secondsLeft = DAY_SECONDS
    clearMobs()
    day += 1
    tiles.setCurrentTilemap(dayMap)
    fillHoles()
    game.splash("Good morning!", "Day " + day)
    updateHud()
}

game.onUpdateInterval(1000, function () {
    if (!(gameStarted)) {
        return
    }
    if (smeltLeft > 0) {
        smeltLeft += -1
        if (smeltLeft <= 0) {
            finishSmelting()
        }
    }
    secondsLeft += -1
    if (secondsLeft <= 0) {
        if (isNight) {
            startDay()
        } else {
            startNight()
        }
    }
    updateHud()
})


// ===== PUNCHING =====
// How many punches a block needs depends on its kind, and on your pickaxe.
function hitsNeeded (block: Sprite) {
    let needed = TREE_HITS
    if (block.kind() == SpriteKind.Zombie) {
        needed = ZOMBIE_HITS
    } else if (isMob(block)) {
        needed = MOB_HITS
    } else if (isAnimal(block)) {
        needed = ANIMAL_HITS
    } else if (block.kind() == SpriteKind.Stone) {
        needed = STONE_HITS
    } else if (block.kind() == SpriteKind.Iron) {
        needed = IRON_HITS
    } else if (block.kind() == SpriteKind.Gold) {
        needed = GOLD_HITS
    } else if (block.kind() == SpriteKind.Coal) {
        needed = COAL_HITS
    }
    if (hasPickaxe && (block.kind() == SpriteKind.Stone || block.kind() == SpriteKind.Iron || block.kind() == SpriteKind.Gold || block.kind() == SpriteKind.Coal)) {
        // The gold pickaxe is the fastest.
        if (hasGoldPickaxe) {
            needed = Math.ceil(needed / GOLD_PICK_POWER)
        } else {
            needed = Math.ceil(needed / PICKAXE_POWER)
        }
    }
    return needed
}

function collect (block: Sprite) {
    if (isMob(block)) {
        info.changeScoreBy(1)
    } else if (block.kind() == SpriteKind.Sheep) {
        wool += 1
        hero.sayText("+1 wool", 600, false)
    } else if (block.kind() == SpriteKind.Horse) {
        leather += 1
        hero.sayText("+1 leather", 600, false)
        armoredHorses.removeElement(block)
        woundedHorses.removeElement(block)
    } else if (block.kind() == SpriteKind.Cow) {
        food += 1
        leather += 1
        hero.sayText("+1 food +1 leather", 600, false)
    } else if (isAnimal(block)) {
        food += 1
    } else if (block.kind() == SpriteKind.Tree) {
        wood += 1
        if (Math.percentChance(APPLE_CHANCE)) {
            apples += 1
            hero.sayText("An apple!", 800, false)
        }
    } else if (block.kind() == SpriteKind.Stone) {
        stone += 1
    } else if (block.kind() == SpriteKind.Gold) {
        // Gold comes out raw. Smelt it in a furnace to get gold.
        rawGold += 1
        hero.sayText("+1 raw gold", 600, false)
    } else if (block.kind() == SpriteKind.Coal) {
        coal += 1
        hero.sayText("+1 coal", 600, false)
    } else {
        iron += 1
    }
    block.destroy()
    scene.cameraShake(2, 100)
    lastTarget = null
    hitsSoFar = 0
    updateHud()
}

function punch (block: Sprite) {
    if ((block.kind() == SpriteKind.Iron || block.kind() == SpriteKind.Coal) && !(hasPickaxe)) {
        hero.sayText("Need a pickaxe!", 1000, false)
    } else if (block.kind() == SpriteKind.Gold && !(hasIronPickaxe)) {
        hero.sayText("Need an iron pickaxe!", 1000, false)
    } else {
        if (block != lastTarget) {
            lastTarget = block
            hitsSoFar = 0
        }
        hitsSoFar += 1
        block.startEffect(effects.spray, 150)
        if (hitsSoFar >= hitsNeeded(block)) {
            collect(block)
        }
    }
}

// Mobs bounce away or explode when they touch you, so you can hit them
// from a little way off: anything within REACH pixels counts.
function inReach (thing: Sprite) {
    let dx = thing.x - hero.x
    let dy = thing.y - hero.y
    return Math.sqrt(dx * dx + dy * dy) <= REACH
}

// Find the block you are standing on, or a mob within reach.
function findTarget () {
    target = null
    for (let tree of sprites.allOfKind(SpriteKind.Tree)) {
        if (hero.overlapsWith(tree)) {
            target = tree
        }
    }
    for (let rock of sprites.allOfKind(SpriteKind.Stone)) {
        if (hero.overlapsWith(rock)) {
            target = rock
        }
    }
    for (let ore of sprites.allOfKind(SpriteKind.Iron)) {
        if (hero.overlapsWith(ore)) {
            target = ore
        }
    }
    for (let coalOre of sprites.allOfKind(SpriteKind.Coal)) {
        if (hero.overlapsWith(coalOre)) {
            target = coalOre
        }
    }
    for (let goldOre of sprites.allOfKind(SpriteKind.Gold)) {
        if (hero.overlapsWith(goldOre)) {
            target = goldOre
        }
    }
    for (let pig of sprites.allOfKind(SpriteKind.Pig)) {
        if (hero.overlapsWith(pig)) {
            target = pig
        }
    }
    for (let cow of sprites.allOfKind(SpriteKind.Cow)) {
        if (hero.overlapsWith(cow)) {
            target = cow
        }
    }
    for (let sheep of sprites.allOfKind(SpriteKind.Sheep)) {
        if (hero.overlapsWith(sheep)) {
            target = sheep
        }
    }
    for (let chicken of sprites.allOfKind(SpriteKind.Chicken)) {
        if (hero.overlapsWith(chicken)) {
            target = chicken
        }
    }
    for (let horse of sprites.allOfKind(SpriteKind.Horse)) {
        if (horse != ridden && hero.overlapsWith(horse)) {
            target = horse
        }
    }
    for (let zombie of sprites.allOfKind(SpriteKind.Zombie)) {
        if (inReach(zombie)) {
            target = zombie
        }
    }
    for (let spider of sprites.allOfKind(SpriteKind.Spider)) {
        if (inReach(spider)) {
            target = spider
        }
    }
    for (let creeper of sprites.allOfKind(SpriteKind.Creeper)) {
        if (inReach(creeper)) {
            target = creeper
        }
    }
    for (let skeleton of sprites.allOfKind(SpriteKind.Skeleton)) {
        if (inReach(skeleton)) {
            target = skeleton
        }
    }
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(gameStarted)) {
        return
    }
    findTarget()
    if (target != null) {
        punch(target)
    } else {
        dig()
    }
})

function blockCount () {
    return sprites.allOfKind(SpriteKind.Tree).length + sprites.allOfKind(SpriteKind.Stone).length + sprites.allOfKind(SpriteKind.Iron).length + sprites.allOfKind(SpriteKind.Gold).length + sprites.allOfKind(SpriteKind.Coal).length
}

// ===== SLEEPING =====
function onBed () {
    let on = false
    for (let bed of sprites.allOfKind(SpriteKind.Bed)) {
        if (hero.overlapsWith(bed)) {
            on = true
        }
    }
    return on
}

function goToSleep () {
    // Leave night BEFORE the pause, so mobs stop and the clock cannot
    // also start the morning while you are asleep.
    isNight = false
    secondsLeft = DAY_SECONDS
    clearMobs()
    scene.setBackgroundColor(15)
    hero.sayText("Zzz...", 1500, false)
    pause(1500)
    // The furnace finishes while you sleep.
    if (smeltLeft > 0) {
        finishSmelting()
    }
    // Start the new day FIRST, so the world grows back as the new day
    // (from day 2, some of the new blocks can be gold).
    startDay()
    for (let index = 0; index < MAX_BLOCKS; index++) {
        if (blockCount() < MAX_BLOCKS) {
            spawnBlock()
        }
    }
    for (let index = 0; index < MAX_ANIMALS; index++) {
        if (animalCount() < MAX_ANIMALS) {
            spawnAnimal()
        }
    }
}

// ===== CRAFTING =====
function nearTable () {
    let near = false
    for (let table of sprites.allOfKind(SpriteKind.Table)) {
        if (hero.overlapsWith(table)) {
            near = true
        }
    }
    return near
}

function nearFurnace () {
    let near = false
    for (let furnace of sprites.allOfKind(SpriteKind.Furnace)) {
        if (hero.overlapsWith(furnace)) {
            near = true
        }
    }
    return near
}

function placeBeside (thing: Sprite) {
    if (hero.x > WORLD_WIDTH - 30) {
        thing.setPosition(hero.x - 18, hero.y)
    } else {
        thing.setPosition(hero.x + 18, hero.y)
    }
}

// ===== GETTING ON AND OFF A HORSE =====
function findHorse () {
    horseNearby = null
    for (let horse of sprites.allOfKind(SpriteKind.Horse)) {
        if (inReach(horse)) {
            horseNearby = horse
        }
    }
    return horseNearby != null
}

function getOnHorse () {
    ridden = horseNearby
    ridden.z = 5
    if (armoredHorses.indexOf(ridden) >= 0 && woundedHorses.indexOf(ridden) < 0) {
        horseHearts = 2
    } else {
        horseHearts = 1
    }
    setHeroSpeed()
    hero.sayText("Giddy up!", 800, false)
}

function getOffHorse () {
    ridden = null
    setHeroSpeed()
}

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(gameStarted)) {
        return
    }
    if (ridden != null) {
        // B on a horse gets you off, unless you put armor on it instead.
        if (horseArmors > 0 && armoredHorses.indexOf(ridden) < 0 && game.ask("Put ARMOR on your horse?", "B = no, get off")) {
            horseArmors += -1
            armoredHorses.push(ridden)
            horseHearts = 2
            ridden.setImage(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . f f . . .
            . . . . . . . . . . f b b b . .
            . . . . . . . . . f b b f b . .
            . . . . . . . . f b b b b e e .
            . . . . . . . . f e e e . e e .
            . . e e b b b b b b e e . . . .
            . e e b 1 1 1 1 1 1 b e . . . .
            . e e b b b b b b b b e . . . .
            . f e e e e e e e e e . . . . .
            . f . e e . . . . e e . . . . .
            . . . e e . . . . e e . . . . .
            . . . e e . . . . e e . . . . .
            . . . f f . . . . f f . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            `)
        } else {
            getOffHorse()
        }
    } else if (onBed() && !(isNight)) {
        game.splash("You can only sleep", "at night")
    } else if (onBed()) {
        if (game.ask("Go to sleep?", "skip to morning")) {
            goToSleep()
        }
    } else if (hasSaddle && findHorse() && game.ask("Ride the horse?", "B on the horse to get off")) {
        getOnHorse()
    } else if ((food > 0 || apples > 0) && info.life() < START_HEARTS && game.ask("Eat food?", "+1 heart")) {
        if (food > 0) {
            food += -1
        } else {
            apples += -1
        }
        info.changeLifeBy(1)
    } else {
        // The menu updates the screen itself when it closes.
        openCraftMenu()
        return
    }
    updateHud()
    checkWin()
})

// ===== THE CRAFTING MENU =====
// B opens it anywhere. What it offers depends on where you stand:
// at your table you can craft, at your furnace you can smelt.
// Up and down pick a recipe, A makes it, B closes the menu.
// The game is paused while the menu is open.
// To add a recipe: add its name to recipeList, its cost to recipeCost,
// what it needs to canCraft, and what it does to craft.
let menuOpen = false
let menuScreen: Sprite = null
let menuItems: string[] = []
let menuPick = 0
let menuTop = 0
let menuNote = ""
let toPlace: string[] = []
let craftMessage = ""
// Hearts can only change once the menu is closed (the menu is its own
// screen with its own hearts), so eating waits here until then.
let heartsToAdd = 0
let lightFurnace = false
// Where you were standing when the menu opened. (Inside the menu the
// world is hidden, so we can't look for the table then.)
let atTable = false
let atFurnace = false

function recipeList () {
    let list: string[] = []
    if (goldenApples > 0) {
        list.push("Eat golden apple")
    }
    if (!(hasTable)) {
        list.push("Table")
    }
    if (atFurnace) {
        list.push("Smelt gold")
        list.push("Smelt glass")
    }
    if (hasTable && atTable) {
        if (!(hasPickaxe)) {
            list.push("Pickaxe")
        } else if (!(hasIronPickaxe)) {
            list.push("Iron pickaxe")
        } else if (!(hasGoldPickaxe)) {
            list.push("Gold pickaxe")
        }
        if (!(hasShovel)) {
            list.push("Shovel")
        }
        if (!(hasFurnace)) {
            list.push("Furnace")
        }
        if (!(hasArmor) && !(hasGoldArmor)) {
            list.push("Armor")
        }
        if (!(hasGoldArmor)) {
            list.push("Gold armor")
        }
        list.push("Golden apple")
        if (!(hasSaddle)) {
            list.push("Saddle")
        }
        list.push("Horse armor")
        list.push("Box")
        if (!(hasBed)) {
            list.push("Bed")
        }
    }
    return list
}

function recipeCost (name: string) {
    if (name == "Table") {
        return "4 wood"
    } else if (name == "Pickaxe") {
        return "2 wood + 3 stone"
    } else if (name == "Iron pickaxe") {
        return "3 iron + 2 wood"
    } else if (name == "Shovel") {
        return "1 stone + 2 wood"
    } else if (name == "Armor") {
        return "5 iron"
    } else if (name == "Saddle") {
        return "3 leather + 1 iron"
    } else if (name == "Horse armor") {
        return "7 iron"
    } else if (name == "Box") {
        return "8 wood"
    } else if (name == "Bed") {
        return "3 wool + 3 wood"
    } else if (name == "Furnace") {
        return "8 stone"
    } else if (name == "Gold pickaxe") {
        return "3 gold + 2 wood"
    } else if (name == "Gold armor") {
        return "8 gold"
    } else if (name == "Golden apple") {
        return "8 gold + 1 apple"
    } else if (name == "Eat golden apple") {
        return "+" + GOLDEN_APPLE_HEARTS + " hearts (have " + goldenApples + ")"
    } else if (name == "Smelt gold" || name == "Smelt glass") {
        if (smeltLeft > 0) {
            return "Furnace busy: " + smeltLeft + "s"
        } else if (name == "Smelt gold") {
            return "1 coal + raw gold"
        } else {
            return "1 coal + sand"
        }
    }
    return ""
}

function canCraft (name: string) {
    if (name == "Table") {
        return wood >= 4
    } else if (name == "Pickaxe") {
        return wood >= 2 && stone >= 3
    } else if (name == "Iron pickaxe") {
        return iron >= 3 && wood >= 2
    } else if (name == "Shovel") {
        return stone >= 1 && wood >= 2
    } else if (name == "Armor") {
        return iron >= 5
    } else if (name == "Saddle") {
        return leather >= 3 && iron >= 1
    } else if (name == "Horse armor") {
        return iron >= 7
    } else if (name == "Box") {
        return wood >= 8
    } else if (name == "Bed") {
        return wool >= 3 && wood >= 3
    } else if (name == "Furnace") {
        return stone >= 8
    } else if (name == "Gold pickaxe") {
        return gold >= 3 && wood >= 2
    } else if (name == "Gold armor") {
        return gold >= 8
    } else if (name == "Golden apple") {
        return gold >= 8 && apples >= 1
    } else if (name == "Eat golden apple") {
        return goldenApples > 0
    } else if (name == "Smelt gold") {
        return smeltLeft <= 0 && coal >= 1 && rawGold >= 1
    } else if (name == "Smelt glass") {
        return smeltLeft <= 0 && coal >= 1 && sand >= 1
    }
    return false
}

function craft (name: string) {
    if (name == "Table") {
        wood += -4
        hasTable = true
        toPlace.push("Table")
        craftMessage = "Now stand at it and press B"
    } else if (name == "Pickaxe") {
        wood += -2
        stone += -3
        hasPickaxe = true
        craftMessage = "Now I can mine iron!"
    } else if (name == "Iron pickaxe") {
        iron += -3
        wood += -2
        hasIronPickaxe = true
        craftMessage = "Now I can mine gold!"
    } else if (name == "Shovel") {
        stone += -1
        wood += -2
        hasShovel = true
        craftMessage = "Stand on sand, press A to dig"
    } else if (name == "Armor") {
        iron += -5
        hasArmor = true
        hero.setImage(img`
            . . . . b b b b b b b b . . . .
            . . . . b 1 1 1 1 1 1 b . . . .
            . . . . b d d d d d d b . . . .
            . . . . d d d d d d d d . . . .
            . . . . d f 1 d d 1 f d . . . .
            . . . . d d d d d d d d . . . .
            . . . . d d d 3 3 d d d . . . .
            . . . . d d d d d d d d . . . .
            . . b b b b b b b b b b b b . .
            . . b 1 1 1 1 1 1 1 1 1 1 b . .
            . . d d b 1 1 1 1 1 1 b d d . .
            . . d d b b b b b b b b d d . .
            . . . . b 1 1 1 1 1 1 b . . . .
            . . . . b 1 1 . . 1 1 b . . . .
            . . . . b b b . . b b b . . . .
            . . . . e e e . . e e e . . . .
            `)
    } else if (name == "Saddle") {
        leather += -3
        iron += -1
        hasSaddle = true
        craftMessage = "Walk up to a horse, press B"
    } else if (name == "Horse armor") {
        iron += -7
        horseArmors += 1
        craftMessage = "Ride a horse, press B to put it on"
    } else if (name == "Box") {
        wood += -8
        boxes += 1
        toPlace.push("Box")
    } else if (name == "Bed") {
        wool += -3
        wood += -3
        hasBed = true
        toPlace.push("Bed")
        craftMessage = "Stand on the bed, press B to sleep"
    } else if (name == "Furnace") {
        stone += -8
        hasFurnace = true
        toPlace.push("Furnace")
        craftMessage = "Stand at it, press B to smelt"
    } else if (name == "Gold pickaxe") {
        gold += -3
        wood += -2
        hasGoldPickaxe = true
        craftMessage = "The fastest pickaxe!"
    } else if (name == "Gold armor") {
        gold += -8
        hasGoldArmor = true
        hero.setImage(img`
            . . . . 4 4 4 4 4 4 4 4 . . . .
            . . . . 4 5 5 5 5 5 5 4 . . . .
            . . . . 4 d d d d d d 4 . . . .
            . . . . d d d d d d d d . . . .
            . . . . d f 1 d d 1 f d . . . .
            . . . . d d d d d d d d . . . .
            . . . . d d d 3 3 d d d . . . .
            . . . . d d d d d d d d . . . .
            . . 4 4 4 4 4 4 4 4 4 4 4 4 . .
            . . 4 5 5 5 5 5 5 5 5 5 5 4 . .
            . . d d 4 5 5 5 5 5 5 4 d d . .
            . . d d 4 4 4 4 4 4 4 4 d d . .
            . . . . 4 5 5 5 5 5 5 4 . . . .
            . . . . 4 5 5 . . 5 5 4 . . . .
            . . . . 4 4 4 . . 4 4 4 . . . .
            . . . . e e e . . e e e . . . .
            `)
    } else if (name == "Golden apple") {
        gold += -8
        apples += -1
        goldenApples += 1
        craftMessage = "A golden apple!"
    } else if (name == "Eat golden apple") {
        goldenApples += -1
        heartsToAdd += GOLDEN_APPLE_HEARTS
        craftMessage = "Yum! +" + GOLDEN_APPLE_HEARTS + " hearts"
    } else if (name == "Smelt gold") {
        smeltWhat = "gold"
        smeltCount = Math.min(rawGold, SMELT_BATCH)
        rawGold += 0 - smeltCount
        startSmelting()
    } else if (name == "Smelt glass") {
        smeltWhat = "glass"
        smeltCount = Math.min(sand, SMELT_BATCH)
        sand += 0 - smeltCount
        startSmelting()
    }
}

// ===== THE FURNACE =====
// One coal cooks up to SMELT_BATCH things. It takes SMELT_SECONDS, then
// they pop into your bag wherever you are.
function startSmelting () {
    coal += -1
    smeltLeft = SMELT_SECONDS
    lightFurnace = true
    craftMessage = "Smelting " + smeltCount + " " + smeltWhat + "..."
}

function finishSmelting () {
    smeltLeft = 0
    if (smeltWhat == "gold") {
        gold += smeltCount
    } else {
        glass += smeltCount
    }
    hero.sayText(smeltCount + " " + smeltWhat + " ready!", 1500, false)
    smeltCount = 0
    smeltWhat = ""
    updateHud()
}

// Tables, boxes and beds appear in the world after the menu closes,
// one beside the next so they don't pile up.
function placeCrafted () {
    let offset = 0
    for (let name of toPlace) {
        let thing: Sprite = null
        if (name == "Table") {
            thing = sprites.create(img`
                e e e e e e e e e e e e e e e e
                e 4 4 4 4 4 4 e e 4 4 4 4 4 4 e
                e 4 b b 4 4 4 e e 4 4 b b 4 4 e
                e 4 b b 4 4 4 e e 4 4 b b 4 4 e
                e 4 4 4 4 4 4 e e 4 4 4 4 4 4 e
                e e e e e e e e e e e e e e e e
                e e e e e e e e e e e e e e e e
                e 4 4 4 4 4 4 e e 4 4 4 4 4 4 e
                e 4 4 4 4 4 4 e e 4 4 4 4 4 4 e
                e 4 4 4 4 4 4 e e 4 4 4 4 4 4 e
                e e e e e e e e e e e e e e e e
                . e e . . . . . . . . . . e e .
                . e e . . . . . . . . . . e e .
                . e e . . . . . . . . . . e e .
                . e e . . . . . . . . . . e e .
                . e e . . . . . . . . . . e e .
                `, SpriteKind.Table)
        } else if (name == "Furnace") {
            thing = sprites.create(img`
                . b b b b b b b b b b b b b b .
                b c c c c c c c c c c c c c c b
                b c b b b b b b b b b b b b c b
                b c b d b b b b b b b b d b c b
                b c b b b b b b b b b b b b c b
                b c b b f f f f f f f f b b c b
                b c b b f f f f f f f f b b c b
                b c b b f f f f f f f f b b c b
                b c b b f f 2 4 4 2 f f b b c b
                b c b b f 2 4 5 5 4 2 f b b c b
                b c b b f f f f f f f f b b c b
                b c b b b b b b b b b b b b c b
                b c b d b b b b b b b b d b c b
                b c c c c c c c c c c c c c c b
                . b b b b b b b b b b b b b b .
                . . . . . . . . . . . . . . . .
                `, SpriteKind.Furnace)
        } else if (name == "Box") {
            thing = sprites.create(img`
                . e e e e e e e e e e e e e e .
                e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e
                e 4 e e e e e e e e e e e e 4 e
                e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e
                e e e e e e e 5 5 e e e e e e e
                e e e e e e e 5 5 e e e e e e e
                e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e
                e 4 e e e e e e e e e e e e 4 e
                e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e
                e 4 e e e e e e e e e e e e 4 e
                e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e
                e 4 e e e e e e e e e e e e 4 e
                e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e
                . e e e e e e e e e e e e e e .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                `, SpriteKind.Box)
        } else {
            thing = sprites.create(img`
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                1 1 1 1 2 2 2 2 2 2 2 2 2 2 2 2
                1 1 1 1 2 2 2 2 2 2 2 2 2 2 2 2
                1 1 1 1 2 2 2 2 2 2 2 2 2 2 2 2
                1 1 1 1 2 2 2 2 2 2 2 2 2 2 2 2
                e e e e e e e e e e e e e e e e
                e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e
                e e e e e e e e e e e e e e e e
                e e . . . . . . . . . . . . e e
                e e . . . . . . . . . . . . e e
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                `, SpriteKind.Bed)
        }
        placeBeside(thing)
        // Stack away from the nearest top/bottom edge, and never outside
        // the world where the hero can't reach it.
        if (hero.y > WORLD_HEIGHT / 2) {
            thing.y = Math.max(8, hero.y - offset)
        } else {
            thing.y = Math.min(WORLD_HEIGHT - 8, hero.y + offset)
        }
        offset += 16
    }
    toPlace = []
    if (heartsToAdd > 0) {
        info.changeLifeBy(heartsToAdd)
        heartsToAdd = 0
    }
    if (lightFurnace) {
        lightFurnace = false
        for (let furnace of sprites.allOfKind(SpriteKind.Furnace)) {
            furnace.startEffect(effects.fire, SMELT_SECONDS * 1000)
        }
    }
    if (craftMessage != "") {
        hero.sayText(craftMessage, 2000, false)
        craftMessage = ""
    }
}

function openCraftMenu () {
    atTable = nearTable()
    atFurnace = nearFurnace()
    menuItems = recipeList()
    menuPick = 0
    menuTop = 0
    menuNote = ""
    toPlace = []
    craftMessage = ""
    heartsToAdd = 0
    lightFurnace = false
    game.pushScene()
    menuOpen = true
    scene.setBackgroundColor(15)
    menuScreen = sprites.create(image.create(160, 120), SpriteKind.Hud)
    menuScreen.setPosition(80, 60)
    controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
        if (menuPick > 0) {
            menuPick += -1
        }
        menuNote = ""
        drawMenu()
    })
    controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
        if (menuPick < menuItems.length - 1) {
            menuPick += 1
        }
        menuNote = ""
        drawMenu()
    })
    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        makePick()
    })
    controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
        closeCraftMenu()
    })
    drawMenu()
}

function makePick () {
    if (menuItems.length == 0) {
        return
    }
    let name = menuItems[menuPick]
    if (!(canCraft(name))) {
        menuNote = "Not enough yet!"
        drawMenu()
        return
    }
    craft(name)
    if (name == "Table" || name == "Eat golden apple") {
        closeCraftMenu()
        return
    }
    menuItems = recipeList()
    menuPick = Math.max(0, Math.min(menuPick, menuItems.length - 1))
    menuNote = "Made: " + name
    drawMenu()
}

function closeCraftMenu () {
    if (!(menuOpen)) {
        return
    }
    menuOpen = false
    game.popScene()
    placeCrafted()
    updateHud()
    checkWin()
}

function drawMenu () {
    // Keep the picked row on screen when the list is longer than 6.
    if (menuPick < menuTop) {
        menuTop = menuPick
    }
    if (menuPick > menuTop + 5) {
        menuTop = menuPick - 5
    }
    let pic = menuScreen.image
    pic.fill(15)
    pic.print("CRAFTING", 56, 1, 5)
    pic.print("Wood" + wood + " Stone" + stone + " Iron" + iron, 2, 10, 1, image.font5)
    pic.print("Coal" + coal + " Gold" + gold + " Raw gold" + rawGold, 2, 16, 1, image.font5)
    pic.print("Sand" + sand + " Glass" + glass + " Food" + food, 2, 22, 1, image.font5)
    pic.print("Wool" + wool + " Lthr" + leather + " Apple" + apples, 2, 28, 1, image.font5)
    pic.drawLine(0, 34, 159, 34, 11)
    if (menuItems.length == 0) {
        pic.print("Nothing to make here.", 2, 40, 1)
        pic.print("Stand at your table", 2, 54, 11)
        pic.print("or your furnace.", 2, 64, 11)
        pic.print("B close", 2, 110, 11)
        return
    }
    for (let row = 0; row < 6; row++) {
        let n = menuTop + row
        if (n < menuItems.length) {
            let y = 37 + row * 10
            if (n == menuPick) {
                pic.fillRect(0, y - 1, 160, 10, 8)
                pic.print(">", 2, y, 5)
            }
            if (canCraft(menuItems[n])) {
                pic.print(menuItems[n], 10, y, 1)
            } else {
                pic.print(menuItems[n], 10, y, 11)
            }
        }
    }
    if (menuTop > 0) {
        pic.print("^", 150, 37, 11)
    }
    if (menuTop + 6 < menuItems.length) {
        pic.print("v", 150, 87, 11)
    }
    if (menuNote != "") {
        pic.print(menuNote, 2, 99, 7)
    } else {
        pic.print("Needs: " + recipeCost(menuItems[menuPick]), 2, 99, 4)
    }
    pic.print("A make   B close", 2, 111, 11)
}

// ===== SCREEN TEXT =====
function updateHud () {
    hud.image.fill(15)
    hud.image.print("Wood" + wood + " Stone" + stone + " Iron" + iron, 2, 1, 1)
    hud.image.print("Gold" + gold + " Coal" + coal + " Food" + food, 2, 10, 1)
    if (isNight) {
        hud.image.print("NIGHT " + day + "  " + secondsLeft + "s left", 2, 19, 2)
    } else {
        hud.image.print("DAY " + day + "  " + secondsLeft + "s until night", 2, 19, 5)
    }
}

function checkWin () {
    if (hasTable && hasPickaxe && (hasArmor || hasGoldArmor) && hasBed && boxes >= 1) {
        game.splash("YOU CRAFTED IT ALL!", "What should we add next?")
    }
}

// ===== START THE GAME =====
// Called by the "start the game" block at the end of main.ts, after
// every knob has been set.
function startTheGame () {
    // Only start once, even if the start block gets copied or put in a loop.
    if (gameStarted) {
        return
    }
    gameStarted = true
    secondsLeft = DAY_SECONDS
    buildWorld()
    hero = sprites.create(img`
        . . . . e e e e e e e e . . . .
        . . . . e e e e e e e e . . . .
        . . . . e d d d d d d e . . . .
        . . . . d d d d d d d d . . . .
        . . . . d f 1 d d 1 f d . . . .
        . . . . d d d d d d d d . . . .
        . . . . d d d 3 3 d d d . . . .
        . . . . d d d d d d d d . . . .
        . . 6 6 6 6 6 6 6 6 6 6 6 6 . .
        . . 6 6 6 6 6 6 6 6 6 6 6 6 . .
        . . d d 6 6 6 6 6 6 6 6 d d . .
        . . d d 6 6 6 6 6 6 6 6 d d . .
        . . . . 8 8 8 8 8 8 8 8 . . . .
        . . . . 8 8 8 . . 8 8 8 . . . .
        . . . . 8 8 8 . . 8 8 8 . . . .
        . . . . e e e . . e e e . . . .
        `, SpriteKind.Player)
    hero.setPosition(Math.min(WORLD_WIDTH / 2, landRight - 16), WORLD_HEIGHT / 2)
    info.setLife(START_HEARTS)
    hero.z = 10
    setHeroSpeed()
    scene.setBackgroundColor(7)

    hud = sprites.create(image.create(160, 28), SpriteKind.Hud)
    hud.left = 0
    hud.top = 92
    hud.z = 100
    hud.setFlag(SpriteFlag.RelativeToCamera, true)
    updateHud()

    plantGrass()
    for (let index = 0; index < MAX_BLOCKS; index++) {
        spawnBlock()
    }

    for (let index = 0; index < MAX_ANIMALS; index++) {
        spawnAnimal()
    }

    // Animals change direction every 1.5 seconds.
    game.onUpdateInterval(1500, function () {
        wanderAll(SpriteKind.Pig)
        wanderAll(SpriteKind.Cow)
        wanderAll(SpriteKind.Sheep)
        wanderAll(SpriteKind.Chicken)
        wanderAll(SpriteKind.Horse)
    })

    game.onUpdateInterval(RESPAWN_MS, function () {
        if (blockCount() < MAX_BLOCKS) {
            spawnBlock()
        }
    })

    // Animals come back one at a time. Make ANIMAL_RESPAWN_MS smaller for more.
    game.onUpdateInterval(ANIMAL_RESPAWN_MS, function () {
        if (animalCount() < MAX_ANIMALS) {
            spawnAnimal()
        }
    })

    // More mobs every night: night 1 has 3 at once, night 2 has 4, and so on.
    game.onUpdateInterval(NIGHT_SPAWN_MS, function () {
        if (isNight && mobCount() < FIRST_NIGHT_MOBS + day - 1) {
            spawnMob()
        }
    })
}

//% color="#4E9A3A" icon="\uf1b2" block="Block Muncher"
namespace blockMuncher {
    /**
     * Start the game. Put this block LAST, after all the knobs.
     */
    //% block="start the game"
    export function startGame () {
        startTheGame()
    }
}
