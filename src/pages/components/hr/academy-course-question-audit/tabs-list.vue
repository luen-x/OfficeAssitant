<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item) in tabs"
			:key="item.value"
			:label="item.label+count[+item.value-1]" 
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="getColumns(type)"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: true}"
				class="v-hr-academy-course-question-audit-list"
				mode="table"
				@row-click="handleOpenDrawer"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
			> 
				<div v-if="$auth[1055]||$auth[1056]" slot="extra" class="g-flex-ac">
					<i-checkbox 
						v-if="(type==1 && $auth[1055]) || ((type==2 || type==4) && $auth[1056])"
						v-model="isAll" 
						@on-change="handleIsAll"
					>
						全选
					</i-checkbox>
					<i-button v-if="type==1 && $auth[1055]" class="g-m-l-5" @click="handleAudit(selected)">批量审核</i-button>
					<i-button v-if="type==2 && $auth[1056]" class="g-m-l-5" @click="handleAddToStore">加入题库</i-button>
					<template v-if="type==4 && $auth[1056]">
						<i-button v-if="type!=3" class="g-m-l-5" @click="handleSetScore">设置分值</i-button>
						<i-button class="g-m-l-5" @click="handleRemove">移出题库</i-button>
						<i-button class="g-m-l-5" @click="handleRelative">关联课题</i-button>
					</template>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { Confirm } from '@common/confirm/confirm';
import { SetScore } from '../_common/academy-course/modals/set-score';
import { SetSubject } from '../_common/academy-course/modals/set-subject';
import { tableHeight } from '../_common/academy-course/components/tableHeight';



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
	mixins: [item, checkAll, tableHeight({ extra: -10 })],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '待审核', value: '1' }, 
				{ label: '已通过', value: '2' }, 
				{ label: '未通过', value: '3' }, 
				{ label: '已入题库', value: '4' }
			],
			count: [0, 0, 0, 0]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyCourseQuestionAudit.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			this.isAll = false;
			this.selected = [];
			return this.request({
				url: 'HR_ACADEMY_COURSE_QUESTION_AUDIT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = [
					res.data.await_audit_count, 
					res.data.pass_count, 
					res.data.not_pass_count, 
					res.data.library_count
				];
			}).catch((error) => {
				error && console.error(error);
			});
		},
		handleChange(type) {
			this.handleIsAll(false);
			this.isAll = false;
			this.type = type;
			
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/academy/course/question/audit', { ...query }));
		},
		handleChangePageSize() {
			this.handleResetFirst();
		},
		handleIsAll(val) {
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},
		handleAddToStore() {
			if (this.selected.length == 0) {
				this.$Message.error("请先选择题目");
				return;
			}
			this.$request({
				url: "_HR_ACADEMY_COURSE_QUESTION_ADD_TO_LIBRARY_POST",
				type: "POST",
				param: {
					question_id: this.selected.map(que => que.question_id)
				},
				loading: false,
			}).then(res => {
				this.handleResetCur();
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleSetScore() {
			if (!this.selected.length) {
				this.$Message.error('请先选择题目');
				return;
			}
			SetScore.popup({ questions: this.selected, type: 2 }).then(() => {
				this.handleResetCur();
			}).catch(() => {});
		
		},
		handleRelative() {
			if (this.selected.length == 0) {
				this.$Message.error("请先选择题目");
				return;
			}
			SetSubject.popup({ questionIds: this.selected.map(que => que.question_id) }).then(() => {
				this.handleResetCur();
			}).catch(() => {});
		},
		handleRemove() {
			if (this.selected.length == 0) {
				this.$Message.error("请先选择题目");
				return;
			}
			Confirm.popup({
				msg: "确定移出题库吗？"
			}).then(() => {
				this.$request({
					url: "_HR_TRAIN_LIBRARY_QUESTION_DELETE_POST",
					type: "POST",
					param: {
						type: 2,
						question_id: this.selected.map(que => que.question_id)
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});

			}).catch(() => {

			});
		}
	}
};

</script>

<style lang="scss">

</style>
