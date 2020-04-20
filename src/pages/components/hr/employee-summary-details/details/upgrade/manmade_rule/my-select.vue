<template>
	<div>
		<i-select :value="selectVal" transfer style="width: 100px" @on-change="handleSelectChang">
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
		paramsIndex: String,
		rowData: Array,
		index: Number
	},
	data() {
		return {
			selectVal: String(this.paramsIndex || '0')
		};
	},
	computed: {},
	mounted() {
		
	},
	methods: {
		handleSelectChang(val) {
			this.rowData[this.index].status = val;
		}
	}
};

</script>

<style lang="scss" scoped>
</style>