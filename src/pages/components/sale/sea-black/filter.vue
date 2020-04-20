<template>
	<div class="v-sale-black-filter js-filter">
		<div>
			<i-input
				v-model.trim="keywords.search"
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
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top:3px;padding-bottom:7px;"
			>
				<span @keyup.enter="handleSearch">
					<i-input-number
						v-model="keywords.mark_times_min"
						:min="0"
						placeholder="最小标记次数"
						style="width:100px;"
						@on-change="handleMinChange"
					/>
				</span>
				<span style="margin-left:3px;margin-right:3px">~</span>
				<span @keyup.enter="handleSearch">
					<i-input-number
						v-model="keywords.mark_times_max"
						:min="0"
						placeholder="最大标记次数"
						style="width:100px;margin-right:5px;"
						@on-change="handleMaxChange"
					/>
				</span>
				<i-date-picker
					v-model="keywords.recovery_time"
					format="yyyy-MM-dd HH:mm"
					type="datetimerange"
					clearable
					split-panels
					placeholder="选择回收区间"
					style="width:220px;"
					class="g-m-r-5"
					@on-change="handleDateChange"
					@on-ok="handleSearch"
				/>
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
				<i-select
					v-model="keywords.confirm_mode"
					placeholder="请选择确认方式"
					style="width:220px"
					clearable
					@on-change="handleSearch"
				>
					<i-option value="1">人为确认</i-option>
					<i-option value="2">系统确认</i-option>

				</i-select>
				<i-select
					v-model="keywords.type_name"
					placeholder="请选择标记原因"
					style="width:220px"
					clearable
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item,index) in otherConfig.sign || []"
						:key="index"
						:value="item.reason"
					>
						{{ item.reason }}
					</i-option>
				</i-select>

			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader, Select, Option, DatePicker, InputNumber } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { services } from '@stores/services/sale';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-black-filter',
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
	mixins: [services.industryList(), services.region3(), services.otherConfig()],
	data() {
		const { query = {} } = this.$route;
		const address = [];
		query.province && address.push(+query.province);
		query.city && address.push(+query.city);
		query.area && address.push(+query.area);
		return {
			show: false,
			keywords: {
				search: '',
				province: '',
				city: '',
				area: '',
				industry: '',
				recovery_time_start: '',
				recovery_time_end: '',
				type_name: '',
				confirm_mode: '',
				...query,
				recovery_time: [query.recovery_time_start, query.recovery_time_end],
				address,
				mark_times_min: parseInt(query.mark_times_min, 10) || null,
				mark_times_max: parseInt(query.mark_times_max, 10) || null

			},
		};
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
		 * 移除获取焦点事件 标记次数（最小值）
		 */
		handleMinChange(val) {
			if (this.min == val) return;
			this.min = val;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		/**
		 * 移除获取焦点事件 标记次数（最大值）
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
			this.keywords.recovery_time_start = arr[0];
			this.keywords.recovery_time_end = arr[1];
			if (!this.keywords.recovery_time_start && !this.keywords.recovery_time_end) {
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
				'/sale/sea/black',
				{
					...this.keywords,
					recovery_time: undefined,
					address: undefined
				}
			));
			this.$store.commit('SALE_SEA_BLACK_LIST_INIT');
		}, 300),
		/**
		 * 点击更多搜索条件
		 */
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss">
.v-sale-black-filter {
	._btn {
		width: 60px;
	}
	.ivu-input-number-handler-wrap {
		display: none;
	}
}
</style>
