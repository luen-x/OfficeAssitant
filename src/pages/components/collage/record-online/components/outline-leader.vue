<template>
	<!-- :handle-audit="handleAudit" -->
	<oa-basic-expand 
		v-model="detailData.isEdit"
		:detail-data="detailData"
		:handle-submit="handleSubmit"
		:type="type"
	>
		<div class="c-outline-leader-info">

			<div v-if="detailData.isEdit || detailData.record_status == 1">
				<i-form 
					ref="formValidate" 
					:model="formValidate" 
					:rules="ruleValidate" 
					:label-width="100"
					class="g-m-t-15 g-pd-l-15"
					@submit.native.prevent>
					<i-form-item
						label="客户职位："
						prop="position"
					>
						<i-select
							v-model="formValidate.position"
							clearable
							transfer
							style="width: 300px"
							placeholder="请选择客户职位"
						>
							<i-option 
								v-for="item in POSITION_ENUM"
								:key="item.value"
								:value="item.value">
								{{ item.label }}
							</i-option>
						</i-select>
					</i-form-item>

					<i-form-item label="课程类型：" style="margin: -10px 0 10px 0!important">
						<span>{{ formValidate.lecture_set_name }}</span>
					</i-form-item>

					<i-form-item 
						prop="docking_time" 
						label="对接时间：">
						<i-data-picker 
							v-model="formValidate.docking_time"
							format="yyyy-MM-dd"
							type="daterange"
							split-panels
							transfer
							separator=" 至 "
							style="width: 300px;"
							placeholder="请选择对接时间"/>
					</i-form-item>

					<i-form-item 
						label="是否出差："
						style="margin: -10px 0"
						prop="is_business">
						<i-radio-group v-model="formValidate.is_business">
							<i-radio :label="1">是</i-radio>
							<i-radio :label="0">否</i-radio>
						</i-radio-group>
					</i-form-item>

					<i-form-item 
						v-if="formValidate.is_business"
						prop="business_day" 
						label="出差天数：" 
						style="margin: -10px 0"
					>
						<i-input-number
							v-model="formValidate.business_day" 
							:min="1"
							:precision="0"
							:max="9"
							clearable
							style="width: 300px"
							placeholder="请输入出差天数"
						/>
						<span 
							class="g-c-black2 g-absolute __tip">天</span>
					</i-form-item>

					<i-form-item 
						label="备注："
						class="g-pd-b-30">
						<oa-limit-words
							v-model="formValidate.remark" 
							:max="200" 
							width="300px"
							placeholder="请输入备注"
						/>
					</i-form-item>

					<i-form-item 
						label="记录时间：" 
						style="margin-top: -40px" 
						class="g-pd-b-10">
						<span>{{ formValidate.update_time }}</span>
					</i-form-item>

				</i-form>
			</div>

			<oa-basic-info
				v-else
				:display-info="outlineLeaderInfo"
				:detail-data="detailDataParse"
				:role_type="detailData.role_type"
			/>
		</div>
	</oa-basic-expand>
</template>

<script>
import AutoToolTip from "@common/auto-tooltip/auto-tooltip";
import { Row, Col, Form, FormItem, Select, Option, Input, DatePicker,
	RadioGroup, Radio, InputNumber } from 'iview';
import API_ROOT from '@stores/apis/root';
import moment from 'moment';
import BasicExpand from "./basic-expend";
import { STATUS, outlineLeaderInfo, POSITION_ENUM } from './constants';
import BasicInfoDisplay from './basic-info-display';
import { OutlineCommonModal } from '../popup/outline-modal/outline-common-modal';
import OperateItem from './operate-item';

export default {
	components: {
		"oa-basic-expand": BasicExpand,
		'oa-basic-info': BasicInfoDisplay,
		'i-row': Row,
		'i-col': Col,
		'oa-autotip': AutoToolTip,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-data-picker': DatePicker,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-input-number': InputNumber,
		'oa-operate-item': OperateItem
	},
	props: {
		detailData: {
			type: Object,
			// required: true,
			default() {
				return {
					show: true,
					isEdit: false
				};
			},
		},
		loadData: {
			type: Function,
			required: true
		},
		type: {
			type: Number,
			required: true
		}
	},
	data() {
		const validateCreatedTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择对接时间');
			} else {
				callback();
			}
		};
		return {
			STATUS,
			POSITION_ENUM,
			outlineLeaderInfo,
			formValidate: {
				position: +this.detailData.position || '',
				lecture_set_name: this.detailData.lecture_set_name || '--',
				docking_time: JSON.parse(this.detailData.docking_time || '[]'),
				remark: this.detailData.remark,
				is_business: +this.detailData.is_business === 0 ? 0 : 1,
				business_day: +this.detailData.business_day || null,
				update_time: this.detailData.update_time || '--'
			},
			ruleValidate: {
				is_business: [{ required: true, type: 'number', message: '请选择是否出差', trigger: 'blur' }],
				position: [{ required: true, type: 'number', message: '请选择职位', trigger: 'change' }],
				docking_time: [{ required: true, validator: validateCreatedTime, trigger: 'change', message: '请选择对接时间' }],
				business_day: [{ required: true, type: 'number', message: '请输入出差天数', trigger: 'blur' }]
			}
		};
	},
	computed: {
		detailDataParse() {
			return ({
				...this.detailData,
				docking_time: JSON.parse(this.detailData.docking_time || '[]').join(' 至 '),
				is_business: +this.detailData.is_business ? '是' : '否',
				business_day: this.detailData.business_day + '天',
				remark: this.detailData.remark || '--',
				update_time: this.detailData.update_time || '--'
			});
		}
	},
	watch: {
		'detailData.isEdit': function (newVal, oldVal) {
			if (newVal) {
				const {
					position, docking_time = '[]', lecture_set_name,
					remark = '', is_business, business_day
				} = this.detailData;
				this.formValidate = {
					position: +this.detailData.position, 
					docking_time: JSON.parse(docking_time), 
					lecture_set_name,
					remark, 
					is_business: +this.detailData.is_business,
					business_day: +this.detailData.business_day,
				};
			}
		}
	},
	methods: {
		handleSubmit() {
			this.$refs.formValidate.validate(valid => {
				if (valid) {
					const { docking_time: [start, end] } = this.formValidate;
					this.$request({
						url: API_ROOT._COLLEAGE_RECORD_LESSON_RECORD_ADD,
						type: "POST",
						param: {
							record_id: this.detailData.record_id,
							lesson_type: this.detailData.lesson_type,
							...this.formValidate,
							docking_time: JSON.stringify([moment(start).format("YYYY-MM-DD"), moment(end).format("YYYY-MM-DD")])
						}
					}).then((res) => {
						return this.loadData();
					}).then(() => {
						this.detailData.isEdit = false;
					}).catch(err => {
					});
				} else {
					cnosole.log();
				}
			});
		},
		// handleAudit() {
		// 	OutlineCommonModal.popup({});
		// }
	}
};
</script>

<style lang="scss">
.c-outline-leader-info {
	.__tip {
        top: 3px;
		left: 276px;
		width: 22px;
		height: 20px;
		background: #fff;
	}
    .ivu-input-number-handler-wrap {
		display: none;
	}
}
</style>
