<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:mask-closable="false"
			:loading="true"
			:width="400"
			class="hr-points-detail-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				服务积分确认
			</div>
			<div class="_content">
				<p class="__title">项目跟进</p>
				<i-row v-if="Number(datas.return_amount) > 0" class="g-m-b-20">
					<i-col span="5" class="g-tr">回款金额：</i-col>
					<i-col span="19">{{ datas.return_amount }}万元</i-col>
				</i-row>
				<i-row v-if="Number(datas.agent_num) > 0" class="g-m-b-20">
					<i-col span="5" class="g-tr">代理人数：</i-col>
					<i-col span="19">{{ datas.agent_num }}人</i-col>
				</i-row>
				<i-row class="g-m-b-20">
					<i-col span="5" class="g-tr">备注：</i-col>
					<i-col span="19" style="word-break:break-all">{{ datas.remarks }}</i-col>
				</i-row>
				<i-row v-if="datas.fileImage.length" class="g-m-b-20">
					<i-col span="5" class="g-tr">凭证：</i-col>
					<i-col span="19">
						<v-imgs-preview :data-source="datas.fileImage"/>
					</i-col>
				</i-row>
				<div class="__bottom">
					<i-form ref="formdata" :model="formdata" :rules="formdataRule" :label-width="75">
						<!-- <i-form-item label="评分：" prop="points">
							<i-input-number placeholder="请输入积分" v-model="formdata.points" style="width: 220px"/>
						</i-form-item> -->
						<i-form-item label="确认备注：" prop="remarks">
							<oa-limit-words
								v-model="formdata.remarks"
								:max="200"
								style="width: 220px"
								placeholder="请输入积分备注"
							/>
						</i-form-item>
					</i-form>
				</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Row, Col, Input, InputNumber, Form, FormItem, Message } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'hr-points-detail-modal',
	components: {
		'i-modal': Modal,
		'i-row': Row,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-col': Col,
		'v-imgs-preview': ImgsPreview
	},
	props: {
		name: String,
		contract_company_id: String,
		datas: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			visible: false,
			dataSource: [],
			formdata: {
				remarks: '',
			},
			formdataRule: {
				// points: [{ type: 'number', required: true, message: '请输入起止日期', trigger: 'blur' }],
				// remarks: [{ required: true, message: '请输入备注信息', trigger: 'blur' }]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.formdata.validate((valid) => {
				if (valid) {
					this.visible = false;
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleSave() {
			this.$request({
				url: API_ROOT['_HR_POINT_SERVICE_AUDIT_POST'], // eslint-disable-line
				type: "POST",
				param: {
					remark: this.formdata.remarks,
					contract_company_id: Number(this.contract_company_id),
					set_id: Number(this.datas.set_id),
					record_id: Number(this.datas.record_id),
					login_id: 1,
					service_staff_id: 1
				}
			}).then((res) => {
				Message.success('确认成功');
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
export const ConfirmModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.hr-points-detail-modal {
    ._content {
		position: relative;
        padding: 5px 0 5px 0;
		max-height: 520px;
		overflow-y: auto;
		@media screen and (max-height: 768px) {
			position: relative;
			padding: 5px 0 5px 0;
			max-height: 350px;
			overflow-y: auto;
		}
		.__text {
			word-wrap: break-word;
		}
		.__grey {
			color: #818794;
			border-bottom: 1px solid #d4d9da;
		}
		.__title {
			margin: 0 0 20px 15px;
			font-weight: bold;
			color: #333;
		}
        .__bottom {
            background-color: #f5f5f6;
            border-radius: 3px;
            padding: 20px 40px 20px 10px;
        }
        .__num-tip {
            position: absolute;
            bottom: -8px;
            right: 27px;;
        }
    }
}
</style>


