<template>
	<div class="js-filter">
		<div class="g-flex g-ai-c g-jc-sb">
			<div>
				<i-input
					v-model="data.search"
					:maxlength="50"					 
					placeholder="请输入公司名称，姓名和手机号" 
					style="width: 300px"
					clearable
					@on-change="handleSearch" 
					@on-enter="handleSearch"
				/>
				<i-button
					type="primary"
					class="g-m-l-5"
					@click="handleSearch"
				>
					搜索
				</i-button>
				<span 
					class="g-m-l-20 g-c-black3 g-fs-12 g-pointer"
					@click="handleToggle" 
				>
					更多搜索条件
					<i 
						:class="show ? 'icon-triangle-up' : 'icon-triangle-down'" 
						class="iconfont g-fs-12 g-c-black-dark"
					/>
				</span>
			</div>
			<div v-if="$auth['103']" class="g-red-btn-line" @click="handleExport">导出</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px; padding-bottom: 7px"
			>
				<i-input
					v-model="data.staff_search"  
					placeholder="请输入邀约人姓名或手机号" 
					style="width: 220px"
					class="g-m-r-5" 
					clearable
					@on-change="handleSearch" 
					@on-enter="handleSearch"
				/>
				<i-cascader
					v-model="data.depart_id"
					:data="departArr" 
					placeholder="请选择组织"
					change-on-select
					transfer
					clearable
					style="width: 220px"
					class="g-m-r-5" 
					@on-change="handleSearch" 
				/>
				<i-datepicker
					v-model="data.first_deal_time_start" 
					placeholder="成交时间(起始)"
					transfer
					clearable
					style="width: 220px"
					class="g-m-r-5"  
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="data.first_deal_time_end" 
					placeholder="成交时间(结束)"
					transfer
					clearable
					style="width: 220px"
					class="g-m-r-5"  
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="data.last_deal_time_start" 
					placeholder="最近成交时间(起始)"
					transfer
					clearable
					style="width: 220px"
					class="g-m-r-5"  
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="data.last_deal_time_end" 
					placeholder="最近成交时间(结束)"
					transfer
					clearable
					style="width: 220px"
					class="g-m-r-5"  
					@on-change="handleSearch"
				/>
				<i-select
					v-model="data.invoice_status" 
					placeholder="请选择是否开票"
					transfer
					clearable
					style="width: 220px"
					class="g-m-r-5"  
					@on-change="handleSearch"
				>
					<i-option 
						v-for="item of ticketType"
						:key="item.value"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
				<i-select
					v-model="data.tag"
					placeholder="请选择标签"
					style="width:220px"
					clearable
					transfer
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item,index) in tagList"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>

			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader, DatePicker, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl, formatMoment, getItem } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { services } from '@stores/services/finance';
import { ticketType } from './constants';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-cascader': Cascader,
		'i-datepicker': DatePicker,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option
		 
	},
	mixins: [services.departArr()],
	data() {
		const { query = {} } = this.$route;
		return {
			data: {
				...query,
				depart_id: query.depart_id && query.depart_id.split(',').map(item => Number(item))
			},
			show: false,
			ticketType,
			tagList: [
				{ label: '复购', value: '1' },
				{ label: '续费', value: '2' },
				{ label: '打折', value: '3' }
			]
		};
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/finance/customer/nego', 
				{  
					...this.data,
					first_deal_time_start: formatMoment(this.data.first_deal_time_start),
					first_deal_time_end: formatMoment(this.data.first_deal_time_end),
					last_deal_time_start: formatMoment(this.data.last_deal_time_start),
					last_deal_time_end: formatMoment(this.data.last_deal_time_end)
				}
			));
			this.$store.commit('FINANCE_CUSTOMER_NEGO_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleExport: debounce(function () {
			const { query = {} } = this.$route;
			window.open(getHashUrl(API_ROOT._FINANCE_DEAL_EXPORT_LIST_GET, {
				...query,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		}, 300)
	}
};

</script>

<style lang="scss" scoped>

</style>
