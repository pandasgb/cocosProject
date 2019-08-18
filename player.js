cc.Class({
    extends: cc.Component,

    properties: {
        is_touch:false,
        score:0,
        scoreLabel: {
            type: cc.Label,
            default: null,
        },
        jumpDuration: 0.5,
        sgravity:0,
        onCollisionFlag:false,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {},

    start () {
        this.bloodNow = 3;
        this.bloodMax = 5;
        this.bloodbar = this.node.parent.getChildByName('blood1').getComponentInChildren(cc.Sprite);
        this.bloodbar.fillRange = this.bloodNow/this.bloodMax;

        cc.loader.loadRes('music/cjb1',cc.AudioClip,function (err,res) {
            if (err) {
                console.log(err);
                return;
            }
            this.goldM = res;
        }.bind(this));

        this.deadmenu = cc.find("Canvas/BG/deadmenu");
        this.deadmenu.active = false;
        
        this.nodeAnimation = this.node.getComponent(cc.Animation);
        this.nodeAnimation.play();
        this.bg = this.node.getParent();

        this.bg.on(cc.Node.EventType.TOUCH_START,function (e) {
           this.is_touch = true;
           // console.log('beforethisx',this.node.x);
           this.curPos = this.node.x;
           this.dstPos = this.node.parent.convertToNodeSpaceAR(e.getLocation());
           this.dstPos.y = this.node.y;
            if (this.dstPos.x > this.curPos) {
                // this.node.stopAllActions();
                this.nodeAnimation.play("right");
            } else if (this.dstPos.x < this.curPos){
                // this.node.stopAllActions();
                this.nodeAnimation.play("left");
            } else {
                this.nodeAnimation.play();
            }



            // this.getComponent(cc.RigidBody).gravityScale = 3;
            // console.log('touching&&&&&&&&&&&',this.getComponent(cc.RigidBody).gravityScale);

        }.bind(this),this);



        this.bg.on(cc.Node.EventType.TOUCH_END,function (e) {
            this.nodeAnimation.play();
            // this.nodeAnimation.stop();

            this.is_touch = false;
        }.bind(this),this);




        this.scoreLabel.string = scorescore.toString();

    },


    update (dt) {

        // console.log(this.bloodNow);



        // console.log('gravity',this.getComponent(cc.RigidBody).gravityScale);

        if (!this.onCollisionFlag){
            this.sgravity += 7*dt;
            this.node.y -= this.sgravity;
        }




        // console.log('sgravity',this.sgravity);
        // console.log('nodey',this.node.y);







        if(this.is_touch === true) {
            // console.log("this.dstPos.x",this.dstPos.x);
            // console.log("this.curPos",this.curPos);
            if (this.dstPos.x > this.curPos) {
                var movto1 = cc.moveBy(0.1,cc.v2(6,0));
                this.node.runAction(movto1);

            } else if (this.dstPos.x < this.curPos){
                var movto2 = cc.moveBy(0.1,cc.v2(-6,0));
                this.node.runAction(movto2);

            }
        }

        this.scoreLabel.string = scorescore.toString();
        this.bloodbar.fillRange = this.bloodNow/this.bloodMax;


    },

    restart: function(){
        cc.director.loadScene("gamePlay",function () {
            // cc.director.getPhysicsManager().enabled = true;
            cc.director.resume();
        });

    },


    gameEnd: function () {
        cc.director.loadScene("gameStart",function () {
            // cc.director.getPhysicsManager().enabled = true;
            cc.director.resume();
        });

    },


    playerHurt: function () {
        this.bloodNow -= 1;
        if (this.bloodNow === 0) {
            this.playerDie();
        }
        var action = cc.repeat(cc.sequence(cc.fadeTo(0.08, 0), cc.fadeTo(0.08, 255)), 5);
        this.node.runAction(action);

    },

    playerDie: function(){
        console.log('player die');
        this.bloodbar.fillRange = 0;

        this.node.stopAllActions();
        cc.director.pause();
        console.log("pause3");

        this.deadmenu.active = true;
        var labeltext = this.deadmenu.getChildByName("scoreshow").getComponent(cc.Label);
        console.log('labeltext',labeltext);
        console.log('scorelabel',scorescore.toString());
        labeltext.string = "本次得分：" + scorescore.toString();
        // this.restart();

    },

    moveLeft: function () {
        var movto1 = cc.moveBy(0.1,cc.v2(-2.5,0));
        this.node.runAction(movto1);

    },


    moveRight: function () {
        var movto1 = cc.moveBy(0.1,cc.v2(2.5,0));
        this.node.runAction(movto1);

    },

    moveUp: function() {
        var movto1 = cc.moveBy(this.jumpDuration, cc.v2(0, 150));
        //.easing(cc.easeCubicActionOut()
        var action = this.node.runAction(movto1);
        action.easing(cc.easeCubicActionOut());
    },


    // moveDown: function() {
    //     var
    // }



    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.tag === 1){
            console.log(otherCollider.name);
            console.log('player die up');
            this.playerHurt();

        } else if (otherCollider.tag === 3) {
            // this.score += 1;
        } else if (otherCollider.tag === 5) {
            this.moveLeft();
        }

    },

    onCollisionStay: function (other, self) {
        this.onCollisionFlag = true;
        this.sgravity = 0;


        if (other.tag === 5) {
            // console.log('othertag',other.tag);
            this.moveLeft();
        }

        if (other.tag === 6) {
            // console.log('othertag',other.tag);
            this.moveRight();
        }




    },


    onCollisionEnter: function (other, self) {
        // console.log(other.tag);

        if (other.tag === 7){

            // self.getComponent(cc.RigidBody).gravityScale = 0;
            this.moveUp();
        }

        if (other.tag === 8) {



            this.scheduleOnce(function () {
                cc.loader.loadRes('floor/floorbreak2',cc.SpriteFrame,function (err,res) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    // console.log('change texture');
                    other.getComponent(cc.Sprite).spriteFrame = res;
                });
            },0.5);

            this.scheduleOnce(function () {
                other.node.active = false;
            }.bind(this),1);

        }

        if (other.tag === 99) {
            cc.audioEngine.play(this.goldM,false,1);
            window.scorescore += 5;
            this.showScore();
            other.node.active = false;
        }

        if (other.tag === 88) {
            cc.audioEngine.play(this.goldM,false,1);
            if (this.bloodNow < this.bloodMax) {
                this.bloodNow += 1;
            }
            // other.node.active = false;
            other.node.destroy();
        }
    },

    showScore () {
        var newnode = new cc.Node('labelplus');
        var labels = newnode.addComponent(cc.Label);
        this.bg.addChild(newnode,1,'scoreshow');
        labels.string = '+5';
        var action = cc.fadeOut(0.5);
        newnode.runAction(action);
        var action2 = cc.moveBy(0.5,cc.v2(0,20));
        newnode.runAction(action2);
        this.scheduleOnce(function () {
                newnode.destroy();
            },0.5);
    },


    onCollisionExit: function (other, self) {
        this.onCollisionFlag = false;
    },


    onEndContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.tag === 2){
            console.log(otherCollider.name);
            console.log('player die down');
            this.playerDie();
        }
    },

});
