class Play extends Phaser.Scene {
    constructor() {
        super('playScene');

        this.tunnelWidth = 5;

        this.wallTimer = 10;
    }

    preload() {
        this.load.path = './assets/img/';
        this.load.image('boogie1', 'boogie1.png');
        this.load.image('wall1', 'wall1.png');
        this.load.image('target', 'target.png');
    }

    create() {

        this.target = this.add.sprite(this.getMouseX(), this.getMouseY(), 'target');
        this.target.setScale(9);

        this.graphics = this.add.graphics();
        this.graphics.setDepth(-Infinity);

        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keys.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.keys.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.keys.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)

        this.player = new Player(this, 0, 0, 0);
        this.objects = [];

        // for (let i = 0; i < this.tunnelWidth; i++) {
        //     for (let j = 0; j < this.tunnelWidth; j++) {
        //         this.objects.push(new ThreeDeeObject(this, i-Math.floor(this.tunnelWidth/2), j-Math.floor(this.tunnelWidth/2), -i - j, "boogie1"));
        //     }
        // }

        for (let i = 0; i < this.tunnelWidth; i++) {
            for (let j = 0; j < this.tunnelWidth; j++) {
                if (i < 1 || i > 2 || j < 1 || j > 2) {
                    this.objects.push(new ThreeDeeObject(this, i-Math.floor(this.tunnelWidth/2), j-Math.floor(this.tunnelWidth/2), -10, "wall1"));
                }
            }
        }

        for (let i = 0; i < this.tunnelWidth; i++) {
            for (let j = 0; j < this.tunnelWidth; j++) {
                if (i > 0) {
                    this.objects.push(new ThreeDeeObject(this, i-Math.floor(this.tunnelWidth/2), j-Math.floor(this.tunnelWidth/2), -15, "wall1"));
                }
            }
        }

