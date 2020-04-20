<template>
	<div class="v-academy-train-detail-basic-info">
		<oa-edit v-if="isEdit" :datas="data" @handleEditChange="handleToggleEdit" @handleEditSuccess="handleSuccess"/>
		<oa-detail v-if="!isEdit" :datas="data" @handleEditChange="handleToggleEdit"/>
		<oa-title class="g-m-b-20">
			<template slot="title">
				课程详情列表
			</template>
		</oa-title>
		<div>
			<i-input
				v-model="search.search" 
				clearable
				class="g-m-r-5"
				placeholder="请输入课程名称进行搜索" 
				style="width: 220px" 
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-select 
				v-model="search.method"
				class="g-m-r-5"
				placeholder="请选择授课方式"
				clearable
				transfer
				style="width: 220px;"
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item, index) in methodList"
					:key="index"
					:value="item.id"
				>
					{{ item.label }}
				</i-option>
			</i-select>
			<i-datepicker
				v-model="time"
				class="g-m-r-5"
				type="daterange"
				split-panels
				style="width: 220px"
				placeholder="请选择授课时间"
				transfer
				@on-change="handleDateChange($event, 'time')"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
			<div class="g-fr">
				<vc-debounce-click
					v-if="tableList.length < 10"
					class="g-red-btn-line g-m-r-5"
					@click="handleAdd">
					+新增课程
				</vc-debounce-click>
			</div>
		</div>
		<div class="_list g-m-t-20 _table">
			<i-table 
				
				ref="tableTarget" 
				:columns="columns"
				:data="tableList"
				stripe
				@on-selection-change="handleSelectChange"
			/>
		</div>
		<div class="_detail-footer">
			<div class="__content">
				<i-checkbox
					v-model="isAll"
					@on-change="handleSelectAll(isAll)"
				>
					全选
				</i-checkbox>
				<i-button @click="handleDelete">删除</i-button>
			</div>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button, Select, Option, DatePicker, Table, Checkbox, Message } from 'iview';
import { Expand } from 'wya-vc';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import { getParseUrl, getHashUrl } from '@utils/utils';
import Edit from './edit.vue';
import Detail from './detail.vue';
import item from './item';
import Title from '../academy-train-detail/_common/title';


export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-datepicker': DatePicker,
		'i-table': Table,
		'i-checkbox': Checkbox,
		'oa-title': Title,
		'oa-edit': Edit,
		'oa-detail': Detail
	},
	mixins: [item],
	data() {
		const { query = {} } = this.$route;
		return {
			search: {
				search: String(query.search || ''),
				method: Number(query.method || ''),
			},
			time: [],
			method: '',
			show: false,
			data: {},
			isEdit: false,
			isAll: false,
			selected: []
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.loadData();
		this.loadDetailData();
	},
	methods: {
		// 时间改变
		handleDateChange(val, name) {
			this.search[`start_${name}`] = val[0];
			this.search[`end_${name}`] = val[1];
			// }
			this.handleSearch();
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/detail/basic/0/info', 
				{ 
					...this.search,
					project_id: this.$route.query.project_id
				}
			));
			this.loadData();
		}, 300),
		loadDetailData() {
			let { query = {} } = getParseUrl();
			return this.$request({
				url: '_HR_ACADEMY_TRAIN_DETAIL_BASIC_0_INFO_LIST_GET',
				type: 'GET',
				param: {
					...query,
				},
			}).then((res) => {
				this.data = res.data;
				this.data.echelon_id = res.data.type == 2 ? [res.data.echelon_id] : [];
			}).catch((error) => {
				console.error(error);
			});
		},
		loadData() {
			let { query = {} } = getParseUrl();
			return this.$request({
				url: '_HR_TRAIN_COURSE_LIST_GET',
				type: 'GET',
				param: {
					...query,
				},
			}).then((res) => {
				this.tableList = res.data.list;
			}).catch((error) => {
				console.error(error);
			});
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleToggleEdit() {
			this.isEdit = !this.isEdit;
		},
		handleSuccess() {
			this.isEdit = !this.isEdit;
			this.loadDetailData();
		},
		handleAdd() {
			if (this.tableList.length == 10) {
				this.$Message.warning('添加课程不能超过十个');
			} else {
				this.$router.push(getHashUrl(
					'/hr/academy/train/arrangement/add', 
					{ 
						...this.$route.query,
						number: this.tableList.length
					}
				));
			}
		},
		handleSelectChange(val) {
			this.selected = val;
			if (this.selected.length == 0) {
				this.isAll = false;
			}
			if (this.selected.length == this.tableList.length) {
				this.isAll = true;
			}
		},
		handleSelectAll(val) {
			this.$refs.tableTarget.selectAll(val);
		},
		handleDelete() {
			if (!this.selected.length) {
				Message.warning('请先选择要删除的课程');
				return;
			}
			let course_name = this.selected.filter(v => v.participator_count !== 0).map(v => v.course_name).join(',');
			ModalTip.popup({
				title: '删除课程',
				content: course_name
				 ? `创建的活动${course_name}已有人参加，删除后的课程会放入到"课程回收站"中，确认删除吗？`
				 : '删除后将无法恢复，确定要删除吗？？'
			}).then(res => {
				this.request({
					url: '_HR_TRAIN_PROJECT_COURSE_DELETE_POST',
					type: "POST",
					param: {
						course_ids: this.selected.map(e => e.course_id)
					},
					loading: false
				}).then((re) => {
					this.$Message.success(`删除成功`);
					this.loadData();
				}).catch((error) => {
					this.$Message.error(error.msg);
				});
			});
		}
	}
};

</script>

<style lang="scss" scoped>
.v-academy-train-detail-basic-info {
	padding-bottom: 100px;
	._table {
		line-height: 1.15;
	}
	._detail-footer {
		display: flex;
		justify-content: space-between;
		position: fixed;
		height: 45px;
		bottom: 0;
		right: 0;
		width: calc(100% - 340px) !important;
		padding: 10px 10px 10px 36px;
		background: #fff;
		-webkit-box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		z-index: 900;
		align-items: center;
		.__content {
			box-sizing: border-box;
		}
	}
}
</style>
