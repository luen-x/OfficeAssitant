<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		class="g-tabs-card v-hr-archives-employee-business"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<div
			slot="extra"
			style="line-height: 33px;"
			class="g-fs-14 g-c-black3">
			<span class="_divider g-m-r-10">
				<span class="g-m-l-15 g-pointer" @click="handleSelectTitle">选择表头</span>
			</span>
		</div>
		<i-tab-pane
			v-for="(item) in tabs"
			:key="item.value"
			:label="item.label"
			:name="item.value"
		>
			<div class="_statistic g-flex g-m-b-20">
				<div
					v-for="(info, index) in statistics[item.value]"
					:key="info.key"
					:class="index !== statistics[item.value].length - 1 ? '_line' : ''"
					class="_item g-flex g-ai-c g-jc-c">
					<div class="g-tc">
						<div class="g-m-b-15" style="color: #818794">{{ info.key }}</div>
						<div class="g-fs-24 g-c-black2">{{ info.value }}</div>
					</div>
				</div>
			</div>

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
				class="v-hr-archives-employee-business-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { tableHeight } from '@extends/mixins/table';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { TableTitle } from '../../_common/table-title/table-title';
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
		tableHeight({
			filter: true,
			tabs: true,
			footer: true,
			extraHeight: 140
		})
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '经理数据', value: '1' },
				{ label: '员工数据', value: '2' }
			],
			statistics: {
				'1': [
					{ key: '过客户', value: 0 },
					{ key: '过出来客户', value: 0 },
					{ key: '谈判客户', value: 0 },
					{ key: '跟进客户', value: 0 },
					{ key: '成交客户', value: 0 }
				],
				'2': [
					{ key: '加微信客户', value: 0 },
					{ key: '维护客户', value: 0 },
					{ key: '维护出来客户', value: 0 },
					{ key: '约客户', value: 0 },
					{ key: '绕前台', value: 0 },
					{ key: '业绩金额数据（元）', value: 0 }
				]
			}
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrArchivesEmployeeBusiness.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();

			return this.request({
				url: 'HR_ARCHIVES_EMPLOYEE_BUSINESS_LIST_GET',
				type: 'GET',
				param: {
					...query,
					table_type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.loadSummaryData(page, pageSize);
			}).catch((error) => {
			});
		},
		// 加载汇总数据
		loadSummaryData(page, pageSize) {
			let { query = {} } = getParseUrl();
			this.$request({
				url: 'HR_ARCHIVES_EMPLOYEE_BUSINESS_SUMMARY_GET',
				type: 'GET',
				param: {
					...query,
					table_type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				let arr1 = [res.data.adoptive, res.data.adoptived, res.data.negotiation,
					res.data.follow_up, res.data.deal];
				let arr2 = [res.data.wechat, res.data.maintenance, res.data.maintenanced,
					res.data.appoint, res.data.proscenium, res.data.achievement];
				this.statistics['1'].forEach((item1, index) => {
					this.statistics['1'][index].value = arr1[index] || 0;
				});
				this.statistics['2'].forEach((item2, index) => {
					this.statistics['2'][index].value = arr2[index] || 0;
				});
			}).catch((error) => {
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
			this.$router.replace(getHashUrl('/hr/archives/employee/business', { ...query }));

			let page = query.page ? query.page : 1;
			let pageSize = query.pageSize ? query.pageSize : 30;
			this.loadSummaryData(page, pageSize);
		},
		handleChangePageSize() {
			this.$store.commit('HR_ARCHIVES_EMPLOYEE_BUSINESS_LIST_INIT');
		},
		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrArchivesEmployeeBusiness.title[this.$route.query.type || '1'];

			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_ARCHIVES_EMPLOYEE_BUSINESS_CONFIG_SAVE_POST',
				mutation: 'HR_ARCHIVES_EMPLOYEE_BUSINESS_TITLE_CHANGE',
				type: this.$route.query.type || '1',
				params: {
					table_type: this.$route.query.type || '1',
				}
			}).then(() => {
				this.$vc.emit('hr-archives-employee-business-title-change', { type: this.$route.query.type || '1' });
				this.$store.commit("HR_ARCHIVES_EMPLOYEE_BUSINESS_LIST_INIT", {
					type: this.$route.query.type || '1'
				});
			}).catch(err => {
			});
		},
		loadTableTitle(type) {
			return this.$request({
				url: "_HR_ARCHIVES_EMPLOYEE_BUSINESS_CONFIG_GET",
				type: "GET",
				param: {
					table_type: type || '1'
				},
				loading: false,
			}).then(res => {
				this.$store.commit('HR_ARCHIVES_EMPLOYEE_BUSINESS_TITLE_CHANGE', { ...res.data, type: type || '1' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
	}
};

</script>

<style lang="scss" scoped>
.v-hr-archives-employee-business {
	._divider:hover {
		color: #2397F9;
	}
	._divider::before {
		content: '';
		display: inline-block;
		width: 1px;
		height: 12px;
		position: absolute;
		top: 11px;
		background: #E8E8E8;
	}
	._statistic {
		width: 100%;
		height: 114px;
		padding-top: 20px;
		padding-bottom: 20px;
		background: #F5F5F6;
		._item {
			flex: 1;
			height: 100%;
		}
		._line {
			border-right: 1px solid #D4D7DB;
		}
	}
}
</style>
