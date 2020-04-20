<template>
	<oa-sale-expand :bar="false" class="js-filter" style="margin-top:0px">
		<i-input
			slot="prefix"
			v-model="query.search"
			:maxlength="50"
			placeholder="请输入举报公司名称搜索"
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
			<i-date-picker
				v-model="query.create_time"
				type="daterange"
				placeholder="请选择举报时间"
				clearable
				split-panels
				style="width: 220px"
				@on-change="handleSearch"
			/>
			<i-select
				:value="query.create_staff_id"
				:remote-method="remote"
				:loading="staffLoading"
				class="g-m-r-5"
				style="width: 220px;"
				filterable
				remote
				clearable
				transfer
				label-in-value
				placeholder="请输入举报人姓名搜索"
				@on-change="handleChange({create_staff_id: arguments[0]})"
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
				search: query.search || '',
				staff_search: +query.staff_search || '',
				create_staff_id: query.create_staff_id || null,
				create_time: [query.create_time_start, query.create_time_end]
			},
			list: []
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
	},
	methods: {
		handleChange(obj) {
			let value = obj.create_staff_id;
			this.query[`create_staff_id`] = value ? value.value : '';
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
				this.staff = Number(this.$route.query.create_staff_id);
				this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
			}).then(() => {
				this.remote = this.loadStaff;
			}).catch((error) => {
					
			});
		},
		handleSearch: debounce(function (event) {
			this.selected = [];
			const { query = {} } = this.$route;
			this.$router.replace(getHashUrl(
				'/sale/customer/audit/mistake',
				{
					...this.$route.query,
					...this.formatQuery(),
				}
			));
			this.$store.commit('SALE_CUSTOMER_AUDIT_MISTAKE_LIST_INIT');
		}, 200),
		formatQuery() {
			const _query = { ...this.query };
			const [create_time_start, create_time_end] = _query.create_time;
			_query.create_time_start = create_time_start && moment(create_time_start).format("YYYY-MM-DD");
			_query.create_time_end = create_time_end && moment(create_time_end).format("YYYY-MM-DD");
			delete _query.create_time;


			// Object.keys(this.query).forEach(key => {
			// 	if (this.query[key] instanceof Date) {
			// 		_query[key] = moment(this.query[key]).format("YYYY-MM-DD");
			// 	} else {
			// 		_query[key] = this.query[key];
			// 	}
			// });
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