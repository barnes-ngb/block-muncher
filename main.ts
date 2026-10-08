namespace SpriteKind {
    export const Tree = SpriteKind.create()
    export const Stone = SpriteKind.create()
    export const Iron = SpriteKind.create()
    export const Pig = SpriteKind.create()
    export const Cow = SpriteKind.create()
    export const Sheep = SpriteKind.create()
    export const Chicken = SpriteKind.create()
    export const Bed = SpriteKind.create()
    export const Table = SpriteKind.create()
    export const Box = SpriteKind.create()
    export const Hud = SpriteKind.create()
}
/**
 * Animals come back slowly, so do
 */
function checkWin () {
    if (hasTable && hasPickaxe && hasArmor && hasBed && boxes >= 1) {
        game.splash("YOU CRAFTED IT ALL!", "What should we add next?")
    }
}
// Find the block you are standing on, if any.
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
}
function placeBeside (thing: Sprite) {
    if (hero.x > 130) {
        thing.setPosition(hero.x - 18, hero.y)
    } else {
        thing.setPosition(hero.x + 18, hero.y)
    }
}
function wanderAll (kind: number) {
    for (let critter of sprites.allOfKind(kind)) {
        if (Math.percentChance(40)) {
            critter.vx = 0
            critter.vy = 0
        } else {
            critter.vx = randint(0 - ANIMAL_SPEED, ANIMAL_SPEED)
            critter.vy = randint(0 - ANIMAL_SPEED, ANIMAL_SPEED)
        }
    }
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (onBed()) {
        if (game.ask("Go to sleep?", "the world grows back")) {
            goToSleep()
        }
    } else if (!(hasTable)) {
        if (wood >= 4) {
            if (game.ask("Craft a TABLE?", "costs 4 wood")) {
                wood += -4
                hasTable = true
                table2 = sprites.create(img`
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
                placeBeside(table2)
                hero.sayText("Now stand at it and press B", 2000, false)
            }
        } else {
            game.splash("A table needs 4 wood", "You have " + wood)
        }
    } else if (!(nearTable())) {
        game.splash("Go stand at your table", "then press B to craft")
    } else {
        if (!(hasPickaxe) && wood >= 2 && stone >= 3) {
            offered = true
            if (game.ask("Craft a PICKAXE?", "2 wood + 3 stone")) {
                wood += -2
                stone += -3
                hasPickaxe = true
                hero.sayText("Now I can mine iron!", 2000, false)
            }
        }
        if (wood >= 8) {
            offered = true
            if (game.ask("Craft a BOX?", "costs 8 wood")) {
                wood += -8
                boxes += 1
                box = sprites.create(img`
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
                placeBeside(box)
            }
        }
        if (!(hasArmor) && iron >= 5) {
            offered = true
            if (game.ask("Craft ARMOR?", "costs 5 iron")) {
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
            }
        }
        if (!(hasBed) && wool >= 3 && wood >= 3) {
            offered = true
            if (game.ask("Craft a BED?", "3 wool + 3 wood")) {
                wool += -3
                wood += -3
                hasBed = true
                bed2 = sprites.create(img`
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
                placeBeside(bed2)
                hero.sayText("Stand on the bed, press B to sleep", 2000, false)
            }
        }
        if (!(offered)) {
            game.splash("Nothing to craft yet", "Pick 2W+3S Box 8W Armor 5Iron Bed 3Wool+3W")
        }
    }
    updateHud()
    checkWin()
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    findTarget()
    if (target != null) {
        punch(target)
    }
})
// ===== SCREEN TEXT =====
function updateHud () {
    hud.image.fill(15)
    hud.image.print("W" + wood + " S" + stone + " I" + iron + " Food" + food + " Wool" + wool + " D" + day, 2, 1, 1)
}
function goToSleep () {
    scene.setBackgroundColor(15)
    hero.sayText("Zzz...", 1500, false)
    pause(1500)
    day += 1
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
    scene.setBackgroundColor(7)
    game.splash("Good morning!", "Day " + day)
}
// ===== ANIMALS =====
function spawnAnimal () {
    roll2 = randint(1, 4)
    if (roll2 == 1) {
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
    } else if (roll2 == 2) {
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
    } else if (roll2 == 3) {
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
    animal.setPosition(randint(10, 150), randint(24, 110))
    animal.setBounceOnWall(true)
}
function blockCount () {
    return sprites.allOfKind(SpriteKind.Tree).length + sprites.allOfKind(SpriteKind.Stone).length + sprites.allOfKind(SpriteKind.Iron).length
}
function animalCount () {
    return sprites.allOfKind(SpriteKind.Pig).length + sprites.allOfKind(SpriteKind.Cow).length + sprites.allOfKind(SpriteKind.Sheep).length + sprites.allOfKind(SpriteKind.Chicken).length
}
// ===== SLEEPING =====
function onBed () {
    for (let bed of sprites.allOfKind(SpriteKind.Bed)) {
        if (hero.overlapsWith(bed)) {
            on = true
        }
    }
    return on
}
// ===== CRAFTING =====
function nearTable () {
    for (let table of sprites.allOfKind(SpriteKind.Table)) {
        if (hero.overlapsWith(table)) {
            near = true
        }
    }
    return near
}
// ===== SPAWNING BLOCKS =====
function spawnBlock () {
    roll = randint(1, 10)
    if (roll <= 5) {
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
    } else if (roll <= 8) {
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
    block.setPosition(randint(10, 150), randint(24, 110))
}
function collect (block: Sprite) {
    if (block.kind() == SpriteKind.Sheep) {
        wool += 1
    } else if (isAnimal(block)) {
        food += 1
    } else if (block.kind() == SpriteKind.Tree) {
        wood += 1
    } else if (block.kind() == SpriteKind.Stone) {
        stone += 1
    } else {
        iron += 1
    }
    block.destroy()
    scene.cameraShake(2, 100)
    lastTarget = null
hitsSoFar = 0
    updateHud()
}
// ===== PUNCHING =====
// How many punches a block needs depends on its kind, and on your pickaxe.
function hitsNeeded (block: Sprite) {
    needed = TREE_HITS
    if (isAnimal(block)) {
        needed = ANIMAL_HITS
    } else if (block.kind() == SpriteKind.Stone) {
        needed = STONE_HITS
    } else if (block.kind() == SpriteKind.Iron) {
        needed = IRON_HITS
    }
    if (hasPickaxe && (block.kind() == SpriteKind.Stone || block.kind() == SpriteKind.Iron)) {
        needed = Math.ceil(needed / PICKAXE_POWER)
    }
    return needed
}
function punch (block: Sprite) {
    if (block.kind() == SpriteKind.Iron && !(hasPickaxe)) {
        hero.sayText("Need a pickaxe!", 1000, false)
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
function isAnimal (thing: Sprite) {
    return thing.kind() == SpriteKind.Pig || thing.kind() == SpriteKind.Cow || thing.kind() == SpriteKind.Sheep || thing.kind() == SpriteKind.Chicken
}
let needed = 0
let hitsSoFar = 0
let block: Sprite = null
let roll = 0
let near = false
let on = false
let animal: Sprite = null
let roll2 = 0
let bed2: Sprite = null
let box: Sprite = null
let offered = false
let table2: Sprite = null
let boxes = 0
let hasBed = false
let hasArmor = false
let hasPickaxe = false
let hasTable = false
let hud: Sprite = null
let hero: Sprite = null
let day = 0
let ANIMAL_SPEED = 0
let MAX_ANIMALS = 0
let ANIMAL_HITS = 0
let MAX_BLOCKS = 0
let PICKAXE_POWER = 0
let IRON_HITS = 0
let STONE_HITS = 0
let TREE_HITS = 0
let lastTarget: Sprite = null
// ===== PUNCH MEMORY: which block you are hitting, and how many times =====
let target: Sprite = null
let wool = 0
let food = 0
let iron = 0
let stone = 0
// ===== INVENTORY =====
let wood = 0
// ===== TUNING KNOBS: change one, play, and see if it got more fun =====
TREE_HITS = 3
STONE_HITS = 5
IRON_HITS = 6
PICKAXE_POWER = 3
MAX_BLOCKS = 12
let RESPAWN_MS = 3000
ANIMAL_HITS = 2
MAX_ANIMALS = 4
ANIMAL_SPEED = 20
day = 1
// ===== START THE GAME =====
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
hero.setPosition(80, 64)
hero.setStayInScreen(true)
hero.z = 10
controller.moveSprite(hero)
scene.setBackgroundColor(7)
hud = sprites.create(image.create(160, 10), SpriteKind.Hud)
hud.left = 0
hud.top = 0
hud.z = 100
updateHud()
for (let index = 0; index < 8; index++) {
    spawnBlock()
}
for (let index = 0; index < MAX_ANIMALS; index++) {
    spawnAnimal()
}
game.onUpdateInterval(RESPAWN_MS, function () {
    if (blockCount() < MAX_BLOCKS) {
        spawnBlock()
    }
})
// Animals change direction every 1.5 seconds.
game.onUpdateInterval(1500, function () {
    wanderAll(SpriteKind.Pig)
    wanderAll(SpriteKind.Cow)
    wanderAll(SpriteKind.Sheep)
    wanderAll(SpriteKind.Chicken)
})
