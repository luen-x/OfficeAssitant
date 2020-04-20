<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		width="680px"
		title="新增通知"
		ok-text="开启"
		@on-ok="handleOk"
		@on-cancel="handleCancel">
		<div style="max-height: 295px" class="g-m-tb-30 g-fs-14 v-content-notice-inform-add">
			<i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
				<i-form-item label="通知类型：" prop="notice_type" style="height: 20px">
					<i-radio-group v-model="formValidate.notice_type" class="g-fl" style="width: 220px">
						<i-radio :label="1" style="width: 80px">可立即关闭</i-radio>
						<i-radio :label="2" style="width: 80px">等待再关闭</i-radio>
					</i-radio-group>
					<div v-if="formValidate.notice_type == 2" class=" g-fl" style="width: 220px">
						等待时间：
						<i-input-number
							:min="1"
							:max="60"
							v-model="formValidate.wait_time"/> 秒
					</div>
				</i-form-item>
				<i-form-item label="标题：" prop="title">
					<i-input
						v-model="formValidate.title"
						:maxlength="30"
						class="_long"
						placeholder="请输入标题文字"/>
					<span class="g-c-black5">（30字以内）</span>
				</i-form-item>
				<i-form-item label="通知内容：" prop="content" style="position: relative">
					<oa-limit-words
						v-model="formValidate.content"
						:rows="4"
						:max="200"
						width="300px"
						placeholder="请输入通知内容"
					/>
				</i-form-item>
				<i-form-item label="发送类型：" prop="send_type">
					<i-select v-model="formValidate.send_type" label="请选择发送类型" transfer class="_long g-m-r-15">
						<i-option :value="1"> 下次登录 </i-option>
						<i-option :value="2"> 每次登录 </i-option>
					</i-select>
				</i-form-item>
				<div v-if="formValidate.send_type == 1">
					<i-form-item label="开始时间：" prop="start_time">
						<i-data-picker
							v-model="formValidate.start_time"
							type="datetime"
							class="_long"
							transfer
							format="yyyy-MM-dd HH:mm"
							placeholder="请选择开始时间"/>
					</i-form-item>
					<i-form-item label="结束时间：" prop="end_time">
						<i-data-picker
							v-model="formValidate.end_time"
							type="datetime"
							class="_long"
							transfer
							format="yyyy-MM-dd HH:mm"
							placeholder="请选择结束时间"/>
					</i-form-item>
				</div>
				<div class="g-fs-16 g-c-black1 g-m-l-15 g-m-b-15">接收权限</div>
				<i-form-item label="角色：" prop="notice_role">
					<i-select
						v-model="formValidate.notice_role"
						:remote-method="handleSelectRole"
						:loading="isLoading"
						multiple
						transfer
						filterable
						remote
						style="width: 300px"
						class="_role-name">
						<i-option v-for="(role, index) in allRoles" :value="role.role_id" :key="index">{{ role.role_name }}</i-option>
					</i-select>
				</i-form-item>
				<div style="margin-left: 40px"/>
			</i-form>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select,
	DatePicker, Col, Row, Option, RadioGroup,
	Radio, CheckboxGroup, Checkbox, Button, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import { formatDate } from '@utils/utils';
import item from './add-new-item';

export default {
	name: "vc-notice-inform-add",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-data-picker': DatePicker,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox,
		'i-button': Button,
		'i-col': Col,
		'i-row': Row,
		'i-input-number': InputNumber
	},
	mixins: [item],
	props: {
		data: Object
	},
	data() {
		const { query } = app.$route;
		return {
			visible: false,
			type: String(query.type || "0"),
			isLoading: false,
			allRoles: [],
		};
	},
	computed: {
		
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			this.$refs.modal.buttonLoading = false;
			this.visible = true;
			this.$refs.formValidate.validateAndScroll((valid) => {
				if (valid) {
					let param = {
						notice_type: this.formValidate.notice_type,
						title: this.formValidate.title,
						content: this.formValidate.content,
						send_type: this.formValidate.send_type,
						start_time: this.formValidate.start_time && formatDate(this.formValidate.start_time, 'minute'),
						end_time: this.formValidate.end_time && formatDate(this.formValidate.end_time, 'minute'),
						notice_role: this.formValidate.notice_role,
						wait_time: this.formValidate.notice_type == 1 ? 0 : this.formValidate.wait_time
					};
					if (this.formValidate.send_type == 2) {
						delete param.start_time;
						delete param.end_time;
					}
					this.$request({
						url: API_ROOT._CONTENT_NOTICE_ADD_NOTICE_INFORM_POST,
						type: "POST",
						param,
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						app.$store.commit('CONTENT_NOTICE_INFORM_LIST_RESET', { type: '1' });
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				} else {
					this.$Message.error('请填写正确信息!');
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSelectRole(query) {
			this.isLoading = true;
			this.$request({
				url: API_ROOT._AUTH_ROLE_LIST_GET,
				type: 'GET',
				param: {
					role_name: query
				}
			}).then(res => {
				this.isLoading = false;
				this.allRoles = res.data.list;
			});
		}
	}
};
export const PModalAddNew = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-content-notice-inform-add {
	overflow-y: auto;
	margin-left: 90px;
	._short {
    width: 300px;
  }
  ._long {
    width: 300px;
  }
  ._num-tip {
    position: absolute;
    bottom: -4px;
    right: 164px;
  }
	textarea {
		font-size: 12px!important;
	}
	._role-name {
		display: inline-block;
		width: 300px;
	}
	.ivu-select-multiple .ivu-select-selection {
		max-height: 100px;
		overflow-y: scroll;
	}
}
</style>