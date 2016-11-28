import { get } from "Ember";
import { RESTSerializer } from "EmberData";
import Release from "models/github/Release";


const attrs = get( Release, "attributes" );


export default RESTSerializer.extend({
	modelNameFromPayloadKey() {
		return "githubRelease";
	},

	attrs: {
		assets: { deserialize: "records" }
	},

	normalizeResponse( store, primaryModelClass, payload, id, requestType ) {
		payload = {
			githubRelease: payload
		};

		return this._super( store, primaryModelClass, payload, id, requestType );
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
