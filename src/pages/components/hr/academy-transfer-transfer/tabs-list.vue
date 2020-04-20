<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		class="v-hr-academy-transfer-transfer"
		@on-click="handleChange"
	>
		<div
			slot="extra"
			style="line-height: 33px">
			<span class="_divider g-m-r-10">
				<span class="g-m-l-15 g-fs-14 g-pointer" @click="handleSelectTitle">选择表头</span>
			</span>
		</div>
		<i-tab-pane
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="item.label + listInfo.count[index]"
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="columns[item.value]"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight}"
				class="v-hr-academy-transfer-transfer-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { tableHeight } from '@extends/mixins/table';
import { autoFix } from '@extends/mixins/auto-fix';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { TableTitle } from '../../_common/table-title/table-title';
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
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '岗前培训', value: '1' },
				{ label: '待培训', value: '2' },
				{ label: '培训中', value: '3' },
				{ label: '培训完成', value: '4' },
				{ label: '培训未达标', value: '5' },
				{ label: '培训淘汰', value: '6' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyTransferTransfer.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_TRANSFER_TRANSFER_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/hr/academy/transfer/transfer');
			}).catch((error) => {
			});
		},
		// 加载表头
		loadTableTitle(type) {
			return this.$request({
				url: "_HR_RECRUIT_CONFIG_GET",
				type: "GET",
				param: {
					type: type || '1',
					scenario: 7
				},
				loading: false,
			}).then(res => {
				this.$store.commit('HR_ACADEMY_TRANSFER_TRANSFER_TITLE_CHANGE', { ...res.data, type: type || '0' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrAcademyTransferTransfer.title[this.$route.query.type || '1'];
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_RECRUIT_CONFIG_SAVE_POST',
				mutation: 'HR_ACADEMY_TRANSFER_TRANSFER_TITLE_CHANGE',
				type: this.$route.query.type || '1',
				scenario: 7
			}).then(() => {
				this.$vc.emit('hr-academy-transfer-transfer-title-change', { type: this.$route.query.type || '1' });
				this.$store.commit("HR_ACADEMY_TRANSFER_TRANSFER_LIST_INIT", {
					type: this.$route.query.type || '1'
				});
			}).catch(err => {
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				fixPosition: false,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/academy/transfer/transfer', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_ACADEMY_TRANSFER_TRANSFER_LIST_INIT');
		},
	}
};

</script>

<style lang="scss" scoped>
.v-hr-academy-transfer-transfer {
	._divider:hover {
		color: #2397F9;
	}
	._divider::before {
		content: '';
		display: inline-block;
		width: 1px;
		height: 12px;
		position: absolute;
		top: 11px;
		background: #E8E8E8;
	}
}
</style>
