<template>
	<div class="v-sc-main-todolist">
		<vc-collapse accordion>
			<vc-collapse-item
				v-for="(item, index) in dataSource"
				:key="index"
				:name="index + ''"
				class="_item"
			>
				<div class="__title">
					<p class="g-oneline">{{ item.msg }}</p>
					<span class="__tip" />
				</div>

				<span slot="icon" slot-scope="it" class="__icon">
					<i
						:class="it.isExpend ? 'icon-up' : 'icon-down'"
						class="iconfont"
					/>
				</span>

				<div slot="content" class="__content">
					<div
						v-for="(it,key) in item.list"
						:key="key"
						class="g-bb g-pd-lr-15 g-flex-ac g-jc-sb __item g-pointer"
					>
						<i-tip-item
							:record_id="it.record_id"
							:remind_date="it.remind_date"
							:content="it.content"
							:is_complete="it.is_complete"
							:on-refresh="handleRefresh"
						>
							<p :class="it.is_complete != 0 && 'g-c-black7'" class="g-oneline" >{{ it.content }}</p>
						</i-tip-item>
						<i 
							v-if="it.is_complete != 0"
							class="iconfont icon-completed g-c-blue-mid g-flex-cc _complete" 
							style="position: absolute; top: 0; right: 0; bottom: 0"
						/>
					</div>
				</div>
			</vc-collapse-item>
		</vc-collapse>
	</div>
</template>

<script>
import { Collapse } from "wya-vc";
import TipItem from "./tip-item";

export default {
	name: "sc-main-todo-list",

	components: {
		"vc-collapse": Collapse,
		"vc-collapse-item": Collapse.Item,
		"i-tip-item": TipItem
	},

	props: {
		dataSource: {
			type: Array || Object,
			default() {
				return [];
			}
		},
		onRefresh: Function
	},

	methods: {
		handleClose() {},
		handleEdit() {},
		handleComplete() {},

		// 刷新数据
		handleRefresh() {
			this.onRefresh && this.onRefresh();
		}
	}
};
</script>

<style lang="scss">
.v-sc-main-todolist {
    ._item {
		color: #333333;
		font-size: 12px;
		position: relative;
		margin-bottom: 10px;
		text-align: left;

		.__title {
			position: relative;
			height: 36px;
			line-height: 36px;
			padding: 0 20px 0 25px;
			background-color: #f8f8f8;
			border-bottom: 1px solid #eaeef1;
			cursor: pointer;
		}

		.__tip {
			position: absolute;
			left: 15px;
			top: 0;
			bottom: 0;
			margin: auto 0;
			width: 4px;
			height: 4px;
			border-radius: 2px;
			background-color: #2399fb;
		}

		.__content {
			background-color: #f8f8f8;
			.__item {
				position: relative;
				height: 30px;
			}
		}

		.__icon {
			position: absolute;
			right: 10px;
			top: 0;
			bottom: 0;
			margin: auto 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
</style>

<style lang="scss" scoped>
.v-sc-main-todolist {
	/deep/ .ivu-poptip {
		margin-top: 10px;
		display: block;
	}
}
</style>