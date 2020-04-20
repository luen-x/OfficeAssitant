import API_ROOT from "@stores/apis/root";
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
					title: '提成名称',
					key: 'name',
					minWidth: 170
				},
				{
					title: '核算方式',
					key: 'account_method',
					minWidth: 150
				},
				{
					title: '提成起始比例',
					key: 'rate',
					minWidth: 150
				},
				{
					title: '提成起始额度（元）',
					key: 'separate',
					minWidth: 150
				},
				{
					title: '使用人数',
					key: 'staff_num',
					minWidth: 100
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
									this.$auth[1323] ? (params.row._disabled === false ? h('span', {
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

									(this.$auth[1323] && this.$auth[1324]) ? (params.row._disabled === false ? h('span', {
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

									this.$auth[1324] ? (params.row._disabled === false ? h('span', {
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
			this.$store.commit('COLLAGE_SETTING_PROMOTING_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('COLLAGE_SETTING_PROMOTING_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		// 点击修改
		handleAdjust(params) {
			PModal.popup({
				data: {
					action: 'adjust',
					info: params.row
				}
			}).then(res => {

				// 修改请求
				let rate = [];
				let separate = [];
				res.pointList.forEach(item1 => {
					rate.push(item1.rate);
					separate.push(item1.separate);
				});

				// 新增制度
				this.$request({
					url: API_ROOT._HR_SALARY_ADD_PER_GET,
					type: "GET",
					param: {
						...res,
						rate,
						separate,
						depart_id: this.depart_id
					},
					loading: false
				}).then(response => {
					this.$Message.success('操作成功');
					this.$store.commit('COLLAGE_SETTING_PROMOTING_LIST_INIT', this.depart_id);
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			}).catch(error => {});
		},
		handleDelete(params) {
			PModal.popup({
				data: {
					action: 'delete',
					info: params.row
				}
			}).then(res => {
				res === 1 ? this.$store.commit('COLLAGE_SETTING_PROMOTING_LIST_INIT', this.depart_id) : '';
			}).catch(() => {});
		},
	}
};

