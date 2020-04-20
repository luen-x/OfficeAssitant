<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="search"
				placeholder="请输入姓名或手机号码"
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
			<div v-if="showTime&&chief&&(this.$route.query.type==1||!this.$route.query.type)" class="g-fr">
				<span >
					<i-poptip trigger="hover" placement="bottom" content="超出期限未选择，系统将自动分配人员。">
						<i class="iconfont icon-question "/>
					</i-poptip>
					可选时间：{{ count[4]||"--" }}  至 {{ count[5]||"--" }}
				</span>
				<span v-if="count[3]==1">
					剩余可分配：{{ count[0] }}人（{{ count[1] }}男/{{ count[2] }}女）
				</span>
				<span v-else>
					剩余可分配：{{ count[0] }}人（男女不限）
				</span>
			</div>
			<div v-if="this.$route.query.type>1||!chief" class="g-red-btn-line g-fr" @click="handleChangeTableTitle">
				选择表头
			</div>
		</div>
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">
				<i-input
					v-model="college"
					placeholder="请输入毕业学校"
					style="width: 220px"
					clearable
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-select
					v-model="education"
					placeholder="请选择学历"
					style="width:220px"
					class="g-m-r-5"
					clearable
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item,index) in educationList"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>

				<i-input
					v-model="profession"
					placeholder="请输入专业名称"
					clearable
					style="width: 220px"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<!-- <i-select
					v-model="profession"
					placeholder="请选择专业"
					style="width:220px"
					class="g-m-r-5"
					clearable
					ransfer>
					<i-option
						v-for="(item,index) in professionList"
						:key="index"
						:value="item.value">
						{{ item.label }}
					</i-option>
				</i-select> -->
				<i-select
					v-model="sex"
					placeholder="请选择性别"
					style="width:220px"
					class="g-m-r-5"
					clearable
					@on-change="handleSearch"
				>
					<i-option value="0">男</i-option>
					<i-option value="1">女</i-option>
				</i-select>
				<template v-if="this.$route.query.type>2||!chief">
					<i-select
						v-model="is_ticket"
						placeholder="有无到杭车次"
						style="width:220px"
						class="g-m-r-5"
						clearable
						@on-change="handleSearch"
					>
						<i-option value="1">有</i-option>
						<i-option value="0">无</i-option>
					</i-select>
					<i-date-picker
						v-model="ticket_arrive_time"
						type="daterange"
						clearable
						transfer
						split-panels
						placeholder="请选择到杭时间"
						style="width: 220px;"
						class="g-m-r-5"
						@on-change="handleDateChange($event, 'ticket_arrive_time')"/>
					<i-cascader
						v-if="chief"
						v-model="depart_id"
						:data="departMy"
						change-on-select
						placeholder="请选择试岗部门"
						clearable
						style="width: 220px"
						class="g-m-r-5"
						@on-change="handleChange"
					/>
					<i-date-picker
						v-model="try_start_time"
						type="datetimerange"
						clearable
						transfer
						split-panels
						placeholder="请选择试岗分配时间"
						style="width: 220px;"
						class="g-m-r-5"
						@on-change="handleDateChange($event, 'try_start_time')"/>
				</template>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Poptip, Select, Option, DatePicker, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { services } from '@stores/services/hr';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { TableTitle } from '@components/_common/table-title/table-title';
import moment from 'moment';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-poptip': Poptip,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-cascader': Cascader,
		'vc-expand': Expand,
		"i-date-picker": DatePicker
	},
	mixins: [services.departMy()],
	data() {
		const { query = {} } = this.$route;
		return {
			query,
			search: String(query.search || ''),
			college: String(query.college || ''),
			education: query.education || '',
			profession: query.profession || '',
			sex: String(query.sex || ''),
			is_ticket: String(query.is_ticket || ''),
			ticket_arrive_time: [query.ticket_arrive_time_start, query.ticket_arrive_time_end] || [],
			try_start_time: [query.assign_time_start, query.assign_time_end] || [],
			depart_id: query.depart_id ? query.depart_id.split(",").map(item => Number(item)) : [],
			name: String(query.name || ''),
			show: false,
			educationList: [],
			professionList: [],
		};

	},
	computed: {
		count() {
			return this.$store.state.hrPersonnelMemberDistribution.count;
		},
		chief() {
			return this.$global.staff.depart_is_charge == 1 && this.$global.staff.depart_lowest == 0;
		},
		showTime() {
			if (this.count[3] == 0 || this.count[6] == 1) {
				return false;
			} else {
				const date = moment();
				return !!(moment(this.count[4]) <= date && date <= moment(this.count[5]));


			}
		}
	},
	mounted() {
		this.loadData();
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleDateChange(date, value) {
			this[value] = date;
			this.handleSearch();
		},
		handleChange(v) {
			this.depart_id = v;
			this.handleSearch();
		},
		handleChangeTableTitle() {


			// eslint-disable-next-line max-len
			 const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrPersonnelMemberDistribution.title[this.chief ? this.$route.query.type || '2' : '3'];
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_RECRUIT_CONFIG_SAVE_POST',
				mutation: 'HR_PERSONNEL_MEMBER_DISTRIBUTION_TITLE_CHANGE',
				type: this.chief ? this.$route.query.type || '1' : 3,
				scenario: 9
			}).then(() => {
				this.$store.commit("HR_PERSONNEL_MEMBER_DISTRIBUTION_LIST_INIT", {
					type: this.$route.query.type || '1'
				});
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				// this.$vc.emit('hr-archives-person-title-change', { type: this.$route.query.type || '1' });
			}).catch(err => {
			});
		},
		loadData() {
			this.$request({
				url: '_HR_STAFF_EDUCATION_GET',
				type: 'POST',
				loading: false
			}).then(res => {
				this.educationList = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/personnel/member/distribution',
				{
					...this.$route.query,
					search: this.search,
					college: this.college,
					education: this.education,
					sex: this.sex,
					is_ticket: this.is_ticket,
					profession: this.profession,
					try_depart_id: this.depart_id[this.depart_id.length - 1],
					ticket_arrive_time_start: this.ticket_arrive_time[0],
					ticket_arrive_time_end: this.ticket_arrive_time[1],
					assign_time_start: this.try_start_time[0]
						&& moment(this.try_start_time[0]).format('YYYY-MM-DD HH:mm:ss'),
					assign_time_end: this.try_start_time[1]
						&& moment(this.try_start_time[1]).format('YYYY-MM-DD HH:mm:ss'),
					keyword: this.keyword,
					name: this.name
				}
			));
			this.$store.commit('HR_PERSONNEL_MEMBER_DISTRIBUTION_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
