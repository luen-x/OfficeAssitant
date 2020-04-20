import { Dropdown, DropdownMenu, DropdownItem, Tooltip } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { objRegex, oneLinePipe, getHashUrl, getItem } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { TipConfirmModal } from './popup/tip-confirm';
import { RemarkModal } from './popup/remark';
import { Confirm } from "./popup/confirm";
import { ProgresskModal } from './popup/tel-progress-modal.vue';
import { DetailDrawer } from './popup/detail-drawer.vue';

export default {
	data() {
		return {
			columns: {
				'0': [],
				'1': [],
				'2': [],
				'3': [],
				'4': [],
			},
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('hr-recruit-school-jobfair-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('hr-recruit-school-jobfair-title-change');
	},
	methods: {
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data);
			});
		},
		getColumns(data = { title_show: [], title_hide: [] }) {
			let columns = [
				{
					title: '招聘会学校',
					key: 'school',
					fixed: 'left',
					minWidth: 230,
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.school} 
								theme="dark" 
								placement="bottom" 
								labelClass={this.$auth[166] ? "g-c-blue-mid g-pointer" : ""}
							/>
						);
					}
				},
				{
					title: '招聘会类型',
					key: 'meeting_type',
					fixed: 'left',
					minWidth: 120,
					render: (h, params) => {
						return h('span', {
							style: {
								marginRight: '5px',
							},
						}, params.row.meeting_type);
					}
				},
				{
					title: '学校性质',
					key: 'college_type',
					minWidth: 120,
				},
				{
					title: '招聘季',
					key: 'season_type_name',
					minWidth: 100,
				},
				{
					title: '招聘会年份',
					key: 'meeting_year',
					minWidth: 120,
				},
				{
					title: '招聘会时间',
					key: 'meeting_time',
					minWidth: 270,
					render: (h, params) => {
						return (
							<div>{params.row.meeting_time.replace('~', ' 至 ')}</div>
						);
					}
				},
				{
					title: '电话沟通进度',
					key: 'communication_progress',
					minWidth: 170,
					render: (h, { row }) => {
						return (
							<div 
								class="g-pd-r-10 tel-com-progress-td" 
								onClick={ (e) => {
									e.stopPropagation();
									this.handleTelProgress(row.meeting_id, row.communication_progress);
								}}
							>
								<AutoToolTip 
									content={row.communication_progress}
									theme="dark"
									width="130px"
									placement="bottom" 
									labelClass=" "
									class="g-pointer"
								/>
								<i
									class="g-fl g-m-l-10 g-fs-16 iconfont icon-edit2 g-pointer g-c-blue-mid g-m-t-10"
									style="display: none"
								/>
							</div>
						);
					}
				},
				{
					title: '联系老师',
					key: 'contact_teacher',
					minWidth: 140,
					render: (h, params) => {
						let contact_teacher = params.row.contact_teacher;
	
						return (
							<AutoToolTip 
								content={contact_teacher}
								width="104px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '手机号码',
					key: 'contact_tel',
					minWidth: 150,
					render: (h, params) => {
						let contact_tel = params.row.contact_tel;
	
						return (
							<AutoToolTip 
								content={contact_tel}
								width="114px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '学校官网',
					key: 'college_url',
					minWidth: 150,
					render: (h, params) => {
						let url = params.row.college_url;
						if (url.length > 10) {
							return (
								<Tooltip content={url} maxWidth={150}>
									<span class="g-operation g-m-r-5" onClick={() => {
										this.handleToUrl(url);
									}}>
										{oneLinePipe(url)}
									</span>
								</Tooltip>
							);
						}
						return (
							<span class="g-operation g-m-r-5" onClick={() => {
								this.handleToUrl(url);
							}}>
								{url}
							</span>
						);
					}
				},
				{
					title: '地区',
					key: 'all_address',
					minWidth: 140,
					render: (h, params) => {
						let all_address = params.row.all_address;
	
						return (
							<AutoToolTip 
								content={all_address}
								width="104px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '参与人',
					key: 'join_staff',
					minWidth: 140,
					render: (h, params) => {
						let join_staff = params.row.join_staff;
	
						return (
							<AutoToolTip 
								content={join_staff}
								width="104px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '录入人',
					key: 'operate_name',
					minWidth: 140,
				},
				{
					title: '参与情况',
					key: 'status_name',
					minWidth: 100,
				}
			];

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);
			columnsShow.push({
				title: '操作',
				key: 'opt',
				fixed: 'right',
				align: 'center',
				width: 100,
				render: (h, params) => {
					let audittButton = 'block';
					let awitButton = 'block';
					let onButton = 'block';
					let offButton = 'block';
					if (this.type == '1' || params.row.status == 0) {
						audittButton = 'none';
					}
					if (this.type == '2' || params.row.status == 1) {
						awitButton = 'none';
					}
					if (this.type == '3' || params.row.status == 2) {
						onButton = 'none';
					}
					if (this.type == '4' || params.row.status == 3) {
						offButton = 'none';
						awitButton = 'none';
						onButton = 'none';
					}
					return (
						<div onClick={(e) => e.stopPropagation()}>
							<Dropdown 
								trigger="hover" 
								placement="left" 
								width="112" 
								transfer
								onOn-click={(name) => {
									this.handleClick(name, params);
								}}
							>
								<div style="width: 100%;height: 100%;" class="g-pointer">
									<i class="iconfont icon-point" style="font-size: 18px;" />
								</div>
								<DropdownMenu slot="list" style="text-align: left;">
									{
										<div>
											<DropdownItem name="7" class="g-pointer">导出笔试</DropdownItem>
										</div>
									}
									{
										<div>
											<DropdownItem name="0" class="g-pointer">备注</DropdownItem>
										</div>
									}
									{this.$auth[161] ? (
										<div style={`display: ${awitButton}` }>
											<DropdownItem name="2" class="g-pointer">待参加</DropdownItem>
										</div>
									) : (
										""
									)}
									{this.$auth[165] ? (
										<div style={`display: ${audittButton}` }>
											<DropdownItem name="3" class="g-pointer">审核中</DropdownItem>
										</div>
									) : (
										""
									)}
									{this.$auth[162] ? (
										<div style={`display: ${offButton}` }>
											<DropdownItem name="4" class="g-pointer">未参加</DropdownItem>
										</div>
									) : (
										""
									)}
									{this.$auth[163] ? (
										<div style={`display: ${onButton}` }>
											<DropdownItem name="5" class="g-pointer">已参加</DropdownItem>
										</div>
									) : (
										""
									)}
									{this.$auth[164] ? (
										<div>
											<DropdownItem name="6" class="g-pointer">删除</DropdownItem>
										</div>
									) : (
										""
									)}
								</DropdownMenu>
							</Dropdown>
						</div>
					);
				}
			});

			return columnsShow;
		},
		handleClick(name, params) {
			if (params.row.is_change || name == '0' || name == '7') {
				if (name === '0') {
					RemarkModal.popup({
						datas: params.row
					}).then(res => {});
				} else if (name === '1') {
					this.$router.push({
						query: {
							id: params.row.meeting_id
						},
						path: '/hr/recruit/school/jobfair/edit'
					});
				} else if (name === '2') {
					TipConfirmModal.popup({
						meeting_id: params.row.meeting_id,
						title: '待参加',
						content: '是否将该招聘会变更到待参加？',
						name,
						wait: true
					}).then(res => {});
				} else if (name === '3') {
					TipConfirmModal.popup({
						meeting_id: params.row.meeting_id,
						title: '审核中',
						content: '是否将该招聘会恢复到审核中？',
						name
					}).then(res => {});
				} else if (name === '4') {
					TipConfirmModal.popup({
						meeting_id: params.row.meeting_id,
						title: '未参加',
						content: '是否将该招聘会变更到未参加？',
						name
					}).then(res => {});
				} else if (name === '5') {
					const { row } = params;
					TipConfirmModal.popup({
						meeting_id: row.meeting_id,
						title: '已参加',
						// content: '是否将该招聘会变更到已参加？',
						mettingTime: [row.meeting_start_time, row.meeting_end_time],
						name
					}).then(res => {});
				} else if (name === '6') {
					TipConfirmModal.popup({
						meeting_id: params.row.meeting_id,
						title: '删除',
						content: '是否将该招聘会删除？（删除后数据会消失）',
						name
					}).then(res => {});
				} else if (name === '7') {
					window.open(getHashUrl(API_ROOT._HR_RECRUIT_SCHOOL_SUMMARY_EXPORT_PAPER_POST, {
						meeting_id: params.row.meeting_id,
						'-token': getItem(`staff_${this.$global.version}`).token
					}));
				}
			} else {
				Confirm.popup({
					msg: "  本次招聘会下有应聘人员信息，请修改应聘人员所属的招聘会后，再操作此场招聘会。"
				}).then(() => {
				}).catch((err) => {
					console.error(err);
				});
			}
		},
		handleOpenDrawer(row) {
			if (!this.$auth[166]) return;
			DetailDrawer.popup({
				detailData: row
			}).finally(() => {
				this.$refs.tableTarget[this.type].$refs.tableTarget.clearCurrentRow();
			});
		},
		handleResetFirst() {
			this.$store.commit('HR_RECRUIT_SCHOOL_JOBFAIR_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_RECRUIT_SCHOOL_JOBFAIR_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleToUrl(url) {
			let college_url = objRegex.validURLScheme.regex.test(url) ? url : `http://${url}`;
			window.open(college_url);
		},
		handleTelProgress(meeting_id, communication_progress) {
			ProgresskModal.popup({
				meeting_id,
				communication_progress
			}).catch(() => {});
		}
	}
};

