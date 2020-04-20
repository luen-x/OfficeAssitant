<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item,index) in tabs"
			:key="item.value"
			:label="item.label" 
			:name="index + ''"
		>
			<div v-if="tabs.length > 0">
				<vc-paging
					ref="tableTarget"
					:columns="columns"
					:show="index == type" 
					:type="index"
					:data-source="listInfo[index].data"
					:history="true"
					:total="1"
					:footer="false"
					:load-data="loadData"
					:expand-opts="expand"
					class="v-tech-project-publish-document-category-list"
					mode="table"
					@page-size-change="handleChangePageSize"
					@expand="handleExpand"
				/>
			</div>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
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
	mixins: [item],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			tabs: [],
			expand: {
				all: true,
				keys: [1],
				key: 'document_id'
			}
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.techProjectPublishDocumentCategory.listInfo;
		}
	},
	created() {
		this.loadProjectData();
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();

			return this.request({
				url: 'TECH_PROJECT_PUBLISH_DOCUMENT_CATEGORY_LIST_GET',
				type: 'GET',
				param: {
					type: this.type,
					project_id: this.tabs[this.type || 0].value
				},
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		loadProjectData() {
			this.$request({
				url: 'TECH_PROJECT_PLAN_OVERVIEW_LIST_GET',
				type: 'GET',
				param: {
					is_page: 0
				},
			}).then((res) => {
				res.data.list.forEach(element => {
					this.tabs.push({
						label: element.project_name,
						value: element.project_id
					});
				});

				this.$store.commit('TECH_PROJECT_PUBLISH_DOCUMENT_CATEGORY_TABS_GET', this.tabs);
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/tech/project/publish/document/category', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('TECH_PROJECT_PUBLISH_DOCUMENT_CATEGORY_LIST_INIT');
		},
		handleExpand({ maxLevel }) {
			this.columns[0].width = maxLevel * 10 + 200;
		}
	}
};
</script>

<style lang="scss">
</style>