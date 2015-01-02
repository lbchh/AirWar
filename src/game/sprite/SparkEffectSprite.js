/**
 * Created by lingjianfeng on 14-8-31.
 */

var SparkEffectSprite = cc.Class.extend({
    active:true,
    spark1:null,
    spark2:null,
    scale:1.2,
    duration:0.7,
    ctor:function () {
        this.spark1 = new cc.Sprite("#explode2.png");
        this.spark1.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this.spark2 = new cc.Sprite("#explode3.png");
        this.spark2.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
    },
    reset:function (x, y) {
        this.spark1.attr({
	        x: x,
	        y: y,
	        scale: this.scale,
	        opacity: 255
        });
        this.spark2.attr({
	        x: x,
	        y: y,
	        scale: this.scale,
	        rotation: Math.random() * 360,
	        opacity: 255
        });

        var right = cc.rotateBy(this.duration, 45);
        var scaleBy = cc.scaleBy(this.duration, 3, 3);
        var seq = cc.sequence(cc.fadeOut(this.duration), cc.callFunc(this.destroy, this));

        this.spark1.runAction(right);
        this.spark1.runAction(scaleBy);
        this.spark1.runAction(seq);

        this.spark2.runAction(scaleBy.clone());
        this.spark2.runAction(seq.clone());
    },
    destroy:function () {
        this.active = false;
        this.spark1.visible = false;
        this.spark2.visible = false;
    }
});

SparkEffectSprite.getOrCreateSparkEffect = function (x, y) {
    var selChild = null;
    for (var j = 0; j < GC.CONTAINER.SPARKS.length; j++) {
        selChild = GC.CONTAINER.SPARKS[j];
        if (selChild.active == false) {
            selChild.active = true;
            selChild.spark1.setVisible(true);
            selChild.spark2.setVisible(true);
            selChild.reset(x, y);
            return selChild;
        }
    }
    var spark = SparkEffectSprite.create();
    spark.reset(x, y);
    return spark;
};

SparkEffectSprite.create = function () {
    var sparkEffect = new SparkEffectSprite();
    GPAnimateLayer.addSpark(sparkEffect.spark1);
    GPAnimateLayer.addSpark(sparkEffect.spark2);
    GC.CONTAINER.SPARKS.push(sparkEffect);
    return sparkEffect;
};

SparkEffectSprite.preSet = function () {
    var sparkEffect = null;
    for (var i = 0; i < 6; i++) {
        sparkEffect = SparkEffectSprite.create();
        sparkEffect.active = false;
        sparkEffect.spark1.visible = false;
        sparkEffect.spark2.visible = false;
    }
};
