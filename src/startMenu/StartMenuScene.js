
var startMenuLayer = cc.Layer.extend({
    sprite	:null,
    size	:null,
    musicLabel:null,
    smokeLabel:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        this.size = cc.winSize;
        this.addBackground();
        this.addStartMenu();
        

        return true;
    },
	
	addStartMenu : function() {
		var startItem = new cc.MenuItemImage(
				res.start_n_png,
				res.start_s_png,
				function () {
					cc.director.runScene(new PlayScene());
				}, this);
		startItem.attr({
			x: this.size.width/2,
			y: this.size.height/2,
			anchorX: 0.5,
			anchorY: 0.5
		});

		var menu = new cc.Menu(startItem);
		menu.x = 0;
		menu.y = 0;
		this.addChild(menu, 1);
	},
	
	addBackground : function() {
		var helloLabel = new cc.LabelTTF("天空战争", "Arial", 60);
		// position the label on the center of the screen
		helloLabel.x = this.size.width / 2;
		helloLabel.y = this.size.height;
		// add the label as a child to this layer
		this.addChild(helloLabel, 5);

		// add "HelloWorld" splash screen"
		this.sprite = new cc.Sprite(res.HelloWorld_png);
		this.sprite.attr({
			x: this.size.width / 2,
			y: this.size.height / 2,
			scale: 1,
			rotation: 0
		});
		this.addChild(this.sprite, 0);

		
		helloLabel.runAction(
				cc.spawn(
						cc.moveBy(0.5, cc.p(0, - 60)),
						cc.tintTo(2.5,255,125,0)
				)
		);
		
//		this.musicLabel = new cc.LabelTTF("音乐：开启", "Arial", 25);
//		this.musicLabel.x = this.size.width / 2;
//		this.musicLabel.y = 80;
//		this.addChild(this.musicLabel, 5);
		
//		this.smokeLabel = new cc.LabelTTF("烟雾：开启", "Arial", 25);
//		this.smokeLabel.x = this.size.width / 2;
//		this.smokeLabel.y = 40;
//		this.addChild(this.smokeLabel, 5);
		cc.MenuItemFont.setFontSize(25);
		var toggleItemMusic = new cc.MenuItemToggle(new cc.MenuItemFont("音乐：开启"), new cc.MenuItemFont("音乐：关闭"),
				function (sender) {
			if (sender.getSelectedIndex() == 0) {
				GC.SOUND_ON = true;
			} else {
				GC.SOUND_ON = false;
			}
		});
		toggleItemMusic.setPosition(this.size.width / 2, 80);
		var menu = new cc.Menu(toggleItemMusic);
		menu.setPosition(0, 0);
		menu.setAnchorPoint(0, 0);
		this.addChild(menu, 1);
		
		
		var toggleItemSmoke = new cc.MenuItemToggle(new cc.MenuItemFont("烟雾：开启"), new cc.MenuItemFont("烟雾：关闭"),
			function (sender) {
			if (sender.getSelectedIndex() == 0) {
					GC.SMOKE = true;
				} else {
					GC.SMOKE = false;
				}
			});
		toggleItemSmoke.setPosition(this.size.width / 2, 40);
		var menu = new cc.Menu(toggleItemSmoke);
		menu.setPosition(0, 0);
		menu.setAnchorPoint(0, 0);
		this.addChild(menu, 1);
		
	},

});

var StartMenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        
        var layer = new startMenuLayer();
        this.addChild(layer);
    }
});

