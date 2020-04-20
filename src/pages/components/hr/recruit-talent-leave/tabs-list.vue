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
			:key="item.depart_id"
			:label="`${item.depart_name} ${listInfo.count[index]}`" 
			:name="item.depart_id + ''"
		>
			<vc-paging
				v-if="listInfo[item.depart_id]"
				:columns="columns[type]"
				:show="item.depart_id == type" 
				:type="item.depart_id"
				:data-source="listInfo[item.depart_id].data"
				:total="listInfo[item.depart_id].total"
				:reset="listInfo[item.depart_id].reset"
				:current.sync="current[item.depart_id]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight}"
				class="v-hr-recruit-talent-leave-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { stairDepart } from '@stores/services/hr';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
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
			
		}),
		stairDepart()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			yxzx_id: 0
		};
	},
	computed: {
		tabs() {
			return this.$store.state.hrRecruitTalentLeave.tabs;
		},
		listInfo() {
			return this.$store.state.hrRecruitTalentLeave.listInfo;
		}
	},
	watch: {
		tabs(val) {
			const { query } = this.$route;
			this.type = query.type || (this.tabs[0] && this.tabs[0].depart_id + "");
			val && val.forEach(info => {
				this.columns[info.depart_id] = this.getColumns(info.depart_id);
			});
		},
		yxzx_id(val) {
			this.$set(this.columns, val, this.getColumns(val));
		}
	},
	mounted() {
		this.loadFirstDepart();
	},
	methods: {
		loadFirstDepart() {
			this.$request({
				url: '_FINANCE_FIRST_DEPART_GET',
				type: 'GET',
				param: {
				},
			}).then((res) => {
				this.yxzx_id = res.data.sale;
			}).catch(console.error);
		},
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RECRUIT_TALENT_LEAVE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				
			}).catch(console.error);
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/recruit/talent/leave', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_RECRUIT_TALENT_LEAVE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
