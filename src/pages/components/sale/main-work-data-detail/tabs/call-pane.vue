oa
<template>
	<i-tab-pane 		
		:label="label+' '+(listInfo.total||0)" 
		:name="name"
		class="v-sale-main-workdata-detail-call-pane"
	>
		<oa-sale-expand :bar="false" :expand="true" class="js-filter" style="margin-bottom:20px">
			<i-input
				slot="prefix"
				v-model="query.keyword"
				:maxlength="50"
				placeholder="请输入客户公司、姓名或手机号"
				style="width: 220px"
				class="g-m-r-5 g-m-l-10"
				clearable
				@on-enter="handleSearch"
				@on-change="handleClear"
			/>
			<i-button
				slot="prefix"
				type="primary"
				class="g-red-btn g-m-l-10"
				@click="handleSearch"
			>搜索</i-button>
			<span slot="toggle" class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer">更多搜索条件</span>
			<div
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top:3px;padding-bottom:7px;"
			>
				<i-date-picker
					v-model="query.dateRange"
					:clearable="false"
					:options="datePickerOption"
					type="daterange"
					placeholder="请选择时间范围"
					class="g-m-r-5"
					style="width: 220px"
					split-panels
					transfer
					@on-change="handleTimeChange"
				/>
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
				<i-input-number 
					v-model="query.min_call_time"
					:max="99999"
					:min="0"
					:precision="0" 
					style="width: 220px;margin-right:5px"
					placeholder="最小通话时长（分钟）" 
					@keyup.native.enter="handleSearch"
				/>
				<i-input-number 
					v-model="query.max_call_time"
					:max="99999"
					:min="0"
					:precision="0"
					class="g-m-r-5"
					style="width: 220px;margin-right:5px"
					placeholder="最大通话时长（分钟）" 
					@keyup.native.enter="handleSearch"
				/>
			</div>
		</oa-sale-expand>
		<vc-paging
			ref="tableTarget"
			:columns="columns"
			:show="show" 
			:data-source="listInfo.data"
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="false"
			:load-data="loadData"
			class=""
			mode="table"
			@page-size-change="handleSearch"
		/>
	</i-tab-pane>
	
</template>
<script>
import { Input, Button, DatePicker, Select, Option, InputNumber, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import moment from 'moment';
import { initPage } from '@utils/utils';
import CusAudio from '@components/sale/_common/audio/audio';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import SaleExpand from '../../_common/expand';
import timeSearchMixin from '../../main-work-data/_common/timeSearchMixin';

export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-tab-pane': TabPane,
		'vc-paging': Paging,
		'oa-sale-expand': SaleExpand
	},
	mixins: [timeSearchMixin],
	props: {
		label: String,
		name: String,
		initDateRange: Array,
		show: Boolean

	},
	data() {
		const query = this.$route.query;
		return {
			query: {
				keyword: '',
				dateRange: this.initDateRange,
				status: '',
				staff_id: query.staff_id,
				min_call_time: null,
				max_call_time: null
			},
			listInfo: {
				...initPage
			},
			columns: [
				{
					title: "录音",
					key: "tape_link",
					width: 350,
					fixed: 'left',
					render: (h, params) => {
						return (
							<CusAudio 
								src={params.row.tape_link} 
								mode="mid" 
								disabled={params.row.agent_duration == '00:00:00'} 
								show-tip="never"
							/>
						);
					}
				},
				{
					title: "公司名称",
					key: "company_name",
					minWidth: 150,
					render: (h, params) => {
						return (
							<div>
								<AutoTooltip 
									content={params.row.company_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: "员工",
					key: "staff_name",
					minWidth: 100,
					render: (h, params) => {
						return (
							<div>
								<AutoTooltip 
									content={params.row.staff_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: "开始时间",
					key: "start_time",
					minWidth: 150,
				},
				{
					title: "通话状态",
					key: "status_str",
					minWidth: 100,
				},
				{
					title: "坐席接听时长",
					key: "agent_duration",
					minWidth: 150
				},
				{
					title: "通话时长",
					key: "call_time",
					minWidth: 150
				}
			],
		};
	},
	methods: {
		handleSearch() {
			this.listInfo = { initPage };

		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		loadData(page, pageSize) {
			const param = {
				...this.formatQuery(),
				page,
				pageSize

			};
			return this.$request({
				url: '_SALE_MAIN_WORK_DATA_MORE_INFO_LIST_CALL_GET',
				type: "GET",
				param,
				loading: false,
			}).then(({ data }) => {
				this.listInfo = {
					...this.listInfo,
					total: data.totalCount,
					data: {
						...this.listInfo.data,
						[page]: data.list
					}
				};
			}).catch((res) => {
				this.$Message.error(res.msg);
			});


		},
		formatQuery() {
			const _query = {};
			Object.keys(this.query).forEach(key => {
				if (key == 'dateRange') {
					const [start_time, end_time] = this.query.dateRange;
					start_time && (_query.start_time = moment(start_time).format("YYYY-MM-DD"));
					end_time && (_query.end_time = moment(end_time).format("YYYY-MM-DD"));
				} else if (this.query[key]) {
					_query[key] = this.query[key];
				}
			});
			return _query;
		},
	}
};
</script>
<style lang="scss">
.v-sale-main-workdata-detail-call-pane {
	.v-sale-audio ._audio {
		background: none;
	}


}
</style>