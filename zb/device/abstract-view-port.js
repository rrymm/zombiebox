/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2012-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {warn, debug} from '../console/console';
import Rect from '../geometry/rect';
import {Common} from './aspect-ratio/proportion';
import IViewPort from './interfaces/i-view-port';
import {AspectRatio, Transferring} from './aspect-ratio/aspect-ratio';
import UnsupportedFeature from './errors/unsupported-feature';


/**
 * @abstract
 * @implements {IViewPort}
 */
export default class AbstractViewPort {
	/**
	 * @param {Rect} containerRect
	 */
	constructor(containerRect) {
		/**
		 * Values of DOM video container (offsetX, offsetY, offsetWidth, offsetHeight)
		 * @type {Rect}
		 * @protected
		 */
		this._containerRect = containerRect;

		/**
		 * @type {boolean}
		 * @protected
		 */
		this._fullScreenState = true;

		/**
		 * Current AspectRatio instance
		 * @type {?AspectRatio}
		 * @protected
		 */
		this._aspectRatio = null;

		/**
		 * Values of specified area (offsetX, offsetY, offsetWidth, offsetHeight)
		 * @type {?Rect}
		 * @private
		 */
		this._areaRect = null;

		this._initDefaultAspectRatio();
	}

	/**
	 * @override
	 */
	setAspectRatio(ratio) {
		if (!this.hasAspectRatioFeature()) {
			throw new UnsupportedFeature('Aspect ratio');
		}

		if (this.isAspectRatioSupported(ratio)) {
			this._aspectRatio = ratio;
			this.updateViewPort();
		}
	}

	/**
	 * @override
	 */
	getAspectRatio() {
		if (!this.hasAspectRatioFeature()) {
			throw new UnsupportedFeature('Aspect ratio');
		}

		return this._aspectRatio;
	}

	/**
	 * @override
	 */
	toggleAspectRatio(bunch) {
		if (!this.hasAspectRatioFeature()) {
			throw new UnsupportedFeature('Aspect ratio');
		}

		const oldRatio = this.getAspectRatio();
		const index = this._indexOfRatioBunch(bunch, oldRatio);

		const newRatio = this._findNextSupportedRatio(index, bunch);
		if (newRatio) {
			this.setAspectRatio(newRatio);
		}

		debug(
			'Switch aspect ratio:',
			oldRatio.explain(),
			'->',
			newRatio ? newRatio.explain() : String(newRatio),
			'=',
			this.getAspectRatio().explain()
		);
	}

	/**
	 * @override
	 */
	setArea(rect) {
		if (!this.hasAreaChangeFeature()) {
			throw new UnsupportedFeature('Area change');
		}

		const normalizedRect = rect.getIntersection(this._containerRect);
		const areaChanged = !this._areaRect || !normalizedRect.isEqual(this._areaRect);

		this._areaRect = normalizedRect;

		if (this.isFullScreen()) {
			this.setFullScreen(false);
		} else if (areaChanged) {
			this.updateViewPort();
		}
	}

	/**
	 * @override
	 */
	getArea() {
		if (!this.hasAreaChangeFeature()) {
			throw new UnsupportedFeature('Area change');
		}

		return this._areaRect;
	}

	/**
	 * @override
	 */
	getCurrentArea() {
		if (this.isFullScreen()) {
			return this._containerRect;
		}

		if (this._areaRect) {
			return this._areaRect;
		}

		return this._containerRect;
	}

	/**
	 * @override
	 */
	setFullScreen(state) {
		if (state === this.isFullScreen()) {
			return;
		}

		this._fullScreenState = state;
		this.updateViewPort();
	}

	/**
	 * @override
	 */
	getFullScreen() {
		return this._fullScreenState;
	}

	/**
	 * @override
	 */
	getFullScreenArea() {
		return this._containerRect;
	}

	/**
	 * @override
	 */
	isFullScreen() {
		return this.getFullScreen();
	}

	/**
	 * @abstract
	 * @override
	 */
	isAspectRatioSupported(ratio) {}

	/**
	 * @abstract
	 * @override
	 */
	hasAspectRatioFeature() {}

	/**
	 * @abstract
	 * @override
	 */
	hasAreaChangeFeature() {}

	/**
	 * @abstract
	 * @override
	 */
	updateViewPort() {}

	/**
	 * @protected
	 */
	_initDefaultAspectRatio() {
		if (this.hasAspectRatioFeature()) {
			this._aspectRatio = new AspectRatio(
				Common.AUTO,
				Transferring.AUTO
			);
		} else {
			this._aspectRatio = null;
		}
	}

	/**
	 * @param {Array<AspectRatio>} bunch
	 * @param {AspectRatio} ratio
	 * @return {number}
	 * @protected
	 */
	_indexOfRatioBunch(bunch, ratio) {
		for (let i = 0; i < bunch.length; i++) {
			if (ratio.eq(bunch[i])) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * @param {number} index
	 * @param {Array<AspectRatio>} bunch
	 * @return {?AspectRatio}
	 * @protected
	 */
	_findNextSupportedRatio(index, bunch) {
		const length = bunch.length;
		for (let i = 1; i <= length; i++) {
			const ratio = bunch[(index + i) % length];
			if (this.isAspectRatioSupported(ratio)) {
				return ratio;
			}

			warn('Skip unsupported AspectRatio:', ratio.explain());
		}

		return null;
	}
}
