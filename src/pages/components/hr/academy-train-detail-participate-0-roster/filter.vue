<template>
	<div class="v-academy-train-detail-participate-roster">
		<div>
			<div style="display: inline-block;">
				<i-input
					v-model="search.search" 
					class="g-m-r-5"
					placeholder="请输入姓名、手机号码进行搜索" 
					style="width: 320px" 
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<vc-debounce-click
					:tag="Button"
					type="primary"
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
				
			</div>
			<div class="g-fr">
				<i-dropdown @on-click="handleSelect">
					<vc-debounce-click
						class="g-red-btn-line g-m-r-5"
						@click="()=>{}"
					>
						添加人员
					</vc-debounce-click>
					<i-dropdownmenu slot="list">
						<i-dropdownitem name="1">按人才梯队选</i-dropdownitem>
						<i-dropdownitem name="2">按组织架构选</i-dropdownitem>
					</i-dropdownmenu>
				</i-dropdown>
				<vc-debounce-click
					class="g-red-btn-line g-m-r-5"
					@click="handleExport">
					导出
				</vc-debounce-click>
			</div>
			<vc-expand 
				ref="expand"
				v-model="show"
			>
				<div
					class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
					style="padding-top: 3px;padding-bottom: 7px;">
					<i-select 
						v-model="search.user_source"
						class="g-m-r-5"
						placeholder="请选择来源"
						clearable
						transfer
						style="width: 220px;"
						@on-change="handleSearch"
					>
						<i-option
							v-for="(item, index) in userSourceList"
							:key="index"
							:value="item.id"
						>
							{{ item.label }}
						</i-option>
					</i-select>
					<i-cascader
						:data="departAll"
						v-model="search.depart_ids"
						:change-on-select="true"
						placeholder="请选择部门"
						trigger="click"
						clearable
						transfer
						style="width: 220px;display:inline-block"
						class="g-m-r-5"
						@on-change="handleSearch"/>
					<i-select 
						v-if="type == '0'"
						v-model="search.search_course_id"
						class="g-m-r-5"
						placeholder="请选择课程"
						clearable
						transfer
						style="width: 220px;"
						@on-change="handleSearch"
					>
						<i-option
							v-for="(course, index) in courseData"
							:key="index"
							:value="course.course_id"
						>
							{{ course.course_name }}
						</i-option>
					</i-select>
					<i-cascader
						v-if="type !== '0'"
						v-model="search.echelon_ids"
						:data="planCaTreeAll"
						clearable
						class="g-m-r-5"
						placeholder="请选择人才梯队"
						style="width: 220px"
						@on-change="handleSearch"
					/>
				</div>
			</vc-expand>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { services, selectCourse } from '@stores/services/hr';
import { Input, Button, Select, Option, DatePicker, Table, 
	Checkbox, Cascader, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import { PModalRetatedMatter } from '@components/hr/academy-train-detail/_common/popup/related-matter';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { ChooseStaff } from '../_common/academy-course/drawers/choose-staff';
import { ModalProject } from './popup/project-modal';


export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		"i-cascader": Cascader,
		'i-option': Option,
		'i-datepicker': DatePicker,
		'i-table': Table,
		'i-checkbox': Checkbox,
		'i-dropdownitem': DropdownItem,
		'i-dropdown': Dropdown,
		'i-dropdownmenu': DropdownMenu,
	},
	mixins: [
		services.departAll(),
		services.planCaTreeAll(),
		selectCourse
	],
	data() {
		const { query = {} } = this.$route;
		const depart_ids = query.depart_ids ? query.depart_ids.split(',').map(it => +it) : [];
		const echelon_ids = query.echelon_ids ? query.echelon_ids.split(',').map(it => +it) : [];
		return {
			search: {
				search: '',
				depart_id: depart_ids[depart_ids.length - 1] || '',
				echelon_id: query.echelon_ids ? query.echelon_ids.split(',').map((v) => Number(v)) : [],
				user_source: '',
				search_course_id: '',
				course_id: query.course_id || 0,
				...query,
				depart_ids,
				echelon_ids
			},
			course_id: query.course_id || '0',
			project_id: this.$route.query.project_id,
			show: false,
			method: '',
			userSourceList: [
				{
					id: 1,
					label: '按梯队选'
				}, {
					id: 2,
					label: '按组织选'
				}, {
					id: 3,
					label: '线上报名'
				}, {
					id: 4,
					label: '链接报名'
				}, {
					id: 5,
					label: '手机签到'
				}
			],
			echelon: [],
			participator_id: [],
			label: '',
			relation_id: '',
			relation_type: '',
		};
	},
	computed: {
		type() {
			return this.$store.state.hrAcademyTrainDetailParticipate0Roster.type;
		},
	},
	watch: {
		'search.depart_ids': function (val) {
			this.search.depart_id = val[val.length - 1] || '';
		},
		'search.echelon_ids': function (val) {
			this.search.echelon_id = val[val.length - 1] || '';
		},
	},
	beforeCreate() {
		this.Button = Button;
	},
	methods: {
		// 选择关联事项与添加人员方式
		handleSelect(e) {
			PModalRetatedMatter.popup({ type: 'participate' }).then(res => {
				this.label = res.label;
				this.relation_id = res.relation_id;
				this.relation_type = res.relation_type;
				if (e == '2') {
					ChooseStaff.popup({ members: this.participator_id }).then((re) => {
						this.participator_id = re;
						this.handleAddParticipator();
					}).catch(() => {
					});
				} else {
					ModalProject.popup({ }).then((re) => {
						this.echelon = re;
						this.handleAddParticipator();
					}).catch(() => {
					
					});
				}
			});
		},
		// 添加参与人员
		handleAddParticipator() {
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_PARTICIPATOR_ADD_POST,
				type: "POST",
				param: {
					project_id: this.$route.query.project_id,
					course_ids: this.relation_id,
					echelon: this.echelon,
					participator_ids: this.participator_id.map(v => v.staff_id)
				},
				loading: false,
			}).then(res => {
				this.participator_id = [];
				this.echelon = [];
				this.$Message.success('添加成功');
				this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_LIST_INIT');
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/detail/participate/0/roster', 
				{
					...this.$route.query,
					...this.search,
					course_id: this.$route.query.course_id
				}
			));
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_LIST_INIT');
		}, 300),
		handleRelatedMaster() {
			PModalRetatedMatter.popup({ type: 'participate' }).then(res => {
				this.formData.label = res.label;
				this.formData.relation_id = res.relation_id;
				this.formData.relation_type = res.relation_type;
			});
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		// 导出
		handleExport: lodash.debounce(function () {
			const { query = {} } = this.$route;
			window.open(getHashUrl(API_ROOT._HR_ACADEMY_TRAIN_PARTICIPATOR_EXPORT_GET, {
				...query,
				course_id: Number(query.course_id) ? query.course_id : '',
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		}, 300)
	}
};

</script>

<style lang="scss" scoped>

</style>
