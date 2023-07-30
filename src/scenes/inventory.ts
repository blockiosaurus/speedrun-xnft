import * as Phaser from 'phaser';
import { HUD_HEIGHT } from './game';
import { BONK_MINT, BSOL_MINT, LAINESOL_MINT, getTokenBalance } from '../utils/token';
import EventsCenter from '../components/eventCenter';
import { Program } from '@coral-xyz/anchor';
import { fetchCrops, getProgram } from '../utils/speedrunProgram';
// import EventsCenter from '../components/events_center';

const NUM_ICONS = 6;
const UPDATE_PERIOD = 10000;

export default class InventoryScene extends Phaser.Scene {
    // dialogBox: Phaser.GameObjects.Image;
    // label: Phaser.GameObjects.Text;
    // textQueue: string;
    // enqueueTime: number;
    lastUpdate = 0;
    offsets = new Map<string, number>();
    items = new Map<string, Phaser.GameObjects.Image>();
    solLabel!: Phaser.GameObjects.Text;
    bsolLabel!: Phaser.GameObjects.Text;
    lsolLabel!: Phaser.GameObjects.Text;
    bonkLabel!: Phaser.GameObjects.Text;
    activeItem: string | null = null;
    program!: Program;
    bsolPlanted = false;
    lsolPlanted = false;
    bonkPlanted = false;

    constructor() {
        super('inventory');
    }

    preload() {
        this.load.image('scythe', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/Scythe.png');
        this.load.image('wateringCan', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/WateringCan.png');
        this.load.image('solana', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/Sol.png');
        this.load.image('solBlazePacket', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/SolBlazePacket.png');
        this.load.image('laineSolPacket', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/LainSolPacket.png');
        this.load.image('bonkPacket', 'https://raw.githubusercontent.com/blockiosaurus/speedrun-xnft/master/assets/BonkPacket.png');
    }

    create() {
        const spacing = (this.cameras.main.width - (HUD_HEIGHT * NUM_ICONS)) / (NUM_ICONS + 1);
        let offset = spacing;
        for (const item of ["scythe", "wateringCan", "solana", "solBlazePacket", "laineSolPacket", "bonkPacket"]) {
            let img = this.add.image(offset + HUD_HEIGHT / 2, this.cameras.main.height - HUD_HEIGHT + HUD_HEIGHT * .375, item)
                .setOrigin(0.5, 0.5)
                .setDisplaySize(HUD_HEIGHT * .75, HUD_HEIGHT * .75)
                .setInteractive()
                .setData("item", item);
            this.items.set(item, img);
            this.offsets.set(item, offset);
            offset += HUD_HEIGHT + spacing;
        }

        this.solLabel = this.add.text(this.offsets.get("solana")! + (HUD_HEIGHT / 2), this.cameras.main.height, '0', {
            fontSize: 16,
            fontFamily: 'Monospace',
            color: '#000000',
            backgroundColor: '#0F0',
        }).setOrigin(0.5, 1);

        this.bsolLabel = this.add.text(this.offsets.get("solBlazePacket")! + (HUD_HEIGHT / 2), this.cameras.main.height, '0', {
            fontSize: 16,
            fontFamily: 'Monospace',
            color: '#000000',
            backgroundColor: '#0F0',
        }).setOrigin(0.5, 1);

        this.lsolLabel = this.add.text(this.offsets.get("laineSolPacket")! + (HUD_HEIGHT / 2), this.cameras.main.height, '0', {
            fontSize: 16,
            fontFamily: 'Monospace',
            color: '#000000',
            backgroundColor: '#0F0',
        }).setOrigin(0.5, 1);

        this.bonkLabel = this.add.text(this.offsets.get("bonkPacket")! + (HUD_HEIGHT / 2), this.cameras.main.height, '0', {
            fontSize: 16,
            fontFamily: 'Monospace',
            color: '#000000',
            backgroundColor: '#0F0',
        }).setOrigin(0.5, 1);
        // this.dialogBox = this.add.image(0, 0, 'dialog').setOrigin(0, 0).setVisible(false);
        // this.label = this.add.text(64, 64, '', {
        //     fontSize: 32,
        //     fontFamily: 'Georgia',
        //     color: '#000000',
        //     wordWrap: {width: 1152},
        // })

        // listen to 'set-dialog' event and call `setDialog()`
        // when it fires
        // EventsCenter.on('set-dialog', this.setDialog, this)

        // listen to 'clear-dialog' event and call `clearDialog()`
        // when it fires
        // EventsCenter.on('clear-dialog', this.clearDialog, this)

        // clean up when Scene is shutdown
        // this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
        //     EventsCenter.off('set-dialog', this.setDialog, this)
        // })
        this.program = getProgram();

        this.input.on('gameobjectdown', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
            const key = gameObject.getData("item");
            if (key) {
                if (this.activeItem === key) {
                    this.activeItem = null;
                    this.items.get(key)!.setAlpha(1.0);
                }
                else {
                    if (this.activeItem) {
                        this.items.get(this.activeItem)!.setAlpha(1.0);
                    }
                    this.activeItem = key;
                    this.items.get(key)!.setAlpha(0.5);
                }
            }
            EventsCenter.emit('select-item', key);
        });

        EventsCenter.on('planted', this.setPlanted, this);
        EventsCenter.on('harvested', this.setHarvested, this);
    }

    update(time: number, delta: number) {
        if ((time - this.lastUpdate) > UPDATE_PERIOD) {
            this.lastUpdate = time;

            getTokenBalance(null).then((balance) => {
                this.solLabel.setText(formatNumber(balance as number));
            });

            if (!this.bsolPlanted) {
                getTokenBalance(BSOL_MINT).then((balance) => {
                    this.bsolLabel.setText(formatNumber(balance as number));
                });
            } else {
                this.bsolLabel.setText("Planted");
            }

            if (!this.lsolPlanted) {
                getTokenBalance(LAINESOL_MINT).then((balance) => {
                    this.lsolLabel.setText(formatNumber(balance as number));
                });
            } else {
                this.lsolLabel.setText("Planted");
            }

            if (!this.bonkPlanted) {
                getTokenBalance(BONK_MINT).then((balance) => {
                    this.bonkLabel.setText(formatNumber(balance as number));
                });
            } else {
                this.bonkLabel.setText("Planted");
            }
        }
        // if (this.printing) {
        //     let elapsed = Math.round((time - this.enqueueTime) / DIALOG_PERIOD);
        //     this.label.text = this.textQueue.substring(0, elapsed);
        //     if (elapsed >= this.textQueue.length) {
        //         this.printing = false;
        //     }
        // }
    }

    setPlanted(cropType: string) {
        if (cropType === "blaze") {
            this.bsolPlanted = true;
        }
        else if (cropType === "laine") {
            this.lsolPlanted = true;
        }
        else if (cropType === "bonk") {
            this.bonkPlanted = true;
        }
    }

    setHarvested(cropType: string) {
        if (cropType === "blaze") {
            this.bsolPlanted = false;
        }
        else if (cropType === "laine") {
            this.lsolPlanted = false;
        }
        else if (cropType === "bonk") {
            this.bonkPlanted = false;
        }
    }
}

const PREFIXES = ["", "K", "M", "B"]
function formatNumber(num: number) {
    let prefixOffset = 0;
    while (num > 1000) {
        num /= 1000;
        prefixOffset += 1;
    }
    return (num.toFixed(2)).toString() + PREFIXES[prefixOffset];
}