<template>
	<!-- :handle-audit="handleAudit" -->
	<oa-basic-expand 
		v-model="detailData.isEdit"
		:detail-data="detailData"
		:handle-submit="handleSubmit"
		:type="type"
	>
		<div class="c-outline-sound-info">

			<div v-if="detailData.isEdit || detailData.record_status == 1">
				<i-form 
					ref="formValidate" 
					:model="formValidate" 
					:rules="ruleValidate" 
					:label-width="100"
					class="g-m-t-15 g-pd-l-15"
					@submit.native.prevent>
					<oa-common-form-item 
						:form-validate = "formValidate"
						:detail-data="detailData"/>

				</i-form>
			</div>
			<oa-basic-info
				v-else
				:display-info="outlineSoundInfo"
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
import { Confirm } from "@components/_common/confirm/confirm";
import BasicExpand from "./basic-expend";
import { STATUS, outlineSoundInfo } from './constants';
import BasicInfoDisplay from './basic-info-display';
import { OutlineCommonModal } from '../popup/outline-modal/outline-common-modal';
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
		'oa-common-form-item': commonFormItem
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
			outlineSoundInfo,
			formValidate: {
				lecture_set_name: this.detailData.lecture_set_name,
				time: JSON.parse(this.detailData.voice_time || '[[null, null]]'),
				is_business: this.detailData.is_business === undefined ? 1 : +this.detailData.is_business,
				business_day: this.detailData.business_day === undefined ? null : +this.detailData.business_day,
				remark: this.detailData.remark,
				update_time: this.detailData.update_time || '--'
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
				is_business: +this.detailData.is_business ? '是' : '否',
				business_day: this.detailData.business_day + '天',
				remark: this.detailData.remark || '--',
				voice_time: this.handleFormatTime(this.detailData.voice_time)
			});
		}
	},
	watch: {
		'detailData.isEdit': function (newVal, oldVal) {
			if (newVal) {
				const {
					lecture_set_name, is_business, business_day,
					voice_time, remark
				} = this.detailData;
				this.formValidate = {
					lecture_set_name,
					is_business: +is_business,
					business_day: +business_day,
					remark,
					time: JSON.parse(voice_time)
				};
			}
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
			this.$request({
				url: API_ROOT._COLLEAGE_RECORD_LESSON_RECORD_ADD,
				type: "POST",
				param: {
					record_id: this.detailData.record_id,
					lesson_type: this.detailData.lesson_type,
					...this.formValidate,
					voice_time: JSON.stringify(this.handleFormatDateToStr(this.formValidate.time))
				}
			}).then((res) => {
				return this.loadData();
			}).then(() => {
				this.detailData.isEdit = false;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleFormatDateToStr(time) {
			return time.map(
				timeArr => timeArr.map(
					date => date && moment(date).format("YYYY-MM-DD")
				)
			);
		},
		handleFormatTime(voiceTime) {
			const parseTime = JSON.parse(voiceTime);
			return parseTime.reduce(
				(init, cur) => {
					const result = init + cur.join(' 至 ') + ';  ';
					return result;
				}, 
				''
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
.c-outline-sound-info {
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
