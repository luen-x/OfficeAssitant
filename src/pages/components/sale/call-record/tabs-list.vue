<template>
	<div class="v-sale-call-record">
		<div class="g-flex g-jc-sa g-m-t-20 _item">
			<div class="__count-block">
				<div class="__label">
					拨号数量
					<oa-explain placement="bottom-start" title="主动向客户拨打号码的次数" content="举例：向某个客户拨打了5次电话，其中接通3次，未接通2次，则拨号数量为5次" />
				</div>
				<div class="__value">
					{{ count_data[tab_type].count_all }}
				</div>
			</div>
			<div class="__count-block">
				<div class="__label">
					接通数量
					<oa-explain placement="bottom-start" title="主动向客户拨打号码且接通的次数" content="举例：向某个客户拨打了5次电话，其中接通3次，未接通2次，则接通数量为3次" />
				</div>
				<div class="__value">
					{{ count_data[tab_type].connect_count }}
	
				</div>
			</div>
	
			<div class="__count-block">
				<div class="__label">
					接通率
					<oa-explain placement="bottom-start" title="接通数量除以拨号数量所得" content="举例：假如拨号数量为10，接通数量为8，则接通率为80%" />
				</div>
				<div class="__value">
					{{ count_data[tab_type].connect_rate }}
				</div>
			</div>
			<div class="__count-block">
				<div class="__label">
					平均通话时长
					<oa-explain placement="bottom-start" title="给客户拨打电话且接通的平均通话时间" content="举例：给某个客户拨打过3次电话，每次通话时间分别为10分钟、15分钟、20分钟，则平均通话时长为15分钟" />
				</div>
				<div class="__value">
					{{ count_data[tab_type].avg_last_time }}
				</div>
			</div>
	
			<div class="__count-block">
				<div class="__label">
					总通话时长
					<oa-explain placement="bottom-start" title="给客户拨打电话且接通的总通话时间" content="举例：给某个客户拨打过3次电话，每次通话时间分别为10分钟、15分钟、20分钟，则总通话时长为45分钟" />
				</div>
				<div class="__value">
					{{ count_data[tab_type].total_last_time }}
				</div>
			</div>
		</div>
		<i-tabs
			v-if="$auth[1020] && $auth[1021]"
			:value="tab_type"
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
					:columns="getColumns(item.value)" 
					:show="item.value == tab_type"
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData" 
					mode="table" 
					class="g-m-t-20" 
					style="margin-bottom:0px"
					@page-change="handlePageChange" 
					@page-size-change="handleChangePageSize"
					@selection-change="handleSelectionChange"
				>
					<div slot="extra">
						<i-checkbox 
							v-model="isAll"
							@on-change="handleIsAll"
						>
							全选
						</i-checkbox>
						<i-button @click="handleDownloadAll">下载</i-button>
					</div>
				</vc-paging>
			</i-tab-pane>
		</i-tabs>
		<vc-paging 
			v-else-if="$auth[1020] || $auth[1021]"
			ref="tableTarget" 
			:columns="getColumns(initTab)"
			:data-source="listInfo[initTab].data"
			:total="listInfo[initTab].total"
			:reset="listInfo[initTab].reset"
			:history="true"
			:load-data="loadData" 
			mode="table" 
			class="g-m-t-20" 
			style="margin-bottom:0px"
			@page-change="handlePageChange" 
			@page-size-change="handleChangePageSize"
			@selection-change="handleSelectionChange"
		>
			<div slot="extra">
				<i-checkbox 
					v-model="isAll"
					@on-change="handleIsAll"
				>
					全选
				</i-checkbox>
				<i-button @click="handleDownloadAll">下载</i-button>
			</div>
		</vc-paging>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { Tabs, TabPane, Checkbox, Button, Poptip } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import Explain from '@components/_common/explain/explain';
import { createCheckAll } from '@extends/mixins/checkAll';
import API from '@stores/apis/root';
import moment from 'moment';
import item from './item';

