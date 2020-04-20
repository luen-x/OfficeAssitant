<template>
	<div class="g-flex-ac g-jc-sb">
		<div>
			<i-input
				v-model="search.keyword"
				clearable
				placeholder="请输入姓名"
				class="g-m-r-5"
				style="width: 220px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-cascader
				v-if="type === '2'"
				:data="businessDepart"
				v-model="search.depart_id"
				:change-on-select="true"
				placeholder="请选择部门"
				trigger="click"
				clearable
				transfer
				style="width: 220px;display:inline-block"
				class="g-m-r-5"
				@on-change="handleSearch"/>
			<i-date-picker
				v-model="search.month"
				:options="dateOption"
				type="month"
				clearable
				transfer
				style="width: 220px;"
				@on-change="handleDateChange" />
			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
		<div>
			<!-- <vc-debounce-click
				v-if="type === '1' && $auth[1115]"
				class="g-red-btn-line g-m-r-5"
				@click="handleSetting">
				季度配置
			</vc-debounce-click> -->
			<vc-debounce-click
				v-if="$auth[1116]"
				class="g-red-btn-line"
				@click="handleOutput">
				导出
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { services } from '@stores/services/hr';
import { getParseUrl, getHashUrl, formatMoment, getItem } from '@utils/utils';
import { Input, Button, Select, Option, DatePicker, Cascader } from "iview";
import { configPModal } from './popup/config';

export default {
	name: 'oa-filter',
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
	},
	mixins: [
		services.businessDepart()
	],
	props: {
		type: String,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			search: {
				keyword: query.keyword ? query.keyword : '',
				month: query.month ? query.month : moment().format('YYYY-MM'),
				depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : []
			},
			dateOption: {
				disabledDate(date) {
					return date && date.valueOf() > Date.now();
				}
			}
		};
	},
	watch: {
		'$route.query.type': {
			handler(newV, oldV) {
				this.search.keyword = '';
				this.search.month = moment().format('YYYY-MM');
				this.search.depart_id = [];
			},
		}
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 时间改变
		handleDateChange(val) {
			this.search.month = val;
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/archives/employee/target',
				{
					...this.$route.query,
					...this.search,
					month: formatMoment(this.search.month, 'YYYY-MM')
				}
			));
			this.$emit('load', this.$route.query.type, 1);
		}, 300),
		// 季度配置
		handleSetting() {
			configPModal.popup({}).then(res => {
				this.$emit('load', this.$route.query.type, 1);
			}).catch(err => {});
		},
		// 导出
		handleOutput() {
			const { query = {} } = this.$route;
			const url = getHashUrl(API_ROOT['HR_ARCHIVES_EMPLOYEE_TARGET_LIST_POST'], {
				...query,
				export: 1,
				list_type: query.type ? query.type : '1',
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
