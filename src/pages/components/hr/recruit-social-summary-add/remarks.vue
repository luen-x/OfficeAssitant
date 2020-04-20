<template>
	<i-form-item label="招聘备注:" prop="ditch_remarks">
		<i-input 
			v-model="formValidate.ditch_remarks" 
			style="width: 300px"
			placeholder="请输入备注" 
		/>
	</i-form-item>
</template>

<script>
import { 
	FormItem, Input
} from 'iview';

export default {
	name: 'v-tpl',
	components: {
		'i-input': Input,
		'i-form-item': FormItem
	},
	props: {
		formValidate: Object
	},
	data() {
		return {
		};
	},
};
</script>