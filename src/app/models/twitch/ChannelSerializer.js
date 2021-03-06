import TwitchSerializer from "store/TwitchSerializer";


export default TwitchSerializer.extend({
	modelNameFromPayloadKey() {
		return "twitchChannel";
	},

	normalizeResponse( store, primaryModelClass, payload, id, requestType ) {
		payload = {
			twitchChannel: payload
		};

		return this._super( store, primaryModelClass, payload, id, requestType );
	}
});
