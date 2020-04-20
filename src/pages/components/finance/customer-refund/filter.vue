<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="formdata.search" 
				:maxlength="50"				 
				placeholder="请输入公司名称,客户名称，手机号搜索" 
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
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px; padding-bottom: 7px">
				<i-input
					v-model="formdata.staff_search"  
					placeholder="请输入邀约人姓名或手机号" 
					style="width: 220px"
					class="g-m-r-5"
					clearable
					@on-change="handleSearch" 
					@on-enter="handleSearch" 
				/>
				<i-input
					v-model="formdata.audit_staff_search"   
					placeholder="请输入审核人姓名或手机号" 
					style="width: 220px"
					class="g-m-r-5"
					clearable
					@on-change="handleSearch" 
					@on-enter="handleSearch"
				/>
				<i-cascader
					v-model="formdata.depart_id" 
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
					v-model="formdata.refund_type" 
					placeholder="请选择退款类型"
					transfer
					clearable 
					style="width: 220px"
					class="g-m-r-5"  
					@on-change="handleSearch"
				>
					<i-option value="1">产品退款</i-option>
					<i-option value="2">换产品退款</i-option>
					<i-option value="3">余额退款</i-option>
				</i-select>
				<i-select
					v-if="formdata.refund_type==3"
					v-model="formdata.refund_mode" 
					placeholder="请选择退款种类"
					transfer
					clearable 
					style="width: 220px"
					class="g-m-r-5"  
					@on-change="handleSearch"
				>
					<i-option value="1">录错</i-option>
					<i-option value="2">走账</i-option>
					<i-option value="3">实际退款</i-option>
					<i-option value="4">冲业绩</i-option>
				</i-select>
				<i-datepicker
					v-model="formdata.create_time_start" 
					placeholder="申请时间(开始)"
					transfer
					clearable 
					style="width: 220px"
					class="g-m-r-5" 
					@on-change="handleSearch" 
				/>
				<i-datepicker
					v-model="formdata.create_time_end" 
					placeholder="申请时间(结束)"
					transfer
					clearable 
					style="width: 220px"
					class="g-m-r-5"  
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="formdata.audit_time_start" 
					placeholder="审核时间(开始)"
					transfer
					clearable 
					style="width: 220px"
					class="g-m-r-5" 
					@on-change="handleSearch" 
				/>
				<i-datepicker
					v-model="formdata.audit_time_end" 
					placeholder="审核时间(结束)"
					transfer
					clearable 
					style="width: 220px"
					class="g-m-r-5"  
					@on-change="handleSearch"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, DatePicker, Option, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import { services } from '@stores/services/finance';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-datepicker': DatePicker,
		'i-cascader': Cascader,
		 
	},
	mixins: [services.departArr()],
	data() {
		const { query = {} } = this.$route;
		return {
			formdata: {
				...query,
				depart_id: query.depart_id && query.depart_id.split(',').map(item => Number(item))
			},
			show: false
		};
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/finance/customer/refund', 
				{ 
					...this.formdata,
					fixPosition: true,
					create_time_start: this.formdata.create_time_start && formatMoment(this.formdata.create_time_start),
					create_time_end: this.formdata.create_time_end && formatMoment(this.formdata.create_time_end),
					audit_time_start: this.formdata.audit_time_start && formatMoment(this.formdata.audit_time_start),
					audit_time_end: this.formdata.audit_time_end && formatMoment(this.formdata.audit_time_end),
				}
			));
			this.$store.commit('FINANCE_CUSTOMER_REFUND_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
