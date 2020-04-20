<template>
	<div class="v-recruit-social-detail-interview">
		<div
			:class="disabled ? 'g-m-t-30' : 'g-m-b-20'"
			class="__title"
		>
			{{ rounds[index] }}
		</div>
		<div class="g-flex g-fw-w g-jc-sb">
			<oa-form-item
				:disabled="disabled"
				:value="info.interviewer_name"
				:prop="propId"
				:rules="rules.interviewer_ids"
				label="面试官"
			>
				<i-select
					ref="interviewer"
					v-model="info.interviewer_ids"
					style="width: 300px;"
					multiple
					filterable
					clearable
					transfer
					placeholder="请选择面试官"
					@on-change="handleChange($event, 'interviewer_ids')"
					@on-query-change="handleQueryChange"
				>
					<i-option
						v-for="(staff, index) in staffData"
						:key="index"
						:value="staff.value"
					>{{ staff.label }}</i-option>
				</i-select>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.interview_time"
				:prop="propInterview"
				:rules="rules.interview_time"
				label="实际面试时间"
			>
				<i-date-picker
					:value="info.interview_time"
					type="datetime"
					format="yyyy-MM-dd HH:mm"
					style="width: 300px;"
					placeholder="请选择实际面试时间"
					@on-change="handleChange($event, 'interview_time')"
				/>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.result_name"
				:prop="propResult"
				:rules="rules.result"
				label="面试结果"
			>
				<i-select
					v-model="info.result"
					style="width: 300px"
					clearable
					transfer
					placeholder="请选择面试结果"
				>
					<i-option
						v-for="(result, index) in results"
						:key="index"
						:value="result.value"
					>
						{{ result.label }}
					</i-option>
				</i-select>
			</oa-form-item>
			<oa-form-item
				v-if="disabled"
				:disabled="true"
				:customer="true"
				:value="info.result_name"
				label="面试记录单"
			>
				<!-- eslint-disable -->
				<router-link
					v-if="info.is_uploading == 1"
					:to="`/hr/recruit/social/summary/interview-read-only?applicant_id=${applicantId}&interview_id=${info.interview_id}&staff_template_id=${info.staff_template_id}`"
					class="g-operation">
					已上传
				</router-link>
				<span v-else>未上传</span>
				<!-- eslint-enable -->
			</oa-form-item>
		</div>
	</div>
</template>

<script>
import {
	Select, Option, DatePicker
} from 'iview';
import { createSearch } from '@stores/services/hr';
import API_ROOT from "@stores/apis/root";
import { initTreeData } from "@utils/utils";
import OAFormItem from './form-item';

export default {
	name: 'recruit-social-detail-form-interview',
	components: {
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'oa-form-item': OAFormItem,
	},
	mixins: [
		createSearch({ key: 'interviewer' })
	],
	props: {
		applicantId: Number,
		index: Number,
		disabled: Boolean,
		propId: String,
		propResult: String,
		propInterview: String,
		rules: Object,
		info: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			interviewer: this.info.interviewer_name,
			staffData: [],
			result: [
				{ label: '待定中', value: 0 },
				{ label: '通过', value: 1 },
				{ label: 'Pass', value: 2 }
			],
			rounds: {
				'0': '一面',
				'1': '二面',
				'2': '三面',
				'3': '四面',
			},
			results: [
				{ label: '待定中', value: 0 },
				{ label: '通过', value: 1 },
				{ label: 'Pass', value: 2 }
			],
		};
	},
	mounted() {
		this.loadStaffData();
	},
	methods: {
		loadStaffData() {
			this.$request({
				url: API_ROOT._HR_STAFF_GET,
				type: "GET",
				param: {
					name: ""
				},
				loading: false
			}).then(res => {
				this.staffData = initTreeData(res.data, "value", "text");
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleQueryChange(query = '') {
			let targetQuery = this.info.interviewer_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.interviewer.clearSingleSelect();
			}
		},
		handleChange(value, type) {
			if (type === 'interviewer_ids') {
				// this.info.interviewer_ids = value && value.value ? value.value : [];
				// this.info.interviewer_name = value && value.label ? value.label : [];
			} else {
				this.info[type] = value;
			}
		},
	}
};
</script>

<style lang="scss">
.v-recruit-social-detail-interview {
	width: 100%;
	._title {
		font-size: 14px;
		color: #333333;
		padding-left: 10px;
		border-left: 2px solid #e84854;
		line-height: 14px;
	}
}
</style>


