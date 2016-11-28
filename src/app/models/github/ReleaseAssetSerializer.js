import { get } from "Ember";
import { RESTSerializer } from "EmberData";
import ReleaseAsset from "models/github/ReleaseAsset";


const attrs = get( ReleaseAsset, "attributes" );


export default RESTSerializer.extend({
	modelNameFromPayloadKey: function() {
		return "githubReleaseAsset";
	},

	normalize: function( modelClass, resourceHash, prop ) {
		let primaryKey = get( this, "primaryKey" );

		// remove unwanted properties from the payload
		Object.keys( resourceHash ).forEach(function( key ) {
			if ( key !== primaryKey && !attrs.has( key ) ) {
				delete resourceHash[ key ];
			}
		});

		return this._super( modelClass, resourceHash, prop );
	}
});
