<template>
	<div class="v-customer-save-success">
		<div class="g-flex g-fd-c g-ai-c g-m-t-20">
			<i class="icon iconfont icon-selected g-c-green-mid" style="font-size: 94px;"/>
			<span class="g-fs-24 g-c-black2" style="margin-top: -10px;">提交成功</span>
		</div>
		<div class="g-flex g-fd-r g-jc-c g-fs-14 g-c-green-mid g-m-t-20">
			<div 
				v-for="(item, index) in dataSource" 
				:key="index"
				class="g-pd-lr-15"
			>
				<span>{{ item.label }}：</span>
				<span>{{ item.value }}</span>
			</div>
		</div>
		<slot />
		<div class="g-m-tb-20 g-pd-20" style="background-color: #fafafa;">
			<oa-across-table :data="auditSchedule">
				<div 
					slot-scope="{item:data}" 
					class="g-flex g-flex-cc g-fd-c"
				>
					<div class="g-m-t-10">{{ data.title }}</div>
					<div 
						v-if="data.status !== 4" 
						class="g-c-black5"
					>
						{{ data.create_time }}
					</div>
					<div 
						v-else 
						class="g-c-orange-mid g-pointer"
						@click="$emit('remind')"
					>
						催一下
					</div>
				</div>
			</oa-across-table>
		</div>
	</div>
</template>
<script>
import AcrossTable from '@components/_common/across-table/across-table';

// 1 待审核 ，2 通过  3 未通过（驳回） 4 进行中
export default {
	name: 'oa-save-success',
	components: {
		'oa-across-table': AcrossTable
	},
	props: {
		dataSource: {
			type: Array,
			default: () => ([])
		},
		auditSchedule: {
			type: Array,
			default: () => ([])
		}
	},
	data() {
		return {
			
		};
	},
	mounted() {

	},
	methods: {

	}
};
export const SaveSuccess = module.exports.default;
</script>
<style lang="scss">
.v-customer-save-success {
	.c-across-table{
		._item{
			width: 300px;
			// height: 50px;
		}
		._line {
			left: 175px;
			width: 250px
		}
		._out.plain {
			background: transparent
		}
	}
}


</style>
