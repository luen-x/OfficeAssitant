<template>
	<div class="v-hr-manmade-rule">
		<i-table 
			:columns="columns" 
			:data="regularRule" 
			class="g-m-t-15" 
			stripe 
			border/>
	</div>

</template>

<script>
import API_ROOT from "@stores/apis/root";
import {
	Input,
	Select,
	Option,
	Table
} from "iview";
// utils
import item from "./item";

export default {
	name: "v-hr-details-upgrade-regular-rule",
	components: {
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-table": Table,
	},
	mixins: [item],
	props: {
		regularRule: Array,
		status: Number
	},
	data() {
		return {
		};
	},
};
</script>

<style lang="scss" >
.v-hr-manmade-rule{
	.ivu-table-row{
		height:60px !important;
	}
}
</style>
