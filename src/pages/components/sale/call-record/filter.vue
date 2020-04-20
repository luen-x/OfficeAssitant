<template>
	<div>
		<oa-sale-expand :bar="false" style="margin-top:0px" class="js-filter" expand>
			<i-input
				slot="prefix"
				v-model="query.keyword"
				placeholder="请输入公司、姓名或电话搜索"
				style="width: 300px"
				clearable
				@on-enter="handleSearch"
				@on-change="handleClear"
			/>
			<i-button
				slot="prefix"
				type="primary"
				class="g-red-btn g-m-l-10"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<span slot="toggle" class="g-m-l-20 g-c-black-dark g-fs-14 g-pointer">更多搜索条件</span>
			<div 
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-select
					v-model="query.type"
					clearable
					placeholder="呼叫类型"
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option value="1">呼入</i-option>
					<i-option value="2">呼出</i-option>
				</i-select>
				<i-select
					v-model="query.status"
					clearable
					placeholder="通话状态"
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option value="0">未接通</i-option>
					<i-option value="1">已接通</i-option>
				</i-select>
				<i-date-picker
					v-model="query.start_time"
					type="datetime"
					placeholder="通话时间（起始）"
					clearable
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>
				<i-date-picker
					v-model="query.end_time"
					type="datetime"
					placeholder="通话时间（结束）"
					clearable
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>
				<i-cascader
					v-if="departMyStaff.length>0"
					v-model="query.depart_ids "
					:data="departMyStaff ||[]"
					clearable
					change-on-select
					placeholder="请选择员工"
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleSearchDepart"
				/>
				<i-input-number
					v-model="query.time_last_left"
					:min="0"
					placeholder="通话时长（分钟）"
					style="width: 220px;margin-right:5px"
					@on-change="handleTimeLastLeftChange"
					@keyup.native.enter="handleSearch"

				/>
				<i-input-number
					v-model="query.time_last_right"
					:min="0" 
					placeholder="通话时长（分钟）"
					style="width: 220px;margin-right:5px"
					@on-change="handleTimeLastRightChange"
					@keyup.native.enter="handleSearch"
				/>
				<i-select
					v-if="showCheck"
					v-model="query.list_type"
					clearable
					placeholder="请选择质检板块"
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option value="2">立客户中心</i-option>
					<i-option value="3">商学院</i-option>
				</i-select>
			</div>
		</oa-sale-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker, InputNumber, Cascader } from 'iview';
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import { services } from '@stores/services/sale';
import SaleExpand from '../_common/expand';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'oa-sale-expand': SaleExpand,
		'i-input-number': InputNumber,
		'i-cascader': Cascader,
	},
	mixins: [services.departMyStaff()],
	data() {
		const { query = {} } = this.$route;
		if (query.time_last_left) {
			query.time_last_left = parseFloat(query.time_last_left);
		}
		if (query.time_last_right) {
			query.time_last_right = parseFloat(query.time_last_right);
		}
		const temp = {
			depart_ids: [],
			staff_id: '',
			depart_id: '',
		};
		if (query.depart_ids) {
			temp.depart_ids = query.depart_ids.split(',');
			temp.staff_id = query.staff_id || '';
			temp.depart_id = query.depart_id || '';

		}
		return {
			query: {
				keyword: '',
				type: null,
				status: null,
				start_time: undefined,
				end_time: "",
				responsibility: "",
				time_last_left: null,
				time_last_right: null,
				list_type: '',
				...query,
				...temp
			},
			charge: _global.staff.charge
		};
	},
	computed: {
		showCheck() {
			const { query = {} } = this.$route;
			if (this.$auth[1020] && this.$auth[1021]) {
				return query.tab_type == '2' && this.$auth[1018];
			} else {
				return this.$auth[1021] && this.$auth[1018];
			}
		}
	},
	created() {
		if (!this.$route.query.start_time) {
			this.query.start_time = moment().format("YYYY-MM-DD ") + '00:00:00';
			this.handleSearch();
		}
	},
	methods: {
		handleSearch(event) {
			if (this.query.time_last_left != undefined 
			&& this.query.time_last_right != undefined
			&& this.query.time_last_left > this.query.time_last_right) {
				this.$Message.error('请按通话时长区间进行筛选');
				return; 
			}
			this.$router.replace(getHashUrl(
				'/sale/call/record',
				{
					...this.$route.query,
					...this.formatQuery()
				}
			));
			this.$store.commit('SALE_CALL_RECORD_LIST_INIT');
		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		formatQuery() {
			const _query = {};
			Object.keys(this.query).forEach(key => {
				if (this.query[key] instanceof Date) {
					_query[key] = moment(this.query[key]).format("YYYY-MM-DD HH:mm:ss");
				} else {
					_query[key] = this.query[key];
				}
			});
			return _query;
		},
		handleSearchDepart(arr) {
			this.query.depart_ids = arr;
			const str = arr[arr.length - 1];
			if (str) {
				const [depart_id, staff_id] = str.split('-');
				this.query.depart_id = depart_id;
				this.query.staff_id = staff_id;
			} else {
				this.query.depart_id = '';
				this.query.staff_id = '';
			}
			this.handleSearch();
		},
		handleTimeLastLeftChange(val) {
			if (this.timeLastLeft == val) return;
			this.timeLastLeft = val;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},	
		
		handleTimeLastRightChange(val) {
			if (this.timeLastRight == val) return;
			this.timeLastRight = val;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
	}
};
</script>

<style lang="scss" scoped>
</style>
