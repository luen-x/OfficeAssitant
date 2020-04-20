import { Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { getParseUrl } from '@utils/utils';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { Confirm } from '@components/_common/confirm/confirm';
import { worksheetProjectClose } from './popup/project-close';

export default {
	data() {
		return {
			columns: [
				{
					title: '项目名称',
					key: 'system_name',
					width: 250,
					fixed: "left",
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.system_name}
									theme="dark"
									placement="bottom"
									labelClass={this.$auth[1511] ? 'g-operation' : 'g-c-black3'}
								/>
							</div>
						);
					}
				},
				{
					title: '状态',
					key: 'status',
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<div>
								{['未关闭', '已关闭'][+row.status - 1]}
							</div>
						);
					}
				},
				{
					title: '创建时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '创建人',
					key: 'staff_name',
					minWidth: 100
				},
				{
					title: '更新时间',
					key: 'update_time',
					minWidth: 160
				},
				{
					title: 'bug总数',
					key: 'all_count',
					minWidth: 120
				},
				{
					title: '未关闭bug',
					key: 'wait_close_count',
					minWidth: 120
				},
				{
					title: '操作',
					key: 'opt',
					fixed: 'right',
					align: 'center',
					width: 100,
					render: (h, { row }) => {
						return (
							<Dropdown
								transfer 
								triger="hover" 
								placement="left-start"
								onOn-click={(method) => { this[method](row); }}
							>
								<i
									class="iconfont icon-point g-fs-20 g-pointer"
									onClick={(e) => { e.stopPropagation(); }}
								/>
								<DropdownMenu slot="list">
									{ 
										<div>
											{this.$auth[1515] ? <DropdownItem name="handleEdit">编辑</DropdownItem> : null}
											{this.$auth[1516] ? <DropdownItem name="handleDel">删除</DropdownItem> : null}
											{this.$auth[1517] ? (
												<div>
													{
														row.status === 1 && <DropdownItem name="handleClose">关闭</DropdownItem>
													}
													{
														row.status === 2 && <DropdownItem name="handleStart">开启</DropdownItem>
													}
												</div>
											) : null}
										</div>
									}
								</DropdownMenu>
							</Dropdown>
						);
					}
				}
			],
		};
	},
	methods: {
		handleOpenDrawer(row) {
			if (this.$auth[1511]) {
				this.$router.push({
					path: '/worksheet/control/project/detail',
					query: {
						system_id: row.system_id,
						title: row.system_name
					}
				});
			}
		},
		handleEdit(row) {
			this.$router.push({
				path: '/worksheet/control/project/add',
				query: {
					action: 'update',
					system_id: row.system_id
				}
			});
		},
		handleDel(row) {
			let { query: { page } } = getParseUrl();
			Confirm.popup({
				title: "删除提示",
				msg: "是否确认删除该项目，删除后，该项目下所有模块数据将都会被删除",
				showIcon: true
			}).then(() => {
				this.$request({
					url: '_WORKSHEET_CONTROL_PROJECT_DEL_POST',
					type: 'POST',
					loading: false,
					param: {
						system_id: row.system_id
					},
					autoTip: true
				}).then(res => {
					this.$store.commit('WORKSHEET_CONTROL_PROJECT_LIST_RESET', { type: this.type });
					this.$nextTick(() => {
						if (!(this.curLength - 1)) {
							this.$refs.tableTarget[+this.type - 1].currentPage = +page - 1;
							this.$refs.tableTarget[+this.type - 1].handleChange(+page - 1);
						}
					});
				}).catch(err => {
					err && console.error(err);
				});
			}).catch(err => {
				err && console.error(err);
			});
		},
		handleClose(row) {
			worksheetProjectClose.popup({
				systemId: row.system_id,
				status: 2
			}).then(() => {
				this.$store.commit('WORKSHEET_CONTROL_PROJECT_LIST_RESET', { type: this.type });
			}).catch(err => {
				err && console.error(err);
			});
		},
		handleStart(row) {
			worksheetProjectClose.popup({
				systemId: row.system_id,
				status: 1
			}).then(() => {
				this.$store.commit('WORKSHEET_CONTROL_PROJECT_LIST_RESET', { type: this.type });
			}).catch(err => {
				err && console.error(err);
			});
		},
	}
};

