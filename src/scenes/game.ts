import * as Phaser from 'phaser';
import { stakeBSOL } from '../utils/blazeStake';
// import Player from '../components/player';
// import Controls from '../components/controls/controls';

export default class GameScene extends Phaser.Scene {
    // cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    // controls: Controls;
    // player: Player;
    image!: Phaser.Physics.Arcade.Image;

    constructor() {
        super('game');
    }

    preload() {
        // this.load.image('background', 'assets/background.png');
        // this.load.image('tiles', 'assets/tiles.png');
        // this.load.tilemapTiledJSON('map', 'assets/map.json');
        // this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });
        // this.load.image('controls', 'assets/controls.png');
        this.load.image('icon', 'https://soladex.io/wp-content/uploads/elementor/thumbs/backpack-solana-logo-q31m754a0n12epfgt5dy2hym74ppd20ylpqct4hhao.jpg');
        this.load.image('dirt', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/dirt.png');
        this.load.image('crop', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/crop.png');
    }

    create() {
        // const connection = window.xnft.solana.connection;
        // console.log(connection);
        console.log(window.xnft);
        const width = window.innerWidth;
        const height = window.innerHeight;
        console.log(this);
        console.log(width, height);
        // const map = this.make.tilemap({ key: 'map' });
        // map.setCollision([496, 497, 498, 499]);
        // console.log('map: ', map);
        // const tiles = map.addTilesetImage('Kenney', 'tiles');
        // console.log('tilesets: ', map.tilesets);

        this.cameras.main.setBackgroundColor('#000000')
        this.cameras.main.fadeIn()

        // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // this.input.addPointer(1);
        // this.cursors = this.input.keyboard!.createCursorKeys();

        this.image = this.physics.add.image(0, 0, 'icon').setOrigin(0, 0).setDisplaySize(64, 64);
        this.image.setVelocity(Math.random() * 2000 - 10, Math.random() * 2000 - 10);

        this.physics.add.image(width / 2, height / 2, 'dirt').setInteractive();
        this.input.on('gameobjectdown', (pointer: Phaser.Input.Pointer, gameObject: Phaser.Physics.Arcade.Image) => {
            // console.log(pointer);
            // console.log(gameObject);
            stakeBSOL(window.xnft.solana.publicKey).then((info) => {
                this.physics.add.image(width / 2, height / 2, 'crop').setInteractive();
            });
        }, this);

        // const layer = map.createLayer(0, tiles!, 0, 0);
        // this.player = new Player(this, 100, 100);
        // this.controls = new Controls(this);

        // this.physics.add.collider(this.player, layer!);
        // console.log(layer);

        // this.cameras.main.startFollow(this.player);
    }

    update() {
        if (this.image.x < 0) {
            this.image.setVelocityX(Math.random() * 2000);
        } else if (this.image.x > this.sys.canvas.width - this.image.width) {
            this.image.setVelocityX(-Math.random() * 2000);
        }
        if (this.image.y < 0) {
            this.image.setVelocityY(Math.random() * 2000);
        } else if (this.image.y > this.sys.canvas.height - this.image.height) {
            this.image.setVelocityY(-Math.random() * 2000);
        }
        // this.player.update(this.cursors, this.controls);
        // this.controls.update();
    }
}