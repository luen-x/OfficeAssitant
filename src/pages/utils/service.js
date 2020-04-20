import { PropModal } from '@components/sale/_common/property/prop-modal';
import net from "./net"; 


const service = {
	// 公海领取资料
	async getCustomer(customerId) {
		const surplus = await net.ajax({
			url: "_SALE_SEA_CUSTOMER_SURPLUS_GET",
			type: "GET",
			param: {},
			loading: false,
		}).catch((res) => {
			console.error(res);
			app.$Message.error(res.msg);
			return res;
		});
		if (surplus.status == 0) return Promise.reject();
		if (surplus.data.surplus_num === "0") { // 字符串0
			return PropModal.popup({
				type: 3,
				customerId
			});
		} else {
			return net.ajax({
				url: "_SALE_SEA_GET_CUSTOMER_POST",
				type: 'POST',
				loading: false,
				param: {
					customer_id: customerId
				},
				autoTip: false
			}).catch(res => {
				console.error(res);
				app.$Message.error(res.msg);
				return Promise.reject(res);
			}).then(res => {
				if (res.data.error_code) {
					app.$Message.error(res.data.error_msg);
					return Promise.reject(res);
				} else {
					app.$Message.success(res.msg);
					return Promise.resolve(res);
				}
			});
		}


	}
};
export default service;