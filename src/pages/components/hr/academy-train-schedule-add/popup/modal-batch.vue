<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="680"
			:loading="true"
			:mask-closable="false"
			class="v-hr-academy-train-schedule-add-model"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				批量审核
			</div>
			<div class="_content">
				<div class="_content-bottom">
					<i-form 
						ref="form" 
						:model="formData" 
						:rules="auditRule" 
						:label-width="100">
						<i-form-item label="审核结果：" prop="service">
							<i-radio-group v-model="formData.service">
								<i-radio label="1">
									<span>审核通过</span>
								</i-radio>
								<i-radio class="g-pd-l-30" label="2">
									<span>审核拒绝</span>
								</i-radio>
							</i-radio-group>
						</i-form-item>
						<i-form-item label="理由：" prop="remarks">
							<oa-limit-words
								v-model="formData.remarks"
								:max="200"
								style="width: 440px"
								placeholder="请输入备注"
							/>
						</i-form-item>
					</i-form>
				</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Row, Col, Radio, RadioGroup, Input, Form, FormItem, Steps, Step, Message, Tooltip } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import AcrossTable from "@components/_common/across-table/across-table";

export default {
	name: 'sc-service-detail-modal',
	components: {
		'i-modal': Modal,
		'i-col': Col,
		'i-row': Row,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'v-imgs-preview': ImgsPreview,
		'i-steps': Steps,
		'i-step': Step,
		'i-tool-tip': Tooltip,
		"oa-across-table": AcrossTable
	},
	props: {
		name: String,
		datas: Array
	},
	data() {
		return {
			visible: false,
			formdata: {},
			dataSource: [],
			formData: {
				service: '',
			    remarks: '',
			},
			auditRule: {
				service: [
					{ required: true, message: '请选择审核结果', trigger: 'change' }
				],
				remarks: [
					{ required: true, message: '备注不能为空', trigger: 'blur' }
				],
			},
			crossData: []
		};
	},
	mounted() {
		// this.datas.checkSteps.map(item => {
		// 	let obj = {};
		// 	obj.status = Number(item.status) + 1;
		// 	obj.staff_name = item.staff_name;
		// 	obj.create_time = item.create_time;
		// 	obj.title = item.role_name;
		// 	obj.check_step = item.check_step;
		// 	obj.content = item.mark;
		// 	this.crossData.push(obj);
		// 	return;
		// });
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleSave() {
			this.$request({
				url: API_ROOT['_SC_SERVICE_PAUSE_AUDIT_POST'], // eslint-disable-line
				type: "POST",
				param: {
					apply_id: this.datas.apply_id,
					check_mark: this.formData.remarks,
					check_staff_id: 1,
					check_result: this.formData.service
				}
			}).then((res) => {
				Message.success('审核成功');
				this.$store.commit('SC_SERVICE_PAUSE_LIST_INIT');
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const BatchModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-academy-train-schedule-add-model {
    ._content {
		position: relative;
        padding: 0 23px 0 50px;
		max-height: 480px;
		overflow-y: auto;
		overflow-x: hidden;
		@media screen and (max-height: 768px) {
			position: relative;
			padding: 0 23px 25px 50px;
			max-height: 350px;
			overflow-y: auto;
			overflow-x: hidden;
		}
		._audit-schedule{
			justify-content: space-around;
			border-bottom: 1px solid #d4d7db;
			padding-bottom: 30px;
		}
        ._content-top {
            padding-bottom: 20px;
            border-bottom: 1px solid #d4d7db;
        }
		._content-title {
			margin: 20px 0 20px 6px;
			font-size: 16px;
			color: #000;
		}
        ._content-text {
			word-wrap: break-word;
        }
        ._content-mid {
            padding-bottom: 20px;
            border-bottom: 1px solid #d4d7db;
		}
		._content-bottom {
			background: #f5f5f6;
			padding-bottom: 20px;
		}
		.__item {
			img {
				border: 1px solid #d4d7db;
			}
		}
    }
}
</style>


