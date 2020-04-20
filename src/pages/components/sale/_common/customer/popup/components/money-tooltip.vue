<template>

	<span v-if="total===undefined || total===null">--</span>
	<span v-else-if="dataSource.length==0">{{ totalFixed }}</span>
	<i-poptip v-else transfer trigger="hover">
		<span class="g-operation">{{ totalFixed }}</span>
		<div slot="content">
			<div v-for="(month,key) in dataSource" :key="key">
				<div v-if="month.month || month.title">{{ month.month || month.title }}</div>
				<div v-if=" month.share_staff">
					<span v-for="(staff,index) in month.share_staff" :key="index+'sta'" >
						{{ staff.staff_name }} : {{ staff.amount || staff.service_amount || staff.cost_amount || staff.minus_performance }}
					</span>
				</div>
				<div v-if="month.share_depart">
					<span v-for="(dep,index) in month.share_depart" :key="index+'dep'" >
						{{ dep.depart_name }} : {{ dep.amount }}
					</span>
				</div>
				<div v-if="month.detail">
					<span v-for="(det,index) in month.detail" :key="index+'det'" >
						{{ det.label }} : {{ det.value }}
					</span>
				</div>
				<div v-if="(month.rate) && month.rate.includes(':')">
					{{ type=="cost"?"成本":"分单" }}比例：{{ month.rate }}
				</div>
			</div>
		</div>
	</i-poptip>
</template>
<script>
import { Poptip } from 'iview';

const initFunc = {
	'1': (data) => { // [{label:'a',value:1}] //促单业绩、团队业绩
		if (!data || data.length == 0) {
			return [];
		} else {
			return [{ detail: data }];
		}
	},
	'2': data => {
		data.forEach(item => { // 返还成本
			item.title = item.product_name;
		});
		return data;
	},
	'3': (data) => { // 实时业绩实扣成本比例展示
		data.forEach(ele => {
			ele.rate = ele.all_rate;
		});
		return data;
	}
};

export default {
	name: 'oa-sale-money-tooltip',
	components: {
		'i-poptip': Poptip
	},
	props: {
		data: {
			type: [Object, Array],
			default: () => ({})
		},
		total: [String, Number],
		type: String,
		initType: {
			type: String,
			validator: (val) => {
				const ok = Object.keys(initFunc).includes(val);
				if (!ok) {
					console.warn('money-tool-tip:  unkonw initType:' + val);
				}
				return ok;
			}
		}
	},
	data() {
		// [
		// 	{ detail: [], rate: '' }
		// ];
		return {
			dataSource: this.getInitData() || [],
		};
	},
	computed: {
		totalFixed() {
			const type = typeof this.total;
			if (type == 'number') {
				return this.total.toFixed(2);
			} else {
				return this.total;
			}
		}
	},
	watch: {
		data() {
			this.dataSource = this.getInitData();
		}
	},
	methods: {
		getInitData() {
			const init = initFunc[this.initType];
			if (init) {
				return init(this.data);
			} else {
				return this.data;
			}
		}
	}
};
</script>
<style lang="scss">
</style>