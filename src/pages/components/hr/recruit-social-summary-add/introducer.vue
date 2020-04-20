<template>
	<i-form-item label="转介绍人:" prop="introducer_id">
		<i-select
			ref="introducer"
			v-model="formValidate.introducer_id"
			:remote-method="loadIntroducer"
			:loading="introducerLoading"
			style="width: 300px;"
			filterable
			remote
			clearable
			transfer
			label-in-value
			placeholder="请选择转介绍人"
			@on-change="handleChange"
			@on-query-change="handleQueryChange"
		>
			<i-option
				v-for="(item, index) in introducerData"
				:key="index"
				:value="item.value"
			>{{ item.label }}</i-option>
		</i-select>
	</i-form-item>
</template>

<script>
import {
	FormItem, Select, Option
} from 'iview';
import { createSearch } from '@stores/services/hr';

export default {
	name: 'v-tpl',
	components: {
		'i-select': Select,
		'i-option': Option,
		'i-form-item': FormItem
	},
	mixins: [createSearch({ key: 'introducer' })],
	props: {
		formValidate: Object
	},
	data() {
		return {
			introducer: ''
		};
	},
	methods: {
		handleQueryChange(query = '') {
			let targetQuery = this.formValidate['introducer_name'] || '';
			if (targetQuery.length > query.length) {
				this.$refs.introducer.clearSingleSelect();
			}
		},
		handleChange(value) {
			this.formValidate.introducer_id = value && String(value.value) ? value.value : '';
			this.formValidate.introducer_name = value && value.label ? value.label : '';
		}
	}
};
</script>
