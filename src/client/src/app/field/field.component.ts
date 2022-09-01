import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IPlayer, IGameState } from '../../../../models';

const DEFAULT_COIN_COLOR = 'yellow';
const DEFAULT_OTHER_PLAYER_COLOR = 'red';
const DEFAULT_PLAYER_COLOR = 'blue';
const DEFAULT_PLAYER_NAME = 'You';
const DEFAULT_PLAYER_SIZE = 5;
// how far apart each grid line is in pixels
const SCALE = 10;
// how often a grid line is rendered
const GRID_SCALE = 5;

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldComponent implements AfterViewInit, OnChanges {
  @ViewChild('field', { static: true })
  field?: ElementRef;

  @Input()
  state?: IGameState;

  @Input()
  player?: IPlayer;
  @Input()
  playerColor = DEFAULT_PLAYER_COLOR;
  @Input()
  playerSize = DEFAULT_PLAYER_SIZE;

  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;

  constructor() {}

  get width() {
    return this.canvas?.clientWidth ?? 0;
  }
  get height() {
    return this.canvas?.clientHeight ?? 0;
  }

  ngAfterViewInit(): void {
    this.canvas = this.field!.nativeElement;
    this.ctx = this.canvas!.getContext('2d')!;
    this.render();
    window.addEventListener('resize', () => this.render());
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  render() {
    if (!this.canvas || !this.ctx) {
      return;
    }

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    this.drawBackground();
    this.drawTokens();
    this.drawOtherPlayers();
    this.drawPlayer();
  }

  getCanvasCoordinatesFromStateCoordinates(
    stateX: number,
    stateY: number
  ): { x: number; y: number } | null {
    if (!this.player || !this.canvas) {
      return null;
    }

    const playerCanvasX = this.canvas.clientWidth / 2;
    const playerCanvasY = this.canvas.clientHeight / 2;

    const x = playerCanvasX - (this.player.x - stateX) * SCALE;
    if (x < 0 || x > this.canvas.width) {
      return null;
    }

    const y = playerCanvasY - (this.player.y - stateY) * SCALE;
    if (y < 0 || y > this.canvas.height) {
      return null;
    }

    return { x, y };
  }

  drawPlayer() {
    if (!this.canvas || !this.ctx) {
      return;
    }

    // player is always at the center of the screen
    const x = this.canvas.clientWidth / 2;
    const y = this.canvas.clientHeight / 2;

    this.drawCircle(
      x,
      y,
      this.playerSize,
      this.playerColor,
      'black',
      this.player?.name ?? DEFAULT_PLAYER_NAME
    );
  }

  drawTokens() {
    if (!this.canvas || !this.ctx || !this.state) {
      return;
    }

    const visibleCoins = this.state.coins
      .map((c) => ({
        coin: c,
        canvasCoord: this.getCanvasCoordinatesFromStateCoordinates(c.x, c.y),
      }))
      .filter((c) => c.canvasCoord);

    for (let coin of visibleCoins) {
      const x = coin.canvasCoord!.x;
      const y = coin.canvasCoord!.y;

      this.drawCircle(x, y, this.playerSize, DEFAULT_COIN_COLOR, 'gray');
    }
  }

  drawOtherPlayers() {
    if (!this.canvas || !this.ctx || !this.state) {
      return;
    }

    const visiblePlayers = this.state.players
      .filter((p) => p !== this.player)
      .map((p) => ({
        player: p,
        canvasCoord: this.getCanvasCoordinatesFromStateCoordinates(p.x, p.y),
      }))
      .filter((c) => c.canvasCoord);

    for (let p of visiblePlayers) {
      const x = p.canvasCoord!.x;
      const y = p.canvasCoord!.y;

      this.drawCircle(
        x,
        y,
        this.playerSize,
        DEFAULT_OTHER_PLAYER_COLOR,
        'black',
        p.player.name
      );
    }
  }

  drawBackground() {
    if (!this.canvas || !this.ctx) {
      return;
    }

    this.ctx.strokeStyle = 'lightgray';
    const startX = ((this.player?.x ?? 0) % GRID_SCALE) * SCALE;
    for (let x = this.width - startX; x >= 0; x -= SCALE * GRID_SCALE) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    const startY = ((this.player?.y ?? 0) % GRID_SCALE) * SCALE;
    for (let y = this.height - startY; y >= 0; y -= SCALE * GRID_SCALE) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }

  drawCircle(
    x: number,
    y: number,
    size: number,
    fillColor: string,
    strokeColor: string,
    label?: string
  ) {
    if (!this.ctx) {
      return;
    }

    this.ctx.beginPath();
    this.ctx.fillStyle = fillColor;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.arc(x, y, size, 0, Math.PI * 2, false);
    this.ctx.stroke();
    this.ctx.fill();
    if (label) {
      this.ctx.textAlign = 'center';
      const nameHeight = Number(/\d+/.exec(this.ctx.font));
      this.ctx.fillText(label, x, y - nameHeight - 0.2 * this.playerSize);
    }
  }
}
