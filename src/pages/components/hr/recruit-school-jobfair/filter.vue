<template>
	<div class="js-filter v-recruit-school-jobfair-filter">
		<div>
			<i-input
				v-model="keyword" 
				placeholder="请输入招聘会学校名称" 
				style="width: 300px" 
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
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
			<div class="g-fr _right-text">
				<vc-debounce-click 
					v-if="$auth[158]" 
					class="g-red-btn-line g-m-r-5" 
					@click="handleAdd"
				>
					招聘会录入
				</vc-debounce-click >
				<i-dropdown
					trigger="hover"
					@on-click="handleClickMore">
					<div class="_more g-flex g-jc-sb g-m-l-5">
						更多功能
						<i class="iconfont icon-triangle-down g-fs-14 g-pointer" />
					</div>
					<i-dropdown-menu slot="list">
						<i-dropdown-item v-if="$auth[159]" name="2">导出</i-dropdown-item>
						<i-dropdown-item name="1">选择表头</i-dropdown-item>
						<i-dropdown-item v-if="$auth[1726]" name="3">合作学校</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
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
				<i-select
					v-model="person"
					style="width: 220px"
					class="g-m-r-5"
					filterable
					clearable
					transfer
					multiple
					placeholder="请选择参与人"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in personList"
						:key="index"
						:value="item.staff_id"
					>
						{{ item.staff_name }}
					</i-option>
				</i-select>
				<i-select
					v-model="meeting_year" 
					transfer
					clearable
					placeholder="请选择招聘会年份"
					class="g-m-r-5"
					style="width: 220px" 
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in meetingYear"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
				<i-select
					v-model="season_type" 
					transfer
					clearable
					placeholder="请选择招聘季"
					class="g-m-r-5"
					style="width: 220px" 
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in seasonType"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
				<i-select
					v-model="action_type"
					style="width: 220px"
					class="g-m-r-5"
					clearable
					transfer
					placeholder="请选择招聘会类型"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in activityTypeList"
						:key="index"
						:value="item.id"
					>
						{{ item.label }}
					</i-option>
				</i-select>
				<i-select
					v-model="school_type"
					style="width: 220px"
					class="g-m-r-5"
					clearable
					transfer
					placeholder="请选择学校性质"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in schoolTypeList"
						:key="index"
						:value="item.id"
					>
						{{ item.label }}
					</i-option>
				</i-select>
				<i-cascader 
					v-model="address"
					:data="region"
					style="width: 220px;"
					class="g-m-r-5"
					clearable
					transfer
					change-on-select
					placeholder="请选择地区"
					@on-change="handleAreaSearch"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, DatePicker,
	Option, Message, Cascader, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import moment from 'moment';
import { services } from '@stores/services/hr';
import { services as commonServices } from '@stores/services/common';
import { TableTitle } from '@common/table-title/table-title';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
	},
	mixins: [
		commonServices.region(),
		services.meetingYear(),
		services.seasonType()
	],
	data() {
		const { query = {} } = this.$route;
		const address = [];
		query.province && address.push(+query.province);
		query.city && address.push(+query.city);
		return {
			keyword: String(query.school || ''),
			name: String(query.name || ''),
			show: false,
			action_type: String(query.meeting_type || ''),
			school_type: String(query.college_type || ''),
			person: query.staff_id ? query.staff_id.split(',').map((item) => Number(item)) : [],
			meeting_time: query.meeting_time ? query.meeting_time.split(',') : [],
			address,
			season_type: +query.season_type || null,
			meeting_year: +query.meeting_year || null,
			schoolTypeList: [
				{
					id: '0',
					label: '公办专科学校'
				},
				{
					id: '1',
					label: '公办本科学校'
				},
				{
					id: '2',
					label: '民办专科学校'
				},
				{
					id: '3',
					label: '民办本科学校'
				}
			],
			activityTypeList: [
				{
					id: '0',
					label: '大型招聘会'
				},
				{
					id: '1',
					label: '专场招聘会'
				}
			],
			personList: []
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.getPersonList();
	},
	methods: {
		getPersonList() {
			this.$request({
				url: API_ROOT['HR_RECRUIT_SOCIAL_SUMMARY_ALLOCATE_LIST_GET'],
				type: 'GET',
				param: {
					// search: this.search
				},
				loading: false
			}).then((res) => {
				this.personList = res.data;
			}).catch((err) => {
				this.loading = false;
			});
		},
		handleSearch() {
			let time = '';
			if (this.meeting_time[0]) {
				time = this.meeting_time;
			}
			this.$router.replace(getHashUrl(
				'/hr/recruit/school/jobfair', 
				{ 
					...this.$route.query, 
					fixPosition: true,
					school: this.keyword,
					meeting_type: this.action_type,
					college_type: this.school_type,
					staff_id: this.person.length ? this.person : '',
					province: this.address[0],
					city: this.address[1],
					season_type: this.season_type,
					meeting_year: this.meeting_year,
					meeting_time: time
				}
			));
			this.$store.commit('HR_RECRUIT_SCHOOL_JOBFAIR_LIST_INIT');
		},
		handleAreaSearch(address) {
			this.address = address;
			this.handleSearch();
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrRecruitSchoolJobfair.title[this.$route.query.type || '0'];
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_RECRUIT_CONFIG_SAVE_POST',
				mutation: 'HR_RECRUIT_SCHOOL_JOBFAIR_TITLE_CHANGE',
				type: this.$route.query.type || '0',
				scenario: 1
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit('hr-recruit-school-jobfair-title-change', { type: this.$route.query.type || '0' });
				this.$store.commit("HR_RECRUIT_SCHOOL_JOBFAIR_LIST_INIT", {
					type: this.$route.query.type || '0'
				});
			}).catch(err => {
			});
		},
		handleClickMore(name) {
			name === '1' && this.handleSelectTitle();
			name === '2' && this.handleExport();
			name === '3' && this.handleSchool();
		},
		// 地区改变
		handleAddressChange(val, name) {
			this.address = val;
			this.handleSearch();
		},
		handleSchool() {
			this.$router.push('/hr/recruit/school/jobfair/school');
		},
		handleExport() {
			const { query = {} } = this.$route;
			const url = getHashUrl(API_ROOT['HR_RECRUIT_SCHOOL_JOBFAIR_LIST_GET'], {
				...query,
				is_export: 1,
				'-token': this.$global.token
			});
			window.open(url);
		},
		handleAdd() {
			this.$router.push('/hr/recruit/school/jobfair/add');
		},
		
	}
};

</script>

<style lang="scss">
.v-recruit-school-jobfair-filter {
	._more {
		width: 100px;
		color:#f14b5f;
		padding-left: 15px;
		padding-right: 15px;
		line-height: 30px;
		border: 1px solid #f14b5f;
		border-radius: 4px;
	}
}
</style>
