<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		class="v-tech-project-publish-document-list"
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
				:columns="getColumns(item.value)"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:table-opts="{ height: tableHeight }"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				mode="table"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
			>
				<div slot="extra" class="g-flex-ac">
					<i-checkbox
						v-model="isAll"
						@on-change="handleIsAll"
					>
						全选
					</i-checkbox>
					<i-button 
						v-if="type == '1' && $auth[1433]"
						@click="handleAllSelect"
					>批量下架</i-button>
					<i-button 
						v-if="type == '2' && $auth[1434]"
						@click="handleAllSelect"
					>批量删除</i-button>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from 'iview';
import { Paging } from 'wya-vc';
import checkAll from '@extends/mixins/checkAll';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { autoFix } from '@extends/mixins/auto-fix';
import API_ROOT from "@stores/apis/root";
import { tableHeight } from '@extends/mixins/tableHeight';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item, checkAll, tableHeight({ expand: false, extra: 40 }), autoFix()],
	props: {
		classList: Array
	},
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '发布中', value: '1' }, 
				{ label: '已下架', value: '2' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.techProjectPublishDocument.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			let documentId = Number;
			let projectId = null;
			let isHaveid = getParseUrl().query;
			this.isSelect = false;
			this.selection = [];
			if (!isHaveid.document_id) {
				documentId = this.classList[0].document_id;
				projectId = this.classList[0].project_id;
			} else {
				documentId = getParseUrl().query.document_id;
				projectId = getParseUrl().query.project_id;
			}
			return this.request({
				url: 'TECH_PROJECT_PUBLISH_DOCUMENT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize,
					document_id: documentId,
					project_id: projectId
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/tech/project/publish/document');
			}).catch((error) => {
				console.error(error);
			});
		},
		handleIsAll(val) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},
		handleChange(type) {
			this.type = type;
			this.isAll = false;
			this.handleIsAll(false);

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/tech/project/publish/document', { ...query }));
			this.$nextTick(() => {
				this.$refs.tableTarget[+type - 1].$refs.tableTarget.handleResize();
			});
		},
		handleAllSelect() {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要操作项');
				return;
			}
			const read_ids = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.read_id);
				return initVal;
			}, []);
			this.type == '1' ? this.handleDown(read_ids)
				: this.handleDelete(read_ids);
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('TECH_PROJECT_PUBLISH_DOCUMENT_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-tech-project-publish-document-list {
	.__footer {
		width: calc(100% - 490px) !important;
	}
}
</style>
