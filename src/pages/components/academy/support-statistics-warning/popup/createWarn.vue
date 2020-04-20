<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="title"
		width="400"
		class-name="v-content-config-statistics-warning"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="120"
		>
			<i-form-item label="规则名称：" prop="rule_name">
				<i-input
					v-model="formData.rule_name"
					:maxlength="20"
					placeholder="请输入规则名称"
					style="width: 220px"/>
			</i-form-item>
			<i-form-item label="检测周期：" prop="detection_cycle">
				<i-input-number
					v-model="formData.detection_cycle"
					:max="999"
					placeholder="请输入周期天数"
					style="width: 220px"/>
			</i-form-item>
			<i-form-item label="总下载量阈值：" prop="total_limit">
				<i-input-number v-model="formData.total_limit" :max="9999" placeholder="请输入阈值" style="width: 220px"/>
			</i-form-item>
			<i-form-item label="工具包阈值：" prop="kit_limit">
				<i-input-number v-model="formData.kit_limit" :max="9999" placeholder="请输入阈值" style="width: 220px"/>
			</i-form-item>

			<i-form-item label="自习室阈值：" prop="library_limit">
				<i-input-number v-model="formData.library_limit" :max="9999" placeholder="请输入阈值" style="width: 220px"/>
			</i-form-item>

			<i-form-item label="通知方式：" prop="notice_method">
				<i-checkbox-group v-model="formData.notice_method">
					<i-checkbox :label="1">短信通知</i-checkbox>
					<template v-if="formData.notice_method.includes(1)">
						<div v-for="(item,index) in shorters" :key="index">
							<i-input v-model="item.phone" :maxlength="11" placeholder="请输入接收短信号码" style="width: 220px"/>
							<i
								v-if="shorters.length !== 1"
								class="icon-remove-circle g-m-b-10 iconfont g-c-red-light"
								style="display: inline-block;vertical-align: middle;"
								@click="(index)=>{shorters.splice(index,1)}"
							/>
							<i
								v-if="shorters.length - 1 === index"
								class="icon-add1 iconfont g-c-blue-mid g-m-b-10"
								style="display: inline-block;vertical-align: middle;"
								@click="()=>{ shorters.length<21&&shorters.push({phone:''})}"
							/>
						</div>
					</template>

					<i-checkbox :label="2">弹窗提示</i-checkbox>
					<i-select
						v-if="formData.notice_method.includes(2)"
						ref="provider"
						v-model="formData.notice_staff_id"
						:remote-method="remote1"
						:loading="loading"
						placeholder="请输入通知人姓名、手机搜索"
						filterable
						clearable
						transfer
						remote
						multiple
						class="g-m-r-5"
						style="width: 220px"
					>
						<i-option
							v-for="(option, index) in staffList"
							:value="option.staff_id"
							:key="index"
						>{{ option.staff_name }}</i-option>
					</i-select>
				</i-checkbox-group>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, Checkbox, RadioGroup, Radio, Button, Poptip, Select, Option, CheckboxGroup, InputNumber } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';

export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup
	},
	props: {
		data: Object, // customer_id
		rule_id: [String, Number],
		title: {
			type: String,
			default: '新建规则'
		}

	},
	data() {
		return {
			visible: false,
			single: false,
			loading: false,
			staffList: [],
			shorters: [
				{ phone: '' }
			],
			formData: {
				"rule_id": '', // 规则id，编辑时有
				"rule_name": "", // 规则名称
				"detection_cycle": null, // 检测周期
				"total_limit": null, // 下载总阈值
				"kit_limit": null, // 销售工具阈值
				"library_limit": null, // 素材库阈值
				"notice_method": [1, 2], // 通知方式：1-短信，2-弹框
				"notice_mobile": [], // 短信通知号码
				"notice_staff_id": [], // 弹框通知员工id
			},
			rules: {
				rule_name: [{ required: true, message: "请填写规则名称", trigger: "blur" }],
				detection_cycle: [{ required: true, type: 'number', message: "请填写检测周期", trigger: "blur" }],
			}
		};
	},
	created() {
	},
	mounted() {
		this.visible = true;
		this.rule_id && this.loadData();
		this.remote1(1);
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		remote1(query) {
			if (query !== '') {
				this.loading = true;
				return this.$request({
					url: "_CONTENT_CONFIG_GET_ALL_STAFF_BY_SEARCH_GET",
					type: 'GET',
					param: {
						search: query == 1 ? '' : query // 为了能搜索到全部的员工数据（手机号码必定有1）
					},
					loading: false
				}).then((res) => {
					this.loading = false;
					this.staffList = res.data;
				});
			}
		},
		loadData() {
			this.$request({
				url: "_CONTENT_MATERIAL_DOWNLOAD_WARNING_RULE_DETAIL_GET",
				type: 'GET',
				param: {
					rule_id: this.rule_id
				},
				loading: false
			}).then((res) => {
				Object.keys(this.formData).forEach(key => {
					this.formData[key] = res.data[key];
				});
				if (res.data.notice_mobile.length) { this.shorters = []; }
				res.data.notice_mobile.map(ele => {
					this.shorters.push({ phone: ele });
					return;
				});
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSave() {
			this.formData.notice_mobile = [];
			this.shorters.map(ele => {
				this.formData.notice_mobile.push(ele.phone);
				return;
			});
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: '_CONTENT_MATERIAL_DOWNLOAD_WARNING_RULE_SAVE_POST',
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
export const createWarn = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-content-config-statistics-warning{
	.ivu-modal-body{
		padding: 16px 0 !important;
	}
	.ivu-input-number-handler-wrap{
		visibility: hidden;
	}
}
</style>