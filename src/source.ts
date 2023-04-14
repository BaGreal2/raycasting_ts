import Konva from 'konva';
import Vector2 from './helpers/vector2';
import Ray from './ray';

export default class Source {
	private _rays: Ray[] = [];
	constructor(
		private ctx: Konva.Layer,
		private _x: number,
		private _y: number,
		private _fov: number,
		private _resolutionScale: number
	) {
		this.ctx = ctx;
		this._x = _x;
		this._y = _y;
		this._fov = _fov;
		this._resolutionScale = _resolutionScale;

		for (let i = 0; i < this._fov * this._resolutionScale; i++) {
			const angle = new Vector2(
				Math.cos((i * (Math.PI / 180)) / this._resolutionScale),
				Math.sin((i * (Math.PI / 180)) / this._resolutionScale)
			);
			const ray = new Ray(new Vector2(this._x, this._y), angle);
			this._rays.push(ray);
		}
		for (const ray of this._rays) {
			ray.headingDir = this.centerRayAngle;
		}
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
	public get rays(): Ray[] {
		return this._rays;
	}

	public get centerRayAngle(): Vector2 {
		const length = this._rays.length;
		if (length % 2 === 0) {
			return this._rays[length / 2].dir
				.add(this._rays[length / 2 + 1].dir)
				.multiplyByValue(0.5);
		}
		return this._rays[Math.ceil(length / 2)].dir;
	}

	public update(angleOffset: number, fov: number, resScale: number) {
		const newRays: Ray[] = [];

		for (let i = 0; i < fov * resScale; i++) {
			const newAngle = new Vector2(
				Math.cos(((i + angleOffset) * (Math.PI / 180)) / resScale),
				Math.sin(((i + angleOffset) * (Math.PI / 180)) / resScale)
			);
			const ray = new Ray(new Vector2(this._x, this._y), newAngle);

			newRays.push(ray);
		}

		this._rays = newRays;

		for (const ray of this._rays) {
			ray.headingDir = this.centerRayAngle;
		}
	}

	public show() {
		const dot = new Konva.Circle({
			radius: 3,
			fill: 'white',
			x: this._x,
			y: this._y,
		});

		this.ctx.add(dot);
		for (const ray of this._rays) {
			this.ctx.add(ray.getDrawable());
		}
	}
}
