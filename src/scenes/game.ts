import * as Phaser from 'phaser';
import { stakeBSOL } from '../utils/blazeStake';
import Player from '../components/player';
import Controls from '../components/controls/controls';
import EventsCenter from '../components/eventCenter';
import { Program } from '@coral-xyz/anchor';
import { fetchCrops, getProgram, plantCrop, harvestCrop, updateCrop, Growth } from '../utils/speedrunProgram';

export const HUD_HEIGHT = 64;
const UPDATE_PERIOD = 10000;

export default class GameScene extends Phaser.Scene {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    controls!: Controls;
    player!: Player;
    image!: Phaser.Physics.Arcade.Image;
    activeItem: string | null = null;
    plots: Map<string, Phaser.GameObjects.Image[]> = new Map();
    program!: Program;
    lastUpdate = 0;
    map!: Phaser.Tilemaps.Tilemap;

    constructor() {
        super('game');
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
        this.map = this.make.tilemap({ key: 'map' });
        console.log('map: ', this.map);
        const mainTiles = this.map.addTilesetImage('General', 'MainTiles');
        const buildingTiles = this.map.addTilesetImage('Buildings', 'BuildingTiles');
        console.log('tilesets: ', this.map.tilesets);

        this.cameras.main.setBackgroundColor('#000000')
        this.cameras.main.fadeIn()
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setSize(this.cameras.main.width, this.cameras.main.height - HUD_HEIGHT)
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

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

        const groundLayer = this.map.createLayer(0, [mainTiles!, buildingTiles!], 0, 0);
        const cropsLayer = this.map.createLayer(1, [mainTiles!, buildingTiles!], 0, 0);
        const obstaclesLayer = this.map.createLayer(2, [mainTiles!, buildingTiles!], 0, 0);
        const interactableLayer = this.map.createLayer(3, [mainTiles!, buildingTiles!], 0, 0);
        this.player = new Player(this, this.map.widthInPixels / 2, this.map.heightInPixels / 2, "player");
        // this.controls = new Controls(this);

        this.map.setCollisionByExclusion([], true, false, obstaclesLayer!);
        this.physics.add.collider(this.player, obstaclesLayer!);
        // console.log(layer);

        this.cameras.main.startFollow(this.player);

        this.program = getProgram();

        groundLayer?.setInteractive();
        this.input.on('gameobjectdown', (pointer: Phaser.Input.Pointer, gameObject: Phaser.Physics.Arcade.Image) => {
            const tileX = this.map.worldToTileX(pointer.worldX + 24) as number;
            const tileY = this.map.worldToTileY(pointer.worldY + 24) as number;
            const posString = `${tileX},${tileY}`;
            console.log(tileX, tileY);
            const obstacle = this.map.getTileAt(tileX, tileY, false, obstaclesLayer!);
            const obstacleUp = this.map.getTileAt(tileX, tileY - 1, false, obstaclesLayer!);
            const seeds = ["solBlazePacket", "laineSolPacket", "bonkPacket"]
            const plotExists = this.plots.has(posString);
            console.log(plotExists, this.activeItem);
            if (!obstacle && !obstacleUp && !plotExists && this.activeItem && seeds.includes(this.activeItem)) {
                // let plot = this.add.image(this.map.tileToWorldX(tileX)!, this.map.tileToWorldY(tileY)!, 'dirt');
                // this.plots.set(posString, [plot]);
                plantCrop(this.program, this.activeItem, tileX, tileY);
            } else if (plotExists) {
                if (this.activeItem && this.activeItem === "scythe") {
                    // this.plots.get(posString)?.destroy();
                    // this.plots.delete(posString);
                    const cropType = this.plots.get(posString)?.at(2)?.texture.key;
                    harvestCrop(this.program, cropType!);
                } else if (this.activeItem && this.activeItem === "wateringCan") {
                    // this.plots.get(posString)?.destroy();
                    // this.plots.delete(posString);
                    // let plot = this.add.image(this.map.tileToWorldX(tileX)!, this.map.tileToWorldY(tileY)!, 'wet_dirt');
                    // this.plots.set(posString, plot);
                    this.plots.get(posString)?.at(0)?.setTexture('wet_dirt');
                    const cropType = this.plots.get(posString)?.at(2)?.texture.key;
                    updateCrop(this.program, cropType!);
                }
            }
            console.log(this.plots);
        }, this);
        EventsCenter.on('select-item', this.updateItem, this);
    }

    update(time: number, delta: number) {
        this.player.update();

        if ((time - this.lastUpdate) > UPDATE_PERIOD) {
            this.lastUpdate = time;
            fetchCrops(this.program).then((crops) => {
                console.log(crops);

                let newPlots: string[] = [];

                for (const crop of crops) {
                    const posString = `${crop.tileX},${crop.tileY}`;
                    newPlots.push(posString);
                    const plotExists = this.plots.has(posString);
                    if (!plotExists) {
                        let plot = this.add.image(this.map.tileToWorldX(crop.tileX)!, this.map.tileToWorldY(crop.tileY)!, 'dirt');
                        let plant = this.add.image(this.map.tileToWorldX(crop.tileX)!, this.map.tileToWorldY(crop.tileY)!, 'plant');
                        let fruit = this.add.image(this.map.tileToWorldX(crop.tileX)!, this.map.tileToWorldY(crop.tileY)!, crop.type);
                        this.plots.set(posString, [plot, plant, fruit]);
                        EventsCenter.emit("planted", crop.type);
                    } else {
                        if (crop.growth == Growth.BULL) {
                            this.plots.get(posString)?.at(1)?.setTint(0x00ff00);
                        } else if (crop.growth == Growth.BEAR) {
                            this.plots.get(posString)?.at(1)?.setTint(0xff0000);
                        } else {
                            this.plots.get(posString)?.at(1)?.clearTint();
                        }
                    }
                }

                for (const [posString, plot] of this.plots) {
                    if (!newPlots.includes(posString)) {
                        const cropType = plot[2].texture.key;
                        plot[0].destroy();
                        plot[1].destroy();
                        plot[2].destroy();
                        this.plots.delete(posString);
                        EventsCenter.emit("harvested", cropType);
                    }
                }
            });
        }
    }

    updateItem(item: string | null) {
        console.log(item)
        this.activeItem = item;
    }
}