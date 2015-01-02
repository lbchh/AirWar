

var ObstacleSprite = cc.PhysicsSprite.extend({
	space : null,
	shape : null,
	_body : null,
    active : true,
    zOrder : 1000,
    name:null,
    contentSize:null,
    ctor:function (arg) {
    	
//    	var cpriteFrame = GPAnimateLayer._texTransparentBatch.getSpriteFrameByName();
    	this._super("#"+arg.textureName);
    	this.name = arg.textureName;

        this.space = GPAnimateLayer.space;
        this.contentSize = this.getContentSize();
        this._body = new cp.Body(90, cp.momentForBox(10000, this.contentSize.width, this.contentSize.height));
        this._body.p = cc.p(GC.w+200,g_groundHeight+this.contentSize.height/2);
        
        this.shape = new cp.BoxShape(this._body, this.contentSize.width, this.contentSize.height);
        this.shape.setCollisionType(SpriteTag.wallBottom);


        this.space.addShape(this.shape);
        this.setBody(this._body);

    },
    show:function(){
    	
    	if(!this.space.containsBody(this._body)){
    		this.space.addBody(this._body);
    	}
    	
    	this._body.setVel(cp.v(-GC.SPEED*60, 0));
    	
    	
    },
    update:function (dt) {
    	
        var x = this.x;
	    var y = this.y;
	    
        if( x < -50 || y < -100 ){
        	this.destroy();
        }
        
    },
    destroy:function () {
    	
        this.visible = false;
        this.active = false;
        
        this._body.setAngle(0);
        this._body.setVel(cp.v(0, 0));
        if(this.space.containsBody(this._body)){
        	this.space.removeBody(this._body);
        }
        this._body.p = cc.p(GC.w+200,g_groundHeight+this.contentSize.height/2);
        
    },
    collideRect:function (x, y) {
        var w = this.width, h = this.height;
        return cc.rect(x - w / 2, y - h / 4, w, h / 2+20);
    }
});

ObstacleSprite.getOrCreateEnemy = function (arg) {
    var selChild = null;
    for (var j = 0; j < GC.CONTAINER.OBSTACLE.length; j++) {
    	selChild = GC.CONTAINER.OBSTACLE[j];

    	if (selChild.active == false && selChild.name == arg.textureName) {
 
            selChild.active = true;
            selChild.visible = true;

            return selChild;
        }
    }
    selChild = ObstacleSprite.create(arg);
    
    return selChild;
};

ObstacleSprite.create = function (arg) {
	var obstacle = new ObstacleSprite(arg);
	GPAnimateLayer.addObstacle(obstacle,3000,1001);
	GC.CONTAINER.OBSTACLE.push(obstacle);
    return obstacle;
};

ObstacleSprite.preSet = function () {
	var obstacle = null;
    for (var i = 0; i < 3; i++) {
    	for (var j = 0; j < ObstacleType.length; j++) {
    		obstacle = ObstacleSprite.create(ObstacleType[j]);
    		obstacle.visible = false;
    		obstacle.active = false;
        }
    }
};
