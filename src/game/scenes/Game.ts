import { Scene } from 'phaser';
import { HEIGHT, WIDTH } from '../main';

const PINK_100 = 0xfce7f3;

export class Game extends Scene {
  // BALL RELATED
  // +4, +8, +12, +16, +20
  radii = [12, 16, 24, 36, 54, 74];
  // red-500, orange-400, yellow-400, lime-500, cyan-400, violet-600
  colors = [0xfb2c36, 0xff8904, 0xfcc800, 0x7ccf00, 0x00d3f2, 0x7f22fe];

  nextBallColor = -1;
  nextBallRadius = -1;

  interface: Phaser.GameObjects.Graphics;
  ballContainer: Phaser.GameObjects.Graphics;
  previewBall: Phaser.GameObjects.Graphics;
  actualBall: Phaser.GameObjects.Graphics;

  constructor() {
    super('Game');
  }

  preload() {
    this.load.setPath('assets');
    this.interface = this.add.graphics();
    this.ballContainer = this.add.graphics();
    this.previewBall = this.add.graphics();
    this.actualBall = this.add.graphics();

    this.generateNextBall();
  }

  create() {
    const width = WIDTH / 2, height = WIDTH / 2;
    const x = WIDTH - width, y = 100 + HEIGHT / 2;
    const thickness = 16;

    this.renderBallContainer({ width, height, x, y, thickness });

    // Display next ball
    this.add.text(WIDTH - 200, 50, "NEXT BALL", {
      fontStyle: "bold", fontFamily: "monospace", fontSize: 20,
    });
    this.interface.lineStyle(4, PINK_100);
    this.interface.strokeRect(WIDTH - 200, 80, 150, 150);

    const boxLeft = x - width / 2, boxRight = x + width / 2;
    const boxTop = y - height / 2;

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
        // TODO: on click should just release the ball, it should already be visible and following cursor
        const ball = this.add.circle(pointer.x, pointer.y, this.nextBallRadius, this.nextBallColor);
        ball.setStrokeStyle(2, 0xe7000b);

        this.matter.add.gameObject(ball, {
          shape: { type: "circle", radius: this.nextBallRadius },
          restitution: 0.2,
        });
        this.generateNextBall();
        this.holdNextBall({ pointer });
      }
    });

    // ----------------------------------------------

    // Ball cursor tracking
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      // Display next ball at cursor
      if(pointer.y < boxTop && pointer.x > boxLeft && pointer.x < boxRight) {
        this.holdNextBall({ pointer });
      }
    });

    // Ball collision --> merge same size / color
    this.matter.world.on(Phaser.Physics.Matter.Events.COLLISION_START, (event: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      // console.log(event);
    });
  }

  private renderBallContainer({ width, height, x, y, thickness}: {
    width: number; height: number;
    x: number; y: number;
    thickness: number;
  }) {
    // Container with open top
    const graphics = this.ballContainer;
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
  }

  private generateNextBall() {
    // Randomize ball generation
    // TODO: update logic to be able to spawn unlocked balls ocassionally
    const index = Phaser.Math.Between(0, 3);
    const radius = this.radii[index];
    const color = this.colors[index];

    this.nextBallRadius = radius;
    this.nextBallColor = color;

    this.previewNextBall({ ballRadius: radius, ballColor: color });
  }

  private previewNextBall({ ballRadius, ballColor }: {
    ballRadius: number; ballColor: number;
  }) {
    const previewBall = this.previewBall;
    previewBall.clear();

    previewBall.fillStyle(ballColor);
    previewBall.fillCircle(WIDTH - 125, 150, ballRadius);
    previewBall.strokeCircle(WIDTH - 125, 150, ballRadius);
  }

  private holdNextBall({ pointer }: {
    pointer: Phaser.Input.Pointer;
  }) {
    const actual = this.actualBall;
    actual.clear();

    actual.fillStyle(this.nextBallColor);
    actual.fillCircle(pointer.x, pointer.y, this.nextBallRadius);
    actual.strokeCircle(pointer.x, pointer.y, this.nextBallRadius);
  }
}
