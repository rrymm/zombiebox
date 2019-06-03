/*
 * This file is part of the ZombieBox package.
 *
 * Copyright (c) 2012-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


/**
 * @interface
 */
export default class IStateful {
	/**
	 * @return {function()} function that restores state
	 */
	takeSnapshot() {}
}
