cc.Class({
    extends: cc.Component,

    properties: {
        bg:{
            type:cc.Sprite,
            default:null,
        },
    },

    start () {
        //获得屏幕点击坐标点
        this.bg.node.on(cc.Node.EventType.TOUCH_START,function(e){
            console.log('wspace',e.getLocation());
            //屏幕点击坐标点转化为父节点（canves）的node坐标
            var dstPos = this.node.parent.convertToNodeSpaceAR(e.getLocation());
            console.log('nodesapce',dstPos);
            this.node.stopAllActions();
            //当前位置移动到目标坐标
            var movto = cc.moveTo(1,dstPos);
            this.node.runAction(movto);
        },this);
    },

});
