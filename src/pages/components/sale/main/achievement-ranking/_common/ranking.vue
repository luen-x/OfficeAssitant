<template>
	<div class="v-sale-main-achievement-ranking-ranking">
		<div class="g-flex-ac g-m-t-20">
			<span class="g-m-r-10" style="width:2px;height:14px;background:#E74854;"/>
			<span class="g-m-r-10 g-fs-14" style="color:#4B4F57">
				{{ depart }}排行
			</span>
			<span class="g-operation g-fs-14" style="font-size:14px" @click="handleMore">
				更多
			</span>
		</div>
		<oa-table-list :height="180" class="g-m-t-20 g-c-black2">
			<template slot="header">
				<span
					v-for="(value,i) in tableHeader"
					:key="i"
					:style="{marginRight:i==1?'20px':''}"
					:class="{__name:i==1&&type!='depart_name'&&level>0}"
					class="g-col g-tl" >{{ value }}</span>
			</template>
			<template v-if="list.length">
				<div v-for="(item,i) in list" :key="i" class="g-flex  g-jc-sb g-m-t-20">
					<span class="g-col g-tl">{{ item.sort_count }}</span>
					<span :class="{__name:type!='depart_name'&&level>0}" class="g-col g-tl g-m-r-20">
						{{ item[type] }}
						{{ type=='staff_name'?'('+item.depart_name+')':'' }}
					</span>
					<span class="g-col g-tl">{{ item.current_money }}</span>
				</div>
			</template>
		</oa-table-list>
	</div>
</template>

<script>
import tableList from '../../_common/table-list';

export default {
	components: {
		'oa-table-list': tableList
	},
	props: {
		depart: {
			type: String,
			default: '部门'
		},
		type: {
			type: String,
			default: 'depart_name'
		},
		level: {
			type: [String, Number],
			default: 'depart_name'
		},
		list: {
			type: Array,
			default() {
				return 	['排名', '部门', '业绩'];
			}
		},
		tableHeader: {
			type: Array,
			default() {
				return 	['排名', '部门', '业绩'];
			}
		}
	},
	data() {
		return {

		};
	},
	methods: {
		handleMore() {
			this.$emit('on-more');
		}
	}
};
</script>

<style  lang="scss">
.v-sale-main-achievement-ranking-ranking{
	.__name{
		flex: none !important;
		width: 115px !important;
	}
}
</style>
