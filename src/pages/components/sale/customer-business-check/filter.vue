<template>
	<div class="v-sale-customer-business-check-filter">
		<div>
			<i-date-picker
				v-model="date"
				format="yyyy-MM-dd"
				class="g-m-t-10"
				type="date"
				placeholder="请选择日期"
				style="width: 220px;"
				@on-change="handleMonth"
			/>
			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<i-dropdown ref="addData" class="g-fr g-m-t-10 g-m-l-10" @on-click="handleChangeTitle">
				<vc-debounce-click class="g-red-btn-line" @click="()=>{}">
					更多功能
				</vc-debounce-click>
				<i-dropdown-menu slot="list">
					<i-dropdown-item
						:name="1"
					>选择表头</i-dropdown-item>
				</i-dropdown-menu>
			</i-dropdown>
			<vc-debounce-click
				v-if="$auth[968]"
				class="g-red-btn-line g-fr g-m-t-10"
				@click="handleExport"
			>
				导出
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import API from "@stores/apis/root";
import { TableTitle } from '@components/_common/table-title/table-title';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			date: '',
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/sale/customer/business/check',
				{
					...this.$route.query,
					date: this.date
				}
			));
			this.$store.commit('SALE_CUSTOMER_BUSINESS_CHECK_LIST_INIT');
		},
		handleExport() {
			const { query } = this.$route;
			window.open(getHashUrl(API.SALE_CUSTOMER_BUSINESS_CHECK_LIST_GET, {
				...query,
				export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},

		handleMonth(v) {
			this.date = v;
			this.handleSearch();
		},
		handleChangeTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.saleCustomerBusinessCheck.title[this.$route.query.type || '1'];
			TableTitle.popup({
				dataShow: dataShow || [],
				dataHide: dataHide || [],
				saveUrl: '_SALE_BUSINESS_DATA_SAVE_TABLE_CONFIG_POST',
				mutation: 'SALE_CUSTOMER_BUSINESS_CHECK_TITLE_CHANGE',
				type: this.$route.query.type || '2',
				params: {
					table_type: this.$route.query.type || '2',
					info_list: 1,
					staff_id: this.$route.query.staff_id || '',
				}
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$store.commit("SALE_CUSTOMER_BUSINESS_CHECK_LIST_RESET", {
					type: this.$route.query.type || '1'
				});
			}).catch(() => {});

		},
	}
};

</script>

<style lang="scss" >
 .v-sale-customer-business-check-filter {
        ._split-bar {
            position: relative;
            display: inline-block;
            margin: 0 10px;
            width: 1px;
            height: 12px;
            background: rgba(232, 232, 232, 1);
            top: 2px;
        }
    }
</style>
