export default class Vector2 {
	constructor(private _x: number, private _y: number) {
		this._x = _x;
		this._y = _y;
	}
	public get y(): number {
		return this._y;
	}
	public set y(value: number) {
		this._y = value;
	}
	public get x(): number {
		return this._x;
	}
	public set x(value: number) {
		this._x = value;
	}

	public add(other: Vector2): Vector2 {
		return new Vector2(this._x + other.x, this._y + other.y);
	}

	public subtract(other: Vector2) {
		return new Vector2(this._x - other.x, this._y - other.y);
	}

	public multiply(other: Vector2) {
		return new Vector2(this._x * other.x, this._y * other.y);
	}

	public multiplyByValue(value: number) {
		return new Vector2(this._x * value, this._y * value);
	}

	public dot(other: Vector2) {
		return this._x * other.x + this._y * other.y;
	}

	public length() {
		return Math.sqrt(this._x ** 2 + this._y ** 2);
	}

	public normalize() {
		return this.multiplyByValue(this.length());
	}

	public reflect(rd: Vector2) {
		return rd.subtract(this.multiplyByValue(2 * this.dot(rd)));
	}

	public getDistanceTo(point: Vector2) {
		const sourcePoint = new Vector2(this._x, this._y);
		return Math.sqrt(
			Math.pow(point.x - sourcePoint.x, 2) +
				Math.pow(point.y - sourcePoint.y, 2)
		);
	}
}
