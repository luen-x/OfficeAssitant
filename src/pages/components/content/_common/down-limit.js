export default {
	methods: {
		loadWarningLimit(material_type, download_num) {
			return	this.$request({
				url: _CONTENT_MATERIAL_DOWNLOAD_WARNING_LIMIT_NOTICE_GET,
				type: 'GET',
				param: {
					material_type,
					download_num
				},
			}).then((res) => {
				this.$Message.success(res.msg);
			}).catch((err) => {
				this.$Message.error(err.msg);
			});
		}
	},
};

