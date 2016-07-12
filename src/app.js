var sprite_left;
var sprite_right;
var sprite_top;
var sprite_bottom;

var PongGameLayer = cc.Layer.extend({
    
    ctor:function () {
        this._super();

        this.initSprite();
    },

    initSprite:function() {
        var size = cc.winSize;

        // sprite(s) contructor
        sprite_left = new cc.Sprite(res.vertical_png);
        sprite_left.attr({
            x: 40,
            y: size.height / 2
        });
        this.addChild(sprite_left);
        window.sprite_left = sprite_left;

        sprite_right = new cc.Sprite(res.vertical_png);
        sprite_right.attr({
            x: size.width - 40,
            y: size.height / 2
        });
        this.addChild(sprite_right);

        sprite_top = new cc.Sprite(res.horizontal_png);
        sprite_top.attr({
            x: size.width / 2,
            y: size.height - sprite_top.getContentSize().height
        });
        this.addChild(sprite_top);

        sprite_bottom = new cc.Sprite(res.horizontal_png);
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
    }
});

var WALLS_WIDTH = 20;
var X_WALLS_WIDTH = 20;
var Y_WALLS_WIDTH = 1;
var WALLS_ELASTICITY = 1; //0.5;
var WALLS_FRICTION = 1;

var bottomWall;

var winSize;
var space;
var phBody;

var PongGameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new PongGameLayer();
        this.addChild(layer);

        winSize = cc.winSize;
        this.initPhysics();
        this.addWallsAndGround();
        this.addPhysicsCircle();

        this.scheduleUpdate();
    },

    initPhysics:function() {
        space = new cp.Space();
        space.gravity = cp.v(0, 0); //cp.v(0, -800);
        space.iterations = 30;
        space.sleepTimeThreshold = Infinity;
        space.collisionSlop = Infinity;
    },

    addWallsAndGround:function () {
        leftWall = new cp.SegmentShape(space.staticBody, new cp.v(0, 0), new cp.v(0, winSize.height), Y_WALLS_WIDTH);
        leftWall.setElasticity(WALLS_ELASTICITY);
        leftWall.setFriction(WALLS_FRICTION);
        space.addStaticShape(leftWall);
    
        rightWall = new cp.SegmentShape(space.staticBody, new cp.v(winSize.width, winSize.height), new cp.v(winSize.width, 0), Y_WALLS_WIDTH);
        rightWall.setElasticity(WALLS_ELASTICITY);
        rightWall.setFriction(WALLS_FRICTION);
        space.addStaticShape(rightWall);
    
        bottomWall = new cp.SegmentShape(space.staticBody, new cp.v(0, 0), new cp.v(winSize.width, 0), X_WALLS_WIDTH);
        bottomWall.setElasticity(WALLS_ELASTICITY);
        bottomWall.setFriction(WALLS_FRICTION);
        space.addStaticShape(bottomWall);
    
        upperWall = new cp.SegmentShape(space.staticBody, new cp.v(0, winSize.height), new cp.v(winSize.width, winSize.height), X_WALLS_WIDTH);
        upperWall.setElasticity(WALLS_ELASTICITY);
        upperWall.setFriction(WALLS_FRICTION);
        space.addStaticShape(upperWall);
    },

    addPhysicsCircle:function() {
        //#1
        // circle = cc.Sprite.create(res.circle_png);
        mass = 4;
    
        //#2
        // var nodeSize = circle.getContentSize(),
        phNode = cc.PhysicsSprite.create(res.circle_png),
            nodeSize = phNode.getContentSize(),
            phBody = null,
            phShape = null,
            scaleX = 1,
            scaleY = 1;
        nodeSize.width *= scaleX;
        nodeSize.height *= scaleY;
    
        //#3
        phBody = space.addBody(new cp.Body(mass, cp.momentForBox(mass, nodeSize.width, nodeSize.height)));
        phBody.setPos(cc.p(winSize.width * 0.5, winSize.height * 0.5));
        // phBody.applyForce(cp.v(0, 0), cp.v(0, 0));
        phBody.applyImpulse(cp.v(800, -1300), cp.v(0, 0));
    
        //#4
        phShape = space.addShape(new cp.CircleShape(phBody, nodeSize.width * 0.5, cc.p(0, 0)));
        phShape.setFriction(0);
        phShape.setElasticity(1);
    
        //#5
        phNode.setBody(phBody);
        phNode.setRotation(0);
        phNode.setScale(1);
    

        this.addChild(phNode);
    },

    update:function() { // execute 60 times per second (60 fps)
        space.step(1/60); 
    }
});

