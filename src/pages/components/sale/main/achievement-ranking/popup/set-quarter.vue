<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class-name="v-sale-main-achievement-ranking-set-quarter"
		title="设置季度"
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
		>
			<i-form-item label="已有季度:" prop="prop">
				<div v-for="item in cofigList" :key="item.config_id" class="_item">
					{{ item.start_time+'~'+item.end_time }}
					<i class="iconfont icon-close" @click="handleDelete(item.config_id)"/>
				</div>
			</i-form-item>
			<i-form-item label="开始月份:" prop="start_month">
				<i-date-picker
					v-model="formData.start_time"
					type="month"
					format="yyyy-MM"
					transfer
					placeholder="请选择开始月份"
					style="width: 220px"
					@on-change="(v) =>{formData.start_time=v}" />
			</i-form-item>
			<i-form-item label="结束月份:" prop="month">
				<i-date-picker
					v-model="formData.end_time"
					format="yyyy-MM"
					type="month"
					transfer
					placeholder="请选择结束月份"
					style="width: 220px"
					@on-change="(v) =>{formData.end_time=v}"/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option, DatePicker } from 'iview';
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
		'i-option': Option,
		'i-date-picker': DatePicker
	},
	props: {
		data: Object // customer_id
	},
	data() {
		return {
			visible: false,
			formData: {
				start_time: '',
				end_time: ''
			},
			cofigList: [],
			rules: {
				start_time: [
					{ required: true, message: "请选择月份", trigger: "change" }
				],
				end_time: [
					{ required: true, message: "请选择月份", trigger: "change" }
				]
			}
		};
	},
	created() {
	},
	mounted() {
		this.loadTargetConfig();
		this.visible = true;
	},
	methods: {
		loadTargetConfig() {
			this.$request({
				url: '_SALE_MAIN_TARGET_CONFIG_GET',
				type: "GET",
				loading: false,
			}).then((res) => {
				this.cofigList = res.data;
			}).catch((err) => {
				console.error(err);
			});
		},
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleDelete(i) {
			this.$request({
				url: '_SALE_MAIN_TARGET_DEL_CONFIG_GET',
				type: "GET",
				loading: false,
				param: {
					config_id: i
				}
			}).then((res) => {
				this.$Message.success(res.msg);
				this.loadTargetConfig();
			}).catch((err) => {
				console.error(err);
				this.$Message.error(res.msg);
			});
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: '_SALE_MAIN_TARGET_SAVE_CONFIG_GET',
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
export const setQuarter = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-main-achievement-ranking-set-quarter{
	._item{
		background: #E74854;
		border-radius: 4px;
		display: inline-block;
		padding: 10px;
		height: 22px;
		line-height: 2px;
		color: #fff;
	}
}
</style>
