<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="obj.search"
				:maxlength="11"
				style="width: 300px"
				placeholder="请输入员工姓名/手机"
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<span class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer" @click="handleToggle">
				更多搜索条件
				<i
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont g-fs-12 g-c-black-dark"
				/>
			</span>
			<div class="g-fr" >
				<div class="g-red-btn-line  g-m-r-5" @click="handleChangeTableTitle">选择表头</div>
				<div v-if="$auth[197]" class="g-red-btn-line g-m-r-5" @click="handleAddBtn">新增</div>
				<div class="g-red-btn-line" @click="handleExport">导出</div>
			</div>
		</div>
		<vc-expand ref="expand" v-model="show">
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-cascader
					:data="departAll"
					v-model="obj.depart_id"
					:change-on-select="true"
					placeholder="请选择部门"
					trigger="click"
					clearable
					transfer
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleDepartChange"
				/>
				<i-select
					v-model="obj.position_id"
					placeholder="请选择职位"
					style="width: 220px"
					clearable
					transfer
					filterable
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in positionList"
						:key="item.position_id"
						:value="item.position_id"
					>{{ item.position_name }}</i-option>
				</i-select>
				<i-date-picker
					v-model="entry_date"
					:split-panels="true"
					type="daterange"
					clearable
					transfer
					placeholder="请选择预计入职日期/入职日期"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'entry')"
				/>
				<i-date-picker
					v-model="regular_time"
					:split-panels="true"
					type="daterange"
					clearable
					transfer
					placeholder="请选择转正日期"
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'regular')"
				/>
				<i-input
					v-model="obj.seat_number"
					:maxlength="11"
					style="width: 220px"
					class="g-m-r-5"
					placeholder="请输入坐席号"
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-input
					v-model="obj.pstn_number"
					:maxlength="11"
					style="width: 220px"
					class="g-m-r-5"
					placeholder="请输入外线号码"
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-input
					v-model="obj.tel"
					:maxlength="11"
					style="width: 220px"
					class="g-m-r-5"
					placeholder="请输入座机号码"
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from "lodash";
import { Expand } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { services, staffByMutiTerm } from "@stores/services/hr";
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import { TableTitle } from '@components/_common/table-title/table-title';
import { Input, Button, Select, Option, DatePicker, Cascader } from "iview";
import { AuditModal } from "./popup/audit";

export default {
	name: "oa-filter",
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		"i-date-picker": DatePicker,
		"vc-expand": Expand
	},
	mixins: [services.departAll(), staffByMutiTerm],
	data() {
		const { query = {} } = this.$route;
		return {
			obj: {
				...query,
				search: (query.search),
				tel: (query.tel),
				seat_number: (query.seat_number),
				pstn_number: (query.pstn_number),
				position_id: Number(query.position_id),
				depart_id: query.depart_id ? query.depart_id.split(",").map(item => Number(item)) : []
			},
			show: false,
			positionList: [],
			entry_date: [query.entry_start, query.entry_end],
			regular_time: [query.regular_start, query.regular_end]
		};
	},
	mounted() {
		if (this.obj.depart_id.length) {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: "GET",
				loading: false
			}).then(res => {
				this.positionList = res.data.filter(item => item.depart_id === this.obj.depart_id[0])[0].positions;
			}).catch(error => {});
		}
	},
	methods: {
		handleAddBtn() {
			AuditModal.popup({ title: "新增入职", staffId: 0 }).then(res => {
				this.$router.replace(
					getHashUrl("/hr/employee/summary", {
						type: 1
					})
				);
				this.$store.commit("HR_SUMMARY_LIST_INIT");
			});
		},
		// 选中部门发生变化时
		handleDepartChange(value, selected) {
			this.obj.depart_id = value;
			if (value.length === 0) {
				this.obj.position_id = '';
				this.positionList = [];
			} else {
				this.$request({
					url: API_ROOT._HR_DEPART_POSITION_GET,
					type: 'GET',
					loading: false
				}).then((res) => {
					value.length
						? this.positionList = res.data.filter(item => item.depart_id === value[0])[0].positions
						: '';
				}).catch((error) => {});
			}
			this.handleSearch();
		},
		// 时间改变
		handleDateChange(val, name) {
			this.obj[`${name}_start`] = val[0];
			this.obj[`${name}_end`] = val[1];
			this.handleSearch();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch() {
			// 搜索
			this.$router.replace(
				getHashUrl("/hr/employee/summary", {
					type: this.$route.query.type,
					...this.obj,
					depart_id: this.obj.depart_id.length ? this.obj.depart_id : null,
					fixPosition: true,
				})
			);
			this.$store.commit("HR_SUMMARY_LIST_INIT");
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleChangeTableTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrSummary.title[this.$route.query.type || '1'];
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_RECRUIT_CONFIG_SAVE_POST',
				mutation: 'HR_SUMMARY_TITLE_CHANGE',
				type: this.$route.query.type || '1',
				scenario: 5
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit('hr-employee-summary-title-change', { type: this.$route.query.type || '0' });
				this.$store.commit("HR_SUMMARY_LIST_INIT", {
					type: this.$route.query.type || '1'
				});
			}).catch(err => {
			});

		},
		handleExport() {
			const query = {
				...this.$route.query,
				type: this.$route.query.type || "1"
			};
			window.open(getHashUrl(API_ROOT.HR_EMPLOYEE_SUMMARY_LIST_GET, {
				...query,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
	}
};
</script>

<style lang="scss" scoped>
</style>


