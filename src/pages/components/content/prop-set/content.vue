<template>
	<div class="v-content-prop-set">
		<div class="_wrapper g-pd-l-30">
			<div
				class="g-fs-16 g-lh-16 g-pd-l-10 g-m-t-30 g-m-b-30"
				style="border-left: 2px solid #e84854;height: 16px;color:#e84854;"
			>
				道具设置
			</div>
			<i-form ref="form" :label-width="140">
				<i-form-item
					v-for="(item, index) in formData"
					:key="index"
					:label="item.type_name"
					class="_wrapper-form"
				>
					<span class="g-m-r-5">{{ item.text1 }}</span>
					<i-input-number 
						v-if="item.type_id !== 6"
						v-model="item.quota_num"
						:min="1"
						:max="100"
						:precision="0"
						:active-change="false"
						disabled
						placeholder="输入数量"
						style="width: 100px"
					/>
					<i-input-number 
						v-else
						v-model="item.extended_days"
						:min="1"
						:max="100"
						:precision="0"
						:active-change="false"
						placeholder="输入天数"
						style="width: 100px"
					/>
					<span class="g-m-l-5">{{ item.text2 }}</span>
					<i-divider type="vertical"/>
					<i-checkbox v-model="item.is_limit" :true-value="1" :false-value="0"/>
					<span class="g-m-r-5">使用上限</span>
					<div v-if="item.is_limit" class="g-inline-block">
						<i-select 
							v-model="item.cycle"
							transfer
							filterable
							placeholder="请选择使用上限"
							style="width: 220px;"
							class="g-m-r-5"
						>
							<i-option :value="1">每日</i-option>
							<i-option :value="2">每周</i-option>
							<i-option :value="3">每月</i-option>
						</i-select>
						<i-input-number 
							v-model="item.use_num"
							:min="1"
							:max="100"
							:precision="0"
							:active-change="false"
							placeholder="输入数量"
							style="width: 100px"
						/>
						<span class="g-m-l-5">张券可用。</span>
					</div>
				</i-form-item>
			</i-form>
		</div>
		<div class="_footer g-flex-cc">
			<span class="g-m-r-20">生效时间：{{ effect_time }}</span>
			<span
				class="g-gray-btn-small g-m-r-10"
				style="font-size: 12px;"
				@click="handleCancel"
			>
				取消
			</span>
			<i-button
				type="primary"
				@click="handlePublish"
			>
				保存
			</i-button>
		</div>
	</div>
</template>

<script>
import { Input, Button, Form, FormItem, Select,
	Option, DatePicker, InputNumber, Divider, Checkbox } from 'iview';
import moment from 'moment';
import { TimeModal } from './popup/time-modal';

export default {
	name: 'v-content-prop-set',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-input-number': InputNumber,
		'i-divider': Divider,
		'i-checkbox': Checkbox
	},
	data() {
		return {
			formData: {},
			effect_time: ''
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: "_SALE_PROPERTY_PROP_SET_DETAIL_GET",
				type: 'POST',
				param: {},
				loading: false
			}).then((res) => {
				let text1 = ['每张券当天扩充', '每张券一次性保护', '每张券一次性保护', 
					'每张券120天内扩充', '每张券120天内扩充', '每张券延长', '每张券可抢']; 
				let text2 = ['个名额。', '个资料。', '个资料。', 
					'个名额。', '个名额。', '天。', '个资料。']; 
				this.effect_time = res.data.effect_time;
				res.data.settings.forEach(v => {
					v.quota_num = +v.rules.quota_num;
					v.is_limit = +v.rules.is_limit;
					v.cycle = +v.rules.cycle;
					v.use_num = +v.rules.use_num;
					v.extended_days = +v.rules.extended_days;
					v.text1 = text1[v.type_id - 1];
					v.text2 = text2[v.type_id - 1];
				});
				this.formData = res.data.settings;
			});
		},
		handlePublish() {
			let flag = 1;
			this.formData.forEach(v => {
				if ((v.is_limit && !v.use_num) || (v.type_id !== 6 && !v.quota_num)) {
					flag = 0;
				}
				if (v.type_id == 6 && !v.extended_days) {
					flag = 0;
				}
			});
			if (flag) {
				this.formData.forEach(v => {
					v.rules.quota_num = +v.quota_num;
					v.rules.is_limit = +v.is_limit;
					v.rules.cycle = +v.cycle;
					v.rules.use_num = +v.use_num;
					v.rules.extended_days = +v.extended_days;
				});
				let arr = this.formData.map(v => ({
					rules: v.rules,
					type_id: v.type_id
				}));
				TimeModal.popup({ time: this.effect_time }).then(re => {
					this.effect_time = moment(re).format('YYYY-MM-DD HH:mm');				
					this.$request({
					url: '_SALE_PROPERTY_CONTROL_PROPERTY_SET_SAVE_POST', // eslint-disable-line
						type: "POST",
						param: {
							settings: arr,
							effect_time: this.effect_time
						}
					}).then((res) => {
						this.$Message.success('保存成功');
						this.loadData();
					}).catch((error) => {
						this.$Message.error(error.msg);
					});
				});
			} else {
				this.$Message.warning(`规则条件输入框不能为空`);
			}
		},
		handleCancel() {
			this.loadData();
		}
	},
};
</script>

<style lang="scss">
.v-content-prop-set {
	.ivu-divider-vertical {
		background-color: #EBEEF1 !important;
		height: 14px !important;
		margin-right: 15px;
	}
	.ivu-form-item-label {
		color: #818794;
		padding: 9px 12px 10px 0;
		margin-right: 40px;
	}
	._footer {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 60px;
		background-color: #fff;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	._wrapper {
		._wrapper-form {
			border-bottom: 1px solid #EBEEF1;
			padding: 10px 0 20px 0;
		}
	}
}
</style>
