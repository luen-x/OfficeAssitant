<template>
	<span v-if="total===undefined || total===null">--</span>
	<span v-else-if="+total==0">{{ total }}</span>
	<i-poptip v-else transfer trigger="hover">
		<span class="g-operation">{{ total }}</span>
		<div slot="content">
			<div v-for="(month,key) in dataSource" :key="key">
				<div class="g-m-r-10">{{ month.month }}</div>
				<span v-for="(staff,index) in month.describe || []" :key="index+'sta'" >
					{{ staff.name }} : {{ staff.amount }}
				</span>
			</div>
		</div>
	</i-poptip>
</template>
<script>
import { Poptip } from 'iview';

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
		total: [String]

	},
	data() {
		return {
			dataSource: this.getInitData(),
		};
	},
	watch: {
		data() {
			this.dataSource = this.getInitData();
		}
	},
	methods: {
		getInitData() {
			let result;
			Object.keys(this.data).forEach((key) => {
				if (this.data[key] instanceof Array) {
					if (!result) result = {};
					result[key] = { share_staff: this.data[key] };
				}
			});
			return result || this.data;
		}
	}
};
</script>
<style lang="scss">
</style>