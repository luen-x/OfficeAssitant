<template>
	<div class="collage-main-schedule">
		<div class="_select g-m-b-10">
			<i-select
				v-model="lecture_id"
				style="width: 220px"
				clearable
				transfer
				filterable
				multiple
				placeholder="请选择讲师"
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item, index) in tearchArray"
					:key="index"
					:value="item.staff_id"
				>
					{{ item.staff_name }}
				</i-option>
			</i-select>
			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
		<div class="g-flex">
			<oa-main-calendar
				:on-refresh="loadData"
				:datas="calendarData"
				@select="handleSelcet"
			/>
			<oa-note
				:type="type"
				:datas="noteData"
				:load-data="loadData"
				@empty="handleEmpty"
			/>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Tabs, TabPane, Cascader, Button, Select, Option } from 'iview';
import { services } from "@stores/services/hr";
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl, getItem } from "@utils/utils";
import { isArray } from 'util';
import MainCalendar from './lecturer-detail';
import Note from './note';


export default {
	name: 'hr-academy-train-schedule',
	components: {
		'i-tab': Tabs,
		'i-tab-pane': TabPane,
		'oa-main-calendar': MainCalendar,
		'oa-note': Note,
		"i-cascader": Cascader,
		"i-select": Select,
		"i-button": Button,
		'i-option': Option
	},
	mixins: [services.departAll()],
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "1"),
			depart_id: query.depart_id ? query.depart_id.split(",").map(item => Number(item)) : [],
			lecture_id: query.lecture_id ? query.lecture_id.split(",").map(item => Number(item)) : [],
			calendarData: {},
			noteData: {
				item: [],
			},
			showNote: false,
			currentData: {},
			auditCount: 0,
			tearchArray: [],
			departArray: []
		};
	},
	created() {
		this.initData();
		// this.loadArrayData();
		this.loadTeacherData();
	},
	methods: {
		async loadArrayData() {
			await this.loadDepartData();
			await this.loadTeacherData();
		},
		async loadDepartData() {
			return this.$request({
				url: '_COLLAGE_MAIN_SCHEDULE_DEPARTS_GET',
				type: "GET",
				param: {
					type: this.type
				},
				loading: false
			}).then((res) => {
				this.departArray = res.data;
			}).catch((error) => {
			});
		},
		async loadTeacherData() {
			return this.$request({
				url: '_COLLAGE_MAIN_SCHEDULE_TEACHER_GET',
				type: "GET",
				param: {
					type: 2,
				},
				loading: false
			}).then((res) => {
				this.tearchArray = res.data;
			}).catch((error) => {
			});
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/sale/full/lecturer',
				{
					type: this.type,
					lecture_id: this.lecture_id
				}
			));
			this.initData();
		}, 300),
		async initData() {
			await this.loadData();
			let obj = {
				data: {
					date: moment(new Date()).format('YYYY-MM-DD')
				}
			};
			await this.handleSelcet(obj);
		},
		async loadData(month) {
			let curMonth = moment(new Date()).format('YYYY-MM');
			return this.$request({
				url: '_COLLAGE_MAIN_SCHEDULE_OFFLINE_GET',
				type: "GET",
				param: {
					type: this.type,
					month: month || curMonth,
					depart_id: this.depart_id.toString()
				},
				loading: false
			}).then((res) => {
				this.calendarData = res.data;
			}).catch((error) => {
			});
		},
		// 选择战区
		handleChangeDepart() {
			this.lecture_id = [];
			this.loadTeacherData();
			this.handleSearch();
		},
		// click day
		async handleSelcet(data) {
			this.currentData = data;
			let object = {
				type: this.type,
				day: data.data.date,
				// depart_id: this.type == '2' ? this.depart_id.toString() : '',
			};
			return this.$request({
				url: '_COLLAGE_MAIN_SCHEDULE_OFFLINE_DAY_GET',
				type: "POST",
				param: {
					date: data.data.date
				},
				loading: false
			}).then((res) => {
				this.noteData.item = res.data;
				this.noteData.obj = object;
				this.noteData.day = data;
				this.showNote = true;
			}).catch((error) => {
			});
		},
		// 清空当天活动
		async handleEmpty(e) {
			await this.loadData();
			await this.handleSelcet(this.currentData);
			this.lecture_id.push(e.staff_id);
			await this.handleSearch();
		},
	},
};
</script>

<style lang="scss" scoped>
.collage-main-schedule {
	padding:10px 20px;
	._select {
		display: block;
	}
}
</style>
