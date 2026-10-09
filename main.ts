// BLOCK MUNCHER v6: THE BEACH AND THE OCEAN
// v6 ideas from Lincoln's notes:
//   Water and sand along one side of the map. You can go in the water
//   (swimming is slow).
//   A stone shovel (1 stone + 2 wood) digs sand: stand on sand, press A.
//   Crafting is a menu now: B opens it, up/down picks, A makes it.
//   Coming next: furnace, glass, gold armor, golden apples, a house with a
//   door, and the Enderman.
//
// v5: HORSES, GOLD AND APPLES
// v5 ideas from Lincoln's notes:
//   Horses drop leather, and so do cows (cows still drop food too).
//   3 leather + 1 iron makes a saddle. Ride a horse to go faster; B gets off.
//   7 iron makes horse armor. B puts it on. A horse has 1 life, 2 with armor.
//   Trees sometimes drop an apple. An apple gives you a heart.
//   From day 2 you find gold, but you need an iron pickaxe (3 iron + 2 wood).
//
// v4: DAY AND NIGHT, IN A BIG WORLD
// Designed by Lincoln and London:
//   "One minute in the morning, then it's night time, and there will be
//    monsters: zombies and spiders and creepers and a skeleton. When the
//    night is over it's morning, and repeat each day. You can sleep to
//    skip the night."
//
// HOW TO PLAY
//   D-pad   walk
//   A       punch the block you are standing on (trees, stone, iron)
//   B       open the crafting menu (up/down to pick, A to make, B to close)
//           The game pauses while the menu is open. Grey = not enough yet.
//
// THE CRAFTING PATH (all in the menu; things you already own drop off it)
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
//
// THE WORLD is bigger than the screen. Walk to the edge and the camera
// follows you. Change WORLD_WIDTH and WORLD_HEIGHT to make it bigger
// (the screen is 160 wide and 120 tall). The ground is made of 16x16
// tiles, so sizes get rounded down to a multiple of 16.
// BEACH_TILES and OCEAN_TILES set how wide the sand and the sea are, on
// the right-hand side. Animals stay out of the water; you can swim.
//
// THIS FILE is the part you edit in Blocks: the tuning knobs.
// The game itself lives in engine.ts (switch to JavaScript to see it).
// Keep the "start the game" block LAST, after all the knobs.

// ===== TUNING KNOBS: change one, play, and see if it got more fun =====
let WORLD_WIDTH = 480
let WORLD_HEIGHT = 352
let GRASS_TUFTS = 40
let BEACH_TILES = 3
let OCEAN_TILES = 6
let SWIM_SPEED = 40
let SAND_DIGS = 2
let TREE_HITS = 3
let STONE_HITS = 5
let IRON_HITS = 6
let PICKAXE_POWER = 3
let MAX_BLOCKS = 30
let RESPAWN_MS = 3000
let ANIMAL_HITS = 2
let MAX_ANIMALS = 8
let ANIMAL_SPEED = 20
let ANIMAL_RESPAWN_MS = 10000
let RIDE_SPEED = 160
let APPLE_CHANCE = 20
let GOLD_FROM_DAY = 2
let GOLD_CHANCE = 15
let GOLD_HITS = 6
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

blockMuncher.startGame()
