<template>
	<div class="g-flex g-ai-c g-jc-sb">
		<div>
			<i-input
				v-model="formdata.search" 
				placeholder="请输入姓名/手机/工号" 
				style="width: 220px"
				clearable
				@on-change="handleSearch" 
				@on-enter="handleSearch" 
			/>
			<i-datepicker
				v-model="formdata.month" 
				placeholder="请选择考勤月份" 
				style="width: 220px" 
				type="month"
				class="g-m-l-5"
				clearable
				transfer
				@on-change="handleSearch" 
			/>
			<i-button 
				type="primary"
				class="g-m-l-10"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
		<div class="g-flex g-ai-c">
			<span 
				v-if="$auth[903]"
				class="g-red-btn-line g-m-r-10"
				@click="handleAdd"
			>
				新增
			</span>
			<i-dropdown v-if="$auth[904] || $auth[905]" @on-click="handleClick">
				<span 
					class="g-red-btn-line"
				>
					更多
					<i class="icon iconfont icon-triangle-down g-fs-12"/>
				</span>
				<i-dropdown-menu slot="list">
					<i-dropdown-item v-if="$auth[904]" name="1">导入</i-dropdown-item>
					<i-dropdown-item v-if="$auth[905]" name="2">导出</i-dropdown-item>
				</i-dropdown-menu>
			</i-dropdown>
		</div>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import moment from 'moment';
import { debounce } from 'lodash';
import API_ROOT from '@stores/apis/root';
import { AddModal } from './popup/add';
import { LeadInModal } from './popup/lead-in';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-datepicker': DatePicker,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			formdata: query
		};
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/employee/check', 
				{ 
					...this.formdata,
					month: this.formdata.month && moment(this.formdata.month).format('YYYY-MM')
				}
			));
			this.$store.commit('HR_EMPLOYEE_CHECK_LIST_INIT');
		}, 300),
		handleAdd() {
			AddModal.popup({

			}).then(res => {
				this.$store.commit('HR_EMPLOYEE_CHECK_LIST_INIT');
			}).catch(err => {

			});
		},
		handleLeadIn() {
			LeadInModal.popup({

			}).then(res => {

			}).catch(err => {

			});
		},
		handleClick(name) {
			name === '1' ? this.handleLeadIn() : this.handleExport();
		},
		handleExport: debounce(function () {
			const { query = {} } = this.$route;
			window.open(getHashUrl(API_ROOT.HR_EMPLOYEE_CHECK_LIST_GET, {
				...query,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		}, 300)
	}
};

</script>

<style lang="scss" scoped>

</style>
