
var ShipSprite = cc.PhysicsSprite.extend({
	space : null,
	shape : null,
	active : true,
	
	runningAction: null,
	jumpUpAction:null,
	jumpDownAction:null,
	
	_body : null,
    _rect : null,
    _canBeAttack : true,
    _hurtColorLife:0,
    HP : 3,
    contentSize:null,
    _emitter:null,
    init:function () {
    	this._super();
    },
    ctor : function(aTexture,space){
        this._super(aTexture);
        this.space = space;
        
        this._rect = cc.rect(0, 0, this.getContentSize().width, this.getContentSize().height);
        this.contentSize = this.getContentSize();

        // init body
        this._body = new cp.Body(1, cp.momentForBox(1, this.contentSize.width, this.contentSize.height));
        this._body.p = cc.p(200,200);
		
		// init shape
        this.shape = new cp.BoxShape(this._body, this.contentSize.width, this.contentSize.height);
        this.shape.setCollisionType(SpriteTag.ship);
		this.space.addShape(this.shape);
		this.shape.setElasticity(0.4);
		this.setBody(this._body);
        
		// 事件穿透
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded,
            onTouchCancelled : this.onTouchCancelled
        }, this);


        GC.LIFE = this.HP;
        
        this.schedule(this.shoot, 1 / 8);
        
    },
    isTouchInRect:function (touch) {
        var getPoint = touch.getLocation();
        var myRect = this.getRect();
        myRect.x += this.x;
        myRect.y += this.y;
        return cc.rectContainsPoint(myRect, getPoint);
    },
    getRect:function () {
        return cc.rect(-this._rect.width / 2, -this._rect.height / 2, this._rect.width, this._rect.height);
    },

    onTouchBegan : function (touch, event) {
        var target = event.getCurrentTarget();
        if (!target.isTouchInRect(touch)){
            return false
        }

        return true;
    },
    onTouchMoved : function (touch, event) {
        var target = event.getCurrentTarget();
        target.setPosition(touch.getLocation());

    },
    onTouchEnded : function (touch, event) {

    },
    
    onTouchCancelled : function (touch, event) {
        
    },
    initAction : function (){
    	// set frame
    	var animFrames = [];
    	// num equal to spriteSheet
    	for (var i = 0; i < 8; i++) {
    		var str = "runner" + i + ".png";
    		var frame = cc.spriteFrameCache.getSpriteFrame(str);
    		animFrames.push(frame);
    	}

    	var animation = new cc.Animation(animFrames, 0.1);
    	this.runningAction = new cc.RepeatForever(new cc.Animate(animation));
    	this.runningAction.retain();
    },
    update:function (dt) {
    	
    	var x = this.x;
    	var y = this.y;
    	
    	if(this._emitter!=null){
    		this._emitter.x = x;
    		this._emitter.y = y;
    	}

    },

    destroy:function () {

        
        for( i=0; i<5; i++ ){
        	var a = ExplosionSprite.getOrCreateExplosion(35);
        	a.x = this.x - this.contentSize.width/2 + Math.round(Math.random()*this.contentSize.width);
        	a.y = this.y - this.contentSize.height/2 + Math.round(Math.random()*this.contentSize.height);
        }
        
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE);
        
        var angVel = this._body.getAngVel();
        var vel = this._body.getVel();

        //旋转
        var randomAngVel = Math.round(Math.random()*5);
        randomAngVel = randomAngVel % 2 == 0?randomAngVel:-randomAngVel;
        this._body.setAngVel(randomAngVel);

        //加速度
        var random = Math.round(Math.random()*20);
        random = random % 2 == 0?random:-random;
        var velocity = cp.v(random, random);
        this._body.setVel(velocity);
        this.space.addBody(this._body);
        
        this._emitter = new cc.ParticleSun();
        this._emitter.texture = cc.textureCache.getTextureForKey("res/game/fire.png");
        if (this._emitter.setShapeType)
        	this._emitter.setShapeType(cc.ParticleSystem.DURATION_INFINITY);
        this._emitter.x = GC.w+50;
        this._emitter.y = GC.h+50;
        GPAnimateLayer.addChild(this._emitter, 5);
        
        GPAnimateLayer.addChild(new GameOverLayer());
        
    },

    shoot : function(dt){

    	var topBullet = BulletSprite.getOrCreateBullet(GC.BULLET_SPEED.SHIP, "zidan2.png", GC.ENEMY_ATTACK_MODE.NORMAL, 3000, GC.UNIT_TAG.PLAYER_BULLET);
        topBullet.x = this.x;
        topBullet.y = this.y;

//        var rightBullet = BulletSprite.getOrCreateBullet(GC.BULLET_SPEED.SHIP, "W1.png", GC.ENEMY_ATTACK_MODE.NORMAL, 3000, GC.UNIT_TAG.PLAYER_BULLET);
//        rightBullet.x = this.x + 13;
//        rightBullet.y = this.y + 3 + this.height * 0.3;

    },
    hurt:function () {
        if (this._canBeAttack) {
        	
        	this._canBeAttack = false;
            this._hurtColorLife = 2;
            this.HP--;
            GC.LIFE = this.HP;
            GPAnimateLayer.lbLife.setString("Life:" + this.HP);
            
            SparkEffectSprite.getOrCreateSparkEffect(this.x, this.y);

            if (GC.SOUND_ON) {
            	try 
            	{ 
            		cc.audioEngine.playEffect(res.gp_shipDestroyEffect_mp3);
            	} 
            	catch (e) 
            	{ 

            	} 
            }
            
            if( this.HP > 0 ){
            	
            	var explosion = ExplosionSprite.getOrCreateExplosion();
            	explosion.x = this.x;
            	explosion.y = this.y;
            	
            	var blinks = cc.blink(3, 9);
            	var makeBeAttack = cc.callFunc(function (t) {
            		t._canBeAttack = true;
            	}.bind(this));

            	this.runAction(cc.sequence(blinks, makeBeAttack));
            	
            } else {
            	this.destroy();
            }
            
        }
    },
    collideRect:function (x, y) {
        var w = this.width, h = this.height;
        return cc.rect(x - w / 2 + 10, y - h / 2 + 10, w-20, h-20);
    },
//    initBornSprite:function () {
//        this._bornSprite = new cc.Sprite("#ship03.png");
//        this._bornSprite.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
//
//        this._bornSprite.x = this.width / 2;
//        this._bornSprite.y = this.height / 2;
//        this._bornSprite.visible = false;
//        this.addChild(this._bornSprite, 3000, 99999);
//    },
//    born:function () {
//        //revive effect
//        this._canBeAttack = false;
//        this._bornSprite.scale = 8;
//        this._bornSprite.runAction(cc.scaleTo(0.5, 1, 1));
//        this._bornSprite.visible = true;
//        var blinks = cc.blink(3, 9);
//        var makeBeAttack = cc.callFunc(function (t) {
//            t._canBeAttack = true;
//            t.visible = true;
//            t._bornSprite.visible = false;
//        }.bind(this));
//        this.runAction(cc.sequence(cc.delayTime(0.5), blinks, makeBeAttack));
//
//        this.HP = 5;
//        this._hurtColorLife = 0;
//        this.active = true;
//    }

});