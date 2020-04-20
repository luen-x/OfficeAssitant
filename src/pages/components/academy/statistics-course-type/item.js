export default {
	data() {
		return {
			colomnStore: {}, // 缓存列表字段
			columns: [
				{
					title: '参与人数',
					key: 'all_join_count',
					sortable: "custom",
					minWidth: 100
				},
				{
					title: '实际出勤人数',
					key: 'join_count',
					sortable: "custom",
					minWidth: 100
				},
				{
					title: '缺勤人数',
					key: 'no_join_count',
					minWidth: 100
				},

				{
					title: '作业上传人数',
					key: 'upload_count',
					sortable: "custom",
					minWidth: 100
				},
				{
					title: '作业未上传人数',
					key: 'no_upload_count',
					minWidth: 100
				},
				{
					title: '作业通关人数',
					key: 'pass_count',
					sortable: "custom",
					minWidth: 100
				},


				{
					title: '出勤率',
					key: 'attendance_count',
					minWidth: 100,
				},
				{
					title: '通关率',
					key: 'pass_rate',
					minWidth: 100,
				}
			]
		};
	},
	methods: {
		getColumn(type) {
			let columns = [];

			if (this.colomnStore[type]) {
				return this.colomnStore[type];
			} else {
				switch (+type) {
					case 1:
						columns = [
							{
								title: '战区',
								key: 'zone_name',
								minWidth: 220,
								fixed: "left"
							},
							...this.columns
						];

						break;

					case 2:
						columns = [
							{
								title: '部门',
								key: 'depart_name',
								minWidth: 220,
								fixed: "left"
							},
							...this.columns
						];

						break;

					default:
						break;
				}
			}

			this.colomnStore[type] = columns;

			return columns;
		},
		handleResetFirst() {
			this.$store.commit('ACADEMY_STATISTICS_COURSE_TYPE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_STATISTICS_COURSE_TYPE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		}
	}
};