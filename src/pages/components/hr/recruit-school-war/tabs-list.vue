<template>
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
				class="v-hr-recruit-school-war-list"
				mode="table"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
			>
				<div slot="extra" class="g-flex-ac">

					<i-checkbox
						v-if="type == 1"
						v-model="isAll"
						@on-change="handleIsAll">
						全选
					</i-checkbox>

					<i-button
						v-if="type == 1"
						type="default"
						class="g-m-l-10"
						@click="handleAssign">
						指派
					</i-button>

				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Paging } from 'wya-vc';
import { Button, Checkbox, Tabs, TabPane } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { autoFix } from '@extends/mixins/auto-fix';
import { assignPModal } from './popup/assign.vue';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'i-button': Button,
		'i-checkbox': Checkbox,
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [
		item,
		checkAll,
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '待分配', value: '1' },
				{ label: '已分配', value: '2' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSchoolWar.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RECRUIT_SCHOOL_WAR_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = [res.data.await_assign_count, res.data.assign_count];
				this.resetType('1', this.count, '/hr/recruit/school/war');
			}).catch((error) => {
			});
		},
		handleChange(type) {
			if (this.type !== type) {
				this.isAll = false;
				this.handleIsAll(false);
				this.type = type;

				let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
				query = {
					...query,
					type,
					fixPosition: false,
					page: this.current[type]
				};
				this.$router.replace(getHashUrl('/hr/recruit/school/war', { ...query }));
			}
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_RECRUIT_SCHOOL_WAR_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},
		// 指派
		handleAssign() {
			if (this.selected.length) {
				assignPModal.popup({
					selected: this.selected,
				}).then(res => {
					this.isAll = false;
				}).catch(() => {});
			} else {
				this.$Message.warning('请至少选择一项进行操作！');
			}
		}
	}
};

</script>

<style lang="scss">

</style>
