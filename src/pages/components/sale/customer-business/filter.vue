<template>
	<div>
		<i-input
			v-if="level<4"
			v-model="keyword"
			clearable
			placeholder="请输入员工姓名"
			style="width: 220px"
			class="g-m-r-5"
			@on-enter="handleSearch"
			@on-change="handleInputChange"
		/>
		<i-cascader
			v-if="level<3"
			:data="departMy"
			v-model="depart_id"
			:change-on-select="true"
			placeholder="请选择部门"
			trigger="click"
			clearable
			transfer
			style="width: 220px;display:inline-block"
			class="g-m-r-5"
			@on-change="handleDepartChange"
		/>
		<i-date-picker
			v-model="month"
			format="yyyy-MM"
			type="month"
			placeholder="请选择月份"
			style="width: 220px;"
			@on-change="handleMonth"
		/>
		<i-button type="primary" class="g-m-l-5" @click="handleSearch">搜索</i-button>
		<i-dropdown ref="addData" class="g-fr g-m-l-10" @on-click="handleChangeTitle">
			<vc-debounce-click class="g-red-btn-line" @click="()=>{}">
				更多功能
			</vc-debounce-click>
			<i-dropdown-menu slot="list">
				<i-dropdown-item
					:name="1"
				>选择表头</i-dropdown-item>
			</i-dropdown-menu>
		</i-dropdown>
		<vc-debounce-click v-if="$auth[965]" class="g-red-btn-line g-fr g-m-l-10" @click="handleExport">导出</vc-debounce-click>
		<i-dropdown ref="addData" class="g-fr g-m-l-10" @on-click="handleAddCustomer">
			<vc-debounce-click v-if="level==3||level==4" class="g-red-btn-line" @click="()=>{}">
				添加数据
			</vc-debounce-click>
			<i-dropdown-menu slot="list">
				<i-dropdown-item
					v-for="item in configList"
					:ref="'addData'+item.key"
					:key="item.key"
					:name="item.key"
				>{{ item.value }}</i-dropdown-item>
			</i-dropdown-menu>
		</i-dropdown>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Dropdown, DropdownMenu, DropdownItem, Cascader } from 'iview';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { setTimeout } from 'timers';
import { services } from "@stores/services/sale";
import API from "@stores/apis/root";
import { TableTitle } from '@components/_common/table-title/table-title';
import { AddCustomer } from './popup/add-customer';
import { SeeCustomer } from './popup/see-customer';
import { MSeeCustomer } from './popup/m-add-customer';
import { modelCustomer } from './popup/model-customer';
import { getLevel } from '../_common/util';
import { errorMsg } from './tabs-list';


export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-cascader': Cascader,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'i-date-picker': DatePicker,
	},
	mixins: [
		services.departMy()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: query.keyword ? query.keyword : '',
			month: query.month ? query.month : '',
			depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : [],
			configList: [],
		};
	},
	computed: {
		level() {
			return getLevel();
		}
	},
	mounted() {
		this.loadDataConfig();
	},
	methods: {
		handleChangeTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.saleCustomerBusiness.title[this.$route.query.type || '1'];
			TableTitle.popup({
				dataShow: dataShow || [],
				dataHide: dataHide || [],
				saveUrl: '_SALE_BUSINESS_DATA_SAVE_TABLE_CONFIG_POST',
				mutation: 'SALE_CUSTOMER_BUSINESS_TITLE_CHANGE',
				type: this.$route.query.type || '1',
				params: {
					table_type: this.$route.query.type ? this.$route.query.type : this.level == 4 ? '2' : 1,
				}
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$store.commit("SALE_CUSTOMER_BUSINESS_LIST_RESET", {
					type: this.$route.query.type || '1'
				});
			}).catch(() => {});
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/sale/customer/business',
				{
					...this.$route.query,
					month: this.month,
					keyword: this.keyword,
					depart_id: this.depart_id,
					table_type: this.level == 4 ? '2' : this.type,
				}
			));
			this.$store.commit('SALE_CUSTOMER_BUSINESS_LIST_INIT');
		},
		handleExport() {
			const { query } = this.$route;
			this.$request({
				url: API.SALE_CUSTOMER_BUSINESS_LIST_GET,
				type: "get",
				param: {
					...query,
					table_type: this.level == 4 ? '2' : query.type ? query.type : 1,
				}
			}).then(res => {
				window.open(getHashUrl(API.SALE_CUSTOMER_BUSINESS_LIST_GET, {
					...query,
					table_type: this.level == 4 ? '2' : query.type ? query.type : 1,
					export: 1,
					'-token': getItem(`staff_${this.$global.version}`).token
				}));
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleDepartChange(val) {
			this.depart_id = val;
			this.handleSearch();
		},
		handleMonth(v) {
			this.month = v;
			this.handleSearch();
		},
		handleAddCustomer(v) {
			const title = {
				'1': '加微信客户',
				'2': '维护客户',
				'3': '维护出来客户',
				'4': '约见客户',
				'5': '绕前台',
				'6': '过客户',
				'7': '过出来客户数',
				'8': '谈判客户',
				'9': '跟进客户',
			};
			// modelCustomer.popup({ data: {
			// 	type: v,
			// 	title: title[v]
			// } }).then(() => { this.handleSearch(); });
			// return;
			v == 4 ? SeeCustomer.popup({
				data: {
					type: v,
					title: title[v],
				}
			}).then(() => { this.handleSearch(); })
				: modelCustomer.popup({ data: {
					type: v,
					title: title[v],
					isManager: getLevel() == 3,
				} }).then(() => { this.handleSearch(); });
		},
		loadDataConfig() {
			this.$request({
				url: '_SALE_BUSINESS_DATA_GET_CONFIG_GET',
				type: "get",
				param: {
				}
			}).then(res => {
				this.configList = res.data;
			}).catch(err => {
				errorMsg(err.msg);
			});
		},
	},
};

</script>

<style lang="scss">

</style>
