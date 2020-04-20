export default {
	data() {
		return {
			columns: [
				{
					title: '素材',
					key: 'material_name',
					tooltip: true
				},
				{
					title: '下载人',
					key: 'staff_name'
				},
				{
					title: 'IP地址',
					key: 'ip'
				},
				{
					title: '地区',
					key: 'city_name'
				},
				{
					title: '下载时间',
					key: 'create_time'
				},
				{
					title: '所属类目',
					key: 'category_name'
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_SETOOLKIT_DOWNLOAD_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_SETOOLKIT_DOWNLOAD_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		}
	}
};

