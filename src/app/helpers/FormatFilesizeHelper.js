import { Helper } from "Ember";


const {
	floor,
	pow
} = Math;

const units = [ "TiB", "GiB", "MiB", "KiB", "Bytes" ]
	.map(function( unit, index, array ) {
		return {
			prefix: unit,
			size  : pow( 2, 10 * ( array.length - index - 1 ) )
		};
	});


export default Helper.extend({
	compute( params ) {
		let size = Number( params[0] );
		if ( !params[0] || isNaN( size ) || size < 0 || size === Infinity ) { return "?"; }
		if ( size === 0 ) { return "0 Bytes"; }

		let unit = units.find(function( unit ) {
			return size >= unit.size;
		});

		let val = size / unit.size;
		let str = val >= 1000 || unit.prefix === "Bytes"
			// don't add decimals to values >= 1000 or simple bytes
			? floor( val ).toString()
			// prevent rounding of getFixed()
			: ( floor( val * 10 ) / 10 ).toFixed( 1 );

		return `${str} ${unit.prefix}`;
	}
});
