<template>
	<div class="sale-train-course-schedule">
		<div class="g-tr g-m-b-10">
			<vc-debounce-click
				v-if="$auth[498]"
				class="g-red-btn-line"
				@click="handleProvide"
			>
				查看报名情况
			</vc-debounce-click>
		</div>
		<i-tab
			v-model="type"
			:value="type"
			:animated="false"
			type="card"
			@on-click="handleChange">
			<i-tab-pane v-if="$auth[499]" label="公司课程" class="g-flex" name="1">
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
			<i-tab-pane v-if="$auth[500]" label="事业部课程" name="2">
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
import { getParseUrl, getHashUrl, getItem } from "@utils/utils";
import moment from 'moment';
import { isArray } from 'util';
import API_ROOT from '@stores/apis/root';
import MainCalendar from './main-calendar';
import Note from './note';

export default {
	name: 'hr-academy-train-schedule',
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
			calendarData: {},
			noteData: {
				item: [],
			},
			showNote: false,
			currentData: {},
			auditCount: 0
		};
	},
	computed: {

	},
	created() {
		this.initData();
		this.loadAuditData();
		this.$vc.on('SALE_APPLY_COURSE', (res) => {
			this.initData(res.date);
			this.loadAuditData();
		});
	},
	beforeDestroy() {
		this.$vc.off('SALE_APPLY_COURSE');
	},
	methods: {
		loadAuditData() {
			this.$request({
				url: API_ROOT.SALE_TRAIN_COURSE_DETAIL_LIST_GET,
				type: 'GET',
				param: {
					type: 1,
				},
			}).then((res) => {
				this.auditCount = res.data.check_count;
			}).catch((error) => {
				console.error(error);
			});
		},
		async initData(res) {
			await this.loadData(moment(res).format('YYYY-MM'));
			let obj = {
				data: {
					date: res || moment(new Date()).format('YYYY-MM-DD')
				}
			};
			await this.handleSelcet(obj);
		},
		// change tab
		async handleChange(name) {
			await this.loadData();
			let obj = {
				data: {
					date: moment(new Date()).format('YYYY-MM-DD')
				}
			};
			await this.handleSelcet(obj);
			let { query = {} } = getParseUrl();
			this.$router.replace(getHashUrl(
				'/sale/train/course',
				{
					...query,
					type: this.type,
				}
			));
		},
		handleProvide() {
			this.$router.push('/sale/train/course/detail');
		},
		async loadData(month) {
			let curMonth = moment(new Date()).format('YYYY-MM');
			return this.$request({
				url: '_SALE_TRAIN_COURSE_SCHEDULE_GET',
				type: "GET",
				param: {
					type: this.type,
					month: month || curMonth,
					scenario: 2,
				},
				loading: false
			}).then((res) => {
				this.calendarData = res.data;
			}).catch((error) => {
			});
		},
		// click day
		async handleSelcet(data) {
			return new Promise(resolve => {
				this.currentData = this.calendarData[data.data.date];
				let course_id = this.calendarData[data.data.date] ? this.calendarData[data.data.date].map(v => v.course_id) : [];
				let object = {
					type: this.type,
					day: data.data.date,
					course_ids: course_id
				};
				this.noteData.item = isArray(this.currentData) ? this.currentData.map(v => {
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
			});
		},
		// 刷新
		async handleEmpty() {
			await this.loadData();
			await this.handleSelcet(this.currentData);
		},
	},
};
</script>

<style lang="scss" scoped>
.sale-train-course-schedule {
	._select {
		display: block;
		height: 40px;
	}
}
</style>
