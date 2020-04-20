<template>
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
				:columns="getColumns"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight}"
				class="v-sc-reply-answer-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import { tableHeight } from '@extends/mixins/table';
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
		})
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: "待回复0", value: "1" }, 
				{ label: "已回复0", value: "2" }, 
				{ label: "解决中0", value: "3" },
				{ label: "已解决0", value: "4" },
				{ label: "已忽略0", value: "5" }
			],
			firstLoad: !query.type,
			count: [0, 0, 0, 0, 0, 0]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.scReplyAnswer.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SC_REPLY_ANSWER_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize,
					is_apply: 1
				},
			}).then((res) => {
				this.count = [+res.data.wait_count, +res.data.has_count,
					+res.data.solving_count, +res.data.solved_count,
					+res.data.ignore_count];

				if (this.firstLoad) {
					if (this.count.findIndex(num => num) != -1) {
						this.type = this.count.findIndex(num => num) + 1 + "";
					}

					this.firstLoad = false;
				}

				this.tabs = [
					{ label: "待回复" + (res.data.wait_count ? res.data.wait_count : 0), value: "1" },
					{ label: "已回复" + (res.data.has_count ? res.data.has_count : 0), value: "2" },
					{ label: "解决中" + (res.data.solving_count ? res.data.solving_count : 0), value: "3" },
					{ label: "已解决" + (res.data.solved_count ? res.data.solved_count : 0), value: "4" },
					{ label: "已忽略" + (res.data.ignore_count ? res.data.ignore_count : 0), value: "5" }
				];
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

			this.$router.replace(getHashUrl('/sc/reply/answer', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SC_REPLY_ANSWER_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
</style>
