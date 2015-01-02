var ExplosionSprite = cc.Sprite.extend({
    active:true,
    animation:null,
    ctor:function () {
        var pFrame = cc.spriteFrameCache.getSpriteFrame("explosion_01.png");
        this._super(pFrame);
        this.setBlendFunc(cc.SRC_ALPHA, cc.ONE);

    },
    play:function(playTime){

        var animFrames = [];
        var str = "";
        for (var i = 1; i < playTime; i++) {
            str = "explosion_" + (i < 10 ? ("0" + i) : i) + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, 0.04);

        this.runAction(cc.sequence(
            cc.animate(animation),
            cc.callFunc(this.destroy, this)
        ));
    },
    destroy:function () {
        this.visible = false;
        this.active = false;
    }
});

ExplosionSprite.getOrCreateExplosion = function (playTime) {
    var selChild =null;
    for (var j = 0; j < GC.CONTAINER.EXPLOSIONS.length; j++) {
        var selChild = GC.CONTAINER.EXPLOSIONS[j];
        if (selChild.active == false) {
            selChild.visible = true;
            selChild.active = true;
            selChild.play(playTime);
            return selChild;
        }
    }
    selChild = ExplosionSprite.create();
    selChild.play(playTime);
    return selChild;
};
ExplosionSprite.create = function () {
    var explosion = new ExplosionSprite();
    GPAnimateLayer.addExplosions(explosion);
    GC.CONTAINER.EXPLOSIONS.push(explosion);
    return explosion;
};

ExplosionSprite.preSet = function () {
    var explosion = null;
    for (var i = 0; i < 3; i++) {
        explosion = ExplosionSprite.create();
        explosion.visible = false;
        explosion.active = false;
    }
};
