<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		class="v-hr-information-publish"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="`${item.label} ${listInfo.count[index]}`" 
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="columns"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				class="v-content-information-publish-list"
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
						v-if="type == '1' && $auth[1550]"
						@click="handleAllSelect"
					>批量下架</i-button>
					<i-button 
						v-if="type == '2' && $auth[1655]"
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
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-button': Button,
		'i-checkbox': Checkbox
	},
	mixins: [item, checkAll],
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
			return this.$store.state.contentInformationPublish.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			this.isSelect = false;
			this.selection = [];
			let { query = {} } = getParseUrl();
			let category_id = query.category_id || this.classList[0].category_id;
			return this.request({
				url: 'CONTENT_INFORMATION_PUBLISH_LIST_GET',
				type: 'GET',
				param: {
					...query,
					status: this.type,
					type: this.type,
					category_id,
					page,
					pageSize
				},
			}).then((res) => {
				
			}).catch(console.error);
		},
		handleIsAll(val) {
			this.$refs.tableTarget[+this.type - 1].$refs.tableTarget.selectAll(val);
		},
		handleChange(type = '1') {
			this.type = type;
			this.isAll = false;
			this.handleIsAll(false);
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/content/information/publish', { ...query }));
			this.$nextTick(() => {
				this.$refs.tableTarget[+type - 1].$refs.tableTarget.handleResize();
			});
		},
		handleAllSelect() {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要操作项');
				return;
			}
			const means_ids = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.means_id);
				return initVal;
			}, []);
			this.type === '1' ? this.handleDown(means_ids)
				: this.handleDelete(means_ids);
		},
		handleChangePageSize() {
			this.$store.commit('CONTENT_INFORMATION_PUBLISH_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-hr-information-publish {
	.vc-paging .__footer {
		width: calc(100% - 482px) !important;
	}
}
</style>
