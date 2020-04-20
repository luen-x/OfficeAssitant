<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<div slot="extra" class="g-tr g-pd-lr-10 g-pd-t-5 g-pd-b-5" style="margin-bottom: -15px;"> 
			<span class="_split-bar"/>
			<span class="g-operation-hover" @click="handleSelectTitle" >选择表头</span> 
		</div>
		<i-tab-pane 
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="item.label + listInfo.count[index]"
			:name="item.value"
		>
			<vc-paging
				:ref="'talbe' + item.value"
				:columns="columns[item.value]"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: true}"
				class="v-hr-academy-statistic-course-list"
				mode="table"
				@row-click="handleOpenDrawer"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
			>
				<div v-if="type == '2'" slot="extra" class="g-flex-ac">
					<i-checkbox
						v-if="type == '1' || type == '2'"
						v-model="isAll"
						@on-change="handleIsAll">
						全选
					</i-checkbox>
					<i-button v-if="$auth[1083]" class="g-m-r-5" @click="handleBatchAudit">恢复</i-button>
					<i-button v-if="$auth[1084]" class="g-m-r-5" @click="handleDelete">彻底删除</i-button>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import { Tabs, TabPane, Button, Checkbox, Message } from 'iview';
import { Paging } from 'wya-vc';
import { autoFix } from '@extends/mixins/auto-fix';
import { tableHeight } from '@extends/mixins/tableHeight';
import API_ROOT from "@stores/apis/root";
import checkAll from '@extends/mixins/checkAll';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { TableTitle } from "@components/_common/table-title/table-title";
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-button': Button,
		'i-checkbox': Checkbox,
	},
	mixins: [
		item, 
		checkAll,
		tableHeight({ tab: false, extra: 70 }),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: this.$auth[1082] ? [
				{ label: '培训课程', value: '1' }, 
				{ label: '课程回收站', value: '2' } 
			] : [{ label: '培训课程', value: '1' }],
			firstIn: true,
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyStatisticCourse.listInfo;
		}
	},
	created() {
		this.$store.commit('HR_ACADEMY_STATISTIC_COURSE_SELECTED_TAB', this.type);
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_STATISTIC_COURSE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/hr/academy/statistic/course');
			}).catch((error) => {
				console.error(error);
			});
		},
		handleIsAll(val) {
			this.$refs['talbe' + this.type][0].$refs.tableTarget.selectAll(val);
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/academy/statistic/course', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_ACADEMY_STATISTIC_COURSE_LIST_INIT');
		},

		loadTableTitle(type) {
			return this.$request({
				url: "_HR_ACADEMY_COURSE_TABLE_TITLE_GET",
				type: "GET",
				param: {
					type: type || '1',
					table_type: 5
				},
				loading: false,
			}).then(res => {
				this.$store.commit('HR_ACADEMY_STATISTIC_COURSE_TITLE_CHANGE', { ...res.data, type: type || '1' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},

		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrAcademyStatisticCourse.title[this.type];

			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_ACADEMY_COURSE_TABLE_TITLE_SAVE_POST',
				mutation: 'HR_ACADEMY_STATISTIC_COURSE_TITLE_CHANGE',
				type: this.type,
				params: {
					table_type: 5
				}
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit('hr-academy-statistic-course-change', { type: this.type });
				this.$store.commit("HR_ACADEMY_STATISTIC_COURSE_LIST_INIT", {
					type: this.type
				});
			}).catch(err => {
			});
		},
		handleDelete() {
			if (!this.selected.length) {
				Message.warning('请先选择要删除的信息');
				return;
			}
			const courseIds = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.course_id);
				return initVal;
			}, []);
			ModalTip.popup({
				title: '彻底删除',
				content: '删除后无法恢复，确定要删除吗？请注意备份，谨慎操作！'
			}).then(res => {
				this.$request({
					url: API_ROOT._HR_ACADEMY_STATISTIC_STUDY_DELETE_POST,
					param: {
						course_ids: courseIds
					},
					type: "POST"
				}).then(resp => {
					this.$store.commit('HR_ACADEMY_STATISTIC_COURSE_LIST_INIT');
					this.$Message.success(resp.msg);
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			});
		},
		handleBatchAudit() {
			if (!this.selected.length) {
				Message.warning('请先选择要恢复的信息');
				return;
			}
			let project_course = [];
			this.selected.forEach(v => {
				project_course.push({
					project_id: v.project_id,
					course_id: v.course_id
				});
			});
			ModalTip.popup({
				title: '恢复',
				content: '恢复后，课程将进入到原来的项目中，并可以在“培训课程”中查看到（不恢复到课程表中）'
			}).then(res => {
				this.$request({
					url: API_ROOT._HR_ACADEMY_STATISTIC_STUDY_RECOVERY_POST,
					param: {
						project_course
					},
					type: "POST"
				}).then(resp => {
					this.$store.commit('HR_ACADEMY_STATISTIC_COURSE_LIST_INIT');
					this.$Message.success(resp.msg);
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			});
		},
	}
};

</script>

<style lang="scss" scope>
._split-bar {
	position:relative;
	display:inline-block;
	margin: 0 10px;
	width:1px;
	height:12px;
	background:rgba(232,232,232,1);
	top:2px
}
</style>
