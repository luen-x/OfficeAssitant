import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { Confirm } from '@components/_common/confirm/confirm';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	data() {
		const baseColumns = [
			{
				title: '需求点',
				key: 'need_name',
				width: 250,
				fixed: 'left',
				render: (h, { row }) => {
					return (
						<div>
							<AutoTooltip 
								content={row.need_name}
								theme="dark"
								placement="bottom"
								labelClass="g-c-black3"
							/>
						</div>
					);
				}
			},
			{
				title: '所属板块',
				key: 'plate',
				minWidth: 120,
				render: (h, { row }) => {
					return (
						<div>
							<AutoTooltip 
								content={row.plate}
								theme="dark"
								placement="bottom"
								labelClass="g-c-black3"
							/>
						</div>
					);
				}
			},
			{
				title: '需求进度',
				key: 'rate_name',
				minWidth: 120,
				render: (h, { row }) => {
					return (
						<div>
							<AutoTooltip 
								content={row.rate_name}
								theme="dark"
								placement="bottom"
								labelClass="g-c-black3"
							/>
						</div>
					);
				}
			},
			{
				title: '所属经理',
				key: 'manager',
				minWidth: 100
			},
			{
				title: '提出公司',
				key: 'company',
				minWidth: 250,
				render: (h, { row }) => {
					return (
						<div>
							<AutoTooltip 
								content={row.company}
								theme="dark"
								placement="bottom"
								labelClass="g-c-black3"
							/>
						</div>
					);
				}
			},
			{
				title: '负责产品',
				key: 'product',
				minWidth: 120,
				render: (h, { row }) => {
					return (
						<div>
							<AutoTooltip 
								content={row.product}
								theme="dark"
								placement="bottom"
								labelClass="g-c-black3"
							/>
						</div>
					);
				}
			},
			{
				title: '上线时间',
				key: 'online_time',
				minWidth: 160,
				renderHeader: (h, { row }) => {
					return (
						<span>
							上线时间
							<span class="ivu-table-sort">
								<i 
									class={[
										'ivu-icon ivu-icon-md-arrow-dropup',
										{ 'g-c-blue-mid': this.order == 'online_time' && this.sort === 0 }
									]} 
									onClick={() => { this.handleaAsc('online_time'); }} 
								/>
								<i 
									class={[
										'ivu-icon ivu-icon-md-arrow-dropdown',
										{ 'g-c-blue-mid': this.order == 'online_time' && this.sort === 1 }
									]} 
									onClick={() => { this.handleDesc('online_time'); }} 
								/>
							</span>
						</span>
					);
				},
			},
			{
				title: '发布时间',
				key: 'create_time',
				minWidth: 160,
				renderHeader: (h, { row }) => {
					return (
						<span>
							发布时间
							<span class="ivu-table-sort">
								<i 
									class={[
										'ivu-icon ivu-icon-md-arrow-dropup',
										{ 'g-c-blue-mid': this.order == 'create_time' && this.sort === 0 }
									]} 
									onClick={() => { this.handleaAsc('create_time'); }} 
								/>
								<i 
									class={[
										'ivu-icon ivu-icon-md-arrow-dropdown',
										{ 'g-c-blue-mid': this.order == 'create_time' && this.sort === 1 }
									]} 
									onClick={() => { this.handleDesc('create_time'); }} 
								/>
							</span>
						</span>
					);
				},
			},
			{
				title: '更新人',
				key: 'staff_name',
				minWidth: 100
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
								this.$auth[1417] && <span onClick={() => { this.handleEdit(row); }}>编辑</span>
							}
							{
								this.$auth[1417] && this.$auth[1419] && <span class="g-pd-lr-10">|</span>
							}
							{
								this.$auth[1419] && <span onClick={() => { this.handleDel(row); }}>删除</span>
							}
						</div>
					);
				}
			}
		];
		return {
			baseColumns,
			selectionColumns: [
				{
					type: 'selection',
					width: 50,
					fixed: "left"
				},
				...baseColumns
			]
		};
	},
	methods: {
		handleaAsc(order) {
			let { query = {} } = getParseUrl();
			if (this.sort === 0) {
				this.sort = undefined;
				this.order = undefined;
			} else {
				this.order = order;
				this.sort = 0;
			}
			this.handleSearch({ ...query, order: this.order, sort: this.sort });
		},
		handleDesc(order) {
			let { query = {} } = getParseUrl();
			if (this.sort === 1) {
				this.sort = undefined;
				this.order = undefined;
			} else {
				this.order = order;
				this.sort = 1;
			}
			this.handleSearch({ ...query, order: this.order, sort: this.sort });
		},
		handleSearch(query = {}) {
			this.$router.replace(getHashUrl(
				'/tech/project/plan/demand',
				{
					...this.$route.query,
					...query
				}
			));
			this.$store.commit('TECH_PROJECT_PLAN_DEMAND_LIST_INIT');
		},
		getColumns(project_id) {
			if (this.$auth[1418] || this.$auth[1419]) {
				return this.selectionColumns;
			} else {
				return this.baseColumns;
			}
		},
		handleEdit(row) {
			this.$router.push({
				name: 'tech-project-plan-demand-add',
				query: {
					title: '编辑需求',
					...row
				}
			});
		},
		handleDel(row) {
			Confirm.popup({
				title: '删除提示',
				msg: '是否确认删除？',
				showIcon: true
			}).then(() => {
				this.$request({
					url: '_TECH_PROJECT_NEED_DEL_POST',
					type: "POST",
					loading: false,
					param: {
						need_id: row.need_id
					},
					autoTip: true
				}).then(() => {
					this.$store.commit('TECH_PROJECT_PLAN_DEMAND_LIST_RESET', { project_id: this.project_id });
				});
			}).catch((error) => {
				error && console.error(error);
			});
		}
	}
};

