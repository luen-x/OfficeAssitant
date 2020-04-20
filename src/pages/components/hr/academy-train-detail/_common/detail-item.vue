<template>
	<div class="c-hr-academy-train-detail-item">
		<div class="g-m-t-10">
			<span class="_label">{{ label }}</span>
			<div v-if="content" class="_content">
				<i-tooltip
					v-if="content.length > 17" 
					:content="content" 
					:transfer="true"
					placement="bottom"
					max-width="250"
				>
					{{ content.substr(0, 17) + "..." }}
				</i-tooltip>
				<span v-else>{{ content }}</span>
			</div>
			<div v-else class="_content">
				--
			</div>
		</div>
	</div>
</template>

<script>
import { Tooltip } from "iview";
import Upload from '@components/_common/upload/upload';

export default {
	name: "sc-detail-item",

	components: {
		"i-tooltip": Tooltip,
		"oa-upload": Upload
	},

	props: {
		label: String,
		content: [String, Array, Number],
	},

	data() {
		return {
			resume: []
		};
	},
	methods: {
	}
};
</script>

<style lang="scss">
.c-hr-academy-train-detail-item {
    display: inline-block;
    border-bottom: 1px solid #e7e7e7;
    width: 370px;
    padding-bottom: 16px;
    margin-right: 50px;

	div{
		display: flex;
		
		._label {
			display: inline-block;
			color: #818794;
			width: 120px;
			position: relative;
			top: 0px;
		}

		._content {
			display: inline-block;
			color: #000000;
			width: 240px;
			position: relative;
		}

		.ivu-poptip-body-content-inner{
			color: #4b4f57;
		}

		/deep/ ._title{
			display: none;
		}
	}
}
</style>


