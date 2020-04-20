<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:closable="false"
		:loading="true"
		width="700"
		title="约见客户"
		class-name="v-sale-see-customer"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div>
			<i-form
				ref="form"
				:model="formData"
				:rules="ruleValidate"
				:label-width="100"
				inline>
				<i-form-item label="谈判手：" prop="negotiator">
					<i-select
						ref="negotiator"
						v-model="formData.negotiator"
						:remote-method="remote"
						:loading="negotiatorLoading"
						placeholder="请选择谈判手"
						filterable
						clearable
						transfer
						remote
						multiple
						label-in-value
						class="g-m-r-5"
						style="width: 220px"
						@on-change="handleStaffSearch"
						@on-query-change="handleQueryChange"
					>
						<i-option
							v-for="(option, index) in negotiatorList"
							:value="option.staff_id+''"
							:key="index"
						>{{ option.text }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="公司名称：" prop="relation_id">
					<i-select
						ref="relation"
						v-model="formData.relation_id"
						:remote-method="remoteRelation"
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
				<i-form-item label="客户姓名：" prop="customer_name">
					<i-input v-model="formData.customer_name" :maxlength="10" type="text" placeholder="请输入客户姓名" />
				</i-form-item>
				<i-form-item label="手机号码：" prop="customer_tel">
					<i-input :maxlength="11" v-model="formData.customer_tel" type="text" placeholder="请输入手机号码" />
				</i-form-item>
				<i-form-item label="客户职务：" prop="position">
					<i-input v-model="formData.position" :maxlength="10" type="text" placeholder="请输入职务" />
				</i-form-item>
				<i-form-item label="法人占比：" prop="legal_person_ratio">
					<i-input
						v-model="formData.legal_person_ratio"
						:maxlength="10"
						style="width: 220px"
						placeholder="请输入法人占比"
					/>
				</i-form-item>
				<i-form-item label="成立时间：" prop="establishment_time1">
					<i-date-picker
						v-model="formData.establishment_time1"
						type="date"
						placeholder="请输入成立时间"
						style="width: 220px"
						@on-change="handleEstablishmentTime"
					/>
				</i-form-item>
				<i-form-item label="注册资金：" prop="capital">
					<i-input v-model="inform.capital" disabled type="text" placeholder="请输入注册资金" />
				</i-form-item>
				<i-form-item label="跟进时间：" prop="visit_time1">
					<i-date-picker
						v-model="formData.visit_time1"
						type="date"
						placeholder="请选择跟进时间"
						style="width: 220px"
						@on-change="handleVisitTime"
					/>
				</i-form-item>
				<i-form-item label="产品：" prop="product">
					<i-input v-model="formData.product" :maxlength="10" type="text" placeholder="请输入产品" />
				</i-form-item>
				<i-form-item label="所属行业：" prop="industry">
					<i-input :value="inform.industry" type="text" disabled placeholder="请输入所属行业" />
				</i-form-item>
				<i-form-item label="销售渠道：" prop="distribution_channel">
					<i-input :maxlength="40" v-model="formData.distribution_channel" type="text" placeholder="请输入目前销售渠道" />
				</i-form-item>

				<i-form-item label="是否签单：" prop="is_deal">
					<i-radio-group v-model="formData.is_deal">
						<i-radio :label="1" class="_radio">是</i-radio>
						<i-radio :label="0" class="_radio">否</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item v-if="formData.is_deal==1" label="签单金额：" prop="payment">
					<i-input-number :max="9999999999" v-model="formData.payment" type="text" placeholder="请输入签单金额" />
				</i-form-item>
				<i-form-item v-if="formData.is_deal==1" label="合作项目：" prop="cooperation_project">
					<i-input :maxlength="10" v-model="formData.cooperation_project" type="text" placeholder="请输入合作项目" />
				</i-form-item>
				<i-form-item label="是否有官网：" prop="is_website">
					<i-radio-group v-model="formData.is_website" >
						<i-radio :label="1" class="_radio">是</i-radio>
						<i-radio :label="0" class="_radio">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否倒水：" prop="is_water">
					<i-radio-group v-model="formData.is_water">
						<i-radio :label="1" class="_radio">是</i-radio>
						<i-radio :label="0" class="_radio">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否点餐：" prop="is_meal">
					<i-radio-group v-model="formData.is_meal">
						<i-radio :label="1" class="_radio">是</i-radio>
						<i-radio :label="0" class="_radio">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否做电商：" prop="is_commerce">
					<i-radio-group v-model="formData.is_commerce">
						<i-radio :label="1" class="_radio">是</i-radio>
						<i-radio :label="0" class="_radio">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否拍照：" prop="is_photo">
					<i-radio-group v-model="formData.is_photo">
						<i-radio :label="1" class="_radio">是</i-radio>
						<i-radio :label="0" class="_radio">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否拍小视频：" prop="is_video">
					<i-radio-group v-model="formData.is_video">
						<i-radio :label="1" class="_radio">是</i-radio>
						<i-radio :label="0" class="_radio">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否录音：" prop="">
					<i-radio-group v-model="formData.is_sound_record">
						<i-radio :label="1" class="_radio">是</i-radio>
						<i-radio :label="0" class="_radio">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item :label-width="120" style="width:640px" label="谈判前沟通内容：" prop="">
					<oa-limit-words
						v-model="formData.communicate"
						:placeholder="'请输入谈判前沟通内容'"
						:max="500"
						style="width: 520px"
					/>
				</i-form-item>
				<i-form-item :label-width="120" style="width:640px" label="讲解文化走廊客户态度：" prop="">
					<oa-limit-words
						v-model="formData.explain"
						:placeholder="'请输入讲解文化走廊客户态度'"
						:max="500"
						style="width: 520px"
					/>
				</i-form-item>
				<i-form-item :label-width="120" style="width:640px" label="客户谈判内容：" prop="">
					<oa-limit-words
						v-model="formData.negotiation"
						:placeholder="'请输入客户谈判内容'"
						:max="500"
						style="width: 520px"
					/>
				</i-form-item>
				<i-form-item :label-width="120" style="width:640px" label="谈判后客户情况诊断：" prop="">
					<oa-limit-words
						v-model="formData.diagnosis"
						:placeholder="'请输入谈判后客户情况诊断'"
						:max="500"
						style="width: 520px"
					/>
				</i-form-item>
			</i-form>
		</div>
		<div slot="footer">
			<i-button class="g-m-r-10" type="text" @click="handleCancel()">取消</i-button>
			<i-button type="primary" @click="handleOk()">确定</i-button>
		</div>
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
import { Confirm } from '@common/confirm/confirm';

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
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'oa-content': Content

	},
	props: {
		data: {
			type: Object,
			default() {
				return {
					inform: '',
				};
			},
		}
	},
	data() {
		return {
			visible: false,
			loading: false,
			relationLoading: false,
			negotiatorLoading: false,
			negotiatorList: [],
			relationList: [],
			inform: {},
			formData: {
				data_id: '',
				type: '4', // 数据类型 1 加微信客户 2 维护客户 3 维护出来客户 4 约见客户 5 绕前台 6 过客户数 7 过出来客户数 8 谈判客户 9 跟进客户     对应获取配置里的key
				customer_name: "",
				customer_tel: null,
				relation_type: '', // 客户类型 0 公海 1 意向客户 2 成交客户 根据联想返回的值
				relation_id: null, // 关联的id 根据联想返回的值
				invite_staff_id: '', // 邀约人ID
				product: "", // 产品
				negotiator: [],
				position: "", // 职位
				legal_person_ratio: null, // 法人占比
				establishment_time: "", // 成立时间
				visit_time: "", // 跟进时间
				distribution_channel: "", // 销售渠道
				is_deal: 1, // 是否签单
				is_water: 1, // 是否倒水
				is_meal: 1, // 是否点餐
				is_website: 1, // 是否有官网
				is_commerce: 1, // 是否做电商
				is_photo: 1, // 是否拍照
				is_video: 1, // 是否拍小视频
				is_sound_record: 1, // 是否录音

				payment: null, // 签单金额
				// is_boss: 1, // 是否是老板
				cooperation_project: "", // 合作项目
				// situation: '', 具体情况
				communicate: '', // 谈判前沟通内容
				explain: '', // 讲解文化走廊客户态度
				negotiation: '', // 客户谈判内容
				diagnosis: '' // 谈判后客户情况诊断
			},
			ruleValidate: {
				negotiator: [
					{ required: true, type: 'array', message: '请选择谈判手', trigger: 'change' }
				],
				customer_tel: [
					{ required: true, message: '请输入手机号码', trigger: 'blur' },
					{ pattern: /^[0-9]+$/, message: '请输入数字', trigger: 'blur' }
				],
				relation_id: [
					{ required: true, type: 'number', message: '请输入公司名称', trigger: 'blur' }
				],
				customer_name: [
					{ required: true, message: '请输入客户姓名', trigger: 'blur' },
					{ type: 'validName', validator: dataValidity, message: '请输入中英文', trigger: 'blur' }
				],
				position: [
					{ required: true, message: '请输入职务', trigger: 'blur' },
					{ pattern: /^[\u4e00-\u9fa5]*$/, message: '请输入中文', trigger: 'blur' }
				],
				distribution_channel: [
					{ pattern: /^[\u4e00-\u9fa5]*$/, message: '请输入中文', trigger: 'blur' }

				],
				product: [
					{ type: 'validName', validator: dataValidity, message: '请输入中英文', trigger: 'blur' }
				],
				establishment_time1: [
					{ required: true, type: "date", message: '请选择成立时间', trigger: 'change' }
				],
				visit_time1: [
					{ required: true, type: "date", message: '请选择跟进时间', trigger: 'change' }
				],
				is_deal: [
					{ required: true, type: "number", message: '请输入是否签单', trigger: 'change' }
				],
				cooperation_project: [
					{ required: true, message: '请输入合作项目', trigger: 'change' },
					{ pattern: /^[\u4e00-\u9fa50-9]*$/, message: '请输入中文或数字', trigger: 'blur' }

				],
				payment: [
					{ required: true, type: 'number', message: '请输入签单金额', trigger: 'change' }
				],
				legal_person_ratio: [
					{ required: true, message: '请输入法人占比', trigger: 'blur' }
				],

			},
		};
	},
	computed: {
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
			this.formData.negotiator = this.formData.negotiator.split(',');
			this.formData.establishment_time1 = this.formData.establishment_time;
			this.formData.visit_time1 = this.formData.visit_time;
			this.formData.payment = Number(this.formData.payment);
			this.inform.capital = this.informDetail.capital; // 注册资金
			this.inform.industry = this.informDetail.industry; // 行业
			this.remoteRelation(this.informDetail.company_name);
			this.remote(1);
			this.$refs.relation.clearSingleSelect();
			this.$refs.negotiator.clearSingleSelect();
		}

	},
	methods: {
		handleOk() {
			 this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.$request({
						url: '_SALE_BUSINESS_DATA_GET_SAVE_POST',
						type: 'post',
						param: {
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
			 Confirm.popup({ msg: '取消后将无法恢复，确定要取消吗？' }).then(() => {
				 this.visible = false;
				 this.$emit('close', 0);
			 });
		},
		handleStaffSearch(staff = {}) {
			if (this.formData.negotiator.length > 3) {
				this.formData.negotiator.pop();
			}
			this.staff = staff.value || '';
			this.staff_label = staff.label || '';
		},
		handleQueryChange(query = '') {
			// return;
			// ！！！！！！！！！！！！！！！不要忘记VC的上面更改！！！！！！！！！！！！！！！！！！！！！！！！！！！！
			let targetQuery = this.negotiator || '';
			if (targetQuery.length > query.length) {
				this.$refs.negotiator.clearSingleSelect();
			}
		},
		remote(query) {
			if (query !== '') {
				this.loading = true;
				this.handleLoadStaffData(query, 2);
			}
		},
		handleLoadStaffData(query, type) {
			return this.$request({
				url: '_CONTENT_CONFIG_GET_ALL_STAFF_BY_SEARCH_GET',
				type: 'GET',
				param: {
					search: query == 1 ? '' : query // 为了能搜索到全部的员工数据（手机号码必定有1）
				},
				loading: false
			}).then((res) => {
				this.loading1 = false;
				this.loading = false;
				this.negotiatorList = res.data;
			});
		},
		handleEstablishmentTime(v) {
			this.formData.establishment_time = v;
		},
		handleVisitTime(v) {
			this.formData.visit_time = v;
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
		remoteRelation(query, type) {
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
				this.formData.relation_type = res.data.length > 0 ? res.data[0].relation_type : '';
			});
		},



	}
};
export const SeeCustomer = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
	.v-sale-see-customer{
		.ivu-modal-body{
			padding:16px 5px ;
		}
		.ivu-form-item{
			width: 320px;
		}
		._input {
            display: inline-block;
            width: 220px !important;
        }
		.c-limit-words textarea.ivu-input{
			min-height: 60px !important;
			height: 60px !important;
		}
		._number-append {
            display: inline-block;
            position: absolute;
            right: 7px;
            vertical-align: bottom;
            z-index: 1;
            color: gray;
        }
		/deep/ .ivu-input-number {
            width: 100% !important;
            .ivu-input-number-handler-wrap {
                display: none !important;
            }
        }
	}
</style>
