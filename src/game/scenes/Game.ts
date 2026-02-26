import { Scene } from 'phaser';

export class Game extends Scene {
  constructor() {
    super('Game');
  }

  preload() {
    this.load.setPath('assets');
  }

  create() {
    // Container with open top
    const width = 512, height = 512;
    const x = 256 + width / 2, y = 192 + width / 2;
    const thickness = 16;

    const graphics = this.add.graphics();
    graphics.lineStyle(thickness, 0xfce7f3);

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

    // Ball
    const ball = this.add.circle(x, y - 320, 24, 0xe7000b);
    this.matter.add.gameObject(ball, { restitution: 0.2 });
  }
}