const indexMap = { '1': 0, '2': 1 };

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-checkbox': Checkbox,
		"i-button": Button,
		'i-poptip': Poptip,
		'oa-explain': Explain
	},
	mixins: [item, createCheckAll({ key: 'tab_type' })],
	data() {
		const { query } = this.$route;
		return {
			tab_type: '1',
			current: {},
			count_data: {
				'1': {
					count_all: 0, // 拨号数量
					connect_count: 0, // 接通数量
					connect_rate: "0%", // 接通率
					total_last_time: "00:00:00", // 总通话时长
					avg_last_time: "00:00:00" // 平均通话时长
				},
				'2': {
					count_all: 0, // 拨号数量
					connect_count: 0, // 接通数量
					connect_rate: "0%", // 接通率
					total_last_time: "00:00:00", // 总通话时长
					avg_last_time: "00:00:00" // 平均通话时长
				}
			},
			tabs: [
				{ label: '销售录音', value: '1', }, 
				{ label: '质检录音', value: '2' }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleCallRecord.listInfo;
		},
		initTab() {
			if (this.$auth[1020]) {
				return '1';
			} else if (this.$auth[1021]) {
				return '2';
			}
		}
	},
	created() {
		const { query = {} } = getParseUrl();
		
		if (this.$auth[1020]) {
			this.tab_type = String(query.tab_type || "1");
		} else if (this.$auth[1021]) {
			this.tab_type = String(query.tab_type || "2");
		}
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_CALL_RECORD_LIST_GET',
				type: 'GET',
				param: {
					...query,
					tab_type: this.tab_type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count_data[this.tab_type] = res.data.count_data;
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(tab_type) {
			this.isAll = false;
			this.tab_type = tab_type;
			this.selected = [];

			if (this.$auth[1020] && this.$auth[1021]) {
				this.$refs.tableTarget[indexMap[this.tab_type]].$refs.tableTarget.selectAll(false);
			} else if (this.$auth[1020] || this.$auth[1021]) {
				this.$refs.tableTarget.$refs.tableTarget.selectAll(false);
			}

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				tab_type,
				page: this.current[tab_type]
			};
			
			this.$router.replace(getHashUrl('/sale/call/record', { ...query }));
		},
		handleChangePageSize() {
			this.isAll = false;
			this.selected = [];

			if (this.$auth[1020] && this.$auth[1021]) {
				this.$refs.tableTarget[indexMap[this.tab_type]].$refs.tableTarget.selectAll(false);
			} else if (this.$auth[1020] || this.$auth[1021]) {
				this.$refs.tableTarget.$refs.tableTarget.selectAll(false);
			}
			
			this.$store.commit('SALE_CALL_RECORD_LIST_RESET', { tab_type: this.tab_type });
		},
		handleIsAll(val) {
			if (this.$auth[1020] && this.$auth[1021]) {
				this.$refs.tableTarget[indexMap[this.tab_type]].$refs.tableTarget.selectAll(val);
			} else if (this.$auth[1020] || this.$auth[1021]) {
				this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
			}
		},
		handleDownloadAll() {
			const urls = this.selected.filter(item0 => item0.agent_duration != '00:00:00').map(item0 => item0.download);
			this.handleDownload(urls);
		},
	}
};
</script>

<style lang="scss">
.v-sale-call-record {
	._item {
		background-color: #f5f5f6;
		height: 130px;
		margin: 20px 0px;
		display: flex;
		justify-content: center;
		align-items: center;
		.__count-block {
			width: 20%;
			padding: 30px;
			height:85px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.__label {
				color: #818794;
				font-size: 14px;
			}
			.__value {
				color: #333;
				font-size: 24px;
				margin-top: 5px;
			}
		}
		.__count-block+.__count-block {
			border-left: 1px solid #d4d7db;
		}
	}
	.ivu-table-cell {
		white-space: nowrap;
	}
	.vc-paging .__footer {
		width: 100% !important
	}
}
</style>
