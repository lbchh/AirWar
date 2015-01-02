
var PlayScene = cc.Scene.extend({
    space:null,
    shapesToRemove:[],
    gameLayer:null,

    // init space of chipmunk
    initPhysics:function() {
    	
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -350);
        var wallBottom = new cp.SegmentShape(this.space.staticBody,
            cp.v(-1000, g_groundHeight),// start point
            cp.v(4294967295, g_groundHeight),// MAX INT:4294967295
            0);// thickness of wall
        wallBottom.setCollisionType(SpriteTag.wallBottom);
        wallBottom.setElasticity(1);//弹性
//        wallBottom.setFriction(0);//摩擦
        this.space.addStaticShape(wallBottom);
        
        // 物理碰撞
        this.space.addCollisionHandler(SpriteTag.enemy, SpriteTag.wallBottom,
            this.collisionEnemyBegin, null, null, null);
        
    },

    collisionEnemyBegin:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var body = shapes[0].getBody();
        body.father.acceleration();
        return true;
    },

    onEnter:function () {
        this._super();
        
        GC.winSize = cc.winSize;

        GC.h = GC.winSize.height;

        GC.w = GC.winSize.width;

        GC.w_2 = GC.winSize.width / 2 ;

        GC.h_2 = GC.winSize.height / 2;
        
        GC.SCORE = 0;
        GC.SPEED = GameSpeed.one;
        GC.EAS = EnemyAppearSpeed.one;
        GC.ACTIVE_ENEMIES = [];
        GC.CONTAINER = {
        		ENEMIES : [[],[],[],[],[],[]],
        		ENEMY_BULLETS : [],
        		PLAYER_BULLETS : [],
        		SPARKS : [],
        		EXPLOSIONS : [],
        		OBSTACLE : []
        };
        
        
        
//        this._debugNode = new cc.PhysicsDebugNode(this.space);
//        this._debugNode.setVisible(false);
//        this.addChild(this._debugNode, 10);
        
        

//        if(GC.game == 0){
        	this.initPhysics();
        	
        	this.gameLayer = new cc.Layer();
        	this.gameLayer.addChild(new BackgroundLayer2(this.space), 0, TagOfLayer.background);
        	this.gameLayer.addChild(new AnimationLayer(this.space), 0, TagOfLayer.Animation);
        	this.addChild(this.gameLayer);
        	
        	if (GC.SOUND_ON) {
        		try 
        		{ 
        			cc.audioEngine.playMusic(res.mm_gameBgMusic_mp3, true);
        		} 
        		catch (e) 
        		{ 

        		} 
        	}

        	this.scheduleUpdate();
//        }
        
    },
    update:function (dt) {
        this.space.step(dt);
    },
    onExit:function () {
    	this.space.removeCollisionHandler(SpriteTag.enemy, SpriteTag.wallBottom);
    	this._super();
    }
});