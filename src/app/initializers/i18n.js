import {
	set,
	EmberNativeArray,
	Application
} from "ember";
import {
	compileTemplate,
	missingMessage,
	getConfig
} from "ember-addon-i18n";
import {
	locales as localesConfig
} from "config";


const modules = require.context( "locales", true, /^.\/[a-z]{2}(?:-[a-z]{2})?\/[\w-]+\.yml$/ );


const { hasOwnProperty } = {};
const { locales } = localesConfig;


Application.instanceInitializer({
	name: "i18n",

	initialize( application ) {
		const i18nService = application.lookup( "service:i18n" );

		// register ember-i18n stuff
		application.register( "util:i18n/compile-template", compileTemplate );
		application.register( "util:i18n/missing-message", missingMessage );

		// remove ember-i18n's requirejs lookups
		set( i18nService, "locales", new EmberNativeArray( Object.keys( locales ) ) );

		// redefine the regexp here (with capture groups)
		// webpack has to be able to statically analyze the import statement above (require.context)
		const reTranslations = /^.\/([a-z]{2}(?:-[a-z]{2})?)\/([\w-]+)\.yml$/;
		const translations = {};
		for ( const key of modules.keys() ) {
			const [ , locale, namespace ] = reTranslations.exec( key );

			if ( !hasOwnProperty.call( translations, locale ) ) {
				translations[ locale ] = {};
			}

			translations[ locale ][ namespace ] = modules( key );
		}

		// register locale config and translations
		for ( const [ locale, data ] of Object.entries( translations ) ) {
			const config = getConfig( locale );
			application.register( `locale:${locale}/config`, config );

			application.register( `locale:${locale}/translations`, data );
			i18nService.addTranslations( locale, data );
		}
	}
});
