<template>
	<div class="g-dp-ib v-auto-poptip">
		<i-poptip 
			v-if="data.length>1" 
			:placement="placement" 
			popper-class="v-auto-poptip"
			trigger="hover" 
			transfer >
			<span class="g-operation">{{ data[0][labelKey] }}、...</span>
			<div slot="content" >
				<div v-for="(item,index) in data" :key="index" :class="labelClass" class="g-tl">
					{{ item[labelKey] }}
				</div>
			</div>
		</i-poptip>
		<span v-else-if="data.length==1" :class="labelClass" >{{ data[0][labelKey] }}</span>
		<span v-else>--</span>
	</div>
</template>
<script>
import { Poptip } from 'iview';

export default {
	name: 'oa-',
	components: {
		'i-poptip': Poptip
	},
	props: {
		data: {
			type: Array,
			default: () => []
		},
		labelKey: {
			type: String,
			default: 'label'
		},
		labelClass: {
			type: String,
			default: 'g-c-black2'
		},
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
.v-auto-poptip {
	min-width: 80px;
}
</style>