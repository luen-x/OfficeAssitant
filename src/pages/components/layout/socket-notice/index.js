import { Confirm } from '@components/_common/confirm/confirm';
import { GrabCustomer } from "@components/sale/_common/customer/grab-customer";
import { PaymentAdd } from './modals/payment-add';
import { FollowTime } from './modals/follow-time';
import { ScDeallocate } from './modals/sc-deallocate.vue';
import createImportHandler from './handlers/importHandler';
import dropToSeaHandler from './handlers/dropToSeaHandler';

let modalCount = 0;
const midWares = [
	(pro) => {
		const re = pro.then(() => {
			modalCount--;
		}).catch(() => {
			modalCount--;
		});
		modalCount++;
		return re;
	}
];
const excuteModal = (modal, data) => {
	let pro = modal.popup({ data, cName: 'modal' + modalCount, index: modalCount });
	for (let i = 0; i < midWares.length; i++) {
		pro = midWares[i](pro);
	}
};

const handler = {
	'102': (data) => app.$store.commit('NOTICE_COUNT_ADD'),
	'104': (data) => data.remind_type && app.$store.commit('SOCKET_COMMON_NOTICE_UNREAD', { remind_type: data.remind_type }),
	'105': (data) => app.$store.commit('NOTICE_COUNT_SET', data.no_read_count),
	'106': (data) => excuteModal(PaymentAdd, data),
	'107': (data) => excuteModal(FollowTime, data),
	'108': (data) => {
		app.$store.commit('SALE_CUSTOMER_INTENTION_PRIVATE_PERCENT_UPDATE', data);
		if (!data.status) {
			Confirm.popup({ title: "提示", msg: data.msg, cancelText: '', okText: '知道了' }).catch(() => {});
		}
		if (data.status == 2) {
			app.$store.commit('SALE_CUSTOMER_INTENTION_PRIVATE_LIST_INIT');
		}
	},
	'109': (data) => excuteModal(ScDeallocate, data),
	...createImportHandler({
		event: '110',
		mutation: 'HR_ACADEMY_ELITE_TALENT_PERCENT_UPDATE',
		initListMutation: 'HR_ACADEMY_ELITE_TALENT_LIST_INIT',
		successTip: '导入人才梯队成功'
	}),
	...createImportHandler({
		event: '111',
		mutation: 'HR_ACADEMY_COURSE_PAPER_PERCENT_UPDATE',
		initListMutation: 'HR_ACADEMY_COURSE_PAPER_LIST_INIT',
		successTip: '导入试卷库成功'
	}),
	...createImportHandler({
		event: '112',
		mutation: 'HR_ACADEMY_COURSE_QUESTION_PERCENT_UPDATE',
		initListMutation: 'HR_ACADEMY_COURSE_QUESTION_LIST_INIT',
		successTip: '导入题库成功'
	}),
	'113': dropToSeaHandler

};

export default handler;