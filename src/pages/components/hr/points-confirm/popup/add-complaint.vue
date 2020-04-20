<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:loading="true"
			:mask-closable="false"
			class="sc-service-quality"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				添加投诉记录
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
						:remote-method="getPercenList"
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
						:remote-method="getPartList"
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
						placeholder="请输入投诉内容，例如超限承诺、未跟踪服务"
						width="220px" />
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
						<div slot="trigger" class="g-flex-ac">
							<div class="_upload">
								<i class="iconfont icon-upload" />
								上传凭证
							</div>
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
import { Modal, DatePicker, Button, Form, FormItem, Select, Option, Input, Message, Progress } from 'iview';
import { CreatePortal, Upload, FilesPicker } from 'wya-vc';
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import Explain from '@components/_common/explain/explain';
import addData from './add-complaint-data';

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
		'oa-explain': Explain
	},
	mixins: [addData],
	props: {
		name: String,
		datas: {
			type: Object,
			default: () => {}
		},
		contract_company_id: String
	},
	data() {
		return {
			visible: false,
			formdata: {},
		};
	},
	mounted() {
		// this.getPersonDefault();
		this.visible = true;
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
							object.id = item.staff_id;
							object.name = item.staff_name + '(' + item.depart_name + ')';
							this.complaintPerList.push(object);
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
							object.id = item.depart_id;
							object.name = item.depart_name;
							this.complaintPartList.push(object);
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
		handleSave() {
			let obj = {};
			obj.certificates = [];
			this.addComplaintData.uploadList.map(item => {
				obj.certificates.push(item.url);
				return;
			});
			obj.contract_company_id = parseInt(this.contract_company_id, 10);
			obj.complain_type = this.addComplaintData.method;
			obj.complain_time = moment(this.addComplaintData.time).format('YYYY-MM-DD HH:mm:ss');
			obj.complain_prove_name = this.addComplaintData.name;
			obj.complain_depart_id = this.addComplaintData.cPart.toString();
			obj.complain_staff_id = this.addComplaintData.cPersen.toString();
			obj.complain_content = this.addComplaintData.content;
			this.$request({
					url: API_ROOT['_HR_POINT_COMPLAINTLIST_ADD_POST'], // eslint-disable-line
				type: "POST",
				param: obj
			}).then((res) => {
				Message.success('添加投诉成功');
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleError(err) {
			// this.addComplaintData.uploadList.pop();
			this.$Message.warning(err.msg);
		},
	}
};
export const AddComplaintModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.sc-service-quality {
	.ivu-modal-body {
		max-height: 400px;
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


