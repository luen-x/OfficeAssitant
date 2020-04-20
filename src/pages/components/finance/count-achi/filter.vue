<template>
	<div class="g-pd-20">
		<div class="g-flex">
			<i-date-picker 
				v-model="formValidate.month" 
				:options="pickerOptionsStart" 
				style="width: 220px"
				type="month"
				transfer
				placeholder="请选择时间" 
				@on-change="handleMonth"
			/>
			<i-cascader 
				v-if="typeName==1||typeName==undefined"
				v-model="formValidate.depart_id" 
				:data="departAll"
				class="g-m-l-10" 
				style="width: 220px; display: inline-block" 
				clearable
				transfer
				change-on-select
				trigger="click"
				placeholder="请选择部门"
				@on-change="handleDepart"
			/>
			<i-button
				type="primary"
				class="g-m-l-10"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
		
		<oa-count-money :month="month" :depart_id="formValidate.depart_id" />
		<oa-tabs :month="month" :depart_id="formValidate.depart_id"/>
	</div>
</template>

<script>
import { Input, Button, Cascader, DatePicker, Form } from 'iview';
import { DebounceClick } from "wya-vc";
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import { services } from "@stores/services/hr";
import moment from "moment";
import countMoney from './count-money';
import Tabs from './tabs';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-form': Form,
		'i-cascader': Cascader,
		"i-date-picker": DatePicker,
		'oa-count-money': countMoney,
		'oa-tabs': Tabs,
		 
	},
	mixins: [
		services.departAll()
	],
	data() {
		const { query = {} } = this.$route;
		
		let depart_id = !!query.depart_id && query.depart_id.split(',').map((item) => { return +item; });
		return {
			pickerOptionsStart: {
				disabledDate: time => {
					// 可通过箭头函数的方式访问到this
					return time.getTime() > Date.now();
				}
			},
			formValidate: {
				month: (!!query.month && query.month) || moment().format('YYYY-MM-DD'), 
				depart_id: depart_id || [], 
			}
		};
	},
	computed: {
		// 计算属性的 getter
		month() {
			return formatMoment(this.formValidate.month);
		},
		typeName() {
			const { query = {} } = this.$route;
			return query.type;
		}
		
	},
	mounted() {
	},
	methods: {
		handleMonth(val) {
			const { query = {} } = this.$route;
			this.$router.replace(getHashUrl(
				'/finance/count/achi', 
				{ 
					...query,
					month: val,
				}
			));
		},
		handleDepart(value, selectedData) {
			this.$router.replace(getHashUrl(
				'/finance/count/achi', 
				{ 
					depart_id: value,
				}
			));
		},
		handleSearch(event) {
			const { query } = this.$route;
			this.$router.replace(getHashUrl(
				'/finance/count/achi', 
				{ 
					month: this.month,
					type: query.type != undefined ? query.type : '1',
					depart_id: this.formValidate.depart_id,
				}
			));
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
