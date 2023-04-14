import './style.css';
import Konva from 'konva';
import Source from './source';
import Obstacle from './obstacle';
import getRandomInt from './helpers/getRandomInt';
import { fovInput, mapCheckbox, resInput } from './helpers/refs';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const RGB_WALL_COLOR = [255, 255, 255];
const MAP_SCALE = 0.3;

let fov = 65;
let resScale = 1;
let showMap = true;

const obstacles: Obstacle[] = [];
let angleOffset = 0;

const stage = new Konva.Stage({
	container: 'canvas',
	width: WIDTH,
	height: HEIGHT,
});

const layer = new Konva.Layer();
stage.add(layer);

const source = new Source(
	layer,
	(WIDTH * MAP_SCALE) / 2,
	(HEIGHT * MAP_SCALE) / 2,
	fov,
	resScale
);

for (let i = 0; i < 3; i++) {
	const x1 = getRandomInt(0, WIDTH * MAP_SCALE);
	const y1 = getRandomInt(0, HEIGHT * MAP_SCALE);
	const x2 = getRandomInt(0, WIDTH * MAP_SCALE);
	const y2 = getRandomInt(0, HEIGHT * MAP_SCALE);

	const new_obsticle = new Obstacle(layer, x1, y1, x2, y2);

	obstacles.push(new_obsticle);
}

obstacles.push(
	new Obstacle(layer, 0, HEIGHT * MAP_SCALE, 0, 0),
	new Obstacle(layer, 0, 0, WIDTH * MAP_SCALE, 0),
	new Obstacle(
		layer,
		WIDTH * MAP_SCALE,
		0,
		WIDTH * MAP_SCALE,
		HEIGHT * MAP_SCALE
	),
	new Obstacle(
		layer,
		WIDTH * MAP_SCALE,
		HEIGHT * MAP_SCALE,
		0,
		HEIGHT * MAP_SCALE
	)
);

document.addEventListener('keydown', (e) => {
	const sourceDir = source.centerRayAngle.multiplyByValue(2);
	switch (e.key) {
		case 'w':
			source.x += sourceDir.x;
			source.y += sourceDir.y;

			if (source.x > WIDTH * MAP_SCALE) {
				source.x = WIDTH * MAP_SCALE - 1;
			}
			if (source.x < 0) {
				source.x = 1;
			}
			if (source.y > HEIGHT * MAP_SCALE) {
				source.y = HEIGHT * MAP_SCALE - 1;
			}
			if (source.y < 0) {
				source.y = 1;
			}
			break;
		case 'a':
			angleOffset -= 2 * resScale;
			break;
		case 's':
			source.x -= sourceDir.x;
			source.y -= sourceDir.y;
			if (source.x > WIDTH * MAP_SCALE) {
				source.x = WIDTH * MAP_SCALE - 1;
			}
			if (source.x < 0) {
				source.x = 1;
			}
			if (source.y > HEIGHT * MAP_SCALE) {
				source.y = HEIGHT * MAP_SCALE - 1;
			}
			if (source.y < 0) {
				source.y = 1;
			}
			break;
		case 'd':
			angleOffset += 2 * resScale;
			break;
	}
});

fovInput?.addEventListener('input', (e) => {
	const target = e.target as HTMLInputElement;
	fov = Number(target.value);
});
resInput?.addEventListener('input', (e) => {
	const target = e.target as HTMLInputElement;
	resScale = Number(target.value);
});
mapCheckbox?.addEventListener('input', (e) => {
	const target = e.target as HTMLInputElement;
	showMap = target.checked;
});

setInterval(() => {
	layer.destroyChildren();

	source.update(angleOffset, fov, resScale);
	let i = 0;

	for (const ray of source.rays) {
		ray.raycast(obstacles);

		const colorOffset = ray.maxLengthByCos / MAP_SCALE / 5.5;
		const newHeight = (HEIGHT * 8) / ray.maxLengthByCos / MAP_SCALE;

		const newRect = new Konva.Rect({
			x: (i * WIDTH) / (fov * resScale),
			y: HEIGHT / 2 - newHeight / 2,
			height: newHeight,
			width: WIDTH / (fov * resScale) + 1,
			fill: `rgb(${RGB_WALL_COLOR[0] - colorOffset}, ${
				RGB_WALL_COLOR[1] - colorOffset
			}, ${RGB_WALL_COLOR[2] - colorOffset})`,
		});

		layer.add(newRect);
		i++;
	}

	if (showMap) {
		const mapBg = new Konva.Rect({
			x: 0,
			y: 0,
			width: WIDTH * MAP_SCALE,
			height: HEIGHT * MAP_SCALE,
			fill: 'black',
		});
		layer.add(mapBg);
		source.show();
		for (const obstacle of obstacles) {
			obstacle.show();
		}
	}
}, 1);
