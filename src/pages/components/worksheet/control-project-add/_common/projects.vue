<template>
	<div class="v-wroksheet-control-projects g-flex">
		<oa-project-module 
			v-model="index1" 
			:list="list1" 
			:disabled="disabled"
			:system-id="systemId"
			:parent-module-id="0"
			:parent-staff-id="''"
			level="1"
		/>
		<oa-project-module 
			v-if="list1 && list1.length"
			v-model="index2" 
			:list="list2" 
			:disabled="disabled"
			:system-id="systemId"
			:parent-module-id="list1[index1] && list1[index1].module_id"
			:parent-staff-id="list1[index1] && list1[index1].staff_id"
			level="2"
		/>
		<oa-project-module  
			v-if="list2 && list2.length"
			v-model="index3" 
			:list="list3" 
			:disabled="disabled"
			:system-id="systemId"
			:parent-module-id="list2[index2] && list2[index2].module_id"
			:parent-staff-id="list2[index2] && list2[index2].staff_id"
			level="3"
		/>
	</div>
</template>
<script>
import ProjectModule from './project-module';

export default {
	name: 'oa-worksheet-projects',
	components: {
		'oa-project-module': ProjectModule
	},
	props: {
		dataSource: {
			type: Array,
			default: () => []
		},
		disabled: {
			type: Boolean,
			default: false
		},
		systemId: [String, Number]
	},
	data() {
		return {
			index1: 0,
			index2: 0,
			index3: 0
		};
	},
	computed: {
		list1() {
			return this.dataSource;
		},
		list2() {
			return (this.list1[this.index1] && this.list1[this.index1].child);
		},
		list3() {
			return (this.list2[this.index2] && this.list2[this.index2].child);
		}
	},
	watch: {
		index1() {
			this.index2 = 0;
		},
		index2() {
			this.index3 = 0;
		},
	}
};

export const worksheetProjectModule = module.exports.default;
</script>
<style lang="scss">

</style>
