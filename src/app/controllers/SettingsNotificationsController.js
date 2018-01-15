import {
	get,
	computed,
	inject,
	Controller
} from "ember";
import {
	main,
	files
} from "config";
import { isDebug } from "nwjs/debug";
import SettingsNotification from "models/localstorage/Settings/notification";
import NotificationData from "services/NotificationService/data";
import {
	isSupported,
	showNotification
} from "services/NotificationService/provider";
import { isWin } from "utils/node/platform";
import resolvePath from "utils/node/resolvePath";


const { service } = inject;

const { "display-name": displayName } = main;
const { icons: { big: bigIcon } } = files;


export default Controller.extend({
	i18n: service(),

	SettingsNotification,

	// filter available notification providers
	providers: computed(function() {
		return SettingsNotification.providers
			.filter( item => isSupported( item.value ) || item.value === "auto" );
	}),

	actions: {
		testNotification( success, failure ) {
			const i18n = get( this, "i18n" );
			const provider = get( this, "model.notification.provider" );
			const message = i18n.t( "settings.notifications.provider.test.message" ).toString();
			const icon = isWin && !isDebug
				? resolvePath( "%NWJSAPPPATH%", bigIcon )
				: resolvePath( bigIcon );

			const data = new NotificationData({
				title: displayName,
				icon: icon,
				message
			});

			showNotification( provider, data, true )
				.then( success, failure )
				.catch( () => {} );
		}
	}
});
