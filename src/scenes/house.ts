import * as Phaser from 'phaser';
import { HUD_HEIGHT } from './game';
import Player from '../components/player';
import { Program } from '@coral-xyz/anchor';
import { buildBed, buildBench, closeFarm, fetchFarm, getProgram } from '../utils/speedrunProgram';

const UPDATE_PERIOD = 1000;

export default class HouseScene extends Phaser.Scene {
    map!: Phaser.Tilemaps.Tilemap;
    player!: Player;
    program!: Program;
    bed!: Phaser.GameObjects.Image;
    bench!: Phaser.GameObjects.Image;
    lastUpdate = 0;
    numClicks = 0;

    constructor() {
        super({ key: 'house' });
    }

    preload() {
    }

    create() {
        this.map = this.make.tilemap({ key: 'house' });
        const buildingTiles = this.map.addTilesetImage('Buildings', 'BuildingTiles');

        this.cameras.main.setZoom(1.5);
        this.cameras.main.setBackgroundColor('#000000')
        this.cameras.main.fadeIn()
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setSize(this.cameras.main.width, this.cameras.main.height - HUD_HEIGHT)
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        const groundLayer = this.map.createLayer(0, [buildingTiles!], 0, 0);
        const obstaclesLayer = this.map.createLayer(1, [buildingTiles!], 0, 0);
        this.player = new Player(this, this.map.widthInPixels / 2, this.map.heightInPixels / 2, "player");

        this.map.setCollisionByExclusion([], true, false, obstaclesLayer!);
        this.physics.add.collider(this.player, obstaclesLayer!);

        this.cameras.main.startFollow(this.player);

        this.program = getProgram();

        fetchFarm(this.program).then((farm) => {
            console.log(farm);
            if (farm.length > 0) {
                this.drawItems(farm[0].account.hasBed as boolean, farm[0].account.hasBench as boolean);
            }
        });

        this.add.image(this.cameras.main.width/2, 48, 'bomb').setOrigin(0.5, 0).setInteractive().on('pointerdown', () => {
            this.numClicks++;
            if (this.numClicks > 5) {
                closeFarm(this.program);
                this.scene.start('login');
            }
        });
    }

    update(time: number, delta: number) {
        this.player.update();

        if (this.player.y > this.map.heightInPixels - 40) {
            this.scene.start('game');
        }

        if (time > this.lastUpdate + UPDATE_PERIOD) {
            this.lastUpdate = time;
            fetchFarm(this.program).then((farm) => {
                console.log(farm);
                if (farm.length > 0) {
                    this.updateItems(farm[0].account.hasBed as boolean, farm[0].account.hasBench as boolean);
                }
            });
        }
    }

    drawItems(bed: boolean, bench: boolean) {
        console.log(bed, bench);
        if (!bed) {
            this.bed = this.add.image(48, 48, 'buildBed').setOrigin(0, 0).setInteractive();
            this.bed.on('pointerdown', () => {
                console.log("build bed?");
                buildBed(this.program);
            }, this);
        } else {
            this.bed = this.add.image(48, 48, 'bed').setOrigin(0, 0);
        }

        if (!bench) {
            this.bench = this.add.image(this.map.widthInPixels - 48, 48, 'buildBench').setOrigin(1, 0).setInteractive();
            this.bench.on('pointerdown', () => {
                console.log("build bench?");
                buildBench(this.program);
            }, this);
        } else {
            this.bench = this.add.image(this.map.widthInPixels - 48, 0, 'bench').setOrigin(1, 0);
        }
    }

    updateItems(bed: boolean, bench: boolean) {
        if (bed && this.bed.texture.key === 'buildBed') {
            this.bed.destroy();
            this.bed = this.add.image(48, 48, 'bed').setOrigin(0, 0);
        }

        if (bench && this.bench.texture.key === 'buildBench') {
            this.bench.destroy();
            this.bench = this.add.image(this.map.widthInPixels - 48, 0, 'bench').setOrigin(1, 0);
        }
    }
}