cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.menu = this.node.getChildByName("menu");
        this.setBut = cc.find("Canvas/setbutton").getComponent(cc.Button);
        this.bgmask = this.node.getChildByName("bgmask");

        //音乐播放
        cc.audioEngine.stopAll();
        this.bgm = cc.find("bgm/audio").getComponent(cc.AudioSource);
        this.bgm.volume = 1;
        this.audioID = cc.audioEngine.playMusic(this.bgm.clip,true);

    },


    musicstart: function(){
        var tg = cc.find("Canvas/menu/mute").getComponent(cc.Toggle);
        console.log(tg.isChecked);
        if (tg.isChecked === false) {
            console.log("toggleis false");
            cc.audioEngine.stopAll();
            console.log("this.audioID",this.audioID);
        } else {
            console.log("toggleis true");
            cc.audioEngine.playMusic(this.bgm.clip,true);
        }

    },


    onClickStartButton: function () {
        cc.director.loadScene("gamePlay");
    },


    onClickSetButton: function(){
        this.menu.active = true;
        this.setBut.interactable = false;
        this.bgmask.opacity = 200;
        console.log(this.setBut);
    },


    onCloseMenu: function () {
        this.menu.active = false;
        this.setBut.interactable = true;
        this.bgmask.opacity = 0;
        console.log("thismenu",this.menu);
        console.log(this.menu.active);
    },

    // update (dt) {},
});
