class Play extends Phaser.Scene {
    constructor() {
        super('playScene');

        this.tunnelWidth = 5;

        this.wallTimer = -10;

        this.timeCounter = 0;

        this.updateRate = 1/180;
    }

    preload() {
        this.load.path = './assets/img/';
        this.load.spritesheet('boogie1', 'boogie1.png', {
            frameWidth: 15,
            frameHeight: 15,
            startFrame: 0,
            endFrame: 1
        })
        this.load.image('wall1', 'wall1.png');
        this.load.image('target', 'target.png');

        this.load.image('doorButton', 'doorButton.png');
        this.load.image('doorLeft', 'doorLeft.png');
        this.load.image('doorRight', 'doorRight.png');

        this.load.path = './assets/sfx/';
        this.load.audio('backgroundMusic', 'music.wav');
    }

    create() {

        this.backgroundMusic = this.sound.add("backgroundMusic");
        this.backgroundMusic.setLoop(true);
        this.backgroundMusic.setVolume(0.4);
        this.backgroundMusic.play();

        this.anims.create({
            key: 'boogie_animation',
            frames: this.anims.generateFrameNumbers('boogie1', { start: 0, end: 1, first: 0}),
            frameRate: 4,
            repeat: -1,
        });

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
        ThreeDeeObject.player = this.player;
        this.objects = [];
        this.objects.push(new DoorButton(this));

        // for (let i = 0; i < this.tunnelWidth; i++) {
        //     for (let j = 0; j < this.tunnelWidth; j++) {
        //         this.objects.push(new ThreeDeeObject(this, i-Math.floor(this.tunnelWidth/2), j-Math.floor(this.tunnelWidth/2), -i - j, "boogie1"));
        //     }
        // }

      
        

        // this.objects.push(new ThreeDeeObject(this, 0, 0, -5, "wall1"));
        // this.objects.push(new ThreeDeeObject(this, 1, 0, -5, "wall1"));

    }

    update(_, dt) {
        dt /= 1000;

        this.timeCounter += dt;

        this.cameras.main.scrollX = -this.cameras.main.width / 2;
        this.cameras.main.scrollY = -this.cameras.main.height / 2;

        while (this.timeCounter >= this.updateRate) {

            this.updateRate -= 0.0000001;

            this.timeCounter -= this.updateRate;
        
            this.player.update();
            
            this.objects.forEach(object => {
                if (object.z - this.player.z > this.player.nearClipPlane) {
                    object.destroy();
                }
            });
            this.objects.forEach(object => object.update());
            this.spawnObsticals();
        }

        this.drawWalls();

        this.target.x = this.getMouseX();
        this.target.y = this.getMouseY();
    }

    spawnObsticals() {
        if (this.wallTimer > this.player.z - 41*2) { // 
            this.wallTimer -= Phaser.Math.Between(7, 12);

            if (Phaser.Math.Between(0, 1) === 0) {

                const x1 = Phaser.Math.Between(0, this.tunnelWidth-1);
                const y1 = Phaser.Math.Between(0, this.tunnelWidth-1);
                const x2 = Phaser.Math.Between(0, this.tunnelWidth-1);
                const y2 = Phaser.Math.Between(0, this.tunnelWidth-1);

                


                for (let i = 0; i < this.tunnelWidth; i++) {
                    for (let j = 0; j < this.tunnelWidth; j++) {
                        if (i < Math.min(x1,x2) || i > Math.max(x1,x2) || j < Math.min(y1,y2) || j > Math.max(y1,y2)) {
                            this.objects.push(new Wall(this, i-Math.floor(this.tunnelWidth/2), j-Math.floor(this.tunnelWidth/2), this.wallTimer));
                        }
                    }
                }
            } else {
                for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
                    const x1 = Phaser.Math.Between(0, this.tunnelWidth-1);
                    const y1 = Phaser.Math.Between(0, this.tunnelWidth-1);

                    const boogie = new Boogie(this, x1-Math.floor(this.tunnelWidth/2), y1-Math.floor(this.tunnelWidth/2), this.wallTimer);
                    this.objects.push(boogie);
                }
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
