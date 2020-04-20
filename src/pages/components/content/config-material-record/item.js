export default {
	data() {
		return {
			columns1: [
				{
					title: '素材名称',
					key: 'material_name',
					tooltip: true,
					minWidth: 160,
				},
				{
					title: '素材用途',
					key: 'material_use_name',
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
			columns2: [
				{
					title: '素材名称',
					key: 'material_name',
					tooltip: true,
					minWidth: 160,
				},
				{
					title: '素材用途',
					key: 'material_use_name',
					minWidth: 160,
				},
				{
					title: '素材提供人',
					key: 'provider_name',
					minWidth: 160,
					tooltip: true,
				},
				{
					title: '是否加学分',
					key: 'is_add_credit_name',
					minWidth: 160,
				},
				{
					title: '上传类目',
					key: 'category_name',
					minWidth: 160,
					tooltip: true,
				},
				{
					title: '上传人',
					key: 'staff_name',
					minWidth: 160,
				},
				{
					title: '上传时间',
					key: 'create_time',
					minWidth: 160,
				}
			],
		};
	},
	computed: {
		columns() {
			return this.type == 2 ? this.columns2 : this.columns1;
		}
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_CONFIG_MATERIAL_RECORD_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_CONFIG_MATERIAL_RECORD_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},

	}
};

