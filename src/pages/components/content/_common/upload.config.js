export function uploadBefore(files) {
	if (files.length > 20) {
		return Promise.reject({ msg: '文件数量不能超过20个', error_type: 'error_name' })// eslint-disable-line
	}
	let size = 0;
	const IMAGE_LEGAL_REGEX = /[@#￥%&+ ]/;
	const FILE_LEGAL_REGEX = /[@#￥%&+]/;
	let result;

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		size = file.size + size;
		if (file.size > 1048576000) {
			result = { msg: '单个文件大小不能超过1G个', error_type: 'error_name' };
			break;
		}
		if (size > 8388608000) {
			result = { msg: '文件夹大小不能超过8G个', error_type: 'error_name' };
			break;
		}
		let regex = file.type.indexOf('image') > -1 ? IMAGE_LEGAL_REGEX : FILE_LEGAL_REGEX;
		if (regex.test(file.name)) {
			result = { msg: '文件名称不合法, 不能包含@#￥%&+和空格', error_type: 'error_name' };
			break;
		}
	}
	return new Promise((resolve, reject) => {
		if (result) {
			reject(result);
		} else {
			resolve() // eslint-disable-line
		}
	});
}
