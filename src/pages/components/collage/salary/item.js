export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': []
			},
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('collage-salary-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('collage-salary-title-change');
	},
	computed: {
		
	},
	methods: {
		getColumns(data = { title_show: [], title_hide: [] }, type) {
			let columns = [
				{
					title: '姓名',
					minWidth: 150,
					fixed: 'left',
					key: 'staff_name',
				},
				{
					title: '手机号',
					minWidth: 150,
					key: 'mobile',
				},
				{
					title: '部门',
					minWidth: 150,
					key: 'depart_name',
				},
				{
					title: '月份',
					minWidth: 150,
					key: 'month',
				},
				{
					title: '薪资总额',
					minWidth: 150,
					key: 'gross_salary',
				},
				{
					title: '促单业绩',
					minWidth: 150,
					key: 'minus_performance',
				},
				{
					title: '促单提成',
					minWidth: 150,
					key: 'total_commission',
				},
				{
					title: '团队业绩',
					minWidth: 150,
					key: 'team_performance',
				},
				{
					title: '团队提成',
					minWidth: 150,
					key: 'team_commission',
				},
				{
					title: '课时费',
					minWidth: 150,
					key: 'lecture_fee',
				},
				{
					title: '流程对接费',
					minWidth: 150,
					key: 'process_allowance',
				},
				{
					title: '主持人补贴',
					minWidth: 150,
					key: 'presenter_allowance',
				},
				{
					title: '唱单补贴',
					minWidth: 150,
					key: 'sign_allowance',
				},
				{
					title: '会议总统筹补贴',
					minWidth: 150,
					key: 'meet_plan_allowance',
				},
				{
					title: '外出补贴',
					minWidth: 150,
					key: 'out_allowance',
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
				minWidth: 150,
				fixed: 'right',
				key: 'options',
				render: (h, params) => {
					return (
						<span class="g-operation" onClick={(e) => {
							this.handleDetail(params.row);
						}}>
						查看详情
						</span>
						
					);
				}
			});
			

			return columnsShow;
		},
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},
		handleDetail(row) {
			this.$router.push({
				path: '/collage/salary/month',
				query: {
					month: this.type == '2' ? this.$route.query.month : row.month,
					staff_id: row.staff_id,
					is_charge: row.is_charge,
					staff_name: row.staff_name,
					depart_id: this.$route.query.depart_id
				}
			});
		},
		handleResetFirst() {
			this.$store.commit('COLLAGE_SALARY_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('COLLAGE_SALARY_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

