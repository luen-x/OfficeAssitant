import API_ROOT from '@stores/apis/root';
import { Divider } from 'iview';
import { PModal } from './popup/modal.vue';

export default {
	data() {
		return {
			columns: [
				{
					type: 'selection',
					width: 60,
				},
				{
					title: '底薪名称',
					key: 'name',
					minWidth: 170
				},
				{
					title: '核算方式',
					key: 'account_method',
					minWidth: 150
				},
				{
					title: '底薪额',
					key: 'amount',
					minWidth: 120
				},
				{
					title: '工龄工资',
					key: 'has_work_age',
					minWidth: 120,
					render: (h, params) => {
						return h('span', {}, params.row.has_work_age === 1 ? '有' : '无');
					}
				},
				{
					title: '使用人数',
					key: 'staff_num',
					minWidth: 120
				},
				{
					title: '操作',
					key: 'action',
					width: 140,
					align: 'center',
					render: (h, params) => {
						return h(
							"span",
							{},
							[
								h('span', {}, [
									this.$auth[253] ? (params.row._disabled === false ? h('span', {
										class: "g-c-blue-mid g-pointer",
										on: {
											click: () => {
												this.handleAdjust(params);
											}
										}
									}, '修改') : h('span', {
										style: {
											color: '#bbbbbb'
										}
									}, '修改')) : null,

									(this.$auth[253] && this.$auth[254]) ? (params.row._disabled === false ? h('span', {
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
									]) : h('span', {
										class: "iconfont icon-vertical-line g-fs-10 g-m-l-5 g-m-r-5",
										style: {
											color: 'black'
										}
									}, '')) : null,

									this.$auth[254] ? (params.row._disabled === false ? h('span', {
										class: "g-c-blue-mid g-pointer",
										on: {
											click: () => {
												this.handleDelete(params);
											}
										}
									}, '删除') : h('span', {
										style: {
											color: '#bbbbbb'
										}
									}, '删除')) : null
								])
							]
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_SALARY_BASE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_SALARY_BASE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		// 点击修改
		handleAdjust(params) {
			PModal.popup({
				data: {
					action: 'adjust',
					info: params.row,
					depart_id: this.depart_id
				}
			}).then(res => {

				// 修改请求
				this.$request({
					url: API_ROOT._HR_SALARY_ADD_BASE_GET,
					type: "GET",
					param: {
						...res,
						depart_id: this.depart_id
					},
					loading: false
				}).then(response => {
					this.$Message.success('操作成功');
					this.$store.commit('HR_SALARY_BASE_LIST_INIT', this.depart_id);
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			}).catch(error => {});
		},
		// 点击删除
		handleDelete(params) {
			PModal.popup({
				data: {
					action: 'delete',
					info: params.row
				}
			}).then(res => {
				this.$store.commit('HR_SALARY_BASE_LIST_INIT', this.depart_id);
			}).catch(() => {});
		},
	}
};

