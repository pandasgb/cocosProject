cc.Class({
    extends: cc.Component,

    properties: {

        speed: 20,

        floorNode: {
            type:cc.Node,
            default:null,
        },

        goldNode: {
            type:cc.Node,
            default:null,
        },

        ysNode: {
            type:cc.Node,
            default:null,
        },

        bgList: [],





        floorList: [],
        goldList: [],


        countTime:0,
        goldCountTime:0,

        floorIndex:0,

        goldIndex:0,

        score:0,
        startflag:1,


        goldCurPos:-650,
        goldCreateFlag:0,
        goldCurPosX:0,

        goldM:{
            type:cc.AudioClip,
            default: null,
        },

        currentFloorCount:0,
        speedMax:50,

        currentStage:0,
        stageChangeFlag:false,


        speedChangeTime:0,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled=true;

    },

    start () {
        window.scorescore = 0;

        cc.loader.loadRes('bg2',cc.SpriteFrame,function (err,res) {
            if(err){
                console.log(err);
                return;
            }
            console.log(res);
            this.bgList.push(res);
        }.bind(this));



        this.goldCurPos = -650;
        this.goldCreateFlag = 0;


        this.floorAdd(cc.v2(0,-185));


    },


    floorMove: function (floor,dt) {
        if ((this.speedChangeTime > 10) && (this.currentFloorCount % 5 === 0) && (this.currentFloorCount > 0) && (this.speed < this.speedMax)) {
            this.speed += 5;
            this.speedChangeTime = 0;

        }
        if (floor) {
            floor.y += 7 * dt * this.speed;
            if (floor.y > 675) {
                var floorTemp = this.floorList.shift();
                floorTemp.destroy();
                // console.log('delete:',floor);
                window.scorescore += 1;

                this.currentFloorCount += 1;
            }
        }

    },

    goldMove: function (gold,dt) {
        if (gold !== null) {
            gold.y += 7 * dt * this.speed;
            if (gold.y > 680) {
                var floorTemp = this.goldList.shift();
                floorTemp.destroy();
                // console.log('delete:',gold);
            }
        }

    },


    reDirectPosition: function () {
        var positiony = -650 + 30 - Math.random()*100;
        var positionx = 225 - Math.random() * 450;
        return cc.v2(positionx,positiony);
    },


    reDirectPositionStart: function () {
        var positiony = -300 - Math.random() * 500;
        var positionx = 200 - Math.random() * 400;


        return cc.v2(positionx,positiony);

    },




    floorAdd: function(positionxy=null){
        cc.loader.loadRes('prefabs/floor',function (err,res) {
            if (err) {
                console.log(err);
                return;
            }

            this.floorNode = cc.instantiate(res);
            this.floorNode.name = 'floor'+this.floorIndex;
            this.floorIndex += 1;

            this.floorList.push(this.floorNode);

            this.node.insertChild(this.floorNode,1);
            if ( positionxy ) {

                this.floorNode.position = positionxy;
            } else {
                this.changeFloor(this.floorNode);
                this.floorNode.position = this.reDirectPosition();
            }
        }.bind(this));
    },

    update (dt) {
        this.speedChangeTime += dt;
        this.countTime += dt;
        this.goldCountTime += dt;

        console.log('speed',this.speed);
        console.log('currentFloorCount',this.currentFloorCount);


        // console.log(scorescore);

        if (this.floorList.length < 6) {
            // 初始创造
            if ( this.startflag === 1 ) {
                let startposition2 = cc.v2(-193,-340);


                // 同时造出来的会同时删除
                this.scheduleOnce(function () {
                    this.floorAdd(startposition2);
                }.bind(this),0.05);
                var startposition3 = cc.v2(200,-520);
                // 同时造出来的会同时删除
                this.scheduleOnce(function () {
                    this.floorAdd(startposition3);
                }.bind(this),0.05);
                this.startflag = 0;
            }


            var deltaTime = 1.3 + Math.random();
            if (this.countTime > deltaTime){
                this.floorAdd();
                this.countTime = 0;
            }
        }

        for (var i of this.floorList) {
            this.floorMove(i,dt);
        }

        if (this.goldList.length < 9) {
            var deltaTime2 = 1.8 + Math.random();
            if (this.goldCountTime > deltaTime2){
                var goldProb = Math.random();

                if (goldProb < 0.1) {

                    this.goldCurPosX = Math.round(Math.random()*2);
                    // console.log('this.goldCurPosX',this.goldCurPosX);
                    for (var kk = 0; kk < 3; kk ++){
                        this.generGold();
                    }
                    this.goldCountTime = 0;
                    this.goldCreateFlag = 0;
                }
            }
        }

        for (var j of this.goldList) {
            this.goldMove(j,dt);
        }




        if ((this.currentFloorCount % 10 === 0) && (this.currentFloorCount > 0) && (this.stageChangeFlag === false)) {
            this.stageChangeFlag = true;
            this.changeStage();
        }

        if ((this.currentFloorCount % 10 === 1) && (this.stageChangeFlag === true)) {
            this.stageChangeFlag = false;

        }


    },


    changeStage () {
        console.log('changescene');
        this.currentStage += 1;
        this.speed = 20;
        this.speed += this.currentStage * 5;
        this.getComponent(cc.Sprite).spriteFrame = this.bgList[0];
    },




    generGoldPos () {

        // console.log('this.goldCurPos',this.goldCurPos);
        // console.log('this.goldCreateFlag',this.goldCreateFlag);

        if (this.goldCreateFlag < 3){
            this.goldCurPos -= 60;
        }
        if (this.goldCurPos < -3000) {
            this.goldCurPos = -650;
        }
        this.goldCreateFlag += 1;
        var positionx = 0;

        switch (this.goldCurPosX) {
            case 0:
                break;
            case 1:
                positionx = -200;
                break;
            case 2:
                positionx = 200;
                break;
        }
        return cc.v2(positionx,this.goldCurPos);
    },


    generYs (preNode) {

        cc.loader.loadRes('prefabs/ys',cc.Prefab,function (err,res) {
            if(err){
                console.log(err);
                return;
            }


            this.ysNode = cc.instantiate(res);

            preNode.addChild(this.ysNode);
            this.ysNode.position = cc.v2(0,60);

        }.bind(this));

    },






    generGold () {
        // console.log('generGold11');
        cc.loader.loadRes('prefabs/jb',cc.Prefab,function (err,res) {
            if(err){
                console.log(err);
                return;
            }

            this.goldNode = cc.instantiate(res);
            this.goldNode.name = 'gold'+this.goldIndex;
            this.goldIndex += 1;

            this.goldList.push(this.goldNode);

            this.node.addChild(this.goldNode);

            this.goldNode.position = this.generGoldPos();


        }.bind(this));
    },


    changeFloor: function (floorNode) {
        // var flag = 1+ Math.round(Math.random()*9);

        var flag = Math.random() * 100;
        // var flag = 69;

        // console.log(flag);

        if (flag < 70) {
            if (flag < 4){
                console.log('flag:',flag);
                this.generYs(floorNode);
            }
            return;
        } else if ( flag > 70 && flag <= 80 ) {
            //弹力
            cc.loader.loadRes('jumpfloor',cc.SpriteFrame,function (err,res) {
                if (err) {
                    console.log(err);
                    return;
                }
                floorNode.getComponent(cc.Sprite).spriteFrame = res;
            }.bind(this));
            floorNode.w = 183;
            floorNode.h = 99;
            floorNode.getComponent(cc.BoxCollider).tag = 7;
            return;
        } else if ( flag > 80 && flag <= 85 ) {
            //刺
            cc.loader.loadRes('floor2',cc.SpriteFrame,function (err,res) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(res);
                floorNode.getComponent(cc.Sprite).spriteFrame = res;
            }.bind(this));

            floorNode.w = 225;
            floorNode.h = 90;

            floorNode.getComponent(cc.PhysicsPolygonCollider).tag = 1;
            return;
        } else if ( flag > 85 && flag <= 90 ) {
            //移动左
            cc.loader.loadRes('floor/floorleft2',cc.SpriteFrame,function (err,res) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(res);
                floorNode.getComponent(cc.Sprite).spriteFrame = res;
            }.bind(this));

            floorNode.w = 225;
            floorNode.h = 45;

            floorNode.getComponent(cc.BoxCollider).tag = 5;
            return;
        } else if ( flag > 90 && flag <= 95 ) {
            //移动右
            cc.loader.loadRes('floor/floorright2',cc.SpriteFrame,function (err,res) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(res);
                floorNode.getComponent(cc.Sprite).spriteFrame = res;
            }.bind(this));

            floorNode.w = 225;
            floorNode.h = 45;

            floorNode.getComponent(cc.BoxCollider).tag = 6;
            return;
        } else if ( flag > 95 && flag <= 100 ) {
            //碎梯
            cc.loader.loadRes('floor/floorbreak1',cc.SpriteFrame,function (err,res) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(res);
                floorNode.getComponent(cc.Sprite).spriteFrame = res;
            }.bind(this));
            console.log('type5 is create');

            floorNode.getComponent(cc.BoxCollider).tag = 8;
            return;
        }





        // switch (flag) {
        //     case 1:
        //         //弹力
        //         cc.loader.loadRes('jumpfloor',cc.SpriteFrame,function (err,res) {
        //             if (err) {
        //                 console.log(err);
        //                 return;
        //             }
        //             floorNode.getComponent(cc.Sprite).spriteFrame = res;
        //         }.bind(this));
        //
        //         floorNode.w = 183;
        //         floorNode.h = 99;
        //
        //         floorNode.getComponent(cc.BoxCollider).tag = 7;
        //         break;
        //
        //     case 2:
        //         //刺
        //         cc.loader.loadRes('floor2',cc.SpriteFrame,function (err,res) {
        //             if (err) {
        //                 console.log(err);
        //                 return;
        //             }
        //             console.log(res);
        //             floorNode.getComponent(cc.Sprite).spriteFrame = res;
        //         }.bind(this));
        //
        //         floorNode.w = 225;
        //         floorNode.h = 90;
        //
        //         floorNode.getComponent(cc.PhysicsPolygonCollider).tag = 1;
        //
        //         break;
        //     case 3:
        //         //移动左
        //         cc.loader.loadRes('floor/floorleft2',cc.SpriteFrame,function (err,res) {
        //             if (err) {
        //                 console.log(err);
        //                 return;
        //             }
        //             console.log(res);
        //             floorNode.getComponent(cc.Sprite).spriteFrame = res;
        //         }.bind(this));
        //
        //         floorNode.w = 225;
        //         floorNode.h = 45;
        //
        //         floorNode.getComponent(cc.BoxCollider).tag = 5;
        //         break;
        //     case 4:
        //         //移动右
        //         cc.loader.loadRes('floor/floorright2',cc.SpriteFrame,function (err,res) {
        //             if (err) {
        //                 console.log(err);
        //                 return;
        //             }
        //             console.log(res);
        //             floorNode.getComponent(cc.Sprite).spriteFrame = res;
        //         }.bind(this));
        //
        //         floorNode.w = 225;
        //         floorNode.h = 45;
        //
        //         floorNode.getComponent(cc.BoxCollider).tag = 6;
        //         break;
        //     case 5:
        //         //碎梯
        //         cc.loader.loadRes('floor/floorbreak1',cc.SpriteFrame,function (err,res) {
        //             if (err) {
        //                 console.log(err);
        //                 return;
        //             }
        //             console.log(res);
        //             floorNode.getComponent(cc.Sprite).spriteFrame = res;
        //         }.bind(this));
        //         console.log('type5 is create');
        //
        //         floorNode.getComponent(cc.BoxCollider).tag = 8;
        //
        //         break;
        //     case 10:
        //         console.log('type0');
        //         break;
        //     case 6:
        //         console.log('type0');
        //         break;
        //     case 7:
        //         console.log('type0');
        //         break;
        //     case 8:
        //         console.log('type0');
        //         break;
        //     case 9:
        //         console.log('type0');
        //         break;
        //     default:
        //         break;
        //
        // }

    },


});
