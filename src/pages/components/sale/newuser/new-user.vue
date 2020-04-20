<template>
	<div class="v-statistics-quality-rank">
		<div class="g-m-t-20">
			<div>
				<i-date-picker
					v-model="month"
					class="g-m-l-20"
					type="month"
					placeholder=" 请选择时间"
					style="width: 220px"
					@on-change="handleStartTime"
				/>
				<i-cascader
					v-if="departMyStaff.length>0"
					v-model="query.depart_ids "
					:data="departMyStaff ||[]"
					clearable
					change-on-select
					placeholder="请选择部门"
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleSearchDepart"
				/>
				<i-select
					v-model="query.staff_id"
					:remote-method="remote1"
					:loading="loading"
					placeholder="请输入服务人姓名"
					filterable
					clearable
					transfer
					remote
					multiple
					class="g-m-r-5"
					style="width: 220px"
					@on-change="handleSearch()"
				>
					<i-option
						v-for="(option, index) in staffList"
						:value="option.staff_id"
						:key="index"
					>{{ option.staff_name }}</i-option>
				</i-select>
				<i-button
					type="primary"
					style="margin-left:5px"
					class="g-m-l-2"
					@click="handleSearch"
				>搜索</i-button>
			</div>
		</div>
		<div class="_quailty g-m-20">
			<div class="g-m-20 __echarts">
				<div class="g-tr g-c-black1 g-fs-16">
					<span class="g-m-r-20">
						累积添加客户{{ list.add_num }}个
					</span>
					<span>
						领取客户{{ list.get_num }}个
					</span>
				</div>
				<div
					v-if="1"
					:style="{ minWidth: '800px',maxWidth:'1400px', height:'400px'}"
				>
					<oa-echarts :options="option" :auto-resize="true"/>
				</div>
				<div
					v-else
					:style="{ minWidth: '800px',maxWidth:'1400px', height:'400px'}"
					class="g-flex-cc g-flex-ac g-fd-c"
				>
					<img :src="OSS_SEARCH_EMPTY">
					<div class="g-tc">暂无数据，赶快添加一条吧~</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Cascader, Select, Option } from 'iview';
import moment from 'moment';
import { services } from "@stores/services/sale";
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { Echarts } from "wya-vc";
import API from "@stores/apis/root";

export default {
	name: 'oa-tpl',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'oa-echarts': Echarts,
		'i-cascader': Cascader,
	},
	mixins: [services.departMyStaff()],
	data() {
		const date = moment().format('YYYY');
		return {
			OSS_SEARCH_EMPTY,
			month: '', // 开始时间
			depart_id: [], // 组织
			loading: false,
			staffList: [],

			query: {
				depart_ids: [],
				depart_id: '',
				staff_id: '',
			},
			list: {},
			tabList: ['添加客户', '领取客户'],
			option: {
				color: ['#2397f9', '#FF8134'],
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'line' // 默认为直线，可选为：'line' | 'shadow'
					},
				},
				xAxis: {
					type: 'category',
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				},
				yAxis: {
					type: 'value'
				},
				series: [{
					name: '添加客户',
					data: [],
					type: 'line',
				},
				{
					name: '领取客户',
					data: [],
					type: 'line',
				}
				]
			}
		};
	},
	computed: {
		level() {
			if (this.$global.staff.is_charge == 1) {
				return 3; // 超管
			} else if (this.$global.staff.depart_is_charge == 1 && this.$global.staff.depart_lowest == 1) {
				return 1; // 经理
			} else if (this.$global.staff.depart_is_charge == 1 && this.$global.staff.depart_lowest == 0) {
				return 2; // 总监
			} else if (this.$global.staff.depart_is_charge == 0) {
				return false; // 员工
			}
		}

	},
	created() {
		this.month = moment().format('YYYY-MM');
		this.loadData();
		this.remote1(1);
	},
	methods: {
		handleSearchDepart(arr) {
			this.query.depart_ids = arr;
			const [depart_id, staff_id] = arr[arr.length - 1].split('-');
			this.query.depart_id = depart_id;
			this.query.staff_id = staff_id;
			this.handleSearch();
		},
		remote1(query) {
			if (query !== '') {
				this.loading = true;
				return this.$request({
					url: "_CONTENT_CONFIG_GET_ALL_STAFF_BY_SEARCH_GET",
					type: 'GET',
					param: {
						search: query == 1 ? '' : query // 为了能搜索到全部的员工数据（手机号码必定有1）
					},
					loading: false
				}).then((res) => {
					this.loading = false;
					this.staffList = res.data;
				});
			}
		},

		handleSearch() {
			this.loadData();
		},
		handleStartTime(v) {
			this.month = v;
			this.loadData();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		loadData() {
			this.$request({
				// url: API._SALE_MAIN_MORE_NEW_CUSTOMER_GET,
				type: "GET",
				loading: false,
				param: {
					...this.query,
					month: this.month,
				}
			}).then(res => {
				this.option.series[0].data = res.data.add_array || [];
				this.option.series[1].data = res.data.get_array || [];
				this.option.xAxis.data = res.data.time_line || [];
				this.list = res.data;
				this.option.tooltip = {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'line' // 默认为直线，可选为：'line' | 'shadow'
					},
				};
			}).catch(err => {
			});
		}
	},
};
</script>

<style lang="scss" scoped>
    .v-statistics-quality-rank {
        ._quailty {
            border: 1px solid #ebeef1;
            border-radius: 4px;
            overflow: hidden;
            .__title {
                height: 50px;
                line-height: 50px;
                padding-left: 20px;
                font-size: 14px;
                color: #333333;
                background: #f8f8f8;
            }
            .__echarts {
                border-bottom: 1px solid #ebeef1;
            }
        }
        ._quailty:hover {
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.1);
        }
        ._tabs {
            div {
                padding-bottom: 5px;
                cursor: pointer;
            }
        }
        .active {
            border-bottom: 2px solid #d9444f;
            color: #d9444f;
        }
    }
</style>
