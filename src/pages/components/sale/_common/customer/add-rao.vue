<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="title"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="90"
			class="g-pd-l-20"
			@copy.native="handleCopy"
			
		>
			<i-form-item label="客户角色：" prop="customer_type">
				<i-select 
					v-model="formData.customer_type"
					style="width:220px"
					placeholder="请选择客户角色"
					clearable
					transfer
				>
					<i-option
						v-for="item in roleList"
						:value="item.customer_role_id"
						:key="item.customer_role_id"
					>
						{{ item.customer_role_str }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="客户姓名：" prop="customer_name">
				<i-input v-model="formData.customer_name" :maxlength="10" placeholder="请输入客户姓名" style="width: 220px"/>
			</i-form-item>
			<i-form-item label="手机号：" prop="tel">
				<i-input 
					v-model="formData.tel" 
					:maxlength="14" 
					:disabled="telDisabled" 
					placeholder="请输入手机号"
					style="width: 220px"
				/>
			</i-form-item>
			<i-form-item label="微信号：" prop="wechat">
				<i-input 
					v-model="formData.wechat" 
					:disabled="wechatDisabled" 
					:maxlength="20"
					placeholder="请输入微信号" 
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Table, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import orderModal from '@extends/mixins/orderModal';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import API from '@stores/apis/root';
import { services } from '@stores/services/sale';
import { debounce } from 'lodash';

export default {
	name: "oa-sale-add-conatct",
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
		'i-table': Table,
		'i-select': Select,
		'i-option': Option
	},
	mixins: [orderModal, services.roleList()],
	props: {
		data: Object,
		tels: Array,
		/**
		 *  "link_id": 173,    // 绕前台主键
			"staff_id": 1,    // 员工ID
			"customer_type": 3,    // 客户类型
			"customer_name": "杨逍",    // 客户名
			"original_tel": "0571-23690025",    // 客户电话
			"wechat": "asdfghjk",    // 微信
			"update_time": "2019-11-18",    // 更新时间
			"staff_name": "超管",    // 负责人
			"customer_type_str": "小股东",    // 客户类型字符串
			"is_own": 1    // 是否是自己的
		 */
		action: String, // add | update
		isDeal: Boolean, // 1 已成交 ， 2 未成交
	},
	data() {
		let formData = {
			link_id: '', // 主键
			customer_id: this.data.customer_id, // 客户ID
			customer_type: '', // 客户角色
			customer_name: "", // 客户姓名
			tel: "", // 客户电话
			wechat: "", // 微信号
		};

		if (this.action == 'update') {
			for (let key in formData) {
				formData[key] = this.data[key];
			}
			formData.tel = this.data.original_tel;
		}
		// "tel_type": 2,    // 1是添加时生成的，2是后来添加的
		const telType = this.action == 'update' ? this.data.tel_type : 1;
		const telDisabled = !(this.$global.staff.is_charge || !this.data.original_tel || this.data.original_tel === '99999999999');
		let ruleTelType = 'validTel';
		if (telType == 2 && !telDisabled && this.isDeal) {
			ruleTelType = 'validMobile';
		}
		return {
			visible: false,
			loading: false,
			formData,
			telType,
			rules: {
				tel: [
					{ required: true, message: "请输入客户手机号", trigger: "blur" },
					{ type: ruleTelType, validator: dataValidity, trigger: "blur" },
					{ validator: this.telValidator, trigger: "blur" }
				],
				customer_type: [{ required: true, type: 'number', trigger: 'change', message: '请选择客户角色' }], // 客户角色
				customer_name: [
					{ required: true, message: '请输入客户姓名' },
					{ type: 'validName', validator: dataValidity, trigger: 'blur' }
				],
				wechat: [
					// { required: true, trigger: 'change', message: '请输入微信号' },
					{ type: 'validWeChat', validator: dataValidity, trigger: "blur" }
				]
			},
			telDisabled,
			wechatDisabled: !(this.$global.staff.is_charge || !this.data.wechat)
		};
	},
	computed: {
		title() {
			return (this.action == 'update' ? '编辑' : '添加') + '联系人';
		}

	},
	mounted() {
		this.visible = true;
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
		handleSave: debounce(function () {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.$request({
						url: "_SALE_CUSTOMER_SAVE_CUSTOMET_LINK_POST",
						type: "POST",
						param: {
							...this.formData
						},
						loading: false,
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.$Message.success(res.msg);
						this.handleOk();
					}).catch((res) => {
						this.$refs.modal.buttonLoading = false;
						this.$Message.error(res.msg);
				
					});
				} else {
					this.$refs.modal.buttonLoading = false;

				}
			});
		}, 200),
		telValidator(rule, value, callback) {
			if (this.tels.includes(value.trim())) {
				callback('该手机号已添加');
			} else {
				callback();
			}
		},
		handleCopy() {
			window.event.stopPropagation();
		}
		
	}
};
export const AddRao = CreatePortal({}, module.exports.default);
</script>
<style lang="scss" scoped>
</style>

