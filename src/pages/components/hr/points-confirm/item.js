import { Dropdown, DropdownMenu, DropdownItem, Tooltip } from 'iview';
import { AllocateModal } from './popup/allocate.vue';
import { AddComplaintModal } from './popup/add-complaint.vue';
import { DetailDrawer } from '../points/detail.vue';

export default {
	data() {
		return {
			columns: [
				{
					title: '客户',
					key: 'title',
					fixed: 'left',
					minWidth: 250,
					render: (h, params) => {
						let company_name = params.row.company_name.length
							> 15 ? `${params.row.company_name.substring(0, 15)}...` : params.row.company_name;
						return params.row.company_name.length
						> 15 ? h('span', {
								class: "g-operation g-oneline",
							}, [
								h(Tooltip, {
									props: {
										content: params.row.company_name,
										transfer: true
									}
								}, company_name)
							]) : h('span', {
								class: "g-operation g-oneline",
							}, company_name);
					}
				},
				{
					title: '服务人',
					key: 'service_staff_name',
					minWidth: 100,
					tooltip: true
				},
				{
					title: '负责人',
					key: 'check_staff_name',
					minWidth: 200,
					tooltip: true
				},
				{
					title: '待确认服务',
					key: 'wait_confirm_count',
					minWidth: 150,
					tooltip: true
				},
				{
					title: '累计服务次数',
					key: 'service_count',
					minWidth: 150,
					tooltip: true
				},
				{
					title: '最近服务时间',
					key: 'last_service_time',
					minWidth: 160,
					tooltip: true
				},
				{
					title: '操作',
					key: 'opt',
					fixed: 'right',
					width: 100,
					align: 'center',
					render: (h, params) => {
						let self = this;
						let itemConfirmShow = 'none';
						let itemDetailShow = 'none';
						if (this.type !== '4') {
							itemConfirmShow = 'block';
						}
						if (this.type == '4') {
							itemDetailShow = 'block';
						}
						return (
							h(Dropdown, {
								style: 'cursor: pointer; width: 100%; height: 100%; text-align: center;',
								props: { transfer: true, placement: 'left-start' },
								on: {
									'on-click': function (name) {
										if (name === '1') {
											let arr = [];
											let obj = {};
											obj.service_staff_id = params.row.staff_id;
											obj.contract_company_id = params.row.contract_company_id;
											arr.push(obj);
											AllocateModal.popup({ customer_info: arr }).then(res => {
												app.$store.commit('HR_POINTS_CONFIRM_LIST_INIT');
											});
										} else if (name === '2') {
											DetailDrawer.popup({
												contract_company_id: params.row.contract_company_id,
												label: '2'
											}).then(res => {});
										} else if (name === '3') {
											DetailDrawer.popup({
												contract_company_id: params.row.contract_company_id
											}).then(res => {});
										} else if (name === '4') {
											AddComplaintModal.popup({
												datas: params.row,
												contract_company_id: params.row.contract_company_id
											}).then(res => {
												app.$store.commit('HR_POINTS_CONFIRM_LIST_INIT');
											});
										}
									}
								}
							}, [
								h('i', {
									class: 'iconfont icon-point',
									style: 'font-size: 20px'
								}),
								h(DropdownMenu, {
									slot: 'list'
								}, [
									this.$auth[262] ? h(DropdownItem, {
										props: {
											name: '1',
										},
									}, '分配') : '',
									this.$auth[263] ? h(DropdownItem, {
										props: {
											name: '2',
										},
										style: {
											display: itemConfirmShow
										}
									}, '服务确认') : '',
									h(DropdownItem, {
										props: {
											name: '3',
										},
										style: {
											display: itemDetailShow
										}
									}, '查看'),
									this.$auth[264] ? h(DropdownItem, {
										props: {
											name: '4'
										}
									}, '添加投诉') : ''
								])
							])
						);
					}
				}
			],
		};
	},
	computed: {
		getColumns() {
			const columns = [...this.columns];
			if (this.$auth[261]) {
				(this.type == '1' || this.type == '2') && columns.unshift(
					{
						type: 'selection',
						fixed: 'left',
						width: 50,
					},
				);
			}
			return columns;
		}
	},
	methods: {
		handleOpenDrawer(row) {
			DetailDrawer.popup({
				contract_company_id: row.contract_company_id
			}).then(err => {
				this.$refs.selection[this.type - 1].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.selection[this.type - 1].$refs.tableTarget.clearCurrentRow();
			});
		},
		handleResetFirst() {
			this.$store.commit('HR_POINTS_CONFIRM_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_POINTS_CONFIRM_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

