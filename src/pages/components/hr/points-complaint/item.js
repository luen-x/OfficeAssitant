import { Dropdown, DropdownMenu, DropdownItem, Tooltip } from 'iview';
import { EditComplaintModal } from './popup/edit-complaint.vue';
import { DeleteComplaintModal } from './popup/delete-complaint.vue';
import { DetailDrawer } from '../points/detail.vue';

export default {
	data() {
		return {
			columns: [
				{
					title: '客户',
					key: 'contract_company_id',
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
					title: '投诉方式',
					key: 'complain_type_name',
					minWidth: 120,
					tooltip: true
				},
				{
					title: '投诉对象',
					key: 'complain_staff_name',
					minWidth: 180,
					tooltip: true
				},
				{
					title: '投诉部门',
					key: 'complain_depart_name',
					minWidth: 100,
					tooltip: true
				},
				{
					title: '投诉内容',
					key: 'complain_content',
					minWidth: 170,
					tooltip: true
				},
				{
					title: '投诉证明人',
					key: 'prove_name',
					minWidth: 100,
					tooltip: true
				},
				{
					title: '投诉时间',
					key: 'complain_time',
					minWidth: 150,
					tooltip: true
				},
				{
					title: '提交时间',
					key: 'create_time',
					minWidth: 150,
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
						return (
							h(Dropdown, {
								style: 'cursor: pointer; width: 100%; height: 100%; text-align: center;',
								props: { transfer: true, placement: 'left-start' },
								on: {
									'on-click': function (name) {
										if (name === '1') {
											DeleteComplaintModal.popup({
												complain_record_id: params.row.complain_record_id
											}).then(res => {
												self.$store.commit('HR_POINTS_COMPLAINT_LIST_INIT');
											});
										} else if (name === '2') {
											EditComplaintModal.popup({
												datas: params.row,
												contract_company_id: params.row.contract_company_id
											}).then(res => {
												self.$store.commit('HR_POINTS_COMPLAINT_LIST_INIT');
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
									this.$auth[268] ? h(DropdownItem, {
										props: {
											name: '1',
										},
									}, '删除') : '',
									this.$auth[267] ? h(DropdownItem, {
										props: {
											name: '2',
										}
									}, '编辑') : ''
								])
							])
						);
					}
				}
			],
		};
	},
	methods: {
		handleOpenDrawer(row) {
			DetailDrawer.popup({
				type: this.type,
				contract_company_id: row.contract_company_id
			}).then(err => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
			});
		},
		handleResetFirst() {
			this.$store.commit('HR_POINTS_COMPLAINT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_POINTS_COMPLAINT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

