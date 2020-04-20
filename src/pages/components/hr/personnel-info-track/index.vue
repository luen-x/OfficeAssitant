<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		class="v-personnel-info-track" 
		width="400"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>心态跟踪</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<div style="height:15px;"/>
			<i-form-item label="被汇报人：">
				<i-select
					v-model="formData.applicant_id"
					:remote-method="(search)=>loadStaffList(search)"
					:loading="staff_list_loading"
					filterable
					remote
					transfer
					placeholder="请输入名称搜索"
					@on-change="handleChange"
				>
					<i-option
						v-for="(item,index) in staff_list"
						:key="index"
						:value="item.applicant_id"
					>{{ item.staff_name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="被汇报人部门：">
				<i-input 
					v-model="depart_name"
					type="text" 
					disabled
					placeholder="请输入被汇报人部门"
					style="width: 220px"
				/>
			</i-form-item>
			<i-form-item label="问题描述：" prop="remarks">
				<oa-limit-words 
					v-model="formData.remarks"
					:max="500"
					placeholder="请输入问题描述"
					clearable
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Select, Option, Input } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: "oa-personnel-info-track",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input': Input,
		'oa-limit-words': LimitWords,
	},
	mixins: [orderModal],
	props: {
		applicantId: [String, Number],
		departName: String
	},
	data() {
		return {
			visible: false,
			staff_list_loading: false,
			depart_name: '',
			staff_list: [], // 搜索出来的员工列表
			formData: {
				applicant_id: '',
				remarks: ''
			},
			rules: {
				applicant_id: [
					{ required: true, type: "number", message: "请选择汇报人", trigger: "change" }
				],
				remarks: [
					{ required: true, message: "请输入问题描述", trigger: "blur" }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadStaffList('', true);
	},
	methods: {
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.$request({
						url: '_HR_PERSONNEL_INFO_TRACK_POST',
						type: "POST",
						loading: false,
						param: { 
							...this.formData,
							type: 4
						},
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure');
					}).catch(error => {
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		/**
		 * 根据被评人姓名搜索
		 */
		loadStaffList(search, is_init) {
			this.staff_list_loading = true;

			this.$request({
				url: '_HR_MUTI_TERM_STAFF_GET',
				type: 'GET',
				loading: false,
				param: {
					search: search ? search.split('-')[0] : ''
				},
				autoTip: false
			}).then(res => {
				this.staff_list_loading = false;
				if (Array.isArray(res.data)) {
					res.data.forEach(item => {
						item.staff_name = item.staff_name.split('/')[0] + '-' + item.mobile;
					});
					this.staff_list = res.data;
				}
			}).catch(error => {
				this.staff_list_loading = false;
				this.$Message.error(error.msg); 
			});
		},
		handleChange(applicant_id) {
			this.depart_name = this.staff_list.filter(it => it.applicant_id === applicant_id)[0].depart_name;
		}
	}
};
export const PersonnelInfoTrack = CreatePortal({}, module.exports.default);

</script>
<style lang="scss">
.v-personnel-info-track {
	.ivu-select {
		width: 220px;
	}
}
</style>

