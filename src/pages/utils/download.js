import Oss from 'ali-oss';
import API_ROOT from '@stores/apis/root';
import { getBrowser, getHashUrl } from '@utils/utils';
import net from './net';

const DEV_OSS_URL = 'https://wyatest.oss-cn-hangzhou.aliyuncs.com/';
const DEV_OSS_URL2 = 'http://wyatest.oss-cn-hangzhou.aliyuncs.com/'; // 本地调试用
const PROD_OSS_URL = 'https://wya-oa.oss-cn-hangzhou.aliyuncs.com/';

/**
 * 获取oss签名
 */
const loadOssSignature = () => {
	return net.ajax({
		url: API_ROOT._COMMON_OSS_SIGNATURE_GET,
		type: "POST",
		param: {},
		loading: false
	});
};
/**
 * 添加下载记录
 * @param {*} param 
 */
const addDownRecord = (param) => {
	return net.ajax({
		url: API_ROOT._TOOLKIT_DOWNLOAD_RECORD_POST,
		type: "POST",
		param,
		loading: false
	}).catch(err => console.error(err));
};
/**
 * 获取文件下载地址
 */
const getDownloadUrl = async (fileName) => {
	let url;
	if (fileName.includes('wya-vedio.oss-cn-hangzhou')) {
		// 特殊处理这种url（是外部上传的图片，从后端下载）
		url = `${API_ROOT._COMMON_OSS_DOWNLOAD_GET}?-token=${_global.token}&attachment_urls=${fileName}`;
	} else {
		const param = await loadOssSignature();
		const { region, accessKeySecret, bucket, OSSAccessKeyId } = param.data;
		const client = new Oss({
			region,
			accessKeyId: OSSAccessKeyId,
			accessKeySecret,
			bucket
		});
		fileName = fileName.replace(DEV_OSS_URL, '').replace(PROD_OSS_URL, '').replace(DEV_OSS_URL2, '');
		url = client.signatureUrl(fileName, {
			response: { 'content-disposition': 'attachment' }
		});
	}
	return url;
};

const iframeDownload = (url) => {
	let iframe = document.createElement('iframe');
	iframe.id = (new Date()).getTime();
	iframe.addEventListener('load', function () {
		document.body.removeChild(iframe);
	}); 
	// hack 因为预览类型的文件，onload不会执行，所以在iframe内在创建一个下载的iframe
	iframe.srcdoc = `<iframe src='${url}'></iframe>`;
	document.body.appendChild(iframe);

};
/**
 * 文件下载 
 */
export const downloadFile = async (options) => {

	let url = await getDownloadUrl(options.fileName);
	if (!url) return;
	if (options.downRecordParams) addDownRecord(options.downRecordParams);
	iframeDownload(url);
};
export const download = ({ path, query }) => {
	const hashUrl = getHashUrl(API_ROOT[path], { ...query, '-token': window.app.$global.token });
	const bro = getBrowser();
	if (bro === 'Chrome' || bro === "Safari" || bro === 'Firefox') {
		iframeDownload(hashUrl);
	} else {
		window.open(hashUrl);
	}
};
export default downloadFile;