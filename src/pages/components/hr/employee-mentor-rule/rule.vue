<template>
	<div class="hr-employee-mentor-rule">
		<div class="_content">
			<i-form
				ref="form"
				:model="formData"
				:rules="ruleValidate"
				:label-width="120"
				style="width: 850px"
				position="center"
				class="_form"
			>
				<oa-title title="前提条件"/>
				<div style="max-width: 1100px" class="g-c-black1 _precondition">
					<i-form-item label="评定周期：" required style="marginLeft: -3px;">
						<div class="g-flex g-flex-ac">
							<div style="marginTop: -20px">每</div>
							<i-form-item prop="cycle_month">
								<i-select
									v-model="formData.cycle_month"
									style="width: 220px"
									class="g-m-lr-5"
									transfer
									clearable
									placeholder="请选择周期"
								>
									<i-option
										v-for="(item, index) in cycleData"
										:key="index"
										:value="item.value"
									>{{ item.label }}</i-option>
								</i-select>
							</i-form-item>
							<div style="marginTop: -20px">评定一次；评定基准期为</div>
							<i-form-item prop="start_month">
								<i-date-picker
									v-model="formData.start_month"
									type="month"
									placeholder="请选择开始月份"
									clearable
									style="width: 220px"
									class="g-m-lr-5"
								/>
								<!-- <i-select
									v-model="formData.start_month"
									style="width: 220px"
									transfer
									clearable
									class="g-m-lr-5"
									placeholder="请选择开始月份"
								>
									<i-option
										v-for="(item, index) in monthData"
										:key="index"
										:value="item.value"
									>{{ item.label }}</i-option>
								</i-select> -->
							</i-form-item>
						</div>
					</i-form-item>
					<i-form-item label="师傅工龄：" required style="marginTop: -20px">
						<div class="g-flex g-flex-ac" >
							<div style="marginTop: -20px">员工工龄需要达到</div>
							<i-form-item prop="need_standing_month" class="g-m-lr-5">
								<i-input-number 
									v-model="formData.need_standing_month" 
									:min="0" 
									:precision="0" 
									style="width: 220px"/>
							</i-form-item>
							<div style="marginTop: -20px">月后，才可以成为师傅。</div>
						</div>
					</i-form-item>
					<i-form-item label="评选业绩：" required style="marginTop: -20px">
						<div class="g-flex g-flex-ac">
							<div style="marginTop: -20px">员工距今半年度总业绩需要达到</div>
							<i-form-item prop="half_year_performance" class="g-m-lr-5">
								<i-input-number 
									v-model="formData.half_year_performance" 
									:min="0" 
									:precision="0" 
									style="width: 220px"/>
							</i-form-item>
							<div style="marginTop: -20px">元。</div>
						</div>
					</i-form-item>
					<i-form-item label="评选范围：" required style="marginLeft: -3px;marginTop: -20px">
						<div class="g-flex">
							<div
								class="g-red-btn-line"
								style="height:30px" 
								@click="handleAddRange">新增范围</div>
							<oa-ranks :ranges-arr="formData.master_range" class="g-m-l-10" />
						</div>
					</i-form-item>
				</div>
				<oa-title title="评选规则" class="_title"/>
				<div v-for="(item,index) in formData.rules" :key="index" class="_selection">
					<i-form-item
						:label="`条件${index+1}：`"
						:prop="'rules.' + index + '.name'"
						:rules="ruleValidate.name"
					>
						<i-input v-model="item.name" :maxlength="50" style="width: 220px" placeholder="请输入评选规则"/>
						<span>
							<i
								v-if="formData.rules.length!==1"
								class="iconfont icon-remove-circle g-fs-16 g-c-pink-mid g-m-l-10"
								@click="()=>handleReduceInput(index)"
							/>
							<i
								v-if="formData.rules.length===index+1&&formData.rules.length<20"
								class="iconfont icon-add1 g-fs-16 g-c-blue-mid g-m-l-5"
								@click="handleAddInput"
							/>
						</span>
					</i-form-item>
				</div>
			</i-form>
		</div>
		<footer class="g-flex-cc">
			<div class="g-gray-btn-small g-m-r-10" @click="handleTip">重置</div>
			<div class="g-m-r-10 g-red-btn-small" @click="handleSubmit">保存</div>
		</footer>
	</div>
</template>

