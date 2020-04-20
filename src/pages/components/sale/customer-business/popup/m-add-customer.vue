<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:closable="false"
		:title="title"
		:loading="true"
		width="680"
		class-name="v-sale-m-see-customer"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div>
			<i-form
				ref="form"
				:model="formData"
				:rules="ruleValidate"
				:label-width="83"
				inline>
				<i-form-item label="公司名称：" prop="relation_id">
					<i-select
						ref="relation"
						v-model="formData.relation_id"
						:remote-method="remote1"
						:loading="relationLoading"
						placeholder="请输入公司名称"
						filterable
						clearable
						transfer
						remote
						label-in-value
						class="g-m-r-5"
						style="width: 220px"
						@on-change="handleRelationSearch"
						@on-query-change="handleQueryChange"
					>
						<i-option
							v-for="(option, index) in relationList"
							:value="option.relation_id"
							:key="index"
						>{{ option.company_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="邀约人" prop="invite_staff_id">
					<i-select
						ref="relation"
						v-model="formData.invite_staff_id"
						:remote-method="remote2"
						:loading="inviteLoading1"
						placeholder="请输入邀约人"
						filterable
						clearable
						transfer
						remote
						class="g-m-r-5"
						style="width: 220px"
						@on-query-change="handleQueryChange"
					>
						<i-option
							v-for="(option, index) in inviteList"
							:value="option.staff_id"
							:key="index"
						>{{ option.text }}</i-option>

					</i-select>
				</i-form-item>
				<i-form-item label="所属行业：" prop="">
					<i-input
						:value="inform.industry"
						style="width: 220px"
						type="text"
						disabled
						placeholder="请输入所属行业" />
				</i-form-item>
				<i-form-item label="地区：" prop="">
					<i-input
						:value="inform.province?inform.province+'-'+inform.city+'-'+inform.area:inform.region"
						type="text"
						disabled
						placeholder="请选择地区" />
				</i-form-item>
				<i-form-item label="产品：" prop="product">
					<i-input :maxlength="10" v-model="formData.product" type="text" placeholder="请输入产品" />
				</i-form-item>
				<i-form-item label="客户名称：" prop="customer_name">
					<i-input :maxlength="10" v-model="formData.customer_name" type="text" placeholder="请输入客户名称" />
				</i-form-item>
				<i-form-item label="客户类别：" prop="customer_type">
					<i-select v-model=" formData.customer_type " placeholder="请选择客户类别" clearable>
						<i-option :value="'A'">A</i-option>
						<i-option :value="'B'">B</i-option>
						<i-option :value="'C'">C</i-option>
					</i-select>

				</i-form-item>
				<i-form-item label="主跟人：" prop="follow_up_person">
					<i-input :maxlength="5" v-model="formData.follow_up_person" type="text" placeholder="请输入主跟人" />
				</i-form-item>
				<i-form-item v-if="0" style="width:640px" label="具体情况：" prop="">
					<oa-limit-words
						v-model="formData.situation"
						:placeholder="'请输入具体情况'"
						:max="500"
						style="width: 520px"
					/>
				</i-form-item>
			</i-form>
		</div>
		<!-- <div slot="footer">
			<i-button class="g-m-r-10" type="text" @click="handleCancel()">取消</i-button>
			<i-button type="primary" @click="handleOk()">确定</i-button>
		</div> -->
	</i-modal>
</template>
<script>
import {
	Modal, Icon, Form, FormItem, Input, InputNumber,
	Select, Option, DatePicker, Cascader, Message, RadioGroup, Radio,
	Upload, Progress, Button
} from 'iview';
import { CreatePortal, CreateCustomer } from 'wya-vc';
import { debounce } from 'lodash';
import { dataValidity } from '@utils/utils';
import { error } from 'util';


const Content = CreateCustomer({
});
export default {
	name: "vc-sale-add-customer",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-select': Select,
		'i-option': Option,
		'oa-content': Content
	},
	props: {
		data: {
			type: Object,
			default() {
				return {
					inform: ''
				};
			}
		}
	},
	data() {
		return {
			visible: false,
			relationLoading: false, // 进度条
			inviteLoading1: false, // 进度条
			inform: {},
			province: "北京市",
			city: "北京市辖区",
			area: "东城区",
			relationList: [], // 公司列表
			inviteList: [],
			formData: {
				data_id: '',
				customer_type: "",
				invite_staff_id: '',
				relation_type: "",
				relation_id: '',
				product: '',
				customer_name: '',
				follow_up_person: "",
				// situation: ""
			},
			ruleValidate: {
				relation_id: [
					{ required: true, type: 'number', message: '请输入公司名称', trigger: 'blur' }

				],
				product: [
					{ type: 'validName', validator: dataValidity, message: '请输入中英文', trigger: 'blur' }
				],
				customer_name: [
					{ type: 'validName', validator: dataValidity, message: '请输入中英文', trigger: 'blur' }
				],
				follow_up_person: [
					{ type: 'validName', validator: dataValidity, message: '请输入中英文', trigger: 'blur' }
				],

			},
		};
	},
	computed: {
		title() {
			return this.data.title;
		},
		informDetail() {
			return this.data.inform || '';
		}
	},
	mounted() {
		this.visible = true;
		if (this.informDetail) {
			Object.keys(this.formData).forEach(key => {
				this.formData[key] = this.informDetail[key];
			});
			this.remote1(this.informDetail.company_name);
			this.remote2(this.informDetail.invite_staff_name);
			this.inform.capital = this.informDetail.capital; // 注册资金
			this.inform.industry = this.informDetail.industry; // 行业
			this.inform.region = this.informDetail.region;
			this.$refs.relation.clearSingleSelect();
		}
	},
	methods: {
		handleOk() {
			 this.$refs.form.validate((valid) => {
				if (valid) {
					this.$request({
						url: '_SALE_BUSINESS_DATA_GET_SAVE_POST',
						type: 'post',
						param: {
							type: this.data.type,
							...this.formData
						},
						loading: false
					}).then((res) => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure', 1);
					}).catch((err) => {
						this.$refs.modal.buttonLoading = false;
						this.$Message.error(err.msg);
					});
				} else {
					this.$Message.error('内容请填写完整');
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close', 0);
		},
		handleRelationSearch(v) {
			const id = this.formData.relation_id;
			if (!id) return;
			const res = this.relationList.find(ele => {
				return id == ele.relation_id;
			});
			this.inform = res;
			this.formData.relation_type = res.relation_type;
		},
		handleQueryChange(query = '') {
			let targetQuery = this.relation || '';
			if (targetQuery.length > query.length) {
				this.$refs.relation.clearSingleSelect();
			}
		},
		remote1(query, type) {
			if (query !== '') {
				this.relationLoading = true;
			} else {
				return;
			}
			return this.$request({
				url: '_SALE_BUSINESS_DATA_GET_ASSOCIATE_GET',
				type: 'GET',
				param: {
					keyword: query // 为了能搜索到全部的员工数据（手机号码必定有1）
				},
				loading: false
			}).then((res) => {
				this.relationLoading = false;
				// this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
				this.relationList = res.data;
				this.relation_type = res.data.length > 0 ? res.data[0].relation_type : '';
			});
		},
		remote2(query, type) {
			if (query !== '') {
				this.inviteLoading1 = true;
			} else {
				return;
			}
			return this.$request({
				url: '_CONTENT_CONFIG_GET_ALL_STAFF_BY_SEARCH_GET',
				type: 'GET',
				param: {
					search: query // 为了能搜索到全部的员工数据（手机号码必定有1）
				},
				loading: false
			}).then((res) => {
				this.inviteLoading1 = false;
				this.inviteList = res.data;
			});
		}
	}
};
export const MSeeCustomer = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
	.v-sale-m-see-customer{
		.ivu-modal-body{
			padding:16px 16px ;
		}
		.ivu-form-item{
			width: 300px;
			margin-right:0px;
		}
		.c-limit-words textarea.ivu-input{
			min-height: 60px !important;
			height: 60px !important;
		}
	}
</style>
