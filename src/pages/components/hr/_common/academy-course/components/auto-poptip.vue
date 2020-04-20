<template>
	<div class="g-dp-ib v-hr-academy-course-auto-poptip">
		<i-poptip 
			v-if="data.length>1" 
			:placement="placement" 
			popper-class="v-hr-academy-course-auto-poptip"
			trigger="hover" 
			transfer >
			<span class="g-operation">{{ data[0][labelKey] }}、...</span>
			<div slot="content" >
				<div v-for="(item,index) in data" :key="index" class="g-c-black2 g-tl">
					{{ item[labelKey] }}
				</div>
			</div>
		</i-poptip>
		<span v-else-if="data.length==1" class="g-c-black2" >{{ data[0][labelKey] }}</span>
		<span v-else>--</span>
	</div>
</template>
<script>
import { Input, Button, Poptip } from 'iview';

export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-poptip': Poptip
	},
	props: {
		data: {
			type: Array,
			default: () => []
		},
		labelKey: String,
		placement: {
			type: String,
			default: 'top'
		}
	},
	data() {
		return {
		};
	},
	methods: {
	}
};
</script>
<style lang="scss">
.v-hr-academy-course-auto-poptip {
	min-width: 80px;
}
</style>