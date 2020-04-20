// eslint-disable-next-line import/no-cycle
import VcConfig from '@routers/vc.config';
import { ajax } from 'wya-fetch';

const uploadConfig = VcConfig({}).Upload;

export async function postFile(file, onProgress = () => {}, getInstance, afterCheck) {
	let response = {};
	const IMAGE_LEGAL_REGEX = /[@#￥%&+ ]/;
	const FILE_LEGAL_REGEX = /[@#￥%&+]/;
	if (uploadConfig.onPostBefore) {

		response = await uploadConfig.onPostBefore(file).catch(i => i);
		afterCheck && afterCheck(response);
		if (typeof response !== 'object') {
			console.error('[wya-vc/upload]: onBefore必须返回对象');
			// eslint-disable-next-line prefer-promise-reject-errors
			return Promise.reject({ msg: '上传失败', error_type: 'unkonw' });
		}
		if (response.error_type) {
			return Promise.reject(response);
		}
	}
	return ajax({
		url: uploadConfig.URL_UPLOAD_FILE_POST,
		type: "FORM",
		param: {
			name: uploadConfig.FORM_NAME || 'file',
			file,
			data: { ...response }
		},
		onAfter: uploadConfig.onPostAfter,
		headers: {},
		onProgress: e => onProgress(e),
		getInstance
	});

}