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
				class="v-hr-recruit-school-depart-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Paging } from 'wya-vc';
import { Button, Checkbox, Tabs, TabPane } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
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
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '已分配人数', value: '1' },
				{ label: '分配未来人数', value: '2' },
				{ label: '离开人数', value: '3' },
				{ label: '离职人数', value: '4' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSchoolDepart.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RECRUIT_SCHOOL_DEPART_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = [res.data.assign_count, res.data.weed_out_count, res.data.departure_count, res.data.leave_count];
				this.resetType('1', this.count, '/hr/recruit/school/depart');
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
			this.$router.replace(getHashUrl('/hr/recruit/school/depart', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_RECRUIT_SCHOOL_DEPART_LIST_INIT');
		},
		// 指派
		handleAssign() {
			if (this.selected.length) {
				assignPModal.popup({
					data: {
						selected: this.selected,
					}
				}).then(res => {
					this.$Message.success('操作成功');
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
