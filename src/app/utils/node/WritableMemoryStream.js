import { Buffer } from "buffer";
import { Writable } from "stream";


export default class WritableMemoryStream extends Writable {
	constructor() {
		super( ...arguments );
		this.buffer = new Buffer( 0 );
	}

	_write( chunk, encoding, callback ) {
		if ( !Buffer.isBuffer( chunk ) ) {
			chunk = new Buffer( chunk, encoding );
		}

		this.buffer = Buffer.concat([ this.buffer, chunk ]);
		callback();
	}

	toString() {
		return this.buffer.toString();
	}
}
