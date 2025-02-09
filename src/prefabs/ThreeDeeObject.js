class ThreeDeeObject {
    constructor(scene, x, y, z, spriteKey) {

        ThreeDeeObject.player = scene.player;

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.z = z;
        this.sprite = scene.add.sprite(0, 0, spriteKey);
        this.sprite.setDepth(this.z);
        this.updateVisualPosition();
    }

    update() {
        this.updateVisualPosition();
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
        this.sprite.setInteractive();
        this.sprite.on('pointerdown', function(pointer) {
            this.destroy();
        });
    }

    update() {
        // TODO make it move around
        super.update();
    }
}