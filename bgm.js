cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.addPersistRootNode(this.node);
    },

    // start () {
    //     this.bgm = this.node.getChildByName("audio").getComponent(cc.AudioSource);
    //     this.bgm.playOnLoad = true;
    //     this.bgm.loop = true;
    //     this.bgm.volume = 1;
    //     // cc.audioEngine.playMusic(this.bgm.clip,true);
    //     this.bgm.play();
    //     // console.log(this.bgm);
    //
    // },
    //
    // bgmPause: function () {
    //     // getChildByName("mute").getComponent(cc.Toggle)
    //     var tg = cc.find("Canvas/menu/mute").getComponent(cc.Toggle);
    //
    //
    //     console.log(tg.isChecked);
    //     if (tg.isChecked === false) {
    //         console.log("toggleis false");
    //         this.bgm.stop();
    //     } else {
    //         console.log("toggleis true");
    //         this.bgm.play();
    //     }
    // },

    // update (dt) {},
});
