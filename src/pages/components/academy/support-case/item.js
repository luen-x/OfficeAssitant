import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { Confirm } from '@common/confirm/confirm';

export default {
	data() {
		const columns = [
			{
				title: '案例标题',
				key: 'title',
				fixed: 'left',
				width: 200,
				render: (h, { row }) => {
					return <AutoToolTip
						content={row.title}
						theme="dark"
						placement="bottom"
						onClick-label={() => this.handleDetail(row)}
					/>;

				}
			},
			{
				title: '浏览量',
				key: 'browse_num',
				minWidth: 90
			},
			{
				title: '收藏量',
				key: 'collection_num',
				minWidth: 90
			},
			{
				title: '案例公司',
				key: 'contract_company_name',
				minWidth: 100,
				render: (h, { row }) => {
					return <AutoToolTip
						content={row.contract_company_name}
						theme="dark"
						placement="bottom"
						labelClass=" "
					/>;

				}
				
			},
			{
				title: '客户地区',
				key: 'region',
				minWidth: 180
			},
			{
				title: '具体行业',
				key: 'industry_name',
				minWidth: 100				},
			{
				title: '客户类型',
				key: 'customer_type_name',
				minWidth: 100
			},
			{
				title: '客户产品',
				key: 'product_type_name',
				minWidth: 100,
				render: (h, { row }) => {
					return <AutoToolTip
						content={row.product_type_name}
						theme="dark"
						placement="bottom"
						labelClass=" "
					/>;

				}
			},
			{
				title: '客户微龄',
				key: 'age_name',
				minWidth: 100
			},
			{
				title: '上传时间',
				key: 'create_time',
				minWidth: 180
			}
		];
		if (this.$auth[1760] || this.$auth[1761]) {
			columns.push({
				title: '操作',
				key: '',
				fixed: 'right',
				width: 100,
				render: (h, { row }) => {
					return (
						<div onClick={() => window.event.stopPropagation()}>
							{this.$auth[1760] && (
								<span 
									class="g-operation "
									onClick={() => this.handleEdit(row)}
								>
								编辑
								</span>
							)}
							{this.$auth[1760] && this.$auth[1761] && this.$auth[1] && (
								<span class="g-m-lr-5 g-operation " >|</span>
							)}
							{this.$auth[1761] && (
								<span 
									class="g-operation "
									onClick={() => this.handleDelete(row)}
								>
								删除
								</span>
							)}

						</div>
					);
				}
			});
		}
		if (this.$auth[1761]) {
			columns.splice(0, 0, {
				type: "selection",
				width: 60,
				fixed: "left",
				className: "g-pd-l-10"
			});
		}
		return {
			columns
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('ACADEMY_SUPPORT_CASE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_SUPPORT_CASE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleEdit(row) {
			this.$router.push({
				path: '/academy/support/case/add',
				query: { case_id: row.case_id, action: 'update' }
			});

		},
		handleDelete(row) {
			Confirm.popup({
				msg: '确认删除此案例吗？',
				title: '删除案例'

			}).then(() => {
				this.$request({
					url: "_ACADEMY_SUPPORT_CASE_DELETE_POST",
					type: "POST",
					param: { case_ids: [row.case_id] },
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch();
		},
		handleBatchDelete() {
			if (!(this.selected && this.selected.length)) {
				this.$Message.error("请选择要删除的案例");
				return;
			}
			Confirm.popup({
				msg: '确认删除选中的案例吗？',
				title: '删除案例'

			}).then(() => {

				this.$request({
					url: "_ACADEMY_SUPPORT_CASE_DELETE_POST",
					type: "POST",
					param: { case_ids: this.selected.map(i => i.case_id) },
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch();

		},
		handleDetail(row) {
			this.$router.push({
				path: '/academy/support/case/detail',
				query: { case_id: row.case_id }
			});
		}

	}
};

