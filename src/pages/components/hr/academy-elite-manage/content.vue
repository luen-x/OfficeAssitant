<template>
	<div class="c-academy-elite-manage-tree">
		<div class="_desc g-c-black3">
			<ul>
				<li>• 拖动课题可以调整顺序；</li>
				<li>• 点击底部“保存”按钮，修改内容才会生效；</li>
				<li>• 需先创建人才梯队，才能设置其下面的课题，删除人才梯队后，下面的课题也会删除，请谨慎操作！</li>
			</ul>
		</div>

		<div class="_search">
			<i-input
				v-model="search"
				placeholder="请输入关键字"
				clearable
				style="width: 300px"
				@on-change="handleChange"
				@on-enter="handleSearch"
			/>
			<i-button 
				type="primary" 
				class="g-red-btn-small g-m-l-5"
				@click="handleSearch">搜索</i-button>
		</div>

		<div class="_tree">
			<i-tree :data="data"/>
		</div>

		<div class="_footer">
			<i-button 
				type="primary" 
				@click="handleSubmit"
			>保存</i-button>
			<i-button 
				style="margin: 0 150px 0 5px"
				@click="handleCancel"
			>取消</i-button>
		</div>
	</div>
</template>

<script>
import { debounce } from 'lodash';
import { Tree, Input, Button } from 'iview';
import API_ROOT from '@stores/apis/root';
import { AddCourse } from '@components/hr/academy-train-detail/_common/popup/add-course';
import InputText from './input-text';
import clearService from "../academy-train-detail/_common/mixin/clear-service";

