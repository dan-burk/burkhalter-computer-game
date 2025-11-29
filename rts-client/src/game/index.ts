import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';

export function createGame(parentElementId: string): Phaser.Game {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: '#1d2330',
        parent: parentElementId,
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        scene: [GameScene]
    };

    return new Phaser.Game(config);
}
