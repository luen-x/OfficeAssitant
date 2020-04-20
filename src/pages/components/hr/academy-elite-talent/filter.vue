<template>
	<div class="v-hr-train-elite-talent-filter">
		<div>
			<i-input
				v-model="param.keyword" 
				placeholder="请输入姓名或手机号码搜索" 
				clearable
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
			<i-dropdown 
				class="g-red-btn-line g-fr g-m-l-10" 
				transfer
				@on-click="handleItemClick">
				<span href="javascript:void(0)">
					更多
					<i-icon 
						size="16" 
						type="ios-arrow-down"
						style="vertical-align: text-top" />
				</span>
				<i-dropdown-menu slot="list">
					<i-dropdown-item name="1">
						<vc-upload
							accept=".xlsx, .xls"
							@begin="handleBegin"
							@complete="handleComplete"
							@file-before="handleFileBefore"
							@file-start="handleFileStart"
							@file-error="handleError"
							@file-success="handleFileSuccess"
							@file-progress="handleFileProgress"
						>
							<div>导入&nbsp;&nbsp;</div>
							<i-icon v-if="importStatus.status == 1" class="g-c-blue-light ivu-load-loop" type="ios-loading" />
						</vc-upload>
					</i-dropdown-item>
					<i-dropdown-item name="2">导出</i-dropdown-item>
					<i-dropdown-item name="3">下载导入模板</i-dropdown-item>
				</i-dropdown-menu>
			</i-dropdown>
			<vc-debounce-click 
				v-if="$auth[1087]"
				class="g-red-btn-line g-fr"
				@click="handleAddStaff">添加员工</vc-debounce-click>
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
		>
			<div 
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-select 
					v-model="param.position_id"
					placeholder="请选择职位"
					style="width: 220px" 
					class="g-m-r-5"
					clearable
					@on-change="handleSearch"
				>
					<i-option
						v-for="position in positionList"
						:key="position.position_id"
						:value="+position.position_id">{{ position.position_name }}</i-option>
				</i-select>

				<i-input-number
					v-if="echelon_id !== 3"
					v-model="param.start_seniority"
					:number="true"
					:min="0"
					transfer
					clearable
					placeholder="请输入工龄最小月"
					style="width: 220px; margin-right: 5px"
					@on-change="handleChange"/>

				<i-input-number
					v-if="echelon_id !== 3"
					v-model="param.end_seniority"
					:number="true"
					:min="0"
					transfer
					clearable
					placeholder="请输入工龄最大月"
					style="width: 220px" 
					class="g-m-r-10"
					@on-change="handleChange"/>

				<i-date-picker 
					v-if="echelon_id !== 3"
					v-model="param.start_time" 
					style="width: 220px;"
					class="g-m-r-5 g-m-l-5"
					type="month" 
					transfer
					clearable
					placeholder="请选择开始月份"
					@on-change="handleSearch"
				/>

				<i-date-picker 
					v-if="echelon_id !== 3"
					v-model="param.end_time" 
					style="width: 220px"
					class="g-m-r-5" 
					type="month" 
					transfer
					clearable
					placeholder="请选择结束月份"
					@on-change="handleSearch"
				/>

				<i-select 
					v-if="echelon_id !== 3"
					v-model="param.more_echelon"
					placeholder="是否有标注"
					style="width: 220px" 
					class="g-m-r-5"
					clearable
					@on-change="handleSearch"
				>
					<i-option :value="1">有</i-option>
					<i-option :value="2">无</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker, InputNumber, Dropdown, DropdownMenu, DropdownItem, Icon } from 'iview';
