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
				class="v-academy-transfer-teacher-detail-list"
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
import { autoFix } from '@extends/mixins/auto-fix';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane
	},
	mixins: [
		item,
		tableHeight({
			footer: true,
			extraHeight: 90
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '培训人数', value: '1' },
				{ label: '试岗流失人员', value: '2' },
				{ label: '试岗pass人数', value: '3' },
				{ label: '入职人数', value: '4' },
				{ label: '入职15天流失人数', value: '5' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academyTransferStatisticsTeacher.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();

			return this.request({
				url: 'ACADEMY_TRANSFER_STATISTICS_TEACHER_LIST_GET',
				type: 'POST',
				param: {
					...query,
					type: this.type,
					page,
					pageSize,
					participator: JSON.parse(query.participator)
				},
				loading: false
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/academy/transfer/statistics/teacher');
			}).catch((error) => {
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				fixPosition: false,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/academy/transfer/statistics/teacher', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('ACADEMY_TRANSFER_STATISTICS_TEACHER_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
</style>