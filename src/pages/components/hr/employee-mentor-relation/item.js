import {
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Tooltip
} from 'iview';
import { AddModal } from './popup/audit.vue';
import { ReduceApprentice } from './popup/reduce-apprentice.vue';
import { ReduceMentor } from './popup/reduce-mentor.vue';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					minWidth: 200,
					key: 'staff_name',
				},
				{
					title: '手机号码',
					minWidth: 120,
					key: 'mobile',
				},
				{
					title: '工号',
					minWidth: 120,
					key: 'staff_number',
				},
				{
					title: '部门',
					minWidth: 150,
					key: 'depart_name',
				},
				{
					title: '职位',
					minWidth: 150,
					key: 'position_name',
				},
				{
					title: '关联徒弟',
					minWidth: 220,
					key: 'apprentice_names',
					render: (h, params) => {
						const { apprentice_names } = params.row;
						return (
							<div>
								{apprentice_names.length > 15
									? <Tooltip 
										transfer 
										placement="bottom"
										style="display: block;maxWidth:200px"
									>
										<div>{apprentice_names.substr(0, 15) + '...'}</div>
										<div slot="content">
											<p style="whiteSpace: normal">
												{apprentice_names}
											</p>
										</div>
									</Tooltip>
									: apprentice_names}
							</div>
						);
					}
				},
				{
					title: '操作',
					width: 100,
					key: 'status',
					render: (h, params) => {
						return (
							(this.$auth['922'] || this.$auth['920'] || this.$auth['921']) && h(Dropdown, {
								props: {
									transfer: true, placement: 'left-start'
								},
								on: {
									'on-click': (name) => this.handleClick(name, params)
								}
							}, [
								h('i', {
									class: 'iconfont icon-point',
									style: 'font-size: 20px'

								}),
								h(DropdownMenu, {
									slot: 'list'
								}, [
									this.$auth['920'] && h(DropdownItem, {
										props: {
											name: '0',
										}
									}, '新增徒弟'),
									this.$auth['921'] && params.row.is_hide === 0 && h(DropdownItem, {
										props: {
											name: '1'
										},
									}, '减少徒弟'),
									this.$auth['922'] && params.row.is_cancel === 1 && h(DropdownItem, {
										props: {
											name: '2'
										}
									}, '师傅取消')
								])
							])
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_EMPLOYEE_MENTOR_RELATION_LIST_INIT');
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleClick(name, params) {
			switch (name) {
				case '0':
					AddModal.popup({
						master_id: params.row.master_id,
						first_depart_id: this.$route.query.first_depart_id || (this.tabs.length && String(this.tabs[0].first_depart_id)),
						type: 2
					}).then(res => {
						this.$store.commit('HR_EMPLOYEE_MENTOR_RELATION_LIST_INIT');
					});
					break;
				case '1':
					ReduceApprentice.popup({
						master_id: params.row.master_id,
						apprentice_arr: params.row.apprentice_arr,
					}).then(res => {
						this.$store.commit('HR_EMPLOYEE_MENTOR_RELATION_LIST_INIT');
					});
					break;
				case '2':
					ReduceMentor.popup({
						master_id: params.row.master_id,
					}).then(res => {
						this.$store.commit('HR_EMPLOYEE_MENTOR_RELATION_LIST_INIT');
					});
					break;
				default:
					break;
			}
		}
	}
};

