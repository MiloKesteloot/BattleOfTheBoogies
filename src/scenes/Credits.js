class Credits extends Phaser.Scene {
    constructor() {
        super('creditsScene');
    }

    create() {
        this.cameras.main.scrollX = -this.cameras.main.width / 2;
        this.cameras.main.scrollY = -this.cameras.main.height / 2;

        const tintGraphics = this.add.graphics();
        tintGraphics.clear();
        tintGraphics.fillStyle(0x444444, this.tintPrecent);
        tintGraphics.fillRect(-this.sys.game.canvas.width/2, -this.sys.game.canvas.height/2, this.sys.game.canvas.width, this.sys.game.canvas.height);

        this.add.text(0, 0, 'CREDITS\n\nProgramming: Milo Kesteloot\nArt: Milo Kesteloot\nScore Font: u/IdealNarrow on Reddit\nSound: Pixabay\nMusic: FakesFate on looperman.com\n\nESC to return', {
            fontFamily: 'picoo',
            fontSize: '64px',
            color: '#ff0000'
        }).setOrigin(0.5, 0.5).setDepth(2)

        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.ESCKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    }

    update(_, dt) {
        if (Phaser.Input.Keyboard.JustDown(this.keys.ESCKey)) {
            this.scene.start('playScene');
        }
    }
}
