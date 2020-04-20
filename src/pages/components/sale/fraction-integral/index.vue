<template>
	<div class="v-sale-fraction-integral">
		<div class="g-m-b-20 g-flex g-jc-fe">
			<i-button v-if="$auth[515]" class="_btn" @click="handleIntegralSub">下级积分</i-button>
		</div>
		<oa-fraction-basic-info :staff-info="staff_info"/>
		<div class="_tab-integral g-m-t-10">
			<i-tabs
				value="month"
				@on-click="handleChangeIntegralTab"
			>
				<i-tab-pane 
					label="积分概览" 
					name="month" 
				>
					<oa-fraction-index>
						<oa-fraction-index-month slot="month" :month-info="month_info" type="积分"/>
					</oa-fraction-index>
				</i-tab-pane>
				<i-tab-pane 
					label="年度积分" 
					name="year" 
				>
					<oa-fraction-index>
						<oa-fraction-index-year slot="year" :year-info="year_info" type="积分"/>
					</oa-fraction-index>
				</i-tab-pane>
			</i-tabs>
		</div>
		<div class="_integral-detail g-fs-14 g-m-tb-20">
			<span class="__title-bar"/>
			<span class="g-pd-l-10">年度积分</span>
		</div>
		<i-collapse v-model="arrow" simple>
			<i-panel :hide-arrow="true" name="1">
				<div class="g-bg-light3 g-flex g-jc-sb g-pd-lr-15">
					<span class="g-c-black1">积分详情</span>
					<div>
						<span v-if="arrow.includes('1')" class="g-c-blue-mid">收起</span>
						<span v-else class="g-c-blue-mid">展开</span>
					</div>
				</div>
				<div slot="content">
					<oa-fraction-detail :detail="detail" fraction-type="积分详情"/>
				</div>
			</i-panel>
		</i-collapse>
		<div class="_integral-detail g-fs-14 g-m-tb-20">
			<span class="__title-bar"/>
			<span class="g-pd-l-10">得分详情</span>
			<i-date-picker
				v-model="keywords.month"
				:options="{disabledDate: (time) => {return time.getTime() > Date.now();}}"
				format="yyyy-MM" 
				type="month"
				clearable
				placeholder="请选择月份"
				class="g-m-l-5"
				style="width: 220px;height: 32px;"
				@on-change="handleMonthChange"
			/>
		</div>
		<div
			v-if="!pointDetail.length"
			class="g-tc"
		>
			<div>
				<img :src="OSS_SEARCH_EMPTY" >
				<div class="g-tc">暂无数据</div>
			</div>
		</div>
		<div v-else>
			<div 
				v-for="(item, index) in pointDetail"
				:key="index"
				class="g-m-b-10"
				style="border: 1px solid #E8E8E8;"
			>
				<div class="_tabpane-index">
					<div class="g-flex g-jc-sb __index-top">
						<span>{{ item.type_name }}</span>
						<span class="g-c-red-mid">总分：{{ item.sum }}分</span>
					</div>
				</div>
				<div class="_index-content g-flex g-fw-w">
					<div 
						v-for="(it, i) in item.detail" 
						:key="i"
						:class="setBorderBottom(i,item.detail.length)"
						class="__info-box"
						style="width: 33.3%;"
					>
						<div 
							v-for="(_item, _index) in it" 
							:key="_index" 
							class="__index-info"
						>
							<div class="g-flex g-jc-sb g-lh-30">
								<div>
									<span 
										v-if="_item.is_manmade && !_item.is_update" 
										class="g-inline-block g-tc __status"
									>
										新
									</span>
									<i-tooltip 
										v-if="_item.is_update"
										:content="_item.remarks"
										transfer
										max-width="300"
									>
										<span class="g-inline-block g-tc __status">改</span>
									</i-tooltip>
									<i-tooltip 
										v-if="_item.reason.length > 15"
										:content="_item.reason"
										transfer
										max-width="300"
									>
										<span class="g-c-black1">{{ _item.reason.substr(0, 15) + '...' }}</span>
									</i-tooltip>
									<span v-else class="g-c-black1">{{ _item.reason }}</span>
								</div>
								<div 
									class="g-tl" 
									style="width: 30px;"
								>
									<span class="g-c-black1">
										{{ _item.point > 0 ? `+${ _item.point}` : `${ _item.point}` }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Button, DatePicker, Tabs, TabPane, Collapse, Panel, Tooltip } from 'iview';
import { debounce } from 'lodash';
import moment from "moment";
import { getParseUrl, getHashUrl } from '@utils/utils';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { FractionBasicInfo } from "../_common/fraction/basic-info";
import { FractionIndex } from "../_common/fraction/index";
import { FractionIndexMonth } from "../_common/fraction/index-month";
import { FractionIndexYear } from "../_common/fraction/index-year";
import { FractionDetail } from '../_common/fraction/detail';

