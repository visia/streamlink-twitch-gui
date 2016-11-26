import {
	stat,
	isFile
} from "utils/node/fs/stat";
import progress from "utils/node/progress";
import { createHash } from "crypto";
import { ReadStream } from "fs";


/**
 * Read file contents and compare checksum
 * @param {String}    file
 * @param {String}    expected
 * @param {String?}   hashingMethod
 * @param {Function?} progressCallback
 * @returns {Promise.<String>}
 */
function checksum( file, expected, hashingMethod, progressCallback ) {
	// default hash type (shift arguments)
	if ( typeof hashingMethod !== "string" ) {
		//noinspection JSValidateTypes
		progressCallback = hashingMethod;
		// sufficient for integrity check
		hashingMethod = "sha256";
	}

	return stat( file, isFile, true )
		.then( data => new Promise( ( resolve, reject ) => {
			let hash = createHash( hashingMethod );
			let stream = new ReadStream( file );

			stream.once( "error", reject );
			stream.once( "end", () => {
				let checksum = hash.digest( "hex" );

				if ( checksum === expected ) {
					resolve( checksum );
				} else {
					reject( new Error( "Checksum mismatch" ) );
				}
			});

			stream.on( "data", chunk => hash.update( chunk ) );

			progress( stream, data.size, progressCallback );
		}) );
}


export default checksum;
