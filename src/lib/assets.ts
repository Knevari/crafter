import { EntityType, Tile } from "./types/";

export const tilesetImg = new Image();
export const treeTileImg = new Image();
export const grassTileImg = new Image();
export const waterTileGroupImg = new Image();
export const playerTileImg = new Image();
export const outdoorDecoTileImg = new Image();
export const pigTileImg = new Image();
export const slimeTileImg = new Image();
export const slimeGreenTileImg = new Image();
export const skeletonTileImg = new Image();

tilesetImg.src = "/tilemap_packed.png";
treeTileImg.src = "/Oak_Tree.png";
grassTileImg.src = "/Grass_Middle.png";
waterTileGroupImg.src = "/Water_Tile.png";
playerTileImg.src = "/Player.png";
pigTileImg.src = "/Pig.png";
outdoorDecoTileImg.src = "/Outdoor_Decor_Free.png";
slimeTileImg.src = "/Slime.png";
slimeGreenTileImg.src = "/Slime_Green.png";
skeletonTileImg.src = "/Skeleton.png";

export function loadAssets() {
  const assets = [
    tilesetImg,
    grassTileImg,
    treeTileImg,
    playerTileImg,
    pigTileImg,
    waterTileGroupImg,
    outdoorDecoTileImg,
    slimeTileImg,
    skeletonTileImg,
  ];

  return new Promise((resolve) => {
    let loaded = 0;

    assets.forEach((asset) => {
      asset.onload = () => {
        loaded++;
        if (loaded === assets.length) {
          resolve(assets);
        }
      };
    });
  });
}

export function getTilesetReferenceByEntityType(type?: EntityType) {
  switch (type) {
    case EntityType.TREE: {
      return treeTileImg;
    }
    case EntityType.ROCK:
    case EntityType.ITEM_ROCK: {
      return outdoorDecoTileImg;
    }
    case EntityType.PIG: {
      return pigTileImg;
    }
    case EntityType.PLAYER: {
      return playerTileImg;
    }
    case EntityType.SLIME: {
      return slimeTileImg;
    }
    case EntityType.SLIME_GREEN: {
      return slimeGreenTileImg;
    }
    case EntityType.SKELETON: {
      return skeletonTileImg;
    }
    default: {
      return tilesetImg;
    }
  }
}

export function getTilesetReferenceByTileType(type?: Tile) {
  switch (type) {
    case Tile.GRASS: {
      return grassTileImg;
    }
    case Tile.WATER_TOP_MIDDLE:
    case Tile.WATER_RIGHT_MIDDLE:
    case Tile.WATER_OUTER_TOP_RIGHT:
    case Tile.WATER_OUTER_TOP_LEFT:
    case Tile.WATER_OUTER_BOTTOM_RIGHT:
    case Tile.WATER_OUTER_BOTTOM_LEFT:
    case Tile.WATER_MIDDLE:
    case Tile.WATER_LEFT_MIDDLE:
    case Tile.WATER_INNER_TOP_RIGHT:
    case Tile.WATER_INNER_TOP_LEFT:
    case Tile.WATER_INNER_BOTTOM_RIGHT:
    case Tile.WATER_INNER_BOTTOM_LEFT:
    case Tile.WATER_FISH_SHADOW_3:
    case Tile.WATER_FISH_SHADOW_2:
    case Tile.WATER_FISH_SHADOW_1:
    case Tile.WATER_BOTTOM_MIDDLE: {
      return waterTileGroupImg;
    }
    default: {
      return tilesetImg;
    }
  }
}
