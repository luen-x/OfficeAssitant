<template>
	<div class="v-sale-customer-business">
		<oa-record v-show="(level==4||type==2)&&source_list1.length>0" :data-source="source_list1"/>
		<oa-record v-show="(level!=4&&type==1)&&source_list2.length>0" :data-source="source_list2"/>
		<div v-if="level==4" class="g-tr g-pd-10" style="margin-bottom: -20px;">
			<span class="_split-bar"/>
			<!-- <span v-if="0" class="g-operation-hover" @click="handleChangeTitle">选择表头</span> -->
		</div>
		<vc-paging
			v-if="level==4"
			:columns="columnsShow"
			:type="0"
			:data-source="listInfo[1].data"
			:total="listInfo[1].total"
			:reset="listInfo[1].reset"
			:current.sync="current[1]"
			:table-opts="{height: tableHeight,}"
			:history="true"
			:load-data="loadData"
			:show="true"
			class="v-sale-customer-business-list g-m-t-20"
			mode="table"
			@page-size-change="handleChangePageSize"
		/>
		<i-tabs
			v-else
			:value="type"
			:animated="false"
			type="card"
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<!-- <span  slot="extra" class="g-fs-14 g-operation-hover" @click="handleChangeTitle"> -->
			<!-- <span class="_split-bar"/>选择表头</span> -->
			<i-tab-pane
				v-for="(item) in tabs"
				:key="item.value"
				:label="item.label"
				:name="item.value"
			>
				<vc-paging
					:columns="columnsShow"
					:show="item.value == type"
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:table-opts="{height: tableHeight,}"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					class="v-sale-customer-business-list"
					mode="table"
					@page-size-change="handleChangePageSize"
				/>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane, Message } from 'iview';
import { Paging } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { TableTitle } from '@components/_common/table-title/table-title';
import { tableHeight } from '@extends/mixins/tableHeight';
import record from './record';
import { getLevel } from '../_common/util';
// item
import item from './item';

export const errorMsg = debounce(function (msg) {
	Message.error(msg);
}, 500);

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'oa-record': record,
	},
	mixins: [item, tableHeight({ extra: 140 })],
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '经理', value: '1' },
				{ label: '员工', value: '2' }
			],
			summary: {},
		};
	},
	computed: {
		listInfo() {
			this.loadDataSummary();
			return this.$store.state.saleCustomerBusiness.listInfo;
		},
		level() {
			return getLevel();
		},
		columnsShow() {
			let columnsShow = this.$store.state.saleCustomerBusiness.title[this.$route.query.type || '1'].title_show.map(cloShow => {
				const result = this.columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key：" + cloShow.key);
				return result;
			}).filter(Boolean);
			columnsShow.push(
				{
					title: '操作',
					key: 'link',
					minWidth: 120,
					fixed: 'right',
					render: (h, params) => {
						return (
							<div>{
								this.$auth[966] ? <div onClick={() => { this.handleCheck(params); }} class="g-operation">查看</div> : ' '
							}
							</div>
						);
					}
				}
			);
			return columnsShow;
		},
		source_list1() {
			let summary = [ // 员工看自己
				{ label: '加微信客户', value: this.summary.wechat || 0, key: "wechat" },
				{ label: '维护客户', value: this.summary.maintenance || 0, key: "maintenance" },
				{ label: '维护出来客户', value: this.summary.maintenanced || 0, key: "maintenanced" },
				{ label: '约见客户', value: this.summary.appoint || 0, key: "appoint" },
				{ label: '绕前台', value: this.summary.proscenium || 0, key: "proscenium" },
				{ label: '业绩金额数据(元)', value: this.summary.achievement || 0, key: "achievement" }
			];
			const source_list = [];
			 summary.map(it => {
				const element = this.columnsShow.find(ele => {
					return ele.key == it.key;
				});
				if (element) source_list.push(it);
				return;
			});
			return source_list;

		},
		source_list2() {
			let summary = [ // 员工看自己
				{ label: '过客户', value: this.summary.adoptive || 0, key: "adoptive" },
				{ label: '过出来客户', value: this.summary.adoptived || 0, key: "adoptived" },
				{ label: '谈判客户', value: this.summary.negotiation || 0, key: "negotiation" },
				{ label: '跟进客户', value: this.summary.follow_up || 0, key: "follow_up" },
				{ label: '成交客户', value: this.summary.deal || 0, key: "deal" }
			];
			const source_list = [];
			 summary.map(it => {
				const element = this.columnsShow.find(ele => {
					return ele.key == it.key;
				});
				if (element) source_list.push(it);
				return;
			});
			return source_list;
		}
	},
	created() {
		this.loadTableTitle();
		// this.loadDataSummary();
	},
	methods: {
		loadDataSummary() {
			const { query } = this.$route;
			this.$request({
				url: 'SALE_CUSTOMER_BUSINESS_DATA_SUMMARY_GET',
				type: "get",
				param: {
					...query,
					table_type: this.level == 4 ? '2' : this.type ? this.type : 1,
				},
				loading: false,
			}).then(res => {
				this.summary = res.data;
			}).catch(err => {
				errorMsg(err.msg);
				console.error(err, 'err');
			});
		},
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_CUSTOMER_BUSINESS_LIST_GET',
				type: 'GET',
				param: {
					...query,
					table_type: this.level == 4 ? '2' : this.type,
					type: this.type,
					page,
					pageSize
				},
				loading: false,
			}).then((res) => {
			}).catch((error) => {
				errorMsg(error.msg);
				console.error(error);
			});
		},
		handleChange(type) {
			this.type = type;
			this.loadTableTitle();
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/sale/customer/business', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_CUSTOMER_BUSINESS_LIST_INIT');
		},
		handleChangeTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.saleCustomerBusiness.title[this.$route.query.type || '1'];
			TableTitle.popup({
				dataShow: dataShow || [],
				dataHide: dataHide || [],
				saveUrl: '_SALE_BUSINESS_DATA_SAVE_TABLE_CONFIG_POST',
				mutation: 'SALE_CUSTOMER_BUSINESS_TITLE_CHANGE',
				type: this.$route.query.type || '1',
				params: {
					table_type: this.$route.query.type ? this.$route.query.type : this.level == 4 ? '2' : this.type,
				}
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$store.commit("SALE_CUSTOMER_BUSINESS_LIST_RESET", {
					type: this.$route.query.type || '1'
				});
			}).catch(() => {});
		},
		loadTableTitle() {
			this.$request({
				url: "_SALE_BUSINESS_DATA_TABLE_CONFIG_GET",
				type: "GET",
				param: {
					table_type: this.level == 4 ? '' : this.type
				},
				loading: false,
			}).then(res => {
				this.$store.commit('SALE_CUSTOMER_BUSINESS_TITLE_CHANGE', { ...res.data, type: this.type || '1' });
			}).catch((res) => {
				errorMsg(res.msg);
			});
		},
	}
};

</script>

<style scoped lang="scss">
	._split-bar {
		position: relative;
		display: inline-block;
		margin: 0 10px;
		width: 1px;
		height: 12px;
		background: rgba(232, 232, 232, 1);
		top: 2px;
	}

</style>
