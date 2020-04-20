<template>
	<div class="hr-recruit-school-jobfair-tabs">
		<i-tabs
			:value="type"
			:animated="false"
			type="card"
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item, index) in tabs"
				:key="item.value"
				:label="item.label + listInfo.count[index]"
				:name="item.value"
			>
				<vc-paging
					ref="tableTarget"
					:columns="columns[item.value]"
					:show="item.value == type"
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					:table-opts="{height: tableHeight, highlightRow: true}"
					class="v-hr-recruit-school-jobfair-list"
					mode="table"
					@page-size-change="handleChangePageSize"
					@row-click="handleOpenDrawer"
				/>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane, Dropdown, DropdownMenu, DropdownItem, Tooltip } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import { autoFix } from '@extends/mixins/auto-fix';
import { TipConfirmModal } from './popup/tip-confirm';
import { RemarkModal } from './popup/remark';
import { Confirm } from "./popup/confirm";
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [
		item,
		tableHeight({}),
		autoFix()
	],
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '全部', value: '0' },
				{ label: '审核中', value: '1' },
				{ label: '待参加', value: '2' },
				{ label: '已参加', value: '3' },
				{ label: '未参加', value: '4' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSchoolJobfair.listInfo;
		},
	},
	created() {
		this.$store.commit('HR_RECRUIT_SOCIAL_JOBFAIR_SELECTED_TAB', this.type);
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RECRUIT_SCHOOL_JOBFAIR_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('0', this.listInfo.count, '/hr/recruit/school/jobfair');
			}).catch((error) => {
			});
		},
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$nextTick(() => {
				this.$refs.tableTarget[+type].$refs.tableTarget.handleResize();
			});
			this.$router.replace(getHashUrl('/hr/recruit/school/jobfair', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_RECRUIT_SCHOOL_JOBFAIR_LIST_INIT');
		},
		loadTableTitle(type) {
			return this.$request({
				url: "_HR_RECRUIT_CONFIG_GET",
				type: "GET",
				param: {
					type: type || '0',
					scenario: 1
				},
				loading: false,
			}).then(res => {
				this.$store.commit('HR_RECRUIT_SCHOOL_JOBFAIR_TITLE_CHANGE', { ...res.data, type: type || '1' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
	}
};

</script>

<style lang="scss">
.hr-recruit-school-jobfair-tabs {
	._split-bar {
		position:relative;
		display:inline-block;
		margin: 0 10px;
		width:1px;
		height:12px;
		background:rgba(232,232,232,1);
		top:2px
	}
	.tel-com-progress-td {
		position: relative;
		.icon-edit2 {
			position: absolute;
			right: -8px;
			top: -10px
		}
		&:hover {
			.icon-edit2 {
				display: inline!important
			}
		}
		
	}
}
</style>
