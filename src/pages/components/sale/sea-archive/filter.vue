<template>
	<div class="v-sale-sea-archive-filter js-filter">
		<div class="g-flex g-jc-sb">
			<div>
				<i-input
					v-model.trim="keywords.company_name"
					:maxlength="50"
					clearable
					placeholder="请输入公司名称进行搜索"
					style="width:300px;height:32px;"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-button
					type="primary"
					class="g-m-l-5"
					@click="handleSearch"
				>
					搜索
				</i-button>
				<span
					class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer"
					@click="handleToggle"
				>
					更多搜索条件
					<i
						:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
						class="iconfont g-fs-12 g-c-black-dark"
					/>
				</span>
			</div>
		</div>
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top:3px;padding-bottom:7px;">
				<i-cascader
					:data="region3"
					v-model="keywords.address"
					change-on-select
					clearable
					class="g-m-r-5"
					placeholder="选择地区"
					style="width:220px;"
					@on-change="handleRegionChange"
				/>
				<i-select
					v-model="keywords.industry"
					clearable
					transfer
					style="width:220px;"
					class="g-m-r-5"
					placeholder="选择行业"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in industryList"
						:value="String(item.industry_id)"
						:key="item.industry_id"
					>
						{{ item.industry_name }}
					</i-option>
				</i-select>
				<i-date-picker
					v-model="keywords.recovery_time"
					format="yyyy-MM-dd HH:mm"
					type="datetimerange"
					clearable
					split-panels
					placeholder="选择回收区间"
					style="width:250px;"
					class="g-m-r-5"
					@on-change="handleDateChange"
					@on-ok="handleSearch"
				/>
				<span @keyup.enter="handleSearch">
					<i-input-number
						v-model="keywords.capital_min"
						:min="1"
						:max="99999999.99"
						placeholder="注册资金最小值（万）"
						style="width:220px;margin-right:5px;"
						@on-change="handleMinChange"
					/>
				</span>
				<span @keyup.enter="handleSearch">
					<i-input-number
						v-model="keywords.capital_max"
						:min="1"
						:max="99999999.99"
						placeholder="注册资金最大值（万）"
						style="width:220px;margin-right:5px;"
						@on-change="handleMaxChange"
					/>
				</span>
				<span @keyup.enter="handleSearch">
					<i-input-number
						v-model="keywords.turn_min"
						:min="0"
						placeholder="最小转手次数"
						style="width:100px;"
						@on-change="handleMinChange"
					/>
				</span>
				<span style="margin-left:3px;margin-right:3px">~</span>
				<span @keyup.enter="handleSearch">
					<i-input-number
						v-model="keywords.turn_max"
						:min="0"
						placeholder="最大转手次数"
						style="width:100px;margin-right:5px;"
						@on-change="handleMaxChange"
					/>
				</span>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader, Select, Option, DatePicker, InputNumber } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/sale';

export default {
	name: 'oa-sea-archive-filter',
	components: {
		'i-input': Input,
		'i-cascader': Cascader,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-input-number': InputNumber,
		'i-button': Button,
		'vc-expand': Expand
	},
	mixins: [services.region3()],
	data() {
		const { query = {} } = this.$route;
		const address = [];
		query.province && address.push(+query.province);
		query.city && address.push(+query.city);
		query.area && address.push(+query.area);
		return {
			show: true,
			keywords: {
				company_name: '',
				province: '',
				city: '',
				area: '',
				industry: '',
				start_time: '',
				end_time: '',
				...query,
				recovery_time: [query.start_time, query.end_time],
				address,
				capital_min: parseInt(query.capital_min, 10) || null,
				capital_max: parseInt(query.capital_max, 10) || null,
				turn_min: parseInt(query.turn_min, 10) || null,
				turn_max: parseInt(query.turn_max, 10) || null,
			}
		};
	},
	computed: {
		industryList() {
			return this.$store.state.saleSeaArchive.industryList || [];
		}
	},
	methods: {
		/**
		 * 监听Input组件的change事件
		 */
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		/**
		 * 移除获取焦点事件 注册资金/转手次数最小值
		 */
		handleMinChange(val) {
			if (this.min == val) return;
			this.min = val;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		/**
		 * 移除获取焦点事件 注册资金/转手次数最大值
		 */
		handleMaxChange(val) {
			if (this.max == val) return;
			this.max = val;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		/**
		 * 监听时间选择器的on-change事件
		 */
		handleDateChange(arr) {
			this.keywords.start_time = arr[0];
			this.keywords.end_time = arr[1];
			if (!this.keywords.start_time && !this.keywords.end_time) {
				this.handleSearch();
			}
		},
		/**
		 * 监听地区的选择
		 */
		handleRegionChange(arr) {
			this.keywords.province = arr[0];
			this.keywords.city = arr[1];
			this.keywords.area = arr[2];
			this.handleSearch();
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.$router.replace(getHashUrl(
				'/sale/sea/archive',
				{
					...this.keywords,
					recovery_time: undefined,
					address: undefined
				}
			));
			this.$store.commit('SALE_SEA_ARCHIVE_LIST_INIT');
		}, 300),
		/**
		 * 点击更多搜索条件
		 */
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleToConcern() {
			this.$router.push({
				path: '/sale/sea/archive/concern'
			});
		}

	}
};

</script>

<style lang="scss">
.v-sale-sea-archive-filter {
	._btn {
		border-color: #e84854;
		color: #e84854;
		&:hover {
			background-color: #e84854!important;
			color: #fff!important;
		}
	}
	.ivu-input-number-handler-wrap {
		display: none;
	}
}
</style>
