
function drawSprite(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  sourceX: number,
  sourceY: number,
  sourceWidth: number,
  sourceHeight: number,
  destX: number,
  destY: number,
  scale = 1,
  rotation = 0,
  flipH = false,
  flipV = false
) {
  const destWidth = sourceWidth * scale;
  const destHeight = sourceHeight * scale;

  ctx.save();
  ctx.translate(destX + destWidth / 2, destY + destHeight / 2);
  ctx.rotate(rotation);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    -destWidth / 2,
    -destHeight / 2,
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

function drawWireCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color = 'red',
  lineWidth = 1
) {
  const radius = (width + height) / 4; 

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height / 2, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
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


  ctx.font = options?.font ?? "16px sans-serif";
  ctx.fillStyle = options?.color ?? "black";
  ctx.textAlign = options?.textAlign ?? "left";
  ctx.textBaseline = options?.textBaseline ?? "top";

  if (options?.shadowColor) {
    ctx.shadowColor = options.shadowColor;
    ctx.shadowBlur = options.shadowBlur ?? 4;
  }

  if (options?.outlineColor && options?.outlineWidth) {
    ctx.strokeStyle = options.outlineColor;
    ctx.lineWidth = options.outlineWidth;
    ctx.strokeText(text, x, y);
  }

  ctx.fillText(text, x, y);

  ctx.restore();
}

const Draw = {
  drawSprite,
  drawWireCircle,
  drawWireSquare,
  drawText
};

export default Draw;
