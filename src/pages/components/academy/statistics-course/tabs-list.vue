<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i v-show="(type==2||type==3) && $auth[1670]" slot="extra" class="g-operation iconfont icon-qushitu " @click="handlePush"/>
		<i-tab-pane
			v-for="(item,index) in tabs"
			:key="item.value"
			:label="`${item.label} ${listInfo.count[index]}`"
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="getColumns(item.value)"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight}"
				class="v-academy-statistics-course-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@page-change="handlePageChange"
				@selection-change="handleSelectionChange"
			>
				<div v-if="+type === 4 && ($auth[1650] || $auth[1651])" slot="extra" class="g-flex-ac">
					<i-checkbox
						v-model="isAll"
						@on-change="handleIsAll"
					>
						全选
					</i-checkbox>
					<i-button v-if="$auth[1650]" @click="handleBatch(1)">
						恢复
					</i-button>
					<i-button v-if="$auth[1651]" class="g-m-l-10" @click="handleBatch(2)">
						彻底删除
					</i-button>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from "@extends/mixins/tableHeight";
import checkAll from '@extends/mixins/checkAll';
import { Confirm } from "@components/_common/confirm/confirm";
import { autoFix } from '@extends/mixins/auto-fix';
import moment from "moment";
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		"i-checkbox": Checkbox,
		"i-button": Button
	},
	mixins: [
		item,
		checkAll,
		tableHeight({
			nav2: false
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '岗前培训', value: '1' },
				{ label: '三立培训', value: '2' },
				{ label: '三立训练', value: '3' },
				{ label: '课程回收站', value: '4' }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academyStatisticsCourse.listInfo;
		}
	},
	created() {
		this.$store.commit('ACADEMY_STATISTICS_COURSE_SELECTED_TAB', this.type);
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			let practice_type = +this.type === 3 ? (query.practice_type || '0') : null;

			return this.request({
				url: 'ACADEMY_STATISTICS_COURSE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize,
					practice_type
				},
			}).then(res => {
				this.resetType('1', this.listInfo.count, '/academy/statistics/course');
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handlePush() {
			const { query } = this.$route;
			 if (!query.start_time || moment(query.end_time).isBefore(moment(query.start_time).add(6, 'month'))) {
				 this.$router.push({ path: '/academy/statistics/course/trend', query: { ...this.$route.query } });
			 } else {
				 this.$Message.warning('趋势图查看时间不能超过半年，请重新选择');
			 }
		},
		handleChange(type) {
			this.type = type;
			this.handleIsAll(false);

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			let practice_type = +this.type === 3 ? (query.practice_type || '0') : null;

			query = {
				...query,
				type,
				fixPosition: false,
				practice_type,
				page: this.current[type]
			};

			if (+this.type === 3) {
				this.$store.commit('ACADEMY_STATISTICS_COURSE_LIST_RESET', { type: this.type });
			}

			this.$router.replace(getHashUrl('/academy/statistics/course', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('ACADEMY_STATISTICS_COURSE_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},
		handleBatch(name) {
			if (this.selected.length === 0) {
				this.$Message.warning("请选择具体的数据再进行操作哦~");

				return;
			}

			let course_ids = [];
			let msg = ['恢复后，课程将进入“培训安排”课程列表中（不恢复到课程表中）', '删除后无法恢复，确定要删除吗？'][name - 1];
			let url = ['_ACADEMY_STATISTICS_COURSE_RECOVERY_LIST_POST', '_ACADEMY_STATISTICS_COURSE_DELETE_LIST_POST'][name - 1];

			this.selected.forEach(element => {
				course_ids.push(element.course_id);
			});

			Confirm.popup({
				title: "",
				msg,
				showIcon: true
			}).then(() => {
				this.$request({
					url,
					type: "POST",
					param: {
						course_ids
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
					this.$store.commit('ACADEMY_STATISTICS_COURSE_LIST_RESET', { type: this.type });
					this.isAll = false;
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		}
	}
};
</script>

<style lang="scss">
</style>