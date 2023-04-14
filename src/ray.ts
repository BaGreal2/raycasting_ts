import Konva from 'konva';
import Vector2 from './helpers/vector2';
import Obstacle from './obstacle';

export default class Ray {
	private _end: Vector2;
	private _maxLength = 700;
	private _headingDir = new Vector2(0, 0);

	constructor(private _source: Vector2, private _dir: Vector2) {
		this._source = _source;
		this._dir = _dir;
		const direction = this._dir.multiplyByValue(this._maxLength);
		this._end = this.source.add(direction);
	}

	public getDrawable() {
		const direction = this._dir.multiplyByValue(this._maxLength);
		this._end = this.source.add(direction);
		return new Konva.Line({
			stroke: 'white',
			points: [this._source.x, this._source.y, this._end.x, this._end.y],
			strokeWidth: 1,
		});
	}

	public get source(): Vector2 {
		return this._source;
	}
	public set source(val: Vector2) {
		this._source = val;
	}

	public get end(): Vector2 {
		return this._end;
	}

	public get maxLength(): number {
		return this._maxLength;
	}

	public get dir(): Vector2 {
		return this._dir;
	}
	public set dir(value: Vector2) {
		this._dir = value;
	}

	public set headingDir(value: Vector2) {
		this._headingDir = value;
	}

	public get maxLengthByCos(): number {
		const angle = Math.acos(this._dir.x);
		const headingAngle = Math.acos(this._headingDir.x);
		return this._maxLength * Math.cos(headingAngle - angle);
	}

	public raycast(obstacles: Obstacle[]) {
		let minDistanse = Infinity;

		for (const obstacle of obstacles) {
			if (obstacle.intersects(new Ray(this._source, this._dir))) {
				const intersectionPoint = obstacle.intersects(
					new Ray(this._source, this._dir)
				);
				if (!intersectionPoint) {
					continue;
				}
				const distanceToIntersect =
					this._source.getDistanceTo(intersectionPoint);
				if (distanceToIntersect < minDistanse) {
					minDistanse = distanceToIntersect;
				}
			}
		}
		this._maxLength = minDistanse;
	}
}
