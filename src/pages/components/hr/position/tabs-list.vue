<template>
	<i-tabs
		:value="depart_id"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item) in tabs"
			:key="item.depart_id"
			:label="`${item.depart_name} ${item.num}`"
			:name="item.depart_id + ''"
		>
			<vc-paging
				:ref="'talbe' + item.depart_id"
				:columns="columns"
				:show="item.depart_id == depart_id"
				:type="item.depart_id"
				:data-source="listInfo[item.depart_id].data"
				:total="listInfo[item.depart_id].total"
				:reset="listInfo[item.depart_id].reset"
				:current.sync="current[item.depart_id]"
				:history="true"
				:load-data="loadData"
				class="v-hr-position-list"
				mode="table"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
			>
				<div v-if="$auth[278]" slot="extra" class="g-flex-ac">
					<i-checkbox
						v-model="isAll"
						@on-change="handleIsAll"
					>
						全选
					</i-checkbox>
					<div class="g-gray-btn-line" @click="handleBatchDel">
						批量删除
					</div>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Message } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { createCheckAll } from '@extends/mixins/checkAll';
import { autoFix } from '@extends/mixins/auto-fix';
// import { stairDepart } from '@stores/services/hr';
import { DelTipModal } from './popup/delete-tip';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-checkbox': Checkbox
	},
	mixins: [
		item,
		createCheckAll({ key: 'depart_id' }),
		autoFix()
		// stairDepart
	],
	data() {
		const { query } = this.$route;

		return {
			depart_id: String(query.depart_id), // 同tabs下的value
			current: {},
			firstLoad: !query.depart_id,
			isAll: false, 	// 是否全选
			selection: []
		};
	},
	computed: {
		tabs() {
			return this.$store.state.hrPosition.tabs || [];
		},
		listInfo() {
			return this.$store.state.hrPosition.listInfo;
		}
	},
	watch: {
		tabs(newVal, oldVal) {
			const { query } = this.$route;
			this.depart_id = String(query.depart_id || (newVal[0] || {}).depart_id);
			if (newVal.length === 0) {
				this.loadDepart(query.search);
			}
		},
		$route(to, from) {
			const { query } = this.$route;
			this.loadDepart(query.search);
		},
	},
	mounted() {
		const { query } = this.$route;
		this.loadDepart(query.search);
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_POSITION_LIST_GET',
				type: 'GET',
				param: {
					...query,
					depart_id: this.depart_id,
					page,
					pageSize
				},
			}).then((res) => {
				const count = this.tabs.map(info => info.num);
				const defaultType = this.tabs[0].depart_id;
				const tabs = this.tabs.map(info => {
					info.value = info.depart_id;
					return info;
				});
				const type = 'depart_id';
				this.resetType(defaultType, count, '/hr/system/position', { tabs, type });
			}).catch((error) => {
			});
		},
		loadDepart(search) {
			this.request({
				url: 'HR_POSITION_LIST_TABLE_GET',
				type: 'GET',
				param: {
					search
				},
			}).then((res) => {
				
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(departId) {
			if (this.depart_id !== departId) {
				this.isAll = false;
				this.handleIsAll(false);
				this.depart_id = departId;

				let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
				query = {
					...query,
					depart_id: departId,
					fixPosition: false,
					page: this.current[departId]
				};
				this.$router.replace(getHashUrl('/hr/system/position', { ...query }));
			}
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_POSITION_LIST_INIT');
		},
		// 点击全选
		handleIsAll(val) {
			this.$refs['talbe' + this.depart_id][0].$refs.tableTarget.selectAll(val);
		},
		handleBatchDel() {
			if (this.selected.length === 0) {
				Message.warning('请先选择要删除的职位');
				return;
			}
			let arr = this.selected.filter((it, index) => {
				return it.num == 0;
			});
			let content = '是否确认批量删除职位，删除后不可恢复';
			if (arr.length < this.selected.length) {
				content = '存在职位人数不为0，不可批量删除';
			}

			DelTipModal.popup({
				title: '批量删除',
				content,
				canDel: arr.length === this.selected.length,
				positionIds: arr.map((id) => id.position_id)
			}).then((res) => {
				this.$Message.success('删除成功');
				this.isAll = false;
			}).catch((res) => {

			});
		}
	}
};

</script>

<style lang="scss">

</style>
