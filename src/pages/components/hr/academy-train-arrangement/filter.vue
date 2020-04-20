<template>
	<div>
		<div>
			<i-input
				v-model="search.project_topic" 
				placeholder="请输入项目主题进行搜索" 
				style="width: 300px" 
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-button 
				type="primary"
				class="g-m-l-10"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<span 
				class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer"
				@click="handleToggle" 
			>
				更多搜索条件
				<i 
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'" 
					class="iconfont g-fs-12 g-c-black-dark"
				/>
			</span>
			<div class="g-fr">
				<vc-debounce-click
					v-if="$auth[976]"
					class="g-red-btn-line g-m-r-5"
					@click="handleAddProject">
					新建项目课程
				</vc-debounce-click>
				<vc-debounce-click
					v-if="$auth[972]"
					class="g-red-btn-line g-m-r-5"
					@click="handleAudit">
					考试审核({{ waitCount }})
				</vc-debounce-click>
			</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-pd-lr-10 g-pd-t-5 g-pd-b-10 g-lh-40 g-bg-gray-mid">
				<i-input
					v-model="search.search" 
					placeholder="请输入课程名称" 
					style="width: 220px" 
					class="g-m-r-5"
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-select
					v-model="search.project_type" 
					transfer
					clearable
					class="g-m-r-5"
					placeholder="请选择项目类型"
					style="width: 220px"
					@on-change="handleSearch"
				>
					<i-option v-for="item in classesList" :value="item.id" :key="item.id">{{ item.label }}</i-option>
				</i-select>
				<i-cascader
					:data="departAll"
					v-model="search.organizer_depart_ids"
					:change-on-select="true"
					placeholder="请选择举办方"
					trigger="click"
					clearable
					transfer
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleSearch"/>
				<i-cascader
					v-model="search.echelon_ids"
					:data="stageCaTreeAll"
					:change-on-select="true"
					trigger="click"
					clearable
					class="g-m-r-5"
					placeholder="请选择人才梯队"
					style="width: 220px"
					@on-change="handleSearch"
				/>
				<i-date-picker
					v-model="time"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择授课起始时间"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'time')"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button, Select, Option, Divider, Tooltip, Cascader, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { services } from "@stores/services/hr";
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-academy-train-arrangement-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'vc-expand': Expand,
		'i-divider': Divider,
		'i-tooltip': Tooltip,
		"i-cascader": Cascader,
		"i-date-picker": DatePicker,
	},
	mixins: [services.departAll(), services.stageCaTreeAll()],
	data() {
		const { query = {} } = this.$route;
		const organizer_depart_ids = query.organizer_depart_ids ? query.organizer_depart_ids.split(',').map(it => +it) : [];
		const echelon_ids = query.echelon_ids ? query.echelon_ids.split(',').map(it => +it) : [];
		return {
			search: {
				search: '',
				project_topic: '',
				project_type: '',
				organizer_depart_id: organizer_depart_ids[organizer_depart_ids.length - 1] || '',
				echelon_id: echelon_ids[echelon_ids.length - 1] || '',
				stage_id: echelon_ids.length == 3 ? echelon_ids[echelon_ids.length - 1] : '',
				...query,
				organizer_depart_ids,
				echelon_ids
			},
			time: [query.start_time, query.end_time],
			show: false,
			classesList: [
				{
					id: '1',
					label: '岗前培训'
				},
				{
					id: '2',
					label: '人才计划'
				},
				{
					id: '3',
					label: '其他'
				}
			],
			classes: '',
			origin: '',
			origin_data: [],
			depart_id: [],
			entry_date: [],
			waitCount: 0,
		};
	},
	watch: {
		'search.organizer_depart_ids': function (val) {
			this.search.organizer_depart_id = val[val.length - 1] || '';
		},
		'search.echelon_ids': function (val) {
			this.search.echelon_id = val[val.length - 1] || '';
			this.search.echelon_ids.length == 3 ? this.search.stage_id = val[val.length - 1] : this.search.stage_id = '';
		},
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.loadAuditData();
	},
	methods: {
		loadAuditData() {
			this.$request({
				url: API_ROOT['HR_ACADEMY_TRAIN_ARRANGEMENT_AUDIT_LIST_GET'],
				type: 'GET',
				param: {
					pageSize: 1
				},
			}).then(({ data }) => {
				this.waitCount = data.wait_count;
			});
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 时间改变
		handleDateChange(val, name) {
			this.search[`start_${name}`] = val[0];
			this.search[`end_${name}`] = val[1];
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/arrangement', 
				{ 
					...this.$route.query,
					...this.search,
				}
			));
			this.$store.commit('HR_ACADEMY_TRAIN_ARRANGEMENT_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleAddProject() {
			this.$router.push('/hr/academy/train/arrangement/add');
		},
		handleAudit() {
			this.$router.push('/hr/academy/train/arrangement/audit');
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
