<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		class="v-hr-archives-person-tables"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item,index) in tabs"
			:key="item.value"
			:label="`${item.label} ${count[index]}`"
			:name="item.value"
		>
			<vc-paging
				:columns="columns[item.value]"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight}"
				class="v-hr-archives-person-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>

	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Divider } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import { TableTitle } from '@components/_common/table-title/table-title';
import { M_HR_URL } from "@constants/constants";
import { autoFix } from '@extends/mixins/auto-fix';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-divider': Divider,

	},
	mixins: [
		item,
		tableHeight({ nav1: true, nav2: true, tab: true, extra: 20 }),
		autoFix()
	],
	data() {
		const { query } = this.$route;
		return {
			data: {},
			type: String(query.type || "3"), // 同tabs下的value
			current: {},
			tabs: [
				{
					label: "待入职",
					value: "3"
				},
				{
					label: "在职人员",
					value: "1"
				},
				{
					label: "离职人员",
					value: "2"
				}
			],
			count: [0, 0, 0]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrArchivesPerson.listInfo;
		}
	},
	watch: {
		$route(to, from) {
			if (to.query.type != from.query.type) {
				const { query } = this.$route;
				this.type = String(query.type || "1");
			}
		}
	},
	created() {
		this.$store.commit("HR_ARCHIVES_PERSON_TAB", this.type);
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ARCHIVES_PERSON_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = [+res.data.applicant_count, +res.data.entry_count, +res.data.leave_count];
				this.resetType('1', this.count, '/hr/archives/person');
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(type) {
			this.type = type;
			this.loadTableTitle();
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				fixPosition: false,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/archives/person', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_ARCHIVES_PERSON_LIST_INIT');
		},
		loadTableTitle(type) {
			return this.$request({
				url: "_HR_RECRUIT_CONFIG_GET",
				type: "GET",
				param: {
					type: type || "3",
					scenario: 6
				},
				loading: false
			}).then(res => {
				this.$store.commit("HR_ARCHIVES_PERSON_TITLE_CHANGE", {
					...res.data,
					type: type || "3"
				});
				return res;
			}).catch(res => {
				this.$Message.error(res.msg);
			});
		},

	}
};

</script>

<style lang="scss">
.v-hr-archives-person-tables{
	._divider{
		background-color:#E8E8E8 !important;
	}
	._title{
		color:#4B4F57;
	}
	._title:hover{
		color:#2296f9;
		cursor:pointer
	}
}

</style>
