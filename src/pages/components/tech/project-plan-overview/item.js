import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { Confirm } from '@components/_common/confirm/confirm';
import { ProjectPlanOverviewEdit } from './popup/project-edit';

export default {
	data() {
		return {
			columns: [
				{
					title: '项目名称',
					key: 'project_name',
					width: 250,
					fixed: 'left',
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.project_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '产品负责人',
					key: 'product_owner_name',
					minWidth: 100
				},
				{
					title: '更新记录',
					key: 'notice_count',
					minWidth: 90
				},
				{
					title: '功能解读',
					key: 'read_count',
					minWidth: 90
				},
				{
					title: '需求点',
					key: 'need_count',
					minWidth: 90
				},
				{
					title: '项目说明',
					key: 'project_description',
					minWidth: 250,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.project_description}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '操作',
					key: 'opt',
					width: 120,
					fixed: 'right',
					render: (h, { row }) => {
						return (
							<div class="g-operation">
								{
									this.$auth[1414] && <span onClick={() => { this.handleEdit(row); }}>编辑</span>
								}
								{
									this.$auth[1413] && this.$auth[1414] && <span class="g-pd-lr-10">|</span>
								}
								{
									this.$auth[1413] && <span onClick={() => { this.handleDel(row); }}>删除</span>
								}
							</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleEdit(row) {
			ProjectPlanOverviewEdit.popup({
				title: '编辑项目',
				data: row
			}).then(() => {
				this.$store.commit('TECH_PROJECT_PLAN_OVERVIEW_LIST_INIT');
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleDel(row) {
			Confirm.popup({
				title: '删除提示',
				msg: '是否确认删除？',
				showIcon: true
			}).then(() => {
				this.$request({
					url: '_TECH_PROJECT_PLAN_OVERVIEW_DEL_POST',
					type: "POST",
					loading: false,
					param: {
						project_id: row.project_id
					},
					autoTip: true
				}).then(() => {
					this.$store.commit('TECH_PROJECT_PLAN_OVERVIEW_LIST_INIT');
				});
			}).catch((error) => {
				error && console.error(error);
			});
		}
	},
};

