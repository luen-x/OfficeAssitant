<template>
	<div class="v-hr-employee-mentor-rule-tabs">
		<i-tabs
			:value="first_depart_id"
			:animated="false"
			type="card"
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item) in tabs"
				:key="item.first_depart_id"
				:label="`${item.depart_name}`"
				:name="item.first_depart_id + ''"
			>
				<oa-rule v-if="item.first_depart_id==first_depart_id" :first_depart_id="first_depart_id"/>
			</i-tab-pane>
		</i-tabs>
	</div>

</template>

<script>
import { Tabs, TabPane, Checkbox, Message } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import Rule from './rule';


export default {
	name: 'v-hr-employee-mentor-rule-tabs',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'oa-rule': Rule,
	},
	data() {
		const { query } = this.$route;

		return {
			first_depart_id: String(query.first_depart_id), // 同tabs下的value
			current: {},
			isAll: false, 	// 是否全选
			selection: []
		};
	},
	computed: {
		tabs() {
			return this.$store.state.hrEmployeeMentorRule.tabs || [];
		},
	
	},
	watch: {
		tabs(newVal, oldVal) {
			const { query } = this.$route;
			this.first_depart_id = String(query.first_depart_id || (newVal[0] || {}).first_depart_id);
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
		this.loadDepart();
	},
	methods: {
		loadDepart(search) {
			this.request({
				url: 'HR_MASTER_APPRENTICE_DEPART_LIST_GET',
				type: 'GET',
				param: {
					search,
					first_depart_id: this.first_depart_id
				},
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChange(departId) {
			if (this.first_depart_id !== departId) {
				this.first_depart_id = departId;
				let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
				query = {
					...query,
					first_depart_id: departId,
					page: this.current[departId]
				};
				this.$router.replace(getHashUrl('/hr/employee/mentor/rule', { ...query }));
			}
		},
	}
};

</script>

<style lang="scss">
.v-hr-employee-mentor-rule-tabs{
	position: relative;
	margin-left: 20px
}

</style>
