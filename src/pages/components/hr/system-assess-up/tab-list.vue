<template>
	<div class="v-system-assess-up g-tabs-card">
		<div class="g-flex g-jc-fe">
			<span 
				v-if="listInfo[first_depart_id] && listInfo[first_depart_id].length === 0 && $auth[1148]"
				class="g-red-btn-line" 
				@click="handleOpen">启用晋升</span>
		</div>
		<i-tabs 
			:value="first_depart_id" 
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
				<oa-item 
					v-if="first_depart_id == item.depart_id" 
					:info="listInfo[first_depart_id]" />
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';

import { stairDepart } from '@stores/services/hr';
import Item from './item';

export default {
	name: 'oa-system-assess-up',
	components: {
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'oa-item': Item
	},
	mixins: [stairDepart()],
	data() {
		const { query } = this.$route;
		return {
			first_depart_id: query.first_depart_id
		};
	},
	computed: {
		tabs() {
			return this.$store.state.hrSystemAssessUp.tabs;
		},
		listInfo() {
			return this.$store.state.hrSystemAssessUp.listInfo;
		}
	},
	watch: {
		tabs(val) {
			if (!this.first_depart_id) {
				const first_depart_id = val[0].depart_id + "";
				this.first_depart_id = first_depart_id;
				this.$router.push(getHashUrl('/hr/system/assess/up', { first_depart_id: this.first_depart_id }));
			}
			this.loadData(this.first_depart_id);
		}
	},
	methods: {
		handleChange(first_depart_id) {
			this.first_depart_id = first_depart_id;
			this.loadData(first_depart_id);
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				first_depart_id,
			};
			this.$router.replace(getHashUrl('/hr/system/assess/up', { ...query }));
		},
		handleOpen() {
			this.$router.push(getHashUrl('/hr/system/assess/up/add', { first_depart_id: this.first_depart_id }));
		},
		loadData(first_depart_id) {
			this.request({
				url: 'HR_SYSTEM_ASSESS_UP_GET',
				type: 'GET',
				param: { first_depart_id }
			}).then(res => {

			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	},
};
</script>

<style lang="scss" scoped>
.v-system-assess-up {
	padding: 20px;
	.ivu-tabs {
		margin-top: 0px !important;
	}
}
</style>
