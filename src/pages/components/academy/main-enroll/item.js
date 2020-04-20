export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': [],
			},
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('academy-main-enroll-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('academy-main-enroll-title-change');
	},
	methods: {
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},
		handleResetFirst() {
			this.$store.commit('ACADEMY_MAIN_ENROLL_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_MAIN_ENROLL_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		getColumns(data = { title_show: [], title_hide: [] }, type) {
			let columns = [
				{
					title: '姓名',
					minWidth: 150,
					key: 'staff_name',
				},
				{
					title: '报名课程',
					minWidth: 150,
					key: 'course_name',
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
					title: '报名时间',
					minWidth: 180,
					key: 'create_time',
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

