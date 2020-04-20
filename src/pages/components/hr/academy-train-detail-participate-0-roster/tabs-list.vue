<template>
	<div class="academy-train-detail-participate-roster-tabs">
		<i-tabs 
			v-if="tabs.length > 1"
			:value="course_id" 
			:animated="false"
			type="card" 
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<i-tab-pane 
				v-for="(item) in tabs"
				:key="item.course_id"
				:label="item.nick_name" 
				:name="item.course_id + ''"
			>
				<div v-if="item.course_id !== '0'" class="g-m-b-10">
					<span class="g-c-black4">课程名称：</span>
					<span class="g-m-r-30 g-c-black1">{{ item.course_name }}</span>
					<span class="g-c-black4">授课地点：</span>
					<span class="g-m-r-30 g-c-black1">{{ item.position }}</span>
					<span class="g-c-black4">授课时间：</span>
					<span class="g-m-r-30 g-c-black1">{{ item.start_time }} 至 {{ item.end_time }}</span>
					<span class="g-c-black4">授课讲师：</span>
					<span class="g-m-r-30 g-c-black1">{{ item.lecture.map(res => {return res.staff_name}).join(',') }}</span>
				</div>
				<vc-paging
					ref="tableTarget"
					:columns="getColumns"
					:show="item.course_id == course_id" 
					:type="item.course_id"
					:data-source="listInfo[item.course_id].data"
					:total="listInfo[item.course_id].total"
					:reset="listInfo[item.course_id].reset"
					:current.sync="current[item.course_id]"
					:history="true"
					:load-data="loadData"
					class="v-hr-academy-train-detail-participate-0-roster-list"
					mode="table"
					@page-change="handlePageChange"
					@page-size-change="handleChangePageSize"
					@selection-change="handleSelectionChange"
				>
					<div slot="extra" class="g-flex-ac">
						<i-checkbox
							v-if="tabs.length > 1"
							v-model="isAll"
							@on-change="handleIsAll"
						>
							全选
						</i-checkbox>
						<i-button
							class="g-m-r-10"
							@click="handleDelete"
						>
							删除
						</i-button>
						<i-button 
							v-if="course_id !== '0'" 
							class="g-m-r-10"
							@click="handleChangeStatus(1)"
						>
							设为必修
						</i-button>
						<i-button 
							v-if="course_id !== '0'" 
							class="g-m-r-10"
							@click="handleChangeStatus(2)"
						>
							设为选修
						</i-button>
						<i-button 
							v-if="course_id !== '0'" 
							class="g-m-r-10"
							@click="handleChangeStatus(3)"
						>
							设为内训
						</i-button>
					</div>
				</vc-paging>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button, Message } from 'iview';
import { Paging } from 'wya-vc';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import checkAll from '@extends/mixins/checkAll';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item, checkAll],
	data() {
		const { query } = this.$route;

		return {
			course_id: String(query.course_id || "0"), // 同tabs下的value
			type: this.course_id || this.$route.query.course_id + '',
			current: {},
			tabs: [
				{
					nick_name: '全部',
					course_id: '0'
				}
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyTrainDetailParticipate0Roster.listInfo;
		},
	},
	watch: {
		course_id(newVal, oldVal) {
			this.type = newVal + '';
		},
	},
	created() {
		this.loadTabsData().then(() => {
			this.$route.query.course_id ? this.handleChange(this.$route.query.course_id + '') : this.handleChange('0'); 
		});
	},
	methods: {
		typeIndex() {
			let type = '';
			this.tabs.forEach((v, index) => {
				if (v.course_id == this.course_id) {
					type = index;
				}
			});
			return +type;
		},
		loadTabsData() {
			return this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_TABS_GET,
				type: 'GET',
				param: {
					project_id: this.$route.query.project_id
				},
				loading: false
			}).then((res) => {
				let tabTemp = this.tabs;
				this.tabs = res.data;
				this.tabs.unshift(tabTemp[0]);
				this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_TABS_GET', { tabs: this.tabs });
			}).catch((error) => {
				console.error(error);
			});
		},
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_LIST_GET',
				type: 'GET',
				param: {
					...query,
					course_id: this.course_id,
					page,
					pageSize
				},
			}).then((res) => {
				
				this.type = this.course_id + '';
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(course_id) {
			this.course_id = course_id;
			this.isAll = false;
			this.handleIsAll(false);
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			let type = '';

			this.tabs || this.tabs.forEach((v, index) => {
				if (v.course_id == this.course_id) {
					type = index;
				}
			});
			this.type = type + '';
			query = {
				...query,
				course_id: this.course_id,
				page: this.current[type],
			};
			this.$router.replace(getHashUrl('/hr/academy/train/detail/participate/0/roster', { ...query }));
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_LIST_INIT');
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_SELECTED_TAB', course_id);
		},
		handleIsAll(val) {
			let type = '';
			if (this.tabs.length) {
				this.tabs.forEach((v, index) => {
					if (v.course_id == this.course_id) {
						type = index;
					}
				});
				this.type = this.course_id + '';
				this.$refs.tableTarget[type].$refs.tableTarget.selectAll(val);
			}
			
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_LIST_INIT');
		},
		handleDelete() {
			if (!this.selected.length) {
				Message.warning('请先选择要删除的人员');
				return;
			}
			const recordIds = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.participator_id);
				return initVal;
			}, []);
			ModalTip.popup({
				title: '删除课程',
				content: '删除后将无法恢复，确定要删除吗？'
			}).then(res => {
				this.request({
					url: '_HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_DELETE_POST',
					type: "POST",
					param: {
						participator_id: this.selected.map(e => e.participator_id),
						project_id: this.$route.query.project_id,
						course_id: Number(this.$route.query.course_id) ? this.$route.query.course_id : ''
					},
					loading: false
				}).then((re) => {
					this.$Message.success(`删除成功`);
					this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_LIST_INIT');
				}).catch((error) => {
				});
			});
		},
		handleChangeStatus(status) {
			if (!this.selected.length) {
				Message.warning('请先选择要变更的信息');
				return;
			}
			const participatorIds = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.participator_id);
				return initVal;
			}, []);
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_SCHEDULE_CLASS_CHANGE_POST,
				param: { 
					study_type: status,
					participator_id: participatorIds
				},
				type: "POST"
			}).then(res => {
				Message.success('修改成功！');
				this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_LIST_INIT');
			}).catch(err => this.$Message.error(err.msg));
		},
	}
};

</script>

<style lang="scss">
.academy-train-detail-participate-roster-tabs {
	.__footer {
		width: calc(100% - 340px) !important;
	}
}
</style>
