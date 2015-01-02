var BackgroundLayer2 = cc.Layer.extend({
    map00:null,
    map01:null,
    mapWidth:0,
    mapIndex:0,
    space:null,
    spriteSheet:null,
    moveX:0,
    objects:[],
    tree:null,
    treebody:null,
    _obstacleBatch:null,
    sprite:null,
    body:null,
    ctor:function (space) {
        this._super();

        // clean old array here
        this.objects = [];
        this.space = space;

        this.init();
    },

    init:function () {
        this._super();

//        this.map00 = new cc.TMXTiledMap(res.test1);
        this.map00 = new cc.Sprite(res.testBg);
        this.map00.setAnchorPoint(cc.p(0,0));
        this.addChild(this.map00);

        this.mapWidth = this.map00.getContentSize().width;
        
//        this.map01 = new cc.TMXTiledMap(res.test1);
        this.map01 = new cc.Sprite(res.testBg);
        this.map01.setPosition(cc.p(this.mapWidth, 0));
        this.map01.setAnchorPoint(cc.p(0,0));
        this.addChild(this.map01);

        this.scheduleUpdate();
        
    },

//    removeObjects:function (mapIndex) {
//        while((function (obj, index) {
//            for (var i = 0; i < obj.length; i++) {
//                if (obj[i].mapIndex == index) {
//                    obj[i].removeFromParent();
//                    obj.splice(i, 1);
//                    return true;
//                }
//            }
//            return false;
//        })(this.objects, mapIndex));
//    },
//
//    removeObjectByShape:function (shape) {
//        for (var i = 0; i < this.objects.length; i++) {
//            if (this.objects[i].getShape() == shape) {
//                this.objects[i].removeFromParent();
//                this.objects.splice(i, 1);
//                break;
//            }
//        }
//    },
//
//    checkAndReload:function () {
//    	cc.log(this.mapWidth);
//        var newMapIndex = parseInt(eyeX / this.mapWidth);
//        if (this.mapIndex == newMapIndex) {
//            return false;
//        }
//
//        if (0 == newMapIndex % 2) {
//            // change mapSecond
//            this.map01.setPositionX(this.mapWidth * (newMapIndex + 1));
//            this.loadObjects(this.map01, newMapIndex + 1);
//
//        } else {
//            // change mapFirst
//            this.map00.setPositionX(this.mapWidth * (newMapIndex + 1));
//            this.loadObjects(this.map00, newMapIndex + 1);
//
//        }
//
//        this.removeObjects(newMapIndex - 1);
//        this.mapIndex = newMapIndex;
//
//        return true;
//    },

    update:function (dt) {
//        var animationLayer = this.getParent().getChildByTag(TagOfLayer.Animation);
//        var eyeX = animationLayer.getEyeX();
//        this.checkAndReload(eyeX);
    	this.moveX +=GC.SPEED;
    	GC.SCORE += 1;
    	var newMapIndex = parseInt(this.moveX / this.mapWidth);
    	
    	if (this.mapIndex != newMapIndex) {
    		if (0 == newMapIndex % 2) {
    			// change mapSecond
    			this.map01.setPositionX(this.mapWidth * (newMapIndex + 1));
//    			this.loadObjects(this.map01, newMapIndex + 1);

    		} else {
    			// change mapFirst
    			this.map00.setPositionX(this.mapWidth * (newMapIndex + 1));
//    			this.loadObjects(this.map00, newMapIndex + 1);
    			
    		}
    		
    		if(newMapIndex == 15){
    			GC.SPEED = GameSpeed.two;
    			GC.EAS = EnemyAppearSpeed.two;
    		}
    		
    		if(newMapIndex == 50){
    			GC.SPEED = GameSpeed.three;
    			GC.EAS = EnemyAppearSpeed.three;
    		}
  		}
    	
//    	this.body.setPos(cc.p(300 - this.moveX, this.sprite.getContentSize().height  / 2 + g_groundHeight));
    	
//    	this.removeObjects(newMapIndex - 1);
    	this.mapIndex = newMapIndex;
    	this.setPosition(cc.p(-this.moveX,0));
    	
    }
});
