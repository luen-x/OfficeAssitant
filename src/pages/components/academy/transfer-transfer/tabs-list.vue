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
			:label="`${item.label} ${listInfo.count[index]}`"
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
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight}"
				class="v-academy-transfer-transfer-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
			>
				<div v-if="show" slot="extra" class="g-flex-ac">
					<i-checkbox
						v-model="isAll"
						@on-change="handleIsAll"
					>
						全选
					</i-checkbox>
					<i-button v-if="+type === 1 && $auth[1569]" @click="handleBatch(1)">
						批量培训
					</i-button>
					<i-button v-if="$auth[1570]" class="g-m-l-10" @click="handleBatch(2)">
						批量跟踪
					</i-button>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from "@extends/mixins/tableHeight";
import checkAll from '@extends/mixins/checkAll';
import { autoFix } from '@extends/mixins/auto-fix';
import { ArrangeTraining } from "./popup/arrange-training";
import { DetailDrawer } from "./popup/detail";
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		"i-checkbox": Checkbox,
		"i-button": Button
	},
	mixins: [
		item,
		checkAll,
		tableHeight({
			nav2: false
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '培训中', value: '1' }, 
				{ label: '培训完成', value: '2' }, 
				{ label: '已淘汰', value: '3' },
				{ label: '试岗表', value: '4' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academyTransferTransfer.listInfo;
		},
		show() {
			return (+this.type === 1 && (this.$auth[1569] || this.$auth[1570])) || (+this.type === 2 && this.$auth[1570]);
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			let try_depart_id = this.$route.query.try_depart_id ? (this.$route.query.try_depart_id + '').split(",").pop() : null;
				
			return this.request({
				url: 'ACADEMY_TRANSFER_TRANSFER_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize,
					try_depart_id
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/academy/transfer/transfer');
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChange(type) {
			this.type = type;
			this.handleIsAll(false);

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				fixPosition: false,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/academy/transfer/transfer', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('ACADEMY_TRANSFER_TRANSFER_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},
		// 批量操作
		handleBatch(value) {
			let applicants = [];
			
			if (this.selected.length === 0) {
				this.$Message.warning("请选择具体的数据再进行操作哦~");

				return;
			}

			this.selected.forEach(element => {
				applicants.push(element);
			});

			if (value === 1) {
				ArrangeTraining.popup({
					applicants,
					name: "batch"
				}).then(res => {
					this.handleIsAll(false);
					this.$store.commit('ACADEMY_TRANSFER_TRANSFER_LIST_RESET', { type: this.type });
				});
			} else {
				DetailDrawer.popup({
					participate: this.selected
				}).then(res => {
					this.handleIsAll(false);
					this.$store.commit('ACADEMY_TRANSFER_TRANSFER_LIST_RESET', { type: this.type });
				});
			}
		}
	}
};
</script>

<style lang="scss">
</style>