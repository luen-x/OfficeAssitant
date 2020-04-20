<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:loading="true"
			:mask-closable="false"
			class="v-sc-service-add-edit-complaint"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				{{ name === "add" ? "添加投诉记录" : "编辑投诉记录" }}
			</div>

			<i-form
				ref="form"
				:model="form"
				:rules="rule"
				:label-width="115"
				class="g-m-t-20"
			>
				<i-form-item label="投诉方式：" prop="complaint_type">
					<i-select 
						v-model="form.complaint_type"
						placeholder="请选择投诉方式" 
						style="width:220px" 
						clearable 
						transfer
					>
						<i-option 
							v-for="item in complaint" 
							:value="item.value" 
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>

				<i-form-item label="投诉时间：" prop="complaint_time">
					<i-datepicker
						v-model="form.complaint_time"
						:options="pickerOptionsStart"
						clearable
						transfer 
						type="date"
						split-panels 
						placeholder="请选择投诉时间"
						style="width: 220px;"
					/>
				</i-form-item>
	
				<i-form-item label="投诉员工：" prop="">
					<i-select 
						v-model="form.complaint_staff_id"
						:disabled="form.is_score"
						placeholder="请选择投诉员工" 
						style="width:220px" 
						clearable 
						transfer
						filterable
						multiple
						@on-change="handleStaffChange"
					>
						<i-option 
							v-for="item in complaint_staff" 
							:value="item.staff_id" 
							:key="item.staff_id"
							style="width:200px"
						>
							{{ item.staff_name }}{{ item.status == 4 ? "|已离职" : "" }}
						</i-option>
					</i-select>
				</i-form-item>

				<i-form-item label="投诉部门：" prop="" class="_complaint">
					<oa-tree-select
						v-model="form.complaint_depart_id"
						:data-source="departAll"
						:label-in-value="true"
						:width="220"
						:max-width="220"
						clearable
						transfer
						class="g-m-t-10" 
						placeholder="请选择投诉部门"
					/>
				</i-form-item>

				<i-form-item label="投诉内容：" prop="content">
					<oa-limit-words
						v-model="form.content"
						:max="500"
						placeholder="请输入投诉内容"
						style="width: 220px"
					/>
				</i-form-item>

				<i-form-item label="投诉证明人：" prop="reference">
					<i-input
						v-model="form.reference"
						:maxlength="15" 
						clearable
						placeholder="请输入投诉证明人姓名"
						style="width:220px"
					/>
				</i-form-item>

				<i-form-item label="投诉凭证：" prop="fileImage">
					<oa-upload
						v-model="form.fileImage" 
						:max="10"
						:upload="{multiple: true, max: 10}"
						style="width: 300px"
					/>
				</i-form-item>
			</i-form> 
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option, DatePicker } from "iview";
import { CreatePortal } from "wya-vc";
import { objRegex } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import Upload from "@components/_common/upload/upload";
import moment from "moment";
import treeSelect from "@common/tree-select/tree-select";
import { services } from "@stores/services/hr";

