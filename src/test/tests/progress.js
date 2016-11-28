import {
	module,
	test
} from "QUnit";
import progress from "utils/node/progress";
import { EventEmitter } from "events";


module( "Progress", {} );


test( "Progress", function( assert ) {

	let dateNow = Date.now;
	let event = new EventEmitter();
	let called = 0;

	function progressCallback( completed, size, percentage, speed, remaining ) {
		assert.strictEqual( size, 1000, "Has the correct size" );

		switch ( called++ ) {
			// initial values
			case 0:
				assert.strictEqual( completed, 0, "Initial completed is zero" );
				assert.strictEqual( percentage, 0, "Initial percentage is zero" );
				assert.ok( isNaN( speed ), "Initial speed is NaN" );
				assert.ok( isNaN( remaining ), "Initial time remaining is NaN" );
				break;
			// first chunk
			case 1:
				assert.strictEqual( completed, 200, "Has the correct completed size (1)" );
				assert.strictEqual( percentage, 0.2, "Has the correct percentage (1)" );
				assert.ok( isNaN( speed ), "Speed is NaN - threshold not reached yet" );
				assert.ok( isNaN( remaining ), "Remaining is NaN - threshold not reached yet" );
				break;
			case 2:
				assert.strictEqual( completed, 400, "Has the correct completed size (2)" );
				assert.strictEqual( percentage, 0.4, "Has the correct percentage (2)" );
				assert.strictEqual( speed, 200, "Has the correct speed (2)" );
				assert.strictEqual( remaining, 3000, "Has the correct time remaining (2)" );
				break;
			case 3:
				assert.strictEqual( completed, 700, "Has the correct completed size (3)" );
				assert.strictEqual( percentage, 0.7, "Has the correct percentage (3)" );
				assert.strictEqual( speed, 250, "Has the correct speed (3)" );
				assert.strictEqual( remaining, 1200, "Has the correct time remaining (3)" );
				break;
			case 4:
				assert.strictEqual( completed, 775, "Has the correct completed size (4)" );
				assert.strictEqual( percentage, 0.775, "Has the correct percentage (4)" );
				assert.strictEqual( speed, 100, "Has the correct speed (4)" );
				assert.strictEqual( remaining, 1125, "Has the correct time remaining (4)" );
				break;
			case 5:
				assert.strictEqual( completed, 1000, "Fully completed" );
				assert.strictEqual( percentage, 1, "100%" );
				assert.strictEqual( speed, 262.5, "Has the correct speed (5)" );
				assert.strictEqual( remaining, 0, "No more time remaining" );
				break;
			default:
				assert.ok( false, "The callback was executed too many times" );
		}
	}

	// overall size is 1000
	// use custom threshold and smoothing (try to get nicer numbers for testing)
	progress( event, 1000, progressCallback, { smoothing: 0.5, threshold: 1000 } );

	// start at timestamp 1000
	Date.now = () => 1000;
	event.emit( "data", { length: 200 } );

	// same chunk (200) in same time span (1000)
	Date.now = () => 2000;
	event.emit( "data", { length: 200 } );

	// larger chunk (300) in the same time span (1000)
	Date.now = () => 3000;
	event.emit( "data", { length: 300 } );

	// smaller chunk (75) in a smaller time span (500)
	Date.now = () => 3500;
	event.emit( "data", { length:  75 } );

	// larger chunk (225) in a larger time span (1500)
	Date.now = () => 5000;
	event.emit( "data", { length: 225 } );

	// stop listening
	// the callback does not get executed anymore
	event.emit( "close" );
	event.emit( "data", { length: 1000 } );

	Date.now = dateNow;

});
