<template>
	<div class="v-sale-customer-business-model-form">
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
			<i-form-item v-if="!isManager" label="注册资金" prop="">
				<i-input
					:value="inform.industry"
					style="width: 220px"
					type="text"
					disabled
					placeholder="请输入注册资金" />
			</i-form-item>
			<i-form-item v-else label="邀约人" prop="invite_staff_id">
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
					style="width: 220px"
					placeholder="请选择地区" />
			</i-form-item>
			<i-form-item label="产品：" prop="product">
				<i-input
					:maxlength="10"
					v-model="formData.product"
					style="width: 220px"
					type="text"
					placeholder="请输入产品"/>
			</i-form-item>
			<i-form-item v-if="!isManager" label="是否老板：" prop="is_boss">
				<i-radio-group v-model="formData.is_boss" >
					<i-radio :label="1" class="_radio">是</i-radio>
					<i-radio :label="0" class="_radio">否</i-radio>
				</i-radio-group>
			</i-form-item>
			<template v-else>
				<i-form-item label="客户名称：" prop="customer_name">
					<i-input
						:maxlength="10"
						v-model="formData.customer_name"
						style="width: 220px"
						type="text"
						placeholder="请输入客户名称" />
				</i-form-item>
				<i-form-item label="客户类别：" prop="customer_type">
					<i-select v-model=" formData.customer_type " style="width: 220px" placeholder="请选择客户类别" clearable>
						<i-option :value="'A'">A</i-option>
						<i-option :value="'B'">B</i-option>
						<i-option :value="'C'">C</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="主跟人：" prop="follow_up_person">
					<i-input
						:maxlength="5"
						v-model="formData.follow_up_person"
						style="width: 220px"
						type="text"
						placeholder="请输入主跟人" />
				</i-form-item>
				<i-form-item v-if="0" style="width:640px" label="具体情况：" prop="">
					<oa-limit-words
						v-model="formData.situation"
						:placeholder="'请输入具体情况'"
						:max="500"
						style="width: 520px"
					/>
				</i-form-item>
			</template>
		</i-form>
	</div>
</template>

<script type="text/ecmascript-6">
import { Modal, Icon, Form, FormItem, Input, InputNumber,
	Select, Option, DatePicker, Cascader, Message, RadioGroup, Radio,
	Upload, Progress, Button, Poptip, CheckboxGroup, Checkbox
} from 'iview';
import Explain from '@components/_common/explain/explain';
import { dataValidity } from '@utils/utils';

export default {
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
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox,
	},
	props: {
		data: {
			type: Object,
			default() {
				return {
					inform: ''
				};
			}
		},
		isManager: {
			type: Boolean,
			default() {
				return false;
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
				is_boss: null,
				// situation: ""
			},
			ruleValidate: {
				relation_id: [
					{ required: true, type: 'number', message: '请输入公司名称', trigger: 'change' }

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
				is_boss: [
					{ type: 'number', message: '请选择是否是老板', trigger: 'change' }
				],
			},
		};
	},
	computed: {


	},
	mounted() {
		this.visible = true;
	},
	methods: {
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
</script>

<style  lang="scss">
.v-sale-customer-business-model-form{
	padding: 40px 0 20px 0;
}
</style>
