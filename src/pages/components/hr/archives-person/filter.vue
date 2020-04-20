<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="query.search"
				:maxlength="11"
				style="width: 300px"
				placeholder="请输入员工姓名"
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
				<div
					v-if="$auth['1126']"
					class="g-red-btn-line g-m-r-5"
					@click="handleExport"
				>导出</div>
				<div class="g-red-btn-line" @click="handleChangeTableTitle">
					选择表头
				</div>
			</div>
		</div>
		<vc-expand ref="expand" v-model="show">
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<template v-if="this.$route.query.type==1||this.$route.query.type==2">
					<i-cascader
						:data="departAll"
						v-model="query.depart_ids"
						:change-on-select="true"
						placeholder="请选择部门"
						trigger="click"
						clearable
						transfer
						style="width: 220px;display:inline-block"
						class="g-m-r-5"
						@on-change="handleDepartChange"
					/>
					<i-date-picker
						v-model="create_time"
						:split-panels="true"
						type="daterange"
						clearable
						transfer
						placeholder="请选择入职日期"
						style="width: 220px;"
						class="g-m-r-5"
						@on-change="handleDateChange($event, 'create_time')"
					/>
					<i-date-picker
						v-model="leave_time"
						:split-panels="true"
						type="daterange"
						clearable
						transfer
						placeholder="请选择离职日期"
						style="width: 220px"
						class="g-m-r-5"
						@on-change="handleDateChange($event, 'leave_time')"
					/>
				</template>
				<template v-else>
					<i-select
						v-model="query.staff_id"
						class="g-m-r-5"
						style="width: 220px;"
						filterable
						clearable
						transfer
						placeholder="请输入邀约人"
						@on-change="handleSearch"
					>
						<i-option
							v-for="(item, index) in staffData"
							:key="index"
							:value="item.staff_id"
						>{{ item.staff_name }}</i-option>
					</i-select>
					<i-cascader
						v-model="query.position_ids"
						:data="recruitDePosition"
						class="g-m-r-5"
						style="width: 220px; display: inline-block"
						clearable
						transfer
						filterable
						trigger="hover"
						placeholder="请输入应聘职位"
						@on-change="handleSelectPosition"
					/>

					<i-cascader
						:data="departAll"
						v-model="query.try_depart_ids"
						:change-on-select="true"
						placeholder="请选择试岗部门"
						trigger="click"
						clearable
						transfer
						style="width: 220px;display:inline-block"
						class="g-m-r-5"
						@on-change="handleTryDepartChange"
					/>

					<i-date-picker
						v-model="try_start_time"
						:split-panels="true"
						type="daterange"
						clearable
						transfer
						placeholder="请选择试岗时间"
						style="width: 220px;"
						class="g-m-r-5"
						@on-change="handleDateChange($event, 'try_start_time')"
					/>
					<i-date-picker
						v-model="predict_entry_time"
						:split-panels="true"
						type="daterange"
						clearable
						transfer
						placeholder="请选择预计入职时间"
						style="width: 220px;"
						class="g-m-r-5"
						@on-change="handleDateChange($event, 'predict_entry_time')"
					/>
				</template>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Expand } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { services, staffByMutiTerm } from "@stores/services/hr";
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import { TableTitle } from '@components/_common/table-title/table-title';
import { Input, Button, Select, Option, DatePicker, Cascader } from "iview";

export default {
	name: "oa-filter",
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
		"vc-expand": Expand
	},
	mixins: [services.departAll(), staffByMutiTerm, services.recruitDePosition()],
	data() {
		const { query = {} } = this.$route;
		return {
			staffData: [],
			query: {
				staff_name: (query.staff_name),
				staff_id: query.staff_id ? Number(query.staff_id) : '',
				search: (query.search),
				depart_ids: query.depart_ids ? query.depart_ids.split(",").map(item => Number(item)) : [],
				try_depart_ids: query.try_depart_ids ? query.try_depart_ids.split(",").map(item => Number(item)) : [],
				position_ids: query.position_ids ? query.position_ids.split(",").map(item => Number(item)) : []
			},
			show: false,
			try_start_time: [query.try_start_time_start, query.try_start_time_end],
			predict_entry_time: [query.predict_entry_time_start, query.predict_entry_time_end],
			create_time: [query.create_time_start, query.create_time_end],
			leave_time: [query.leave_time_start, query.leave_time_end]
		};
	},
	computed: {
		type() {
			return this.$route.query.type || 3;
		}
	},
	mounted() {
		this.handleLoadStaffData();
	},
	methods: {
		// 选中部门发生变化时
		handleLoadStaffData() {
			return this.$request({
				url: `_HR_MUTI_TERM_STAFF_GET`,
				type: 'GET',
				param: {
					search: '1', // 为了能搜索到全部的员工数据（手机号码必定有1）
				},
				loading: false
			}).then((res) => {
				this.staffData = res.data;
			}).catch((error) => {
				console.error(error, 888);
			});
		},
		handleChangeTableTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrArchivesPerson.title[this.$route.query.type || '3'];
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_RECRUIT_CONFIG_SAVE_POST',
				mutation: 'HR_ARCHIVES_PERSON_TITLE_CHANGE',
				type: this.$route.query.type || '3',
				scenario: 6
			}).then(() => {
				this.$store.commit("HR_ARCHIVES_PERSON_LIST_RESET", {
					type: this.$route.query.type || '3'
				});
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit('hr-archives-person-title-change', { type: this.$route.query.type || '3' });
			}).catch(err => {
			});
		},
		handleDepartChange(value, selected) {
			this.query.depart_ids = value;
			this.query.depart_id = value[value.length - 1];
			this.handleSearch();
		},
		handleTryDepartChange(value, selected) {
			this.query.try_depart_ids = value;
			this.query.try_depart_id = value[value.length - 1];
			this.handleSearch();
		},
		// 时间改变
		handleDateChange(val, name) {
			this.query[`${name}_start`] = val[0];
			this.query[`${name}_end`] = val[1];
			this.handleSearch();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSelectPosition([id1, id2]) {
			this.query.position_id = id2 || '';
			this.query.position_ids = id2 ? [id1, id2] : [];
			this.handleSearch();
		},
		handleSearch() {
			// 搜索
			const query = {
				...this.$route.query,
				type: this.$route.query.type || "3"
			};
			this.$router.replace(
				getHashUrl("/hr/archives/person", {
					...query,
					...this.query,
					fixPosition: false,
				})
			);
			this.$store.commit("HR_ARCHIVES_PERSON_LIST_INIT");
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleExport() {
			const query = {
				...this.$route.query,
				type: this.$route.query.type || "3"
			};

			window.open(getHashUrl(API_ROOT.HR_ARCHIVES_PERSON_LIST_GET, {
				...query,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
	}
};
</script>

<style lang="scss">
</style>