import callService from "@components/sale/call-manage/call/service";
import { CallModal } from "@components/sale/call-manage/call/call-modal";

const initialState = {
	auth: 1,
	// _global.user.seat_number && _global.user.seat_number !== "0",
	status: "2",
	show: false,
	call_id: undefined,
	customerList: [
		// {
		// 	'relation_type': 0, // 关联类型 1 成交客户 2 客户
		// 	'relation_id': 0, // 关联的主键ID
		// 	'company_name': "公司名", // 公司名
		// 	link_id:1, // 联系方式id
		// 	'customer_name': "客户名", // 客户名/法人
		// 	'tel': "电话", // 电话号
		// 	'attribution': '白名单', // 归属方
		// 	'call': 0, // 是否可以拨打 1 可以
		// 	'tips': '该号码存在于白名单中,无法拨打', // 无法拨打的原因
		// 	"sign": [ // 标记原因 没有则空
		// 		{
		// 			"num": 1,
		// 			"reason": "名字录错"
		// 		}
		// 	]
		// }
	],
	callingPhone: "",
	selectedRelationId: 0,
	popType: '', // 弹出类型 1是呼入 ‘’ 是呼出
};

const mutations = {
	CALL_MODAL_CHANGE_STATUS(state, data) {
		state.status = data.status;
	},
	CALL_MODAL_CHANGE_CALL_ID(state, data) {
		state.call_id = data.call_id;
	},
	CALL_MOADL_CHANGE_RELATION_ID(state, data) {
		state.selectedRelationId = data.relation_id;
	},
	CALL_MODAL_SHOW(state, data) {
		state.callingPhone = data.phone;
		if (!state.show && data.show) {
			CallModal.popup({ autoDestory: false });
		}
		state.show = data.show;
		state.popType = data.popType || '';
	},
	CALL_MODAL_CHANGE_PHONE(state, data) {
		state.callingPhone = data.phone;
	},
	CALL_MODAL_CHANGE_INFO(state, data) {
		state.customerList = data.customerList;

	},
	CALL_MODAL_CHANGE_AUTH(state, data) {
		state.auth = data.auth;
	}
};

export const saleCallModal = {
	state: initialState,
	mutations
};
