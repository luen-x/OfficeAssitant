import { Audit, Complaint, Info } from './tabs';

const contractTabs = [
	{
		label: '客户信息',
		Component: Info,
		value: '1'
	},
	{
		label: '服务确认',
		Component: Audit,
		value: '2'
	}, 
	{
		label: '投诉记录',
		Component: Complaint,
		value: '3'
	} 
];
export default {
	data() {
		return {
			contractTabs
		};
	},
	computed: {
		getTabs() {
			// let tabsHandled;
			// tabsHandled = [...contractTabs];
			// switch (this.type) {
			// 	case '1':
			// 		tabsHandled.splice(3, 1);
			// 	case '3':
			// 		tabsHandled.splice(3, 3);
			// 		break;
			// 	case '2':
			// 		tabsHandled.splice(3, 2);
			// 		break;
			// 	default:
			// }
			// return tabsHandled;
			return this.contractTabs;
		}
	}
};