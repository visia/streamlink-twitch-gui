import { attr } from "ember-data";
import { Fragment } from "model-fragments";
import {
	langs as langsConfig
} from "config";


const attributes = {};
for ( const [ code, { disabled } ] of Object.entries( langsConfig ) ) {
	if ( disabled ) { continue; }
	attributes[ code ] = attr( "boolean", { defaultValue: false } );
}


export default Fragment.extend( attributes );
