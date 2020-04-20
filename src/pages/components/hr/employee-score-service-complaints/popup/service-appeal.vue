<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="800"
			:loading="true"
			:mask-closable="false"
			class="hr-service-complaints-appeal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				服务提成申诉
			</div>

			<div>
				<div class="g-c-black g-m-t-15 g-fs-18">{{ service_data.contract_company_name }}</div>
				<div class="g-m-t-20">
					<span class="g-m-l-10">申请类型：</span>
					<span class="g-m-l-10">
						{{ service_data.apply_type }}（{{ service_data.appeal_step }}、共计{{ service_data.service_amount }}元）
					</span>
				</div>
				<div class="g-m-t-20 g-flex">
					<span class="g-m-l-10">审核流程：</span>
					<span class="g-m-l-10">
						<oa-across-table :data="service_data.audit_schedule" style="margin-top: 0px;"/>
					</span>
				</div>
				<div class="g-m-t-20 g-flex">
					<span class="g-m-l-10">申请理由：</span>
					<span class="g-m-l-10 g-inline-block" style="width:88%;">{{ service_data.reason }}</span>
				</div>
				<div class="g-m-t-20 g-flex">
					<span style="margin-left: 34px;">凭证：</span>
					<oa-upload
						v-model="service_data.fileImage" 
						disabled
					/>
				</div>
			</div>

			<div class="g-m-t-30 g-pd-t-30 g-m-l-20 _content">
				<div
					v-for="(item,index) in service_data.audit_remark"
					:key="index"
					class="g-m-t-20"
				>
					<div v-if="item.step == 1" class="g-flex">
						<span class="g-inline-block" style="width: 100px;text-align: right;">提交审核：</span>
						<span class="g-m-l-5 g-inline-block" style="width:88%;">{{ item.remark }}</span>
					</div>

					<div v-if="item.step == 2" class="g-flex">
						<span class="g-inline-block" style="width: 100px;text-align: right;">经理审核备注：</span>
						<span class="g-m-l-5 g-inline-block" style="width:88%;">{{ item.remark }}</span>
					</div>

					<div v-if="item.step == 3" class="g-flex">
						<span class="g-inline-block" style="width: 100px;text-align: right;">总监审核备注：</span>
						<span class="g-m-l-5 g-inline-block" style="width:88%;">{{ item.remark }}</span>
					</div>

					<div v-if="item.step == 4" class="g-flex">
						<span class="g-inline-block" style="width: 100px;text-align: right;">绩效组审核备注：</span>
						<span class="g-m-l-5 g-inline-block" style="width:88%;">{{ item.remark }}</span>
					</div>

					<div v-if="item.step == 5" class="g-flex">
						<span class="g-inline-block" style="width: 100px;text-align: right;">财务审核备注：</span>
						<span class="g-m-l-5 g-inline-block" style="width:88%;">{{ item.remark }}</span>
					</div>
				</div>
                

				<div 
					v-if="flag" 
					class="g-pd-b-20 g-pd-r-20" 
					style="background: #F5F5F6;"
				>
					<i-form
						ref="form"
						:model="form"
						:rules="formRule"
						:label-width="100"
						class="g-m-t-20"
					>
						<i-form-item label="审核结果：" prop="status">
							<i-radiogroup v-model="form.status">
								<i-radio label="1">
									<span>审核通过</span>
								</i-radio>
								<i-radio label="2">
									<span>审核驳回</span>
								</i-radio>
							</i-radiogroup>
						</i-form-item>

						<i-form-item label="审核备注：" prop="mark">
							<oa-limit-words
								v-model="form.mark"
								:max="200"
								placeholder="请填写审核意见"
								width="500px" 
							/>
						</i-form-item>
					</i-form>
				</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Progress, Button, Form, FormItem, RadioGroup, Radio } from 'iview';
import { CreatePortal, FilesPicker } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import LimitWords from '@components/_common/limit-words/limit-words';
import AcrossTable from '@components/_common/across-table/across-table';
import Upload from '@components/_common/upload/upload';

export default {
	name: 'hr-service-complaints-appeal',

	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-button': Button,
		'oa-limit-words': LimitWords,
		'i-radiogroup': RadioGroup,
		'i-radio': Radio,
		'oa-across-table': AcrossTable,
		'oa-upload': Upload
	},

	props: {
		flag: Boolean,
		apply_id: Number
	},

	data() {
		return {
			visible: false,
			form: {
				status: "",
				mark: ""
			},
			service_data: {},
			formRule: {
				status: [{ 
					required: true, 
					message: "请选择审核结果", 
					trigger: "change"
				}],
				mark: [{ 
					required: true, 
					message: "请填写审核备注", 
					trigger: "blur"
				}]
			}
		};
	},

	mounted() {
		this.loadData();

		this.visible = true;
	},

	methods: {
		loadData() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SCORE_SERVICE_APPLY_DETAIL_GET,
				type: "GET",
				param: {
					apply_id: this.apply_id
				}
			}).then((res) => {
				this.service_data = res.data;

				this.service_data.audit_schedule.forEach(item => {
					item.status = +item.status;
					item.create_time = item.audit_time;
				});

				let fileImage = [];

				res.data.fileImage && res.data.fileImage.length != 0 && res.data.fileImage.forEach(item => {
					fileImage.push({
						url: item.img_url,
						title: item.img_url.substring(item.img_url.lastIndexOf("/") + 1, item.img_url.length),
						type: "." + item.img_url.substring(item.img_url.lastIndexOf(".") + 1, item.img_url.length),
						uid: item.img_url,
						file_id: item.relation_id
					});
				});

				this.service_data.fileImage = fileImage;
			}).catch((error) => {
			});
		},

		handleOk() {
			if (this.flag) {
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.visible = false;
						this.handleSave();
					} else {
						this.$refs.modal.buttonLoading = false;
					}
				});
			} else {
				this.handleCancel();
			}
		},

		handleSave() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SCORE_SERVICE_AUTO_GET,
				type: "POST",
				param: {
					apply_id: this.apply_id,
					audit_step: this.service_data.audit_step,
					status: this.form.status,
					mark: this.form.mark,
					audit_type: 1
				}
			}).then((res) => {
				this.$emit("sure", true);
			});
		},

		handleCancel() {
			this.$emit('close');
		},

		handleError(err) {
			this.$Message.warning(err.msg);
		}
	}
};

export const ServiceAppealModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.hr-service-complaints-appeal{
    ._content{
        width: 740px;
        border-top: 1px solid #EEEEEE;
    }

	.ivu-modal-body{
		max-height: 388px;
		overflow-y: auto;
		padding-bottom: 50px;
	}
}
</style>