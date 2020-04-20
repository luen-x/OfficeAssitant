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
				class="v-hr-academy-transfer-teacher-detail-list"
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
		'i-tab-pane': TabPane,
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
			isShowed: false,
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
			return this.$store.state.hrAcademyTransferTeacherDetail.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_TRANSFER_TEACHER_DETAIL_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
				loading: false
			}).then((res) => {
				if (!this.isShowed) {
					this.isShowed = true;
					this.$Message.success(res.msg);
				}
				this.resetType('1', this.listInfo.count, '/hr/academy/transfer/teacher/detail');
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
			this.$router.replace(getHashUrl('/hr/academy/transfer/teacher/detail', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_ACADEMY_TRANSFER_TEACHER_DETAIL_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