export default {
	name: 'oa-tpl',
	components: {
		'i-tree': Tree,
		'i-input': Input,
		'i-button': Button,
		'oa-input-text': InputText
	},
	mixins: [clearService([
		'subjectTree', 'stageTree', 'planTree', 'echelon',
		'planCaTree', 'planCaTreeAll', 'stageCaTreeAll', 'departAllTree'
	])],
	data() {
		this.valid = true;
		return {
			search: '',
			data: []
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT._HR_ACADEMY_ELITE_MANAGE_LIST_GET,
				type: 'GET',
				param: {
					depart_id: this.$route.query.depart_id || 11
				},
				loading: false
			}).then(({ data }) => {
				if (Array.isArray(data)) {
					this.handleTraverseData(data);
					this.data = data;
				} else {
					this.data = [];
				}
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleChange(e) {
			// if (!e.target.value) {
			// 	this.handleSearch();
			// }
		},
		handleSearch() {
			this.handleDeepArray(this.data, parent);
		},
		handleDeepArray(array, parent) {
			array.forEach(v => {
				if (Reflect.has(v, 'parent_id')) {
					v.expand = true;
				} else {
					v.expand = false;
				}
				if (parent && v.isSubject && v.title && v.title.includes(this.search)) {
					parent.expand = true;
				}
				if (v.children && v.children.length) {
					this.handleDeepArray(v.children, v);
				}
			});
		},
		handleTraverseData(data) {
			data.forEach(echelon => {
				// 遍历人才梯队类型  初始化数据
				this.handleModifyEchelonData(echelon);

				// 遍历计划 初始化数据
				if (echelon.child && echelon.child.length) {
					echelon.children = echelon.child;
					echelon.child.forEach(plan => {
						this.handleModifyPlanData(plan);

						// 遍历阶段 初始化数据
						if (plan.stage && plan.stage.length) {
							plan.children = plan.stage;
							plan.stage.forEach(stage => {
								this.handleModifyStageData(stage);

								// 遍历课程 初始化数据
								if (stage.subject && stage.subject.length) {
									stage.children = stage.subject;
									stage.subject.forEach(subject => {
										this.handleModifySubjectData(subject);
									});
								} else {
									// 没有条件创造条件
									this.$set(stage, 'subject', []);
									stage.children = stage.subject;
								}
								stage.subject.parentIds = {
									stage_id: stage.stage_id,
									echelon_id: stage.echelon_id
								};
								this.$auth[1096] && stage.subject.push({
									render: () => {
										return (
											<span 
												style={{ marginLeft: '-5px' }}
												onClick={ () => this.handleAddCourse(stage.subject) }>
												<i class="g-c-red-light iconfont icon-add1 g-c-blue-light g-pointer"
													style={{ verticalAlign: 'middle', padding: '0 5px' }}/>
												<span class="g-pointer" >添加课题</span>
											</span>
										);
									}
								});
							});
						}
					});
				}
			});
		},
		handleModifyEchelonData(echelon) {
			echelon.title = echelon.echelon_name;
			echelon.expand = true;
		},
		handleModifyPlanData(plan) {
			plan.title = plan.echelon_name;
			plan.expand = true;
		},
		handleModifyStageData(stage) {
			stage.title = stage.stage_name;
			stage.expand = true;
		},
		handleModifySubjectData(subject) {
			subject.title = subject.subject_name;
			subject.isSubject = true;
			subject.is_delete = 0;
			subject.domId = this.handleGenerateDomId();
			subject.render = (h, { root, node, data }) => {
				return (
					<span 
						class="_draggle"
						draggable
						id={data.domId}
						onDragstart={ (e) => this.handleDragStart(e, { root, node, data }) }
						onDragenter={ (e) => this.handleDragEnter(e, { root, node, data }) }
						onDragover={ (e) => this.handleDragOver(e, { root, node, data }) }
						onDragend={ this.handleDragEnd }
					>
						<InputText value={ data } handleDelete={ () => this.handleDelete({ root, node, data }) }/>
					</span>
				);
			};
		},
		handleAddCourse(subjects) {
			// 这里敲黑板  去除被dom隐藏的结点奥 
			const validSubjects = subjects.filter(v => Reflect.has(v, 'is_delete') && v.is_delete !== 1);
			if (validSubjects.length >= 30) {
				this.$Message.error('最多只能添加30个奥');
				return; 
			}
			AddCourse.popup({
				nowLength: validSubjects.length
			}).then(res => {
				res.forEach(v => {
					subjects.splice(subjects.length - 1, 0, {
						...subjects.parentIds,
						title: v.title,
						subject_name: v.title,
						isSubject: true,
						subject_id: 0,
						is_delete: 0,
						domId: this.handleGenerateDomId(),
						render: (h, { root, node, data }) => {
							return (
								<span 
									class="_draggle"
									id={ data.domId }
									draggable
									onDragstart={ (e) => this.handleDragStart(e, { root, node, data }) }
									onDragenter={ (e) => this.handleDragEnter(e, { root, node, data }) }
									onDragover={ (e) => this.handleDragOver(e, { root, node, data }) }
									onDragend={ this.handleDragEnd }>
									<InputText value={ data } handleDelete={ () => this.handleDelete({ root, node, data }) }/>
								</span>
							);
						}
					});
				});
			});
		},
		handleDelete({ root, node, data }) {
			const parentKey = root.find(el => el === node).parent;
			const parent = root.find(el => el.nodeKey === parentKey).node;
			const index = parent.children.indexOf(data);

			// 如果 subject_id 存在 说明该数据是后端返回的 ，不能删除 要修改is_delete字段
			// 不存在，说明是本地新建的， 直接删除即可，不需要通知后端
			if (data.subject_id) {
				data.is_delete = 1;
				const dom = document.getElementById(data.domId);
				dom.parentNode.style.display = 'none';
			} else {
				parent.children.splice(index, 1);
			}
		},
		handleDragStart(e, { root, node, data }) {
			e.dataTransfer.effectAllowed = "move";
			e.dataTransfer.dropEffect = "move";

			// 存储当前操作节点信息
			this.nowNodeInfo = {
				data,
			};
		},
		handleDragEnter(e, { root, node, data }) {
			// 防止触发自我enter、非同一阶段课程
			if (data === this.nowNodeInfo.data || data.stage_id !== this.nowNodeInfo.data.stage_id) return; 
			const parentKey = root.find(el => el === node).parent;
			const parent = root.find(el => el.nodeKey === parentKey).node;
			const targetIndex = parent.children.indexOf(data);
			this.handleSwitchIndex(parent.children, targetIndex);
		},
		handleDragOver(e, { root, node, data }) {
			const { nowNodeInfo } = this;
			// 只允许阶段内拖动
			if (data.stage_id === nowNodeInfo.data.stage_id && data.echelon_id === nowNodeInfo.data.echelon_id) {
				e.preventDefault();
			}
		},
		handleDragEnd() {
		},
		handleSwitchIndex(data, targetIndex) {
			const oldIndex = data.indexOf(this.nowNodeInfo.data);
			const tempData = data[targetIndex];
			data.splice(targetIndex, 1, data[oldIndex]);
			data.splice(oldIndex, 1, tempData);
		},
		handleSubmit() {
			const data = this.handlePostData(this.data);
			this.$request({
				url: API_ROOT._HR_ACADEMY_ELITE_MANAGE_LIST_SAVE_GET,
				type: "POST",
				param: {
					subject: data
				}
			}).then(res => {
				this.data = [];
				this.$Message.success(res.msg);
				this.loadData();
				this.clearService();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleCancel() {
			this.$router.back();
		},
		handleGenerateDomId() {
			return Math.floor(Math.random() * 10000000).toString(32);
		},
		handlePostData() {
			let data = JSON.parse(JSON.stringify(this.data));
			data.forEach(echelon => {
				delete echelon.children;
				if (echelon.child && echelon.child.length) {
					echelon.child.forEach(plan => {
						delete plan.children;
						if (plan.stage && plan.stage.length) {
							plan.stage.forEach(stage => {
								delete stage.children;

								if (stage.subject && stage.subject.length) {
									delete stage.children;
								}
							});
						}
					});
				}
			});
			return data;
		}
		// handleValidData(data) {
		// 	const reg = /^[\u0391-\uFFE5A-Za-z]+$/;
		// 	for (let i = 0; i < data.length; i++) {
		// 		if (data[i].isSubject && !reg.test(data[i].title)) {
		// 			this.valid = false;
		// 			if (!this.valid) return;
		// 		}
		// 		if (data[i].children && data[i].children.length) {
		// 			this.handleValidData(data[i].children);
		// 		}
		// 	}
		// }
	},
};
</script>

<style lang="scss">
.c-academy-elite-manage-tree {
	user-select: none;
	padding: 20px;
	padding-bottom: 100px;
	._desc {
		padding: 10px;
		width: 100%;
		height: 72px;
		background: rgba(245, 245, 246, 1);
	}
	._search {
		margin-top: 20px;
	}
	._tree {
		color: #4B4F57;
		cursor: pointer;
		margin: 15px 0 0 40px;
		.ivu-icon-ios-arrow-forward::before {
			content: '\F341';
			font-size: 16px;
		}
		.ivu-tree-arrow-open {
			.ivu-icon-ios-arrow-forward::before {
				content: '\F33D';
				font-size: 16px;
		}
		}
		.ivu-icon {
			transform: translateY(-2px)
		}
	}

	._footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		background: #fff;
		height: 45px;
		line-height: 45px;
		box-shadow: 0px -2px 10px 0px rgba(0, 0, 0, 0.08);
		margin-left: -20px;
		text-align: center;
	}

}
</style>
