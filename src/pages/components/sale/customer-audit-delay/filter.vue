<template>
	<oa-sale-expand :bar="false" class="js-filter" style="margin-top:0px">
		<i-input
			slot="prefix"
			v-model="query.company_name"
			:maxlength="50"
			placeholder="请输入公司名称搜索"
			style="width: 300px"
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
			
			<i-select
				v-model="query.prolong_reason"
				clearable
				placeholder="请选择申请原因"
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			>
				<i-option v-for="(reason,index) in reasonList" :key="index" :value="reason.reason">
					{{ reason.reason }}
				</i-option>
			</i-select>
			<i-select
				:value="query.staff_id"
				:remote-method="remote"
				:loading="staffLoading"
				class="g-m-r-5"
				style="width: 220px;"
				filterable
				remote
				clearable
				transfer
				label-in-value
				placeholder="请输入申请人姓名搜索"
				@on-change="handleChange({staff_id: arguments[0]})"
			>
				<i-option
					v-for="(item, index) in staffData"
					:key="index"
					:value="item.value"
				>{{ item.label }}</i-option>
			</i-select>
		</div>
	</oa-sale-expand>
</template>

<script>
import { Input, InputNumber, Button, Icon, DatePicker, Cascader, Dropdown, DropdownMenu, DropdownItem, Select, Option } from 'iview';
import { debounce } from 'lodash';
import moment from 'moment';
import { getParseUrl, getHashUrl, dataValidity, initTreeData } from '@utils/utils';
import { services } from '@stores/services/sale';
import { staffByRemove } from '@stores/services/hr';
import { TableTitle } from '@components/_common/table-title/table-title';
import SaleExpand from '@components/sale/_common/expand';

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
	mixins: [
		staffByRemove
	],
	data() {
		const query = this.$route.query || {};
		return {
			remote: null,
			query: {
				company_name: query.company_name || '',
				prolong_reason: query.prolong_reason || '',
				staff_id: query.staff_id || null,
				staff_name: query.staff_name || '',
			},
			reasonList: []
		};
	},
	watch: {

	},
	mounted() {
		this.handleLoadStaffData(() => {
			this.$nextTick(() => {
				this.remote = this.loadStaff();
			});
		});
		this.loadReasonData();
	},
	methods: {
		handleChange(obj) {
			let value = obj.staff_id;
			this.query[`staff_id`] = value ? value.value : '';
			this.query[`staff_name`] = value ? value.label : '';
			this.handleSearch();
		},
		// 设置远程搜索刷新后值保持
		handleLoadStaffData() {
			return this.$request({
				url: '_HR_MUTI_TERM_STAFF_GET',
				type: 'GET',
				param: {
					search: '1', // 为了能搜索到全部的员工数据（手机号码必定有1）
					type: 1,
					is_charge: 1
				},
				loading: false
			}).then((res) => {
				this.staff = Number(this.$route.query.staff_id);
				this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
			}).then(() => {
				this.remote = this.loadStaff;
			}).catch((error) => {
					
			});
		},
		loadReasonData() {
			this.$request({
				url: "_SALE_CUSTOMER_SYSTEM_OTHER_CONFIG_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				this.reasonList = res.data.protect;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleSearch: debounce(function (event) {
			this.selected = [];
			const { query = {} } = this.$route;
			this.$router.replace(getHashUrl(
				'/sale/customer/audit/delay',
				{
					...this.$route.query,
					...this.formatQuery(),
				}
			));
			this.$store.commit('SALE_CUSTOMER_AUDIT_DELAY_LIST_INIT');
		}, 200),
		formatQuery() {
			const _query = {};
			Object.keys(this.query).forEach(key => {
				if (this.query[key] instanceof Date) {
					_query[key] = moment(this.query[key]).format("YYYY-MM-DD");
				} else {
					_query[key] = this.query[key];
				}
			});
			return _query;
		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
	}
};
</script>