// BLOCK MUNCHER v2: punch, collect, craft
//
// HOW TO PLAY
//   D-pad   walk
//   A       punch the block you are standing on (trees, stone, iron)
//   B       craft (a menu asks: A = yes, B = no)
//
// THE CRAFTING PATH
//   1. Crafting table : 4 wood          (you can craft this anywhere)
//   2. Pickaxe        : 2 wood + 3 stone  (stand at your table)
//   3. Box            : 8 wood            (stand at your table)
//   4. Armor          : 5 iron            (stand at your table)
//   Iron can only be mined with a pickaxe.
//   Make all four and you win.

namespace SpriteKind {
    export const Tree = SpriteKind.create()
    export const Stone = SpriteKind.create()
    export const Iron = SpriteKind.create()
    export const Table = SpriteKind.create()
    export const Box = SpriteKind.create()
    export const Hud = SpriteKind.create()
}

// ===== TUNING KNOBS: change one, play, and see if it got more fun =====
let TREE_HITS = 3
let STONE_HITS = 5
let IRON_HITS = 6
let PICKAXE_POWER = 3
let MAX_BLOCKS = 12
let RESPAWN_MS = 3000

// ===== INVENTORY =====
let wood = 0
let stone = 0
let iron = 0
let boxes = 0
let hasTable = false
let hasPickaxe = false
let hasArmor = false

// ===== PUNCH MEMORY: which block you are hitting, and how many times =====
let target: Sprite = null
let lastTarget: Sprite = null
let hitsSoFar = 0

// ===== SPAWNING BLOCKS =====
function spawnBlock() {
    let roll = randint(1, 10)
    let block: Sprite = null
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

// ===== PUNCHING =====
// How many punches a block needs depends on its kind, and on your pickaxe.
function hitsNeeded(block: Sprite) {
    let needed = TREE_HITS
    if (block.kind() == SpriteKind.Stone) {
        needed = STONE_HITS
    } else if (block.kind() == SpriteKind.Iron) {
        needed = IRON_HITS
    }
    if (hasPickaxe && block.kind() != SpriteKind.Tree) {
        needed = Math.ceil(needed / PICKAXE_POWER)
    }
    return needed
}

function collect(block: Sprite) {
    if (block.kind() == SpriteKind.Tree) {
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

function punch(block: Sprite) {
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

// Find the block you are standing on, if any.
function findTarget() {
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
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    findTarget()
    if (target != null) {
        punch(target)
    }
})

function blockCount() {
    return sprites.allOfKind(SpriteKind.Tree).length + sprites.allOfKind(SpriteKind.Stone).length + sprites.allOfKind(SpriteKind.Iron).length
}

// ===== CRAFTING =====
function nearTable() {
    let near = false
    for (let table of sprites.allOfKind(SpriteKind.Table)) {
        if (hero.overlapsWith(table)) {
            near = true
        }
    }
    return near
}

function placeBeside(thing: Sprite) {
    if (hero.x > 130) {
        thing.setPosition(hero.x - 18, hero.y)
    } else {
        thing.setPosition(hero.x + 18, hero.y)
    }
}

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(hasTable)) {
        if (wood >= 4) {
            if (game.ask("Craft a TABLE?", "costs 4 wood")) {
                wood += -4
                hasTable = true
                let table = sprites.create(img`
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
                placeBeside(table)
                hero.sayText("Now stand at it and press B", 2000, false)
            }
        } else {
            game.splash("A table needs 4 wood", "You have " + wood)
        }
    } else if (!(nearTable())) {
        game.splash("Go stand at your table", "then press B to craft")
    } else {
        let offered = false
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
                let box = sprites.create(img`
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
        if (!(offered)) {
            game.splash("Nothing to craft yet", "Pick 2W+3S  Box 8W  Armor 5 iron")
        }
    }
    updateHud()
    checkWin()
})

// ===== SCREEN TEXT =====
function updateHud() {
    hud.image.fill(15)
    hud.image.print("Wood " + wood + " Stone " + stone + " Iron " + iron, 2, 1, 1)
}

function checkWin() {
    if (hasTable && hasPickaxe && hasArmor && boxes >= 1) {
        game.splash("YOU CRAFTED IT ALL!", "What should we add next?")
    }
}

// ===== START THE GAME =====
let hero = sprites.create(img`
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

let hud = sprites.create(image.create(160, 10), SpriteKind.Hud)
hud.left = 0
hud.top = 0
hud.z = 100
updateHud()

for (let index = 0; index < 8; index++) {
    spawnBlock()
}

game.onUpdateInterval(RESPAWN_MS, function () {
    if (blockCount() < MAX_BLOCKS) {
        spawnBlock()
    }
})