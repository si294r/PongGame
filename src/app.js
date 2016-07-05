
var PongGameLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();

        var size = cc.winSize;

        // sprite(s) contructor
        var sprite_left = new cc.Sprite(res.vertical_png);
        sprite_left.attr({
            x: 40,
            y: size.height / 2
        });
        this.addChild(sprite_left);
        window.sprite_left = sprite_left;

        var sprite_right = new cc.Sprite(res.vertical_png);
        sprite_right.attr({
            x: size.width - 40,
            y: size.height / 2
        });
        this.addChild(sprite_right);

        var sprite_top = new cc.Sprite(res.horizontal_png);
        sprite_top.attr({
            x: size.width / 2,
            y: size.height - sprite_top.getContentSize().height
        });
        this.addChild(sprite_top);

        var sprite_bottom = new cc.Sprite(res.horizontal_png);
        sprite_bottom.attr({
            x: size.width / 2,
            y: sprite_bottom.getContentSize().height
        });
        this.addChild(sprite_bottom);

        // event handler - keyboard
        if (cc.sys.capabilities.hasOwnProperty('keyboard')) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function(key, event) {
                    // cc.log("Key Pressed: " + key.toString());
                    var position = sprite_left.getPosition();
                    var content_size = sprite_left.getContentSize();
                    // var bounding_box = sprite_left.getBoundingBox();
                    // cc.log("size: " + size.height);
                    // cc.log("position: " + position.y);
                    // cc.log("content_size: " + content_size.height);
                    // cc.log("bounding_box: " + bounding_box.height);
                    var dest_top = (size.height - (content_size.height / 2)) - sprite_top.getContentSize().height;
                    var dest_bottom = (content_size.height / 2) + sprite_top.getContentSize().height;
                    // cc.log("dest_top: " + dest_top);
                    // cc.log("dest_bottom: " + dest_bottom);
                    if (key == 75) { // key up char 'K'
                        // cc.log("run Act: " + sprite_left.getNumberOfRunningActions());
                        var speed_top = Math.abs(dest_top - position.y)/(dest_top - dest_bottom);
                        if (sprite_left.getNumberOfRunningActions() == 0) {
                            sprite_left.runAction(cc.MoveTo.create(speed_top, cc.p(40, dest_top)));
                        }
                        if (sprite_right.getNumberOfRunningActions() == 0) {
                            sprite_right.runAction(cc.MoveTo.create(speed_top, cc.p(size.width - 40, dest_top)));
                        }
                    } else if (key == 77) { // key down char 'M'
                        // cc.log("run Act: " + sprite_left.getNumberOfRunningActions());
                        var speed_bottom = Math.abs(dest_bottom - position.y)/(dest_top - dest_bottom);
                        if (sprite_left.getNumberOfRunningActions() == 0) {
                            sprite_left.runAction(cc.MoveTo.create(speed_bottom, cc.p(40, dest_bottom)));
                        }
                        if (sprite_right.getNumberOfRunningActions() == 0) {
                            sprite_right.runAction(cc.MoveTo.create(speed_bottom, cc.p(size.width - 40, dest_bottom)));
                        }
                    }
                },
                onKeyReleased: function(key, event) {
                    sprite_left.stopAllActions();
                    sprite_right.stopAllActions();
                }
            }, this);
        }

        return true;
    }
});

var PongGameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new PongGameLayer();
        this.addChild(layer);
    }
});

