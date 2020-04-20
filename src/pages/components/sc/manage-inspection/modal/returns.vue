<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="v-sc-manage-inspection-returns"
			width="680"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				回访
			</div>

			<i-form ref="form" :model="form" :rules="formRule" :label-width="180">
				<div class="g-flex">
					<i-form-item label="回访接通情况：" prop="call_status">
						<span slot="label">
							回访接通情况
							<i-poptip
								:width="500"
								trigger="hover"
								placement="bottom"
								transfer
								word-wrap
								popper-class="c-explain-icon"
							>
								<i 
									class="iconfont g-pointer icon-info"
									style="font-size: 13px;color: #c5c5c7;" 
								/>

								<div slot="content">
									<div>接通情况注释：</div>
									<div>1、正常接通：不低于8分且不属于非雷；</div>
									<div>2、完结：只合作了立客户中心产品，项目已完结且有质检结果的（不论好坏）；</div>
									<div>3、未接：没接；</div>
									<div>4、无效：空号/无法接通/接通了但没问到结果（开会、忙、出差、打错了、让我们找另一个人但又没联系上新对接人等）；</div>
									<div>5、雷区：客户抱怨不做的原因与微一案有关且评分小于6分或气得不评分的，有退款想法，或者市场部直接告知不能联系的客户；</div>
									<div>6、非雷：客户自身原因导致不做了或者客户说不用回访（因为我们服务不好而说不回访的不是非雷）；</div>
									<div>7、1正常：曾经属于【正常接通】，再质检时未接或无效或没有给新评分但反馈正常的客户；</div>
									<div>8、2非雷：以前质检正常，再次质检客户因自身原因不做了或不用我们回访了；</div>
									<div>9、2雷区：以前质检正常，再次质检客户因为我们的原因不做了或要退；</div>
									<div>10、不回访：有服务提成但不用回访的项目：微商城+渠道商城+新营宝+新群宝+引流工具包；</div>
									<div>11、暂不回访：市场部/客户本人告知还没有起盘，让我们先不回访的；</div>
									<div>12、到期：质检中发现合作已到期；</div>
									<div>13、已退：客户或市场部告知已退款，且有退款凭证；</div>
									<div>14、未评：客户因刚合作不好评价而暂时没评分（因为生气不评的属于雷区）；</div>
								</div>
							</i-poptip>
							：
						</span>
						<i-select
							v-model="form.call_status"
							placeholder="请选择接通情况"
							style="width: 300px;"
							clearable
							transfer
							@on-change="handleChangeStatus"
						>
							<i-option 
								v-for="(item, index) in phoneStatusList" 
								:value="item.value" 
								:key="index"
							>
								{{ item.label }}
							</i-option>
						</i-select>
					</i-form-item>
					<div
						v-if="show"
						class="g-pd-t-5 g-m-l-5"
					>
						<i-checkbox v-model="form.is_check">
							确认完成质检
						</i-checkbox>
						<oa-explain
							style="transform: translateY(0px);"
							content="确认完成质检后客户会变为已质检状态，否则将继续停留在待质检列表中"
						/>
					</div>
				</div>

				<i-form-item label="服务评分：">
					<i-input-number
						v-model="form.score" 
						:disabled="scoreDis"
						:max="10"
						:min="0"
						placeholder="请输入客户评分"
						style="width: 300px"
					/>
					<span class="g-absolute" style="left: 260px;">分</span>

					<span
						v-if="!quality_record_id && name != 'serviceInspectionRecord' && serviceScore"
						class="g-m-l-10" 
						style="color: #FF6600;"
					>
						上次评分：{{ serviceScore }}
					</span>
				</i-form-item>

				<i-form-item 
					v-if="(form.score > 0 || form.score === 0) && form.score < 8 && !scoreDis" 
					prop="checkboxReason"
					label="不满意原因："
				>
					<template v-for="(item,index) in hateList">
						<div :key="index">
							<div style="padding-top: 2px;">{{ item.hate_name }}</div>
							<i-checkbox-group v-model="form.checkboxReason">
								<i-checkbox 
									v-for="element in item.hate_reason" 
									:key="element.id" 
									:label="element.id" 
									:value="element.id" 
									:disabled="scoreDis"
									style="width: 120px;"
								>
									{{ element.name }}
								</i-checkbox>
							</i-checkbox-group>
						</div>
					</template>
				</i-form-item>

				<template v-for="(item,index) in scoreList">
					<i-form-item :key="index" :label="item.name + '：'">
						<i-input-number
							v-model="serviceScoreItems[item.field]" 
							:disabled="scoreDis"
							:max="10"
							:min="0"
							:precision="2"
							:active-change="false"
							:placeholder="'请输入' + item.name"
							style="width: 300px"
						/>
						<span class="g-absolute" style="left: 260px;">分</span>
		
						<span
							v-if="!quality_record_id && name != 'serviceInspectionRecord' && item.score"
							class="g-m-l-10" 
							style="color: #FF6600;"
						>
							上次评分：{{ item.score }}
						</span>
					</i-form-item>
				</template>

				<i-form-item label="回款金额：" prop="return_money">
					<i-input-number 
						v-model="form.return_money"
						:max="999999.99" 
						:min="0"
						:disabled="scoreDis || integral_service_status == 1"
						:precision="2"
						:active-change="false"
						placeholder="请输入回款金额"
						style="width: 300px" 
					/>
					<span class="g-absolute" style="left: 250px;">万元</span>
				</i-form-item>

				<i-form-item label="代理人数：" prop="agent_num">
					<i-input-number
						v-model="form.agent_num"
						:disabled="scoreDis || integral_service_status == 1"
						:max="999999" 
						:min="0"
						:precision="0"
						placeholder="请输入代理人数"
						style="width: 300px"
					/>
					<span class="g-absolute __suffix">人</span>
				</i-form-item>

				<i-form-item prop="" label="是否启动招商会：">
					<i-radio-group v-model="form.attract_meet">
						<i-radio :disabled="scoreDis" :label="1">
							<span>是</span>
						</i-radio>
						<i-radio :disabled="scoreDis" :label="2">
							<span>否</span>
						</i-radio>
						<i-radio :disabled="scoreDis" :label="3">
							<span>不知道</span>
						</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item prop="" label="是否启动内训：">
					<i-radio-group 
						v-model="form.inner_training" 
						:disabled="scoreDis"
					>
						<i-radio :disabled="scoreDis" :label="1">
							<span>是</span>
						</i-radio>
						<i-radio :disabled="scoreDis" :label="2">
							<span>否</span>
						</i-radio>
						<i-radio :disabled="scoreDis" :label="3">
							<span>不知道</span>
						</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item label="备注：" prop="memo">
					<oa-limit-words
						v-model="form.memo"
						:max="500"
						:autosize="{ 
							minRows: 4, 
							maxRows: 5
						}"
						style="width: 300px"
						placeholder="请输入备注"
					/>
				</i-form-item>

				<i-form-item label="回访凭证：" prop="fileImage">
					<oa-upload
						v-model="form.fileImage" 
						:max="5"
						:upload="{multiple: true, max: 5}"
						class="g-m-l-10"
						style="width: 250px"
					/>
				</i-form-item>

				<div class="g-flex g-relative _is-fllow">
					<span v-if="form.is_follow" class="g-absolute g-fs-12 __dot">*</span>
					<i-form-item prop="">
						<span slot="label">
							是否跟进
							<oa-explain 
								style="margin: 0 -1px"
								title="员工回访客户时，可以根据客户的实际情况选择后期是否需要跟进，需要跟进的客户有额外的标识提示"
								content="举例：比如客户对微商系统的机制设定还不清楚，需要市场部的服务人员再进行讲解"
							/>：
						</span>

						<i-switch 
							v-if="!resolve"
							v-model="form.is_follow"
							:disabled="disabled"
							size="default"
							class="g-m-r-10"
						/>	

						<span v-else>{{ resolve }}</span>
					</i-form-item>
				</div>

				<div class="_is-sale-follow">
					<i-form-item v-if="form.is_follow" prop="is_sale_follow" label=" ">
						<i-select
							v-model="form.is_sale_follow"
							:disabled="disabled"
							class="g-m-t-10"
							style="width: 300px;"
							clearable
							placeholder="是否让销售跟进此次回访"
						>
							<i-option :value="1" :key="0">
								是
							</i-option>
							<i-option :value="0" :key="1">
								否
							</i-option>
						</i-select>
					</i-form-item>
				</div>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { 
	Modal,
	Tooltip, 
	Button, 
	Input, 
	InputNumber,
	Select, 
	CheckboxGroup, 
	Checkbox, 
	Form, 
	FormItem, 
	Switch, 
	Option, 
	Radio, 
	RadioGroup,
	Message,
	Poptip
} from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import Upload from "@components/_common/upload/upload";
import Explain from '@components/_common/explain/explain';

