<template>
	<div class="v-hr-recruit-paper-edit">
		<div class="g-flex g-jc-c g-ai-c g-relative g-pd-10 g-m-20">
			<span v-if="visible">
				<span 
					class="g-fs-16 g-c-black1"
				>
					{{ paperTheme }}
				</span>
				<i 
					class="icon iconfont icon-edit g-fs-16 g-c-blue-mid g-m-l-10 g-pointer"
					style="font-weight: bold;"
					@click="handleEditTheme"
				/>
			</span>
			<i-input 
				v-else
				v-model="paperTheme" 
				:maxlength="20"
				clearable 
				placeholder="请输入试卷主题" 
				style="width: 300px;"
			/>
			<i-button 
				v-if="$route.query.paper_id"
				class="_btn" 
				@click="handleImport"
			>
				导入
			</i-button>
		</div>
		<i-tabs 
			:value="tabs"
			:animated="false"
			:before-tab-change="handleBeforeTabChange" 
			type="card"
			class="g-tabs-card g-m-lr-20"
			@on-click="handleTabChange"
		>
			<i-tab-pane label="维度" name="dimensions">
				<keep-alive>
					<oa-paper-dimension 
						v-if="tabs === 'dimensions'"
						ref="dimensions"
						:paper-theme="paperTheme"
						:dimensions="dimensions"
						@reload="loadData"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="题目" name="questions">
				<keep-alive>
					<oa-paper-question 
						v-if="tabs === 'questions'"
						ref="questions"
						:paper-theme="paperTheme"
						:questions="questions"
						@reload="loadData"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="结果" name="results">
				<keep-alive>
					<oa-paper-result 
						v-if="tabs === 'results'"
						ref="results"
						:paper-theme="paperTheme"
						:results="results"
						@reload="loadData"
					/>
				</keep-alive>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Input, Button, TabPane, Tabs } from 'iview';
import { cloneDeep } from 'lodash';
import { RecruitPaperDimension } from './dimension';
import { RecruitPaperQuestion } from './question';
import { RecruitPaperResult } from './result';
import { RecruitPaperImport } from './popup/import';

// const Tabs = require('iview/dist/iview.min.js').Tabs;

// const MyTabs = cloneDeep(Tabs);
// MyTabs.methods.handleChange = function (index) {
// 	if (this.transitioning) return;
// 	this.transitioning = true;
// 	setTimeout(() => this.transitioning = false, 300);
// 	const nav = this.navList[index];
// 	if (nav.disabled) return;
// 	if (this.beforeTabChange) {
// 		this.beforeTabChange(nav.name, this.activeKey).then(() => {
// 			this.activeKey = nav.name;
// 			this.$emit('input', nav.name);
// 			this.$emit('on-click', nav.name);
// 		}).catch((err) => err && console.error(err));
// 	} else {
// 		this.activeKey = nav.name;
// 		this.$emit('input', nav.name);
// 		this.$emit('on-click', nav.name);
// 	}
// };
// MyTabs.props.beforeTabChange = Function;
// MyTabs.name = 'MyTabs';

export default {
	name: 'oa-recruit-paper-edit',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		'oa-paper-dimension': RecruitPaperDimension,
		'oa-paper-question': RecruitPaperQuestion,
		'oa-paper-result': RecruitPaperResult
	},
	data() {
		const { query = {} } = this.$route;
		return {
			visible: query.action === 'update',
			tabs: 'dimensions',
			paperTheme: '',
			dimensions: [],
			questions: [],
			results: []
		};
	},
	mounted() {
		if (this.$route.query.paper_id) {
			this.visible = true;
			this.loadData();
		} else {
			this.visible = false;
		}
	},
	methods: {
		loadData(is_update) {
			if (is_update) this.visible = true;
			
			this.$request({
				url: '_HR_RECRUIT_SCHOOL_PAPER_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: {
					paper_id: this.$route.query.paper_id
				},
				autoTip: false
			}).then(res => {
				this.paperTheme = res.data.paper_theme;
				this.dimensions = res.data.dimensions;
				this.questions = res.data.questions;
				this.results = res.data.results;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		formatArray(list, name) {
			if (name === 'dimensions') {
				list = list.map(it => ({
					dimension_id: it.dimension_id,
					dimension_name: it.dimension_name,
					total_score: it.total_score
				}));
			} else if (name === 'questions') {
				list = list.map(it => ({
					question_id: it.question_id,
					title: it.title,
					option: it.option.map(_it => ({
						option_id: _it.option_id,
						option_name: _it.option_name,
						dimension_id: _it.dimension_id,
						score: _it.score
					}))
				}));
			} else {
				list = list.map(it => ({
					result_id: it.result_id,
					test_result: it.test_result,
					external_explain: it.external_explain,
					match_progress: it.match_progress,
					inner_conclusion: it.inner_conclusion,
					priority: it.priority,
					result_dimensions: it.dimensions.map(_it => ({
						record_id: _it.record_id,
						dimension_id: _it.dimension_id,
						score: _it.score
					}))
				}));
			}
			return list;
		},
		async handleBeforeTabChange(nextTab, lastTab) {
			let last = this.$refs[lastTab][lastTab];
			let curr = this.$refs[lastTab].formData[lastTab];
			if (lastTab === 'questions') curr = this.formatArray(curr, lastTab);
			if (lastTab === 'results') curr = curr.map(it => ({ ...it, match_progress: it.match_progress * 2 }));
			last = this.formatArray(last, lastTab);
			if (JSON.stringify(last) !== JSON.stringify(curr)) {
				const result = await this.$refs[lastTab].handleSave();
				if (result) {
					return Promise.resolve();
				} else {
					return Promise.reject();
				}
			} else {
				return Promise.resolve();
			}
		},
		handleTabChange(name) {
			this.tabs = name;
			if (name !== 'dimensions') {
				this.$nextTick(() => {
					this.$refs[name].loadDimensionList();
				});
			}
		},
		handleImport() {
			RecruitPaperImport.popup({
				paperId: this.$route.query.paper_id
			}).then(() => {
				this.loadData();
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleEditTheme() {
			this.visible = !this.visible;
		}
	},
};
</script>

<style lang="scss">
.v-hr-recruit-paper-edit {
	._btn {
		position: absolute;
		border-color: #e84854;
		color: #e84854;
		top: 0;
		right: 0;
		&:hover {
			background-color: #e84854!important;
			color: #fff!important;
		}
	}
}
</style>
