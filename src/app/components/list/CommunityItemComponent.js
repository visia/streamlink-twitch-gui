import {
	get,
	inject
} from "ember";
import ListItemComponent from "./ListItemComponent";
import layout from "templates/components/list/CommunityItemComponent.hbs";


const { service } = inject;


export default ListItemComponent.extend({
	routing: service( "-routing" ),

	layout,

	classNames: [ "community-item-component" ],

	click() {
		let community = get( this, "content.id" );
		get( this, "routing" ).transitionTo( "communities.community", community );
	}
});
