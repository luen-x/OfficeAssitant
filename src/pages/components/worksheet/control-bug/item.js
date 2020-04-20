import { Dropdown, DropdownMenu, DropdownItem } from "iview";
import { Confirm } from '@common/confirm/confirm';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import Poptip from '../../sc/_common/poptip/poptip.vue';
import { CloseModal } from './popup/close-modal';
import { OrderModal } from './popup/order-modal';
import { SolutionModal } from './popup/solution-modal';
import { ResolveModal } from './popup/resolve-modal';

export default {
	data() {
		return {
			columns: [
				{
					title: ' ',
					key: 'bug_id',
					width: 30,
					render: (h, params) => {
						return (
							<div>
								{params.row.label_type.includes(4)
									? <i class="iconfont icon-tishi" style="color: #e84854"/> : ''}
							</div>
						);
					}
				},
				{
					title: '工单编号',
					key: 'bug_id',
					minWidth: 120,
					render: (h, params) => {
						let arr = [];
						params.row.label_type.includes(1) && arr.push("待您反馈");
						params.row.label_type.includes(2) && arr.push("待您确认");
						params.row.label_type.includes(3) && arr.push("待您验证");
						return (
							<div class="g-flex-ac">
								<span>{params.row.bug_id}</span>
								{arr.length != 0 ? <Poptip tag={arr}/> : ""}
							</div>
						);
					}
				},
				{
					title: '标题',
					minWidth: 400,
					key: 'title',
					render: (h, params) => {

						return (
							<div>
								{
									this.$auth[1507]
										? <span onClick={() => this.handleLookDetail(params.row)}>
											<AutoTooltip content={params.row.title} theme="dark" placement="bottom" /></span>
										: <div>{params.row.title}</div>
								}
							</div>
						);
					}
				},
				{
					title: '状态',
					minWidth: 90,
					key: 'status_mark',
				},
				{
					title: '创建人',
					minWidth: 100,
					key: 'staff_name',
				},
				{
					title: '创建时间',
					minWidth: 160,
					key: 'create_time',
				},
				{
					title: '当前指派',
					minWidth: 100,
					key: 'assign_staff_name',
				},
				{
					title: '解决人',
					minWidth: 100,
					key: 'solve_staff_name',
				},
				{
					title: '解决方案',
					minWidth: 100,
					key: 'solve_type_name',
				},
				{
					title: '解决时间',
					minWidth: 160,
					key: 'solve_time',
				},
				{
					title: "操作",
					key: "title",
					fixed: "right",
					align: 'center',
					minWidth: 80,
					render: (h, params) => {
						const button = ['编辑', '关闭', '不予解决', '指派', '确认', '验证通过', '激活', '解决', '删除'];
						return (
							<Dropdown
								style="cursor: pointer; width: 100%; height: 100%; text-align: center;"
								transfer={true}
								placement="left-start"
								onOn-click={(name) => { this.handleOperate(name, params.row); }}
							>
								<i
									class="iconfont icon-point"
									style="font-size: 20px; display: block"
									onClick={(e) => { e.stopPropagation(); }}
								/>
								{
									params.row.button.length
										? <DropdownMenu slot="list">
											{
												params.row.button.map(v => <DropdownItem name={ v }>
													{ button[v - 1] }
												</DropdownItem>)
											}
											{
												this.$auth[1508] ? <DropdownItem name="9">
													删除
												</DropdownItem> : ''
											}
										</DropdownMenu>
										: this.$auth[1508] ? <DropdownMenu slot="list">
											<DropdownItem name="9">
												{'删除'}
											</DropdownItem>
										</DropdownMenu> : <DropdownMenu slot="list">
											<DropdownItem name="20">
												{'暂无操作'}
											</DropdownItem>
										</DropdownMenu>

								}
							</Dropdown>
						);
					}
				}
			],
		};
	},
	methods: {
		handleOperate(index, row) {
			let API = ["", "", "", "",
				"", "_WORKSHEET_CONTROL_BUG_DETAIL_CONFIRM_POST",
				"_WORKSHEET_CONTROL_BUG_DETAIL_VERIFY_PASS_POST", "",
				"_WORKSHEET_CONTROL_BUG_DETAIL_RESOLVE_POST", "_WORKSHEET_CONTROL_BUG_DETAIL_DELETE_POST"];
			let msg = ["", "", "", "是否确认该bug不予解决？", "",
				"是否确认该bug，确认后，请尽快处理", "是否已验证该bug已被解决？", "", "是否确认该bug已解决，确认后，产品测试将进行验证", "是否确认删除该bug，删除后，将无法恢复"];

			if (+index === 1) {
				this.$router.push({
					path: '/worksheet/control/bug/add',
					query: {
						edit: 1,
						bug_id: row.bug_id,
						status: row.status
					}
				});

				return;
			} else if (+index === 2) {
				CloseModal.popup({
					data: row
				}).then(res => {
					this.$store.commit('WORKSHEET_CONTROL_BUG_LIST_INIT');
				});
			} else if ([6, 8].indexOf(+index) > -1) {
				ResolveModal.popup({
					data: row,
					is_order: +index,
				}).then(res => {
					this.$store.commit('WORKSHEET_CONTROL_BUG_LIST_INIT');
				});
			} else if ([4, 7].indexOf(+index) > -1) {
				OrderModal.popup({
					data: row,
					is_order: +index
				}).then(res => {
					this.$store.commit('WORKSHEET_CONTROL_BUG_LIST_INIT');
				}).catch(err => {
				});
			} else if (+index === 20) {
				return;
			} else {
				Confirm.popup({
					title: "",
					msg: msg[index],
					showIcon: true
				}).then(() => {
					this.$request({
						url: API[index],
						type: "POST",
						param: {
							bug_id: row.bug_id,
							status: row.status
						}
					}).then(res => {
						this.$store.commit('WORKSHEET_CONTROL_BUG_LIST_INIT');
						this.$Message.success(res.msg);
					}).catch(error => {
						this.$store.commit('WORKSHEET_CONTROL_BUG_LIST_INIT');
						this.$Message.error(error.msg);
					});
				}).catch(error => {
				});
			}
		},
		handleResetFirst() {
			this.$store.commit('WORKSHEET_CONTROL_BUG_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('WORKSHEET_CONTROL_BUG_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleLookDetail(row) {
			this.$router.push(
				{
					path: '/worksheet/control/bug/detail',
					query: {
						bug_id: row.bug_id
					}
				}
			);
		}
	}
};

