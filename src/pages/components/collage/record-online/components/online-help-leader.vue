<template>
	<!-- :handle-audit="handleAudit" -->
	<oa-basic-expand 
		v-model="detailData.isEdit"
		:detail-data="detailData"
		:handle-submit="handleSubmit"
		:type="type"
	>
		<div class="c-online-help-leader-info">
			<div v-if="detailData.isEdit || detailData.record_status == 1">
				<i-form 
					ref="formValidate" 
					:model="formValidate" 
					:rules="ruleValidate" 
					:label-width="120"
					class="g-m-t-15 g-pd-l-15"
					@submit.native.prevent
				>
					<i-form-item
						v-if="detailData.audit_remark"
						label="上次驳回理由：" 
						style="margin-top: -5px"
					>
						<span>{{ detailData.audit_remark }}</span>
					</i-form-item>
					
					<i-form-item 
						:style="{'margin-top': detailData.audit_remark ? '-20px' : '-5px'}" 
						label="入职时间："
					>
						<span>{{ formValidate.entry_date }}</span>
					</i-form-item>

					<i-form-item label="套系名称：" class="l-m-t-20">
						<span>{{ formValidate.lecture_set_name }}</span>
					</i-form-item>

					<i-form-item label="累计学习数：" class="l-m-t-20">
						<span>{{ formValidate.learning_times }}次</span>
					</i-form-item>

					<i-form-item 
						label="本次是否计数："
						class="l-m-t-20"
						prop="is_count"
					>
						<i-radio-group v-model="formValidate.is_count">
							<i-radio :label="1">是</i-radio>
							<i-radio :label="0">否</i-radio>
						</i-radio-group>
					</i-form-item>

					<i-form-item label="师傅：" class="l-m-t-20">
						<span>{{ formValidate.master_name }}</span>
					</i-form-item>

					<i-form-item 
						label="对接时间：" 
						prop="docking_time"
						class="l-m-t-20"
					>
						<i-data-picker 
							v-model="formValidate.docking_time"
							type="daterange"
							format="yyyy-MM-dd"
							split-panels
							transfer
							separator=" 至 "
							style="width: 300px"
							placeholder="请选择对接时间"
						/>
					</i-form-item>

					<i-form-item 
						label="备注："
						style="margin-top: -2px"
					>
						<oa-limit-words
							v-model="formValidate.remark" 
							:max="200" 
							width="300px"
							placeholder="请输入备注"
						/>
					</i-form-item>

					<i-form-item  
						label="记录时间：" 
						class="g-pd-b-10"
					>
						<span>{{ formValidate.update_time }}</span>
					</i-form-item>
				</i-form>
			</div>

			<oa-basic-info
				v-else
				:display-info="onlineHelpLeaderInfo"
				:detail-data="detailDataParse"
				:role_type="detailData.role_type"
			/>
		</div>
	</oa-basic-expand>
</template>

<script>
import AutoToolTip from "@common/auto-tooltip/auto-tooltip";
import { Row, Col, Form, FormItem, Select, Option, 
	Input, DatePicker, RadioGroup, Radio, InputNumber } from 'iview';
import API_ROOT from '@stores/apis/root';
import moment from 'moment';
import { Confirm } from "@components/_common/confirm/confirm";
import BasicExpand from "./basic-expend";
import { STATUS, onlineHelpLeaderInfo } from './constants';
import BasicInfoDisplay from './basic-info-display';
import { OnlineHelpLeaderMOdal } from '../popup/online-audit/online-help-leader-modal';

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
	},
	props: {
		detailData: {
			type: Object,
			required: true,
			default() {
				return {
					show: true,
					isEdit: false,
					record_status: 1
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
			onlineHelpLeaderInfo,
			formValidate: {
				audit_remark: this.detailData.audit_remark || '--',
				entry_date: this.detailData.entry_date || '--',
				lecture_set_name: this.detailData.lecture_set_name,
				learning_times: this.detailData.learning_times || 0,
				master_name: this.detailData.master_name || '--',
				is_count: Number(this.detailData.is_count) === 0 ? 0 : 1,
				docking_time: JSON.parse(this.detailData.docking_time || '[]'),
				remark: this.detailData.remark || '',
				update_time: this.detailData.update_time || '--'
			},
			ruleValidate: {
				// position: [{ required: true, type: 'number', message: '请选择职位', trigger: 'change' }],
				docking_time: [{ validator: validateCreatedTime, trigger: 'change', required: true, message: '请选择对接时间' }],
				is_count: [{ required: true, type: 'number', message: '请填写本次是否计数', trigger: 'change' }],
			}
		};
	},
	computed: {
		canEdit() {
			return true;
		},
		detailDataParse() {
			return ({
				...this.detailData,
				remark: this.detailData.remark || '--',
				is_count: Number(this.detailData.is_count) ? '是' : '否',
				docking_time: JSON.parse(this.detailData.docking_time).join('至'),
				learning_times: this.formValidate.learning_times + '次'
			});
		}
	},
	watch: {
		'detailData.isEdit': function (newVal, oldVal) {
			if (newVal) {
				const {
					entry_date, lecture_set_name, learning_times,
					master_name, is_count, docking_time = '[]', remark,
					update_time
				} = this.detailData;
				this.formValidate = {
					entry_date: entry_date || '--', 
					lecture_set_name,
					learning_times,
					master_name: master_name || '--',
					is_count: +(is_count),
					docking_time: JSON.parse(docking_time),
					remark,
					update_time: update_time || '--'
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
			}).then(() => {
				return this.loadData();
			}).then((res) => {
				this.detailData.isEdit = false;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
		// handleAudit() {
		// 	OnlineHelpLeaderMOdal.popup({
		// 		detailData: this.detailData
		// 	}).then((() => {
		// 		this.loadData();
		// 	})).catch(err => {});
		// }
	}
};
</script>

<style lang="scss">
.c-online-help-leader-info {
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
    .l-m-t-20 {
        margin-top: -20px
    }
}
</style>