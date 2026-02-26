import { Scene } from 'phaser';
import { HEIGHT, WIDTH } from '../main';

const PINK_100 = 0xfce7f3;

export class Game extends Scene {
  constructor() {
    super('Game');
  }

  preload() {
    this.load.setPath('assets');
  }

  create() {
    // Container with open top
    const width = WIDTH / 2, height = WIDTH / 2;
    const x = WIDTH - width, y = 100 + HEIGHT / 2;
    const thickness = 16;

    const graphics = this.add.graphics();
    graphics.lineStyle(thickness, PINK_100);

    // Bottom wall
    this.matter.add.rectangle(x, y - (thickness / 2) + height / 2, width, thickness, { isStatic: true });
    graphics.moveTo(x - width / 2, y - (thickness / 2) + height / 2);
    graphics.lineTo(x + width / 2, y - (thickness / 2) + height / 2);

    // Left wall
    this.matter.add.rectangle(x - width / 2, y, thickness, height, { isStatic: true });
    graphics.moveTo(x - width / 2, y - height / 2);
    graphics.lineTo(x - width / 2, y + height / 2);

    // Right wall
    this.matter.add.rectangle(x + width / 2, y, thickness, height, { isStatic: true });
    graphics.moveTo(x + width / 2, y - height / 2);
    graphics.lineTo(x + width / 2, y + height / 2);

    graphics.strokePath();

    // ------------------------------------------------

    const boxLeft = x - width / 2, boxRight = x + width / 2;
    const boxTop = y - height / 2;

    // Dotted line on top, boundary to spawn balls
    const DOTTED_THICKNESS = 4;
    graphics.lineStyle(DOTTED_THICKNESS, PINK_100);

    const startX = x - width / 2, endX = x + width / 2;
    const dottedY = y + (DOTTED_THICKNESS / 2) - height / 2;

    const stepAmount = 10, stepSize = 25;
    for(let x = startX; x < endX; x += stepAmount + stepSize) {
      graphics.lineBetween(x, dottedY, x + stepSize, dottedY);
    }
    graphics.strokePath();

    this.matter.world.engine.positionIterations = 10;
    this.matter.world.engine.velocityIterations = 6;
    this.matter.world.engine.constraintIterations = 4

    // Spawn ball on click above container
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if(
        pointer.y < boxTop &&
        pointer.x > boxLeft &&
        pointer.x < boxRight
      ) {
        // +4, +8, +12, +16, +20
        const radii = [12, 16, 24, 36, 54, 74];
        // TODO: update logic to be able to spawn unlocked balls ocassionally
        const index = Phaser.Math.Between(0, 4);
        const radius = radii[index];

        // red-500, orange-400, yellow-400, lime-500, cyan-400, violet-600
        const colors = [0xfb2c36, 0xff8904, 0xfcc800, 0x7ccf00, 0x00d3f2, 0x7f22fe];
        const color = colors[index];

        const ball = this.add.circle(pointer.x, pointer.y, radius, color);
        ball.setStrokeStyle(2, 0xe7000b);

        this.matter.add.gameObject(ball, {
          shape: { type: "circle", radius },
          restitution: 0.2,
        });
      }
    });
  }
}
