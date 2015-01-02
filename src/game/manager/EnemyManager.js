/**
 * Created by lingjianfeng on 14-8-31.
 */

var EnemyManager = cc.Class.extend({

    gamePlayLayer : null,
    
    ctor:function(playLayer){
    	if(!playLayer){
            throw "gameLayer must be non-nil";
        }
    	this.gamePlayLayer = playLayer;

    },
    startLoadEnemies:function(){
    	
    	this.gamePlayLayer.scheduleOnce(function(){
    		this.loadEnemies(0);
    	}.bind(this), GC.EAS);
    	
    	this.gamePlayLayer.scheduleOnce(function(){
    		this.loadEnemies(2);
    	}.bind(this), 3 + Math.ceil(Math.random()*2));
    	
//    	this.gamePlayLayer.scheduleOnce(function(){
//    		this.loadEnemies(4);
//    	}.bind(this), 2 + Math.ceil(Math.random()*2));
    },
    loadEnemies:function(type){
    	
    	if(GC.ACTIVE_ENEMIES.length < GC.MAXENEMIES){
    		
			var random = Math.ceil(Math.random()*6);
			var enemyType;
			if(random<=3){
				enemyType = EnemyType[type];
			}
			if( random>3 && random <=6 ){
				enemyType = EnemyType[type+1];
			}
			this.addEnemyToGameLayer(enemyType);
			
    	}
    	
    	switch (type) {
    	case 0:
    		this.gamePlayLayer.scheduleOnce(function(){
    			this.loadEnemies(0);
    		}.bind(this), GC.EAS);
    		break;
    	case 2:
    		this.gamePlayLayer.scheduleOnce(function(){
    			this.loadEnemies(2);
    		}.bind(this), 3 + Math.ceil(Math.random()*2));
    		break;
    	case 4:
    		this.gamePlayLayer.scheduleOnce(function(){
    			this.loadEnemies(4);
    		}.bind(this), 2 + Math.ceil(Math.random()*2));
    		break;
    	}
    	
    },
    addEnemyToGameLayer:function(enemyType){
    	
    	var addEnemy = EnemySprite.getOrCreateEnemy(enemyType);

        var offset;
        var a0=0;
        var a1=0;
        
        switch (enemyType.type) {
            case 0:
            	
            	addEnemy._body.p = cc.p(GC.w + addEnemy.getContentSize().width,(GC.h - 50) - Math.round(Math.random()*GC.h)/3);
            	
            	var controlPoints = [ cc.p(-200, -300),
            	                      cc.p(-GC.w/2+200, 300),
            	                      cc.p(-GC.w-200, -100) ];

            	var tmpAction = cc.bezierBy(3, controlPoints);
            	addEnemy.runAction(tmpAction);

                break;
                
            case 1:
            	
            	addEnemy._body.p = cc.p(GC.w + addEnemy.getContentSize().width,(GC.h - 50) - Math.round(Math.random()*GC.h)/2);
            	
            	var bezierToAction;
            	var trace = cc.callFunc(function(){
            		
            		var ship = this.gamePlayLayer.shipSprite;
            		var shipX = ship.x ;
            		var shipY = ship.y ;

            		var startX = -10;
            		var startY;
            		if(addEnemy.y>shipY){
            			startY = 80;
            		} else {
            			startY = -80;
            		}

            		var toX = shipX - addEnemy.x + startX;
            		var toY = shipY - addEnemy.y - startY;
            		
            		var endX = toX+toX+startX;
            		var endY = toY+toY+startY;

            		var controlByPoints = [ cc.p(startX, startY),
            		                        cc.p(toX, toY),
            		                        cc.p(endX, endY)];
            		var bezierToAction = cc.bezierBy(1, controlByPoints);
            		
            		var rep = cc.sequence(bezierToAction,cc.callFunc(
            				function(){
            					addEnemy.HP = 0;
            				}
            			)
            		);
            		addEnemy.runAction(rep);
            		
            		
            	}.bind(this), addEnemy);
            	
            	var moveByAction = cc.moveBy(1, cc.p(-100,0));
            	var rep = cc.sequence(moveByAction,trace);
            	
            	addEnemy.runAction(rep);
            	
                break;
            case 2:
            	
            	addEnemy._body.p = cc.p(GC.w + addEnemy.getContentSize().width,(GC.h - 50) - Math.round(Math.random()*GC.h)/2);
            	
            	var moveToAction = cc.moveTo(10, cc.p(-150,addEnemy.y));
            	addEnemy.runAction(moveToAction);
            	
                break;
            case 3:
            	
            	addEnemy._body.p = cc.p(GC.w + addEnemy.getContentSize().width,(GC.h - 50) - Math.round(Math.random()*GC.h)/2);
            	
            	var moveByAction = cc.moveBy(1, cc.p(-50,0));
            	
            	var trace = cc.callFunc(function(){
            		var moveToAction1 = cc.moveTo(3, cc.p(GC.w-50,GC.h-200));
            		var moveToAction2 = cc.moveTo(3, cc.p(GC.w-50,GC.h-20));
            		var repeat = cc.sequence(moveToAction1,moveToAction2).repeatForever();
            		addEnemy.runAction(repeat);
            	},addEnemy);
            	
            	var rep = cc.sequence(moveByAction,trace);
            	addEnemy.runAction(rep);
                
                break;
            case 4:
            	addEnemy._body.p = cc.p(GC.w + addEnemy.getContentSize().width,(GC.h - 50) - Math.round(Math.random()*GC.h)/2);
            	var moveToAction = cc.moveTo(1, cc.p(-100,addEnemy.y));
            	addEnemy.runAction(moveToAction);
            	
            	break;
            case 5:
            	addEnemy._body.p = cc.p(GC.w + addEnemy.getContentSize().width,(GC.h - 50) - Math.round(Math.random()*GC.h)/2);
            	var moveToAction = cc.moveTo(1, cc.p(-100,addEnemy.y));
            	addEnemy.runAction(moveToAction);
            	
            	break;
        }
        
    }
});