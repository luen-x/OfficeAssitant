<template>
	<i-select
		ref="staff"
		:value="value"
		:remote-method="loadStaff"
		:loading="staffLoading"
		:placeholder="placeholder"
		style="width: 196px;"
		filterable
		remote
		clearable
		transfer
		label-in-value
		@on-change="handleChange"
		@on-query-change="handleQueryChange"
	>
		<i-option
			v-for="(item, index) in staffData"
			:key="index"
			:value="item.value"
		>{{ item.label }}</i-option>
	</i-select>
</template>

<script>
import { Select, Option } from 'iview';
import { createSearch } from '@stores/services/hr';

export default {
	components: {
		'i-select': Select,
		'i-option': Option
	},
	mixins: [
		createSearch({ key: 'staff' })
	],
	props: {
		value: Number,
		index: Number,
		name: String,
		initName: String,
		change: Function
	},
	data() {
		return {
			placeholder: '',
			staff_name: '',
			staff_id: this.value,
			staff: this.initName
		};
	},
	computed: {
		list() {
			if (this.name === 'introducer') {
				return this.staffData;
			}
		}
	},
	mounted() {
		if (this.name === 'introducer') {
			this.placeholder = '请输入转介绍人';
		}
	},
	methods: {
		handleChange(value) {
			this.staff_name = value && value.label ? value.label : '';
			this.staff_id = value && value.value ? value.value : undefined;
			this.change(this.staff_id, this.index, this.name);
		},
		handleQueryChange(query = '') {
			let targetQuery = this.staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		}
	}
};
</script>

