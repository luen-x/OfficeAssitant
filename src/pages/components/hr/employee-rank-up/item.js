import { Copy, Upload } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import { Dropdown, DropdownMenu, DropdownItem, Poptip } from 'iview';
import Explain from '@components/_common/explain/explain';
import { promoPModal } from './popup/promo.vue';
import { demoPModal } from './popup/demo.vue';
import { DelTipModal } from '../_common/delete-tip';

export default {
	data() {
		return {
			columns: [
				{
					title: "姓名",
					key: "staff_name",
					fixed: "left",
					width: 170,
					render: (h, params) => {
						const { is_detail } = params.row;
						return (
							<span
								class={(is_detail === 0) ? '' : 'g-c-blue-mid g-pointer'}
								style={{ display: 'block', width: '100%' }}
								onClick={() => this.handleLinkTo(params)}>
								{params.row.staff_name}
							</span>
						);
					}
				},
				{
					title: "手机号码",
					key: "mobile",
					fixed: "left",
					width: 120
				},
				{
					title: "工号",
					key: "staff_number",
					minWidth: 150,
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 150
				},
				{
					title: "晋升前职位",
					key: "before_position_name",
					minWidth: 150
				},
				{
					title: "晋升后职位",
					key: "after_position_name",
					minWidth: 150
				},
				{
					title: "硬性标准",
					key: "rigid_standard",
					minWidth: 150,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								硬性标准
								<Explain
									style={{ marginLeft: '2px' }}
									width={150}
									trigger="hover"
									content="绿色：全部条件通过&nbsp;&nbsp;&nbsp;&nbsp;
											蓝色：部分条件通过&nbsp;&nbsp;&nbsp;&nbsp;
											红色：有未通过条件"
								/>
							</div>
						);
					},
					render: (h, params) => {
						const { color } = params.row;
						let newColor = '';
						switch (color) {
							case 'green':
								newColor = '#4FC43D';
								break;
							case 'blue':
								newColor = '#2397F9';
								break;
							case 'red':
								newColor = '#E74854';
								break;
							default:
								break;
						}

						return <span style={{ color: newColor }}>
							{params.row.rigid_standard}
						</span>;
					}
				},
				{
					title: "晋升分数",
					key: "promotion_score",
					minWidth: 150
				},
				{
					title: "评定时间",
					key: "evaluate_time",
					minWidth: 160
				},
				{
					title: "考核周期",
					key: "cycle_month",
					minWidth: 160
				},
				{
					title: "评定结果",
					key: "status_name",
					minWidth: 160
				},
				{
					title: '操作',
					key: 'action',
					fixed: 'right',
					align: 'center',
					minWidth: 100,
					render: (h, params) => {
						const { status } = params.row;
						return (
							<Dropdown transfer placement="left-start" onOn-click={(name) => {
								this.handleAction(name, params);
							}}>
								<i class="iconfont icon-point g-fs-20 g-pointer" />
								<DropdownMenu slot="list">
									{ this.getOpts(status).map(opt => {
										// 判断是否有权限
										if (opt.auth && !this.$auth[opt.auth]) return null;

										if (opt.key === 'demotion') {
											if (params.row.before_position_name === params.row.after_position_name) {
												return null;
											}
											if (!params.row.is_down_status) {
												return null;
											}
										}
										if (opt.key === 'promo') {
											if (params.row.before_position_name === params.row.after_position_name) {
												return null;
											}
											if (!params.row.is_operate) {
												return null;
											}
										}
										if (opt.key === 'watch') {
											if (!params.row.is_detail) {
												return null;
											}
										}
										// 根据字段判断是否能操作
										if (!params.row.is_operate) {
											return null;
										}
										return <DropdownItem name={opt.key}>{opt.label}</DropdownItem>;
									})}
								</DropdownMenu>
							</Dropdown>
						);
					}
				}
			],
		};
	},
	methods: {
		handleLinkTo(params) {
			if (params.row.is_detail && this.$auth[850]) {
				this.$router.push({
					path: '/hr/employee/summary/details',
					query: {
						staff_id: params.row.staff_id,
						staff_name: params.row.staff_name,
						type: 7
					}
				});
			}
		},
		handleAction(name, params) {
			switch (name) {
				case 'watch': 	// 查看详情
					this.$router.push({
						path: '/hr/employee/summary/details',
						query: {
							staff_id: params.row.staff_id,
							staff_name: params.row.staff_name,
							type: 7
						}
					});
					break;
				case 'promo': 	// 员工晋升
					promoPModal.popup({
						data: params.row,
						id: this.stair_depart_id
					}).then(res => {
						this.$store.commit("HR_EMPLOYEE_RANK_UP_LIST_INIT", this.system_id);
					}).catch(err => {});
					break;
				case 'demotion': 	// 员工降职
					demoPModal.popup({
						data: params.row,
						id: this.stair_depart_id
					}).then(res => {
						this.$store.commit("HR_EMPLOYEE_RANK_UP_LIST_INIT", this.system_id);
					}).catch(err => {});
					break;
				case 'keep':		// 保持原职
				case 'pending':		// 晋升待定
					this.$request({
						url: '_HR_EMPLOYEE_UP_KEEP_STATUS_POST',
						type: "POST",
						param: {
							record_id: params.row.record_id,
							status: name === 'pending' ? 1 : 2
						},
						loading: false
					}).then(res => {
						this.$Message.success("操作成功");
						this.$store.commit("HR_EMPLOYEE_RANK_UP_LIST_INIT", this.system_id);
					}).catch(err => {
						this.$Message.warning(err.msg);
					});
					break;
				case 'revoke':		// 撤销评定
					this.$request({
						url: '_HR_EMPLOYEE_UP_REVOCATION_STATUS_POST',
						type: "POST",
						param: {
							record_id: params.row.record_id
						},
						loading: false
					}).then(res => {
						this.$Message.success("操作成功");
						this.$store.commit("HR_EMPLOYEE_RANK_UP_LIST_INIT", this.system_id);
					}).catch(err => {
						this.$Message.warning(err.msg);
					});
					break;
				case 'move': 	// 移除员工
					DelTipModal.popup({
						title: '移除员工',
						content: '是否将该员工移除，移除员工后该员工不再参与此次晋升。'
					}).then(res => {
						this.$request({
							url: '_HR_EMPLOYEE_UP_REMOVE_STAFF_POST',
							type: "POST",
							param: {
								record_id: params.row.record_id,
							},
							loading: false
						}).then(res1 => {
							this.$Message.success("操作成功");
							this.$store.commit("HR_EMPLOYEE_RANK_UP_LIST_INIT", this.system_id);
						}).catch(err => {
							this.$Message.warning(err.msg);
						});
					}).catch(err => {});
					break;
				default:
					break;
			}
		},
		getOpts(status) {
			if (status === 0 || status === 1) {
				return [
					{ key: 'watch', label: '查看详情' },
					{ key: 'promo', label: '员工晋升', auth: 851 },
					{ key: 'demotion', label: '员工降职', auth: 851 },
					{ key: 'keep', label: '保持原职', auth: 851 },
					{ key: 'pending', label: '晋升待定', auth: 851 },
					{ key: 'move', label: '移除员工', auth: 852 }
				];
			}
			if (status !== 0 && status !== 1) {
				return [
					{ key: 'watch', label: '查看详情' },
					{ key: 'revoke', label: '撤销评定', auth: 853 },
					{ key: 'move', label: '移除员工', auth: 852 }
				];
			}
		},
	}
};

