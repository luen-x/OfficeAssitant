import { Divider } from 'iview';
import { DelTipModal } from '../../hr/_common/delete-tip';
import { modifyDrawer } from './popup/drawer.vue';

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
					title: '起始提成比例',
					key: 'rate',
					minWidth: 150
				},
				{
					title: '起始提成额度（元）',
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
									this.$auth[1328] ? (params.row._disabled === false ? h('span', {
										class: "g-c-blue-mid g-pointer",
										on: {
											click: () => {
												this.handleShowDetail(params);
											}
										}
									}, '修改') : h('span', {
										style: {
											color: '#bbbbbb'
										}
									}, '修改')) : null,

									(this.$auth[1328] && this.$auth[1329]) ? (params.row._disabled === false ? h('span', {
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

									this.$auth[1329] ? (params.row._disabled === false ? h('span', {
										class: "g-c-blue-mid g-pointer",
										on: {
											click: (e) => {
												this.handleDelete(params);
												e.stopPropagation();
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
			this.$store.commit('COLLAGE_SETTING_TEAM_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('COLLAGE_SETTING_TEAM_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		// 点击修改
		handleShowDetail(params) {
			if (!params._disabled) {
				modifyDrawer.popup({
					info: params,
					type: 'modify',
					depart_id: this.depart_id
				}).then(res => {
					this.$store.commit('COLLAGE_SETTING_TEAM_LIST_INIT');
				}).catch(() => {
				});
			}
		},
		// 点击删除
		handleDelete(params) {
			DelTipModal.popup({
				title: '删除提成制度',
				content: '是否确认删除该提成制度?'
			}).then(res => {
				this.$request({
					url: '_HR_SALARY_DELETE_PER_GET',
					type: "GET",
					param: {
						rate_case_id: params.row.rate_case_id
					},
					loading: false
				}).then(response => {
					this.$Message.success("操作成功");
					this.$store.commit('COLLAGE_SETTING_TEAM_LIST_INIT', this.depart_id);
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			}).catch(() => {});
		},
	}
};

