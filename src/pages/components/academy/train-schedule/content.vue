<template>
	<div class="academy-train-schedule">
		<div class="g-tr g-m-b-10">
			<vc-debounce-click
				v-if="$auth[956]"
				class="g-red-btn-line" 
				@click="handleProvide"
			>
				报名查看
			</vc-debounce-click>
		</div>
		<i-tab
			v-model="type"
			:value="type"
			:animated="false"
			type="card"
			@on-click="handleChange">

			<i-tab-pane v-if="$auth[963]" label="公司课程" class="g-flex" name="1">
				<oa-main-calendar 
					v-if="type == '1'" 
					:on-refresh="loadData" 
					:datas="calendarData"
					@select="handleSelcet"
				/>
				<oa-note 
					v-if="type == '1'" 
					:datas="noteData"
					@empty="handleEmpty"
				/>
			</i-tab-pane>

			<i-tab-pane v-if="$auth[967]" label="战区课程" name="2">
				<div class="_select g-m-b-10"> 
					<i-cascader
						:data="departAllOfSale"
						v-model="depart_id"
						:change-on-select="true"
						:clearable="false"
						placeholder="请选择部门"
						trigger="click"
						transfer
						style="width: 220px"
						class="g-m-r-5"
						@on-change="handleChangeDepart"
					/>
				</div>
				<div class="g-flex">
					<oa-main-calendar 
						v-if="type == '2'"
						:on-refresh="loadData" 
						:datas="calendarData"
						@select="handleSelcet"
					/>
					<oa-note 
						v-if="type == '2'" 
						:datas="noteData"
						:load-data="loadData"
						@empty="handleEmpty"
					/>
				</div>
			</i-tab-pane>
		</i-tab>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Tabs, TabPane, Cascader } from 'iview';
import { services } from "@stores/services/hr";
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl, getItem } from "@utils/utils";
import { isArray } from 'util';
import MainCalendar from './main-calendar';
import Note from './note';


