<template>
	<div class="v-academy-main">
		<div class="g-tr g-m-b-10" style="z-index: 0;">
			<vc-debounce-click
				v-if="$auth[1555]"
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
			@on-click="handleChange"
		>
			<i-tab-pane v-if="$auth[1553]" label="公司课程" class="g-flex" name="1">
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

			<i-tab-pane v-if="$auth[1554]" label="事业部课程" name="2">
				<i-select
					v-model="depart_id"
					style="width: 220px"
					class="g-m-b-20"
					transfer
					placeholder="请选择事业部"
					@on-change="handleChangeDepart"
				>
					<i-option
						v-for="(option, index) in departList"
						:value="option.depart_id"
						:key="index">{{ option.depart_name }}</i-option>
				</i-select>
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
import { Tabs, TabPane, Cascader, Select, Option } from 'iview';
import { services } from "@stores/services/hr";
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl, getItem } from "@utils/utils";
import { isArray } from 'util';
import MainCalendar from './main-calendar';
import Note from './note';


export default {
	name: 'v-academy-main',
	components: {
		'i-tab': Tabs,
		'i-tab-pane': TabPane,
		'oa-main-calendar': MainCalendar,
		'oa-note': Note,
		"i-cascader": Cascader,
		'i-select': Select,
		'i-option': Option
	},
	mixins: [services.departAll()],
	data() {
		const depart = getItem("firstDepartId_" + _global.version, 'localStorage');
		const { query } = this.$route;
		return {
			type: String(query.type || "1"),
			calendarData: {},
			noteData: {
				item: [],
			},
			timeData: {
				data: {
					date: query.date || moment().format('YYYY-MM-DD')
				}
			},
			currentData: {},
			departList: [],
			depart_id: Number(query.depart_id) || depart ? depart.res.data.sale : 1,
		};
	},
	computed: {
		departDefalut() {
			return getItem("firstDepartId_" + _global.version, 'localStorage');
		}
	},
	created() {
		this.initData();
		this.loadDepartData();
	},
	methods: {
		handleChangeDepart(e) {
			this.initData();
		},
		loadDepartData() {
			this.$request({
				url: "_HR_DEPART_ALL_GET",
				type: "GET",
				param: {},
				loading: false
			}).then(res => {
				this.departList = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		async initData() {
			await this.loadData(moment(this.$route.query.date).format('YYYY-MM'));
			this.handleSelcet(this.timeData);
		},
		// change tab
		async handleChange(name) {
			await this.loadData(moment(this.$route.query.date).format('YYYY-MM'));
			await this.handleSelcet(this.timeData);
			name == '2' ? this.depart_id = this.departDefalut.res.data.sale : '';
			let { query = {} } = getParseUrl();
			this.$router.replace(getHashUrl(
				'/academy/main',
				{
					...this.$route.query,
					type: this.type,
				}
			));
		},
		handleProvide() {
			this.$router.push('/academy/main/enroll');
		},
		loadData(month) {
			let curMonth = moment().format('YYYY-MM');
			let param = {
				type: this.type,
				month: month || curMonth,
				scenario: 1
			};
			this.type == '2' ? param.depart_id = this.depart_id : '';
			return this.$request({
				url: '_ACADEMY_MAIN_SCHEDULE_GET',
				type: "GET",
				param,
				loading: false
			}).then((res) => {
				this.calendarData = res.data;
			}).catch((error) => {
				console.error(error);
			});
		},
		// click day
		handleSelcet(data) {
			this.timeData.data.date = data.data.date;
			this.$router.replace(getHashUrl(
				'/academy/main', 
				{ 
					...this.$route.query,
					date: data.data.date,
					type: this.type,
					depart_id: this.depart_id
				}
			));
			this.currentData = this.calendarData[data.data.date];
			let course_id = this.calendarData[data.data.date] ? this.calendarData[data.data.date].map(v => v.course_id) : [];
			let object = {
				type: this.type,
				day: data.data.date,
				course_ids: course_id
			};
			this.noteData.item = isArray(this.currentData) ? this.currentData.map(v => ({ ...v, expend: true })) : [];
			this.noteData.obj = object;
			this.noteData.day = data;
		},
		// 清空当天活动
		async handleEmpty(res) {
			await this.loadData(moment(this.$route.query.date).format('YYYY-MM'));
			this.handleSelcet(res);
		},
	},
};
</script>

<style lang="scss" scoped>
.v-academy-main {
	._select {
		display: block;
		height: 40px;
	}
}
</style>
