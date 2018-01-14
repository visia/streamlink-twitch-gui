import {
	computed,
	Controller
} from "ember";
import {
	locales as localesConfig,
	themes as themesConfig
} from "config";


const { locales } = localesConfig;
const { themes } = themesConfig;


export default Controller.extend({
	languages: computed(function() {
		return Object.keys( locales )
			.map( key => ({
				id: key,
				label: locales[ key ]
			}) );
	}),

	themes: computed(function() {
		return themes.map( id => {
			const label = id.substr( 0, 1 ).toUpperCase() + id.substr( 1 );

			return { id, label };
		});
	})
});
