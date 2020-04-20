<template>
	<!-- :handle-audit="handleAudit" -->
	<oa-basic-expand 
		v-model="detailData.isEdit"
		:detail-data="detailData"
		:handle-submit="handleSubmit"
		:type="type"
	>
		<div class="c-outline-host-info">

			<div v-if="detailData.isEdit || detailData.record_status == 1">
				<i-form 
					ref="formValidate" 
					:model="formValidate" 
					:rules="ruleValidate" 
					:label-width="100"
					class="g-m-t-15 g-pd-l-15"
					@submit.native.prevent>

					<oa-common-form-item 
						ref="commonForm"
						:form-validate = "formValidate"
						:detail-data="detailData"/>

					<!-- <i-form-item label="课程类型：" style="margin: 0px 0 10px 0!important">
						<span>{{ formValidate.course_type }}</span>
					</i-form-item>

					<i-form-item 
						v-for="(item, i) in formValidate.time"
						:key="i"
						:prop="'time.' + i " 
						:rules="{ validator: validateCreatedTime, trigger: 'change', required: true, message: '请选择对接时间' }"
						label="主持时间：">
						<i-data-picker 
							v-model="formValidate.time[i]"
							format="yyyy-MM-dd"
							type="datetimerange"
							split-panels
							transfer
							separator=" 至 "
							style="width: 300px;"
							placeholder="请选择对接时间"/>
                            
						<oa-operate-item 
							:can-add="formValidate.time.length < 10"
							:can-remove="formValidate.time.length > 1"
							:handle-add="() => formValidate.time.push([null, null])"
							:handle-remove="() => formValidate.time.splice(i, 1)"
							top="2px"
							left="310px"/>

					</i-form-item>

					<i-form-item label="主持天数：" style="margin-top: -10px">
						<span>{{ chargeDay }}</span>
					</i-form-item>

					<i-form-item 
						label="是否出差："
						style="margin-top: -20px"
						prop="is_valid">
						<i-radio-group v-model="formValidate.is_out">
							<i-radio :label="1">是</i-radio>
							<i-radio :label="0">否</i-radio>
						</i-radio-group>
					</i-form-item>

					<i-form-item 
						v-if="formValidate.is_out"
						prop="out_day" 
						label="出差天数：" 
						style="margin: -10px 0"
					>
						<i-input-number
							v-model="formValidate.out_day" 
							:min="1"
							:precision="0"
							:max="9"
							clearable
							style="width: 300px"
							placeholder="请输入可参与抽奖的人数"
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
					</i-form-item> -->

					<i-form-item 
						label="记录时间：" 
						style="margin-top: -30px" 
						class="g-pd-b-10">
						<span>{{ formValidate.update_time }}</span>
					</i-form-item>

				</i-form>
			</div>

			<oa-basic-info
				v-else
				:display-info="outlineHostInfo"
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
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { Confirm } from "@components/_common/confirm/confirm";
import BasicExpand from "./basic-expend";
import { STATUS, outlineHostInfo } from './constants';
import BasicInfoDisplay from './basic-info-display';
import { OutlineCommonModal } from '../popup/outline-modal/outline-common-modal';
import OperateItem from './operate-item';
import commonFormItem from './common-formitem';

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
		'oa-operate-item': OperateItem,
		'oa-common-form-item': commonFormItem
	},
	props: {
		detailData: {
			type: Object,
			// required: true,
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
		this.validateCreatedTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择对接时间');
			} else {
				callback();
			}
		};
		return {
			STATUS,
			outlineHostInfo,
			formValidate: {
				lecture_set_name: this.detailData.lecture_set_name || '--',
				time: JSON.parse(this.detailData.hosting_time || '[[null, null]]'),
				is_business: this.detailData.is_business === undefined ? 1 : +this.detailData.is_business,
				business_day: this.detailData.business_day === undefined ? null : +this.detailData.business_day,
				remark: this.detailData.remark,
				update_time: this.detailData.update_time || '--',

			},
			ruleValidate: {
				business_day: [{ required: true, type: 'number', message: '请输入出差天数', trigger: 'blur' }],
				is_business: [{ required: true, type: 'number' }]
			}
		};
	},
	computed: {
		detailDataParse() {
			return ({
				...this.detailData,
				staff_num: this.detailData.staff_num + '人',
				is_business: +this.detailData.is_business ? '是' : '否',
				remark: this.detailData.remark,
				hosting_time: this.handleFormatTime(this.detailData.hosting_time),
				hosting_day: this.detailData.hosting_day + '天',
				business_day: this.detailData.business_day + '天'
			});
		}
	}, 
	watch: {
		'detailData.isEdit': function (newVal, oldVal) {
			if (newVal) {
				const {
					lecture_set_name, is_business, business_day,
					hosting_time, remark
				} = this.detailData;
			}
			this.formValidate = {
				lecture_set_name,
				is_business: +is_business,
				business_day: +business_day,
				remark,
				time: JSON.parse(this.detailData.hosting_time),
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
			if (!this.handleCheckTimeValid()) {
				this.$Message.error('主持时间请勿重复');
				return false;
			}

			this.$request({
				url: API_ROOT._COLLEAGE_RECORD_LESSON_RECORD_ADD,
				type: "POST",
				param: {
					record_id: this.detailData.record_id,
					lesson_type: this.detailData.lesson_type,
					...this.formValidate,
					hosting_time: JSON.stringify(this.handleFormatDateToStr(this.formValidate.time)),
					hosting_day: this.$refs.commonForm.chargeDay
				}
			}).then((res) => {
				return this.loadData();
			}).then(() => {
				this.detailData.isEdit = false;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleCheckTimeValid() {
			const { time } = this.formValidate;
			let result = true;
			for (let i = 1; i < time.length; i++) {
				if (time[i][0] <= time[i - 1][1]) {
					result = false;
				}
			}
			return result;
		},
		handleFormatTime(hostTime) {
			const parseTime = JSON.parse(hostTime);
			return parseTime.reduce(
				(init, cur) => {
					const result = init + cur.join(' 至 ') + ';  ';
					return result;
				}, 
				''
			);
		},
		handleFormatDateToStr(time) {
			return time.map(
				timeArr => timeArr.map(
					date => date && moment(date).format("YYYY-MM-DD")
				)
			);
		}
		// handleAudit() {
		// 	OutlineCommonModal.popup({
		// 		detailData: this.detailData
		// 	}).then(() => {
		// 		this.loadData();
		// 	});
		// }
	}
};
</script>

<style lang="scss">
.c-outline-host-info {
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
