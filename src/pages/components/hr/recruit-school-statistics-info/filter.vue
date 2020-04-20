<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="keywords.search"
				clearable
				placeholder="请输入姓名或电话号"
				style="width: 320px"
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
			<div class="g-red-btn-line g-fr" @click="handleExport">
				导出
			</div>
		</div>
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<div>
					<i-input
						v-model="keywords.college"
						clearable
						placeholder="请输入毕业院校"
						style="width: 220px"
						class="g-m-r-5"
						@on-enter="handleSearch"
						@on-change="handleInputChange"
					/>
					<i-cascader
						v-model="keywords.position_id"
						:data="recruitDePosition"
						style="width: 220px; display: inline-block"
						class="g-m-r-5"
						clearable
						filterable
						transfer
						trigger="click"
						placeholder="请选择应聘职位"
						@on-change="handleSearch({position_id: $event})"
					/>
					<i-select
						v-model="keywords.education"
						style="width: 220px"
						class="g-m-r-5"
						clearable
						transfer
						placeholder="请选择学历"
						@on-change="handleSearch({education: $event})"
					>
						<i-option
							v-for="(item, index) in education"
							:key="index"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
					<i-cascader
						v-model="keywords.try_depart_id"
						:data="departAll"
						style="width: 220px; display: inline-block"
						class="g-m-r-5"
						clearable
						change-on-select
						transfer
						trigger="click"
						placeholder="请选择试岗部门"
						@on-change="handleSearch({try_depart_id: $event})"
					/>
					<i-date-picker
						v-if="$route.query.type === '0' || $route.query.type === undefined"
						v-model="create_time"
						type="daterange"
						style="width: 220px;"
						class="g-m-r-5"
						placeholder="请选择录入时间"
						@on-change="handleChange($event, 'create_time')"
					/>
					<i-date-picker
						v-model="reply_time"
						type="daterange"
						style="width: 220px;"
						class="g-m-r-5"
						placeholder="请选择回复报到日期"
						@on-change="handleChange($event, 'reply_time')"
					/>
					<i-date-picker
						v-model="register_time"
						type="daterange"
						style="width: 220px;"
						class="g-m-r-5"
						placeholder="请选择实际报到日期"
						@on-change="handleChange($event, 'register_time')"
					/>
					<i-date-picker
						v-model="entry_time"
						format="yyyy-MM-dd"
						type="daterange"
						style="width: 220px;"
						class="g-m-r-5"
						placeholder="请选择入职日期"
						@on-change="handleChange($event, 'entry_time')"
					/>
				</div>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { educationData } from '@constants/constants';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { services } from '@stores/services/hr';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-cascader': Cascader,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'vc-expand': Expand
	},
	mixins: [
		services.departAll(),
		services.recruitDePosition(),
		services.education()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			keywords: {
				...query,
				position_id: query.position_id && query.position_id.split(',').map((it) => Number(it)),
				try_depart_id: query.try_depart_id && query.try_depart_id.split(',').map((it) => Number(it))
			},
			show: false,
			educationData,
			reply_time: [query.reply_time_start, query.reply_time_end],
			register_time: [query.register_time_start, query.register_time_end],
			entry_time: [query.entry_time_start, query.entry_time_end],
			create_time: [query.create_time_start, query.create_time_end],
		};
	},
	methods: {
		handleSearch(value) {
			let params = {
				...this.$route.query,
				...this.keywords,
				fixPosition: true,
			};
			if (value) {
				params = {
					...params,
					...value
				};
			}
			this.$router.replace(getHashUrl(
				'/hr/recruit/school/statistics/info',
				params
			));
			this.$store.commit('HR_RECRUIT_SCHOOL_STATISTICS_INFO_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleChange(val, name) {
			this.keywords[`${name}_start`] = val[0];
			this.keywords[`${name}_end`] = val[1];
			this.handleSearch();
		},
		handleExport() {
			const { query = {} } = this.$route;
			const url = getHashUrl(API_ROOT['HR_RECRUIT_SCHOOL_STATISTICS_INFO_LIST_GET'], { // eslint-disable-line
				...query,
				type: query.type || '5',
				...this.keywords,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
