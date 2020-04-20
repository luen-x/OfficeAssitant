<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:mask-closable="false"
		:loading="true"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			修改评定结果
		</div>
		<div style="color: #e74854">
			<span v-if="newData.length > 1">移出服务将把对应服务变回“未评状态”，</span>不选择修改结果直接确定将把所有的服务变回“未评状态”。
		</div>
		<i-form
			ref="form"
			:model="formdata"
			:label-width="100"
			:rules="validator"
			class="g-m-t-20"
		>
			<i-formitem v-if="data.status == 2" label="驳回理由:">
				<div style="width: 220px;wordBreak: break-all; padding: 10px 0; lineHeight: 1">{{ audit_remarks }}</div>
			</i-formitem>
			<i-formitem label="评价服务:">
				<div class="hr_inte_edit">
					<div
						v-for="(info, index) of newData"
						:key="info.apply_id"
						:style="{paddingBottom: (index === newData.length - 1) ? '0px' : '20px'}"
						style="padding-top: 10px; lineHeight: 1;"
					>
						<span>{{ info.create_time }}</span>
						<template v-if="label < 16">
							<i-formitem>
								<i-input-number 
									v-model="info.service_times"
									:max="100"
									:min="1"
									placeholder="请输入服务次数"
									style="width: 60px"
								/>
							</i-formitem>
							次
						</template>
						<span 
							v-if="index > 0" 
							class="g-operation g-m-l-10" 
							@click="() => handleDel(index)">移出</span>
					</div>
				</div>
			</i-formitem>
			<i-formitem label="修改结果:" prop="status">
				<i-select
					v-model="formdata.status"
					placeholder="请选择修改结果"
					style="width: 220px"
				>
					<i-option value="1">通过</i-option>
					<i-option value="2">驳回</i-option>
				</i-select>
			</i-formitem>
			<!-- <i-formitem v-if="label !== '16'" label="服务次数:" prop="service_time">
				<i-input-number 
					v-model="formdata.service_time"
					:max="99"
					:min="0"
					placeholder="请输入服务次数"
					style="width: 220px"
				/>
			</i-formitem> -->
			<i-formitem v-if="formdata.status === '1'" label="评定积分:" prop="point">
				<i-input-number 
					v-model="formdata.point"
					:max="99"
					:min="-99"
					placeholder="请输入评定积分（可输入负数扣分）"
					style="width: 220px"
				/>
			</i-formitem>
			<i-formitem v-if="formdata.status === '2'" label="驳回原因:" prop="audit_remarks">
				<oa-textarea 
					v-model="formdata.audit_remarks"
					placeholder="请填写驳回原因"
					clearable
					style="width: 220px"
				/>
			</i-formitem>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import TextArea from '@components/_common/limit-words/limit-words';

export default {
	name: 'hr-edit',
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'oa-textarea': TextArea,
		'i-input-number': InputNumber
	},
	props: {
		item: Object,
		label: String
	},
	data() {
		return {
			visible: false,
			formdata: {
				point: null,
				service_time: null
			},
			data: { ...this.item },
			audit_remarks: '',
			oldData: [],
			newData: [],
			validator: {
				point: [
					{ required: true, type: 'number', message: '请输入评定积分', trigger: 'blur' }
				],
				audit_remarks: [
					{ required: true, message: '请输入驳回原因', trigger: 'blur' }
				],
				// service_time: [
				// 	{ required: true, type: 'number', message: '请输入服务次数', trigger: 'blur' }
				// ]
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadInfo();
	},
	methods: {
		handleOk() {
			this.$refs.form.validate(item => {
				this.$refs.modal.buttonLoading = false;
				if (item) {
					const new_apply_id = this.newData.map(info => info.apply_id);
					const old_apply_id = this.oldData.map(info => info.apply_id);
					const service_times = this.newData.map(info => info.service_times);
					this.$request({
						url: '_HR_EMPLOYEE_SCORE_INTEGRATION_EDIT_POST',
						type: 'POST',
						loading: false,
						param: {
							...this.formdata,
							new_apply_id,
							old_apply_id,
							service_times,
							rule_type: this.label
						}
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit('sure');
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		},
		handleDel(index) {
			this.newData.splice(index, 1);
		},
		loadInfo() {
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_INTEGRATION_APPLY_INFO_POST',
				type: 'POST',
				loading: false,
				param: {
					group_apply: this.item.type === 0 ? [this.item.apply_id] : this.item.group_apply
				}
			}).then(res => {
				this.oldData = [...res.data];
				this.newData = [...res.data];
				this.audit_remarks = res.audit_remarks;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const EditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.hr_inte_edit {
	.ivu-form-item {
		display: inline-block;
		vertical-align: baseline;
		margin-bottom: 0px !important;
	}
}
</style>