import {
	stat,
	isDirectory
} from "utils/node/fs/stat";
import progress from "utils/node/progress";
import WritableMemoryStream from "utils/node/WritableMemoryStream";
import mkdirp from "utils/node/fs/mkdirp";
import getRedirected from "utils/node/http/getRedirected";
import {
	basename,
	resolve as pathResolve
} from "path";
import { WriteStream } from "fs";
import { parse as urlParse } from "url";


/**
 * @param {Url} url
 * @param {(Writable|EventEmitter)} writeStream
 * @param {Function?} progressCallback
 * @returns {Promise}
 */
function downloadPromise( url, writeStream, progressCallback ) {
	return getRedirected( url )
		.then( incomingMessage =>
			new Promise( ( resolve, reject ) => {
				writeStream.once( "error", reject );

				incomingMessage.once( "end", resolve );
				incomingMessage.once( "error", reject );
				incomingMessage.once( "unpipe", () => reject( new Error( "I/O error" ) ) );

				// setup the progressCallback
				if ( progressCallback instanceof Function ) {
					// it's fine to return NaN if the content-length header not available
					let size = Number( incomingMessage.headers[ "content-length" ] );
					progress( incomingMessage, size, progressCallback );
				}

				// link readStream and writeStream
				incomingMessage.pipe( writeStream, { end: true } );
			})
				.finally( () => {
					incomingMessage.destroy();
					writeStream.end();
				})
		);
}


/**
 * Download a file over http(s) and write it to the filesystem
 * @param {(String|Url)} url
 * @param {(String|Object)} dest
 * @param {String?} dest.directory
 * @param {String?} dest.name
 * @param {Function?} progressCallback
 * @returns {Promise}
 */
function download( url, dest, progressCallback ) {
	if ( typeof url === "string" ) {
		url = urlParse( url );
	}
	if ( !url.protocol || !url.host ) {
		return Promise.reject( new Error( "Invalid download URL" ) );
	}

	// download into memory
	if ( dest === null ) {
		let stream = new WritableMemoryStream();
		return downloadPromise( url, stream, progressCallback )
			.then( () => stream );
	}

	if ( typeof dest === "string" ) {
		dest = {
			dir : dest,
			name: null
		};
	}
	if ( !dest || !dest.dir || typeof dest.dir !== "string" ) {
		return Promise.reject( new Error( "Invalid directory" ) );
	}

	// does the path exist?
	return stat( dest.dir, isDirectory )
		// if not, try to create it
		.catch( () => mkdirp( dest.dir ) )
		// download and save
		.then( () => {
			let name   = dest.name || basename( url.pathname ) || "download";
			let path   = pathResolve( dest.dir, name );
			let stream = new WriteStream( path );

			return downloadPromise( url, stream, progressCallback )
				.then( () => path );
		});
}


export default download;
