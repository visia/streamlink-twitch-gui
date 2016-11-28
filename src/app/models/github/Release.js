import {
	attr,
	hasMany,
	Model
} from "EmberData";


export default Model.extend({
	assets: hasMany( "githubReleaseAsset", { async: true } ),
	body: attr( "string" ),
	draft: attr( "boolean" ),
	html_url: attr( "string" ),
	prerelease: attr( "boolean" ),
	published_at: attr( "date" ),
	tag_name: attr( "string" )

}).reopenClass({
	toString() { return "releases"; }
});
