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
				:reset="listInfo[item.value].reset"
				:table-opts="{height: tableHeight,}"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				class="v-content-config-material-role-list"
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
// item
import { tableHeight } from '@extends/mixins/tableHeight';
import { autoFix } from '@extends/mixins/auto-fix';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [item, tableHeight({ tab: false, extra: 100 }), autoFix()],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			count: ''
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentConfigMaterialRole.listInfo;
		},
		tabs() {
			return [
				{ label: `待审核${this.count.check_count || 0}`, value: '1' },
				{ label: `已通过${this.count.pass_count || 0}`, value: '2' },
				{ label: `已驳回${this.count.refuse_count || 0}`, value: '3' }
			];
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'CONTENT_CONFIG_MATERIAL_ROLE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize,
				},
			}).then((res) => {
				
				this.count = res.data;
				const count = [this.count.check_count, this.count.pass_count, this.count.refuse_count];
				this.resetType('1', count, '/content/config/material/role');
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				fixPosition: false,
				is_control_role: 1,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/content/config/material/role', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('CONTENT_CONFIG_MATERIAL_ROLE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-content-config-material-role-list{
        ._inline-block {
            display: inline-block;
            vertical-align: middle;
        }
		._left-border::after{
			content: "|";
			color:'#515a6e';
		}
		._left-border:last-child::after{
			content: "";
		}
}
</style>
