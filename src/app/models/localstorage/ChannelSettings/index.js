import {
	attr,
	Model
} from "ember-data";
import SettingsStreaming from "models/localstorage/Settings/streaming";
import SettingsStreams from "models/localstorage/Settings/streams";
import SettingsNotification from "models/localstorage/Settings/notification";


/**
 * @type {Object.<string,[(Model|Fragment),string,string]>}
 */
const attributes = {
	streaming_quality: [ SettingsStreaming, "quality", "streaming.quality" ],
	streams_chat_open: [ SettingsStreams, "chat_open", "streams.chat_open" ],
	notification_enabled: [ SettingsNotification, "enabled", "notification.enabled" ]
};

for ( const [ name, [ settings, prop, settingsPath ] ] of Object.entries( attributes ) ) {
	const meta = settings.metaForProperty( prop );
	if ( !meta || !meta.isAttribute ) { continue; }

	attributes[ name ] = attr( meta.type, {
		defaultValue: null,
		// the ChannelSettingsController needs this attribute option
		settingsPath
	});
}


export default Model.extend( attributes ).reopenClass({
	toString() { return "ChannelSettings"; }
});
