<template>
	<div class="v-sale-customer-parts-turn-records g-relative g-pd-t-20" style="min-height:260px;">
		<oa-loading v-if="loading"/>
		<div class="g-form-title g-m-b-20 g-c-black3">资料转手记录</div>
		<oa-record
			:records="records"
			class="g-col"
			style="overflow-y: auto"
		>
			<div slot-scope="{data,index}">
				<div :style="index ? 'color: #818794' : 'color: #333'" class="g-fs-14 ">
					<span v-if="data.first_half" class="g-m-r-20">{{ data.first_half }}</span>
					<span v-if="data.second_half">{{ data.second_half }}</span>
				</div>
				<div :style="index ? 'color: #818794' : 'color: #333'">
					<span v-if="data.last_time" class="g-c-red-mid g-fs-14 g-dp-ib g-m-r-20">{{ data.last_time }}</span>
					<span>{{ data.create_time_str }}</span>
				</div>
			</div>
		</oa-record>
		
	</div>
</template>
<script>
import { Input, Button } from 'iview';
import Record from '@common/record/record';


export default {
	name: 'oa-sale-customer-parts-turn-record',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-record': Record
	},
	props: {
		customerId: Number,
		readOnly: Boolean

	},
	data() {
		return {
			loading: false,
			records: []
		};
	},
	watch: {
		customerId(newVal, oldVal) {
			this.loadData();
		}
	},
	created() {
		this.loadData();

	},
	methods: {
		loadData() {
			this.$request({
				url: "_SAE_CUSTOMER_TURN_RECORD_GET",
				type: "GET",
				param: {
					customer_id: this.customerId
				},
				loading: false,
			}).then(({ data }) => {
				this.setLastTime(data);
				this.records = data;
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});

		},
		setLastTime(records) {
			records.forEach((item, index) => {
				if (!records[index + 1]) return;
				const day1 = item.create_time;
				const day2 = records[index + 1].create_time;
				let length = parseInt((day1 - day2), 10);
				const s = length % 60;
				length = (length - s) / 60;
				const m = length % 60;
				length = (length - m) / 60;
				const h = length % 24;
				length = (length - h) / 24;
				const d = length % 30;
				length = (length - d) / 30;
				const M = length % 12;
				length = (length - M) / 12;
				const y = length;
				item.last_time = '';
				let stop = false;
				const arr = [y, M, d, h, m, s].filter(i => {
					if (stop) return true;
					if (i == 0) {
						return false;
					} else {
						stop = true;
						return true;
					}
				});
				const t = ['秒', '分钟', '小时', '天', '个月', '年'];
				const arr2 = arr.reverse().map((i, index_) => arr[index_] + t[index_]);
				arr2.reverse();
				if (arr2.length > 2) {
					arr2.length = 2;
				}
				if (arr2[1] && parseFloat(arr2[1]) == 0) {
					arr2.pop();
				}
				item.last_time = arr2.join('');
			});

		}
	}
};
</script>
<style lang="scss">
</style>