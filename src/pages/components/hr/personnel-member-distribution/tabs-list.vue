<template>
	<div>
		<i-tabs
			v-if="chief"
			:value="type"
			:animated="false"
			type="card"
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item,index) in tabs"
				:key="item.value"
				:label="item.label+count[index]"
				:name="item.value"
			>
				<vc-paging
					ref="tableTarget"
					:columns="loadColumns(type)"
					:show="item.value == type"
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					:table-opts="{height: tableHeight}"
					class="v-hr-personnel-member-distribution-list"
					mode="table"
					@page-change="handlePageChange"
					@page-size-change="handleChangePageSize"
					@selection-change="handleSelectionChange"
					@sort-change="handleSortChange"
				>
					<div v-if="type<2&&chief&&$auth[1747]" slot="extra" class="g-flex-ac">
						<i-checkbox
							v-model="isAll"
							@on-change="handleIsAll"
						>
							全选
						</i-checkbox>
						<i-button :disabled="awaitCount==0" @click="handleAppoint">指派</i-button>
					</div>
				</vc-paging>
			</i-tab-pane>
		</i-tabs>
		<vc-paging
			v-else
			ref="tableTarget"
			:columns="loadColumns(3)"
			:show="true"
			:type="3"
			:data-source="listInfo[3].data"
			:total="listInfo[3].total"
			:reset="listInfo[3].reset"
			:table-opts="{height: tableHeight}"
			:current.sync="current[3]"
			:history="true"
			:load-data="loadData"
			class="v-hr-personnel-member-distribution-list g-m-t-20"
			mode="table"
			@page-change="handlePageChange"
			@page-size-change="handleChangePageSize"
			@selection-change="handleSelectionChange"
			@sort-change="handleSortChange"
		/>
	</div>
</template>

<script>
import { Tabs, TabPane, Button, Checkbox } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/hr';
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/tableHeight';
import { Appoint } from "./popup/Appoint";
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-button': Button,
		'i-checkbox': Checkbox
	},
	mixins: [item, checkAll, tableHeight()],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			count: [0, 0, 0],
			awaitCount: 0,
			tabs: [
				{ label: '待分配', value: '1' },
				{ label: '分配中', value: '2' },
				{ label: '已分配', value: '3' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrPersonnelMemberDistribution.listInfo;
		},
		title() {
			return this.$store.state.hrPersonnelMemberDistribution.title;
		},
		chief() {
			return this.$global.staff.depart_is_charge == 1 && this.$global.staff.depart_lowest == 0;
		}
	},
	created() {

	},
	methods: {
		loadColumns(type) {
			if (type == 1) { return this.columns; }
			if (this.title[type].title_show.length) {
				return this.loadColumnsShow(type);
			} else {
				this.loadTableTitle(type).then(() => { return this.loadColumnsShow(type); });
			}
		},
		loadColumnsShow(type) {
			const columnsShow = this.title[type].title_show.map(cloShow => {
				const result = this.columns1.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);
			this.chief && columnsShow.push({
				title: '操作',
				key: 'status',
				fixed: 'right',
				align: "center",
				width: 100,
				render: (h, { row }) => {
					if (this.type == 2) {
						return (
							this.$auth[1749] && < div
								class= "g-operation"
								onClick={ () => { this.handleChangeAppoint(row); }}
							> 指派</div >
						);
					} else {
						const status = [6, 7, 9];
						return (
						  this.$auth[1751] && <div>
								{
									row.is_open == '1' ? < div class= "g-operation" onClick={ () => { this.handleChangeAppoint(row); }}
									> 重新指派</div > : <div class= "g-operation-disable">重新指派</div>
								}
							</div>
						);
					}

				}
			});
			return columnsShow;
		},
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_PERSONNEL_MEMBER_DISTRIBUTION_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.chief ? this.type : 3,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = [res.data.await_assign_count, res.data.assigning_count, res.data.assign_count];
				this.awaitCount = res.data.await_total_count;


				// if (this.type > 1 || !this.chief) this.loadTableTitle();
				this.$store.commit('HR_PERSONNEL_MEMBER_DISTRIBUTION_COUNT_INIT',
					[res.data.await_total_count, res.data.await_man_count, res.data.await_woman_count,
					 res.data.method, res.data.deadline_start_time, res.data.deadline_end_time, res.data.assign_type]);
			}).catch(console.error);
		},
		handleChange(type) {
			this.type = type;
			if (this.type > 1 || !this.chief) this.loadTableTitle(this.type);
			this.isAll = false;
			this.handleIsAll(false);
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/personnel/member/distribution', { ...query }));
		},
		handleAppoint() {
			if (!this.selected.length) {
				this.$Message.warning('请至少选择一项进行操作！');
				return;
			}
			Appoint.popup({
				data: {
				},
				assign_type: this.selected[0].assign_type,
				type: this.$route.query.type || 1,
				applicant_id: this.selected.map(ele => ele.applicant_id).join(','),
				scenario: 2,
				zone: true,
			}).then(res => {
				this.handleResetCur();
			}).catch(err => { err && console.error(err); });
		},
		handleIsAll(val) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_PERSONNEL_MEMBER_DISTRIBUTION_LIST_INIT');
		},
		loadTableTitle(type) {
			return this.$request({
				url: "_HR_RECRUIT_CONFIG_GET",
				type: "GET",
				param: {
					type: this.chief ? type || "2" : 3,
					// type: 3,
					scenario: 9
				},
				loading: false
			}).then(res => {
				this.$store.commit("HR_PERSONNEL_MEMBER_DISTRIBUTION_TITLE_CHANGE", {
					...res.data,
					type: this.chief ? type || "2" : 3,
				});
				return res;
			}).catch(res => {
				this.$Message.error(res.msg);
			});
		},
		handleSortChange({ order }) {
			let { query = {} } = getParseUrl();
			query.order_by_ticket_arrive_time = order === "asc" ? 0 : 1;
			this.$router.replace(
				getHashUrl('/hr/personnel/member/distribution', { ...query })
			);
			this.$store.commit("HR_PERSONNEL_MEMBER_DISTRIBUTION_LIST_INIT");
		},
	}
};

</script>

<style lang="scss">

</style>
