<template>
	<div class="v-sale-main-work-data-detail-filter g-m-t-15">
		<div>
			<i-date-picker
				v-model="query.dateRange"
				:clearable="false"
				:options="datePickerOption"
				type="daterange"
				placeholder="请选择时间范围"
				split-panels
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleTimeChange"
			/>
			<i-button type="primary" @click="handleSearch">搜索</i-button>
		</div>
		<div class="_count g-m-t-20">
			<div class="g-flex g-jc-sa _item">
				<div v-for="item in countList" :key="item.key" class="__count-block">
					<div class="__label">
						{{ item.label }}
					</div>
					<div class="__value">
						{{ item.value }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Input, InputNumber, Button, Icon, DatePicker, Cascader, Dropdown, DropdownMenu, DropdownItem, Select, Option } from 'iview';
import { debounce } from 'lodash';
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/sale';
import { TableTitle } from '@components/_common/table-title/table-title';
import SaleExpand from '@components/sale/_common/expand';
import timeSearchMixin from '../main-work-data/_common/timeSearchMixin';


export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-button': Button,
		'i-icon': Icon,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'oa-sale-expand': SaleExpand,
		'i-cascader': Cascader,
	},
	mixins: [timeSearchMixin],
	data() {
		const query = this.$route.query;
		return {
			query: {
				dateRange: [query.start_time, query.end_time].filter(Boolean),
			},
			countList: [
				{ key: 'add_num', label: '添加客户', value: '' },
				{ key: 'get_num', label: '领取客户数', value: '' },
				{ key: 'call_num', label: '拨号数量', value: '' },
				{ key: 'connect_num', label: '接通数量', value: '' },
				{ key: 'connect_rate', label: '接通率', value: '' },
				{ key: 'total_call_time', label: '总通话时长', value: '' },
				{ key: 'max_call_time', label: '最长通话时长', value: '' },
				{ key: 'connect_num_count', label: query.config_time + 's以上电话', value: '' }
			]
		};
	},
	watch: {

	},
	mounted() {
		this.handleSearch();
	},
	methods: {
		handleSearch() {
			this.$request({
				url: "_SALE_MAIN_WORK_DATA_DAILING_COUNT",
				type: "GET",
				param: {
					start_time: moment(this.query.dateRange[0]).format("YYYY-MM-DD"),
					end_time: moment(this.query.dateRange[1]).format("YYYY-MM-DD"),
					staff_id: this.$route.query.staff_id
				},
				loading: false,
			}).then(({ data }) => {
				this.countList.forEach(it => {
					it.value = data[it.key] || 0;
				});
				// this.countList[5].label = data.max_call_time + 's以上电话';
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
			
		},
		
		
	}
};
</script>
<style lang="scss">
.v-sale-main-work-data-detail-filter {
	._count {
		padding: 20px;
		background-color: #f5f5f6;
	}
	.__count-block {
		width: 12.5%;
		padding: 20px 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.__label {
			color: #818794;
			font-size: 14px;
		}
		.__value {
			color: #333;
			font-size: 24px;
			margin-top: 5px;
		}
	}
	.__count-block+.__count-block {
		border-left: 1px solid #d4d7db;
	}
}
</style>