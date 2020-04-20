<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:closable="false"
		:title="title"
		:loading="true"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-pd-t-20 ">
			<i-form
				ref="form"
				:model="formData"
				:rules="ruleValidate"
				:label-width="123"
				style="width:343px">
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
				<i-form-item label="注册资金：" prop="">
					<i-input
						:value="inform.capital"
						disabled
						style="width: 220px"
						type="text"
						placeholder="请输入注册资金" />
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
					<i-input v-model="formData.product" :maxlength="10" type="text" placeholder="请输入产品" />
				</i-form-item>
				<i-form-item label="是否老板：" prop="is_boss">
					<i-radio-group v-model="formData.is_boss" >
						<i-radio :label="1" class="_radio">是</i-radio>
						<i-radio :label="0" class="_radio">否</i-radio>
					</i-radio-group>
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
	Modal, Icon, Form, FormItem, Message, Input, InputNumber,
	Select, Option, DatePicker, Cascader, RadioGroup, Radio,
	Upload, Progress, Button
} from 'iview';
import { CreatePortal, CreateCustomer } from 'wya-vc';
import { debounce } from 'lodash';
import { finished } from 'stream';
import { dataValidity } from '@utils/utils';

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
				return {};
			}
		}
	},
	data() {
		return {
			relationLoading: false, // 进度条
			visible: false,
			inform: {},
			province: "北京市",
			city: "北京市辖区",
			area: "东城区",
			relationList: [], // 公司列表
			formData: {
				data_id: '',
				relation_type: "",
				relation_id: '',
				product: '',
				is_boss: 1,
			},
			ruleValidate: {
				relation_id: [
					{ required: true, type: 'number', message: '请输入公司名称', trigger: 'blur' }
				],
				product: [
					{ type: 'validName', validator: dataValidity, message: '请输入中英文', trigger: 'blur' }
				],
				is_boss: [
					{ type: 'number', message: '请选择是否是老板', trigger: 'change' }
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
			this.inform.capital = this.informDetail.capital; // 注册资金
			this.inform.industry = this.informDetail.industry; // 行业
			this.inform.region = this.informDetail.region;
			this.remote1(this.informDetail.company_name);
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
		handleRelationSearch() {
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
	}
};
export const AddCustomer = CreatePortal({}, module.exports.default);
</script>
