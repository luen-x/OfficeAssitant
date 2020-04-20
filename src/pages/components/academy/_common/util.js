
export default {
	data() {
		return {
			materialType: [],
			materialUse: [],
			courseList: [],
		};
	},
	mounted() {
		this.$request({
			url: '_CONTENT_CONFIG_MATERIAL_MATERIAL_TYPE_GET',
			type: 'get',
		}).then((res) => {
			this.materialType = res.data;
		});
		this.$request({
			url: '_CONTENT_CONFIG_MATERIAL_MATERIAL_USE_GET',
			type: 'get',
		}).then((res) => {
			this.materialUse = res.data;
		});
		this.$request({
			url: '_CONTENT_LIBRARY_MATERIAL_GET_COURSE_POST',
			type: 'get',
		}).then((res) => {
			this.courseList = res.data;
		});
	},
};