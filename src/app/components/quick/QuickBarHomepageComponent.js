import {
	get,
	set,
	computed,
	getOwner,
	inject
} from "ember";
import FormButtonComponent from "../button/FormButtonComponent";


const { service } = inject;


export default FormButtonComponent.extend({
	settings: service(),

	classNames: "btn-neutral",
	classNameBindings: "isHomepage:active",

	title: "Set as homepage",

	icon: "fa-home",
	iconanim: true,

	url: computed(function() {
		let router = getOwner( this ).lookup( "router:main" );
		let location = get( router, "location" );

		return location.getURL();
	}).volatile(),

	isHomepage: computed( "url", "settings.gui.homepage", function() {
		return get( this, "url" ) === get( this, "settings.gui.homepage" );
	}),


	action() {
		let settings = get( this, "settings.content" );
		let value    = get( this, "url" );
		if ( !settings || !value ) {
			return Promise.reject();
		}

		set( settings, "gui.homepage", value );
		return settings.save();
	}
});
