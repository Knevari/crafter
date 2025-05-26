import type { Color } from "../types/sprite-render-component";

function drawSprite(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  sourceX: number,
  sourceY: number,
  sourceWidth: number,
  sourceHeight: number,
  destX: number,
  destY: number,
  color: Color = { r: 255, g: 255, b: 255, a: 1 },
  scale = 1,
  rotation = 0,
  flipH = false,
  flipV = false
) {
  const destWidth = sourceWidth * scale;
  const destHeight = sourceHeight * scale;

  ctx.save();
  ctx.translate(Math.floor(destX), Math.floor(destY));
  ctx.rotate(rotation);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    Math.floor(-destWidth / 2),
    Math.floor(-destHeight / 2),
    destWidth,
    destHeight
  );
  ctx.restore();
}

function drawWireSquare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color = 'red',
  lineWidth = 1
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(x, y, width, height);
  ctx.restore();
}

function drawFillRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color = 'red'
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}


function drawWireCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color = 'red',
  lineWidth = 1
) {
  const radius = Math.min(width, height) / 2;

  ctx.save();


  ctx.translate(x , y);

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2); 
  ctx.stroke();

  ctx.restore();
}


function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  scaleX: number = 1,
  scaleY: number = 1,
  options?: {
    font?: string;
    color?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
    shadowColor?: string;
    shadowBlur?: number;
    outlineColor?: string;
    outlineWidth?: number;
  }
) {
  ctx.save();

  ctx.translate(x, y);
  ctx.scale(scaleX, scaleY);



  ctx.font = options?.font ?? "16px sans-serif";
  ctx.fillStyle = options?.color ?? "black";
  ctx.textAlign = options?.textAlign ?? "center";
  ctx.textBaseline = options?.textBaseline ?? "middle";

  if (options?.shadowColor) {
    ctx.shadowColor = options.shadowColor;
    ctx.shadowBlur = options.shadowBlur ?? 4;
  }

  if (options?.outlineColor && options?.outlineWidth) {
    ctx.strokeStyle = options.outlineColor;
    ctx.lineWidth = options.outlineWidth;
    ctx.strokeText(text, 0, 0); 
  }

  ctx.fillText(text, 0, 0);


  ctx.restore();

}


const Draw = {
  drawSprite,
  drawWireCircle,
  drawWireSquare,
  drawText,
 drawFillRect
};

export default Draw;
