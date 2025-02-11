class ThreeDeeObject {
    constructor(scene, x, y, z, spriteKey, hitEffect = null, hitVolume = 1) {

        ThreeDeeObject.player = scene.player;

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.z = z;
        this.sprite = scene.add.sprite(0, 0, spriteKey);
        this.sprite.setDepth(this.z);
        this.sprite.setInteractive();
        this.hitEffect = hitEffect;
        this.hitVolume = hitVolume;
        this.updateVisualPosition();
    }

    update() {
        this.updateVisualPosition();
        if (this.z > this.scene.player.z - 0.1 &&
            !this.scene.player.hasBeenHit &&
            this.scene.player.x > this.x-0.5 &&
            this.scene.player.x < this.x+0.5 &&
            this.scene.player.y > this.y-0.5 &&
            this.scene.player.y < this.y+0.5) {
            this.scene.player.hit();
            if (this.hitEffect !== null) {
                this.scene.sound.add(this.hitEffect).setVolume(this.hitVolume).play();
            }
        }
    }

    destroy() {
        const index = this.scene.objects.indexOf(this);
        if (index !== -1) {
            this.scene.objects.splice(index, 1);
        }
        this.sprite.destroy();
    }

    updateVisualPosition() {
        
        const player = this.scene.player;

        let { x, y, scale } = ThreeDeeObject.ThreeDeeToTwoDee(this.x, this.y, this.z)

        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.setScale(scale);

        let distZ = Math.abs(this.z - this.scene.player.z);
        distZ /= 80;

        distZ = 1 - distZ;

        distZ *= 5;
        if (distZ < 0) distZ = 0;
        if (distZ > 1) distZ = 1;

        this.sprite.setTint(this.scene.dimColor(0xFFFFFF, distZ));
        this.sprite.setAlpha(1 * distZ);
    }

    setX(x) {
        this.x = x;
        this.updateVisualPosition();
    }

    setY(y) {
        this.y = y;
        this.updateVisualPosition();
    }

    setZ(z) {
        this.z = z;
        this.updateVisualPosition();
    }

    static ThreeDeeToTwoDee(x, y, z, pushToEdge = false) {
        const stretch = 3;

        x -= ThreeDeeObject.player.x;
        y -= ThreeDeeObject.player.y;
        z -= ThreeDeeObject.player.z; z *= stretch;
        if (pushToEdge && z > ThreeDeeObject.player.nearClipPlane) {
            z = ThreeDeeObject.player.nearClipPlane;
        }

        const mult = ThreeDeeObject.player.cameraScale;
        const nx = x/-z * mult;
        const ny = y/-z * mult;
        const scale = Math.abs(1/-z)/14.8 * mult;

        return { x: nx, y: ny, scale: scale };
    }
}

class Wall extends ThreeDeeObject {
    constructor(scene, x, y, z) {
        super(scene, x, y, z, "wall1", "bonk", 0.2);
    }
}

class Boogie extends ThreeDeeObject {
    constructor(scene, x, y, z) {
        super(scene, x, y, z, "boogie1", "squelch");
        const boogie = this;
        this.sprite.on('pointerdown', function(pointer) {
            if (!boogie.scene.player.hasBeenHit) {
                boogie.destroy();
            }
        });
        this.moveSpeed = Phaser.Math.FloatBetween(0.01, 0.03);

        this.sprite.anims.play('boogie_animation');
    }

    update() {
        if (this.z > this.scene.player.z - 5) {
            const vecTo = new Phaser.Math.Vector2(this.scene.player.x - this.x, this.scene.player.y - this.y);
            if (vecTo.length() > 0.01) {
                vecTo.normalize();
                vecTo.scale(this.moveSpeed);
                this.x += vecTo.x;
                this.y += vecTo.y;
            }
        } else {
            if (this.rp === undefined || (new Phaser.Math.Vector2(this.rp.x - this.x, this.rp.y - this.y)).length() < 0.1) {
                this.randomPos();
            }
            const vecTo = new Phaser.Math.Vector2(this.rp.x - this.x, this.rp.y - this.y);
            vecTo.normalize();
            vecTo.scale(this.moveSpeed);
            this.x += vecTo.x;
            this.y += vecTo.y;
        }
        super.update();
    }

    randomPos() {
        this.rp = new Phaser.Math.Vector2(this.randomNum(), this.randomNum());
    }

    randomNum() {
        return Phaser.Math.FloatBetween(-this.scene.tunnelWidth/2+0.5, this.scene.tunnelWidth/2-0.5);
    }
}

class DoorButton extends ThreeDeeObject {
    constructor(scene) {
        super(scene, 0, 0, -3, "doorButton");

        const doorButton = this;
        this.sprite.on('pointerdown', function(pointer) {
            const slideSpeed = 0.01;
            doorButton.leftDoor.slide = -slideSpeed;
            doorButton.rightDoor.slide = slideSpeed;
            doorButton.destroy();
            doorButton.scene.player.start();
            doorButton.scene.sound.add('airlock').play();
        });

        this.leftDoor  = new DoorSide(this.scene, 0, 0, this.z - 0.01, "doorLeft");
        this.rightDoor = new DoorSide(this.scene, 0, 0, this.z - 0.01, "doorRight");

        this.scene.objects.push(this.leftDoor);
        this.scene.objects.push(this.rightDoor);
    }

    update() {
        super.update();
        this.leftDoor.update();
    }
}

class DoorSide extends ThreeDeeObject {
    constructor(scene, x, y, z, sprite) {
        super(scene, x, y, z, sprite);
        this.slide = 0;
    }

    update() {
        this.x += this.slide;
        super.update();
    }
}