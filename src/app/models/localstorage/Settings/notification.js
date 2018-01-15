import { attr } from "ember-data";
import { Fragment } from "model-fragments";


export const ATTR_NOTIFY_CLICK_NOOP = 0;
export const ATTR_NOTIFY_CLICK_FOLLOWED = 1;
export const ATTR_NOTIFY_CLICK_STREAM = 2;
export const ATTR_NOTIFY_CLICK_STREAMANDCHAT = 3;


export default Fragment.extend({
	enabled: attr( "boolean", { defaultValue: true } ),
	provider: attr( "string", { defaultValue: "auto" } ),
	filter: attr( "boolean", { defaultValue: true } ),
	filter_vodcasts: attr( "boolean", { defaultValue: true } ),
	grouping: attr( "boolean", { defaultValue: true } ),
	click: attr( "number", { defaultValue: 1 } ),
	click_group: attr( "number", { defaultValue: 1 } ),
	click_restore: attr( "boolean", { defaultValue: true } ),
	badgelabel: attr( "boolean", { defaultValue: true } )

}).reopenClass({

	providers: [
		{ value: "auto" },
		{ value: "native" },
		{ value: "snoretoast" },
		{ value: "growl" },
		{ value: "rich" }
	],

	filter: [
		{ value: true, label: "blacklist" },
		{ value: false, label: "whitelist" }
	],

	click: [
		{ id: ATTR_NOTIFY_CLICK_NOOP, label: "noop" },
		{ id: ATTR_NOTIFY_CLICK_FOLLOWED, label: "followed" },
		{ id: ATTR_NOTIFY_CLICK_STREAM, label: "stream" },
		{ id: ATTR_NOTIFY_CLICK_STREAMANDCHAT, label: "stream-and-chat" }
	],

	click_group: [
		{ id: ATTR_NOTIFY_CLICK_NOOP, label: "noop" },
		{ id: ATTR_NOTIFY_CLICK_FOLLOWED, label: "followed" },
		{ id: ATTR_NOTIFY_CLICK_STREAM, label: "stream" },
		{ id: ATTR_NOTIFY_CLICK_STREAMANDCHAT, label: "stream-and-chat" }
	]
});