export default {
	name: 'oa-fraction-integral',
	components: {
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		"i-collapse": Collapse,
		"i-panel": Panel,
		'i-tooltip': Tooltip,
		'oa-fraction-basic-info': FractionBasicInfo,
		'oa-fraction-index': FractionIndex,
		'oa-fraction-index-month': FractionIndexMonth,
		'oa-fraction-index-year': FractionIndexYear,
		'oa-fraction-detail': FractionDetail
	},
	data() {
		const { query = {} } = this.$route;

		return { 
			OSS_SEARCH_EMPTY,
			visible: false,
			arrow: [],
			detail: [], // 年度详情
			pointDetail: [], // 得分详情
			staff_info: {}, // 员工信息
			keywords: {
				month: '', // 开始月份
				...query,
			},
			month_info: {// 月度积分
				detail: [],
				sum: ''
			},
			year_info: {// 年度积分
				detail: [],
				sum: '',
				usable_sum: ''
			},
			integralTabs: 'month',
			indexTabs: 'apprentice'
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.loadStaffData();
			this.loadIntegralData();
			this.loadPointData(this.keywords);
		},
		/**
		 * 个人详情
		 */
		loadStaffData() {
			this.$request({
				url: '_SALE_TRAIN_INTEGRAL_STAFF_INFO_GET',
				type: 'GET',
				loading: false,
				param: { 
					staff_id: this.$global.staff.staff_id
				},
				autoTip: false
			}).then(res => {
				this.staff_info = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 积分详情
		 */
		loadIntegralData() {
			this.$request({
				url: '_SALE_TRAIN_INTEGRAL_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: { 
					staff_id: this.$global.staff.staff_id,
					cate: 1
				},
				autoTip: false
			}).then(res => {
				this.month_info = res.data.month;
				this.year_info = res.data.year;
				this.detail = res.data.detail;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 得分详情
		 */
		loadPointData(params) {
			this.pointDetail = [];
			let temp = { month: moment(params.month).format('YYYY-MM') } || {};
			this.$request({
				url: '_SALE_TRAIN_INTEGRAL_POINT_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: { 
					staff_id: this.$global.staff.staff_id,
					cate: 1,
					...temp
				},
				autoTip: false
			}).then(res => {
				if (Array.isArray(res.data)) {
					 res.data.forEach(item => {
						 const detail = [];
						 item.detail.forEach((it, i) => {
							const index = parseInt(i / 5, 10);
							if (!detail[index]) detail[index] = [];
							detail[index].push(it);
						 });
						 item.detail = detail;
					 });
					this.pointDetail = res.data;
				}
			}).catch(error => {});
		},
		/**
		 * 监听选择开始月份的on-change事件
		 */
		handleMonthChange(val) {
			this.keywords.month = val;
			this.handleSearch();
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.$router.replace(getHashUrl(
				'/sale/fraction/integral',
				this.keywords
			));
			this.loadPointData(this.keywords);
		}, 300),
		/**
		 * 切换tab
		 */
		handleChangeIntegralTab(name) {
			this.integralTabs = name;
		},
		handleChangeIndexTab(name) {
			this.indexTabs = name;
		},
		/**
		 * 下级积分
		 */
		handleIntegralSub() {
			this.$router.push({
				name: 'sale-fraction-integral-sub'
			});
		},
		setBorderBottom(i, length) {
			const l = length % 3;
			return { '__info-box-border': l == 0 ? i > length - 4 : i > length - l - 1 };
		}
	},
};
</script>

<style lang="scss">
.v-sale-fraction-integral {
	._btn {
		border-color: #e84854;
		color: #e84854;
		&:hover {
			background-color: #e84854!important;
			color: #fff!important;
		}
	}
	._tab-integral {
		.ivu-tabs .ivu-tabs-tabpane {
			background-color: #f6f6f6;
			text-align: center;
		}
		.ivu-tabs-tab-focused {
			color: #e74854;
			border-bottom: 3px #e74854 solid !important;
		}
	}
	._tabpane-index {
		border: 2px solid #f6f6f6;
		.__index-top {
			background-color: #f6f6f6;
			border-radius: 4px;
			padding: 10px 18px;
		}
	}
	._index-content {
		padding: 0;
		.__status {
			width: 23px;
			height: 14px;
			border-radius: 2px;
			line-height: 14px;
			background-color: rgba(237,143,74,0.3);
			color: #ED8F4A;
		}
		.__info-box {
			border-right: 1px solid #E8E8E8;
			border-bottom: 1px solid #E8E8E8;
			&:not(:nth-child(1)), &:nth-child(3n + 1) {
				padding: 0 20px;
			}
			&:last-child:first-child {
				border: none;
			}
			&:last-child:not(:first-child), &:nth-child(3n) {
				padding-left: 20px;
				border-right: none;
			}
		}
		.__info-box-border{
			border-bottom: none;
		}
	}
	._integral-detail {
		.__title-bar {
			display: inline-block;
			width: 2px;
			height: 14px;
			position: relative;
			top: 2px;
			background-color: #e84854;
		}
	}
	.ivu-tabs-bar {
		border: none;
	}
	.ivu-tabs-tab {
		padding: 6px 0;
		min-width: inherit;
		&:last-child {
			margin-left: 50px;
		}
	}
	.ivu-tabs-tab:hover {
		color: #e84854;
	}
	.ivu-tabs-nav .ivu-tabs-tab-active {
		color: #e84854;
	}
	.ivu-tabs-ink-bar {
		background-color:#e84854;
		display: none;
	}
	.ivu-collapse {
		border: none;
	}
	.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
		padding-left: 0;
	}
	.ivu-collapse-content {
		padding: 0;
	}
	.ivu-collapse-item {
		border-top: none;
	}
}
</style>
