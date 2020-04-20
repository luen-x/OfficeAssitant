<template>
	<div>
		<div class="g-tr">
			<div
				class="g-red-btn-line"
				@click="handleAdd"
			>
				发布道具
			</div>
		</div>
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
					ref="tableTarget"
					:columns="columns"
					:show="item.value == type" 
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:table-opts="{height: tableHeight}"
					:history="true"
					:load-data="loadData"
					class="v-sale-property-control-list"
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
							@click="handleDownAll"
						>批量{{ type == '1' ? '下架' : '删除' }}</i-button>
					</div>
				</vc-paging>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import checkAll from '@extends/mixins/checkAll';
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
	mixins: [item, checkAll, tableHeight({ })],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '出售中', value: '1' }, 
				{ label: '已下架', value: '2' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.salePropertyControl.listInfo;
		}
	},
	methods: {
		handleIsAll(val) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_PROPERTY_CONTROL_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				
			}).catch(console.error);
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/sale/property/control', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_PROPERTY_CONTROL_LIST_INIT');
		},
		handleDownAll() {
			if (!this.selected.length) {
				this.$Message.warning(`请先选择要${this.type == '1' ? '下架' : '删除'}的项`);
				return;
			}
			const prop_ids = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.prop_id);
				return initVal;
			}, []);
			this.handleDelete(prop_ids);
		},
		handleAdd() {
			this.$router.push({
				path: '/sale/property/control/add'
			});
		}
	}
};

</script>

<style lang="scss">

</style>
