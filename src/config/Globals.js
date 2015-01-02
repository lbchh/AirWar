var g_groundHeight = 57;
var g_runnerStartX = 80;

if(typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.background = 0;
    TagOfLayer.Animation = 1;
    TagOfLayer.GameLayer = 2;
    TagOfLayer.Status = 3;
};

// collision type for chipmunk
if(typeof SpriteTag == "undefined") {
    var SpriteTag = {};
    SpriteTag.wallBottom = 0;
    SpriteTag.enemy = 1;
    SpriteTag.ship = 2;
};

if(typeof GameSpeed == "undefined") {
	var GameSpeed = {};
	GameSpeed.one = 8;
	GameSpeed.two = 12;
	GameSpeed.three = 16;
	GameSpeed.fore = 20;
};

if(typeof EnemyAppearSpeed == "undefined") {
	var EnemyAppearSpeed = {};
	EnemyAppearSpeed.one = 1;
	EnemyAppearSpeed.two = 0.7;
	EnemyAppearSpeed.three = 0.5;
	EnemyAppearSpeed.fore = 0.5;
};

var GC = GC || {};
GC.game = 0;
GC.winSize = 0;
GC.h = 0;
GC.w = 0;
GC.w_2 = 0;
GC.h_2 = 0;

GC.LIFE = 0;
GC.MAXENEMIES = 10;
GC.SCORE = 0;
GC.SPEED = GameSpeed.one;
GC.EAS = EnemyAppearSpeed.one;
GC.SOUND_ON = true;
GC.SMOKE = true;

GC.GAME_STATE_ENUM = {
		HOME : 0,
		PLAY : 1,
		OVER : 2
};

GC.ACTIVE_ENEMIES = [];
//container
GC.CONTAINER = {
		ENEMIES : [[],[],[],[],[],[]],
		ENEMY_BULLETS : [],
		PLAYER_BULLETS : [],
		SPARKS : [],
		EXPLOSIONS : [],
		OBSTACLE : []
};

//bullet speed
GC.BULLET_SPEED = {
		ENEMY : -2,
		SHIP : 14
};

//attack mode
GC.ENEMY_ATTACK_MODE = {
		NORMAL : 1,
		TSUIHIKIDAN : 2
};

//unit tag
GC.UNIT_TAG = {
		ENMEY_BULLET : 900,
		PLAYER_BULLET : 901,
		ENEMY : 1000,
		PLAYER : 1000
};

//enemy move type
GC.ENEMY_MOVE_TYPE = {
		ATTACK:0,
		VERTICAL:1,
		HORIZONTAL:2,
		OVERLAP:3
};