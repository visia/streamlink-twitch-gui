const SMOOTHING = 0.005;
const THRESHOLD = 3000;


/**
 * @callback progressCallback
 * @param {Number} completed
 * @param {Number} size
 * @param {Number} percentage
 * @param {Number} speed
 * @param {Number} remaining
 */

/**
 * @param {(IncomingMessage|EventEmitter)} incomingMessage
 * @param {Number} size
 * @param {progressCallback} callback
 * @param {Object?} options
 * @param {Number?} options.smoothing
 * @param {Number?} options.threshold
 */
function progress( incomingMessage, size, callback, options ) {
	if ( !( callback instanceof Function ) ) { return; }

	const smoothing = options instanceof Object && options.smoothing !== undefined
		? options.smoothing
		: SMOOTHING;
	const threshold = options instanceof Object && options.threshold !== undefined
		? options.threshold
		: THRESHOLD;

	let completed = 0;
	let started;
	let last;
	let averageSpeed;

	let chunks = 0;

	let onData = chunk => {
		let now = chunk.timestamp || Date.now();
		let valSpeed = NaN;
		let valTime = NaN;

		++chunks;
		completed += chunk.length;

		// initial data
		if ( chunks === 1 ) {
			started = now;
			averageSpeed = chunk.length;

		} else {
			let timeElapsed  = now - started;
			let timeSpan     = now - last;

			let currentSpeed = chunk.length / timeSpan;

			// normalize the first averageSpeed value
			if ( chunks === 2 ) {
				averageSpeed /= timeElapsed;
			}

			// exponential moving average
			averageSpeed = averageSpeed * ( 1 - smoothing )
			             + currentSpeed * (     smoothing );

			// don't return inaccurate values
			if ( timeElapsed >= threshold ) {
				valSpeed = averageSpeed * timeSpan;
				valTime = ( size - completed ) / averageSpeed;
			}
		}

		last = now;

		callback( completed, size, completed / size, valSpeed, valTime );
	};

	callback( completed, size, 0, NaN, NaN );

	incomingMessage.addListener( "data", onData );
	incomingMessage.once( "close", () => {
		incomingMessage.removeListener( "data", onData );
	});
}


export default progress;