export default {
	name: "collage-service-manage-add-edit-complaint-modal",

	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-datepicker": DatePicker,
		"i-option": Option,
		"oa-upload": Upload,
		"oa-tree-select": treeSelect
	},

	mixins: [services.departAll()],

	props: {
		contract_company_id: Number,
		complaint_id: Number,
		name: String
	},

	data() {
		return {
			pickerOptionsStart: {
				disabledDate: time => {
					// 可通过箭头函数的方式访问到this
					return time.getTime() > Date.now();
				}
			},
			visible: false,
			resume: [],
			complaint: [{
				value: 1,
				label: "微信投诉"
			}, {
				value: 2,
				label: "电话投诉"
			}, {
				value: 3,
				label: "跑到办公室投诉"
			}, {
				value: 4,
				label: "客户对外负面传播"
			}, {
				value: 5,
				label: "其他"
			}],
			complaint_staff: [],
			form: {
				complaint_type: "", // 投诉方式：1微信投诉2电话投诉3跑到办公室投诉4客户对外负面传播5其他
				complaint_time: "", // 投诉时间
				complaint_staff_id: [], // 投诉人员id
				complaint_depart_id: [], // 投诉部门id
				content: "", // 投诉内容
				reference: "", // 投诉证明人
				fileImage: [],
				is_score: false
			},
			rule: {
				complaint_type: [{
					type: 'number',
					required: true,
					message: "请选择投诉方式",
					trigger: "change"
				}],
				complaint_time: [{
					required: true, 
					type: "date", 
					message: "请选择投诉时间", 
					trigger: "change"
				}],
				content: [{
					required: true,
					message: "请输入投诉内容",
					trigger: "blur"
				}],
				reference: [{
					required: true,
					message: "请输入投诉证明人姓名",
					trigger: "blur"
				}],
				fileImage: [{
					required: true,
					type: "array", 
					message: "请上传投诉凭证",
					trigger: "change"
				}]
			}
		};
	},

	watch: {
		'form.complaint_depart_id': function (newval, oldval) {
			if (newval.length > 15) {
				this.form.complaint_depart_id.pop();
				this.$Message.warning('最多选择15个投诉部门');
			}
		},
	},

	async mounted() {
		await this.loadStaffData();
		await this.complaint_id && this.loadData();
		this.visible = true;
	},

	methods: {
		handleStaffChange(e) {
			if (e.length > 15) {
				this.form.complaint_staff_id.pop();
				this.$Message.warning('最多选择15个投诉员工');
			}
		},
		loadStaffData() {
			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_GET_STAFF_GET,
				type: "GET",
				param: {
					type: 2
				}
			}).then(res => {
				this.complaint_staff = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		loadData() {
			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_COMPLAINT_INFO_GET,
				type: "GET",
				param: {
					complaint_id: this.complaint_id
				}
			}).then(res => {
				this.form.complaint_type = res.data.complaint_type;
				this.form.complaint_time = res.data.complaint_time;
				this.form.content = res.data.content;
				this.form.reference = res.data.reference;
				this.form.is_score = !!res.data.is_score;
				let complaint_staff_id = res.data.complaint_staff_id.split(",");

				complaint_staff_id.length != 0 && complaint_staff_id.forEach(item => {
					this.form.complaint_staff_id.push(+item);
				});

				res.data.fileImage.forEach(item => {
					this.form.fileImage.push({
						url: item.img_url,
						title: item.img_url.split("/")[6],
						type: "." + item.img_url.split("/")[6].split(".")[1],
						uid: item.img_url
					});
				});

				// 通过id遍历筛选出所选部门信息 
				this.searchSelectedDepart(this.departAll, res.data.complaint_depart_id.split(","));
			}).catch(error => {
				console.error(error);
				this.$Message.error(error.msg);
			});
		},
		
		handleOk() {
			if (this.form.complaint_staff_id.length === 0 && this.form.complaint_depart_id.length === 0) {
				this.$Message.warning({
					content: "投诉员工或者部门至少要填写其中一项才可以提交成功",
					duration: 3
				});
				
				this.$refs.modal.buttonLoading = false;

				return;
			}
			this.$refs.form.validateAndScroll(valid => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			let complaint_time = this.form.complaint_time
				&& moment(this.form.complaint_time).format("YYYY-MM-DD");

			let complaint_depart_id = [];

			this.form.complaint_depart_id.map(item => {
				complaint_depart_id.push(item.value);
				return;
			});

			let API = this.complaint_id ? "_SC_MANAGE_INSPECTION_EDIT_COMPLAINT_POST" : "_SC_MANAGE_INSPECTION_ADD_COMPLAINT_POST";
		
			this.$request({
				url: API_ROOT[API],
				type: "POST",
				param: {
					complaint_id: this.complaint_id,
					contract_company_id: this.contract_company_id,
					...this.form,
					complaint_staff_id: this.form.complaint_staff_id.join(","),
					complaint_depart_id: complaint_depart_id.join(","),
					complaint_time
				}
			}).then(res => {
				this.$Message.success(res.msg);
	
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);

				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit("close");
		},

		searchSelectedDepart(departArr, selectedIds) {
			for (let depart of departArr) {
				if (selectedIds.includes(depart.value + "")) {
					const selectedDepart = {
						value: depart.value,
						label: depart.label
					};

					this.form.complaint_depart_id.push(selectedDepart);

					if (this.form.complaint_depart_id.length === selectedIds.length) return;
				}

				if (depart.children && depart.children.length) {
					this.searchSelectedDepart(depart.children, selectedIds);
				}
			}
		}
	}
};

export const AddEditComplaintModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-service-add-edit-complaint{
    .ivu-modal-body{
		max-height: 390px;
        overflow-y: auto;
        overflow-x: hidden;
    }

	.ivu-select-dropdown,.ivu-select-dropdown-transfer{
		width: 220px !important;
	}

	._complaint{
		label{
			margin-top: 10px;
		}
	}
}
</style>