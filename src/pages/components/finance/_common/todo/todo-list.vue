<template>
	<div class="v-finance-main-todolist">
		<div class="__title">
			<div class="g-oneline">今日{{ dataSource.length }}提醒</div>
			<span class="__tip"/>
		</div>
		<div slot="content" class="__content">
			<div v-if="dataSource.length !=0">
				<div
					v-for="(it, index) in dataSource"
					:key="index"
					class="g-bb g-pd-lr-15 g-flex-ac g-jc-sb __item g-pointer"
				>
					<i-tip-item
						:content="it.schedule_content"
						:remind_time="it.remind_time"
						:schedule_id="it.schedule_id"
						:status="it.status"
						:on-refresh="onRefresh"
						:fetch-data="fetchData"
					>
						<p class="g-oneline">{{ it.schedule_content }}</p>
					</i-tip-item>
					<i v-if="it.status == 2" class="iconfont icon-completed g-c-blue-mid"/>
				</div>
			</div>
			<div v-else class="__empty">
				<img :src="nodataUrl" class="_img" alt>
			</div>
		</div>
	</div>
</template>

<script>
import { Collapse } from "wya-vc";
import { Poptip } from "iview";
import { OSS_EMPTY } from "@constants/constants";
import TipItem from "./tip-item";

export default {
	name: "finance-main-todo-list",
	components: {
		"vc-collapse": Collapse,
		"vc-collapse-item": Collapse.Item,
		"i-poptip": Poptip,
		"i-tip-item": TipItem
	},
	props: {
		dataSource: {
			type: Array,
			default() {
				return [];
			}
		},
		onRefresh: Function,
		fetchData: Function
	},
	data() {
		return {
			nodataUrl: OSS_EMPTY
		};
	},
	methods: {
		handleClose() {},
		handleEdit() {},
		handleComplete() {}
	}
};
</script>

<style lang="scss">
.v-finance-main-todolist {
    color: #333333;
    font-size: 12px;
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
            height: 40px;
        }
        .__empty {
            background-color: #fff;
            width: 100%;
            margin-top: 100px;
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
</style>

