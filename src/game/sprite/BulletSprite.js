/**
 * Created by lingjianfeng on 14-8-31.
 */

var BulletSprite = cc.Sprite.extend({

    active : true,
    xVelocity : 200,
    HP : 1,

    /**
     * create a Bullet
     * @param bulletSpeed
     * @param weaponType
     * @param attackMode
     */
    ctor : function(bulletSpeed, weaponType, attackMode){
        this._super("#"+weaponType);
//        this._super("res/game/zidan.png");
        this.xVelocity = -bulletSpeed;
        this.attackMode = attackMode;
//        this.setBlendFunc(cc.ZERO, cc.ZERO);

    },
    update:function (dt) {
        var x = this.x;
        this.x = x - this.xVelocity - 0.1*GC.SPEED;
        if (x < 0 || x > GC.w + 10 || this.HP <= 0) {
            this.destroy();
        }
    },
    destroy : function(){
    	
    	if(this.HP <= 0){
    		var a = ExplosionSprite.getOrCreateExplosion(15);
    		a.attr({
    			x: this.x,
    			y: this.y
    		});
    	}
    	
        this.active = false;
        this.visible = false;
    },
    hurt:function () {
        this.HP--;
    },
    collideRect:function (x, y) {
        return cc.rect(x - 3, y - 3, 6, 6);
    }
});

BulletSprite.getOrCreateBullet = function (bulletSpeed, weaponType, attackMode, zOrder, mode) {
    /**/
    var selChild = null;
    if (mode == GC.UNIT_TAG.PLAYER_BULLET) {
        for (var j = 0; j < GC.CONTAINER.PLAYER_BULLETS.length; j++) {
            selChild = GC.CONTAINER.PLAYER_BULLETS[j];
            if (selChild.active == false) {
                selChild.visible = true;
                selChild.active = true;
                selChild.HP = 1;
                return selChild;
            }
        }
    }
    else {
        for (var j = 0; j < GC.CONTAINER.ENEMY_BULLETS.length; j++) {
            selChild = GC.CONTAINER.ENEMY_BULLETS[j];
            if (selChild.active == false) {
                selChild.visible = true;
                selChild.HP = 1;
                selChild.active = true;
                return selChild;
            }
        }
    }
    selChild = BulletSprite.create(bulletSpeed, weaponType, attackMode, zOrder, mode);
    return selChild;
};

BulletSprite.create = function (bulletSpeed, weaponType, attackMode, zOrder, mode) {
    var bullet = new BulletSprite(bulletSpeed, weaponType, attackMode);

    GPAnimateLayer.addBullet(bullet, zOrder, mode);

    if (mode == GC.UNIT_TAG.PLAYER_BULLET) {
        GC.CONTAINER.PLAYER_BULLETS.push(bullet);
    } else {
        GC.CONTAINER.ENEMY_BULLETS.push(bullet);
    }
    return bullet;
};

BulletSprite.preSet = function () {
    var bullet = null;
    for (var i = 0; i < 10; i++) {
    	var bullet = BulletSprite.create(GC.BULLET_SPEED.SHIP, "zidan2.png", GC.ENEMY_ATTACK_MODE.NORMAL, 3000, GC.UNIT_TAG.PLAYER_BULLET);
        bullet.visible = false;
        bullet.active = false;
    }
    for (var i = 0; i < 10; i++) {
    	bullet = BulletSprite.create(GC.BULLET_SPEED.ENEMY, "zidan1.png", GC.ENEMY_ATTACK_MODE.NORMAL, 3000, GC.UNIT_TAG.ENMEY_BULLET);
        bullet.visible = false;
        bullet.active = false;
    }
};