<template>
	<div>
		<div class="g-m-t-20 g-flex g-flex-ac">
			<span class="g-fs-16 g-m-r-10">
				{{ achievement }}
			</span>
			<i-tooltip
				content="若查看的是成交金额，则是退款前的业绩金额，若查看的是实际金额，则是退款后的业绩金额"
				max-width="300"
			>
				<i 
					class="iconfont icon-icon-question g-fs-14" 
					style="color: #D4D7DB;"
				/>
			</i-tooltip>
		</div>

		<div class="g-m-t-20 g-flex g-jc-sa">
			<div
				v-for="(item,index) in goal"
				:key="`index_${index}`"
			>
				<div class="g-tc" style="color: #818794;">
					{{ item.name }}
				</div>
				<div class="g-m-b-20 g-tc" style="color: #E74C57;">
					{{ item.money }}
				</div>
				<i-circle
					:percent="+item.point"
					:stroke-color="item.color"
					:size="150"
				>
					<div class="g-c-333 g-fs-20 g-m-b-10">{{ item.percent }}</div>
					<div style="color: #818794;">{{ item.goal }}</div>
				</i-circle>
			</div>
		</div>
	</div>
</template>

<script>
import { Circle, Tooltip } from 'iview';
import { getFormatNum } from '@utils/utils';

export default {
	components: {
		'i-circle': Circle,
		'i-tooltip': Tooltip
	},
	props: {
		dataSource: {
			type: Object,
			required: true
		},
		amountType: {
			type: String,
			required: true
		},
		type: {
			type: Number
		}
	},
	data() {
		return {
			goal: [],
			list: [
				{
					name: '保底目标',
					money: '',
					goal: '目标达成率',
					color: '#2E9DFA',
					point: '',
					percent: ''
				},
				{
					name: '平衡目标',
					money: '',
					goal: '目标达成率',
					color: '#5DCA4D',
					point: '',
					percent: ''
				},
				{
					name: '冲刺目标',
					money: '',
					goal: '目标达成率',
					color: '#E74C57',
					point: '',
					percent: ''
				}
			]
		};
	},
	computed: {
		achievement() {
			if (this.dataSource.pay_performance) {
				let money = this.amountType === '1' ? this.dataSource.pay_performance : this.dataSource.real_performance;
				return getFormatNum(money, 2, '￥');
			}
		}
	},
	watch: {
		dataSource(value) {
			this.handleData(value);
		}
	},
	mounted() {
		this.handleData(this.dataSource);
	},
	methods: {
		handleData(value) {
			this.goal = [];

			if (this.type != 2) {
				this.goal = this.list;
			} else {
				this.goal = [...this.list, {
					name: '退款金额',
					money: '',
					goal: '退款率',
					color: '#FFB42B',
					point: '',
					percent: ''
				}];

				this.goal[3].point = this.getFormatPoint(value.refund_rate);
				this.goal[3].percent = value.refund_rate;
				this.goal[3].money = this.getFormatMoney(value.refund_amount);
			}

			this.goal[0].money = this.getFormatMoney(value.min_target);
			this.goal[1].money = this.getFormatMoney(value.target);
			this.goal[2].money = this.getFormatMoney(value.max_target);

			if (this.amountType === '1') {
				this.goal[0].point = this.getFormatPoint(value.pay_min_proportion);
				this.goal[0].percent = value.pay_min_proportion;
				this.goal[1].point = this.getFormatPoint(value.pay_proportion);
				this.goal[1].percent = value.pay_proportion;
				this.goal[2].point = this.getFormatPoint(value.pay_max_proportion);
				this.goal[2].percent = value.pay_max_proportion;
			} else {
				this.goal[0].point = this.getFormatPoint(value.real_min_proportion);
				this.goal[0].percent = value.real_min_proportion;
				this.goal[1].point = this.getFormatPoint(value.real_proportion);
				this.goal[1].percent = value.real_proportion;
				this.goal[2].point = this.getFormatPoint(value.real_max_proportion);
				this.goal[2].percent = value.real_max_proportion;
			}
		},
		getFormatMoney(money) {
			return money === '--' ? '--' : getFormatNum(money, 2, '', '万');
		},
		getFormatPoint(point) {
			console.log('point', point);
			if (point === '--' || !point) {
				return '0';
			} else if (point) {
				return point.split("%")[0] > 100 ? '100' : point.split("%")[0];
			}
		}
	}
};
</script>