import { Expand, Upload } from 'wya-vc';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import { OSS_TEMPLATE_FILE02 } from '@constants/constants';
import { AddStaff } from './popup/add-staff';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-input-number': InputNumber,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'i-icon': Icon,
		"vc-upload": Upload
	},
	data() {
		const { query = {} } = this.$route;
		return {
			positionList: [],
			param: {
				keyword: query.keyword || '',
				position_id: Number(query.position_id) || '',
				more_echelon: Number(query.more_echelon || 0),
				start_seniority: Number(query.start_seniority) || null,
				end_seniority: Number(query.end_seniority) || null,
				start_time: query.start_time || '',
				end_time: query.end_time || ''
			},
			show: false
		};
	},
	computed: {
		echelon_id() {
			return +this.$route.query.echelon_id;
		},
		importStatus() {
			return this.$store.state.hrAcademyEliteTalent.importStatus;
		}
	},
	created() {
		this.loadPositionData();
	},
	methods: {
		handleSearch(event) {
			if (this.param.start_seniority 
				&& this.param.end_seniority 
				&& this.param.start_seniority > this.param.end_seniority) {
				this.$Message.error('工龄最大月需要大于工龄最小月奥~');
				return;
			}
			this.$router.replace(getHashUrl(
				'/hr/academy/elite/talent', 
				{ 
					...this.$route.query, 
					...this.param,
					start_time: this.param.start_time && moment(this.param.start_time).format("YYYY-MM"),
					end_time: this.param.end_time && moment(this.param.end_time).format("YYYY-MM")
				}
			));
			this.$store.commit('HR_ACADEMY_ELITE_TALENT_LIST_INIT');
		},
		loadPositionData() {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: 'GET',
				loading: false
			}).then(({ data }) => {
				this.positionList = data
					.filter(v => v.depart_id == this.$route.query.depart_id)[0].positions
					.map(v => {
						Number(v.position_id);
						return v;
					});
			});
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleChange(v) {
			if (v === null) {
				this.handleSearch();
			}
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleItemClick(name) {
			if (name == '2') {
				this.hanldeExport();
			} else if (name == '3') {
				this.handleExportModel();
			}
		},
		hanldeExport() {
			window.open(getHashUrl(API_ROOT.HR_ACADEMY_ELITE_TALENT_LIST_GET, {
				...this.$route.query,
				export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
		handleExportModel() {
			window.open(OSS_TEMPLATE_FILE02);
		},
		handleAddStaff() {
			AddStaff.popup({
				depart_id: this.$route.query.depart_id
			}).then(res => {
				let selectData = res.reduce((init, cur) => {
					init.staff_names.push(cur.staff_name);
					init.staff_ids.push(cur.staff_id);
					return init;
				}, { staff_ids: [], staff_names: [] });
				ModalTip.popup({
					content: `确定将${selectData.staff_names.join('、')}添加到“${this.$route.query.echelon_name}”中吗？`
				}).then(resp => {
					this.$request({
						url: API_ROOT._HR_ACADEMY_ELITE_TALENT_ADD_STAFF_POST,
						type: "POST",
						param: {
							echelon_id: this.$route.query.echelon_id,
							stage_id: this.$route.query.stage_id,
							staff_ids: selectData.staff_ids
						}
					}).then(response => {
						this.$store.commit('HR_ACADEMY_ELITE_TALENT_LIST_INIT');
						this.$Message.success(response.msg);
					}).catch(error => {
						this.$Message.error(error.msg);
					});
				});
			});
		},
		handleBegin() {},

		handleComplete(file, f2) {
		},
		handleFileBefore(file) {
			const index = file.name.lastIndexOf('.');
			const name = file.name.substring(0, index);
			const end = file.name.substring(index);
			let pattern = /^[\u4e00-\u9fa5a-zA-Z0-9\\\\(\\\\)（）-]+$/;
			if (name.includes(' ')) {
				this.$Message.error("文件名不能包含空格");
				return false;
			} else if (!pattern.test(name)) {
				this.$Message.error("文件名只能包含中英文、数字、括号、中横线");
				return false;
			} else if ((end !== '.xlsx' && end !== '.xls')) {
				this.$Message.error("只支持.xls、.xlsx格式的文件");
				return false;
			} else {
				return true;
			}
			
		},
		handleFileStart() {
		},
		handleFileSuccess(res, file) {
			this.file = [res.data];
			this.handleSubmit();
		},
		handleFileProgress(percent) {
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleSubmit() {
			this.$request({
				url: API_ROOT._HR_ACADEMY_ELITE_TALENT_INPUT_DATA_POST,
				param: {
					oss_file_name: this.file[0].url
				}
			}).then(res => {
				this.$store.commit('HR_ACADEMY_ELITE_TALENT_PERCENT_UPDATE', { status: 1, percent: 0 });
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
	}
};

</script>

<style lang="scss" scoped>
.v-hr-train-elite-talent-filter {
	margin: 20px 0;
}
</style>
