/**
 * @param {(IncomingMessage|EventEmitter)} incomingMessage
 * @param {Number} size
 * @param {Function} callback
 */
function progress( incomingMessage, size, callback ) {
	if ( !( callback instanceof Function ) ) { return; }

	let completed = 0;

	callback( completed, size, 0 );

	incomingMessage.on( "data", function( chunk ) {
		completed += chunk.length;
		callback( completed, size, completed / size );
	});
}


export default progress;
