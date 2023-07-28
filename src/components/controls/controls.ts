import * as Phaser from 'phaser';
import ControlsSprite from './controlsSprite';

export default class Controls {
    leftIsDown!: boolean;
    rightIsDown!: boolean
    upIsDown!: boolean
    downIsDown!: boolean
    buttons: { [key: string]: ControlsSprite } = {}

    private _width = 192
    private _height = 192
    private _scene: Phaser.Scene
    private _config: { type: string; rotation: number, x: number, y: number }[]

    constructor(scene: Phaser.Scene) {
        this._scene = scene

        this._config = [
            {
                type: 'left',
                rotation: 1.5 * Math.PI,
                x: 120,
                y: this._scene.cameras.main.height/2,
            },
            {
                type: 'right',
                rotation: 0.5 * Math.PI,
                x: this._scene.cameras.main.width - 120,
                y: this._scene.cameras.main.height/2,
            },
            {
                type: 'up',
                rotation: 0,
                x: this._scene.cameras.main.width/2,
                y: 120,
            },
            {
                type: 'down',
                rotation: 1.0 * Math.PI,
                x: this._scene.cameras.main.width/2,
                y: this._scene.cameras.main.height - 120,
            }
        ]
        this._config.forEach(el => {
            this.buttons[el.type] = new ControlsSprite(scene, el.x, el.y, el)
        });

        this.buttons['left'].onPressed = () => {this.leftIsDown = true};
        this.buttons['left'].onReleased = () => {this.leftIsDown = false};
        this.buttons['right'].onPressed = () => {this.rightIsDown = true};
        this.buttons['right'].onReleased = () => {this.rightIsDown = false};
        this.buttons['up'].onPressed = () => {this.upIsDown = true};
        this.buttons['up'].onReleased = () => {this.upIsDown = false};
        this.buttons['down'].onPressed = () => {this.downIsDown = true};
        this.buttons['down'].onReleased = () => {this.downIsDown = false};

        // this.adjustPositions();
    }

    // adjustPositions() {
    //     let width = this._scene.cameras.main.width
    //     let height = this._scene.cameras.main.height
    //     this.buttons.left.x = 120
    //     this.buttons.left.y = height - 120
    //     this.buttons.right.x = 120 * 3
    //     this.buttons.right.y = height - 120
    //     this.buttons.up.x = width - 120
    //     this.buttons.up.y = height - 120
    //     this.buttons.down.x = width - 120
    //     this.buttons.down.y = height - 120
    // }

    update() {
        // this.leftIsDown = false
        // this.rightIsDown = false
        // this.upIsDown = false
        // this.downIsDown = false

        this._config.forEach(el => {
            this.buttons[el.type].update()
        });

        // let pointers = [this._scene.input.pointer1];
        // let pointers = [this._scene.input.pointer1, this._scene.input.pointer2]
        // let buttons = [this.buttons.left, this.buttons.right, this.buttons.up, this.buttons.down]

        // check which pointer pressed which button
        // pointers.forEach(pointer => {
        //     if (pointer.isDown) {
        //         console.log(pointer.x, pointer.y)
        //         let hit = buttons.filter(btn => {
        //             let x = btn.x - this._width / 2 < pointer.x && btn.x + this._width / 2 > pointer.x
        //             let y = btn.y - this._height / 2 < pointer.y && btn.y + this._height / 2 > pointer.y
        //             return x && y
        //         })
        //         if (hit.length === 1) {
        //             switch (hit[0].type) {
        //                 case 'left':
        //                     this.leftIsDown = true
        //                     break
        //                 case 'right':
        //                     this.rightIsDown = true
        //                     break
        //                 case 'up':
        //                     this.upIsDown = true
        //                     break
        //                 case 'down':
        //                     this.downIsDown = true
        //                     break
        //             }
        //         }
        //     }
        // })
    }
}