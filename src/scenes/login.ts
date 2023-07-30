import { Program } from '@coral-xyz/anchor';
import * as Phaser from 'phaser';
import { fetchFarm, getProgram, initFarm } from '../utils/speedrunProgram';
import { getWalletAddress, isXNFT } from '../utils/solana';

export default class LoginScene extends Phaser.Scene {
    hasFarm: boolean = false;
    bottomText!: Phaser.GameObjects.Text;
    program!: Program;
    fetched: boolean = false;

    constructor() {
        super({ key: 'login' });
    }

    preload() {
        // this.load.image('background', 'assets/background.png');
        this.load.image('BuildingTiles', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/CL_Buildings.png');
        this.load.image('CropTiles', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/CL_Crops_Mining.png');
        this.load.image('MainTiles', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/CL_MainLev.png');
        this.load.image('dirt', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/dirt.png');
        this.load.image('wet_dirt', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/wet_dirt.png');
        this.load.image('plant', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/plant.png');
        this.load.image('blaze', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/blaze.png');
        this.load.image('bonk', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/bonk.png');
        this.load.image('laine', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/laine.png');
        this.load.tilemapTiledJSON('map', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/Map.json');
        this.load.spritesheet('player', 'https://raw.githubusercontent.com/Bread-Heads-NFT/phaser-solana-platformer-template/master/src/assets/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.tilemapTiledJSON('house', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/House.json');
        this.load.image('buildBed', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/BuildBed.png');
        this.load.image('buildBench', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/BuildBench.png');
        this.load.image('bed', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/Bed.png');
        this.load.image('bench', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/Bench.png');
        this.load.image('bomb', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/bomb.png');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.cameras.main.setBackgroundColor('#d8f8ff')
        this.cameras.main.fadeIn()

        this.add.text(width / 2, height / 3, 'Welcome to Honeypot Fields!', { fontFamily: 'Monospace', fontSize: 48, color: '#000000', align: "center", wordWrap: { width } })
            .setOrigin(0.5, 0.5);

        this.add.text(width / 2, 2 * height / 3, 'The digital frontier of Defi meets the natural rhythm of a the farm life.', { fontFamily: 'Monospace', fontSize: 24, color: '#000000', align: "center", wordWrap: { width } })
            .setOrigin(0.5, 0.5);

        this.bottomText = this.add.text(width / 2, 3 * height / 4, 'Loading...', { fontFamily: 'Monospace', fontSize: 12, color: '#000000', align: "center", wordWrap: { width } })
            .setOrigin(0.5, 0.5);

        this.program = getProgram();

        console.log(isXNFT())
        if (!isXNFT()) {
            window.phantom.solana.connect();
            // while (!window.phantom.solana.isConnected);
        }

        // while (getWalletAddress() === null);

        // fetchFarm(this.program).then((farm) => {
        //     console.log(farm);

        //     if (farm.length > 0) {
        //         this.hasFarm = true;
        //         this.bottomText.setText('Click anywhere to continue farming');

        //         this.input.on('pointerdown', () => {
        //             this.scene.start('game');
        //         });
        //     } else {
        //         this.hasFarm = false;
        //         this.bottomText.setText('Click anywhere to initialize your farm');

        //         this.input.on('pointerdown', () => {
        //             initFarm(this.program);
        //             this.scene.start('game');
        //         });
        //     }
        // });
    }

    update() {
        // console.log(window.phantom.solana.isConnected)
        if (window.phantom.solana.isConnected && !this.fetched) {
            this.fetched = true;
            fetchFarm(this.program).then((farm) => {
                console.log(farm);

                if (farm.length > 0) {
                    this.hasFarm = true;
                    this.bottomText.setText('Click anywhere to continue farming');

                    this.input.on('pointerdown', () => {
                        this.scene.start('game');
                    });
                } else {
                    this.hasFarm = false;
                    this.bottomText.setText('Click anywhere to initialize your farm');

                    this.input.on('pointerdown', () => {
                        initFarm(this.program);
                        this.scene.start('game');
                    });
                }
            });
        }
    }
}