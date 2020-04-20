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
				:columns="getColumns(item.value)"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:table-opts="{ height: tableHeight }"
				:history="true"
				:load-data="loadData"
				class="v-tech-project-publish-notice-list"
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
						v-if="type == '1' && $auth[1426]"
						@click="handleAllSelect"
					>批量下架</i-button>
					<i-button 
						v-if="type == '2' && $auth[1427]"
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
	mixins: [item, checkAll, tableHeight({ expand: false, extra: 20 }), autoFix()],
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
			return this.$store.state.techProjectPublishNotice.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'TECH_PROJECT_PUBLISH_NOTICE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/tech/project/publish/notice');
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
			this.$router.replace(getHashUrl('/tech/project/publish/notice', { ...query }));
			this.$nextTick(() => {
				this.$refs.tableTarget[+type - 1].$refs.tableTarget.handleResize();
			});
		},
		handleAllSelect() {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要操作项');
				return;
			}
			const notice_ids = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.notice_id);
				return initVal;
			}, []);
			this.type == '1' ? this.handleDown(notice_ids)
				: this.handleDelete(notice_ids);
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('TECH_PROJECT_PUBLISH_NOTICE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
