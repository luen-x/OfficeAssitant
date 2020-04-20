<template>
	<div>
		<div v-if="1498" class="g-flex g-fd-rr">
			<vc-debounce-click
				:tag="Button"
				type="primary"
				style="height:32px"
				@click="handleClear"
			>
				清除通知缓存
			</vc-debounce-click>
		</div>
		<vc-paging
			ref="tableTarget"
			:columns="columns"
			:data-source="listInfo.data"
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			mode="table"
			class="g-m-t-20 v-content-notice-wechat-list"
			@page-size-change="handleChangePageSize"
		/>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { Button } from 'iview';
import { debounce } from 'lodash';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
	},
	mixins: [item],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentNoticeWechat.listInfo;
		}
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();

			return this.request({
				url: 'CONTENT_NOTICE_WECHAT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
			});
		},
		handleClear: debounce(function (event) {
			this.$request({
				url: "_CONTENT_NOTICE_WECHAT_DELETE_CACHE_POST",
				type: "POST",
				param: {},
			}).then(res => {
				this.$Message.success(res.msg);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}, 300),

		handleChangePageSize() {
			this.$store.commit('CONTENT_NOTICE_WECHAT_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
</style>