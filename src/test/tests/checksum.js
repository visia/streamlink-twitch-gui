import {
	module,
	test
} from "QUnit";
import checksum from "utils/node/fs/checksum";
import "file?name=fixtures/checksum/hello-world.txt!fixtures/checksum/hello-world.txt";


const expected = "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";


module( "Checksum", {} );


test( "Checksum", function( assert ) {

	let done = assert.async();

	checksum( "./fixtures/checksum/hello-world.txt", expected, "sha256" )
		.then( checksum => {
			assert.ok( checksum === expected, "Correctly calculates checksums" );
		}, () => {
			assert.ok( false, "Does not calculate checksums correctly" );
		})
		.finally( done );

});


test( "Checksum with progress", function( assert ) {

	assert.expect( 7 );

	let done = assert.async();
	let called = 0;
	let lastArgs;

	function progressCallback( completed, size, percentage ) {
		if ( called === 0 ) {
			assert.strictEqual( completed, 0, "Completed is zero at the beginning" );
			assert.strictEqual( percentage, 0, "Percentage is zero at the beginning" );
			assert.strictEqual( size, 11, "Has the correct file size" );
		} else if ( called === 1 ) {
			assert.ok( completed > 0, "Completed is larger than zero" );
			assert.ok( percentage > 0, "Percentage is larger than zero" );
		}
		lastArgs = [ ...arguments ];
		++called;
	}

	checksum( "./fixtures/checksum/hello-world.txt", expected, "sha256", progressCallback )
		.then( () => {
			let [ completed, size, percentage ] = lastArgs;
			assert.strictEqual( completed, size, "Fully completed on last progress callback" );
			assert.strictEqual( percentage, 1, "Percentage is 100%" );
		})
		.finally( done );

});
