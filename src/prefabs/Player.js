class Player {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.xVel = 0;
        this.yVel = 0;
        this.x = x;
        this.y = y;
        this.z = z;
        this.lastZ = z;
        this.moveSpeed = 0.001;
        this.stopSpeed = 0.001;
        this.maxSpeed = 0.02;
        this.progressSpeed = 0.04;
        this.nearClipPlane = -0.001;
        this.cameraScale = 1;

        this.shipWidth = 0.8;

        this.hasBeenHit = false;
        this.tintGraphics = this.scene.add.graphics();
    }

    hit() {
        if (this.hasBeenHit) return;
        this.hasBeenHit = true;
        this.tintGraphics.fillStyle(0xff0000, 0.5);
        this.tintGraphics.fillRect(-this.scene.sys.game.canvas.width/2, -this.scene.sys.game.canvas.height/2, this.scene.sys.game.canvas.width, this.scene.sys.game.canvas.height);
    }

    update() {
        this.cameraScale = Math.max(this.scene.sys.game.canvas.width, this.scene.sys.game.canvas.height) * 1;

        if (this.keyFlyLeft()) this.xVel -= this.moveSpeed;
        if (this.keyFlyRight()) this.xVel += this.moveSpeed;
        if (this.keyFlyUp()) this.yVel -= this.moveSpeed;
        if (this.keyFlyDown()) this.yVel += this.moveSpeed;

        if (this.xVel > this.maxSpeed) this.xVel = this.maxSpeed;
        if (this.xVel <-this.maxSpeed) this.xVel =-this.maxSpeed;
        if (this.yVel > this.maxSpeed) this.yVel = this.maxSpeed;
        if (this.yVel <-this.maxSpeed) this.yVel =-this.maxSpeed;

        if (this.xVel > 0 && !this.keyFlyRight()) {
            this.xVel -= this.stopSpeed;
            if (this.xVel < 0) this.xVel = 0;
        }
        if (this.xVel < 0 && !this.keyFlyLeft()) {
            this.xVel += this.stopSpeed;
            if (this.xVel > 0) this.xVel = 0;
        }
        if (this.yVel > 0 && !this.keyFlyDown()) {
            this.yVel -= this.stopSpeed;
            if (this.yVel < 0) this.yVel = 0;
        }
        if (this.yVel < 0 && !this.keyFlyUp()) {
            this.yVel += this.stopSpeed;
            if (this.yVel > 0) this.yVel = 0;
        }

        this.x += this.xVel;
        this.y += this.yVel;


        const tunnelWidth = this.scene.tunnelWidth/2 - this.shipWidth/2;

        if (this.x < -tunnelWidth) {
            this.x = -tunnelWidth
        }
        if (this.x > tunnelWidth) {
            this.x = tunnelWidth
        }
        if (this.y < -tunnelWidth) {
            this.y = -tunnelWidth
        }
        if (this.y > tunnelWidth) {
            this.y = tunnelWidth
        }

        this.lastZ = this.z;

        if (!this.keyFlyForward()) {
            this.z -= this.progressSpeed;
        }
        if (this.keyFlyBackward()) {
            this.z += this.progressSpeed;
        }
    }

    keyFlyLeft() { return this.scene.keys.left.isDown || this.scene.keys.AKey.isDown; }
    keyFlyRight() { return this.scene.keys.right.isDown || this.scene.keys.DKey.isDown; }
    keyFlyUp() { return this.scene.keys.up.isDown || this.scene.keys.WKey.isDown; }
    keyFlyDown() { return this.scene.keys.down.isDown || this.scene.keys.SKey.isDown; }
    keyFlyForward() { return this.scene.keys.space.isDown; }
    keyFlyBackward() { return this.scene.keys.shift.isDown; }
}