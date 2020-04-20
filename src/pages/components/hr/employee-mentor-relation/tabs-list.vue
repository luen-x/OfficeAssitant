<template>
	<div class="v-hr-employee-mentor-relation-tabs">
		<oa-filter :is-empty-rule="isEmptyRule"/>
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
				<div
					v-if="isEmptyRule"
					class="_norank g-flex g-fd-c g-jc-c g-ai-c g-m-t-20">
					<img :src="norankUrl">
					<span>该一级部门下未设置师傅规则！</span>
				</div>
				<vc-paging
					v-else
					:columns="columns"
					:show="item.first_depart_id == first_depart_id"
					:type="item.first_depart_id"
					:data-source="listInfo&&listInfo[item.first_depart_id].data"
					:total="listInfo[item.first_depart_id].total"
					:reset="listInfo[item.first_depart_id].reset"
					:current.sync="current[item.first_depart_id]"
					:history="true"
					:table-opts="{height: tableHeight}"
					:load-data="loadData"
					mode="table"
					@page-size-change="handleChangePageSize"
				/>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane, Checkbox, Message } from 'iview';
import { Paging } from 'wya-vc';
import { tableHeight } from "@extends/mixins/table";
import { getParseUrl, getHashUrl } from '@utils/utils';
import { OSS_INVOICE_EMPTY } from '@constants/constants';
import Filter from './filter';
// item
import item from './item';


export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		"oa-filter": Filter,
	},
	mixins: [
		item,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true
		})
	],
	data() {
		const { query } = this.$route;
		return {
			norankUrl: OSS_INVOICE_EMPTY,
			first_depart_id: String(query.first_depart_id), // 同tabs下的value
			current: {},
			isAll: false, 	// 是否全选
			selection: [],
			isEmptyRule: true
		};
	},
	computed: {
		tabs() {
			return this.$store.state.hrEmployeeMentorRelation.tabs || [];
		},
		listInfo() {
			return this.$store.state.hrEmployeeMentorRelation.listInfo;
		}
	},
	watch: {
		tabs(newVal, oldVal) {
			const { query } = this.$route;
			this.first_depart_id = String(query.first_depart_id || (newVal[0] || {}).first_depart_id);
			if (newVal.length === 0) {
				this.loadDepart(query.search);
			}
		},
	},
	mounted() {
		this.loadDepart();
	},
	methods: {
		loadIsEmptyRule(id) {
			let { query = {} } = getParseUrl();
			this.$request({
				url: '_HR_EMPLOYEE_MENTOR_RELATION_IS_EMPTY_GET',
				type: 'GET',
				param: {
					first_depart_id: query.first_depart_id || this.first_depart_id || id,
				},
			}).then((res) => {
				this.isEmptyRule = false;
			}).catch((error) => {
				this.isEmptyRule = true;
				this.$Message.error(error.msg);
			});
			
		},
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_EMPLOYEE_MENTOR_RELATION_LIST_GET',
				type: 'GET',
				param: {
					...query,
					first_depart_id: this.first_depart_id,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				console.error(error);
			});
		},
		loadDepart(search) {
			this.request({
				url: 'HR_MASTER_APPRENTICE_DEPART_LIST_GET',
				type: 'GET',
				param: {
					search,
					first_depart_id: this.first_depart_id
				},
			}).then((res) => {
				res.data.length && res.data[0] && this.loadIsEmptyRule(res.data[0].first_depart_id);
			}).catch((error) => {
				console.error(error);
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
				this.$router.replace(getHashUrl('/hr/employee/mentor/relation', { ...query }));
				this.loadIsEmptyRule();
			}
		},
		handleChangePageSize() {
			this.$store.commit('HR_EMPLOYEE_MENTOR_RELATION_LIST_INIT');
		},
	}
};

</script>

<style lang="scss">
.v-hr-employee-mentor-relation-tabs{
	._norank {
		height: 650px;
		img {
			margin-bottom: 50px;
		}
	}
}	
</style>
