<template>
	<div class="js-filter">
		<div class="g-flex g-jc-sb">
			<div>
				<i-input
					v-model="data.search"
					:maxlength="50"			 
					placeholder="请输入公司名称,客户姓名和手机号" 
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
			<div>
				<span v-if="$auth['727']" class="g-red-btn-line" @click="handleExport">导出</span>
			</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px; padding-bottom: 7px">
				<i-input
					v-model="data.staff_search"  
					placeholder="请输入邀约人姓名或手机号" 
					style="width: 220px"
					class="g-m-r-5"
					clearable
					@on-change="handleSearch" 
					@on-enter="handleSearch" 
				/>
				<i-input
					v-model="data.product_name"   
					placeholder="请输入产品名称" 
					style="width: 220px" 
					class="g-m-r-5" 
					clearable
					@on-change="handleSearch"
					@on-enter="handleSearch"
				/>
				<i-input
					v-model="data.audit_staff_search"   
					placeholder="请输入审核人姓名或手机号" 
					style="width: 220px"
					class="g-m-r-5" 
					clearable
					@on-change="handleSearch" 
					@on-enter="handleSearch"
				/>
				<i-input
					v-model="data.contract_num"   
					placeholder="请输入合同编号" 
					style="width: 220px"
					class="g-m-r-5"
					clearable
					@on-change="handleSearch"  
					@on-enter="handleSearch"
				/>
				<i-cascader
					v-model="data.depart_id" 
					:data="departArr"
					change-on-select
					transfer
					clearable
					placeholder="请选择组织"
					style="width: 220px" 
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
				<i-select
					v-model="data.contract_type" 
					placeholder="请选择合同类型"
					transfer
					clearable
					style="width: 220px"
					class="g-m-r-5"  
					@on-change="handleSearch"
				>
					<i-option value="0">新建合同</i-option>
					<i-option value="1">补充协议</i-option>
					<i-option value="2">更换产品</i-option>
					<i-option value="3">续费合同</i-option>
					<!-- <i-option value="4">更换产品</i-option> -->
				</i-select>
				<i-datepicker
					v-model="data.actual_month_start" 
					placeholder="选择提成归属月份(开始)"
					type="month"
					transfer
					clearable
					style="width: 220px" 
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="data.actual_month_end" 
					placeholder="选择提成归属月份(结束)"
					type="month"
					transfer
					clearable
					style="width: 220px" 
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="data.create_time_start" 
					placeholder="下单时间(起始)"
					transfer
					clearable
					style="width: 220px" 
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="data.create_time_end" 
					placeholder="下单时间(结束)"
					transfer
					clearable
					style="width: 220px"
					class="g-m-r-5" 
					@on-change="handleSearch" 
				/>
				<i-datepicker
					v-model="data.audit_time_start" 
					placeholder="审核时间(开始)"
					transfer
					clearable
					style="width: 220px" 
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="data.audit_time_end" 
					placeholder="审核时间(结束)"
					transfer
					clearable
					style="width: 220px"
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
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
import { Input, Button, DatePicker, Select, Option, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl, formatMoment, getItem } from '@utils/utils';
import { services } from '@stores/services/finance';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-datepicker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'i-cascader': Cascader,
		 
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
				'/finance/customer/contract', 
				{ 
					...this.data,
					fixPosition: true,
					actual_month_start: this.handleMonth(this.data.actual_month_start),
					actual_month_end: this.handleMonth(this.data.actual_month_end),
					create_time_start: formatMoment(this.data.create_time_start),
					create_time_end: formatMoment(this.data.create_time_end),
					audit_time_start: formatMoment(this.data.audit_time_start),
					audit_time_end: formatMoment(this.data.audit_time_end)
				}
			));
			this.$store.commit('FINANCE_CUSTOMER_CONTRACT_LIST_INIT');
		}, 300),
		handleMonth(month) {
			return formatMoment(month, 'YYYY-MM');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleExport: debounce(function () {
			const { query = {} } = this.$route;
			window.open(getHashUrl(API_ROOT._FINANCE_CUSTOMER_CONTRACT_LIST_EXPORT, {
				type: '1',
				...query,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		}, 300)
	}
};

</script>

<style lang="scss" scoped>

</style>