        // this.objects.push(new ThreeDeeObject(this, 0, 0, -5, "wall1"));
        // this.objects.push(new ThreeDeeObject(this, 1, 0, -5, "wall1"));

    }

    update() {

        this.cameras.main.scrollX = -this.cameras.main.width / 2;
        this.cameras.main.scrollY = -this.cameras.main.height / 2;

        this.player.update();
        
        this.objects.forEach(object => {
            if (object.z - this.player.z > this.player.nearClipPlane) {
                object.destroy();
            }
        });
        this.objects.forEach(object => object.update());

        this.drawWalls();

        this.spawnObsticals();

        this.target.x = this.getMouseX();
        this.target.y = this.getMouseY();
    }

    spawnObsticals() {
        if (this.player.lastZ%1 < this.player.z%1) {
            this.wallTimer--;
        }
        if (this.wallTimer === 0) {
            this.wallTimer = Phaser.Math.Between(5, 10);

            if (Phaser.Math.Between(0, 1) === 0) {

                const x1 = Phaser.Math.Between(0, this.tunnelWidth);
                const y1 = Phaser.Math.Between(0, this.tunnelWidth);
                const x2 = Phaser.Math.Between(0, this.tunnelWidth);
                const y2 = Phaser.Math.Between(0, this.tunnelWidth);

                


                for (let i = 0; i < this.tunnelWidth; i++) {
                    for (let j = 0; j < this.tunnelWidth; j++) {
                        if (i < Math.min(x1,x2) || i > Math.max(x1,x2) || j < Math.min(y1,y2) || j > Math.max(y1,y2)) {
                            this.objects.push(new ThreeDeeObject(this, i-Math.floor(this.tunnelWidth/2), j-Math.floor(this.tunnelWidth/2), this.player.z-41*2, "wall1"));
                        }
                    }
                }
            } else {
                const x1 = Phaser.Math.Between(0, this.tunnelWidth);
                const y1 = Phaser.Math.Between(0, this.tunnelWidth);

                this.objects.push(new ThreeDeeObject(this, i-Math.floor(this.tunnelWidth/2), j-Math.floor(this.tunnelWidth/2), this.player.z-41*2, "wall1"));
            }
        }
    }

    drawWalls() {
        this.graphics.clear();
  
        const height = this.tunnelWidth;
        const length = 41;

        // for (let i = 0; i < length; i++) {

        let stretch = 2;

        let color = 0x2b0042;

        let zs = [];

        for (let i = 0; i < length; i++) {
            zs.push(-(i*stretch -Math.floor(this.player.z/stretch)*stretch));
        }

        for (let i = zs.length-1; i >= 0; i--) {
            let z = zs[i];

            this.graphics.lineStyle(2, this.dimColor(color, 1 - (i / length)));

            {
                const p1 = ThreeDeeObject.ThreeDeeToTwoDee(height/2, height/2, z);
                const p2 = ThreeDeeObject.ThreeDeeToTwoDee(height/2,-height/2, z);
                this.graphics.lineBetween(p1.x, p1.y, p2.x, p2.y);
            }
            {
                const p1 = ThreeDeeObject.ThreeDeeToTwoDee(-height/2, height/2, z);
                const p2 = ThreeDeeObject.ThreeDeeToTwoDee(-height/2,-height/2, z);
                this.graphics.lineBetween(p1.x, p1.y, p2.x, p2.y);
            }
            {
                const p1 = ThreeDeeObject.ThreeDeeToTwoDee( height/2, height/2, z);
                const p2 = ThreeDeeObject.ThreeDeeToTwoDee(-height/2, height/2, z);
                this.graphics.lineBetween(p1.x, p1.y, p2.x, p2.y);
            }
            {
                const p1 = ThreeDeeObject.ThreeDeeToTwoDee(-height/2,-height/2, z);
                const p2 = ThreeDeeObject.ThreeDeeToTwoDee( height/2,-height/2, z);
                this.graphics.lineBetween(p1.x, p1.y, p2.x, p2.y);
            }

            for (let j = 0; j < height+1; j++) {
                {
                    const p1 = ThreeDeeObject.ThreeDeeToTwoDee( height/2 - j, height/2, z);
                    const p2 = ThreeDeeObject.ThreeDeeToTwoDee( height/2 - j, height/2, z+stretch, true);
                    this.graphics.lineBetween(p1.x, p1.y, p2.x, p2.y);
                }
                {
                    const p1 = ThreeDeeObject.ThreeDeeToTwoDee( height/2 - j,-height/2, z);
                    const p2 = ThreeDeeObject.ThreeDeeToTwoDee( height/2 - j,-height/2, z+stretch, true);
                    this.graphics.lineBetween(p1.x, p1.y, p2.x, p2.y);
                }
                if (j !== 0 && j !== height) {
                    {
                        const p1 = ThreeDeeObject.ThreeDeeToTwoDee( height/2, height/2 - j, z);
                        const p2 = ThreeDeeObject.ThreeDeeToTwoDee( height/2, height/2 - j, z+stretch, true);
                        this.graphics.lineBetween(p1.x, p1.y, p2.x, p2.y);
                    }
                    {
                        const p1 = ThreeDeeObject.ThreeDeeToTwoDee(-height/2, height/2 - j, z);
                        const p2 = ThreeDeeObject.ThreeDeeToTwoDee(-height/2, height/2 - j, z+stretch, true);
                        this.graphics.lineBetween(p1.x, p1.y, p2.x, p2.y);
                    }

                }
            }
        }
    }

    getMouseX() {
        return this.input.mousePointer.x - this.sys.game.canvas.width/2;
    }

    getMouseY() {
        return this.input.mousePointer.y - this.sys.game.canvas.height/2;
    }

    // TODO PA
    dimColor(color, factor) {
        // Extract RGB components
        let r = (color >> 16) & 255;
        let g = (color >> 8) & 255;
        let b = color & 255;
    
        // Dim each component
        r = Math.round(r * factor);
        g = Math.round(g * factor);
        b = Math.round(b * factor);
    
        // Recombine into a single value
        return (r << 16) | (g << 8) | b;
    }
}
