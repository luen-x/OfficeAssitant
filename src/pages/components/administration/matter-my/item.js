import { Divider } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { DetailDrawer } from '../matter-sea/popup/detail.vue';
import { myModal } from './popup/modal.vue';

export default {
	data() {
		return {
			columns: {
				'1': this.getColumns('1'),
				'2': this.getColumns('2'),
				'3': this.getColumns('3'),
				'4': this.getColumns('4'),
				'5': this.getColumns('5'),
			},
		};
	},
	methods: {
		handleShowDetail(params) {
			DetailDrawer.popup({
				info: params,
				type: this.type
			}).then(res => {
				// this.$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				// this.$refs.tableTarget.clearCurrentRow();
			});
		},
		// 排序方式变化
		handleSortChange(obj) {
			let { query = {} } = getParseUrl();
			query[`order_by_${obj.key}`] = obj.order === 'asc' ? 0 : 1;

			this.$router.replace(getHashUrl('/administration/matter/my', { ...query }));
			this.$store.commit('ADMINISTRATION_MATTER_MY_LIST_INIT');
		},
		handleAction(params, name) {
			if (name === 'pass') {
				DetailDrawer.popup({
					info: params.row,
					type: this.type
				}).then(res => {
					// this.$refs.tableTarget.clearCurrentRow();
				}).catch(err => {
					// this.$refs.tableTarget.clearCurrentRow();
				});
			} else if (name === 'complete') {
				myModal.popup({
					info: params.row,
					type: name,
					requestFn: (res) => {
						this.$request({
							url: '_ADMINISTRATION_COMPLETE_EVENT_POST',
							type: "POST",
							param: { ...res.data },
							loading: false
						}).then(response => {
							res.cb && res.cb();
							this.$store.commit('ADMINISTRATION_MATTER_MY_LIST_INIT');
							this.$Message.success('事项完成，赞一个');
						}).catch(err => {
							this.$Message.error(err.msg);
						});
					}
				}).then(res => {});
			} else {
				myModal.popup({
					info: params.row,
					type: name,
					requestFn: (res) => {
						res.cb();
						this.$emit('destory');
					}
				}).then(res => {});
			}
		},
		getColumns(type) {
			let columns = [
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
					title: '优先级',
					key: 'priority',
					sortable: 'custom',
					minWidth: 100,
					render: (h, params) => {
						const colors = ['#d71319', '#d83615', '#db7c12', '#dcbe1a', '#a8dc1a'];
						return h('div', {
							class: 'g-m-r-10 g-br-sem g-lh-16',
							style: {
								width: '16px',
								height: '16px',
								textAlign: 'center',
								color: '#fff',
								backgroundColor: `${colors[params.row.priority - 1]}`
							}
						}, params.row.priority);
					}
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
						const is_edit = params.row.list_is_edit;

						return h('div', {
							style: 'width: 100%;',
						}, [
							this.type == '1' ? [
								this.$auth[794] ? h('span', {
									class: "g-c-blue-mid g-pointer",
									on: {
										click: (e) => {
											this.handleAction(params, 'pass');
											e.stopPropagation();
										}
									}
								}, '通过') : null,
								(this.$auth[794] && this.$auth[795]) ? h('span', {
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
								this.$auth[795] ? h('span', {
									class: "g-c-blue-mid g-pointer",
									on: {
										click: (e) => {
											this.handleAction(params, 'reject');
											e.stopPropagation();
										}
									}
								}, '驳回') : null
							] : [
								(this.$auth[796] && is_edit == 1) ? h('span', {
									class: "g-c-blue-mid g-pointer",
									on: {
										click: (e) => {
											this.handleAction(params, 'assign');
											e.stopPropagation();
										}
									}
								}, '指派') : null,
								(this.$auth[796] && this.$auth[797] && is_edit == 1) ? h('span', {
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
								(this.$auth[797] && is_edit == 1) ? h('span', {
									class: "g-c-blue-mid g-pointer",
									on: {
										click: (e) => {
											this.handleAction(params, 'complete');
											e.stopPropagation();
										}
									}
								}, '完成') : null
							]
						]);
					}
				}
			];

			switch (type) {
				case '1':
					return columns;
				case '2':
					columns.splice(8, 0, {
						title: '总负责人',
						key: 'head_staff_name',
						minWidth: 120
					});
					return columns;
				case '3':
				case '4':
				case '5':
					columns.splice(8, 0, {
						title: '总负责人',
						key: 'head_staff_name',
						minWidth: 120
					});
					columns.splice(columns.length - 1, 1);
					columns.splice(columns.length - 1, 0, {
						title: '实际完成时间',
						key: 'actual_finish_time',
						minWidth: 160
					});
					return columns;
				default:
					return columns;
			}
		}
	}
};