export default {
	name: 'academy-train-schedule',
	components: {
		'i-tab': Tabs,
		'i-tab-pane': TabPane,
		'oa-main-calendar': MainCalendar,
		'oa-note': Note,
		"i-cascader": Cascader,
	},
	mixins: [services.departAll()],
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "1"),
			depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : [21],
			calendarData: {},
			noteData: {
				item: [],
			},
			showNote: false,
			currentData: {},
		};
	},
	computed: {
		departAllOfSale() {
			if (this.departAll == undefined || !this.departAll.length || !this.departAll[0].label) return [];
			const departTree = this.departAll.filter(v => v.label.includes('营销'))[0].children;
			const departA = departTree.map(item => ({
				...item,
				children: ''
			}));
			return departA;
		}
	},
	created() {
		this.initData();
	},
	methods: {
		async initData() {
			await this.loadData();
			let obj = {
				data: {
					date: moment(new Date()).format('YYYY-MM-DD')
				}
			};
			await this.handleSelcet(obj);
		},
		// change tab
		async handleChange(name) {
			if (name == '1') {
				this.depart_id = [];
			} else {
				this.depart_id = [21];
			}
			await this.loadData();
			let obj = {
				data: {
					date: moment(new Date()).format('YYYY-MM-DD')
				}
			};
			await this.handleSelcet(obj);
			let { query = {} } = getParseUrl();
			this.$router.replace(getHashUrl(
				'/academy/train/schedule',
				{
					...query,
					type: this.type,
					depart_id: this.depart_id
				}
			));
		},
		handleProvide() {
			this.$router.push('/academy/train/schedule/detail');
		},
		async loadData(month) {
			let curMonth = moment(new Date()).format('YYYY-MM');
			return this.$request({
				url: '_HR_TRAIN_SCHEDULE_GET',
				type: "GET",
				param: {
					type: this.type,
					month: month || curMonth,
					depart_id: this.type == '2' ? this.depart_id.toString() : ''
				},
				loading: false
			}).then((res) => {
				this.calendarData = res.data;
			}).catch((error) => {
				this.calendarData = {
					"2019-10-17": [
						{
							"course_id": 173,
							"course_name": "课程一",
							"start_time": "2019-10-17",
							"end_time": "2019-10-17",
							"lecture": [
								{
									"course_id": 173,
									"staff_id": 882,
									"staff_name": "张方园"
								}
							],
							"is_open_online_apply": 0
						}
					],
					"2019-10-18": [
						{
							"course_id": 174,
							"course_name": "新建课程五三一一",
							"start_time": "2019-10-18",
							"end_time": "2019-10-18",
							"lecture": [
								{
									"course_id": 174,
									"staff_id": 862,
									"staff_name": "呆呆一"
								}
							],
							"is_open_online_apply": 1
						},
						{
							"course_id": 175,
							"course_name": "测试素材库的课程",
							"start_time": "2019-10-18",
							"end_time": "2019-10-18",
							"lecture": [
								{
									"course_id": 175,
									"staff_id": 1192,
									"staff_name": "航三四部"
								}
							],
							"is_open_online_apply": 0
						},
						{
							"course_id": 177,
							"course_name": "新增课程库课程1",
							"start_time": "2019-10-18",
							"end_time": "2019-10-18",
							"lecture": [
								{
									"course_id": 177,
									"staff_id": 939,
									"staff_name": "张琪"
								}
							],
							"is_open_online_apply": 0
						}
					],
					"2019-10-24": [
						{
							"course_id": 181,
							"course_name": "新建课程五三一一",
							"start_time": "2019-10-24",
							"end_time": "2019-10-24",
							"lecture": [
								{
									"course_id": 181,
									"staff_id": 862,
									"staff_name": "呆呆一"
								}
							],
							"is_open_online_apply": 0
						}
					],
					"2019-10-25": [
						{
							"course_id": 182,
							"course_name": "崔云鹏测试培训",
							"start_time": "2019-10-25",
							"end_time": "2019-10-25",
							"lecture": [
								{
									"course_id": 182,
									"staff_id": 1186,
									"staff_name": "崔杭四一部经理"
								}
							],
							"is_open_online_apply": 1
						}
					],
					"2019-10-26": [
						{
							"course_id": 183,
							"course_name": "崔云鹏新建必修课",
							"start_time": "2019-10-26",
							"end_time": "2019-10-26",
							"lecture": [
								{
									"course_id": 183,
									"staff_id": 1183,
									"staff_name": "崔杭四总监"
								}
							],
							"is_open_online_apply": 1
						},
						{
							"course_id": 185,
							"course_name": "测试素材库的课程",
							"start_time": "2019-10-26",
							"end_time": "2019-10-26",
							"lecture": [
								{
									"course_id": 185,
									"staff_id": 1192,
									"staff_name": "航三四部"
								}
							],
							"is_open_online_apply": 0
						}
					],
				};
			});
		},
		// 选择战区
		handleChangeDepart(value, selected) {
			if (!selected.length) {
				this.depart_id = [];
				this.initData();
				return;
			}
			this.depart_id = [value[value.length - 1]];
			this.$router.replace(getHashUrl(
				'/academy/train/schedule',
				{
					type: this.type,
					depart_id: this.depart_id
				}
			));
			this.initData();
		},
		// click day
		async handleSelcet(data) {
			this.currentData = data;
			let course_id = this.calendarData[data.data.date] ? this.calendarData[data.data.date].map(v => v.course_id) : [];
			let object = {
				type: this.type,
				day: data.data.date,
				depart_id: this.type == '2' ? this.depart_id.toString() : '',
				course_ids: course_id
			};
			return this.$request({
				url: '_HR_TRAIN_SCHEDULE_NOTE_POST',
				type: "POST",
				param: object,
				loading: false
			}).then((res) => {
				this.noteData.item = isArray(res.data) ? res.data.map(v => {
					v.expend = true;
					const color = ['green', 'purple', 'light-blue', 'orange', 'red', 'red', 'blue'];
					const icon = ['icon-mianshou', 'icon-PK1', 
						'icon-zuotanhui', 'icon-chahuahui', 
						'icon-xianshangshipin', 'icon-xianxiashipin', 
						'icon-randompwd'];
					v.class = color[v.method - 1];
					v.icon = icon[v.method - 1];
					return v;
				}) : [];
				this.noteData.obj = object;
				this.noteData.day = data;
				this.showNote = true;
			}).catch((error) => {
			});
		},
		// 清空当天活动
		async handleEmpty() {
			await this.loadData();
			await this.handleSelcet(this.currentData);
		},
	},
};
</script>

<style lang="scss" scoped>
.academy-train-schedule {
	._select {
		display: block;
		height: 40px;
	}
}
</style>
