<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:loading="true"
		class="v-hr-archives-manager-watch-meet-modal"
		width="700">

		<div slot="header" class="g-tc">
			{{ type === 'add' ? '约见客户' : '编辑' }}
		</div>

		<div class="g-fs-14 _content">
			<i-form
				ref="form"
				:rules="rule"
				:model="formData"
				:label-width="100"
				class="g-flex-ac g-jc-sb g-fw-w">

				<i-form-item label="谈判手：" prop="staff_id">
					<i-select
						ref="staff"
						v-model="formData.staff_id"
						:remote-method="loadStaff"
						:loading="staffLoading"
						style="width: 220px;"
						filterable
						remote
						clearable
						transfer
						multiple
						label-in-value
						placeholder="请选择谈判手"
						@on-query-change="handleQueryChange($event, 'staff')"
					>
						<!-- @on-change="handleChange($event, 'staff')" -->
						<i-option
							v-for="(item, index) in staffData"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="公司名称：" prop="relation_id">
					<i-select
						v-model="formData.relation_id"
						:remote-method="handleSearchCompany"
						:loading="isLoading"
						:multiple="false"
						clearable
						transfer
						filterable
						remote
						style="width: 220px;"
						placeholder="请输入公司名称"
						@on-change="handleCompanyChange"
					>
						<i-option
							v-for="(com, index) in companyList"
							:value="com.relation_id"
							:key="index"
						>{{ com.company_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="客户姓名：" prop="customer_name">
					<i-input
						v-model="formData.customer_name"
						:maxlength="10"
						placeholder="请输入客户姓名"
						clearable
						style="width: 220px;" />
				</i-form-item>
				<i-form-item label="手机号码：" prop="customer_tel">
					<i-input
						v-model="formData.customer_tel"
						:maxlength="11"
						placeholder="请输入手机号码"
						clearable
						style="width: 220px;" />
				</i-form-item>
				<i-form-item label="职务：" prop="position">
					<i-input
						v-model="formData.position"
						:maxlength="10"
						clearable
						placeholder="请输入职务"
						style="width: 220px;" />
				</i-form-item>
				<i-form-item label="法人占比：" prop="legal_person_ratio">
					<i-input
						v-model="formData.legal_person_ratio"
						:maxlength="10"
						placeholder="请输入法人占比"
						clearable
						style="width: 220px;" />
				</i-form-item>
				<i-form-item label="成立时间：" prop="establishment_time">
					<i-date-picker
						v-model="formData.establishment_time"
						type="date"
						clearable
						transfer
						placeholder="请选择成立时间"
						style="width: 220px;"/>
				</i-form-item>
				<i-form-item label="注册资金：" prop="capital">
					<i-input
						v-model="formData.capital"
						disabled
						placeholder="请输入注册资金"
						style="width: 220px;"/>
				</i-form-item>
				<i-form-item label="跟进时间：" prop="visit_time">
					<i-date-picker
						v-model="formData.visit_time"
						type="date"
						clearable
						transfer
						placeholder="请选择跟进时间"
						style="width: 220px;" />
				</i-form-item>
				<i-form-item label="产品：" prop="product">
					<i-input
						v-model="formData.product"
						:maxlength="10"
						clearable
						placeholder="请输入产品"
						style="width: 220px;" />
				</i-form-item>
				<i-form-item label="所属行业：" prop="industry">
					<i-input
						v-model="formData.industry"
						placeholder="请输入所属行业"
						disabled
						style="width: 220px;"/>
				</i-form-item>
				<i-form-item label="目前渠道：" prop="distribution_channel">
					<i-input
						v-model="formData.distribution_channel"
						:maxlength="40"
						clearable
						placeholder="请输入目前销售渠道"
						style="width: 220px;" />
				</i-form-item>
				<i-form-item label="是否签单：" prop="is_deal">
					<i-radio-group v-model="formData.is_deal" class="g-flex g-jc-sa">
						<div class="g-flex" style="width: 220px;">
							<div>
								<i-radio :label="1">是</i-radio>
							</div>
							<div>
								<i-radio :label="0">否</i-radio>
							</div>
						</div>
					</i-radio-group>
				</i-form-item>
				<i-form-item v-if="formData.is_deal" label="签单金额：" prop="payment">
					<i-input-number
						v-model="formData.payment"
						:min="0"
						:max="999999999"
						placeholder="请输入签单金额"
						style="width: 220px;" />
				</i-form-item>
				<i-form-item v-if="formData.is_deal" label="合作项目：" prop="cooperation_project">
					<i-input
						v-model="formData.cooperation_project"
						:maxlength="10"
						clearable
						placeholder="请输入合作项目"
						style="width: 220px;" />
				</i-form-item>
				<i-form-item label="是否有官网：" prop="is_website">
					<i-radio-group v-model="formData.is_website" class="g-flex g-jc-sa">
						<div class="g-flex" style="width: 220px;">
							<div>
								<i-radio :label="1">是</i-radio>
							</div>
							<div>
								<i-radio :label="0">否</i-radio>
							</div>
						</div>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否倒水：" prop="is_water">
					<i-radio-group v-model="formData.is_water" class="g-flex g-jc-sa">
						<div class="g-flex" style="width: 220px;">
							<div>
								<i-radio :label="1">是</i-radio>
							</div>
							<div>
								<i-radio :label="0">否</i-radio>
							</div>
						</div>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否点餐：" prop="is_meal">
					<i-radio-group v-model="formData.is_meal" class="g-flex g-jc-sa">
						<div class="g-flex" style="width: 220px;">
							<div>
								<i-radio :label="1">是</i-radio>
							</div>
							<div>
								<i-radio :label="0">否</i-radio>
							</div>
						</div>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否做电商：" prop="is_commerce">
					<i-radio-group v-model="formData.is_commerce" class="g-flex g-jc-sa">
						<div class="g-flex" style="width: 220px;">
							<div>
								<i-radio :label="1">是</i-radio>
							</div>
							<div>
								<i-radio :label="0">否</i-radio>
							</div>
						</div>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否拍照：" prop="is_photo">
					<i-radio-group v-model="formData.is_photo" class="g-flex g-jc-sa">
						<div class="g-flex" style="width: 220px;">
							<div>
								<i-radio :label="1">是</i-radio>
							</div>
							<div>
								<i-radio :label="0">否</i-radio>
							</div>
						</div>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否拍小视频：" prop="is_video">
					<i-radio-group v-model="formData.is_video" class="g-flex g-jc-sa">
						<div class="g-flex" style="width: 220px;">
							<div>
								<i-radio :label="1">是</i-radio>
							</div>
							<div>
								<i-radio :label="0">否</i-radio>
							</div>
						</div>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否录音：" prop="is_sound_record">
					<i-radio-group v-model="formData.is_sound_record" class="g-flex g-jc-sa">
						<div class="g-flex" style="width: 220px;">
							<div>
								<i-radio :label="1">是</i-radio>
							</div>
							<div>
								<i-radio :label="0">否</i-radio>
							</div>
						</div>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="谈判前沟通内容：" prop="communicate">
					<oa-limit-words
						v-model="formData.communicate"
						:max="500"
						width="520px"/>
				</i-form-item>
				<i-form-item label="讲解文化走廊客户态度：" prop="explain">
					<oa-limit-words
						v-model="formData.explain"
						:max="500"
						width="520px"/>
				</i-form-item>
				<i-form-item label="客户谈判内容：" prop="negotiation">
					<oa-limit-words
						v-model="formData.negotiation"
						:max="500"
						width="520px"/>
				</i-form-item>
				<i-form-item label="谈判后客户情况诊断：" prop="diagnosis">
					<oa-limit-words
						v-model="formData.diagnosis"
						:max="500"
						width="520px"/>
				</i-form-item>
			</i-form>
		</div>

		<div slot="footer" class="_footer">
			<i-button type="text" @click="handleClose">取消</i-button>
			<i-button
				type="primary"
				class="g-red-btn-small"
				@click="handleOk">
				确定
			</i-button>
			<!-- style="cursor: not-allowed" -->
		</div>
	</i-modal>
</template>

<script>
import moment from 'moment';
import lodash from 'lodash';
import API_ROOT from "@stores/apis/root";
import { Button, Modal, DatePicker, Form, FormItem, Select, Option, Input,
		 InputNumber, Radio, RadioGroup } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { dataValidity, formatMoment } from "@utils/utils";
import { services, createSearch } from '@stores/services/hr';
import { DelTipModal } from '../../_common/delete-tip';

export default {
	name: "hr-archives-manager-watch-meet-modal",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-select": Select,
		"i-option": Option,
		"i-input": Input,
		"i-button": Button,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-date-picker': DatePicker,
		'i-input-number': InputNumber
	},
	mixins: [
		createSearch({ key: 'staff' })
	],
	props: {
		detail: Object,
		type: String,
		staff_id: String | Number,
		choose_day: String,
	},
	data() {

		return {
			visible: false,
			title: '',
			company_name: '',
			isLoading: false,
			relation_type: '',
			companyList: [],
			staff: '',
			status: false,
			oldData: {},
			formData: {
				legal_person_ratio: '',
				capital: null,
				payment: null,
				is_deal: 1,
				is_website: 1,
				is_water: 1,
				is_meal: 1,
				is_commerce: 1,
				is_photo: 1,
				is_video: 1,
				is_sound_record: 1,
				visit_time: '',
				establishment_time: ''
			},
			list: [],
			rule: {
				relation_id: [
					{ required: true, message: "请输入公司名称", pattern: /.+/, trigger: "change" }
					// { type: 'validateName', validator: dataValidity }
				],
				staff_id: [{ required: true, message: "请选择谈判手", type: 'array', trigger: "change" }],
				customer_name: [
					{ required: true, message: "请输入客户姓名", trigger: "blur" },
					{ type: 'validName', validator: dataValidity }
				],
				customer_tel: [
					{ required: true, message: "请输入手机号码", trigger: "blur" },
					{ type: 'validMobile', message: '手机号格式不正确', validator: dataValidity, trigger: "blur" }
				],
				position: [
					{ required: true, message: "请输入职务", trigger: "blur" },
					{ type: 'validName', validator: dataValidity }
				],
				legal_person_ratio: [{ required: true, message: "请输入法人占比", trigger: "change" }],
				establishment_time: [{ required: true, message: "请选择成立时间", type: 'date', trigger: "change" }],
				capital: [{ required: true, message: "请输入注册资金", pattern: /.+/, trigger: "change" }],
				visit_time: [{ required: true, message: "请选择跟进时间", type: 'date', trigger: "change" }],
				product: [
					{ required: true, message: "请输入产品", trigger: "blur" },
					{ type: 'validName', validator: dataValidity }
				],
				industry: [{ required: true, message: "请输入行业", trigger: "blur" }],
				is_deal: [{ required: true, message: "请选择是否签单", pattern: /.+/, trigger: "change" }],
				is_sound_record: [{ required: true, message: "请选择是否录音", pattern: /.+/, trigger: "change" }],
				payment: [{ required: true, message: "请输入签单金额", pattern: /.+/, trigger: "change" }],
				cooperation_project: [{ required: true, message: "请输入合作项目", trigger: "blur" }],
			}
		};
	},
	mounted() {
		this.visible = true;

		// 编辑时请求详情
		if (this.type === 'edit' && this.staff_id) {
			this.title = '编辑';
			// 初始化 公司和邀约人
			this.handleSearchCompany(this.detail.company_name);
			// 谈判手
			let arr = this.detail.negotiator.split(',');
			if (arr.length) {
				arr.forEach((item, index) => {
					arr[index] = +item;
					this.staffData.push({ label: this.detail.negotiator_arr[index], value: +item });
				});
			}
			// 其他数据
			this.formData = { ...this.detail };
			this.relation_type = this.detail.relation_type;
			this.formData.area = this.detail.region;
			this.formData.payment = +this.detail.payment;
			this.formData.staff_id = arr;
		}
		this.$nextTick(() => {
			this.oldData = { ...this.formData };
		});
	},
	methods: {
		handleCompanyChange(val) {
			if (val) {
				let sed = this.companyList.filter(item => item.relation_id === val)[0];
				// 根据公司获取行业和地区
				this.relation_type = sed.relation_type;
				this.formData.industry = sed.industry;
				this.formData.capital = sed.capital;
				this.formData.area = sed.province + sed.city + sed.area;
			} else {
				this.relation_type = '';
				this.formData.industry = '';
				this.formData.capital = '';
				this.formData.area = '';
			}
		},
		// 搜索公司
		handleSearchCompany(query) {
			if (query.replace(/[0-9]/g, '')) {
				this.$request({
					url: '_HR_ARCHIVES_EMPLOYEE_COMPANY_NAME_GET',
					type: "GET",
					param: {
						staff_id: this.staff_id,
						keyword: query
					}
				}).then(res => {
					this.companyList = res.data;
				});
			}
		},
		handleQueryChange(query = '', type) {
			let targetQuery = this.formData[`${type}_name`] || '';
			if (targetQuery.length > query.length) {
				this.$refs[`${type}`].clearSingleSelect();
			}
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			this.$refs['form'].validateAndScroll(valid => {
				if (valid) {
					this.$refs.modal.buttonLoading = false;
					this.$request({
						url: '_HR_ARCHIVES_EMPLOYEE_DATA_EDIT_POST',
						type: "POST",
						param: {
							...this.formData,
							staff_id: this.staff_id,
							relation_type: this.relation_type,
							type: 4,
							negotiator: this.formData.staff_id,
							choose_day: this.choose_day
						},
						loading: false
					}).then(res => {
						this.$emit("sure");
						this.$Message.success("操作成功");
					}).catch(err => {
						this.$Message.warning(err.msg);
					});

				} else {
					this.$refs.modal.buttonLoading = false;
					this.$Message.warning('请按照提示完善表单信息');
				}
			});
		},
		handleClose() {
			this.status = !lodash.isEqual(this.oldData, this.formData);

			if (this.status) {
				DelTipModal.popup({
					title: "提示",
					content: "取消后你所填写的内容将无法恢复，确认取消？"
				}).then(() => {
					this.$emit("close");
				}).catch(() => {});
			} else {
				this.$emit("close");
			}
		}
	}
};
export const meetPModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-archives-manager-watch-meet-modal {
	._content {
		max-height: 500px;
		overflow-y: auto;
		padding-left: 4px;
		padding-right: 4px;
	}
}
</style>
