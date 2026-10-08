namespace SpriteKind {
    export const Gem = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Gem, function (sprite, otherSprite) {
    info.changeScoreBy(10)
    otherSprite.destroy()
})
function randomAssets () {
    apple = sprites.create(img`
        . . . . . . . . e . . . . . . . 
        . . . . . . . e . 7 7 . . . . . 
        . . . . . . . e 7 7 . . . . . . 
        . . . . 2 2 2 e 2 2 2 . . . . . 
        . . . 2 2 2 2 2 2 2 2 2 . . . . 
        . . 2 2 1 2 2 2 2 2 2 2 2 . . . 
        . . 2 1 2 2 2 2 2 2 2 2 2 . . . 
        . . 2 2 2 2 2 2 2 2 2 2 2 . . . 
        . . 2 2 2 2 2 2 2 2 2 2 2 . . . 
        . . 2 2 2 2 2 2 2 2 2 2 2 . . . 
        . . . 2 2 2 2 2 2 2 2 2 . . . . 
        . . . 2 2 2 2 2 2 2 2 2 . . . . 
        . . . . 2 2 2 2 2 2 2 . . . . . 
        . . . . . 2 2 . 2 2 . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Food)
    apple.x = randint(0, scene.screenWidth())
    apple.y = randint(0, scene.screenHeight())
    carrot = sprites.create(img`
        . . . . . . . . . . . 7 . 7 . . 
        . . . . . . . . . . 7 7 7 . . . 
        . . . . . . . . . . . 7 7 7 . . 
        . . . . . . . . . 4 4 7 . . . . 
        . . . . . . . . 4 4 4 4 . . . . 
        . . . . . . . 4 4 e 4 4 . . . . 
        . . . . . . 4 4 4 4 4 . . . . . 
        . . . . . 4 4 e 4 4 . . . . . . 
        . . . . 4 4 4 4 4 . . . . . . . 
        . . . 4 4 4 e 4 . . . . . . . . 
        . . . 4 4 4 4 . . . . . . . . . 
        . . 4 4 4 . . . . . . . . . . . 
        . . 4 4 . . . . . . . . . . . . 
        . 4 . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Food)
    carrot.x = randint(0, scene.screenWidth())
    carrot.y = randint(0, scene.screenHeight())
    if (Math.percentChance(20)) {
        gem = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . 8 8 8 8 8 8 . . . . . 
            . . . . 8 9 9 1 9 9 9 8 . . . . 
            . . . 8 9 9 1 9 9 9 9 9 8 . . . 
            . . 8 8 8 8 8 8 8 8 8 8 8 8 . . 
            . . . 8 9 9 9 9 9 9 9 9 8 . . . 
            . . . . 8 9 9 9 9 9 9 8 . . . . 
            . . . . . 8 9 9 9 9 8 . . . . . 
            . . . . . . 8 9 9 8 . . . . . . 
            . . . . . . . 8 8 . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Gem)
        gem.x = randint(0, scene.screenWidth())
        gem.y = randint(0, scene.screenHeight())
    } else {
        mob = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . c . . . . . . . . . . c . . 
            . . c c . . . . . . . . c c . . 
            . . c c c c c c c c c c c c . . 
            . . c a a a a a a a a a a c . . 
            . . c a 2 2 a a a a 2 2 a c . . 
            . . c a 2 f a a a a f 2 a c . . 
            . . c a a a a a a a a a a c . . 
            . . c a f f f f f f f f a c . . 
            . . c a f 1 f 1 1 f 1 f a c . . 
            . . c a a a a a a a a a a c . . 
            . . c a a a a a a a a a a c . . 
            . . c c c c c c c c c c c c . . 
            . . . c c . . . . . . c c . . . 
            . . . c c . . . . . . c c . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Enemy)
        mob.x = randint(0, scene.screenWidth())
        mob.y = randint(0, scene.screenHeight())
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    info.changeScoreBy(1)
    otherSprite.destroy()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    info.changeScoreBy(15)
    otherSprite.destroy()
})
let mob: Sprite = null
let gem: Sprite = null
let carrot: Sprite = null
let apple: Sprite = null
info.setLife(3)
info.startCountdown(60)
let hero = sprites.create(img`
    . . . . e e e e e e e e . . . . 
    . . . . e e e e e e e e . . . . 
    . . . . e d d d d d d e . . . . 
    . . . . d d d d d d d d . . . . 
    . . . . d f 1 d d 1 f d . . . . 
    . . . . d d d d d d d d . . . . 
    . . . . d d d 3 3 d d d . . . . 
    . . . . d d d d d d d d . . . . 
    . . 4 4 4 4 4 4 4 4 4 4 4 4 . . 
    . . 4 4 4 4 4 4 4 4 4 4 4 4 . . 
    . . d d 4 4 4 4 4 4 4 4 d d . . 
    . . d d 4 4 4 4 4 4 4 4 d d . . 
    . . . . a a a a a a a a . . . . 
    . . . . a a a . . a a a . . . . 
    . . . . a a a . . a a a . . . . 
    . . . . e e e . . e e e . . . . 
    `, SpriteKind.Player)
hero.setStayInScreen(true)
controller.moveSprite(hero)
scene.setBackgroundColor(7)
game.onUpdateInterval(2000, function () {
    randomAssets()
})
