<template>
	<div class="v-sale-service-list">
		<i-tabs 
			:value="type" 
			:animated="false"
			type="card" 
			class="g-m-t-20"
			@on-click="handleChange"
		>
			<!-- <div slot="extra">
				<span class="g-c-black4">如何做服务？</span>
				<span class="g-operation" @click="handleWatchVideo">视频教程</span>
			</div> -->
			<i-tab-pane 
				v-for="(item, index) in tabs"
				:key="item.value"
				:label="item.label + listInfo.count[index]" 
				:name="item.value"
			>
				<div v-if="loading" class="g-flex g-jc-c g-ai-fs">
					<i-spin size="large" />
				</div>
				<div
					v-if="!loading && !listInfo[item.value].total"
					class="g-tc"
					style="margin-top:60px;"
				>
					<div>
						<img :src="OSS_SEARCH_EMPTY" >
						<div class="g-tc">暂无数据</div>
					</div>
				</div>
				<vc-paging
					:ref="'table' + item.value"
					:show="item.value == type" 
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="+listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					class="_list g-flex g-fw-w g-jc-sb g-m-t-b-20"
					mode="piece"
					@page-size-change="handleChangePageSize"
				>
					<oa-item 
						slot-scope="it"
						:id="item.value"
						v-bind="it"
						:type="item.value"
						class="__item g-m-b-10 g-pd-20"
						@reload="reload"
					/>
				</vc-paging>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane, Button, Spin } from "iview";
import { Paging } from "wya-vc";
import { VideoModal } from '@components/_common/video-modal/video-modal';
import { getParseUrl, getHashUrl } from "@utils/utils";
import { autoFix } from '@extends/mixins/auto-fix';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
// item
import Item from "./item";

export default {
	name: "oa-service-list",
	components: {
		"vc-paging": Paging,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"oa-item": Item,
		"i-button": Button,
		'i-spin': Spin
	},
	mixins: [
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			loading: false,
			type: String(query.type || "1"), // 同tabs下的value
			current: {}, // 用于存放当前tab的类型
			OSS_SEARCH_EMPTY,
			contract_company_id: '',
			tabs: [
				{ label: "服务中", value: "1" },
				{ label: "已到期", value: "2" },
				{ label: "已失效", value: "3" },
				{ label: "全部", value: "4" }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleServiceCustomer.listInfo;
		}
	},
	mounted() {
		this.$vc.on('query-change', () => {
			this.type = '4';
			this.$store.commit('SALE_SERVICE_CUSTOMER_LIST_INIT');
		});
	},
	beforeDestroy() {
		this.$vc.off('query-change');
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData(page, pageSize) {
			this.loading = true;

			let { query = {} } = getParseUrl();

			return this.request({
				url: "SALE_SERVICE_CUSTOMER_LIST_GET",
				type: "GET",
				param: {
					customer_owner: this.$auth[504] ? 0 : 1,
					...query,
					type: this.type,
					sign_star: 0,
					page,
					pageSize
				},
				autoTip: false
			}).then(res => {
				this.loading = false;
				this.resetType('1', this.listInfo.count, '/sale/service/customer');
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 切换tab
		 */
		handleChange(type) {
			this.loading = true;
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl("/sale/service/customer", { ...query }));

			if (this.listInfo[type].total) {
				this.loading = false;
			} else {
				setTimeout(() => {
					this.loading = false;
				}, 3000);
			}
		},
		/**
		 * 更新每页显示的条数
		 */
		handleChangePageSize() {
			this.$store.commit("SALE_SERVICE_CUSTOMER_LIST_INIT");
		},
		/**
		 * 重载
		 */
		reload() {
			this.$store.commit("SALE_SERVICE_CUSTOMER_LIST_RESET", { type: this.type });
		},
		/**
		 * 做服务视频教程
		 */
		handleWatchVideo() {
			VideoModal.popup({
				title: '做服务',
				urlType: 'SC_SERVICE_DO_VIDEO'
			}).catch(error => {
				error && console.error(error);
			});
		},
	}
};
</script>

<style lang="scss">
.v-sale-service-list {
	._list {
		.__item {
			border: 1px solid #ebeef1;
			width: calc(100%);
			border-radius: 5px;
		}
	}
}
</style>
