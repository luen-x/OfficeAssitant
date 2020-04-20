<template>
	<i-select
		:value="value"
		:placeholder="placeholder"
		clearable
		transfer
		style="width: 120px;"
		@on-change="handleSelectChange">
		<i-option
			v-for="item in list"
			:key="item.value"
			:value="item.value">
			{{ item.label }}
		</i-option>
	</i-select>
</template>

<script>
import { Select, Option } from 'iview';
import { services, interResultList, workTime } from '@stores/services/hr';

export default {
	components: {
		'i-select': Select,
		'i-option': Option
	},
	mixins: [
		interResultList,
		workTime,
		services.education(),
		services.ditches()
	],
	props: {
		value: Number,
		index: Number,
		name: String,
		change: Function
	},
	data() {
		return {
			placeholder: '',
			sexList: [
				{ label: '男', value: 0 },
				{ label: '女', value: 1 }
			]
		};
	},
	computed: {
		list() {
			if (this.name === 'education') {
				return this.education;
			} else if (this.name === 'sex') {
				return this.sexList;
			} else if (this.name === 'interview_result') {
				return this.interResultList;
			} else if (this.name === 'work_time') {
				return this.workTime;
			} else if (this.name === 'ditch') {
				return this.ditches;
			}
		}
	},
	mounted() {
		if (this.name === 'education') {
			this.placeholder = '请选择学历';
		} else if (this.name === 'sex') {
			this.placeholder = '请选择性别';
		} else if (this.name === 'interview_result') {
			this.placeholder = '请选择面试结果';
		} else if (this.name === 'work_time') {
			this.placeholder = '请选择工作年限';
		} else if (this.name === 'ditch') {
			this.placeholder = '请选择招聘渠道';
		}
	},
	methods: {
		handleSelectChange(val) {
			this.change(val, this.index, this.name);
		}
	}
};
</script>

