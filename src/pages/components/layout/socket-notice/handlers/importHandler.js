// 导入文件统一处理的handler
// payload.status : 0 未上传，1 上传中， 2 上传成功， 3 上传失败 

const createImportHandler = ({ mutation = '', event = '0', initListMutation = '', successTip = '' }) => {
	return {
		[event]: (data) => {
			const payload = { percent: data.percent };
			if (data.status == 0) { // 上传失败
				payload.status = 3;
				app.$Message.error(data.msg);
			} else if (data.status == 1) {
				if (data.percent == 100) {
					payload.status = 2;
					successTip && app.$Message.success(successTip);
					initListMutation && app.$store.commit(initListMutation);
				} else {
					payload.status = 1;
				}
			}
			app.$store.commit(mutation, payload);
		}
	};
};
export default createImportHandler;