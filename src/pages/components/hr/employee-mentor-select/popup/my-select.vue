<template>
	<div>
		<i-select 
			:value="selectVal" 
			:disabled="(type==='3'||operate===0)||type==='4'?true:false" 
			transfer
			@on-change="handleSelectChang"
		>
			<i-option value="0">待定中</i-option>
			<i-option value="1">通过</i-option>
			<i-option value="2">未通过</i-option>
		</i-select>
	</div>
</template>

<script>
import { Modal, Button, Select, Option } from "iview";


export default {
	name: "hr-employee-details-contract-company-1",
	components: {
		"i-select": Select,
		"i-option": Option,
	},
	props: {
		params: String,
		paramsIndex: Number,
		handleSelect: Function,
		type: String,
		operate: Number
	},
	data() {
		return {
			selectVal: '' || this.params
		};
	},
	computed: {},
	mounted() {
		
	},
	methods: {
		handleSelectChang(val, index) {
			this.handleSelect(val, this.paramsIndex);
			this.selectVal = val;
		}
	}
};

</script>

<style lang="scss" scoped>
</style>