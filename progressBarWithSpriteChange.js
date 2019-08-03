cc.Class({
    extends: cc.Component,

    properties: {
        label1:{
          type:cc.Label,
          default:null,
        },
        // 设置切换图片列表
        change_sp:{
            type:cc.SpriteFrame,
            default:[],
        },
        countTime:0,


    },

    start () {
        this.sp = this.getComponentInChildren(cc.Sprite);
        console.log(this.sp.node.name);
        this.sp.fillRange = 0;
        
        this.showspnode = this.node.getChildByName("spshow");
        console.log(this.showspnode);
        this.changetarget = this.showspnode.getComponent(cc.Sprite);
        console.log(this.changetarget);
    },

    update (dt) {
        this.countTime += dt/10;
        console.log(this.countTime);
        if (this.sp.fillRange < 1){
            this.sp.fillRange += dt/10;
            this.label1.string = Math.round(this.sp.fillRange*100) + '%';
        } else {
            console.log('progress complete');
            this.sp.fillRange = 0;
        }
        // 按时间切换图片内容
        if (this.countTime < 0.5){
            this.changetarget.spriteFrame = this.change_sp[0];
        } else {
            this.changetarget.spriteFrame = this.change_sp[1];
        }
        if (this.countTime > 1){
            this.countTime = 0;
        }
    },
});