<script>
import Title from "@components/hr/_common/title";
import {
	Form,
	FormItem,
	Input,
	InputNumber,
	Select,
	Option,
	DatePicker,
	Message,
	Row,
	Col,
	RadioGroup,
	Radio,
	Button
} from "iview";
import API_ROOT from "@stores/apis/root";
import lodash from "lodash";
import moment from 'moment';
import { cycleData } from "./constants";
import Ranks from "./ranks";
import { AddRangeModal } from "./popup/range";
import { TipModal } from "./popup/tip";

export default {
	name: "hr-employee-mentor-rule",
	components: {
		"oa-title": Title,
		"oa-ranks": Ranks,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
		"i-button": Button,
		"i-date-picker": DatePicker
	},
	props: {
		first_depart_id: String
	},
	data() {
		return {
			cycleData,
			// monthData: [],
			formData: {
				need_standing_month: null,
				half_year_performance: null,
				cycle_month: "",
				start_month: "",
				master_range: [],
				rules: [{ name: "" }]
			},
			ruleValidate: {
				cycle_month: [
					{
						required: true,
						type: "number",
						message: "请选择周期",
						trigger: "change"
					}
				],
				start_month: [
					{
						required: true,
						type: 'date',
						message: "请选择开始月份",
						trigger: "change"
					}
				],
				need_standing_month: [
					{
						required: true,
						pattern: /.+/,
						message: "请输入工龄条件",
						trigger: "blur"
					}
				],
				half_year_performance: [
					{
						required: true,
						pattern: /.+/,
						message: "请输入业绩条件",
						trigger: "blur"
					}
				],
				name: [
					{
						required: true,
						message: "规则为必填"
					}
				]
			}
		};
	},
	created() {
		// this.loadCycleYear();
		this.loadData();
	},
	
	methods: {
		// loadCycleYear() {
		// 	this.$request({
		// 		url: API_ROOT._HR_MASTER_CYCLE_YEAR_GET,
		// 		type: "GET",
		// 		loading: false,
		// 		param: {}
		// 	}).then(res => {
		// 		this.monthData = res.data;
		// 	}).catch(error => {
		// 		this.$Message.error(error.msg);
		// 	});
		// },
		loadData() {
			this.$request({
				url: API_ROOT._HR_MASTER_RULE_GET,
				type: "GET",
				loading: false,
				param: {
					first_depart_id: this.first_depart_id
				}
			}).then(res => {
				this.formData = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleAddRange() {
			let self = this;
			AddRangeModal.popup({
				departId: this.first_depart_id
			}).then(res => {
				let rangeObj = {
					position_id: res.position_id,
					position_name: res.position_name,
					role_id: res.role_id,
					role_name: res.role_name
				};
				self.formData.master_range.push(rangeObj);
			});
		},
		handleAddInput() {
			this.formData.rules.push({ name: "" });
			this.$nextTick(() => {
				let divDom = document.querySelector(".hr-employee-mentor-rule>._content");
				divDom.scrollTop = divDom.scrollHeight;
			});
		},
		handleReduceInput(index) {
			this.formData.rules.splice(index, 1);
		},
		handleSubmit: lodash.debounce(function (event) {
			this.$refs.form.validate(isValid => {
				if (isValid) {
					this.$request({
						url: API_ROOT._HR_MASTER_ADD_RULE_POST,
						type: "POST",
						param: {
							...this.formData,
							start_month: this.formData.start_month ? moment(this.formData.start_month).format("YYYY-MM") : '',
							first_depart_id: this.first_depart_id
						}
					}).then(res => {
						this.$Message.success(res.msg);
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		}, 300),
		handleTip() {
			TipModal.popup({
			}).then(res => {
				this.loadData();
			}).catch(err => {});
		}
	}
};
</script>

<style lang="scss">
.hr-employee-mentor-rule{
	// border:1px solid #f00;
	margin-top:-10px;
	
	
	._content{
		// margin-bottom: 80px;
		max-height: 662px;  
		overflow-y:auto;   
		._precondition{
			margin-left:-25px;
			border:1px solid #fff;
		}
		._title{
			margin-top:5px;
			border:1px solid #fff;
		}
		._selection{
			margin-left:-45px;
		}
	}
	footer {
		box-shadow:0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		position: fixed;
		bottom: 0;
		right: 0;
		z-index: 0;
		background-color: #fff;
		// width: 100%;
		width: calc(100% - 160px);
		height: 60px;
		max-height: 60px;
	}
}
  
</style>
