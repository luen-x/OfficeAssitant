import { Divider } from 'iview';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { DetailDrawer } from './popup/detail';
import { PModal } from './popup/modal.vue';

export default {
	data() {
		return {
			columns: [
				{
					title: '申请人',
					key: 'staff_name',
					fixed: 'left',
					width: 170,
					render: (h, params) => {
						return h('span', {
							class: "g-c-blue-mid g-pointer",
							style: {
								display: 'block',
								width: '100%'
							}
						}, params.row.staff_name);
					}
				},
				{
					title: '手机号码',
					key: 'mobile',
					fixed: 'left',
					width: 120,
					render: (h, params) => {
						return h('span', {
							class: "g-c-blue-mid g-pointer",
							style: {
								display: 'block',
								width: '100%'
							}
						}, params.row.mobile);
					}
				},
				{
					title: '申请性质',
					key: 'apply_nature_name',
					minWidth: 120
				},
				{
					title: '申请部门',
					key: 'apply_depart_name',
					minWidth: 150
				},
				{
					title: '职位',
					key: 'position_name',
					minWidth: 160
				},
				{
					title: '事项类型',
					key: 'event_type_name',
					minWidth: 160
				},
				{
					title: '事项主题',
					key: 'event_theme',
					minWidth: 290,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.event_theme}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '期待完成日期',
					key: 'expected_completion_time',
					minWidth: 160
				},
				{
					title: '申请时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: "操作",
					key: "action",
					fixed: "right",
					width: 140,
					align: 'center',
					render: (h, params) => {
						return h('div', {
							style: 'width: 100%;'
						}, [
							this.$auth[791] ? h('span', {
								class: "g-c-blue-mid g-pointer",
								on: {
									click: (e) => {
										this.handleAction(params, 'receive');
										e.stopPropagation();
									}
								}
							}, '领取') : null,
							(this.$auth[791] && this.$auth[792]) ? h('span', {
								style: {
									paddingLeft: '3px',
									paddingRight: '3px'
								}
							}, [
								h(Divider, {
									props: {
										type: 'vertical'
									}
								}, '')
							]) : null,
							this.$auth[792] ? h('span', {
								class: "g-c-blue-mid g-pointer",
								on: {
									click: (e) => {
										this.handleAction(params, 'reject');
										e.stopPropagation();
									}
								}
							}, '驳回') : null
						]);
					}
				}
			],
		};
	},
	methods: {
		handleShowDetail(params) {
			if (this.$auth[791]) {
				DetailDrawer.popup({
					info: params,
					type: 'basic'
				}).then(res => {
					// this.$refs.tableTarget.clearCurrentRow();
				}).catch(err => {
					// this.$refs.tableTarget.clearCurrentRow();
				});
			}
		},
		handleAction(params, name) {
			if (name === 'receive') {
				DetailDrawer.popup({
					info: params.row,
					type: 'basic'
				}).then(res => {
					// this.$refs.tableTarget.clearCurrentRow();
				}).catch(err => {
					// this.$refs.tableTarget.clearCurrentRow();
				});
			} else {
				PModal.popup({
					data: params.row,
					type: name
				}).then(res => {
				}).catch(err => {});
			}
		},
	}
};

