

var EnemySprite = cc.PhysicsSprite.extend({
	space : null,
	shape : null,
	_body : null,
	count:0,
    eID : 0,
    enemyType : 1,
    active : true,
    bulletSpeed : GC.BULLET_SPEED.ENEMY,
    HP : 15,
    booming : false,
    bulletPowerValue : 1,
    scoreValue : 200,
    zOrder : 1000,
    delayTime : 0,
    attackMode : GC.ENEMY_MOVE_TYPE.NORMAL,
    beForeX:0,
    beForeY:0,
    isAcceleration:false,
    _emitter:null,
    ctor:function (arg) {
    	
    	this._super("#"+arg.textureName);
        
        this.space = GPAnimateLayer.space;
        var contentSize = this.getContentSize();
        this._body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
        this._body.p = cc.p(GC.w+100,GC.h+100);
        this._body.father = this;
        
        this.shape = new cp.BoxShape(this._body, contentSize.width, contentSize.height);
        this.shape.setCollisionType(SpriteTag.enemy);
        this.shape.setElasticity(0.4);
        this.space.addShape(this.shape);
        this.setBody(this._body);
        
        
        this.HP = arg.HP;
        this.scoreValue = arg.scoreValue;
        this.attackMode = arg.attackMode;
        this.enemyType = arg.type;
        
        if(arg.shootTime>0){
        	this.delayTime = arg.shootTime + 1.2 * Math.random();
        } 
        
        this.visible = false;
        
    },
    _timeTick:0,
    update:function (dt) {
    	
        var x = this.x;
	    var y = this.y;
	    
	    if(this._emitter!=null){
	    	this._emitter.x = x;
	    	this._emitter.y = y;
	    }
	    
	    
	    if (this.HP <= 0 && this.booming == false) {
	    	this.booming = true;
        	this.startBoom();
        } else {
        	this.beForeX = x;
        	this.beForeY = y;
        }
        
        if( x < -50 || y < -100 || x > GC.w+200){
        	this.scheduleOnce(function(){
        		this.destroy()
        	}.bind(this), 1)
        }
        
    },
    acceleration:function(){
    	if(this.isAcceleration == false){
    		this.isAcceleration = true;
    		this._body.applyImpulse(cp.v(-GC.SPEED*60, 0), cp.v(0, 0));
    	}
    },
    startBoom:function(){
    	if(!this.space.containsBody(this._body)){

    		var angVel = this._body.getAngVel();
    		var vel = this._body.getVel();

    		var velX = this.x - this.beForeX;
    		var velY = this.y - this.beForeY;
    		
    		//设置旋转
    		var randomAngVel = Math.round(Math.random()*5);
    		randomAngVel = randomAngVel % 2 == 0?randomAngVel:-randomAngVel;
    		this._body.setAngVel(velX*randomAngVel);
    		
    		//设置加速度
    		var random = Math.round(Math.random()*20);
    		random = random % 2 == 0?random:-random;
    		var velocity = cp.v(velX*50 + random, velY*50 + random);
    		this._body.setVel(velocity);
    		
    		this.space.addBody(this._body);
    		this.stopAllActions();
    		this.boom();
    		
    		if(GC.SMOKE){
    			this._emitter = new cc.ParticleSun();
    			this._emitter.texture = cc.textureCache.getTextureForKey("res/game/fire.png");
    			if (this._emitter.setShapeType)
    				this._emitter.setShapeType(cc.ParticleSystem.DURATION_INFINITY);
    			this._emitter.x = GC.w+50;
    			this._emitter.y = GC.h+50;
    			GPAnimateLayer.addChild(this._emitter, 5);
    		}
    		

    	}

    	
    },
    boom:function(){
    	
    	GC.SCORE += this.scoreValue;
    	
    	var a = ExplosionSprite.getOrCreateExplosion(35);
    	a.attr({
    		x: this.x,
    		y: this.y
    	});

    	SparkEffectSprite.getOrCreateSparkEffect(this.x, this.y);
    	
    	if (GC.SOUND_ON) {
    		try 
    		{ 
    			cc.audioEngine.playEffect(res.gp_explodeEffect_mp3);
    		} 
    		catch (e) 
    		{ 

    		} 
    	}
    	
    },
    destroy:function () {
    	
    	if(this.space.containsBody(this._body)){
    		this.space.removeBody(this._body);
    	}

    	GC.ACTIVE_ENEMIES.splice(this.count,1);
    	for ( var e=this.count; e<GC.ACTIVE_ENEMIES.length; e++ ) {
    		GC.ACTIVE_ENEMIES[e].count = e;
    	}
    	
        this.visible = false;
        if(this._emitter){
        	GPAnimateLayer.removeChild(this._emitter,true);
        }
        this._emitter = null;
        this.active = false;
        this.booming = false;
        this.isAcceleration = false;
        this.stopAllActions();
        this.unscheduleAllCallbacks();
        this._body.setAngle(0);
    },
    shoot:function () {
        var x = this.x, y = this.y;
        var b = BulletSprite.getOrCreateBullet(this.bulletSpeed, "zidan1.png", this.attackMode, 3000, GC.UNIT_TAG.ENMEY_BULLET);
        b.x = x;
	    b.y = y - this.height * 0.2;
    },
    hurt:function () {
        this._hurtColorLife = 2;
        this.HP--;
    },
    collideRect:function (x, y) {
        var w = this.width, h = this.height;
        return cc.rect(x - w / 2, y - h / 4, w, h / 2+20);
    }
});

EnemySprite.getOrCreateEnemy = function (arg) {
    var selChild = null;
    for (var j = 0; j < GC.CONTAINER.ENEMIES[arg.type].length; j++) {
    	selChild = GC.CONTAINER.ENEMIES[arg.type][j];

        if (selChild.active == false && selChild.enemyType == arg.type) {
            selChild.HP = arg.HP;
            selChild.active = true;
            selChild.visible = true;
            selChild.scoreValue = arg.scoreValue;
            selChild.attackMode = arg.attackMode;
            selChild._hurtColorLife = 0;
            
            selChild.count = GC.ACTIVE_ENEMIES.length;
            GC.ACTIVE_ENEMIES.push(selChild);
            
            if(selChild.delayTime>0){
            	selChild.schedule(selChild.shoot, selChild.delayTime);
            }
            
            return selChild;
        }
    }
    
    selChild = EnemySprite.create(arg);
    selChild.active = true;
    selChild.visible = true;
    selChild.count = GC.ACTIVE_ENEMIES.length;
    
    if(selChild.delayTime>0){
    	selChild.schedule(selChild.shoot, selChild.delayTime);
    }
    
    GC.ACTIVE_ENEMIES.push(selChild);
    
    return selChild;
};

EnemySprite.create = function (arg) {
    var enemy = new EnemySprite(arg);
    GPAnimateLayer.addEnemy(enemy, enemy.zOrder, GC.UNIT_TAG.ENEMY);
    GC.CONTAINER.ENEMIES[arg.type].push(enemy);
    return enemy;
};

EnemySprite.preSet = function () {
    var enemy = null;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < EnemyType.length; j++) {
            enemy = EnemySprite.create(EnemyType[j]);
            enemy.visible = false;
            enemy.active = false;
        }
    }
};
