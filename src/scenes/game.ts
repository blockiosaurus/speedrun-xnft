import * as Phaser from 'phaser';
import { stakeBSOL } from '../utils/blazeStake';
import Player from '../components/player';
import Controls from '../components/controls/controls';

export const HUD_HEIGHT = 48;

export default class GameScene extends Phaser.Scene {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    controls!: Controls;
    player!: Player;
    image!: Phaser.Physics.Arcade.Image;

    constructor() {
        super('game');
    }

    preload() {
        // this.load.image('background', 'assets/background.png');
        this.load.image('BuildingTiles', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/CL_Buildings.png');
        this.load.image('CropTiles', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/CL_Crops_Mining.png');
        this.load.image('MainTiles', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/CL_MainLev.png');
        this.load.tilemapTiledJSON('map', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/Map.json');
        this.load.spritesheet('player', 'https://raw.githubusercontent.com/Bread-Heads-NFT/phaser-solana-platformer-template/master/src/assets/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('icon', 'https://soladex.io/wp-content/uploads/elementor/thumbs/backpack-solana-logo-q31m754a0n12epfgt5dy2hym74ppd20ylpqct4hhao.jpg');
        this.scene.launch('inventory');
    }

    create() {
        // const connection = window.xnft.solana.connection;
        // console.log(connection);
        console.log(window.xnft);
        const width = window.innerWidth;
        const height = window.innerHeight;
        console.log(this);
        console.log(width, height);
        const map = this.make.tilemap({ key: 'map' });
        console.log('map: ', map);
        const mainTiles = map.addTilesetImage('General', 'MainTiles');
        const buildingTiles = map.addTilesetImage('Buildings', 'BuildingTiles');
        console.log('tilesets: ', map.tilesets);

        this.cameras.main.setBackgroundColor('#000000')
        this.cameras.main.fadeIn()
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setSize(this.cameras.main.width, this.cameras.main.height - HUD_HEIGHT)
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // this.input.addPointer(1);
        // this.cursors = this.input.keyboard!.createCursorKeys();

        // this.image = this.physics.add.image(0, 0, 'icon').setOrigin(0, 0).setDisplaySize(64, 64);
        // this.image.setVelocity(Math.random() * 2000 - 10, Math.random() * 2000 - 10);

        // this.physics.add.image(width / 2, height / 2, 'dirt').setInteractive();
        // this.input.on('gameobjectdown', (pointer: Phaser.Input.Pointer, gameObject: Phaser.Physics.Arcade.Image) => {
        //     // console.log(pointer);
        //     // console.log(gameObject);
        //     stakeBSOL(window.xnft.solana.publicKey).then((info) => {
        //         this.physics.add.image(width / 2, height / 2, 'crop').setInteractive();
        //     });
        // }, this);

        const groundLayer = map.createLayer(0, [mainTiles!, buildingTiles!], 0, 0);
        const cropsLayer = map.createLayer(1, [mainTiles!, buildingTiles!], 0, 0);
        const obstaclesLayer = map.createLayer(2, [mainTiles!, buildingTiles!], 0, 0);
        const interactableLayer = map.createLayer(3, [mainTiles!, buildingTiles!], 0, 0);
        this.player = new Player(this, map.widthInPixels/2, map.heightInPixels/2, "player");
        // this.controls = new Controls(this);

        map.setCollisionByExclusion([], true, false, obstaclesLayer!);
        this.physics.add.collider(this.player, obstaclesLayer!);
        // console.log(layer);

        this.cameras.main.startFollow(this.player);

        interactableLayer?.setInteractive();
        this.input.on('gameobjectdown', (pointer: Phaser.Input.Pointer, gameObject: Phaser.Physics.Arcade.Image) => {
            console.log(gameObject);
            stakeBSOL(window.xnft.solana.publicKey).then((info) => {console.log("Done")});
        }, this);
    }

    update() {
        this.player.update();
    }
}