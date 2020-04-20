<template>
	<div class="v-content-rules-sale-other-time-item ">
		<div>
			<span class="g-fs-16 g-c-red-mid"><span class="_border g-m-r-10"/>{{ title }}</span>
		</div>
		<div v-if="time_limit" class="g-m-l-20 g-m-t-20 g-fs-12 g-c-black2" >
			<slot :time="time_limit"/>
			<i class="g-operation iconfont icon-bianji" @click="handleCustom"/>
		</div>
	</div>
</template>

<script>
import autoTooltip from '@components/_common/auto-tooltip/auto-tooltip';
import { Confirm } from '@components/_common/confirm/confirm';
import { AddRules } from "../popup/add-rules";


export default {
	components: {
		'oa-auto-tooltip': autoTooltip
	},
	props: {
		title: {
			type: String,
			default: '通话有效时长配置'
		},
		time: {
			type: Number,
			default: null
		},
		type: {
			type: String,
			default: ''
		},
		api: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			activated: '1',
			edit: false,
			time_limit: this.time || null
		};
	},
	watch: {
		time(val) {
			this.time_limit = val;
		}
	},
	methods: {
		handleCustom() {
			AddRules.popup({
				type: this.type,
				data: {
					time_limit: this.time_limit
				},
				title: this.title
			}).then((res) => {
				this.hanldeSave(res);
			}).catch(

			);
		},
		hanldeSave(param) {
			return this.$request({
				url: this.api,
				type: 'GET',
				param
			}).then((res) => {
				this.$Message.success(res.msg);
				this.time_limit = param.time_limit;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleCancel() {
			this.edit = false;
		}
	}
};
</script>

<style  lang="scss">
.v-content-rules-sale-other-time-item{
	margin-right:20px;
	padding-bottom: 40px;
	._border{
		display: inline-block;
		width: 2px;
		height: 14px;
		position: relative;
		top: 2px;
		background-color: #e84854;
	}
	.__item{
		padding-left: 5px;
		width:94px;
		height:28px;
		margin-right:10px;
		border-radius: 4px;
		border: 1px solid #D9DCE0;
		position: relative;
		overflow: hidden;
	}
	._ecllips{
		color: #e84854 !important;
	}
	._custom{
		width:80px;
		height:28px;
		text-align: center;
		padding: 0;
	}
	.__active-item{
		background:rgba(231,72,84,0.1);
		border:none;
		color: #e84c57;
	}
}
</style>
