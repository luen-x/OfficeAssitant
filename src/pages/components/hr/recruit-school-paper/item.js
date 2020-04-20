import { Dropdown, DropdownMenu, DropdownItem } from 'iview';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { Confirm } from '@components/_common/confirm/confirm';
import { delItem } from "@utils/utils";

export default {
	data() {
		return {
			columns: [
				{
					title: '笔试主题',
					key: 'paper_theme',
					width: 250,
					fixed: "left",
					render: (h, { row }) => {
						return (
							<div class="g-flex">
								<AutoTooltip 
									content={row.paper_theme}
									theme="dark"
									width="160px"
									placement="bottom"
									labelClass="g-c-black3"
								/>
								{
									!row.is_complete && <span
										class="g-bg-red-light"
										style="border-radius: 2px;padding: 1px 5px;"
										onClick={(e) => { e.stopPropagation(); }}
									>
									未完善
									</span>
								}
							</div>
						);
					}
				},
				{
					title: '题量',
					key: 'question_count',
					minWidth: 90
				},
				{
					title: '笔试类型',
					key: 'written_type',
					minWidth: 120,
					render: (h, { row }) => {
						return <div>{['积分单选', '跳题单选'][+row.written_type - 1]}</div>;
					}
				},
				{
					title: '创建人',
					key: 'add_person_name',
					minWidth: 100
				},
				{
					title: '创建时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '修改人',
					key: 'update_person_name',
					minWidth: 100
				},
				{
					title: '修改时间',
					key: 'update_time',
					minWidth: 160
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
									<DropdownItem name="handleEdit">编辑</DropdownItem>
									<DropdownItem name="handleView">预览</DropdownItem>
									<DropdownItem name="handleDel">删除</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						);
					}
				}
			],
		};
	},
	methods: {
		handleEdit(row) {
			this.$router.push({
				name: 'hr-recruit-school-paper-edit',
				query: { 
					action: 'update', 
					paper_id: row.paper_id 
				}
			});
		},
		handleView(row) {
			delItem(`paper-result${this.$global.version}`);
			this.$router.push({
				name: 'hr-recruit-school-paper-preview',
				query: {
					paper_id: row.paper_id
				}
			});
		},
		handleDel(row) {
			Confirm.popup({
				title: "",
				msg: "是否确定删除该试卷？",
				showIcon: true
			}).then(() => {
				this.$request({
					url: '_HR_RECRUIT_SCHOOL_PAPER_DEL_POST',
					type: 'POST',
					loading: false,
					param: {
						paper_id: row.paper_id
					},
					autoTip: true
				}).then(res => {
					this.$store.commit('HR_RECRUIT_SCHOOL_PAPER_LIST_INIT');
				}).catch(error => {});
			}).catch(error => {
				error && console.error(error);
			});
		},
	}
};

