<template>
	<div class="js-filter g-m-t-20">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-date-picker
					v-model="date"
					type="date"
					clearable
					transfer
					placeholder="请选择日期"
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
				<vc-debounce-click
					v-if="$auth[1104]"
					class="g-red-btn-line"
					@click="handleOutput">
					导出
				</vc-debounce-click>
			</div>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import moment from 'moment';
import { Expand } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { services } from '@stores/services/hr';
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import { Input, Button, DatePicker } from "iview";

export default {
	name: 'oa-filter',
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-date-picker": DatePicker,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			date: query.date ? query.date : ''
		};
	},
	methods: {
		handleDateChange(value) {
			this.date = value;
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			const { query = {} } = this.$route;
			this.$router.replace(getHashUrl(
				'/hr/archives/employee/business/detail',
				{
					...query,
					date: this.date
				}
			));
			this.$store.commit('HR_ARCHIVES_EMPLOYEE_BUSINESS_DETAIL_LIST_INIT');
		}, 300),
		// 导出当前状态下的所有员工
		handleOutput() {
			const { query = {} } = this.$route;
			const url = getHashUrl(API_ROOT['HR_ARCHIVES_EMPLOYEE_BUSINESS_DETAIL_LIST_GET'], {
				...query,
				export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
