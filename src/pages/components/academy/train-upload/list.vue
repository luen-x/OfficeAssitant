<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: tableHeight}"
		mode="table"
		class="g-m-t-20 v-academy-train-upload-list"
		@page-change="handlePageChange"
		@page-size-change="handleChangePageSize"
		@selection-change="handleSelectionChange"
	>
		<div v-if="$auth[1600] || $auth[1601]" slot="extra" class="g-flex-ac">
			<i-checkbox
				v-model="isAll"
				@on-change="handleIsAll"
			>
				全选
			</i-checkbox>
			<i-button v-if="$auth[1600]" @click="handleClearance(1)">
				话术通关
			</i-button>
			<i-button v-if="$auth[1601]" class="g-m-l-10" @click="handleClearance(2)">
				案例通关
			</i-button>
		</div>
	</vc-paging>
</template>

<script>
import { Button, Checkbox } from "iview";
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from "@extends/mixins/tableHeight";
import checkAll from '@extends/mixins/checkAll';
import { CaseClearance } from './popup/case-clearance';
import { TalkingClearance } from './popup/talking-clearance';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		"i-button": Button,
		"i-checkbox": Checkbox,
		'vc-paging': Paging
	},
	mixins: [
		item,
		checkAll,
		tableHeight({
			tab: false
		})
	],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academyTrainUpload.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			let depart_id = this.$route.query.depart_id 
				? (this.$route.query.depart_id + '').split(",").pop() : null;

			return this.request({
				url: 'ACADEMY_TRAIN_UPLOAD_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					depart_id
				},
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChangePageSize() {
			this.$store.commit('ACADEMY_TRAIN_UPLOAD_LIST_INIT');
		},
		handleIsAll(val) {
			this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
		},
		handleClearance(name) {
			let staffIds = [];

			if (this.selected.length === 0) {
				this.$Message.warning("请选择具体的数据再进行操作哦~");

				return;
			}

			this.selected.forEach(element => {
				staffIds.push(element.staff_id);
			});

			if (name === 1) {
				TalkingClearance.popup({
					staffIds
				}).then(res => {
					res && this.$store.commit('ACADEMY_TRAIN_UPLOAD_LIST_RESET', { type: this.type });
				});
			} else {
				CaseClearance.popup({
					staffIds
				}).then(res => {
					res && this.$store.commit('ACADEMY_TRAIN_UPLOAD_LIST_RESET', { type: this.type });
				});
			}
		}
	}
};
</script>

<style lang="scss">
</style>