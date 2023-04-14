import Konva from 'konva';
import Vector2 from './helpers/vector2';
import Ray from './ray';

export default class Obstacle {
	constructor(
		private ctx: Konva.Layer,
		private _x1: number,
		private _y1: number,
		private _x2: number,
		private _y2: number
	) {
		this.ctx = ctx;
		this._x1 = _x1;
		this._y1 = _y1;
		this._x2 = _x2;
		this._y2 = _y2;
	}

	public show() {
		const line = new Konva.Line({
			stroke: 'red',
			points: [this._x1, this._y1, this._x2, this._y2],
			strokeWidth: 2,
		});
		this.ctx.add(line);
	}

	public intersects(ray: Ray): false | Vector2 {
		const x1 = this._x1;
		const y1 = this._y1;
		const x2 = this._x2;
		const y2 = this._y2;

		const x3 = ray.source.x;
		const y3 = ray.source.y;
		const x4 = ray.end.x;
		const y4 = ray.end.y;

		const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (den == 0) {
			return false;
		}

		const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
		const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

		if (t > 0 && t < 1 && u > 0) {
			const pt = new Vector2(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
			return pt;
		} else {
			return false;
		}
	}
}
