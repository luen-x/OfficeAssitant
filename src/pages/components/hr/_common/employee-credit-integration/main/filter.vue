<template>
	<div>
		<div class="g-flex g-ai-c g-jc-sb">
			<div>
				<i class="iconfont icon-fl-zuzhi g-c-red-mid g-fs-20" />
				<i-select
					v-model="first_depart_id"
					placeholder="请选择部门"
					clearable
					transfer
					style="width: 220px;"
					class="g-m-l-15"
					@on-change="handleChange"
				>
					<i-option
						v-for="item of stairArr"
						:key="item.depart_id"
						:value="item.depart_id">{{ item.depart_name }}</i-option>
				</i-select>
			</div>
			<div>
				<vc-debounce-click
					v-if="name === '学分' && $auth[874]"
					class="g-red-btn-line"
					style="marginRight: 6px;"
					@click="handleJumpAudit">
					{{ name }}审核
				</vc-debounce-click>
				<vc-debounce-click
					v-if="name === '积分' ? $auth[867] : $auth[881]"
					class="g-red-btn-line"
					style="marginRight: 6px;"
					@click="handleJumpRank">
					{{ name }}排名
				</vc-debounce-click>
				<i-dropdown v-if="getAuth[1]|| getAuth[0]" @on-click="handleClick">
					<span
						class="g-red-btn-line"
					>
						更多
						<i class="icon iconfont icon-triangle-down g-fs-12"/>
					</span>
					<i-dropdown-menu slot="list">
						<i-dropdown-item v-if="getAuth[1]" name="1">导入数据</i-dropdown-item>
						<i-dropdown-item v-if="getAuth[0]" name="2">导出列表</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
			</div>
		</div>
		<div>
			<div class="g-m-t-20">
				<i-input
					v-model="formdata.search"
					placeholder="请输入姓名/手机/工号"
					style="width: 300px"
					@on-change="handleSearch"
					@on-enter="handleSearch"
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
			</div>
			<vc-expand
				ref="expand"
				v-model="show"
				class="js-filter"
			>
				<div
					class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
					style="padding-top: 3px;padding-bottom: 7px;">
					<i-cascader
						v-model="formdata.depart_id"
						:data="departArr"
						:change-on-select="true"
						placeholder="请选择部门"
						clearable
						transfer
						class="g-m-r-5"
						style="width: 220px;"
						@on-change="handleDepartChange"
					/>
					<i-select
						v-model="formdata.position_id"
						placeholder="请选择职位"
						clearable
						transfer
						style="width: 220px;"
						class="g-m-r-5"
						@on-change="handleSearch"
					>
						<i-option
							v-for="item of positionArr"
							:key="item.position_id"
							:value="item.position_id">{{ item.position_name }}</i-option>
					</i-select>
					<i-select
						v-model="formdata.data_type"
						placeholder="请选择范围"
						clearable
						transfer
						style="width: 220px;"
						class="g-m-r-5"
						@on-change="handleSearch"
					>
						<i-option value="2">规则范围内员工</i-option>
						<i-option value="1">全部员工</i-option>
					</i-select>
					<i-datepicker
						v-model="formdata.year"
						placeholder="请选择年份"
						clearable
						transfer
						type="year"
						style="width: 220px;"
						class="g-m-r-5"
						@on-change="handleSearch"
					/>
					<i-input
						v-model="formdata.usable_start"
						:placeholder="`请输入起始晋升${name}`"
						style="width: 220px"
						class="g-m-r-5"
						@on-change="handleSearch"
						@on-enter="handleSearch"
					/>
					<i-input
						v-model="formdata.usable_end"
						:placeholder="`请输入结束晋升${name}`"
						style="width: 220px"
						class="g-m-r-5"
						@on-change="handleSearch"
						@on-enter="handleSearch"
					/>
				</div>
			</vc-expand>
		</div>
	</div>
</template>

