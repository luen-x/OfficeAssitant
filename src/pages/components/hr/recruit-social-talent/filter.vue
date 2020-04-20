<template>
	<div class="js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="keywords.search"
					clearable
					placeholder="请输入姓名或手机号"
					style="width: 300px"
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
			</div>

			<div>
				<vc-debounce-click
					class="g-red-btn-line g-m-r-10"
					@click="handleSelectTitle">
					选择表头
				</vc-debounce-click>
				<vc-debounce-click class="g-red-btn-line g-fr" @click="handleExport">
					导出
				</vc-debounce-click>
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
					<i-cascader
						v-model="keywords.position_id"
						:data="recruitDePosition"
						class="g-m-r-5"
						style="width: 220px; display: inline-block"
						clearable
						transfer
						filterable
						trigger="hover"
						placeholder="请选择应聘职位"
						@on-change="handleSearch({position_id: arguments[0]})"
					/>
					<i-select
						v-model="keywords.education"
						class="g-m-r-5"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择学历"
						@on-change="handleSearch({education: arguments[0]})"
					>
						<i-option
							v-for="(item, index) in education"
							:key="index"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
					<i-select
						v-model="keywords.ditch"
						class="g-m-r-5"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择招聘渠道"
						@on-change="handleSearch({ditch: arguments[0]})"
					>
						<i-option
							v-for="(item, index) in ditches"
							:key="index"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
					<i-cascader
						v-model="keywords.try_depart_id"
						:data="departAll"
						class="g-m-r-5"
						style="width: 220px; display: inline-block"
						clearable
						transfer
						trigger="hover"
						placeholder="请选择试岗部门"
						@on-change="handleSearch({try_depart_id: arguments[0]})"
					/>
					<i-select
						v-model="keywords.is_tracking"
						class="g-m-r-5"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择是否再跟踪"
						@on-change="handleSearch({is_tracking: arguments[0]})"
					>
						<i-option
							v-for="(item, index) in trackingArr"
							:key="index"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
					<i-select
						:value="keywords.staff_id"
						:remote-method="loadStaff"
						:loading="staffLoading"
						class="g-m-r-5"
						style="width: 220px;"
						filterable
						remote
						clearable
						transfer
						label-in-value
						placeholder="请选择邀约人"
						@on-change="handleChange({staff_id: arguments[0]})"
					>
						<i-option
							v-for="(item, index) in staffData"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
					<!-- <i-date-picker
						:value="keywords.create_time"
						transfer
						type="date"
						class="g-m-r-5"
						style="width: 220px;"
						placeholder="请选择录入时间"
						@on-change="handleChange({create_time: arguments[0]})"
					/> -->

					<i-date-picker
						:value="keywords.predict_interview_time"
						:split-panels="true"
						transfer
						type="daterange"
						class="g-m-r-5"
						style="width: 220px;"
						placeholder="请选择预计面试时间"
						@on-change="handleDateChange($event, 'predict_interview_time')"/>
					<i-date-picker
						:value="keywords.pass_time"
						:split-panels="true"
						transfer
						type="daterange"
						class="g-m-r-5"
						style="width: 220px;"
						placeholder="请选择淘汰时间"
						@on-change="handleDateChange($event, 'pass_time')"/>
					<i-date-picker
						:value="keywords.interview_time"
						:split-panels="true"
						transfer
						type="daterange"
						class="g-m-r-5"
						style="width: 220px;"
						placeholder="请选择实际面试时间"
						@on-change="handleDateChange($event, 'interview_time')"/>
					<i-date-picker
						:value="keywords.try_start_time"
						:split-panels="true"
						transfer
						type="daterange"
						class="g-m-r-5"
						style="width: 220px;"
						placeholder="请选择试岗时间"
						@on-change="handleDateChange($event, 'try_start_time')"/>
				</div>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { services, createSearch } from '@stores/services/hr';
import lodash from 'lodash';
import { TableTitle } from '../../_common/table-title/table-title';

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
		services.education(),
		services.ditches(),
		createSearch({ key: 'staff' })
	],
	data() {
		const { query = {} } = this.$route;
		return {
			staff: query.staff_name || '',
			trackingArr: [
				{
					label: '否',
					value: 0
				},
				{
					label: '是',
					value: 1
				}
			],
			keywords: {
				...query,
				education: Number(query.education),
				is_tracking: Number(query.is_tracking),
				ditch: Number(query.ditch),
				staff_id: Number(query.staff_id),
				staff_name: query.staff_name,
				position_id: query.position_id ? query.position_id.split(',').map((item) => Number(item)) : [],
				try_depart_id: query.try_depart_id ? query.try_depart_id.split(',').map((item) => Number(item)) : [],
				pass_time: query.pass_time_start ? [query.pass_time_start, query.pass_time_end] : '',
				interview_time: query.interview_time_start ? [query.interview_time_start, query.interview_time_end] : '',
				try_start_time: query.try_start_time_start ? [query.try_start_time_start, query.try_start_time_end] : '',
				predict_interview_time: query.predict_interview_time_start
					? [query.predict_interview_time_start, query.predict_interview_time_end]
					: '',
			},
			show: false,
		};
	},
	methods: {
		handleSearch: lodash.debounce(function (value) {
			let params = {
				...this.$route.query,
				...this.keywords,
				fixPosition: true
			};
			if (value) {
				params = {
					...params,
					...value,
					position_id: this.keywords.position_id.length ? this.keywords.position_id : null,
					try_depart_id: this.keywords.try_depart_id.length ? this.keywords.try_depart_id : null,
				};
			}
			this.$router.replace(getHashUrl(
				'/hr/recruit/talent/obsolete',
				params
			));
			this.$store.commit('HR_RECRUIT_SOCIAL_TALENT_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleChange(obj) {
			let type = Object.keys(obj)[0];
			let value = obj[type];
			if (type === 'staff_id') {
				this.keywords.staff_id = value ? value.value : '';
				this.keywords.staff_name = value ? value.label : '';
			}
			this.handleSearch();
		},
		// 时间改变
		handleDateChange(val, name) {
			this.keywords[`${name}_start`] = val[0];
			this.keywords[`${name}_end`] = val[1];
			this.handleSearch();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleExport() {
			const { query = {} } = this.$route;
			const url = getHashUrl(API_ROOT['HR_RECRUIT_SOCIAL_TALENT_LIST_GET'], { // eslint-disable-line
				...query,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		},
		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrRecruitSocialTalent.title[this.$route.query.type || '0'];
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_RECRUIT_CONFIG_SAVE_POST',
				mutation: 'HR_RECRUIT_SOCIAL_TALENT_TITLE_CHANGE',
				type: this.$route.query.type || '0',
				scenario: 4
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit('hr-recruit-soical-talent-title-change', { type: this.$route.query.type || '0' });

			}).catch(err => {
			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
