export const TILE_SIZE = 64;

const VIEWPORT_WIDTH =
    typeof window !== 'undefined' ? window.innerWidth : 1280;
const VIEWPORT_HEIGHT =
    typeof window !== 'undefined' ? window.innerHeight : 720;

const SCALE_UP_FACTOR = 1.2;

export const WORLD_WIDTH = Math.ceil(VIEWPORT_WIDTH * SCALE_UP_FACTOR);
export const WORLD_HEIGHT = Math.ceil(VIEWPORT_HEIGHT * SCALE_UP_FACTOR);
