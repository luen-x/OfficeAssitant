<template>
	<!-- :handle-audit="handleAudit" -->
	<oa-basic-expand 
		v-model="detailData.isEdit"
		:detail-data="detailData"
		:handle-submit="handleSubmit"
		:type="type"
	>
		<div class="c-online-leader-info">
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

					<i-form-item label="套系名称：" style="margin: -10px 0">
						<span>{{ formValidate.lecture_set_name }}</span>
					</i-form-item>

					<i-form-item 
						label="对接时间：" 
						prop="docking_time"
						style="margin-top: -15px">
						<i-data-picker 
							v-model="formValidate.docking_time"
							format="yyyy-MM-dd"
							type="daterange"
							split-panels
							transfer
							separator=" 至 "
							style="width: 300px"
							placeholder="请选择对接时间"/>
					</i-form-item>

					<i-form-item 
						label="备注：">
						<oa-limit-words
							v-model="formValidate.remark" 
							:max="200" 
							width="300px"
							placeholder="请输入备注"
						/>
					</i-form-item>

					<i-form-item   
						label="记录时间：" 
						class="g-pd-b-10">
						<span>{{ formValidate.update_time }}</span>
					</i-form-item>

				</i-form>
			</div>
			
			<oa-basic-info
				v-else
				:display-info="onlineLeaderInfo"
				:detail-data="detailDataParse"
				:role_type="detailData.role_type"
			/>
		</div>
	</oa-basic-expand>
</template>

<script>
import AutoToolTip from "@common/auto-tooltip/auto-tooltip";
import { Row, Col, Form, FormItem, Select, Option, Input, DatePicker } from 'iview';
import API_ROOT from '@stores/apis/root';
import moment from 'moment';
import BasicExpand from "./basic-expend";
import { STATUS, onlineLeaderInfo, POSITION_ENUM } from './constants';
import BasicInfoDisplay from './basic-info-display';

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
	},
	props: {
		detailData: {
			type: Object,
			required: true,
			default() {
				return {
					show: true,
					isEdit: false,
					record_status: 1,
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
			POSITION_ENUM,
			onlineLeaderInfo,
			formValidate: {
				position: this.detailData.customer_position || '',
				lecture_set_name: this.detailData.lecture_set_name,
				docking_time: '',
				remark: '',
				update_time: this.detailData.update_time || '--'
			},
			ruleValidate: {
				position: [{ required: true, type: 'number', message: '请选择职位', trigger: 'change' }],
				docking_time: [{ validator: validateCreatedTime, trigger: 'change', required: true, message: '请选择对接时间' }]
			}
		};
	},
	computed: {
		detailDataParse() {
			return ({
				...this.detailData,
				docking_time: JSON.parse(this.detailData.docking_time).join(' 至 '),
				remark: this.detailData.remark || '--',
				position: this.POSITION_ENUM.filter(v => v.value == this.detailData.position)[0].label
			});
		}
	},
	watch: {
		'detailData.isEdit': function (newVal, oldVal) {
			if (newVal) {
				const {
					position, 
					lecture_set_name,
					docking_time = '',
					remark, update_time
				} = this.detailData;
				this.formValidate = {
					position: +position,
					lecture_set_name,
					docking_time: JSON.parse(docking_time),
					remark,
					update_time: update_time || '--'
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
						this.detailData.record_status == 1 
							&& this.$Message.success('课程信息已提交审核，请及时上传交付表哦。');
						return this.loadData();
					}).then(() => {
						this.detailData.isEdit = false;
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				} 
			});
		},
		// handleAudit() {
		// 	() => {};
		// },
	}
};
</script>

<style lang="scss">
</style>