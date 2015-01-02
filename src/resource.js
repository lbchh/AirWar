var res = {
		
	//menu
    restart_n_png : "res/menu/restart_n.png",
    restart_s_png : "res/menu/restart_s.png",
    start_n_png : "res/menu/start_n.png",
    start_s_png : "res/menu/start_s.png",
    
    //game
    gp_TextureOpaquePack_plist : "res/game/textureOpaquePack.plist",
    gp_TextureOpaquePack_png : "res/game/textureOpaquePack.png",
    TextureTransparentPack_plist : "res/game/textureTransparentPack.plist",
    TextureTransparentPack_png : "res/game/textureTransparentPack.png",
    blueships : "res/game/blueships1.png",
    gp_Explosion_plist : "res/game/explosion.plist",
    gp_Explosion_png : "res/game/explosion.png",
    s_fire : "res/game/fire.png",
    zidan22_png :"res/game/zidan22.png",
    zidan22_plist : "res/game/zidan22.plist",
    
    //background
    testBg : "res/background/test1.png",
    background_png :"res/background/background.png",
    background_plist : "res/background/background.plist",
    
    //music
    mm_gameBgMusic_mp3 : "res/music/bgMusic.mp3",
    gp_explodeEffect_mp3 : 'res/music/effect/explodeEffect.mp3',
    gp_shipDestroyEffect_mp3 : 'res/music/effect/shipDestroyEffect.mp3',
    
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}