import AutoToolTip from "@common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': [],
				'3': [],
				'4': [],
				'5': []
			}
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('collage-record-online-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('collage-record-online-title-change');
	},
	methods: {
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},
		handleResetFirst() {
			this.$store.commit('COLLAGE_RECORD_ONLINE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('COLLAGE_RECORD_ONLINE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		getColumns(data = { title_show: [], title_hide: [] }, type) {
			let columns = [
				{
					title: "公司名称",
					key: "contract_company_name",
					minWidth: 240,
					fixed: "left",
					render: (h, { row }) => {
						return (
							<div class="g-flex-ac">
								<AutoToolTip 
									content={ row.contract_company_name }
									width="160px"
									theme="dark"
									placement="bottom" 
									labelClass="g-c-blue-mid g-pointer"
								/>
								{ !!row.is_reject && <div class="_remark">已驳回</div> }
							</div>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 100
				},
				{
					title: "客户手机号",
					key: "phone",
					minWidth: 120
				},
				{
					title: "合同编号",
					key: "contract_num",
					minWidth: 150
				},
				{
					title: "下单产品",
					key: "product_name",
					minWidth: 160,
					render: (h, { row }) => {
						return (
							<AutoToolTip 
								content={ row.product_name }
								width="120px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '服务套系',
					key: 'lecture_set_name',
					minWidth: 150
				},
				{
					title: "下单时间",
					key: "order_time",
					minWidth: 160,
					sortable: 'custom'
				},
				{
					title: '流程对接人',
					key: 'process_staff_name',
					minWidth: 120
				},
				{
					title: "讲师",
					key: "lecture",
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<AutoToolTip 
								content={ row.lecture }
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "分配人",
					key: "assign_staff_name",
					minWidth: 150
				},
				{
					title: '分配时间',
					key: 'assign_time',
					minWidth: 160,
					sortable: 'custom'
				},
				{
					title: '最近更新时间',
					key: 'update_time',
					minWidth: 160,
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 120
				},
				{
					title: "部门",
					key: "invite_depart_name",
					minWidth: 120
				},
				{
					title: "下单人",
					key: "order_staff_name",
					minWidth: 120
				}
			];

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);

			return columnsShow;
		}
	}
};

