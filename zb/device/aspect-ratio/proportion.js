/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2012-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @type {Object<string, Proportion>}
 */
const registry = {};


/**
 */
export class Proportion {
	/**
	 * @param {string} name
	 * @param {number=} opt_x
	 * @param {number=} opt_y
	 */
	constructor(name, opt_x = NaN, opt_y = NaN) {
		/**
		 * @type {string}
		 * @protected
		 */
		this._name = name;

		/**
		 * @type {number}
		 * @protected
		 */
		this._x = opt_x;

		/**
		 * @type {number}
		 * @protected
		 */
		this._y = opt_y;

		const proportionString = this.toString();

		if (!registry.hasOwnProperty(proportionString)) {
			registry[proportionString] = this;
		}

		return /** @type {!Proportion} */ (registry[proportionString]);
	}

	/**
	 * @override
	 */
	toString() {
		return `${this._name}|${this._x}:${this._y}`;
	}

	/**
	 * @return {number}
	 */
	get x() {
		return this._x;
	}

	/**
	 * @param {number} value
	 * @return {void}
	 * @throws {Error} Inconditionally.
	 */
	set x(value) {
		throw new Error('Cannot set property x of #<Proportion> which has only a getter');
	}

	/**
	 * @return {number}
	 */
	get y() {
		return this._y;
	}

	/**
	 * @param {number} value
	 * @return {void}
	 * @throws {Error} Inconditionally.
	 */
	set y(value) {
		throw new Error('Cannot set property y of #<Proportion> which has only a getter');
	}

	/**
	 * @return {string}
	 */
	get name() {
		return this._name;
	}

	/**
	 * @param {string} value
	 * @return {void}
	 * @throws {Error} Inconditionally.
	 */
	set name(value) {
		throw new Error('Cannot set property name of #<Proportion> which has only a getter');
	}
}


/**
 * Video Aspect Ratio modes
 * @enum {Proportion}
 */
export const Common = {
	KEEP: new Proportion('KEEP'),
	AUTO: new Proportion('AUTO'),
	X4X3: new Proportion('4:3', 4, 3),
	X16X9: new Proportion('16:9', 16, 9)
};
