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
				:table-opts="{height: tableHeight,}"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				class="v-content-config-material-record-list"
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
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [item, tableHeight({ tab: false, extra: 100 })],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '下载记录', value: '1' },
				{ label: '上传记录', value: '2' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentConfigMaterialRecord.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			if (this.type == 1) {
				return this.request({
					url: 'CONTENT_CONFIG_MATERIAL_DOWNLOAD_LIST_GET',
					redirect: 'CONTENT_CONFIG_MATERIAL_RECORD_LIST_GET_SUCCESS',
					type: 'GET',
					param: {
						...query,
						type: 3,
						page,
						pageSize
					},
				}).then((res) => {}).catch((error) => {
					console.error(error);
				});
			} else {
				return this.request({
					url: 'CONTENT_CONFIG_MATERIAL_UPLOAD_LIST_GET',
					redirect: 'CONTENT_CONFIG_MATERIAL_RECORD_LIST_GET_SUCCESS',
					type: "GET",
					param: {
						type: this.type,
						...query,
						page,
						pageSize
					}
				}).then(res => {})
					.catch(error => {
						this.$Message.error(error.msg);
					});
			}

		},

		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/content/config/material/record', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('CONTENT_CONFIG_MATERIAL_RECORD_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
