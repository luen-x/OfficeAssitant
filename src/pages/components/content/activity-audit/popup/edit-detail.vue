<template>
	<div class="v-audit-detail-edit">
		<i-form 
			ref="formValidate"
			:model="formValidate" 
			:rules="ruleValidate"
			:label-width="120"
		>
			<i-row>
				<i-col span="10">
					<i-form-item label="公司名称" prop="customer_company">
						<i-input 
							v-model="formValidate.customer_company" 
							disabled
							class="_long"/>
					</i-form-item>
				</i-col>
				<i-col span="10">
					<i-form-item label="公司行业" prop="industry_id">
						<i-select 
							v-model="formValidate.industry_id" 
							placeholder="请选择公司行业"
							clearable
							class="_long">
							<i-option
								v-for="(item, index) in industryList"
								:value="item.industry_id"
								:key="index"
							>{{ item.industry_name }}</i-option>
						</i-select>
					</i-form-item>
				</i-col>
			</i-row>

			<i-row>
				<i-col span="10">
					<i-form-item label="客户姓名" prop="boss_name">
						<i-input
							v-model="formValidate.boss_name" 
							:maxlength="8"
							class="_long"/>
					</i-form-item>
				</i-col>
				<i-col span="10">
					<i-form-item label="客户电话" prop="boss_tel">
						<i-input
							v-model="formValidate.boss_tel"
							:maxlength="13"
							class="_long"/>
					</i-form-item>
				</i-col>
			</i-row>

			<i-row>
				<i-col span="10">
					<i-form-item label="客户类别">
						<i-input 
							v-model="formValidate.customer_type_name" 
							disabled
							class="_long"/>
					</i-form-item>
				</i-col>
				<i-col span="10">
					<i-form-item label="合作时间">
						<i-input 
							v-model="formValidate.cooperate_date" 
							disabled
							class="_long"/>
					</i-form-item>
				</i-col>
			</i-row>

			<i-row>
				<i-col span="10">
					<i-form-item label="对接部门">
						<i-input 
							v-model="formValidate.depart_name" 
							disabled
							class="_long"/>
					</i-form-item>
				</i-col>
				<i-col span="10">
					<i-form-item label="部门简称">
						<i-input 
							v-model="formValidate.abbreviation" 
							disabled
							class="_long"/>
					</i-form-item>
				</i-col>
			</i-row>

			<i-row>
				<i-col span="10">
					<i-form-item label="对接人">
						<i-input 
							v-model="formValidate.staff_name" 
							disabled
							class="_long"/>
					</i-form-item>
				</i-col>

				<i-col v-if="+activitySetting.write_category" span="10">
					<i-form-item label="合作类别" prop="cooperate_category">
						<i-select 
							v-model="formValidate.cooperate_category" 
							placeholder="请选择合作类别"
							clearable
							class="_long">
							<i-option
								v-for="(item,i) in cooperateList"
								:value="item.value"
								:key="i"
							>{{ item.label }}</i-option>
						</i-select>
					</i-form-item>
				</i-col>

				<i-col v-if="+activitySetting.write_retrain_num" span="10">
					<i-form-item label="复训次数" prop="retrain_number">
						<i-select 
							v-model="formValidate.retrain_number" 
							placeholder="请选择复训次数"
							clearable
							class="_long">
							<i-option
								v-for="(item,i) in retrainingList"
								:value="item.value"
								:key="i"
							>{{ item.label }}</i-option>
						</i-select>
					</i-form-item>
				</i-col>
				
				<i-col v-if="+activitySetting.write_listen_finish" span="10">
					<i-form-item label="是否听完" class="_height" prop="listen_finish">
						<i-radio-group v-model="formValidate.listen_finish">
							<i-radio :label="2" class="_radio">是</i-radio>
							<i-radio :label="1" class="_radio">否</i-radio>
						</i-radio-group>
					</i-form-item>
				</i-col>

				<i-col v-if="+activitySetting.write_join_strategy" span="10">
					<i-form-item v-if="+formValidate.is_join_strategy" label="是否参加过策略班" prop="is_join_strategy">
						<i-radio-group v-if="+formValidate.is_join_strategy" v-model="formValidate.is_join_strategy">
							<i-radio :label="2" class="_radio">是</i-radio>
							<i-radio :label="1" class="_radio">否</i-radio>
						</i-radio-group>
					</i-form-item>
					<i-form-item v-else label="是否参加过策略班">
						<i-input 
							value="--"
							disabled
							class="_long"/>
					</i-form-item>
				</i-col>

				<i-col v-if="+activitySetting.write_lift_plate" span="10">
					<i-form-item label="是否起盘" prop="is_lift_plate">
						<i-radio-group v-model="formValidate.is_lift_plate">
							<i-radio :label="2" class="_radio">是</i-radio>
							<i-radio :label="1" class="_radio">否</i-radio>
						</i-radio-group>
						<div v-if="formValidate.is_lift_plate == 2" style="display: inline-block; margin-bottom: -20px">
							<i-form-item prop="lift_plate_month">
								<i-input-number
									:min="1"
									v-model="formValidate.lift_plate_month" 
									style="width: 80px; margin-left: 10px"/>
							</i-form-item>
						</div>
					</i-form-item>
				</i-col>

				<i-col v-if="+activitySetting.write_proxy_num" span="10">
					<i-form-item label="已招代理人数" prop="proxy_num">
						<i-select
							v-model="formValidate.proxy_num"
							clearable
							transfer
							placeholder="请选择已招代理数"
							style="width:300px"
						>
							<i-option
								v-for="item in proxyList"
								:value="item.value"
								:key="item.value"
							>
								{{ item.label }}
							</i-option>
						</i-select>
					</i-form-item>
				</i-col>
			</i-row>

			<i-row v-for="(user, i) in formValidate.apply_users" :key="i">
				<i-form-item :label="`报名人${i + 1}`" :style="{ marginTop: i > 0 ? '-20px' : 0 }">
					<div class="g-flex">
						<div class="g-flex g-fw-w">
							<div class="g-m-r-10">
								<i-form-item 
									:prop="'apply_users.' + i + '.username'"
									:rules="ruleValidate.boss_name">
									<i-input
										v-model="user.username" 
										placeholder="请填写姓名"
										style="width: 220px;"
									/>
								</i-form-item>
							</div>
							<div class="g-m-r-10">
								<i-form-item
									:prop="'apply_users.' + i + '.position'"
									:rules="ruleValidate.position">
									<i-select 
										v-model="user.position" 
										placeholder="请选择职位"
										clearable
										style="width: 220px;">
										<i-option 
											v-for="position in positionList" 
											:value="position.value" 
											:key="position.value"
										>
											{{ position.label }}
										</i-option>
									</i-select>
								</i-form-item>
							</div>
							<div class="g-m-r-10">
								<i-form-item 
									:prop="'apply_users.' + i + '.id_card'"
									:rules="ruleValidate.id_card">
									<i-input
										:maxlength="18"
										v-model="user.id_card" 
										placeholder="请填写身份证"
										clearable
										style="width: 220px;"
									/>
								</i-form-item>
							</div>
							<div class="g-m-r-10">
								<i-form-item 
									:prop="'apply_users.' + i + '.phone'"
									:rules="ruleValidate.phone"
								>
									<i-input
										v-model="user.phone"
										:maxlength="11"
										placeholder="请输入手机号码"
										clearable
										style="width: 220px;" 
									/>
								</i-form-item>
							</div>
						</div>
						<div class="g-m-r-30 g-flex">
							<i
								v-if="showRemoveUser"
								:style="{cursor: 'pointer', }" 
								class="g-c-red-light iconfont icon-remove-circle g-m-r-5" 
								@click="handleRemoveUser(i)"
							/>
							<i
								v-if="showAddUser"
								:style="{cursor: 'pointer', 'margin-left': showRemoveUser ? 0 : '10px'}" 
								class="g-c-blue-light iconfont icon-add1"
								@click="handleAddUser" 
							/>
						</div>
					</div>
				</i-form-item>
			</i-row>

			<i-row v-if="+activitySetting.has_voucher" style="margin-top: -20px">
				<i-form-item label="上传凭证：" prop="voucher_list">
					<vc-imgs-picker 
						v-model="formValidate.voucher_list" 
						:max="5"
						@error="handleError"
					/>
				</i-form-item>

			</i-row>

			<div v-if="+activitySetting.write_is_renew" class="g-flex">
				<i-form-item label="是否续费客户" class="_height" prop="is_renew">
					<i-radio-group v-model="formValidate.is_renew">
						<i-radio :label="2" class="_radio">是</i-radio>
						<i-radio :label="1" class="_radio">否</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item v-if="formValidate.is_renew == 2" label="续费类型" prop="renew_type">
					<i-select
						v-model="formValidate.renew_type"
						clearable
						transfer
						placeholder="请选择续费类型"
						style="width:300px"
					>
						<i-option
							v-for="item in renewList"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
			</div>
		</i-form>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Select,
	Col, Row, Option, RadioGroup, InputNumber,
	Radio } from 'iview';
