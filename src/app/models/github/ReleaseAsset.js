import {
	attr,
	Model
} from "EmberData";


export default Model.extend({
	browser_download_url: attr( "string" ),
	content_type: attr( "string" ),
	name: attr( "string" ),
	size: attr( "number" ),
	state: attr( "string" )

}).reopenClass({
	toString: function() { return "releases"; }
});
