<template>
	<div class="js-filter">
		<div class="g-flex g-jc-sb">
			<div>
				<i-input
					v-model="obj.search"
					:maxlength="50"			 
					placeholder="请输入公司名称,客户姓名或手机号进行搜索" 
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
				<span 
					v-if="$auth[1658]" 
					class="g-red-btn-line g-m-r-5" 
					@click="handleHurry">催下单</span>
				<i-dropdown>
					<div @mouseenter="flag = false" @mouseleave="flag = true">
						<span class="_btn g-red-btn-line">
							更多功能
							<i v-if="flag" class="iconfont icon-down g-fs-12"/>
							<i v-else class="iconfont icon-up g-fs-12"/>
						</span>
					</div>
					<i-dropdown-menu slot="list">
						<i-dropdown-item @click.native="handleExport">
							<span v-if="$auth['718']">导出</span>
						</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
			</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-fw-w g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px; padding-bottom: 7px"
			>
				<i-input
					v-model="obj.staff_search"  
					placeholder="请输入邀约人姓名或手机号" 
					style="width: 220px"
					class="g-m-r-5"  
					clearable
					@on-change="handleSearch"
					@on-enter="handleSearch"
				/>
				<i-input
					v-model="obj.audit_staff_search"   
					placeholder="请输入审核人姓名或手机号" 
					style="width: 220px" 
					class="g-m-r-5" 
					clearable
					@on-change="handleSearch"
					@on-enter="handleSearch"
				/>
				<i-cascader
					v-model="obj.depart_id" 
					:data="departArr"
					transfer
					clearable
					change-on-select
					placeholder="请选择组织"
					style="width: 220px" 
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="obj.deal_month_start" 
					placeholder="选择成交月份(开始)"
					type="month"
					transfer
					clearable
					style="width: 220px" 
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="obj.deal_month_end" 
					placeholder="选择成交月份(结束)"
					type="month"
					transfer
					clearable
					style="width: 220px" 
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="obj.actual_month_start" 
					placeholder="选择业绩归属月份(开始)"
					type="month"
					transfer
					clearable
					style="width: 220px" 
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="obj.actual_month_end" 
					placeholder="选择业绩归属月份(结束)"
					type="month"
					transfer
					clearable
					style="width: 220px" 
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
				<i-select
					v-model="obj.payment_label"
					placeholder="请选择款项标签"
					multiple
					transfer
					clearable
					style="width: 220px" 
					class="g-m-r-5" 
					@on-change="handleSearch"
				>
					<i-option 
						v-for="item of paymentLabel" 
						:value="item.label_id"
						:key="item.label_id">{{ item.label_name }}</i-option>
				</i-select>
				<i-select
					v-model="obj.use_status"
					placeholder="请选择到账状态"
					transfer
					clearable
					style="width: 220px" 
					class="g-m-r-5" 
					@on-change="handleSearch"
				>
					<i-option 
						v-for="item of achiStatus" 
						:value="item.value"
						:key="item.value">{{ item.label }}</i-option>
				</i-select>
				<i-datepicker
					v-model="obj.create_time_start" 
					placeholder="录入时间(开始)"
					transfer
					clearable
					style="width: 220px" 
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="obj.create_time_end" 
					placeholder="录入时间(结束)"
					transfer
					clearable
					style="width: 220px"
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="obj.audit_time_start" 
					placeholder="审核时间(开始)"
					transfer
					clearable
					style="width: 220px" 
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="obj.audit_time_end" 
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
import { Input, Button, Cascader, DatePicker, Form, Option, Select, Dropdown,
	DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl, formatMoment, getItem } from '@utils/utils';
import { services } from '@stores/services/finance';
import { services as saleServicve } from '@stores/services/sale';
import API_ROOT from '@stores/apis/root';
import { sign, achiStatus } from './constants';
import { HurryModal } from './popup/hurry';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-cascader': Cascader,
		'i-datepicker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'i-form': Form,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem
	},
	mixins: [services.departArr(), saleServicve.paymentLabel()],
	data() {
		const { query = {} } = this.$route;
		return {
			obj: {
				...query,
				depart_id: query.depart_id && query.depart_id.split(',').map(item => Number(item))
			},
			sign,
			flag: false,
			achiStatus,
			show: false,
		};
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/finance/customer/achi', 
				{ 
					...this.obj,
					fixPosition: true,
					create_time_start: formatMoment(this.obj.create_time_start),
					create_time_end: formatMoment(this.obj.create_time_end),
					audit_time_start: formatMoment(this.obj.audit_time_start),
					audit_time_end: formatMoment(this.obj.audit_time_end),
					actual_month_start: this.handleMonth(this.obj.actual_month_start),
					actual_month_end: this.handleMonth(this.obj.actual_month_end),
					deal_month_start: this.handleMonth(this.obj.deal_month_start),
					deal_month_end: this.handleMonth(this.obj.deal_month_end),
				}
			));
			this.$store.commit('FINANCE_CUSTOMER_ACHI_LIST_INIT');
		}, 300),
		handleMonth(month) {
			return formatMoment(month, 'YYYY-MM');
		},
		handleHurry() {
			HurryModal.popup({

			}).then(res => {});
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleExport: debounce(function () {
			const { query = {} } = this.$route;
			window.open(getHashUrl(API_ROOT._FINANCE_ACHI_LIST_EXPORT_GET, {
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
