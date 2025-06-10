import type { Vec2 } from "../Vec2/Vec2";

function drawSprite(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  sourceX: number,
  sourceY: number,
  sourceWidth: number,
  sourceHeight: number,
  position: Vec2,
  scale: Vec2,
  origin: Vec2,
  rotation = 0,
  flipH = false,
  flipV = false,
  alpha = 1
) {
  const destWidth = sourceWidth * scale.x;
  const destHeight = sourceHeight * scale.y;

  const offsetX = -destWidth * origin.x;
  const offsetY = -destHeight * origin.y;

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.imageSmoothingQuality = "low";
  ctx.globalAlpha = alpha;

  ctx.translate(position.x, position.y);
  ctx.rotate(rotation);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    offsetX,
    offsetY,
    destWidth,
    destHeight
  );

  ctx.restore();
}



function drawWireSquare(
  ctx: CanvasRenderingContext2D,
  position: Vec2,
  scale: Vec2,
  origin: Vec2,
  color = 'red',
  lineWidth = 1
) {
  ctx.save();
  ctx.translate(position.x, position.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  const offsetX = -scale.x * origin.x;
  const offsetY = -scale.y * origin.y;

  ctx.strokeRect(Math.floor(offsetX), Math.floor(offsetY), scale.x, scale.y);
  ctx.restore();
}


function drawFillRect(
  ctx: CanvasRenderingContext2D,
  position: Vec2,
  scale: Vec2,
  origin: Vec2,
  color = 'red'
) {
  ctx.save();
  ctx.translate(Math.floor(position.x), Math.floor(position.y));
  ctx.fillStyle = color;

  const offsetX = -scale.x * origin.x;
  const offsetY = -scale.y * origin.y;

  ctx.fillRect(Math.floor(offsetX), Math.floor(offsetY), scale.x, scale.y);

  ctx.restore();
}





const PI_2 = Math.PI * 2;

function drawWireCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color = 'red',
  lineWidth = 1
) {

  ctx.save();
  ctx.translate(x, y);

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, PI_2);
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
  ctx.textBaseline = options?.textBaseline ?? "top";

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
