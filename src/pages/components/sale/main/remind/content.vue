<template>
	<div class="v-sale-main-remind">
		<oa-block :show-extra="false" title="事项提醒">
			<div v-if="msgList.length==0" style="width:100%; min-height:200px" class="g-flex-cc g-flex-ac g-fd-c" >
				<img :src="OSS_EMPTY" style="height:130px" >
				<div class="g-c-black7">暂无事项提醒</div>
			</div>
			<transition-group 
				v-else 
				name="flip-list" 
				tag="div" 
				class="g-pd-lr-20 g-m-t-10" 
				style="min-height:200px" 
			>
				<div 
					v-for="(item) in msgList" 
					:key="item.remind_id" 
					class="g-flex g-pd-tb-10 _remind-item " 
					style="boder-bottom:1px solid rgb(235, 235, 235);"
				>
					<i class="icon iconfont icon-dot g-c-blue-mid g-fs-12 _dot-icon g-m-r-10"/>
					<div class="g-col g-oneline" >
						{{ item.title }}
						<!-- <oa-auto-tooltip
							:content="item.title"
							theme="dark"
							placement="bottom"
							label-class=" "
							style="width:calc(100% - 80px)"
						/> -->
					</div>
					<div class="g-m-l-10">
						{{ item.create_time }}
					</div>
					<div class="_operation g-pointer g-m-l-10" @click="handleDelete(item)" >
						忽略
					</div>
				</div>
			</transition-group>
		</oa-block>
	</div>
</template>
<script>
import { Input, Button } from 'iview';
import { OSS_EMPTY } from '@constants/constants';
import AutoToolTip from '@common/auto-tooltip/auto-tooltip';
import Block from '../_common/block';

export default {
	name: 'oa-main-message',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-block': Block,
		'oa-auto-tooltip': AutoToolTip
	},
	data() {
		return {
			OSS_EMPTY,
			msgList: [
				// { "remind_id": 1,
				// 	"title": "你的录账申请被驳回，快去处理吧。你的录账申请被驳回，快去处理吧。你的录账申请被驳回，快去处理吧。",
				// 	"staff_id": 1,
				// 	"type": 1,
				// 	"create_time": "2020-02-26 09:44:21" 
				// },
				// { "remind_id": 2,
				// 	"title": "你的录账申请被驳回，快去处理吧。你的录账申请被驳回，快去处理吧。你的录账申请被驳回，快去处理吧。",
				// 	"staff_id": 1,
				// 	"type": 1,
				// 	"create_time": "2020-02-26 09:44:21" 
				// },
				// { "remind_id": 3,
				// 	"title": "你的录账申请被驳回，快去处理吧。你的录账申请被驳回，快去处理吧。你的录账申请被驳回，快去处理吧。",
				// 	"staff_id": 1,
				// 	"type": 1,
				// 	"create_time": "2020-02-26 09:44:21" 
				// },
				// { "remind_id": 4,
				// 	"title": "你的录账申请被驳回，快去处理吧。你的录账申请被驳回，快去处理吧。你的录账申请被驳回，快去处理吧。",
				// 	"staff_id": 1,
				// 	"type": 1,
				// 	"create_time": "2020-02-26 09:44:21" 
				// }
			]
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: "_SALE_MAIN_REMIND_LIST_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				this.msgList = res.data;
			
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		handleDelete(item) {
			this.$request({
				url: "_SALE_MAIN_REMIND_IGNORE_POST",
				type: "GET",
				param: {
					remind_id: item.remind_id
				},
				loading: false,
			}).then(res => {
				this.$Message.success(res.msg);
				this.loadData();
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		}
	}
};
</script>
<style lang="scss">
.v-sale-main-remind {
	._dot-icon {
		display: inline-block;
		transform: scale(0.7);
	}
	._remind-item {
		._operation {
				color: white;
			}
		&:hover {
			._operation {
				color: #2296f9;
			}

		}
	}
	.flip-list-enter, 
.flip-list-leave-to{
	opacity: 0;
	// transform: translateY(30px);
}
// 开始消失，在变化过程中，使其宽高变化，其他元素会被添加flip-list-move
.flip-list-leave-active {
	// position: absolute !important;
	display: none;
}
	

}
</style>