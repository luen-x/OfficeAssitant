<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			评分
		</div>
		<i-form
			ref="form"
			:model="formdata"
			:label-width="100"
			:rules="validator"
		>
			<i-formitem label="评价服务:">
				<div class="hr_inte_grade">
					<div
						v-for="(info, index) of data"
						:key="info.apply_id"
						:style="{paddingBottom: (index === data.length - 1) ? '0px' : '20px'}"
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
			<i-formitem label="评定积分:" prop="point">
				<i-input-number 
					v-model="formdata.point"
					:max="99"
					:min="-99"
					placeholder="请输入评定积分（可输入负数扣分）"
					style="width: 220px"
				/>
			</i-formitem>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: 'hr-grade',
	components: {
		'i-modal': Modal,
		'i-input-number': InputNumber,
		'i-form': Form,
		'i-formitem': FormItem,
	},
	props: {
		item: Array | Object,
		label: String
	},
	data() {
		return {
			visible: false,
			formdata: {
				point: null
			},
			data: [...this.item],
			validator: {
				point: [
					{ required: true, type: 'number', message: '请输入评定积分', trigger: 'blur' }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.form.validate(item => {
				this.$refs.modal.buttonLoading = false;
				if (item) {
					const apply_id = this.data.map(info => info.apply_id);
					const service_times = this.data.map(info => info.service_times);
					this.$request({
						url: '_HR_EMPLOYEE_SCORE_INTEGRATION_GRADE_POST',
						type: 'POST',
						loading: false,
						param: {
							...this.formdata,
							apply_id,
							rule_type: this.label,
							service_times
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
			this.data.splice(index, 1);
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const GradeModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.hr_inte_grade {
	.ivu-form-item {
		display: inline-block;
		vertical-align: baseline;
		margin-bottom: 0px !important;
	}
}
</style>