import API_ROOT from "@stores/apis/root";
import { cloneDeep } from 'lodash';
import { ImgsPicker } from 'wya-vc';
import { dataValidity, validLetterAndNumber } from '@utils/utils';
import { services } from '@stores/services/sale';

export default {
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-col': Col,
		'i-row': Row,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'vc-imgs-picker': ImgsPicker
	},
	props: {
		dataSource: {
			required: true,
			type: Object
		}
	},
	data() {
		const detailData = cloneDeep(this.dataSource);
		const validateliftPlateMonth = (rule, value, callback) => {
			if (value < 1) {
				callback('月数须大于1');
			} else {
				callback();
			}
		};
		return {
			industryList: [], // 行业类别
			retrainingList: [], // 复训类别
			positionList: [], // 职位类别
			cooperateList: [], // 合作类别
			proxyList: [], // 代理区间
			renewList: [
				{
					label: '只续费软件',
					value: 1
				},
				{
					label: '续费软件+大课+咨询',
					value: 2
				}
			],
			activitySetting: {
				write_category: 0,
				write_join_strategy: 0,
				write_lift_plate: 0,
				write_listen_finish: 0,
				has_voucher: 0,
				apply_limit: 0,
				extra_apply: 0,
				write_is_renew: 0,
				write_proxy_num: ''
			},
			formValidate: {
				...detailData,
				abbreviation: detailData.abbreviation ? detailData.abbreviation : '--',
				lift_plate_month: +detailData.lift_plate_month,
				proxy_num: +detailData.proxy_num,
				voucher_list: detailData.voucher ? detailData.voucher.split(',') : [],
				retrain_number: detailData.retrain_number === '0' ? '1' : detailData.retrain_number,
			},
			ruleValidate: {
				industry_id: [
					{ required: true, type: 'number', message: '请选择公司行业', trigger: 'change' }
				],
				boss_name: [
					{ required: true, message: '请填写姓名（8字内）', trigger: 'blur' }
				],
				boss_tel: [
					{ required: true, message: "请输入客户电话", trigger: "blur" },
					{ pattern: /^-|\d$/, message: "电话号码格式有误", trigger: "blur" }
				],
				cooperate_category: [
					{ required: true, type: 'number', message: '请选择合作类别', trigger: 'change' }
				],
				retrain_number: [
					{ required: true, type: 'number', message: '请选择复训次数', trigger: 'change' }
				],
				listen_finish: [
					{ required: true, type: 'number', message: '请选择是否听完', trigger: 'change' }
				],
				is_join_strategy: [
					{ required: true, type: 'number', message: '请选择是否添加过策略班级', trigger: 'change' }
				],
				is_lift_plate: [
					{ required: true, type: 'number', message: '请选择是否起盘', trigger: 'change' }
				],
				is_renew: [
					{ required: true, type: 'number', message: '请选择是否续费', trigger: 'change' }
				],
				renew_type: [
					{ required: true, type: 'number', message: '请选择续费类型', trigger: 'change' }
				],
				position: [
					{ required: true, message: '请选择职位', trigger: 'change' }
				],
				id_card: [
					{ required: true, message: '请输入身份证号码', trigger: 'blur' },
					{
						// type: 'validIDCards',
						validator: validLetterAndNumber,
						message: "身份证号码格式有误",
						trigger: "blur"
					}
				],
				phone: [
					{ required: true, message: "请输入手机号码", trigger: "blur" },
					{ type: 'validMobile', message: '手机号格式不正确', validator: dataValidity, trigger: "blur" }
				],
				voucher_list: [
					{ required: true, type: 'array', message: '请上传凭证', trigger: 'change' }
				],
				lift_plate_month: [
					{ required: true, type: "number", message: '请选择起盘月数', trigger: 'change' },
					{ validator: validateliftPlateMonth, trigger: 'blur' }
				],
				proxy_num: [
					{ required: true, type: 'number', message: '请输入已招代理数(数字)', trigger: 'blur' }
				]
			}
		};
	},
	computed: {
		showRemoveUser() {
			return this.formValidate.apply_users.length > 1;
		},
		showAddUser() {
			let maxNum = Number(this.activitySetting.apply_limit) + Number(this.activitySetting.extra_apply);
			
			// 如果是超管最大可以添加10个
			maxNum = this.$global.staff.is_charge == 1 
				? Math.max(maxNum, 10)
				: maxNum;
			return this.formValidate.apply_users.length < maxNum;
		}
	},
	created() {
		this.handleGetPositionInfo();
		this.handleGetActivitySetting();
	},
	methods: {
		handleRemoveUser(index) {
			this.formValidate.apply_users.splice(index, 1);
		},
		handleAddUser() {
			this.formValidate.apply_users.push({
				name: '',
				position: '',
				id_card: '',
				phone: ''
			});
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleGetPositionInfo() {
			this.$request({
				url: API_ROOT._CONTENT_ACTIVITY_AUDIT_POSITION_INFO_GET,
				type: "GET",
				loading: false
			}).then(res => {
				this.industryList = res.data.industry_list;
				this.retrainingList = res.data.retrain_number_list;
				this.proxyList = res.data.proxy_num_list;
				this.positionList = res.data.position_list;
				this.cooperateList = res.data.cooperate_category_list;
			}).catch(err => {});
		},
		handleGetActivitySetting() {
			this.$request({
				url: API_ROOT._CONTENT_ACTIVITY_DETAIL_GET,
				type: "GET",
				loading: false,
				param: {
					id: this.dataSource.activity_id
				}
			}).then(res => {
				this.activitySetting = {
					...res.data
				};
			}).catch(err => {
				this.$Message.error(err.msg);
			}); 
		},

		handleSubmit() {
			this.$refs['formValidate'].validateAndScroll((valid) => {
				if (valid) {
					// this.$emit('sure');
					const cooperate_date = this.formValidate.cooperate_date === '--'
						? '0000-00-00'
						: this.formValidate.cooperate_date;
					return this.$request({
						url: API_ROOT._CONTENT_ACTIVITY_AUDIT_EDIT_POST,
						type: 'POST',
						param: {
							...this.formValidate,
							user_list: this.formValidate.apply_users,
							cooperate_date,
							renew_type: this.formValidate.is_renew == 1 ? 0 : this.formValidate.renew_type
						}
					}).then(res => {
						this.$emit('sccess-save');
						this.$Message.success(res.msg);
						app.$store.commit('CONTENT_ACTIVITY_AUDIT_LIST_RESET', { type: '' });
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.v-audit-detail-edit {
	padding-top: 20px;
	._long {
		width: 220px;
	}
}
</style>