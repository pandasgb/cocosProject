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

        muteshape:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        this.bgm = this.node.getChildByName("audio").getComponent(cc.AudioSource);
        this.bgm.playOnLoad = true;
        this.bgm.loop = true;
        this.bgm.play();
        this.bgm.volume = 0.5;
        console.log('start ms',this.muteshape);


    },

    onButtonClick: function (e,level) {
        var num = parseInt(level);
        console.log('button click',level);
        console.log('pre',this.muteshape);
        console.log('onclick ms',this.muteshape);

        this.muteshape = this.muteshape !== true;
        console.log('after',this.muteshape);
        if (this.muteshape === true){
            console.log(this.bgm.mute);
            this.bgm.mute = true;
        } else {
            this.bgm.mute = false;
        }

    }

    // update (dt) {},
});
