<template>
	<div :style="`width:${width}`" class="c-info-item">
		<span :style="`width:${labelWidth}`" class="_label">{{ label }}</span>
		<span :class="'_value g-relative '+contentClass">
			<slot>
				<template v-if="type=='array' || type==8">
					<oa-auto-tooltip v-if="content.length>0" :content="content.join('  ') || '--'" :max-width="220" label-class="g-c-black2"/>
					<span v-else class="g-m-r-10 ">--</span>
				</template>
				<!-- <template v-else-if="type=='imgs' || type==6">
					<oa-imgs-picker v-if="content.length>0" :data-source="content" disabled reactive />
					<span v-else class="g-m-r-10 ">--</span>
				</template> -->
				<template v-else-if="type=='imgs' || type==6 || type=='files'">
					<oa-upload v-if="content.length>0" :data-source="content" :show-title="false" disabled />
					<span v-else class="g-m-r-10 ">--</span>
				</template>
				<oa-auto-tooltip v-else-if="type=='remark' || tooltip" :content="content || '--'" :max-width="220" label-class="g-c-black2"/>
				<span v-else class="g-m-r-10 " >{{ (content === '' || content === undefined || content === null ) ? '--' : content }}</span>
			</slot>
		</span>
	</div>
</template>

<script >
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import ImgsPicker from '@common/imgs-picker/imgs-picker';
import Upload from '@common/upload/upload';
// 数字是为了匹配后端，和数字前的type保持一致,没有匹配到的数字当做text处理
const typeEnum = ['array', 8, 'imgs', 6, 'text', 'remark', 'files'];
export default {
	name: "oa-info-item",
	components: {
		'oa-imgs-picker': ImgsPicker,
		'oa-auto-tooltip': AutoTooltip,
		'oa-upload': Upload
	},
	props: {
		label: String,
		content: [String, Array, Number],
		type: {
			default: 'text',
			validator(value) {
				return Number.isInteger(value) || typeEnum.includes(value);
			}
		},
		contentClass: {
			type: String,
			default: 'g-c-black2'
		},
		tooltip: Boolean,
		width: {
			type: String,
			default: '300px'
		},
		labelWidth: {
			type: String,
			default: '100px'

		}



	},

	data() {
		return {
		};
	},
	computed: {
		// showTooltip() {
		// 	if (this.type == 'remark') {
		// 		return true;
		// 	}
		// 	if (!typeEnum.includes(this.type) && this.tooltip) {
		// 		return true;
		// 	}
		// 	return false;
		// }
		
	}
};
</script>

<style  lang="scss" scoped>
.c-info-item {
		display: flex;
		border-bottom: 1px solid #e7e7e7;
		width: 300px;
		padding-top: 5px;
		padding-bottom: 5px;
		// margin-right: 50px;
		margin: 15px 40px 5px 0px;
		._label {	
			color: #818794;
		}
		._value{
			flex: 1;
			overflow-y: hidden;

		}
}
</style>
