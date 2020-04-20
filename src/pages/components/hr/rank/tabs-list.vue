<template>
	<div class="v-hr-rank">
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
				:label="`${item.depart_name}`" 
				:name="item.depart_id + ''"
			>
				<div class="g-tr g-m-b-20 g-m-r-20">
					<router-link 
						v-if="$auth[279]"
						:to="`/hr/rank/info?depart_id=${depart_id}&depart_name=${item.depart_name}`"
						class="g-red-btn-line"
					>
						新建级称体系
					</router-link>
				</div>
				<oa-level-list 
					:depart_id="item.depart_id"
					:depart_name="item.depart_name"
					:show="item.depart_id == depart_id"
					:info="listInfo[item.depart_id]"
					:is-fetched="listInfo[item.depart_id].isFetched"
				/>
			</i-tab-pane>
		</i-tabs>
		
	</div>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { stairDepart } from '@stores/services/hr';
import LevelList from './level-list';

export default {
	name: 'oa-table',
	components: {
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'oa-level-list': LevelList,
	},
	mixins: [stairDepart()],
	data() {
		const { query } = this.$route;

		return {
			depart_id: String(query.depart_id), // 同tabs下的value
			current: {},
		};
	},
	computed: {
		tabs() {
			return this.$store.state.hrRank.tabs;
		},
		listInfo() {
			return this.$store.state.hrRank.listInfo;
		}
	},
	watch: {
		tabs(newVal, oldVal) {
			const { query } = this.$route;
			this.depart_id = String(query.depart_id || (newVal[0] || {}).depart_id);
			if (newVal.length === 0) {
				this.loadStairDepart();
			}
		}
	},
	methods: {
		handleChange(departId) {
			this.depart_id = departId;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				depart_id: departId,
				page: this.current[departId]
			};
			this.$router.replace(getHashUrl('/hr/system/assess/rank', { ...query }));
		},
	}
};

</script>

<style lang="scss">
.v-hr-rank {
	.ivu-tabs-bar {
		margin-left: 20px !important;
	}
}
</style>
