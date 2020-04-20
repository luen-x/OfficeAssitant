<template>
	<!-- :handle-audit="handleAudit" -->
	<oa-basic-expand 
		v-model="detailData.isEdit"
		:detail-data="detailData"
		:handle-submit="handleSubmit"
		:type="type"
	>
		<div class="c-outline-help-leader-info">
			<div v-if="detailData.isEdit || detailData.record_status == 1">
				<i-form 
					ref="formValidate" 
					:model="formValidate" 
					:rules="ruleValidate" 
					:label-width="110"
					class="g-m-t-15 g-pd-l-15"
					@submit.native.prevent
				>
					<i-form-item label="入职时间：" style="margin-top: -5px">
						<span>{{ formValidate.entry_date }}</span>
					</i-form-item>

					<i-form-item label="课程类型：" style="margin-top: -20px">
						<span>{{ formValidate.lecture_set_name }}</span>
					</i-form-item>

					<i-form-item label="累计学习数：" style="margin-top: -20px">
						<span>{{ formValidate.learning_times }}次</span>
					</i-form-item>

					<i-form-item 
						label="本次是否计数："
						style="margin: -20px 0"
						prop="is_count">
						<i-radio-group v-model="formValidate.is_count">
							<i-radio :label="1">是</i-radio>
							<i-radio :label="0">否</i-radio>
						</i-radio-group>
					</i-form-item>

					<i-form-item label="师傅：" style="margin: -15px 0 5px 0!important">
						<span>{{ formValidate.master_name }}</span>
					</i-form-item>

					<i-form-item 
						prop="docking_time" 
						label="对接时间："
					>
						<i-data-picker 
							v-model="formValidate.docking_time"
							format="yyyy-MM-dd"
							type="daterange"
							split-panels
							transfer
							separator=" 至 "
							style="width: 300px;"
							placeholder="请选择对接时间"
						/>
					</i-form-item>

					<i-form-item 
						label="是否出差："
						style="margin: -10px 0"
						prop="is_count"
					>
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
						<span class="g-c-black2 g-absolute __tip">天</span>
					</i-form-item>

					<i-form-item label="备注：">
						<oa-limit-words
							v-model="formValidate.remark" 
							:max="200" 
							width="300px"
							placeholder="请输入备注"
						/>
					</i-form-item>

					<i-form-item label="记录时间：" style="margin-top: -10px" class="g-pd-b-10">
						<span>{{ formValidate.update_time }}</span>
					</i-form-item>
				</i-form>
			</div>

			<oa-basic-info
				v-else
				:display-info="outlineHelpLeaderInfo"
				:detail-data="detailDataParse"
				:role_type="detailData.role_type"
			/>
		</div>
	</oa-basic-expand>
</template>

<script>
import AutoToolTip from "@common/auto-tooltip/auto-tooltip";
import { Row, Col, Form, FormItem, Input, DatePicker,
	RadioGroup, Radio, InputNumber } from 'iview';
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { Confirm } from "@components/_common/confirm/confirm";
import BasicExpand from "./basic-expend";
import { STATUS, outlineHelpLeaderInfo } from './constants';
import BasicInfoDisplay from './basic-info-display';
import { OutlineHelpLeaderModal } from '../popup/outline-modal/outline-help-leader-modal';
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
		'i-data-picker': DatePicker,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-input-number': InputNumber,
		'oa-operate-item': OperateItem
	},
	props: {
		detailData: {
			type: Object,
			required: true,
			default() {
				return {
					show: true,
					isEdit: false,
				};
			}
		},
		loadData: {
			type: Function,
			required: true
		},
		authType: {
			type: Number,
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
			outlineHelpLeaderInfo,
			formValidate: {
				entry_date: this.detailData.entry_date || '--',
				lecture_set_name: this.detailData.lecture_set_name,
				learning_times: this.detailData.learning_times || 0,
				is_count: +this.detailData.is_count === 0 ? 0 : 1,
				master_name: this.detailData.master_name || '--',
				docking_time: JSON.parse(this.detailData.docking_time || '[]'),
				remark: this.detailData.remark,
				is_business: +this.detailData.is_business === 0 ? 0 : 1,
				business_day: +this.detailData.business_day || null,
				update_time: this.detailData.update_time || '--'
			},
			ruleValidate: {
				is_count: [{ required: true, type: 'number', message: '请填写', trigger: 'change' }],
				business_day: [{ required: true, type: 'number', message: '请输入出差天数', trigger: 'blur' }],
				docking_time: [{ validator: validateCreatedTime, trigger: 'change', required: true, message: '请选择对接时间' }]
			}
		};
	},
	computed: {
		detailDataParse() {
			return ({
				...this.detailData,
				entry_date: this.detailData.entry_date || '--',
				learning_times: this.detailData.learning_times + '次',
				is_count: +this.detailData.is_count ? '是' : '否',
				master_name: this.detailData.master_name || '--',
				docking_time: JSON.parse(this.detailData.docking_time || '[]').join(' 至 '),
				is_business: +this.detailData.is_business ? '是' : '否',
				business_day: this.detailData.business_day + '天',
				remark: this.detailData.remark || '--' 
			});
		}
	},
	watch: {
		'detailData.isEdit': function (newVal, oldVal) {
			// if (newVal) {
			// 	const {
			// 	entry_date, lecture_set_name, docking_time,
			// 	learning_times, is_count, master_name,
			// 	remark, is_business, business_day
			// } = this.detailData;
			// }
			const {
				entry_date, lecture_set_name, docking_time,
				learning_times, is_count, master_name,
				remark, is_business, business_day
			} = this.detailData;
			
			this.formValidate = {
				entry_date: entry_date || '--',
				lecture_set_name,
				learning_times: +learning_times,
				is_count: +is_count,
				master_name: master_name || '--',
				docking_time: JSON.parse(docking_time || '[]'),
				remark,
				is_business: +is_business,
				business_day: +business_day,
			};
		}
	},
	methods: {
		handleSubmit() {
			if ([1, 2].indexOf(this.authType) > -1 && [2, 5, 6].indexOf(this.detailData.record_status) > -1) {
				Confirm.popup({
					title: "",
					msg: "由于您是审核人，提交后数据状态将变为已通过，是否确定？",
					showIcon: true
				}).then(() => {
					this.$refs.formValidate.validate(valid => {
						if (valid) {
							this.handleSend();
						}
					});
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			} else {
				this.$refs.formValidate.validate(valid => {
					if (valid) {
						this.handleSend();
					}
				});
			}
		},
		handleSend() {
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
				this.$Message.error(err.msg);
			});
		}
		// handleAudit() {
		// 	OutlineHelpLeaderModal.popup({
		// 		detailData: this.detailData
		// 	}).then(() => {
		// 		this.loadData();
		// 	});
		// }
	}
};
</script>

<style lang="scss">
.c-outline-help-leader-info {
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
