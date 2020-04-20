<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item) in tabs"
			:key="item.value"
			:label="item.label"
			:name="item.value"
		>
			<vc-paging
				:columns="columns"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:table-opts="{height: tableHeight,}"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				class="v-sale-train-study-audit-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
// item
import { autoFix } from '@extends/mixins/auto-fix';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [item, tableHeight({ extra: 80 }), autoFix()],
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			count: {},

		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleTrainStudyAudit.listInfo;
		},
		tabs() {
			return [
				{ label: `待审核${this.count.wait_count || 0}`, value: '1' },
				{ label: `已通过${this.count.pass_count || 0}`, value: '2' },
				{ label: `未通过${this.count.not_pass_count || 0}`, value: '3' }
			];
		},
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_TRAIN_STUDY_AUDIT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = res.data;
				const count = [this.count.wait_count, this.count.pass_count, this.count.not_pass_count];
				this.resetType('1', count, '/sale/train/study/audit');
			}).catch((error) => {
				console.error(error);
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
			this.$router.replace(getHashUrl('/sale/train/study/audit', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_TRAIN_STUDY_AUDIT_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
