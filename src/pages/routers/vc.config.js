import { Message } from 'iview';
import { OSS_FILE_URL, OSS_NO_MESSAGE02 } from '@constants/constants';
import API_ROOT from '@stores/apis/root';
// eslint-disable-next-line import/no-cycle
import net from '../utils/net';

export const IMAGE_LEGAL_REGEX = /[@#￥%&+ ]/;
export const FILE_LEGAL_REGEX = /[@#￥%&+]/;

/**
 * 需要处理是测试还是正式
 */
const UploadProduction = {
	URL_UPLOAD_IMG_POST: OSS_FILE_URL,
	URL_UPLOAD_FILE_POST: OSS_FILE_URL,
	onPostBefore: (file = {}) => {
		let regex = file.type.indexOf('image') > -1 ? IMAGE_LEGAL_REGEX : FILE_LEGAL_REGEX;
		if (regex.test(file.name)) {
			// Message.warning('文件名称不合法');
			return new Promise((resolve, reject) => {
				reject({ msg: '文件名称不合法, 不能包含@#￥%&+和空格',error_type:'error_name' }); // eslint-disable-line
			});
		}
		const suffix = file.name.split('.').pop();
		if (!/^[a-zA-Z0-9]+$/.test(suffix)) {
			// Message.warning('文件名称不合法');
			return new Promise((resolve, reject) => {
				console.error('error name ', file.name);
				reject({ msg: '文件名后缀必须是英文或数字',error_type:'error_name' }); // eslint-disable-line
			});
		}
		if (file.type.indexOf('image') > -1 && file.size > 20971520) {
			// Message.warning('图片大小不能超过20M');
			return new Promise((resolve, reject) => {
				reject({ msg: '图片大小不能超过20M',error_type:'error_size' }); // eslint-disable-line
			});
		}
		if (file.size > 1048576000) {
			return new Promise((resolve, reject) => {
				reject({ msg: '单个文件大小不能超过1G',error_type:'error_size' }); // eslint-disable-line
			});
		}
		return net.ajax({
			url: API_ROOT['_COMMON_OSS_SIGNATURE_GET'],
			type: "POST",
			param: {},
		}).then(res => {
			return {
				bucket: res.data.bucket,
				policy: res.data.policy,
				OSSAccessKeyId: res.data.OSSAccessKeyId,
				signature: res.data.signature,
				'success_action_status': '200',
				key: res.data.dir + new Date().getTime() + '/' + file.name
			};
		}).catch(error => {
			console.error("[vc-upload: onPostBefore]" + error.msg);
			return {};
		});
	},
	onPostAfter: (response = {}, options = {}, xhr = {}) => { // eslint-disable-line
		if (xhr.status === 200) {
			return {
				status: 1,
				data: {
					url: options.url + '/' + options.param.data.key,
					type: '.' + options.param.file.name.split('.').pop(),
					uid: options.param.file.uid,
					title: options.param.file.name,
					size: options.param.file.size
				}
			};
		}
		return response;
	}
};
// 本地调试upload时使用
const UploadDev = {
	// URL_UPLOAD_IMG_POST: 'https://wyaoa-new.ruishan666.com/uploadfile/upimg.json?action=uploadimage&encode=utf-8&code=oa',
	URL_UPLOAD_IMG_POST: "https://oa2.ruishan666.com/_cms/api/image/upload.json",

	// URL_UPLOAD_FILE_POST: 'https://wyaoa-new.ruishan666.com/uploadfile/upimg.json?action=uploadimage&encode=utf-8&code=oa',
	URL_UPLOAD_FILE_POST: "https://oa2.ruishan666.com/_cms/api/image/upload.json",

	FORM_NAME: 'Filedata',
	onPostBefore: (file = {}) => {
		let regex = file.type.indexOf('image') > -1 ? IMAGE_LEGAL_REGEX : FILE_LEGAL_REGEX;
		if (regex.test(file.name)) {
			// Message.warning('文件名称不合法');
			return new Promise((resolve, reject) => {
				console.error('error name ', file.name);
					reject({ msg: '文件名称不合法, 不能包含@#￥%&+和空格',error_type:'error_name' }); // eslint-disable-line
			});
		}
		const suffix = file.name.split('.').pop();
		if (!/^[a-zA-Z0-9]+$/.test(suffix)) {
			// Message.warning('文件名称不合法');
			return new Promise((resolve, reject) => {
				console.error('error name ', file.name);
				reject({ msg: '文件名后缀必须是英文或数字',error_type:'error_name' }); // eslint-disable-line
			});
		}
		if (file.type.indexOf('image') > -1 && file.size > 20971520) {
			// Message.warning('图片大小不能超过20M');
			return new Promise((resolve, reject) => {
					reject({ msg: '图片大小不能超过20M',error_type:'error_size' }); // eslint-disable-line
			});
		}
		if (file.size > 1048576000) {
			return new Promise((resolve, reject) => {
					reject({ msg: '文件大小不能超过1G',error_type:'error_size' }); // eslint-disable-line
			});
		}
		return Promise.resolve({});
	},
	onPostAfter: (response = {}, options = {}, xhr = {}) => { // eslint-disable-line
		if (response.status === 1) {
			const file = response.data[0];
			if (!file) {
				console.error(response.msg);
				return {
					status: 1,
					data: {
						url: '',
					}
				};
			}
			return {
				status: 1,
				data: {
					url: file.file_url,
					type: file.file_ext,
					uid: file.file_url,
					title: file.title,
					size: file.size
				}
			};
		} else {
			console.error(response.msg);
			return {
				status: 1,
				data: {
					url: '',
				}
			};
		}
	}
};
export default (options) => ({
	store: options.store,
	router: options.router,
	Upload: __DEV__ ? UploadDev : UploadProduction,
	CreatePortal: {
		aliveRegExp: {
			// eslint-disable-next-line max-len
			className: /(ivu-drawer-body|v-transfer-dom|ivu-select-dropdown|pswp|ivu-table-row|g-operation|c-preview|g-prevent-portal)/
		}
	},
	Paging: {
		pageOpts: {
			showTotal: true,
			showSizer: true,
			showElevator: true,
			placement: 'top',
			pageSizeOpts: [10, 20, 30]
		},
		pageSize: 10,
		tableOpts: {
			noDataText: `
			<div class="g-m-tb-20 g-flex" style="justify-content: space-evenly;" >
				<div>
					<div>
						<img style="width:100px;" src="${OSS_NO_MESSAGE02}" />
					</div>
					<div>
						暂无数据
					</div>
				</div>
			</div>`
		}
		// loading: () => {
		// 	return (
		// 		<div>xx</div>
		// 	);
		// }
	}
});
