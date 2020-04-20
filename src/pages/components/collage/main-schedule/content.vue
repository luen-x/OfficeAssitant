<template>
	<div class="v-collage-main-schedule">
		<i-tab
			v-model="type"
			:value="type"
			:animated="false"
			type="card"
			@on-click="handleChange">

			<i-tab-pane v-if="$auth[734]" label="线上课程" name="1">
				<div class="_select g-m-b-10">
					<i-cascader 
						v-if="$auth[735]"
						v-model="depart_id"
						:data="departArray"
						style="width: 220px; display: inline-block"
						clearable
						transfer
						change-on-select
						placeholder="请选择部门"
						@on-change="handleChangeDepart"
					/>
					<i-select
						v-if="$auth[643]"
						ref="onlineLecture"
						v-model="lecture_id"
						style="width: 220px"
						class="g-m-l-5"
						clearable
						transfer
						filterable
						multiple
						placeholder="请输入讲师名称查询"
						@on-change="handleSearch()"
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
						@click="handleSearch()"
					>
						搜索
					</i-button>
				</div>
				<div class="g-flex">
					<oa-main-calendar 
						v-if="type == '1'" 
						:on-refresh="loadData" 
						:datas="calendarData"
						:type="type"
						@select="handleSelcet"
					/>
					<oa-note 
						v-if="type == '1'" 
						:datas="noteData"
						:type="type"
						:loading="loading"
						@empty="handleEmpty"
						@blank="handleBlank"
					/>
				</div>
			</i-tab-pane>

			<i-tab-pane v-if="$auth[1391]" label="线下课程" name="2">
				<div class="_select g-m-b-10"> 
					<i-cascader 
						v-if="$auth[1392]"
						v-model="depart_id"
						:data="departArray"
						style="width: 220px; display: inline-block"
						clearable
						transfer
						change-on-select
						placeholder="请选择部门"
						@on-change="handleChangeDepart"
					/>
					<i-select
						v-if="$auth[1393]"
						ref="offlineLecture"
						v-model="lecture_id"
						style="width: 220px"
						class="g-m-l-5"
						clearable
						transfer
						filterable
						multiple
						placeholder="请输入讲师名称查询"
						@on-change="handleSearch()"
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
						@click="handleSearch()"
					>
						搜索
					</i-button>
				</div>
				<div class="g-flex">
					<oa-main-calendar 
						v-if="type == '2'"
						:on-refresh="loadData" 
						:datas="calendarData"
						:type="type"
						@select="handleSelcet"
					/>
					<oa-note 
						v-if="type == '2'" 
						:type="type"
						:datas="noteData"
						:load-data="loadData"
						:loading="loading"
						@empty="handleEmpty"
						@blank="handleBlank"
					/>
				</div>
			</i-tab-pane>
		</i-tab>
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
		"i-select": Select,
		"i-button": Button,
		'i-option': Option
	},
	mixins: [services.departAll()],
	data() {
		const { query } = this.$route;
		const depart = [getItem(`staff_${this.$global.version}`).staff.depart_id];
		return {
			type: query.type ? String(query.type) : this.$auth[734] ? '1' : '2',
			depart_id: query.depart_id ? [query.depart_id] : this.type == '1' ? depart : [],
			lecture_id: query.lecture_id ? query.lecture_id.split(",").map(item => Number(item)) : [],
			calendarData: {},
			noteData: {
				item: [],
			},
			showNote: false,
			auditCount: 0,
			tearchArray: [],
			departArray: [],
			currentDay: '',
			curMonth: '',
			tempLecturer: [],
			loading: true, // note loading
		};
	},
	created() {
		this.loadArrayDataFirst();
	},
	methods: {
		async loadArrayDataFirst() {
			const { query } = this.$route;
			let depart = [getItem(`staff_${this.$global.version}`).staff.depart_id];
			depart = this.departArray.filter(v => v.value == depart);
			this.depart_id = query.depart_id 
				? query.depart_id.split(",").map(item => Number(item)) 
				: this.type == '1' ? depart : [];
			await this.loadDepartData();
			await this.loadTeacherData(this.depart_id.join(','));
			await this.initData();
		},
		async loadArrayData() {
			await this.loadDepartData();
			await this.loadTeacherData(this.depart_id.join(','));
		},
		async loadDepartData() {
			return this.$request({
				url: API_ROOT['_COLLAGE_MAIN_SCHEDULE_DEPARTS_GET'],
				type: "GET",
				param: {
					type: this.type
				},
				loading: false
			}).then((res) => {
				this.departArray = this.formatDepart(res.data);
			}).catch((error) => {
			});
		},
		formatDepart(arr) {
			const target = arr.map(it => {
				const result = {
					label: it.depart_name || '',
					value: it.depart_id || null,
					children: it.child
				};
				if (result.children.length > 0) {
					result.children = this.formatDepart(result.children);
				} else {
					delete result.children;
				}
				return result;
			});
			return target;
		},
		async loadTeacherData(e) {
			return this.$request({
				url: API_ROOT['_COLLAGE_MAIN_SCHEDULE_TEACHER_GET'],
				type: "GET",
				param: {
					depart_ids: e || '',
					type: this.type
				},
				loading: false
			}).then((res) => {
				this.tearchArray = res.data;
				this.tempLecturer.length ? this.lecture_id = this.tempLecturer : '';
			}).catch((error) => {
			});
		},
		// 选择战区
		handleChangeDepart(event) {
			this.$refs.offlineLecture ? this.$refs.offlineLecture.reset() : '';
			this.$refs.onlineLecture ? this.$refs.onlineLecture.reset() : '';
			this.loadTeacherData(event.join(','));
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (day) {
			this.$router.replace(getHashUrl(
				'/collage/main/schedule',
				{
					type: this.type,
					depart_id: this.depart_id,
					lecture_id: this.lecture_id,
				}
			));
			this.initData(day);
		}, 300),
		async initData(day) {
			await this.loadData();
			let obj = {
				data: {
					date: day || this.currentDay || moment(new Date()).format('YYYY-MM-DD')
				}
			};
			await this.handleSelcet(obj);
		},
		// change tab
		async handleChange(name) {
			this.depart_id = [];
			this.$refs.offlineLecture ? this.$refs.offlineLecture.reset() : '';
			this.$refs.onlineLecture ? this.$refs.onlineLecture.reset() : '';
			await this.loadData();
			await this.loadDepartData();
			await this.loadTeacherData();
			let obj = {
				data: {
					date: moment(new Date()).format('YYYY-MM-DD')
				}
			};
			await this.handleSelcet(obj);
			let { query = {} } = getParseUrl();
			this.$router.replace(getHashUrl(
				'/collage/main/schedule',
				{
					type: this.type,
					depart_id: this.depart_id,
					lecture_id: this.lecture_id
				}
			));
		},
		async loadData(month) {
			month ? this.curMonth = month : '';
			let curMonth = moment(new Date()).format('YYYY-MM');
			return this.$request({
				url: this.type == '1' ? '_COLLAGE_MAIN_SCHEDULE_ONLINE_GET' : '_COLLAGE_MAIN_SCHEDULE_OFFLINE_GET',
				type: "GET",
				param: {
					type: this.type,
					month: month || this.curMonth || curMonth,
					depart_id: this.depart_id.toString()
				},
				loading: false
			}).then((res) => {
				this.calendarData = Array.isArray(res.data) ? {} : res.data;
				this.calendarData.lectureArray = this.lecture_id;
				if (this.lecture_id.length) {
					let isToast = true;
					if (this.type == '1') {
						Object.values(res.data).forEach(v => {
							v.forEach(i => {
								this.lecture_id.includes(+i.lecturer_id) ? isToast = false : '';
							});
						});
					} else {
						let arr = Object.values(res.data);
						arr.slice(0, arr.length - 1).forEach(v => {
							v.forEach(k => {
								k.forEach(i => {
									this.lecture_id.includes(+i.lecturer_id) ? isToast = false : '';
								});
							});
						});
					}
					isToast ? this.$Message.warning('员工本月无课程安排') : '';
				}
			}).catch((error) => {
			});
		},
		// click day
		async handleSelcet(data) {
			this.loading = false;
			this.currentDay = data.data.date;
			let object = {
				type: this.type,
				day: data.data.date,
				depart_id: this.type == '2' ? this.$route.query.depart_id : '',
			};
			return this.$request({
				url: this.type == '1' ? '_COLLAGE_MAIN_SCHEDULE_ONLINE_DAY_GET' : '_COLLAGE_MAIN_SCHEDULE_OFFLINE_DAY_GET',
				type: "POST",
				param: {
					date: data.data.date,
					depart_id: this.depart_id.toString(),
				},
				loading: false
			}).then((res) => {
				this.noteData.item = res.data;
				this.noteData.obj = object;
				this.noteData.day = data;
				this.noteData.lectureArray = this.lecture_id;
				this.$nextTick(() => {
					this.tempLecturer = [];
				});
				this.showNote = true;
				this.loading = true;
			}).catch((error) => {
			});
		},
		// 看谁有空
		async handleEmpty(e) {
			this.$refs.offlineLecture ? this.$refs.offlineLecture.reset() : '';
			this.$refs.onlineLecture ? this.$refs.onlineLecture.reset() : '';
			if (e) {
				this.depart_id = [e.depart_id];
				this.lecture_id = [e.staff_id];
				this.tempLecturer = [e.staff_id];
			}
			await this.handleSearch(e.currentData.data.date);
			await this.loadArrayData();
			await this.handleSelcet(e.currentData);
		},
		// 清空当天活动
		async handleBlank(e) {
			await this.handleSearch(e.data.date);
			// await this.loadArrayData();
			await this.handleSelcet(e);
		}
	},
};
</script>

<style lang="scss" scoped>
.v-collage-main-schedule {
	margin-top: 20px;
	._select {
		display: block;
	}
}
</style>
