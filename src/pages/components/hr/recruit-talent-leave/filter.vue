<template>
	<div class="js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="formdata.search"
					clearable
					placeholder="请输入姓名或手机号"
					style="width: 300px"
					@on-enter="handleSearch"
					@on-change="handleSearch"
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
				style="padding-top: 3px;padding-bottom: 7px;">
				<i-select
					v-model="formdata.staff_id"
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
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in staffData"
						:key="index"
						:value="item.value + ''"
					>{{ item.label }}</i-option>
				</i-select>
				<i-select
					v-model="formdata.position_id"
					class="g-m-r-5"
					style="width: 220px"
					clearable
					transfer
					filterable
					placeholder="请输入离职职位查询"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in allPosition"
						:key="index"
						:value="item.position_id + ''"
					>
						{{ item.position_name }}
					</i-option>
				</i-select>
				<i-select
					v-model="formdata.rank_system_id"
					class="g-m-r-5"
					style="width: 220px"
					clearable
					transfer
					filterable
					placeholder="请输入晋级体系查询"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in rankList"
						:key="index"
						:value="item.rank_system_id + ''"
					>
						{{ item.system_name }}
					</i-option>
				</i-select>
				<i-input
					v-model="formdata.highest_count" 
					placeholder="最高销工次数" 
					clearable
					style="width: 110px" 
					@on-enter="handleSearch"
					@on-change="handleSearch"
				/>
				~
				<i-input
					v-model="formdata.lowest_count" 
					placeholder="最低销工次数" 
					clearable
					class="g-m-r-5"
					style="width: 110px" 
					@on-enter="handleSearch"
					@on-change="handleSearch"
				/>
				<i-date-picker
					:value="formdata.entry_time"
					:split-panels="true"
					type="daterange"
					transfer
					class="g-m-r-5"
					style="width: 220px;"
					placeholder="请选择入职时间"
					@on-change="handleDateSearch($event, 'entry_time')"/>
				<i-date-picker
					:value="formdata.leave_time"
					:split-panels="true"
					type="daterange"
					transfer
					class="g-m-r-5"
					style="width: 220px;"
					placeholder="请选择离职时间"
					@on-change="handleDateSearch($event, 'leave_time')"/>
				<i-select
					v-model="formdata.education"
					class="g-m-r-5"
					style="width: 220px"
					clearable
					transfer
					placeholder="请选择学历"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in education"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { services, createSearch } from '@stores/services/hr';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import lodash from 'lodash';
import moment from 'moment';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option
	},
	mixins: [
		services.education(),
		services.allPosition(),
		createSearch({ key: 'staff' })
	],
	data() {
		const { query = {} } = this.$route;
		return {
			formdata: {
				...query,
				entry_time: [query.entry_time_start, query.entry_time_end],
				leave_time: [query.leave_time_start, query.leave_time_end]
			},
			yxzx_id: 0,
			rankList: [],
			show: false
		};
	},
	watch: {
		yxzx_id(val) {
			this.loadRankList(val);
		}
	},
	mounted() {
		this.loadFirstDepart();
	},
	methods: {
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/recruit/talent/leave', 
				{ 
					...this.formdata,
				}
			));
			this.$store.commit('HR_RECRUIT_TALENT_LEAVE_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleDateSearch(val, name) {
			this.formdata[`${name}_start`] = val[0];
			this.formdata[`${name}_end`] = val[1];
			this.$nextTick(() => {
				this.handleSearch();
			});
		},
		loadRankList(depart_id) {
			this.$request({
				url: 'HR_SALARY_RANK_SYS_GET',
				type: "GET",
				param: {
					depart_id,
					type: 1
				},
				loading: false
			}).then(res => {
				this.rankList = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadFirstDepart() {
			this.$request({
				url: '_FINANCE_FIRST_DEPART_GET',
				type: 'GET',
				param: {
				},
			}).then((res) => {
				this.yxzx_id = res.data.sale;
			}).catch(console.error);
		},
		handleExport: lodash.debounce(function () {
			window.open(getHashUrl(API_ROOT.HR_RECRUIT_TALENT_LEAVE_LIST_GET, {
				...this.$route.query,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		}, 300)
	}
};

</script>

<style lang="scss" scoped>

</style>
