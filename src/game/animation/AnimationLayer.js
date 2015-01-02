
var GPAnimateLayer;
MAX_CONTAINT_WIDTH = 40;
MAX_CONTAINT_HEIGHT = 40;
var AnimationLayer = cc.Layer.extend({
	space:null,
	shipSpriteSheet: null,
	shipSprite: null,
	enemyManager : null,

	_texZidanBatch : null,
    _texOpaqueBatch : null,
    _texTransparentBatch : null,
    _obstacleBatch:null,
    _explosions:null,
    
    lbScore:null,
    lbLife:null,
    lbSpeed:null,
    
    ctor:function (space) {
        this._super();
        
        GPAnimateLayer = this;
        
        this.space = space;
        this.init();

    },
    init:function () {
        this._super();
        
        this.initBatchNode();
        
        this.initShipSprite();
        
        this.enemyManager = new EnemyManager(this);
        this.enemyManager.startLoadEnemies();
        
        this.schedule(this.loadObstacle, 3+Math.random())
        
        BulletSprite.preSet();
        EnemySprite.preSet();
        SparkEffectSprite.preSet();
        ExplosionSprite.preSet();
        ObstacleSprite.preSet();
        
        this.scheduleUpdate();
        
        this.lbScore = new cc.LabelTTF("0", "Arial", 12);
        this.lbScore.setAnchorPoint(cc.p(0,0));
        this.lbScore.attr({
        	x : GC.w - 50,
        	y : GC.h - 20,
        	color : cc.color(255, 255, 0)
        });
        this.addChild(this.lbScore, 1000);
        
        this.lbLife = new cc.LabelTTF("Life:3", "Arial", 12);
        this.lbLife.setAnchorPoint(cc.p(0,0));
        this.lbLife.attr({
        	x : 10,
        	y : GC.h - 20,
        	color : cc.color(255, 0, 0)
        });
        this.addChild(this.lbLife, 1000);
        
        this.lbSpeed = new cc.LabelTTF("Speed:80", "Arial", 12);
        this.lbSpeed.setAnchorPoint(cc.p(0,0));
        this.lbSpeed.attr({
        	x : 150,
        	y : GC.h - 20,
        	color : cc.color(0, 0, 0)
        });
        this.addChild(this.lbSpeed, 1000);

    },
    
    initBatchNode : function(){
    	
    	cc.spriteFrameCache.addSpriteFrames(res.TextureTransparentPack_plist);
    	cc.spriteFrameCache.addSpriteFrames(res.gp_TextureOpaquePack_plist);
    	cc.spriteFrameCache.addSpriteFrames(res.gp_Explosion_plist);
    	cc.spriteFrameCache.addSpriteFrames(res.background_plist);
    	cc.spriteFrameCache.addSpriteFrames(res.zidan22_plist);
    	cc.textureCache.addImage("res/game/fire.png");
    	
    	//shipBatch
    	this.shipSpriteSheet = new cc.SpriteBatchNode(res.blueships);
    	this.addChild(this.shipSpriteSheet);
    	
    	// OpaqueBatch
    	var texOpaque = cc.textureCache.addImage(res.gp_TextureOpaquePack_png);
    	this._texOpaqueBatch = new cc.SpriteBatchNode(texOpaque);
    	this._texOpaqueBatch.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
    	this.addChild(this._texOpaqueBatch);

    	// ZidanBatch
    	var texZidan = cc.textureCache.addImage(res.zidan22_png);
    	this._texZidanBatch = new cc.SpriteBatchNode(texZidan);
    	this._texZidanBatch.setBlendFunc(cc.DST_COLOR, cc.ONE_MINUS_SRC_ALPHA);
    	this.addChild(this._texZidanBatch);
    	
    	// TransparentBatch
    	var texTransparent = cc.textureCache.addImage(res.TextureTransparentPack_png);
    	this._texTransparentBatch = new cc.SpriteBatchNode(texTransparent);
    	this.addChild(this._texTransparentBatch);

    	// explosion batch node
    	var explosionTexture = cc.textureCache.addImage(res.gp_Explosion_png);
    	this._explosions = new cc.SpriteBatchNode(explosionTexture);
    	this._explosions.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
    	this.addChild(this._explosions);

    	// Obstacle
    	var obstacleTexture = cc.textureCache.addImage(res.background_png);
    	this._obstacleBatch = new cc.SpriteBatchNode(obstacleTexture);
    	this.addChild(this._obstacleBatch);

    },
    initShipSprite : function (){
    	
    	this.shipSprite = new ShipSprite("#ship.png",this.space);
    	this._texTransparentBatch.addChild(this.shipSprite);

    },
    loadObstacle : function (){
    	
    	var tree = ObstacleSprite.getOrCreateEnemy(ObstacleType[0]);
    	tree.show();

    },
    moveActiveUnit : function(dt){
    	
    	var selChild, children = this._texOpaqueBatch.getChildren();
    	for (var i in children) {
    		selChild = children[i];
    		if (selChild && selChild.active){
    			selChild.update(dt);
    		}
    	}
    	
    	var selChild, children = this._texZidanBatch.getChildren();
    	for (var i in children) {
    		selChild = children[i];
    		if (selChild && selChild.active){
    			selChild.update(dt);
    		}
    	}

    	children = this._texTransparentBatch.getChildren();
    	for (i in children) {
    		selChild = children[i];
    		if (selChild && selChild.active)
    			selChild.update(dt);
    	}
    	
    	children = this._obstacleBatch.getChildren();
    	for (i in children) {
    		selChild = children[i];
    		if (selChild && selChild.active)
    			selChild.update(dt);
    	}

//    	this.shipSprite.update(dt);

    },
    checkIsCollide:function () {
    	var selChild, bulletChild;
    	// check collide
    	var i, locShip = this.shipSprite;
    	for (i = 0; i < GC.ACTIVE_ENEMIES.length; i++) {
    		selChild = GC.ACTIVE_ENEMIES[i];
    		if (!selChild.active) {
    			continue;
    		}

    		for (var j = 0; j < GC.CONTAINER.PLAYER_BULLETS.length; j++) {
    			bulletChild = GC.CONTAINER.PLAYER_BULLETS[j];
    			if (bulletChild.active && this.collide(selChild, bulletChild)) {
    				bulletChild.hurt();
    				selChild.hurt();
    			}
    		}
    		if (this.collide(selChild, locShip)) {
    			if (locShip.active) {
    				selChild.hurt();
    				locShip.hurt();
    			}
    		}
    	}

    	for (i = 0; i < GC.CONTAINER.ENEMY_BULLETS.length; i++) {
    		selChild = GC.CONTAINER.ENEMY_BULLETS[i];
    		if (selChild.active && this.collide(selChild, locShip)) {
    			if (locShip.active) {
    				selChild.hurt();
    				locShip.hurt();
    			}
    		}
    	}
    },
//  游戏时时刷新
    update:function (dt) {

//  		敌人在这里面产生，以及界面上
    		this.moveActiveUnit(dt);

//  		碰撞检测
    		this.checkIsCollide();
    		
    		if(GC.LIFE>0){
    			this.lbScore.setString(GC.SCORE + '');
    		}
    		
    		this.lbSpeed.setString("Speed:" + GC.SPEED + "0");
    		
    },
    
//  碰撞坚持
    collide:function (a, b) {
    	var ax = a.x;
    	var ay = a.y;
    	var bx = b.x;
    	var by = b.y;
    	if (Math.abs(ax - bx) > MAX_CONTAINT_WIDTH || Math.abs(ay - by) > MAX_CONTAINT_HEIGHT)
    		return false;

    	var aRect = a.collideRect(ax, ay);
    	var bRect = b.collideRect(bx, by);
    	return cc.rectIntersectsRect(aRect, bRect);
    },

});

AnimationLayer.prototype.addBullet = function (bullet, zOrder, modeTag) {
	this._texZidanBatch.addChild(bullet, zOrder, modeTag);
};

AnimationLayer.prototype.addEnemy = function (enemy, zOrder, modeTag) {
	this._texTransparentBatch.addChild(enemy, zOrder, modeTag);
};

AnimationLayer.prototype.addExplosions = function (explosion) {
	this._explosions.addChild(explosion);
};

AnimationLayer.prototype.addSpark = function (spark) {
	this._texOpaqueBatch.addChild(spark);
};

AnimationLayer.prototype.addObstacle = function (spark, zOrder, modeTag) {
	this._obstacleBatch.addChild(spark, zOrder, modeTag);
};