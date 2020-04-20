<template>
	<div>
		<div v-if="edit">
			<i-form-item
				:label="label"
				:rules="rules"
				:prop="prop">
				<slot />
			</i-form-item>
		</div>
		<i-form-item v-else :label="label">
			<span>{{ info }}</span>
		</i-form-item>
	</div>
</template>

<script>
import { FormItem } from 'iview';
import moment from 'moment';

export default {
	name: 'resume-formitem',
	components: {
		'i-form-item': FormItem
	},
	props: {
		label: String,
		prop: String,
		rules: Object | Array,
		edit: Boolean,
		format: String,
		content: String | Number
	},
	computed: {
		info() {
			if (this.content == "") {
				return '--';
			} else if (this.content instanceof Date) {
				return moment(this.content).format(this.format || 'YYYY-MM-DD');
			} else {
				return this.content;
			}
		}
	}
};
</script>
