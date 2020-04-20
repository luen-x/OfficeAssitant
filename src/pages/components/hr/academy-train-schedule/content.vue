<template>
	<div class="hr-academy-train-schedule">
		<div class="g-tr g-m-b-10">
			<vc-debounce-click
				v-if="$auth[956]"
				class="g-red-btn-line" 
				@click="handleProvide"
			>
				报名审核({{ auditCount }})
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
			depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : [21],
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
		this.loadAuditData();
	},
	methods: {
		loadAuditData() {
			this.$request({
				url: API_ROOT.HR_ACADEMY_TRAIN_SCHEDULE_ADD_LIST_GET,
				type: 'GET',
				param: {
					type: 1,
				},
			}).then((res) => {
				this.auditCount = res.data.default_count;
			}).catch((error) => {
				console.error(error);
			});
		},
		async initData() {
			await this.loadData();
			let obj = {
				data: {
					date: moment().format('YYYY-MM-DD')
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
					date: moment().format('YYYY-MM-DD')
				}
			};
			await this.handleSelcet(obj);
			let { query = {} } = getParseUrl();
			this.$router.replace(getHashUrl(
				'/hr/academy/train/schedule',
				{
					...query,
					type: this.type,
					depart_id: this.depart_id
				}
			));
		},
		handleProvide() {
			this.$router.push('/hr/academy/train/schedule/add');
		},
		async loadData(month) {
			let curMonth = moment().format('YYYY-MM');
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
				'/hr/academy/train/schedule',
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
.hr-academy-train-schedule {
	._select {
		display: block;
		height: 40px;
	}
}
</style>
