<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:mask-closable="false"
		:loading="true"
		class="hr-integration-look"
	>
		<div slot="header" class="g-tc">
			{{ name }}({{ index + 1 }}/{{ data.length }})
		</div>
		<i v-if="index !== 0" class="icon iconfont icon-prev _left" @click="handlePrev"/>
		<i-form
			ref="form"
			:model="formdata"
			:label-width="100"
			:rules="validator"
			style="marginTop: 14px;"
		>
			<i-formitem v-if="info.return_amount" label="回款金额:">
				<div style="padding: 10px 0; lineHeight: 1">
					{{ info.return_amount }}万元
				</div>
			</i-formitem>
			<i-formitem v-if="info.agent_num" label="代理人数:">
				<div style="padding: 10px 0; lineHeight: 1">
					{{ info.agent_num }}个
				</div>
			</i-formitem>
			<i-formitem label="服务凭证:">
				<vc-imgs-preview :data-source="(info.fileImage || []).map(item => ({url: item.img_url}))" />
			</i-formitem>
			<i-formitem label="服务备注:">
				<div style="width: 220px;wordBreak: break-all; padding: 10px 0; lineHeight: 1">{{ info.remarks }}</div>
			</i-formitem>
			<i-formitem v-if="data[index].status === 2" label="驳回理由:">
				<div style="width: 220px;wordBreak: break-all; padding: 10px 0; lineHeight: 1">{{ data[index].audit_remarks }}</div>
			</i-formitem>
			<template v-if="data[index].status === 0">
				<i-formitem label="评定结果:" prop="status">
					<i-radio-group
						v-model="formdata.status"
						style="width: 220px"
						transfer
					>
						<i-radio label="1">通过</i-radio>
						<i-radio label="2">驳回</i-radio>
					</i-radio-group>
				</i-formitem>
				<i-formitem v-if="label === '15' || label === '14'" label="服务次数:" prop="service_times">
					<i-input-number 
						v-model="formdata.service_times"
						:max="100"
						:min="1"
						placeholder="请输入服务次数"
						style="width: 220px"
					/>
				</i-formitem>
				<div v-if="formdata.status === '1'">
					<i-formitem label="评定积分:" prop="point">
						<i-input-number 
							v-model="formdata.point"
							:max="99"
							:min="-99"
							placeholder="请输入评定积分（可输入负数扣分）"
							style="width: 220px"
						/>
					</i-formitem>
				</div>
				<i-formitem v-if="formdata.status === '2'" label="评定反馈:">
					<oa-textarea 
						v-model="formdata.audit_remarks"
						:max="500"
						placeholder="请填写评定反馈"
						clearable
						style="width: 220px"
					/>
				</i-formitem>	
			</template>
		</i-form>
		<i v-if="index !== data.length - 1" class="icon iconfont icon-next _right" @click="handleNext"/>
		<div slot="footer">
			<i-button 
				type="text" 
				@click="handleCancel"
			>
				取消
			</i-button>
			<i-button 
				type="primary" 
				@click="handleOk"
			>
				{{ okText }}
			</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, InputNumber, 
	Carousel, CarouselItem, Select, Option, Button,
	Radio, RadioGroup } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import OaUpload from '@components/_common/upload/upload';
import TextArea from '@components/_common/limit-words/limit-words';
import ImagePreview from '@components/hr/_common/image-preview';

const initForm = {
	point: null,
	service_times: null
};
export default {
	name: 'hr-look',
	components: {
		'i-modal': Modal,
		'i-input-number': InputNumber,
		'i-form': Form,
		'i-formitem': FormItem,
		'vc-imgs-preview': ImagePreview,
		'i-carousel': Carousel,
		'i-carousel-item': CarouselItem,
		'i-select': Select,
		'i-option': Option,
		'oa-upload': OaUpload,
		'oa-textarea': TextArea,
		'i-button': Button,
		'i-radio': Radio,
		'i-radio-group': RadioGroup
	},
	props: {
		label: String,
		item: Array,
		idx: Number
	},
	data() {
		return {
			data: this.item,
			visible: false,
			index: this.idx,
			info: {},
			formdata: {
				...initForm
			},
			validator: {
				point: [
					{ required: true, type: 'number', message: '请输入评定积分', trigger: 'blur' }
				],
				service_times: [
					{ required: true, type: 'number', message: '请输入服务次数', trigger: 'blur' }
				],
				status: [
					{ required: true, message: '请选择评定结果' }
				]
			}
		};
	},
	computed: {
		type() {
			let obj = {
				"14": 1,
				"15": 2,
				"16": 3,
				"17": 4,
			};
			return obj[this.label];
		},
		name() {
			let obj = {
				"1": '查看凭证&备注',
				"16": '查看回款&凭证',
			};
			return obj[this.label] || obj['1'];
		},
		okText() {
			return (this.index < this.data.length - 1 && this.data[this.index].status === 0) ? '确定并继续评分' : '确定';
		}
	},
	mounted() {
		this.visible = true;
		this.loadInfo();
	},
	methods: {
		handleOk() {
			this.data[this.index].status === 0 ? this.$refs.form.validate(item => {
				if (item) {
					this.$request({
						url: '_HR_EMPLOYEE_SCORE_INTEGRATION_LOOK_EDIT_POST',
						type: 'POST',
						loading: false,
						param: {
							...this.formdata,
							rule_type: this.label,
							apply_id: this.item[this.index].apply_id
						}
					}).then(res => {
						this.$Message.success(res.msg);
						this.index < this.data.length - 1 ? this.handleNext() : this.$emit('sure');
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			}) : this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handlePrev() {
			this.index -= 1;
			this.loadInfo();
		},
		handleNext() {
			this.index += 1;
			this.loadInfo();
		},
		loadInfo() {
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_INTEGRATION_RECORD_GET',
				type: 'POST',
				loading: false,
				param: {
					type: this.type,
					service_record_id: this.item[this.index].service_record_id
				}
			}).then(res => {
				this.info = res.data;
				this.formdata = {
					...initForm,
					service_times: res.data.service_times
				};
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
export const LookModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.hr-integration-look {
	._left {
		position: absolute;
		left: 16px;
		top: 40%;
		font-size: 20px;
		cursor: pointer;
		color: #818794;
	}
	._right {
		position: absolute;
		right: 16px;
		top: 40%;
		font-size: 20px;
		cursor: pointer;
		color: #818794;
	}
	.ivu-form-item-label {
		color: #818794 !important;
	}
	.ivu-form-item-content {
		color: #4b4f57;
	}
	.ivu-form-item {
		margin-bottom: 10px !important;
	}
}
</style>