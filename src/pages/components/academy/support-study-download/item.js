export default {
	data() {
		return {
			columns: [
				{
					title: '素材名称',
					key: 'material_name',
					tooltip: true,
					minWidth: 160,
				},
				{
					title: '下载人',
					key: 'staff_name',
					minWidth: 160,

				},
				{
					title: 'IP地址',
					key: 'ip',
					minWidth: 160,
				},
				{
					title: '地区',
					key: 'city_name',
					minWidth: 160,
				},
				{
					title: '下载时间',
					key: 'create_time',
					minWidth: 160,
				},
				{
					title: '所属类目',
					key: 'category_name',
					minWidth: 160,
					tooltip: true,
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('ACADEMY_SUPPORT_STUDY_DOWNLOAD_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_SUPPORT_STUDY_DOWNLOAD_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},

	}
};
