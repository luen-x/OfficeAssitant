<template>
	<div class="v-hr-academy-transfer-statistic-teacher">
		<div class="_statistic g-flex">
			<div
				v-for="(item, index) in staticList"
				:key="item.key"
				:class="index !== staticList.length - 1 ? '_line' : ''"
				class="_item g-flex g-ai-c g-jc-c">
				<div class="g-tc">
					<div class="g-m-b-15" style="color: #818794">{{ item.key }}</div>
					<div class="g-fs-24 g-c-black2">{{ item.value }}</div>
				</div>
			</div>
		</div>
		<vc-paging
			ref="tableTarget"
			:columns="getColumns('teacher')"
			:data-source="listInfo.data"
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			:table-opts="{height: tableHeight}"
			class="v-academy-transfer-statistics-teacher-list g-m-t-20"
			mode="table"
			@page-size-change="handleChangePageSize"
		/>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { Button, Checkbox } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import moment from 'moment';
import { tableHeight } from '@extends/mixins/tableHeight';
import item from '../item';

export default {
	name: 'oa-table',
	components: {
		'i-button': Button,
		'i-checkbox': Checkbox,
		'vc-paging': Paging
	},
	mixins: [
		item,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true,
			extraHeight: 190
		})
	],
	data() {
		const { query } = this.$route;
		return {
			staticList: [
				{ key: '培训场次', value: 0 },
				{ key: '培训人数', value: 0 },
				{ key: '试岗流失人数', value: 0 },
				{ key: '试岗pass人数', value: 0 },
				{ key: '入职人数', value: 0 },
				{ key: '入职15天流失人数', value: 0 },
				{ key: '试岗入职率', value: 0 },
				{ key: '试岗流失率', value: 0 },
				{ key: '试岗pass率', value: 0 },
				{ key: '入职15天流失率', value: 0 }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academyTransferStatistics.teachList;
		}
	},
	mounted() {
		let { query = {} } = getParseUrl();
		let page = query.page ? query.page : 1;
		let pageSize = query.pageSize ? query.pageSize : 10;
		this.loadData(page, pageSize);
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			
			return this.request({
				url: 'ACADEMY_TRANSFER_STATISTICS_TEACHERS_LIST_GET',
				type: 'GET',
				param: {
					staff_id: query.staff_id ? query.staff_id : '',
					lecture_start_time: query.lecture_start_time ? query.lecture_start_time : '',
					lecture_end_time: query.lecture_end_time ? query.lecture_end_time : '',
					page,
					pageSize
				},
				loading: false
			}).then((res) => {
				let list = [
					res.data.course_count, res.data.train_count,
					res.data.try_pass_count, res.data.try_by_pass_count,
					res.data.entry_and_leave_count, res.data.leave_by_fifteen_day_count,
					res.data.try_entry_percent, res.data.try_lose_percent,
					res.data.try_pass_lose_percent, res.data.entry_fifteen_day_lose_percent
				];
				this.staticList.forEach((value, index) => {
					this.staticList[index].value = list[index];
				});
			}).catch((error) => {
			});
		},
		handleChangePageSize() {
			this.$store.commit('ACADEMY_TRANSFER_STATISTICS_LIST_INIT');
		}
	}
};
</script>

<style lang="scss" scoped>
.v-hr-academy-transfer-statistic-teacher {
	._statistic {
		width: 100%;
		height: 114px;
		padding-top: 20px;
		padding-bottom: 20px;
		background: #F5F5F6;
		._item {
			flex: 1;
			height: 100%;
		}
		._line {
			border-right: 1px solid #D4D7DB;
		}
	}
}
</style>