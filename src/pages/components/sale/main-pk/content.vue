<template>
	<div>
		<oa-pk-breadcrumb/>
		<template>
			<i-tabs
				:value="type"
				:animated="false"
				type="card"
				style="margin-top: 20px"
				class="g-tabs-card"
				@on-click="handleChange">
				<i-tab-pane
					v-for="(item) in tabs"
					:key="item.value"
					:label="item.label"
					:name="item.value"
				>
					<vc-paging
						ref="selection"
						:columns="columns"
						:show="item.value == type"
						:type="item.value"
						:data-source="listInfo[item.value].data"
						:total="listInfo[item.value].total"
						:reset="listInfo[item.value].reset"
						:current.sync="current[item.value]"
						:history="true"
						:load-data="loadData"
						class="v-sale-pk-list"
						mode="table"
						@page-size-change="handleChangePageSize"/>
				</i-tab-pane>
			</i-tabs>
	</template></div>

</template>

<script>
import { Tabs, TabPane } from 'iview';
import ROOT_API from '@stores/apis/root';
import pkBreadcrumb from './breadcrumb-head';
import { STAFF_OR_DEPART_COLUMN, STATISTIC_COLUMN } from "./columns";

export default {
	components: {
		'oa-pk-breadcrumb': pkBreadcrumb,
		'i-tabs': Tabs,
		'i-tab-plane': TabPane
	},
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			selection: {
				'0': [],
				'1': [],
				'2': [],
				'3': []
			},
			tabs: [
				{ label: '全部', value: '0' },
				{ label: '已开启', value: '1' },
				{ label: '已关闭', value: '2' }
			],
			role: '',
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleMainPk.listInfo;
		},
	},
	created() {
		this.handleTabsAndAuthByRole();
	},
	methods: {
		loadData(page, pageSize) {
			// let staff_type = ''
			// if(this.role === '')
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'CONTENT_NOTICE_INFORM_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
				this.count_open = res.data.count_open;
				this.tabs = [
					{ label: `全部${res.data.count_all}`, value: '0' },
					{ label: `已开启${this.count_open}`, value: '1' },
					{ label: `已关闭${res.data.count_close}`, value: '2' },
					{ label: `已失效${res.data.count_invalid}`, value: '3' }
				];
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/content/notice', { ...query }));
		},
		handleTabsAndAuthByRole() {
			this.$request({
				url: ROOT_API._SALE_MAIN_PK_STAFF_IDENTIFY_GET,
				type: "GET",
				param: {
					staff_id: this.$global.staff.staff_id
				}
			}).then(({ data }) => {
				this.role = data[0];
				this.role = '超级管理员';
				this.hanldeTabsByRole(role);
			}).catch(err => {
				this.$Message.error('员工角色请求错误');
			});
		},
		hanldeTabsByRole(role) {
			!this.$auth['370'] && STAFF_OR_DEPART_COLUMN.pop();
			if (role === '超级管理员') {
				this.tabs = [
					{ label: '员工PK', value: '0', columns: STAFF_OR_DEPART_COLUMN },
					{ label: '部门PK', value: '1', columns: STAFF_OR_DEPART_COLUMN },
					{ label: 'PK统计', value: '2', columns: STATISTIC_COLUMN }
				];
			}
		},
		handleUrl() {
			// if(this.role == '超级管理员') {
			//   if()
			// }
		},
		handleResetFirst() {
			this.$store.commit('SALE_MAIN_PK_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_MAIN_PK_LIST_RESET', { type: this.type });
		},
		// handleLinkTo() {
		// 	this.$router.push('/');
		// },
		// handlePKResult(type) {
		// 	const temp = Number(type);
		// 	if (temp < 0) {
		// 		return '失败';
		// 	} else if (temp === 0) {
		// 		return '平局';
		// 	}
		// 	return '失败';
		// }
	}
};
</script>

