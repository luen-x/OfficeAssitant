<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="提醒设置"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="80"
			class="g-pd-l-20"
			@submit.native.prevent
		>
			<i-form-item label="提醒范围:" prop="remind_range">
				<i-select
					v-model="formData.remind_range"
					placeholder="请选择提醒范围"
					clearable
					transfer
					style="width:200px"
				>
					<i-option v-for="item in dateList" :value="item.value" :key="item.value">
						{{ item.label }}
					</i-option>
				</i-select>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';

export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		data: Object // customer_id
	},
	data() {
		return {
			visible: false,
			dateList: [
				{ label: '未来7天', value: 1 },
				{ label: '未来15天', value: 2 },
				{ label: '未来30天', value: 3 },
				{ label: '未来60天', value: 4 }
			],
			formData: {
				remind_range: 15
			},
			rules: {
				remind_range: [{ required: true, type: 'number', message: '请选择提醒范围', trigger: 'change' }]
			}
		};
	},
	created() {
	},
	mounted() {
		this.visible = true;
		this.loadData();
		this.loadRemind();
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		loadData() {
			this.$request({
				url: '_SALE_MAIN_MATTER_REMIND_RANGE_GET',
				type: "POST",
				loading: false
			}).then(res => {
				this.dateList = res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		loadRemind() {
			this.$request({
				url: '_SALE_MAIN_MATTER_REMIND_GET',
				type: "POST",
				loading: false
			}).then(res => {
				this.formData.remind_range = res.data.remind_range;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: '_SALE_MAIN_MATTER_SET_REMIND_POST',
						type: "POST",
						param: {
							...this.formData
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure');
					}).catch((res) => {
						this.$Message.error(res.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};
export const remindSet = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>