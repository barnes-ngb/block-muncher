// BLOCK MUNCHER v4: DAY AND NIGHT
// Designed by Lincoln and London:
//   "One minute in the morning, then it's night time, and there will be
//    monsters: zombies and spiders and creepers and a skeleton. When the
//    night is over it's morning, and repeat each day. You can sleep to
//    skip the night."
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
//   5. Bed            : 3 wool + 3 wood   (stand at your table)
//   Iron can only be mined with a pickaxe.
//
// ANIMALS (new in v3) wander around. Punch them:
//   Pig, cow, chicken = food        Sheep = wool
//   Stand on your bed and press B to sleep. A new day grows the world back.
//   Make all five things and you win.
//
// NIGHT (new in v4): mobs come for you. Every night brings more of them.
//   Zombie   walks at you             touch = lose 1 heart
//   Spider   fast                     touch = lose 1 heart
//   Creeper  sneaks up and EXPLODES   touch = lose 2 hearts
//   Skeleton keeps away, shoots arrows       arrow = lose 1 heart
//   Punch mobs to beat them (score, top right). Morning clears them away.
//   Armor blocks half the hits. Press B with food to eat (+1 heart).
//   Sleep in your bed at night to skip to morning.

namespace SpriteKind {
    export const Tree = SpriteKind.create()
    export const Stone = SpriteKind.create()
    export const Iron = SpriteKind.create()
    export const Pig = SpriteKind.create()
    export const Cow = SpriteKind.create()
    export const Sheep = SpriteKind.create()
    export const Chicken = SpriteKind.create()
    export const Bed = SpriteKind.create()
    export const Zombie = SpriteKind.create()
    export const Spider = SpriteKind.create()
    export const Creeper = SpriteKind.create()
    export const Skeleton = SpriteKind.create()
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
let ANIMAL_HITS = 2
let MAX_ANIMALS = 4
let ANIMAL_SPEED = 20
let DAY_SECONDS = 60
let NIGHT_SECONDS = 120
let START_HEARTS = 5
let FIRST_NIGHT_MOBS = 3
let NIGHT_SPAWN_MS = 4000
let ZOMBIE_HITS = 3
let MOB_HITS = 2
let ZOMBIE_SPEED = 25
let SPIDER_SPEED = 45
let CREEPER_SPEED = 30
let SKELETON_SPEED = 20
let ARROW_SPEED = 70
let HURT_COOLDOWN_MS = 1000
let REACH = 32

// ===== INVENTORY =====
let wood = 0
let stone = 0
let iron = 0
let boxes = 0
let food = 0
let wool = 0
let day = 1
let hasBed = false

// ===== THE CLOCK =====
let isNight = false
let secondsLeft = DAY_SECONDS
let lastHurt = 0
let hasTable = false
let hasPickaxe = false
let hasArmor = false

// ===== PUNCH MEMORY: which block you are hitting, and how many times =====
let target: Sprite = null
let lastTarget: Sprite = null
let hitsSoFar = 0

// ===== SPAWNING BLOCKS =====
function spawnBlock () {
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
    block.setPosition(randint(10, 150), randint(16, 94))
}

// ===== ANIMALS =====
function spawnAnimal () {
    let roll = randint(1, 4)
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
    animal.setPosition(randint(10, 150), randint(16, 94))
    animal.setBounceOnWall(true)
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

function isAnimal (thing: Sprite) {
    return thing.kind() == SpriteKind.Pig || thing.kind() == SpriteKind.Cow || thing.kind() == SpriteKind.Sheep || thing.kind() == SpriteKind.Chicken
}

function animalCount () {
    return sprites.allOfKind(SpriteKind.Pig).length + sprites.allOfKind(SpriteKind.Cow).length + sprites.allOfKind(SpriteKind.Sheep).length + sprites.allOfKind(SpriteKind.Chicken).length
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
    // Mobs come in from a random edge of the screen.
    let side = randint(1, 4)
    if (side == 1) {
        mob.setPosition(0, randint(16, 94))
    } else if (side == 2) {
        mob.setPosition(160, randint(16, 94))
    } else if (side == 3) {
        mob.setPosition(randint(10, 150), 0)
    } else {
        mob.setPosition(randint(10, 150), 100)
    }
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
    if (game.runtime() - lastHurt > HURT_COOLDOWN_MS) {
        lastHurt = game.runtime()
        let damage = amount
        if (hasArmor) {
            if (damage > 1) {
                damage = damage - 1
            } else if (Math.percentChance(50)) {
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
    scene.setBackgroundColor(12)
    game.splash("NIGHT " + day, "The mobs are coming!")
    updateHud()
}

function startDay () {
    isNight = false
    secondsLeft = DAY_SECONDS
    clearMobs()
    day += 1
    scene.setBackgroundColor(7)
    game.splash("Good morning!", "Day " + day)
    updateHud()
}

game.onUpdateInterval(1000, function () {
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

// More mobs every night: night 1 has 3 at once, night 2 has 4, and so on.
game.onUpdateInterval(NIGHT_SPAWN_MS, function () {
    if (isNight && mobCount() < FIRST_NIGHT_MOBS + day - 1) {
        spawnMob()
    }
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
    }
    if (hasPickaxe && (block.kind() == SpriteKind.Stone || block.kind() == SpriteKind.Iron)) {
        needed = Math.ceil(needed / PICKAXE_POWER)
    }
    return needed
}

function collect (block: Sprite) {
    if (isMob(block)) {
        info.changeScoreBy(1)
    } else if (block.kind() == SpriteKind.Sheep) {
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
    findTarget()
    if (target != null) {
        punch(target)
    }
})

function blockCount () {
    return sprites.allOfKind(SpriteKind.Tree).length + sprites.allOfKind(SpriteKind.Stone).length + sprites.allOfKind(SpriteKind.Iron).length
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
    startDay()
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

function placeBeside (thing: Sprite) {
    if (hero.x > 130) {
        thing.setPosition(hero.x - 18, hero.y)
    } else {
        thing.setPosition(hero.x + 18, hero.y)
    }
}

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (onBed() && !(isNight)) {
        game.splash("You can only sleep", "at night")
    } else if (onBed()) {
        if (game.ask("Go to sleep?", "skip to morning")) {
            goToSleep()
        }
    } else if (food > 0 && info.life() < START_HEARTS && game.ask("Eat food?", "+1 heart")) {
        food += -1
        info.changeLifeBy(1)
    } else if (!(hasTable)) {
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
        if (!(hasBed) && wool >= 3 && wood >= 3) {
            offered = true
            if (game.ask("Craft a BED?", "3 wool + 3 wood")) {
                wool += -3
                wood += -3
                hasBed = true
                let bed = sprites.create(img`
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
                placeBeside(bed)
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

// ===== SCREEN TEXT =====
function updateHud () {
    hud.image.fill(15)
    hud.image.print("W" + wood + " S" + stone + " I" + iron + " Food" + food + " Wool" + wool, 2, 1, 1)
    if (isNight) {
        hud.image.print("NIGHT " + day + "  " + secondsLeft + "s left", 2, 10, 2)
    } else {
        hud.image.print("DAY " + day + "  " + secondsLeft + "s until night", 2, 10, 5)
    }
}

function checkWin () {
    if (hasTable && hasPickaxe && hasArmor && hasBed && boxes >= 1) {
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
hero.setPosition(80, 56)
info.setLife(START_HEARTS)
hero.setStayInScreen(true)
hero.z = 10
controller.moveSprite(hero)
scene.setBackgroundColor(7)

let hud = sprites.create(image.create(160, 18), SpriteKind.Hud)
hud.left = 0
hud.top = 102
hud.z = 100
updateHud()

for (let index = 0; index < 8; index++) {
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
})

game.onUpdateInterval(RESPAWN_MS, function () {
    if (blockCount() < MAX_BLOCKS) {
        spawnBlock()
    }
})

// Animals come back slowly, so do not punch them all at once.
game.onUpdateInterval(10000, function () {
    if (animalCount() < MAX_ANIMALS) {
        spawnAnimal()
    }
})
