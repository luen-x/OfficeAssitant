<template>
	<div>
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
				{{ type === 1 ? '新增类型' : '编辑类型' }}
			</div>
			<i-form
				ref="form"
				:model="formdata"
				:rules="validator"
				:label-width="100"
				class="g-m-t-20">
				<i-formitem label="类型名称" prop="event_type_name">
					<i-input
						v-model="formdata.event_type_name"
						:maxlength="10"
						placeholder="请填写类型名称"
						clearable
						style="width: 220px"
					/>
				</i-formitem>
				<i-formitem label="负责部门" prop="depart_id">
					<i-cascader
						v-model="formdata.depart_id"
						:data="firstDepart"
						:change-on-select="true" 
						trigger="click" 
						placeholder="请选择负责部门"
						clearable
						transfer
						style="width: 220px"
						@on-change="handleDepartChange"
					/>
				</i-formitem>
				<i-formitem label="负责人" prop="staff_id">
					<i-select
						v-model="formdata.staff_id"
						placeholder="请选择负责人"
						style="width: 220px"
						clearable
						transfer
						multiple 
						class="g-m-r-5"
						@on-change="handleStaff"
					>
						<i-option
							v-for="item in managerDepart"
							:key="item.staff_id"
							:value="item.staff_id">
							{{ item.staff_name }}
						</i-option>
					</i-select>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option, Button, Cascader } from 'iview';
import { CreatePortal } from 'wya-vc';
// import { services } from '@stores/services/administration';
import API_ROOT from '@stores/apis/root';
import TextArea from '@components/_common/limit-words/limit-words';
import { initTreeData } from '@utils/utils';

export default {
	name: 'setting-apply-type',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-button': Button,
		'i-cascader': Cascader
	},
	// mixins: [services.firstDepart()],
	props: {
		type: Number,
		info: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			visible: false,
			firstDepart: [],
			formdata: { staff_id: [], ...this.info, },
			managerDepart: [],
			validator: {
				event_type_name: [
					{ required: true, message: "请输入类型名称", trigger: 'blur' }
				],
				depart_id: [
					{ required: true, type: 'array', message: "请选择负责部门", trigger: 'change' }
				],
				staff_id: [
					{ required: true, type: 'array', message: "请选择负责人", trigger: 'change' }
				],
			}
		};
	},
	mounted() {
		this.visible = true;
		this.type === 2 && this.fetchManager();
		this.fetchFirstDepart();
	},
	methods: {
		handleOk() {
			this.$refs['modal'].buttonLoading = false;
			this.$refs['form'].validate((item) => {
				if (item) {
					this.handleRequest();
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleRequest() {
			this.$request({
				url: API_ROOT._ADMINISTRATION_MATTER_TYPE_ADD_POST,
				type: 'POST',
				param: this.formdata
			}).then(res => {
				this.$Message.success(res.msg);
				this.$store.commit('ADMINISTRATION_MATTER_SETTING_TYPE_LIST_INIT');
				this.handleCancel();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleDepartChange(value, selected) {
			this.formdata.staff_id = [];
			this.fetchManager(value);
		},
		fetchManager(value) {	
			let depart_id = value ? value[value.length - 1] : this.formdata.depart_id && this.formdata.depart_id[this.formdata.depart_id.length - 1];
			this.$request({
				url: API_ROOT._ADMINISTRATION_MANAGER_DEPART_GET,
				type: 'GET',
				param: {
					depart_id
				}
			}).then(res => {
				this.managerDepart = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		
		fetchFirstDepart() {
			this.$request({
				url: API_ROOT._ADMINISTRATION_FIRST_DEPART_GET,
				type: 'GET',
				param: {
					depart_id: this.info.depart_id && this.info.depart_id.length ? this.info.depart_id[this.info.depart_id.length - 1] : ''
				}
			}).then(res => {
				this.firstDepart = initTreeData(res.data, 'depart_id', 'depart_name', 'children');
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleStaff(value) {
			this.formdata.staff_id = value;
		}
	}
};
export const TypeModal = CreatePortal({ store: app.$store }, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


