import {
	module,
	test
} from "QUnit";
import WritableMemoryStream from "utils/node/WritableMemoryStream";
import { Buffer } from "buffer";


module( "WritableMemoryStream", {} );


test( "WritableMemoryStream", function( assert ) {

	let called = 0;
	function callback() {
		++called;
	}

	let stream = new WritableMemoryStream();
	assert.strictEqual( stream.toString(), "", "Is empty at the beginning" );

	stream._write( new Buffer( "foo" ), null, callback );
	assert.strictEqual( stream.toString(), "foo", "Accepts buffers as input" );
	assert.strictEqual( called, 1, "Callback was called" );

	stream._write( "bar", "utf8", callback );
	assert.strictEqual( stream.toString(), "foobar", "Accepts strings as input" );
	assert.strictEqual( called, 2, "Callback was called" );

});
