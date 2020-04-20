<template>
	<div class="c-sc-detail-item">
		<div>
			<span class="_label">{{ label }}</span>

			<div v-if="component_type == 6" class="_content">
				<oa-upload
					v-model="resume" 
					disabled
					style="width: 300px"
				/>
			</div>
			<div v-else-if="component_type == 8" class="_content">
				<span class="g-c-black2">{{ hadleGetAddress(content) }}</span>
			</div>
			<div v-else-if="content" class="g-c-black2 _content">
				<i-tooltip
					v-if="content.length > 19" 
					:content="content" 
					:transfer="true"
					placement="bottom"
					max-width="250"
				>
					{{ content.substr(0, 19) + "..." }}
				</i-tooltip>
				<span v-else class="g-c-black2">{{ content }}</span>
			</div>
			<div v-else class="g-c-black2 _content">
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
		component_type: [String, Number]
	},

	data() {
		return {
			resume: []
		};
	},

	mounted() {
		if (this.component_type == 6) {
			this.content.forEach(item => {
				this.resume.push({
					url: item,
					title: item.substring(item.lastIndexOf("/") + 1, item.length),
					type: "." + item.substring(item.lastIndexOf(".") + 1, item.length),
					uid: item
				});
			});
		}
	},

	methods: {
		hadleGetAddress(val) {
			let str = "";

			Array.from(val).forEach(item => {
				str += item + "";
			});

			return str.length > 0 ? str : "--";
		}
	}
};
</script>

<style lang="scss">
.c-sc-detail-item {
    display: inline-block;
    border-bottom: 1px solid #e7e7e7;
    width: 370px;
    padding-bottom: 11px;
    margin-right: 50px;

	div{
		display: flex;
		
		._label {
			display: inline-block;
			color: #818794;
			width: 100px;
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