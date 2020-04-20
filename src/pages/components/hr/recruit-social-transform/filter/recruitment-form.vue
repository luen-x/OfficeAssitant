<template>
	<div class="g-flex g-jc-sb g-ai-c g-lh-42">
		<div class="g-fw-w g-lh-42">
			<i-date-picker
				v-model="query.create_month"
				type="daterange"
				transfer
				clearable
				split-panels
				placeholder="选择录入时间范围"
				style="width: 220px; "
				class="g-m-r-5"
				@on-change="handleDateChange($event, 'create_month')"/>
			<i-button type="primary" @click="handleSearch">
				搜索
			</i-button>
		</div>
		<div>
			<div
				class="g-red-btn-line"
				style="margin-top: 2px; margin-left: 5px;"
				@click="handleOutput">
				导出
			</div>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import API_ROOT from "@stores/apis/root";
import { services, searchStaff } from '@stores/services/hr';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { Input, Button, Cascader, Select, Option, DatePicker } from 'iview';
import { AuditModal } from "../tabs/recruitment-form/popup/audit";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-cascader': Cascader,
		'i-date-picker': DatePicker,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			staffLoading: false,
			noSearching: false,
			inviteData: [],
			interviewerData: [],
			query: {
				...query,
				create_month: [query.create_month_start, query.create_month_end]
			},
		};
	},
	mounted() {
		const { query = {} } = this.$route;

	},
	methods: {
		handleDateChange(val, name) {
			this.query[`${name}_start`] = val[0];
			this.query[`${name}_end`] = val[1];
			this.handleSearch();
		},
		// 搜索方法
		handleSearch: lodash.debounce(function (event) {
			delete this.query.create_month;
			this.$router.replace(getHashUrl(
				'/hr/recruit/social/statistics', {
					...this.query,
				}
			));
		}, 300),
		handleAddBtn() {
			AuditModal.popup({ title: "添加", type: 1 }).then(res => {
			});
		},
		// 导出数据
		handleOutput: lodash.debounce(function () {
			const { query = {} } = this.$route;
			let url = '';
			url = getHashUrl(API_ROOT['HR_RECRUIT_SOCIAL_SOCIAL_NEED_POSITION_LIST_GET'], { // eslint-disable-line
				...query,
				is_export: 1,
				'-token': this.$global.token
				
			});
			window.open(url);
		}, 300),

	}
};
</script>

<style lang="scss" scoped>

</style>




