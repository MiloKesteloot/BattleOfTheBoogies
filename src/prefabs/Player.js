class Player {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.z = z;
        this.lastZ = z;
        this.moveSpeed = 0.02;
        this.progressSpeed = 0.02;
        this.nearClipPlane = -0.001;
        this.cameraScale = 1;

        this.shipWidth = 0.8;
    }

    update() {
        this.cameraScale = Math.max(this.scene.sys.game.canvas.width, this.scene.sys.game.canvas.height) * 1;

        const flyDirection = new Phaser.Math.Vector2(0, 0);
        if (this.keyFlyLeft()) flyDirection.x -= 1;
        if (this.keyFlyRight()) flyDirection.x += 1;
        if (this.keyFlyUp()) flyDirection.y -= 1;
        if (this.keyFlyDown()) flyDirection.y += 1;
        if (flyDirection.length() != 0) flyDirection.normalize();
        flyDirection.scale(this.moveSpeed);
        this.x += flyDirection.x;
        this.y += flyDirection.y;


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