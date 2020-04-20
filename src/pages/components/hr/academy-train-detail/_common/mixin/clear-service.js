import { services } from '@stores/services/hr';

function parseKey(key) {
	return `clear${key.charAt(0).toUpperCase() + key.slice(1)}`;
}

export default function (serviceKeys) {
	return {
		methods: {
			clearService() {
				serviceKeys.forEach(key => {
					services[key]().methods[parseKey(key)]();
				});
			}
		}
	};
}