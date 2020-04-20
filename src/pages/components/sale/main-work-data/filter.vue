<template>
	<div class="v-sale-main-work-data-filter">
		<div style="margin-top: 15px">
			<div>
				<i-date-picker
					v-model="query.dateRange"
					:options="datePickerOption"
					:clearable="false"
					type="daterange"
					placeholder="请选择时间"
					style="width: 220px"
					class="g-m-r-5"
					split-panels
					transfer
					@on-change="handleTimeChange"
				/>
				<i-cascader
					v-if="showDepart"
					v-model="query.depart_ids"
					:data="departAll"
					style="width: 220px; display: inline-block"
					class="g-m-r-5"
					trigger="click"
					placeholder="请选择部门"
					clearable
					transfer
					change-on-select
					@on-change="handleSearch"
				/>
				<i-select
					v-if="showStaff"
					v-model="query.staff_ids"
					:max-head-height="96"
					placeholder="请选择员工"
					class="g-m-r-5"
					style="width: 220px"
					filterable
					clearable
					multiple
					transfer
					@on-change="handleSearch"
				>
					<i-option
						v-for="(option, index) in staffList"
						:value="option.staff_id"
						:key="index"
					>{{ option.staff_name }}</i-option>
				</i-select>
				<i-button
					type="primary"
					class="g-m-r-5"
					@click="handleSearch"
				>搜索</i-button>
				<i-button type="primary" class="g-fr g-m-r-20" @click="handleExport">导出</i-button>
			</div>
		
		</div>
	</div>
</template>

<script>
import { getParseUrl, getHashUrl } from '@utils/utils';
import { Input, Button, DatePicker, Cascader, Select, Option } from 'iview';
import moment from 'moment';
import { debounce } from 'lodash';
import { services } from "@stores/services/sale";
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { Echarts } from "wya-vc";
import API from "@stores/apis/root";
import timeSeachMixin from './_common/timeSearchMixin';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'oa-echarts': Echarts,
		'i-cascader': Cascader,
	},
	mixins: [services.departAll(), timeSeachMixin],
	data() {
		const { query = {} } = this.$route;
		let startDate_;
		let	endDate_;
		if (query.start_time) {
			startDate_ = query.start_time;
			endDate_ = query.end_time;
		} else {
			startDate_ = moment().month(moment().month()).startOf('month').toDate();
			endDate_ = moment().endOf('month').toDate();
		}

		const dateRange = [startDate_, endDate_];
		return {
			OSS_SEARCH_EMPTY,
			showDepart: false,
			showStaff: false,
			loading: false,
			staffList: [],
			list: {},
			query: {
				dateRange, // 开始时间
				depart_ids: query.depart_ids ? query.depart_ids.split(",").map(item => Number(item)) : [],
				staff_ids: query.staff_ids ? query.staff_ids.split(',').map(Number) : []
			},
		};
	},
	computed: {
		
		
	},
	created() {
		this.initSearch();

	},
	mounted() {
		this.loadIdentity();
		if (this.$global.staff.charge) {
			this.showStaff = true;
			this.loadStaffList();
		} else this.loadJianManage();
	},
	methods: {
		// 如果员工的主部门和兼部门中没有二级部门或二级部门以上的管理（二级部门指的是战区），那么就不需要显示部门筛选（
		loadIdentity(v) {
			this.$request({
				url: '_SALE_MAIN_NEW_CUSTOMER_SHOW_DEPART_SEARCH_GET',
				type: "GET",
				param: {
					staff_id: this.$global.staff.staff_id
				},
				loading: false,
			}).then((res) => {
				this.showDepart = res.data[0];
			}).catch((err) => {
				console.error(err);
			});
		},
		// 是主管理或者是兼部门管理就显示
		loadJianManage() {
			this.$request({
				url: '_SALE_MAIN_NEW_CUSTOMER_SHOW_STAFF_SEARCH_GET',
				type: "GET",
				param: {
					staff_id: this.$global.staff.staff_id,
					type: 2
				},
				loading: false,
			}).then((res) => {
				this.showStaff = !!res.data.length;
				this.showStaff && this.loadStaffList();
			}).catch((err) => {
				console.error(err);
			});


		},
		handleSearch: debounce(function (event) {
			this.initSearch();
		}, 200),
		initSearch() {
			if (this.query.staff_ids.length > 10) {
				this.query.staff_ids.pop();
				this.$Message.error('最多可搜索10名员工');
				return;
			}
			const query = this.formatQuery();
			this.$router.replace(getHashUrl(
				'/sale/main/work/data',
				{
					...this.$route.query,
					...query
				}
			));
			this.$store.commit('SALE_MAIN_WORK_DATA_LIST_INIT');
			this.$vc.emit('SALE_MAIN_WOEK_DATA_SEARCH', query);

		},
		formatQuery() {
			const _query = {
				start_time: this.query.dateRange[0] ? moment(this.query.dateRange[0]).format('YYYY-MM-DD') : '',
				end_time: this.query.dateRange[1] ? moment(this.query.dateRange[1]).format('YYYY-MM-DD') : '',
				depart_ids: this.query.depart_ids.join(','),
				staff_ids: this.query.staff_ids.join(',')
			};
			return _query;

		},
		loadStaffList() {
			return this.$request({
				url: "_HR_ARCHIVES_ACHIE_GET_STAFF_BY_DEPART_GET",
				type: 'GET',
				param: {
					type: 2,
					is_page: 0,
					is_has_leave: 0
				},
				loading: false
			}).then((res) => {
				this.staffList = res.data;
			});
			
		},
		handleExport() {
			window.open(getHashUrl(API.SALE_MAIN_WORK_DATA_LIST_GET, {
				...this.$route.query,
				export: 1,
				'-token': this.$global.token
			}));
		},
	}
};

</script>

<style lang="scss" scoped>
    .v-sale-main-work-data-filter{
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
    }
</style>