export default {
	name: 'sc-manage-inspection-return',

	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-input': Input,
		'i-select': Select,
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-switch': Switch,
		'i-option': Option,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-input-number': InputNumber,
		'i-tooltip': Tooltip,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		"oa-upload": Upload
	},

	props: {
		quality_id: Number,
		quality_record_id: Number,
		contract_company_id: Number,
		name: String,
		type: String,
		index: Number
	},

	data() {
		return {
			visible: false,
			return_money: null,
			scores: null,			
			form: {
				is_check: false,
				fileImage: [],
				call_status: "", // 接通情况
				score: null,
				hate_type: "",
				checkboxReason: [],
				return_money: null,
				agent_num: null,
				attract_meet: "", // 是否启动招商会
				inner_training: "", // 是否启动内训
				memo: "", // 备注
				is_follow: false,
				is_sale_follow: null
			},
			resolve: "",
			formRule: {
				call_status: [
					{
						type: 'number',
						required: true,
						message: "请选择接通情况",
						trigger: "change"
					}
				],
				score: [
					{ 
						required: true, 
						type: "number", 
						message: "请输入质检评分", 
						trigger: "blur"
					}
				],
				checkboxReason: [
					{ 
						required: true, 
						type: "array", 
						message: "不满意原因不能为空", 
						trigger: "change" 
					}
				],
				is_sale_follow: [
					{ 
						type: 'number',
						required: true, 
						message: "请选择是否让销售同步跟进", 
						trigger: "change"
					}
				]
			},
			phoneStatusList: [
				{
					label: "正常接通",
					value: 1
				}, 
				{
					label: "未接",
					value: 2
				}, 
				{
					label: "无效",
					value: 3
				}, 
				{
					label: "雷区",
					value: 4
				}, 
				{
					label: "非雷",
					value: 5
				}, 
				{
					label: "1正常",
					value: 6
				}, 
				{
					label: "2非雷",
					value: 7
				}, 
				{
					label: "2雷区",
					value: 8
				}, 
				{
					label: "不回访",
					value: 9
				}, 
				{
					label: "暂不回访",
					value: 10
				}, 
				{
					label: "到期",
					value: 11
				}, 
				{
					label: "已退",
					value: 12
				}, 
				{
					label: "未评",
					value: 13
				},
				{
					label: "完结",
					value: 14
				}
			],
			integral_service_status: "", // 0 回款和代理人数可编辑 1 不可编辑
			hateList: [], // 不满意原因
			scoreList: [], // 评分
			serviceList: [], // 已评分数
			serviceScoreItems: {},
			serviceScore: '',
			disabled: false
		};
	},
	computed: {
		scoreDis() {
			if (this.form.call_status == 2 || this.form.call_status == 3) {
				return true;
			} else {
				return false;
			}
		},

		show() {
			let flag = !!this.quality_record_id;
			
			if ((flag && this.index === 0) || !flag) {
				if (((this.name === "manage" && (this.type === "1" || this.type === "2")) 
				|| (this.name === "inspection" && this.type === "1")) 
				&& (this.form.call_status == 2 || this.form.call_status == 3)) {
					return true;
				} else {
					return false;
				}
			}
		}
	},

	async created() {
		this.loadHateData();
		!this.quality_record_id && await this.loadServiceData();
		this.loadScoreData();
	},

	async mounted() {
		await this.quality_record_id && this.loadData();
		this.visible = true;
	},

	methods: {
		loadHateData() {
			this.$request({
				url: "_SC_MANAGE_INSPECTION_QUALITY_HATE_GET",
				type: "GET",
				param: {}
			}).then(res => {
				this.hateList = res.data;
			});
		},

		loadScoreData() {
			this.$request({
				url: "_SC_MANAGE_INSPECTION_QUALITY_SCORE_GET",
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				}
			}).then(res => {
				!this.quality_record_id && res.data.forEach(item => {
					this.serviceList.forEach(element => {
						+item.id === +element.score_id ? item.score = element.score : null;
					});
				});

				this.scoreList = res.data;
		
				this.scoreList.forEach(item => {
					this.serviceScoreItems[item.field] = null;
				});
			});
		},

		loadServiceData() {
			return this.$request({
				url: "_SC_MANAGE_INSPECTION_QUALITY_SERVICE_SCORE_GET",
				type: "GET",
				param: {
					quality_id: this.quality_id
				}
			}).then(res => {
				this.serviceList = res.data.add_service_score;
				this.serviceScore = res.data.service_score;
			});
		},

		// 回访编辑详情
		loadData() {
			this.$request({
				url: "_SC_MANAGE_INSPECTION_QUALITY_RECORD_INFO_GET",
				type: "GET",
				param: {
					quality_record_id: this.quality_record_id
				}
			}).then(res => {
				this.form.call_status = Number(res.data.call_status);
				this.form.score = res.data.score ? Number(res.data.score) : null;
				this.form.return_money = res.data.return_money ? Number(res.data.return_money) : null;
				this.form.agent_num = res.data.agent_num ? Number(res.data.agent_num) : null;
				this.form.attract_meet = res.data.attract_meet;
				this.form.inner_training = res.data.inner_training;
				this.form.memo = res.data.memo;
				this.form.is_sale_follow = res.data.is_sale_follow;
				this.integral_service_status = res.data.integral_service_status;
				this.form.is_check = +res.data.is_check === 1;
				this.disabled = !!((+res.data.has_quality_record_follow === 1) || (+res.data.is_follow === 2));

				res.data.fileImage && res.data.fileImage.length != 0 && res.data.fileImage.forEach(item => {
					this.form.fileImage.push({
						url: item.img_url,
						title: item.img_url.substring(item.img_url.lastIndexOf("/") + 1, item.img_url.length),
						type: "." + item.img_url.substring(item.img_url.lastIndexOf(".") + 1, item.img_url.length),
						uid: item.img_url,
						file_id: item.relation_id
					});
				});

				if (!res.data.score) {
					this.form.checkboxReason = [];
				} else {
					res.data.hate_type_reason && res.data.hate_type_reason.length && res.data.hate_type_reason.forEach(item => {
						this.form.checkboxReason = [...this.form.checkboxReason, ...item.hate_reason];
					});
				}

				if (res.data.is_follow === 0) {
					this.form.is_follow = false;
				} else if (res.data.is_follow === 1) {
					this.form.is_follow = true;
				} else {
					this.resolve = "已解决";
					this.form.is_follow = false;
				}

				res.data.service_score_items.forEach(item => {
					this.serviceScoreItems[item.field] = +item.score || null;
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			let hate_type_reason = [];
			let service_score_items = [];
			let arr = Object.keys(this.serviceScoreItems);
			let hate_type_reasons = [];

			if (this.form.score < 8) {
				this.hateList.forEach((item, index) => {
					hate_type_reasons[index] = {};
					hate_type_reasons[index].hate_type = item.hate_type;
					hate_type_reasons[index].hate_reason = [];

					item.hate_reason.forEach(element => {
						if (this.form.checkboxReason.indexOf(element.id) > -1) {
							hate_type_reasons[index].hate_reason.push(element.id);
						}
					});
				});
			} else {
				hate_type_reasons = [];
			}
			hate_type_reason = [];

			hate_type_reasons.forEach(item => {
				if (item.hate_reason.length != 0) {
					hate_type_reason.push({
						hate_type: item.hate_type,
						hate_reason: item.hate_reason
					});
				}
			});

			this.scoreList.forEach((item, index) => {
				if (arr.indexOf(item.field) > -1) {
					service_score_items.push({
						score_id: item.id,
						score: this.serviceScoreItems[item.field] || -1
					});
				}
			});


			let API = this.quality_record_id ? "_SC_CUSTOMER_PREDISTRIBUTE_EDIT_RECORD_POST" : "_SC_MANAGE_INSPECTION_ADD_OPERATE_RECORD_POST";

			this.$request({
				url: API_ROOT[API],
				type: "POST",
				param: {
					quality_id: this.quality_id ? this.quality_id : "",
					quality_record_id: this.quality_record_id ? this.quality_record_id : "",
					...this.form,
					hate_type_reason,
					service_score_items,
					score: this.form.score,
					is_follow: this.form.is_follow ? 1 : 0,
					is_check: this.form.is_check ? 1 : 0
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit('close');
		},

		handleChangeStatus(val) {
			if (val == 2 || val == 3) {
				this.form.return_money = null;
				this.form.agent_num = null;
				this.form.attract_meet = "";
				this.form.inner_training = "";
				this.form.score = null;
				this.form.checkboxReason = [];
			}
		}
	}
};

export const ReturnsModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-manage-inspection-returns {
	.ivu-modal-body {
		max-height: 500px;
		overflow-y: auto;
	}

	.ivu-radio-wrapper{
		&:first-child{
			margin-right: 20px;
		}

		&:nth-of-type(2){
			margin-right: 20px;
		}
	}

	._label{
		.ivu-form-item-label{
			padding-top: 0px;
		}
	}

	._score{
		.ivu-form-item-label:before{
			color: #ffffff !important;
		}
	}

	.__suffix {
		height: 32px;
		line-height: 32px;
		left: 260px;
	}

	._is-fllow,._is-score{
		.ivu-form-item{
			margin-bottom: 0px !important;
		}

		.__dot{
			color: #ed4014;
			font-family: "SimSun";
			top: 7px;
			left: 85px;
		}
	}

	._is-score{
		.__dot{
			top: -2px;
			left: 75px;
		}
	}

	._is-sale-follow{
		.ivu-form-item-required{
			.ivu-form-item-label{
				&:before{
					content: " ";
				}
			}
		}
	}

	.ivu-input-number-handler-wrap {
        display: none !important;
	}

	.ivu-form-item{
		margin-bottom: 15px !important;
	}

	._form-items{
		.ivu-form-item-label{
			&:before{
				content: "" !important;
			}
		}
	}
}
</style>