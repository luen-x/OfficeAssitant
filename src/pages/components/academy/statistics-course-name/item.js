export default {
	data() {
		return {
			columns: [
				{
					title: '战区',
					key: 'zone_name',
					minWidth: 220,
					fixed: "left"
				},
				{
					title: '报名人数',
					key: 'apply_count',
					sortable: "custom",
					minWidth: 100
				},
				{
					title: '出勤人数',
					key: 'join_count',
					sortable: "custom",
					minWidth: 100
				},
				{
					title: '上传作业人数',
					key: 'upload_count',
					sortable: "custom",
					minWidth: 100
				},
				{
					title: '出勤率',
					key: 'attendance_count',
					minWidth: 100
				}
			]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('ACADEMY_STATISTICS_COURSE_NAME_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_STATISTICS_COURSE_NAME_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		}
	}
};