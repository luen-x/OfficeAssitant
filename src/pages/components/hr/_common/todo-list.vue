<template>
	<div class="v-hr-main-todolist">
		<vc-collapse accordion>
			<vc-collapse-item 
				v-for="(item, index) in dataSource"
				:key="index" 
				:name="index + ''"
				class="_item"
			>
				<div class="__title">
					<p class="g-oneline">{{ item.msg }}</p>
					<span class="__tip"/>
				</div>
				<span slot="icon" slot-scope="it" class="__icon">
					<i :class="it.isExpend ? 'icon-up' : 'icon-down'" class="iconfont" />
				</span>
				<div slot="content" class="__content">
					<div 
						v-for="(it, id) in item.list"
						:key="index + '' + id"
						class="g-bb g-pd-lr-15 g-flex-ac g-jc-sb __item g-pointer"
					>
						<i-tip-item 
							:content="it.detail"
							:schedule-id="it.schedule_id"
							:agenda-id="it.agenda_id"
							:status="it.status"
							:on-refresh="onRefresh"
						>
							<p 
								:class="it.status == 3 ? 'g-c-red-dark' : it.status == 2 ? 'g-c-black7' : ''" 
								class="g-oneline"
							>
								{{ it.content }}
							</p>
						</i-tip-item>
						<div>
							<span v-if="it.interview_time">{{ it.interview_time }}</span>
							<i 
								v-if="it.status == 2" 
								class="iconfont icon-completed g-c-blue-mid g-flex-cc" 
								style="position: absolute; top: 0; right: -2px; bottom: 0"
							/>
						</div>
					</div>
				</div>
			</vc-collapse-item>
		</vc-collapse>
	</div>
</template>

<script>
import { Collapse } from 'wya-vc';
import { Poptip } from 'iview';
import TipItem from './tip-item';

export default {
	name: 'hr-main-todo-list',
	components: {
		'vc-collapse': Collapse,
		'vc-collapse-item': Collapse.Item,
		'i-poptip': Poptip,
		'i-tip-item': TipItem,
	},
	props: {
		dataSource: {
			type: Array,
			default() { 
				return []; 
			}
		},
		onRefresh: Function
	},
	mounted() {},
	methods: {
		handleClose() {

		},
		handleEdit() {

		},
		handleComplete() {

		},
	}
};
</script>

<style lang="scss">
.v-hr-main-todolist {
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
			padding: 0 10px;
			background-color: #f8f8f8;
			.__item {
				position: relative;
				height: 40px;
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

