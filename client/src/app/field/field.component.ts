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
import { fromEvent } from 'rxjs';

const DEFAULT_PLAYER_COLOR = 'blue';
const DEFAULT_PLAYER_NAME = 'You';
const DEFAULT_PLAYER_SIZE = 5;

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
  playerName = DEFAULT_PLAYER_NAME;
  @Input()
  playerX = 0;
  @Input()
  playerY = 0;
  @Input()
  playerColor = DEFAULT_PLAYER_COLOR;
  @Input()
  playerSize = DEFAULT_PLAYER_SIZE;

  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;

  constructor() {}

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
    this.drawPlayer();
  }

  drawPlayer() {
    if (!this.canvas || !this.ctx) {
      return;
    }

    // player is always at the center of the screen
    const x = this.canvas.clientWidth / 2;
    const y = this.canvas.clientHeight / 2;

    this.ctx.beginPath();
    this.ctx.fillStyle = this.playerColor ?? DEFAULT_PLAYER_COLOR;
    this.ctx.strokeStyle = 'black';
    this.ctx.arc(x, y, this.playerSize, 0, Math.PI * 2, false);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.textAlign = 'center';
    const nameHeight = Number(/\d+/.exec(this.ctx.font));
    this.ctx.fillText(
      this.playerName,
      x,
      y - nameHeight - 0.2 * this.playerSize
    );
  }
}
