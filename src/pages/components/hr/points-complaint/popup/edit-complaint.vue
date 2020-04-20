<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			:width="420"
			class="sc-service-quality-edit"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				编辑投诉记录
			</div>
			<i-form 
				ref="addComplaintData" 
				:model="addComplaintData" 
				:rules="complaintRule" 
				:label-width="100" 
				class="g-m-t-20"
				style="max-height: 400px;overflow-y:auto;">
				<i-form-item label="投诉方式:" prop="method">
					<i-select
						v-model="addComplaintData.method"
						style="width: 220px"
						transfer
					>
						<i-option v-for="item in complainMethodList" :value="item.id" :key="item.id">{{ item.name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="投诉时间:" prop="time">
					<i-datepicker
						v-model="addComplaintData.time"
						style="width: 220px"
						placeholder="请选择投诉时间"
						transfer
					/>
				</i-form-item>
				<i-form-item label="投诉证明人:" prop="name">
					<i-input
						v-model="addComplaintData.name"
						style="width: 220px"
						placeholder="请输入证明人姓名"
					/>
					<oa-explain 
						class="g-m-l-5"
						style="transform: translateY(2px);"
						title="能够证明投诉信息来源属实的人"
						content="举例：假如客服收到客户对某销售员工的投诉，该客服就可以作为投诉证明人"
					/>
				</i-form-item>
				<i-form-item label="投诉员工:" prop="cPersen">
					<i-select
						v-model="addComplaintData.cPersen"
						:loading="cpercenLoading"
						:remote-method="personMethod"
						style="width: 220px"
						multiple
						filterable
						remote
						transfer
					>
						<i-option v-for="item in complaintPerList" :value="item.id" :key="item.id">{{ item.name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="投诉部门:" prop="cPart">
					<i-select
						v-model="addComplaintData.cPart"
						:loading="cpartLoading"
						:remote-method="partMethod"
						style="width: 220px"
						multiple
						filterable
						remote
						transfer
					>
						<i-option v-for="item in complaintPartList" :value="item.id" :key="item.id">{{ item.name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="投诉内容：" prop="content">
					<oa-limit-words
						v-model="addComplaintData.content"
						:max="500"
						style="width: 220px"
						placeholder="请输入投诉内容，例如超限承诺、未跟踪服务"
					/>
				</i-form-item>
				<i-form-item prop="uploadList" class="g-relative">
					<span slot="label">
						<span>上传凭证</span>
						<oa-explain 
							style="margin: 0 -1px"
							content="能够证明客户投诉的相关凭证，比如微信截图、电话录音等"
						/>：
					</span>
					<vc-files-picker 
						ref="filesPicker" 
						v-model="addComplaintData.uploadList" 
						:upload="{
							multiple: true, 
							max: 10, 
							size: 200, 
							accept: 'image/jpeg, image/jpg, image/png, audio/mpeg'
						}"
						:max="10"
						@error="handleError"
					>
						<template slot-scope="slotProps">
							<div>
								<div 
									v-for="(item, index) in slotProps.files" 
									:key="index"
								>
									<div style="width:100%;" class="g-flex">
										<i class="iconfont icon-accessory"/>
										<span :style="{color: item.errorFlag ? 'red':''}" class="_file-title">{{ item.title }}</span>
										<span 
											class="g-fr g-operation" 
											style="width: 30px"
											@click="handleDeleteFile(item, index)">
											删除
										</span>
									</div>
									<i-progress v-if="!item.errorFlag" :percent="parseInt(item.percent)"/>
								</div>
							</div>
						</template>
						<div slot="trigger" class="_upload">
							<i class="iconfont icon-upload" />
							上传凭证
						</div>
					</vc-files-picker>
					<!-- <span style="margin-left:10px;">未选择任何文件</span> -->

					<div class="_prompt">(上限10个)</div>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Progress, Button, Form, FormItem, Select, Option, Input, Message } from 'iview';
import { CreatePortal, Upload, FilesPicker } from 'wya-vc';
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import LimitWords from '@components/_common/limit-words/limit-words';
import Explain from '@components/_common/explain/explain';
import editComplaintData from './edit-complaint-data';

export default {
	name: 'sc-service-add-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-input': Input,
		'vc-upload': Upload,
		"vc-files-picker": FilesPicker,
		'i-progress': Progress,
		'oa-limit-words': LimitWords,
		'oa-explain': Explain,
	},
	mixins: [editComplaintData],
	props: {
		datas: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			visible: false,
			formdata: {},
			personMethod: null,
			partMethod: null
		};
	},
	mounted() {
		this.visible = true;
		this.addComplaintData.method = this.datas.complain_type + '';
		this.addComplaintData.time = this.datas.complain_time;
		this.addComplaintData.name = this.datas.prove_name;
		this.addComplaintData.content = this.datas.complain_content;
		this.addComplaintData.cPersen = this.datas.complain_staff_id;
		this.addComplaintData.cPart = this.datas.complain_depart_id;
		this.datas.fileImage.map(item => {
			let obj = {};
			obj.title = item.file_name;
			obj.url = item.src;
			obj.percent = 100.00;
			this.addComplaintData.uploadList.push(obj);
			return;
		});
		
		// 投诉对象 远程搜索回显默认值
		let tempComplaintStaff = this.datas.complain_staff_name.split(',');
		for (let i = 0; i < this.datas.complain_staff_id.length; i++) {
			this.complaintPerList[i] = {
				id: this.datas.complain_staff_id[i],
				name: tempComplaintStaff[i]
			};
		}
		let tempComplaintDepart = this.datas.complain_depart_name.split(',');
		for (let i = 0; i < this.datas.complain_depart_id.length; i++) {
			this.complaintPartList[i] = {
				id: this.datas.complain_depart_id[i],
				name: tempComplaintDepart[i]
			};
		}

		this.personMethod = this.getPercenList;
		this.partMethod = this.getPartList;
	},
	methods: {
		getPercenList(query) {
			if (query !== '') {
				this.cpercenLoading = true;
				setTimeout(() => {
					this.cpercenLoading = false;
					this.$request({
					url: API_ROOT['_HR_POINTS_COMPLAINT_CPERSON_LIST_GET'], // eslint-disable-line
						type: "GET",
						param: {
							staff_name: query
						}
					}).then((res) => {
						this.complaintPerList = [];
						res.data.map(item => {
							let object = {};
							if (!this.addComplaintData.cPersen.includes((item.staff_id + ''))) {
								object.id = item.staff_id;
								object.name = item.staff_name + '(' + item.depart_name + ')';
								this.complaintPerList.push(object);
							}
							return;
						});
					}).catch((error) => {

					});
				}, 200);
			} else {
				this.complaintPerList = [];
			}
		},
		getPartList(query) {
			if (query !== '') {
				this.cpartLoading = true;
				setTimeout(() => {
					this.cpartLoading = false;
					this.$request({
					url: API_ROOT['_HR_POINTS_COMPLAINT_CPART_LIST_GET'], // eslint-disable-line
						type: "GET",
						param: {
							depart_name: query
						}
					}).then((res) => {
						this.complaintPartList = [];
						res.data.map(item => {
							let object = {};
							if (!this.addComplaintData.cPart.includes((item.depart_id + ''))) {
								object.id = item.depart_id;
								object.name = item.depart_name;
								this.complaintPartList.push(object);
							}
							return;
						});
					}).catch((error) => {

					});
				}, 200);
			} else {
				this.complaintPartList = [];
			}
		},
		handleDeleteFile(item, index) {
			this.$refs.filesPicker && this.$refs.filesPicker.handleDel(item, index);
			// this.addComplaintData.uploadList.splice(index, 1);
		},
		handleFileSuccess(res, file) {
			let obj = {};
			obj.certificates = res.data.url;
			obj.title = res.data.title;
			this.addComplaintData.uploadList.push(obj);
			Message.destroy();
			Message.success({
				content: `上传成功`
			});
		},
		handleOk() {
			this.$refs.addComplaintData.validate((valid) => {
				if (valid) {
					this.visible = false;
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleSave() {
			let obj = {};
			obj.certificates = [];
			this.addComplaintData.uploadList.map(item => {
				obj.certificates.push(item.url);
				return;
			});
			obj.complain_record_id = parseInt(this.datas.complain_record_id, 10);
			obj.complain_type = this.addComplaintData.method;
			obj.complain_time = moment(this.addComplaintData.time).format('YYYY-MM-DD HH:mm:ss');
			obj.complain_prove_name = this.addComplaintData.name;
			obj.complain_depart_id = this.addComplaintData.cPart.toString();
			obj.complain_staff_id = this.addComplaintData.cPersen.toString();
			obj.complain_content = this.addComplaintData.content;
			this.$request({
				url: API_ROOT['_HR_POINT_COMPLAINTLIST_EDIT_POST'], // eslint-disable-line
				type: "POST",
				param: obj
			}).then((res) => {
				Message.success('编辑投诉成功');
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleError(err) {
			// his.addComplaintData.uploadList.pop();
			this.$Message.warning(err.msg);
		},
	}
};
export const EditComplaintModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.sc-service-quality-edit {
	.ivu-modal-body {
		max-height: 500px;
		overflow-y: auto;
		@media screen and (max-height: 768px) {
			max-height: 350px;
			overflow-y: auto;
		}
	}
	.ivu-select-multiple .ivu-select-selection {
		max-height: 100px;
		overflow-y: auto;
	}
	._prompt{
		position: absolute;
		color: #bbbbbb;
		top: 18px;
		left: -74px;
	}
	._file-title {
		width: 210px;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	._upload {
		line-height: 29px;
		width: 80px;
		text-align: center;
		height: 32px;
		background: #fafafa;
		border: 1px solid #d4d7d8 !important;
		color: #333;
		border-radius: 4px;
		cursor: pointer;
		&:hover {
			border: 1px solid #E84C57 !important;
			color: #E84C57;
		}
	}
	.vcp-files-picker {
		padding: 0;
		margin: 0;
	}
}
</style>


