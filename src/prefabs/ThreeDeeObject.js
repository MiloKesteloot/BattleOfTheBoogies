class ThreeDeeObject {
    constructor(scene, x, y, z, spriteKey) {

        ThreeDeeObject.player = scene.player;

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.z = z;
        this.sprite = scene.add.sprite(0, 0, spriteKey);
        this.sprite.setDepth(this.z);
        this.sprite.setInteractive();
        this.updateVisualPosition();
    }

    update() {
        this.updateVisualPosition();
        if (this.z > this.scene.player.z - 0.1) {
            if (this.scene.player.x > this.x-0.5 &&
                this.scene.player.x < this.x+0.5 &&
                this.scene.player.y > this.y-0.5 &&
                this.scene.player.y < this.y+0.5) {
                this.scene.player.hit();
                console.log(this)
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
        super(scene, x, y, z, "wall1");
    }
}

class Boogie extends ThreeDeeObject {
    constructor(scene, x, y, z) {
        super(scene, x, y, z, "boogie1");
        const boogie = this;
        this.sprite.on('pointerdown', function(pointer) {
            if (!boogie.scene.player.hasBeenHit) {
                boogie.destroy();
            }
        });
        this.moveSpeed = Phaser.Math.FloatBetween(0.01, 0.03);
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
        this.rp = new Phaser.Math.Vector2(Phaser.Math.FloatBetween(-this.scene.tunnelWidth/2, this.scene.tunnelWidth/2), Phaser.Math.Between(-this.scene.tunnelWidth/2, this.scene.tunnelWidth/2));
    }
}