<script>
import { Input, Button, Select, Option, Cascader, DatePicker, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import moment from 'moment';
import { getParseUrl, getHashUrl, initTreeData, getItem } from '@utils/utils';
import { LeadInModal } from './popup/lead-in';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'vc-expand': Expand,
		'i-cascader': Cascader,
		'i-datepicker': DatePicker,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
	},
	props: {
		path: String,
		commit: String,
		name: String,
		id: String
	},
	data() {
		const { query = { } } = this.$route;
		return {
			formdata: {
				...query,
				data_type: '2',
				stat_period: '2',
				depart_id: query.depart_id ? query.depart_id.split(',').map(Number) : []
			},
			show: false,
			stairArr: [],
			departArr: [],
			positionArr: [],
			first_depart_id: ''
		};
	},
	computed: {
		getAuth() {
			let authArr = [true, true];
			switch (this.name) {
				case '积分':
					authArr = [this.$auth[868], true];
					break;
				case '学分':
					authArr = [this.$auth[882], true];
					break;
				default:
					break;
			}
			return authArr;
		},
	},
	async mounted() {
		await this.loadStairDepart();
		this.loadDepart(this.first_depart_id);
		this.loadPosition(this.first_depart_id);
		this.loadTab(this.first_depart_id);
	},
	methods: {
		handleDepartChange(val) {
			this.formdata.depart_id = val;
			this.handleSearch();
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				this.path,
				{
					...this.formdata,
					year: this.formdata.year && moment(this.formdata.year).format('YYYY')
				}
			));
			this.$store.commit(this.commit);
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleJumpAudit() {
			this.$router.push(getHashUrl(this.path + '/audit', { depart_id: this.first_depart_id }));
		},
		handleJumpRank() {
			this.$router.push(getHashUrl(this.path + '/rank', { depart_id: this.first_depart_id }));
		},
		handleLeadIn() {
			// LeadInModal.popup({
			// 	cate: this.name === '积分' ? 1 : 2,
			// }).then(res => {

			// }).catch(err => {

			// });
			this.$router.push(this.path + '/leadin');
		},
		handleClick(name) {
			name === '1' ? this.handleLeadIn() : this.handleOutput();
		},
		handleOutput() {
			const { query = {} } = this.$route;
			window.open(getHashUrl(API_ROOT.HR_EMPLOYEE_SCORE_CREDIT_LIST_GET, {
				...query,
				cate: this.name === '积分' ? 1 : 2,
				is_export: 1,
				ic_system_id: this.id,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
		loadStairDepart() {
			return this.$request({
				url: 'HR_STAIR_DEPART_GET',
				type: 'GET',
				loading: false
			}).then(res => {
				this.stairArr = res.data;
				this.first_depart_id = res.data[0].depart_id;
			}).catch(err => {

			});
		},
		loadDepart(depart_id) {
			this.$request({
				url: '_HR_EMPLOYEE_CI_DEPART_SON_GET',
				type: 'GET',
				param: {
					depart_id
				},
				loading: false
			}).then(res => {
				this.departArr = initTreeData(res.data[0].children, 'depart_id', 'depart_name');
			}).catch(err => {

			});
		},
		loadPosition(depart_id) {
			this.$request({
				url: '_HR_DEPART_POSITION_GET',
				type: 'GET',
				param: {
					depart_id
				},
				loading: false
			}).then(res => {
				this.positionArr = res.data[0].positions;
			}).catch(err => {

			});
		},
		handleChange(depart_id) {
			this.first_depart_id = depart_id;
			this.loadDepart(depart_id);
			this.loadPosition(depart_id);
			this.loadTab(depart_id);
			this.handleSearch();
		},
		loadTab(first_depart) {
			this.request({
				url: this.name === '积分' ? 'HR_EMPLOYEE_INTEGRATION_TABS_GET' : 'HR_EMPLOYEE_CREDIT_TABS_GET',
				type: 'GET',
				param: {
					first_depart,
					cate: this.name === '积分' ? 1 : 2
				},
				loading: false
			}).then(res => {

			}).catch(err => {

			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
