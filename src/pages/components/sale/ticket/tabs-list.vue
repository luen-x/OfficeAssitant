
<template >
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<!-- <div slot="extra" style="margin-top: 7px;">
			<span class="g-c-black4">开票申请的注意事项&nbsp;</span>
			<span class="g-operation" @click="handleWatchVideo">视频教程</span>
		</div> -->
		<i-tab-pane
			v-for="(item,index) in tabs"
			:key="item.value"
			:label="item.label+(count[index].status_num ? count[index].status_num:0)"
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="handlecolumns(type)"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight,highlightRow:true}"
				class="v-sale-ticket-list"
				mode="table"
				@row-click="handleEdit"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Tooltip } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
import { VideoModal } from '@components/_common/video-modal/video-modal';
import { autoFix } from '@extends/mixins/auto-fix';

// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [
		item,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true,
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			firstLoad: !query.type,
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			count: [0, 0, 0, 0],
			check_count: '',
			opening_count: '',
			opened_count: '',
			refuse_count: '',
			tabs: [
				{ label: '待审核', value: '1' },
				{ label: '待开票', value: '2' },
				{ label: '已开票', value: '3' },
				{ label: '未通过', value: '4' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleTicket.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_TICKET_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = res.data.status_list || [0, 0, 0, 0];
				const count = [];
				res.data.status_list.map(ele => {
					count.push(ele.status_num);
					return;
				});
				this.resetType('1', count, '/sale/ticket');
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(type) {
			this.type = type;
			this.firstLoad = false;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/sale/ticket', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_TICKET_LIST_INIT');
		},
		handleWatchVideo() {
			VideoModal.popup({
				title: '开票申请',
				urlType: 'SALE_TICKET_VIDEO'
			}).then((res) => {

			});
		}
	}
};

</script>

<style lang="scss" >
 ._delete::before{
	margin:0 5px;
	content: '|';
	width: 1px;
	height: 12px;
	color: rgb(34, 150, 249);
 }
</style>