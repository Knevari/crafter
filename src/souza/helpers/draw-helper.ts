
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

const Draw = {
  drawSprite,
  drawWireCircle,
  drawWireSquare
};

export default Draw;
