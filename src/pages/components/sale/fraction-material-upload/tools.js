import moment from 'moment';
import { ajax } from 'wya-fetch';
import VcConfig from '../../../routers/vc.config';

const uploadConfig = VcConfig({}).Upload;

/**
 * 获取员工列表
 */
export function loadStaffList(search, listName) {
	this[listName] = [];
	this[listName + '_loading'] = true;

	return this.$request({
	   url: '_HR_MUTI_TERM_STAFF_GET',
	   type: 'GET',
	   loading: false,
	   param: {
		   search: search ? search.split('-')[0] : ''
	   },
	   autoTip: false
	}).then(res => {
	   this[listName + '_loading'] = false;
	   if (Array.isArray(res.data)) {
		   res.data.forEach(item => {
			   item.staff_name = item.staff_name.split('/')[0] + '-' + item.mobile + '-' + item.depart_name;
		   });
		   this[listName] = res.data;
	   }
	}).catch(error => {
	   this[listName + '_loading'] = false;
	   this.$Message.error(error.msg); 
	});
}
/**
 * 加载录音表单相关配置信息
 */
export function loadTapeData(propName) {
	this.$request({
		url: '_SALE_LIBRARY_MATERIAL_TAPE_DATA_GET',
		type: 'GET',
		loading: false,
		param: {},
		autoTip: false
	}).then(res => {
		this[propName + 's'] = res.data[propName];
	}).catch(error => {
		this.$Message.error(error.msg);
	});
}

/**
 * 处理请求参数
 */
export function handleParams(material_id, tape_id, material_list) {
	let param = {};
	let tape_temp = (material_id && !material_list) ? {} : ({ material_id, tape_id } || {});
	let material_temp = material_id ? { material_id } : {};
	let file_list = material_list ? { material_list } : {};
	const base_param = {
		...material_temp,
		...file_list,
		type: this.type,
		is_control_role: 1,
		material_use: this.formData.material_use,
		provider_ids: this.formData.provider_ids,
		describe: this.formData.describe,
	};

	switch (this.formData.material_use) {
		case 4:
			param = { 
				...base_param,
				tape: {
					...tape_temp,
					type: 1,
					tape_material_name: this.formData.tape_material_name,
					tape_date: moment(this.formData.tape_date).format("YYYY-MM-DD"),
					tape_person_id: this.formData.tape_person_id,
					customer_info: this.formData.customer_info,
					base_situation: this.formData.base_situation,
					customer_product: this.formData.customer_product,
					negotiator_id: this.formData.negotiator_id,
					communicate_place: this.formData.communicate_place,
					communicate_result: this.formData.communicate_result,
					operation_flow: this.formData.operation_flow,
					customer_problem: this.formData.customer_problem,
					colleague_do: this.formData.colleague_do
				}
			};
			break;
		case 5:
			param = { 
				...base_param,
				tape: {
					...tape_temp,
					type: 2,
					tape_material_name: this.formData.tape_material_name,
					tape_date: moment(this.formData.tape_date).format("YYYY-MM-DD"),
					tape_person_id: this.formData.tape_person_id,
					chief_prosecutor_id: this.formData.chief_prosecutor_id,
					train_theme: this.formData.train_theme,
					train_program: this.formData.train_program,
					train_object: this.formData.train_object
				}
			};
			break;
		case 6:
			param = { 
				...base_param,
				tape: {
					...tape_temp,
					type: 3,
					tape_material_name: this.formData.tape_material_name,
					tape_date: moment(this.formData.tape_date).format("YYYY-MM-DD"),
					tape_person_id: this.formData.tape_person_id,
					customer_info: this.formData.customer_info,
					chief_prosecutor_id: this.formData.chief_prosecutor_id,
					company_type: this.formData.company_type,
					advisory_information: this.formData.advisory_information,
					reservation_purpose: this.formData.reservation_purpose,
					customer_stage: this.formData.customer_stage
				}
			};
			break;
		case 7:
			param = { 
				...base_param,
				tape: {
					...tape_temp,
					type: 4,
					tape_material_name: this.formData.tape_material_name,
					content_validity: this.formData.content_validity,
					belong_plate: this.formData.belong_plate
				}
			};
			break;
		default:
			param = { ...base_param };
			break;
	}
	return param;
}
export async function postFile(file) {
	let response;
	if (uploadConfig.onPostBefore) {
	 response = await uploadConfig.onPostBefore(file);
		if (typeof response !== 'object') {
			console.error('[wya-vc/upload]: onBefore必须返回对象');
			// eslint-disable-next-line prefer-promise-reject-errors
			return Promise.reject('上传失败');
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
	}).then((res) => {
		return res;
	});

}