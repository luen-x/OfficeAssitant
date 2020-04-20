import { Copy, Upload } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import { Dropdown, DropdownMenu, DropdownItem, Poptip } from 'iview';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { followPModal } from './popup/follow.vue';
import { changePModal } from './popup/change.vue';
import { assignPModal } from '../recruit-school-summary/popup/assign.vue';
import { watchPModal } from './popup/watch.vue';
import { addPModal } from './popup/add.vue';
import { DelTipModal } from '../_common/delete-tip';

export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': [],
				'3': [],
				'4': [],
				'5': [],
				'6': [],
			}
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('hr-academy-transfer-transfer-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('hr-academy-transfer-transfer-title-change');
	},
	methods: {
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},
		getColumns(data = { title_show: [], title_hide: [] }, type) {
			let columns = [
				{
					title: "姓名",
					key: "applicant_name",
					fixed: "left",
					minWidth: 170,
					renderHeader: (h, params) => {
						return (
							<div style="marginLeft: 33px;fontWeight: normal">姓名</div>
						);
					},
					render: (h, params) => {
						const { applicant_name, add_type, status } = params.row;

						return (
							<div class="g-flex-ac">
								{ (status === 6 || status === 11) && <div class="g-m-r-5 g-remark">淘</div>}
								{ status === 7 && <div class="g-m-r-5 g-remark">离</div>}
								{ (status !== 6 && status !== 11 && status !== 7) && <div class="g-m-r-5 g-remark" style="opacity: 0">注</div>}
								{ (add_type === 2 || add_type === 3)
									? <router-link
										class="g-c-blue-mid g-pointer"
										style={{ display: 'block', width: '100%' }}
										to={this.handleLinkTo(params)}
									>
										<span>
											{ applicant_name.length <= 7 ? applicant_name
												: <AutoToolTip
													content={applicant_name}
													labelClass=""
													width="105px"
													theme="dark"
												>
													{applicant_name}
												</AutoToolTip>
											}
										</span>
									</router-link>
									: <span>
										{ applicant_name.length <= 7 ? applicant_name
											: <AutoToolTip
												content={applicant_name}
												labelClass=""
												width="105px"
												theme="dark"
											>
												{applicant_name}
											</AutoToolTip>
										}
									</span>
								}
							</div>
						);
					}
				},
				{
					title: "手机号码",
					key: "mobile",
					fixed: "left",
					minWidth: 120
				},
				{
					title: "试岗部门",
					key: "try_depart_name",
					minWidth: 150
				},
				{
					title: "应聘职位",
					key: "position_name",
					minWidth: 150
				},
				{
					title: "人才来源",
					key: "talent_resource_name",
					minWidth: 150
				},
				{
					title: "转介绍人",
					key: "introducer_name",
					minWidth: 120
				},
				{
					title: "邀约人",
					key: "invite_name",
					minWidth: 120
				},
				{
					title: "试岗时间",
					key: "try_time",
					minWidth: 180
				},
				{
					title: "试岗离开时间",
					key: "pass_time",
					minWidth: 160
				},
				{
					title: "入职时间",
					key: "entry_time",
					minWidth: 160
				},
				{
					title: "离职时间",
					key: "leave_time",
					minWidth: 160
				},
				{
					title: "在职时间",
					key: "work_day",
					minWidth: 160
				},
				{
					title: "去/留",
					key: "leave_status_name",
					width: 80
				},
				{
					title: "培训开始时间",
					key: "train_time_start",
					minWidth: 160
				},
				{
					title: "培训结束时间",
					key: "train_time_end",
					minWidth: 160
				},
				{
					title: "课程进度",
					key: "train_progress",
					minWidth: 100
				},
				{
					title: "未达标备注",
					key: "train_unachieve_remarks",
					minWidth: 200,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.train_unachieve_remarks}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "培训淘汰时间",
					key: "train_pass_time",
					minWidth: 160
				},
				{
					title: "淘汰人",
					key: "train_pass_staff_name",
					minWidth: 120
				}
			];


			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				return result;
			}).filter(Boolean);

			columnsShow.splice(columnsShow.length, 0, {
				title: "操作",
				key: 'action',
				minWidth: 100,
				align: 'center',
				fixed: "right",
				render: (h, params) => {
					return (
						<Dropdown transfer placement="left-start" onOn-click={(name) => {
							this.handleAction(name, params);
						}}>
							<i class="iconfont icon-point g-fs-20 g-pointer" />
							<DropdownMenu slot="list">
								{ this.getOpts(type).map(opt => {
									// 判断是否有权限
									if (opt.auth && !this.$auth[opt.auth]) return null;

									if (opt.key === 'assign') {
										if (params.row.entry_time) {
											return null;
										} else {
											return <DropdownItem name={opt.key}>{opt.label}</DropdownItem>;
										}
									}
									return <DropdownItem name={opt.key}>{opt.label}</DropdownItem>;
								})}
							</DropdownMenu>
						</Dropdown>
					);
				}
			});

			return columnsShow;
		},
		handleAction(name, params) {
			switch (name) {
				case 'follow':
					followPModal.popup({
						info: params.row
					}).then(res => {

					}).catch(err => {});
					break;
				case 'complete':
				case 'not-reach':
				case 'recover':
					changePModal.popup({
						info: params.row,
						action: name
					}).then(res => {
					}).catch(err => {});
					break;
				case 'eliminate':
					if (params.row.entry_time) {
						DelTipModal.popup({
							title: '培训淘汰',
							content: '是否确定此入职人员变更到培训淘汰，确认后会通知人事人员为此人办理离职。'
						}).then(res => {
							this.$request({
								url: '_HR_ACADEMY_TRANSFER_CHANGE_STATUS_GET',
								type: "GET",
								param: {
									applicant_id: params.row.applicant_id,
									train_status: 6,
								},
								loading: false
							}).then(response => {
								this.$Message.success("操作成功");
								this.$store.commit('HR_ACADEMY_TRANSFER_TRANSFER_LIST_INIT');
							}).catch(err => {
								this.$Message.error(err.msg);
							});
						}).catch(err => {});
					} else {
						changePModal.popup({
							info: params.row,
							action: name
						}).then(res => {
						}).catch(err => {});
					}
					break;
				case 'assign':	// 指派
					assignPModal.popup({
						data: {
							info: params.row,
							scenario: 3
						}
					}).then(res => {
						this.$Message.success('操作成功');
						this.$store.commit('HR_ACADEMY_TRANSFER_TRANSFER_LIST_INIT');
					}).catch(() => {});
					break;
				case 'watch':
					watchPModal.popup({
						info: params.row,
						type: this.type
					}).then(res => {
						this.$store.commit('HR_ACADEMY_TRANSFER_TRANSFER_LIST_INIT');
					}).catch(() => {});
					break;
				case 'add':
					addPModal.popup({
						info: params.row,
						type: this.type
					}).then(res => {
					}).catch(() => {});
					break;
				default:
					break;
			}
		},
		getOpts(status, opt = {}) {
			switch (Number(status)) {
				case 1:
					return [
						{ key: 'follow', label: '心态跟踪', auth: 929 },
						{ key: 'add', label: '安排培训', auth: 930 },
						{ key: 'complete', label: '培训完成', auth: 931 },
						{ key: 'eliminate', label: '培训淘汰', auth: 932 },
						{ key: 'assign', label: '指派', auth: 933 }
					];
				case 2:
					return [
						{ key: 'follow', label: '心态跟踪', auth: 929 },
						{ key: 'complete', label: '培训完成', auth: 931 },
						{ key: 'eliminate', label: '培训淘汰', auth: 932 },
						{ key: 'assign', label: '指派', auth: 933 },
						{ key: 'watch', label: '查看课程', auth: 935 }
					];
				case 3:
					return [
						{ key: 'follow', label: '心态跟踪', auth: 929 },
						{ key: 'eliminate', label: '培训淘汰', auth: 932 },
						{ key: 'complete', label: '培训完成', auth: 931 },
						{ key: 'not-reach', label: '培训未达标', auth: 936 },
						{ key: 'assign', label: '指派', auth: 933 },
						{ key: 'watch', label: '查看课程', auth: 935 }
					];
				case 4:
					return [
						{ key: 'follow', label: '心态跟踪', auth: 929 },
						{ key: 'eliminate', label: '培训淘汰', auth: 932 },
						{ key: 'not-reach', label: '培训未达标', auth: 936 },
						{ key: 'assign', label: '指派', auth: 933 },
						{ key: 'watch', label: '查看课程', auth: 935 }
					];
				case 5:
					return [
						{ key: 'follow', label: '心态跟踪', auth: 929 },
						{ key: 'add', label: '安排培训', auth: 930 },
						{ key: 'eliminate', label: '培训淘汰', auth: 932 },
						{ key: 'complete', label: '培训完成', auth: 931 },
						{ key: 'assign', label: '指派', auth: 933 },
						{ key: 'watch', label: '查看课程', auth: 935 }
					];
				case 6:
					return [
						{ key: 'follow', label: '心态跟踪', auth: 929 },
						{ key: 'recover', label: '恢复', auth: 937 },
						{ key: 'watch', label: '查看课程', auth: 935 }
					];
				default:
					return [];
			}
		},
		handleLinkTo(params) {
			let baseUrl = params.row.add_type === 3
				? `/hr/academy/transfer/school/${params.row.applicant_id}`
				: `/hr/academy/transfer/social/${params.row.applicant_id}`;
			return params.row.add_type === 3 ? getHashUrl(baseUrl, {
				type: 'no-edit',
				list_type: 'transport',
				tabType: this.type,
				index: 'transfer',
				status: params.row.status
			}) : getHashUrl(baseUrl, {
				list_type: 'transport',
				type: this.type,
				index: 'transfer',
				status: params.row.status
			});
		},
	}
};

