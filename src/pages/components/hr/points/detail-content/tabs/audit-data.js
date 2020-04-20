import { Tooltip, Tag } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import { DetailModal } from './popup/detail.vue';
import { ConfirmModal } from './popup/confirm.vue';

export default {
	data() {
		return {
			show: true,
			inputShow: false,
			page: {
				'show-total': true
			},
			waitAuditList: [],
			auditedList: [],
			waitAuditTitle: [
				{
					minWidth: 130,
					key: 'service_name',
					render: (h, params) => {
						return params.row.service_name ? h('span', {}, params.row.service_name)
							: h('span', {
							}, '--');
					}
				},
				{
					minWidth: 270,
					key: 'opt',
					render: (h, params) => {
						return h('div', [
							Number(params.row.agent_num) > 0 ? h('span', {
								style: {
									color: '#000'
								}
							}, '代理人数：' + params.row.agent_num + '人； ') : '-',
							Number(params.row.return_amount) > 0 ? h('span', {
								style: {
									color: '#000'
								}
							}, '回款金额' + params.row.return_amount + '万元；') : '-'
						]);
					}
				},
				{
					minWidth: 90,
					key: 'opt',
					render: (h, params) => {
						return Number(params.row.need_voucher) ? h('span', {
							style: {
								marginRight: '5px',
								color: '#2e9dfa',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									if (!params.row.fileImage.length) {
										this.$Message.warning('暂无可查看凭证');
									} else {
										let arr = [];
										params.row.fileImage.map(item => {
											arr.push(item.src);
											return;
										});
										ImgsPreview.popup({
											visible: true,
											dataSource: arr,
										});
									}
								}
							}
						}, '查看凭证')
							: h('span', {
							}, '--');
					}
				},
				{
					minWidth: 70,
					key: 'opt',
					render: (h, params) => {
						return params.row.remarks ? h(Tooltip, {
							props: {
								transfer: true,
								trigger: "hover",
								content: params.row.remarks,
								maxWidth: "300",
								placement: 'top'
							},
							style: {
								marginRight: '5px',
								color: '#2397f9',
								cursor: 'pointer'
							},
							on: {
								click: () => {

								}
							}
						}, '备注')
							: h('span', {
							}, '--');
					}
				},
				{
					minWidth: 70,
					key: 'opt',
					render: (h, params) => {
						return h('span', {
							style: {
								marginRight: '5px',
								color: '#2397f9',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									ConfirmModal.popup({
										datas: params.row,
										contract_company_id: this.contract_company_id
									}).then(res => {
										this.getAuditList();
									});
								}
							}
						}, '确认');
					}
				}
			],
			auditedTitle: [
				{
					minWidth: 130,
					key: 'service_name',
					render: (h, params) => {
						return params.row.service_name ? h('span', {
						}, params.row.service_name)
							: h('span', {
							}, '--');
					}
				},
				{
					minWidth: 270,
					key: 'opt',
					render: (h, params) => {
						return h('div', [
							Number(params.row.agent_num) > 0 ? h('span', {
								style: {
									color: '#000'
								}
							}, '代理人数：' + params.row.agent_num + '人； ') : '-',
							Number(params.row.return_amount) > 0 ? h('span', {
								style: {
									color: '#000'
								}
							}, '回款金额' + params.row.return_amount + '万元；') : '-'
						]);
					}
				},
				{
					minWidth: 90,
					key: 'opt',
					render: (h, params) => {
						return Number(params.row.need_voucher) ? h('span', {
							style: {
								marginRight: '5px',
								color: '#2397f9',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									if (!params.row.fileImage.length) {
										this.$Message.warning('暂无可查看凭证');
									} else {
										let arr = [];
										params.row.fileImage.map(item => {
											arr.push(item.src);
											return;
										});
										ImgsPreview.popup({
											visible: true,
											dataSource: arr,
										});
									}
								}
							}
						}, '查看凭证')
							: h('span', {
							}, '--');
					}
				},
				{
					minWidth: 70,
					key: 'opt',
					render: (h, params) => {
						return params.row.remarks ? h(Tooltip, {
							props: {
								transfer: true,
								trigger: "hover",
								content: params.row.remarks,
								maxWidth: "300",
								placement: 'top'
							},
							style: {
								marginRight: '5px',
								color: '#2397f9',
								cursor: 'pointer'
							}
						}, '备注')
							: h('span', {
							}, '--');
					}
				},
				{
					minWidth: 70,
					key: 'opt',
					render: (h, params) => {
						return h('span', {
							style: {
								marginRight: '5px',
								color: '#2397f9',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									DetailModal.popup({
										datas: params.row
									}).then(res => {});
								}
							}
						}, '查看');
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SC_SERVICE_QUALITY_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SC_SERVICE_QUALITY_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

