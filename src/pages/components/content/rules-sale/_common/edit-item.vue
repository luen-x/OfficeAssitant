<template>
	<div class="v-content-rules-sale-edit-item">
		<div class="g-fs-16 g-c-red-mid">
			<span class="_border g-m-r-10"/>{{ title }}
		</div>
		<div class="g-flex g-m-t-20 g-c-black2 " >
			<span style="width:80px" class="g-m-l-20 g-tr">可编辑字段</span>
			<div class="g-col g-flex g-fw-w g-m-l-20" >
				<div v-for="(item,index) in edit_show" :key="item.key" class="g-m-r-10 g-m-b-10 __item g-flex-cc g-c-red-mid">
					<oa-auto-tooltip :content="item.value" width="70px"/>
					<i
						style="font-size: 12px;position: absolute; right: 5px;color: #e84857;"
						class="icon iconfont icon-icon-test g-pointer"
						@click="handleDelete(item,index)"/>
				</div>
			</div>
		</div>
		<div class="g-flex g-m-t-20 g-c-black2" >
			<span style="width:80px" class="g-m-l-20 g-tr">不可编辑字段</span>
			<div class="g-col g-flex g-fw-w g-m-l-20" >
				<div
					v-for="(item,index) in edit_hide"
					:key="item.key"
					:style="{
						cursor : (item.key =='company_name'||item.key=='tel') ? 'no-drop' : 'pointer',
						background : (item.key =='company_name'||item.key=='tel') && '#f3f3f3',
					}"
					class="g-m-r-10 g-m-b-10 __add-item g-flex-cc ">
					<oa-auto-tooltip :content="item.value" label-class="item" width="70px"/>
					<div v-if="!(item.key =='company_name'||item.key=='tel')" class="_mask g-tc" @click="handleAdd(item,index)" >添加</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import autoTooltip from '@components/_common/auto-tooltip/auto-tooltip';

export default {
	components: {
		"oa-auto-tooltip": autoTooltip
	},
	props: {
		title: {
			type: String,
			default: '意向客户/成交客户/关联客户编辑'
		},
		editShow: {
			type: Array,
			default() {
				return [];
			}
		},
		editHide: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			edit_show: this.editShow || [],
			edit_hide: this.editHide || [],
		};
	},
	watch: {
		editShow(newVue) {
			this.edit_show = newVue;
		},
		editHide(newVue) {
			this.edit_hide = newVue;
		},
	},
	methods: {
		handleDelete(item, i) {
			this.edit_show.splice(i, 1);
			this.edit_hide.push(item);
		},
		handleAdd(item, i) {
			this.edit_hide.splice(i, 1);
			this.edit_show.push(item);

		}
	}
};
</script>

<style lang="scss">
.v-content-rules-sale-edit-item{
	._border{
		display: inline-block;
		width: 2px;
		height: 14px;
		position: relative;
		top: 2px;
		background-color: #e84857;
	}
	._ecllips{
		color: #e84857 !important;
	}
	.__item{
		width:94px;
		padding:0 10px;
		height:28px;
		color: #e84857;
		background:rgba(231,72,84,0.1);
		border-radius:4px;
		position: relative
	}
	.__add-item{
		width:94px;
		height:28px;
		padding-left: 10px;
		border-radius: 4px;
		color: #e84857;
		background: #fff;
		border: 1px solid #D9DCE0;
		position: relative;
		overflow: hidden;
		._ecllips{
			color: #333 !important;
		}
		& > ._mask {
			opacity: 0;
			position: absolute;
			color: #fff;
			top: 0;
			width: 100%;
			height: 28px;
			line-height: 28px;
			border-radius: 4px;
			top: -1px;
			right: 0;
			left: 0;
			cursor: pointer;
			background: rgba(0, 0, 0, 0.6);
		}
		&:hover > ._mask {
			opacity: 1;
			transition: opacity .5s;
		}
	}
}
</style>
