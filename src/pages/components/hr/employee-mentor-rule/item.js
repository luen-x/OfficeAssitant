import {
	Dropdown,
	DropdownMenu,
	DropdownItem
} from 'iview';
import { getItem } from '@utils/utils';
import { AddApprentice } from './popup/add-apprentice.vue';
import { ReduceApprentice } from './popup/reduce-apprentice.vue';
import { ReduceMentor } from './popup/reduce-mentor.vue';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
				},
				{
					title: '手机号码',
					key: 'mobile',
				},
				{
					title: '工号',
					key: 'staff_number',
				},
				{
					title: '部门',
					key: 'depart_name',
				},
				{
					title: '职位',
					key: 'position_name',
				},
				{
					title: '关联徒弟',
					key: 'apprentice_names',
				},
				{
					title: '操作',
					key: 'status',
					render: (h, params) => {
						return (
							h(Dropdown, {
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
									h(DropdownItem, {
										props: {
											name: '0',
										}
									}, '新增徒弟'),
									h(DropdownItem, {
										props: {
											name: '1'
										},
									}, '减少徒弟'),
									h(DropdownItem, {
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
			const ids = getItem(`firstDepartId_${_global.version}`).res.data;
			switch (name) {
				case '0':
					
					AddApprentice.popup({
						master_id: params.row.master_id,
						first_depart_id: this.$route.query.first_depart_id || ids.sale
					}).then(res => {
						this.$store.commit('HR_EMPLOYEE_MENTOR_RELATION_LIST_INIT');
					});
					break;
				case '1':
					ReduceApprentice.popup({
						master_id: params.row.master_id,
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

