<template>
	<div class="js-filter">
		<div class="v-hr-salary-social-history-filter">
			<i-input
				v-model="query.search" 
				placeholder="请输入姓名/身份证号" 
				style="width: 220px" 
				clearable
				@on-change="handleSearch"
			/>
			<i-select
				v-model="query.security_company_id"
				clearable
				transfer
				class="g-m-l-5"
				style="width: 220px"
				placeholder="请选择社保缴纳公司"
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item, index) in socialContractArr"
					:key="index"
					:value="String(item.contract_company_id)"
				>{{ item.company_name }}</i-option>
			</i-select>
			<i-button 
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<vc-debounce-click
				v-if="$auth['1137']"
				class="g-red-btn-line g-fr"
				@click="handleExport"
			>
				导出
			</vc-debounce-click>
			<span class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer" @click="handleToggle">
				更多搜索条件
				<i
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont g-fs-12 g-c-black-dark"
				/>
			</span>
		</div>
		<vc-expand ref="expand" v-model="show">
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-cascader 
					v-model="query.depart_id" 
					:data="departAll" 
					:change-on-select="true" 
					style="width: 220px; display: inline-block" 
					clearable 
					transfer 
					trigger="click" 
					placeholder="请选择部门" 
					@on-change="handleDepartChange"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { services } from "@stores/services/hr";
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		'vc-expand': Expand
	},
	mixins: [
		services.departAll()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			socialContractArr: [],
			query: {
				search: String(query.search || ''),
				security_company_id: String(query.security_company_id || ''),
				depart_id: query.depart_id ? query.depart_id.split(",").map(item => Number(item)) : [],
			},
			show: false
		};
	},
	mounted() {
		this.handleSocialContractCompany();
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/salary/social/history', 
				{ 
					...this.$route.query, 
					...this.query,
					depart_id: this.query.depart_id.length ? this.query.depart_id : null,
				}
			));
			this.$store.commit('HR_SALARY_SOCIAL_HISTORY_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleSocialContractCompany() {
			this.$request({
				url: API_ROOT._HR_STAFF_SOCIAL_CONTRACT_COMPANY_GET,
				type: "GET"
			}).then(res => {
				this.socialContractArr = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleDepartChange(value, selected) {
			this.query.depart_id = value;
			this.handleSearch();
		},
		handleExport(page, pageSize) {
			const query = {
				...this.$route.query,
				type: this.$route.query.type || "1"
			};
			window.open(getHashUrl(API_ROOT.HR_SALARY_SOCIAL_HISTORY_LIST_GET, {
				...query,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
	}
};

</script>

<style lang="scss" >
.v-hr-salary-social-history-filter{
	.ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
		height:32px !important;
	}
}

</style>
