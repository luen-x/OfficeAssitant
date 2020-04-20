import { GrabCustomer } from "@components/sale/_common/customer/grab-customer";

let modal;
export default (data) => {
	app.$vc.emit('SALE_CUSTOMER_DROP_TO_SEA', data);
	if (!modal) {
		modal = GrabCustomer.popup({
			customerList: [data]
		}).then((list) => {
		}).finally(() => modal = undefined);
	}


};