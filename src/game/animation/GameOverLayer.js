var GameOverLayer = cc.LayerColor.extend({
    // constructor
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        this._super(cc.color(0, 0, 0, 180));
        var winSize = cc.director.getWinSize();

        var centerPos = cc.p(GC.w / 2, GC.h / 2);
        cc.MenuItemFont.setFontSize(30);
        var menuItemRestart = new cc.MenuItemSprite(
        	new cc.Sprite(res.restart_n_png),
        	new cc.Sprite(res.restart_s_png),
            this.onRestart, this);
        var menu = new cc.Menu(menuItemRestart);
        menu.setPosition(centerPos);
        this.addChild(menu);
    },
    onRestart:function (sender) {
    	GC.game = 1;
    	
//    	cc.director.pause();
//    	cc.director.resume();
//    	cc.director.runScene(new StartMenuScene()); 
    	
    	var scene = new StartMenuScene();
    	var transition = cc.TransitionProgressRadialCCW(0.5,scene);
    	cc.director.runScene(transition);
    	
    	
    }
});