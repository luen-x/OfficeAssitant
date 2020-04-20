<template>
	<div 
		:style="{ marginTop: $route.path.includes('add') ? '-10px' : 0 }" 
		class="v-hr-academy-train-vote-add-edit">
		<div class="_alert g-fs-14">
			<i class="icon iconfont icon-attention g-c-red-dark"/>
			<span class="g-c-red-mid">
				提醒：{{ canEdit ? '如有人参与投票后，将再无法进行编辑！': '已经有人参与投票，无法进行编辑！' }}
			</span>
		</div>
		<i-form 
			ref="formValidate" 
			:model="formValidate" 
			:rules="ruleValidate" 
			:label-width="100">
			<i-form-item label="投票主题：" prop="vote_topic">
				<i-input
					v-model="formValidate.vote_topic"
					:maxlength="30"
					placeholder="请输入投票主题"
					style="width: 300px"
					@keydown.enter.native.prevent="() => { return false }"/>
					<!-- <span class="g-c-black5">（30字以内）</span> -->
			</i-form-item>

			<i-form-item label="投票说明：" prop="vote_describe" >
				<oa-limit-words
					v-model="formValidate.vote_describe"
					:max="200"
					style="width: 300px"
					placeholder="请输入投票说明，表示其投票的目的"
				/>
			</i-form-item>

			<i-form-item 
				class="ivu-form-item-required" 
				label="关联事项："
				style="margin-top: -10px">
				<span class="g-c-blue-mid g-pointer" @click="hadleRelatedMaster">关联事项</span>
				<span 
					v-if="formValidate.relation_type"
				>{{ formValidate.label }}</span>
			</i-form-item>

			<div class="_vote-list">
				<div 
					v-for="(vote, i) in formValidate.vote_items"
					:key="i"
					class="__vote-item"
				>
					<div class="__top" @click="handleToggle(i)">
						<span class="g-c-blue-mid g-fs-14 g-pd-l-20">投票&nbsp;{{ i + 1 }}</span>
						<span class="g-fr">
							<i 
								:class="vote.expand ? 'icon-triangle-up' : 'icon-triangle-down'" 
								class="iconfont g-fs-12 g-c-black-dark"
								style="transform: scale(.8)"
							/>
							<span class="g-pd-l-5 g-pd-r-15">{{ vote.expand ? '收起' : '展开' }}</span>
						</span>
						<span class="g-fs-14 g-c-red-mid __del" @click.stop="handleDeleteVote(i)">删除</span>
					</div>
					<vc-expand
						ref="expand"
						v-model="vote.expand"
					>
						<div style="padding-top: 20px">
							<i-form-item 
								:prop="'vote_items.' + i + '.item_title'" 
								:rules="ruleValidate.content"
								class="__hide-star"
								label="标题：">
								<i-input
									v-model="vote.item_title"
									:maxlength="25"
									placeholder="请输入小标题"
									style="width: 300px"/>
							</i-form-item>
							<i-form-item
								v-for="(item, j) in vote.item_option"
								:prop="'vote_items.' + i + '.item_option.' + j + '.option_name'"
								:rules="ruleValidate.content"
								:key="j"
								:label="`${j + 1}、`"
								class="__hide-star g-relative">
								<i-input
									:key="j"
									v-model="item.option_name"
									:maxlength="50"
									placeholder="请输入投票选项"
									style="width: 300px"/>
								<i 
									v-if="vote.item_option.length > 2"
									class="g-c-red-light iconfont icon-remove-circle __del-item"
									@click="vote.item_option.splice(j, 1)"/>
							</i-form-item>
							<div 
								v-if="vote.item_option.length < 10" 
								class="__add g-c-blue-mid g-m-b-20"
								@click="vote.item_option.push({option_name: ''})">
								<i class="icon iconfont icon-add3 g-fs-12"/> 添加投票选项
							</div>
							<i-form-item>
								<i-checkbox v-model="vote.is_multiple" :true-value="1" :false-value="0">
									<span style="padding: 0 5px">允许多选</span>
								</i-checkbox>
								<template v-if="vote.is_multiple">
									每人最多选
									<i-select 
										v-model="vote.max_option" 
										style="width: 70px;"
										transfer
									>
										<i-option v-for="(num, i) in (vote.item_option.length + 1)" :value="i" :key="num">
											{{ i ? i : i + '（不限）' }}
										</i-option>
									</i-select>
									项
								</template>
							</i-form-item>
						</div>
					</vc-expand>
				</div>
				<div
					v-if="formValidate.vote_items.length < 20"
					class="__add-vote g-fs-14 g-c-blue-mid" 
					@click="handleAddNewVote"> 
					<i class="icon iconfont icon-add3 g-fs-12"/>
					添加投票</div>
			</div>
		</i-form>
		<div class="_footer">
			<i-button @click="handleCancel">取消</i-button>
			<i-button 
				type="primary"
				style="margin: 0 315px 0 8px" 
				@click="handleSubmit">保存</i-button>
		</div>
	</div>
</template>

<script>
import { Form, FormItem, Select, Option, Radio, CheckboxGroup, Checkbox,
	Input, Button } from 'iview';
import { Expand } from 'wya-vc';
import { PModalRetatedMatter } from '@components/hr/academy-train-detail/_common/popup/related-matter';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl } from '@utils/utils';
import item from './item';

export default {
	name: "oa-activity-classify-add",
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-radio': Radio,
		'i-button': Button,
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox,
		'vc-expand': Expand
	},
	mixins: [item],

	data() {
		this.isInEditPage = this.$route.path.includes('add');
		return {
			visible: false,
			canEdit: true
		};
	},
	inject: ['confimInfo'],
	created() {
		this.handleInit();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		hadleRelatedMaster() {
			PModalRetatedMatter.popup({ 
				type: 'vote',
				datas: {
					relation_id: this.formValidate.relation_id,
					relation_type: this.formValidate.relation_type
				}
			 }).then(res => {
				this.formValidate.relation_id = res.relation_id;
				this.formValidate.relation_type = +res.relation_type;
				this.formValidate.relation_course = res.relation_course;
				this.formValidate.label = res.label;
			});
		},
		handleSubmit() {
			if (!this.canEdit) {
				this.$Message.error('已经有人参与投票，无法进行编辑！');
				return;
			}
			this.$refs.formValidate.validateAndScroll((valid) => {
				if (this.formValidate.vote_items.length <= 0) {
					this.$Message.warning('请至少添加一个投票');
					return; 
				}
				if (valid) {
					this.handleSubmitVote();
				}
			});
		},
		handleSubmitVote() {
			const URL = this.isInEditPage 
				? '_HR_ACADEMY_TRAIN_DETAIL_VOTE_1_ADD_VOTE_POST'
				: '_HR_ACADEMY_TRAIN_DETAIL_VOTE_1_EDIT_VOTE_POST';
			this.$request({
				url: API_ROOT[URL],
				type: "POST",
				param: {
					...this.formValidate
				},
				loading: false,
			}).then(res => {
				this.confimInfo.show = false;
				this.$Message.success('保存成功');
				this.$router.push({
					path: '/hr/academy/train/detail/vote/0/manage',
					query: {
						project_id: this.$route.query.project_id,
					}
				});
			}).catch(res => {
				this.$Message.error(res.msg);
			});
		},
		handleCancel() {
			ModalTip.popup({ content: '内容还没有保存，取消后将无法恢复，确定要取消吗？' }).then(() => {
				// if (this.isInEditPage) {
				this.confimInfo.show = false;
				// }
				this.$router.back();
			});
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleChange(matter) {
			// master 1: 关联项目 2： 关联课程
			// if (master) {

			// }
		},
		handleToggle(i) {
			this.$refs.expand[i].toggle();
		},
		handleDeleteVote(i) {
			this.formValidate.vote_items.splice(i, 1);
		},
		handleAddNewVote() {
			this.$refs.formValidate.validateAndScroll(valid => {
				if (valid) {
					this.formValidate.vote_items.push({
						item_title: "",
						is_multiple: 0, 
						max_option: 1, 
						expand: true,
						item_option: [{ option_name: '' }, { option_name: '' }]
					});
				} else {
					this.$Message.warning('请完善信息后添加');
				}
			});
		},
		handleInit() {
			// 不同页面调用不同的数据初始化
			// 新建投票页面
			const { query = {} } = this.$route;
			if (this.isInEditPage) {
				this.formValidate.relation_type = +query.relation_type;
				this.formValidate.project_id = +query.project_id;
				this.formValidate.relation_id = (query.relation_id && query.relation_id.split(',').map(Number)) || [];
				this.formValidate.label = query.label;
			} else {
				// 在编辑投票页面
				this.$request({
					url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_VOTE_2_VOTE_DETAIL_GET,
					param: {
						vote_id: this.$route.query.vote_id
					},
					type: "GET"
				}).then(res => {
					this.formValidate = {
						...res.data
					};
					this.canEdit = res.data.vote_num == '0';
					if (res.data.relation_type == 2) {
						const relationId = res.data.relation_id.map(v => Number(v.course_id));
						const label = res.data.relation_id.map(v => v.course_name).join('、');
						this.formValidate.label = label;
						this.formValidate.relation_id = relationId;
					} else {
						this.formValidate.label = '关联项目';
					}
				});
				
			}
		}
	}
};
</script>

<style lang="scss">
.v-hr-academy-train-vote-add-edit {
    padding: 25px 0 80px 15px;
	._alert {
		.icon {
		vertical-align: middle;
			padding: 0 10px;
		}
		margin: -5px 0 20px 0;
		width:1510px;
		height:40px;
		line-height: 40px;
		background:rgba(231,72,84, 0.05);
	}
    ._vote-list {
        padding: 0 0 0 100px;
		margin-top: -10px;
        .__vote-item {
            width: 660px;
            border-radius:4px 4px 4px 4px;
            margin-bottom: 20px;
            border:1px solid rgba(217, 220, 224, 1);
            .__top {
                position: relative;
                cursor: pointer;
                height: 40px;
                line-height: 40px;
                background:rgba(35,151,249, 0.05);
                .__del {
                    position: absolute;
                    right: -45px
                }
            }
			.__del-item {
				cursor: pointer;
				position: absolute;
				left: 310px;
				top: 1px;
			}
        }
		.__add {
			width:300px;
			height:32px;
			cursor: pointer;
			margin-left: 100px;
			line-height: 32px;
			text-align: center;
			background:rgba(255,255,255,1);
			border:1px dashed rgba(35,151,249,1);
			border-radius:4px;
		}
		.__add-vote {
			cursor: pointer;
			text-align: center;
			width:660px;
			height:42px;
			margin-top: 20px;
			line-height: 42px;
			background:rgba(255,255,255,1);
			border:1px dashed rgba(35,151,249,1);
			border-radius:4px;
		}
    }
	.__hide-star {
		.ivu-form-item-label::before	{
			content: ''!important
		}
	}
	._footer {
		background-color: #fff;
		position: fixed;
		bottom: 0;
		height: 45px;
		line-height: 45px;
		text-align: center;
		margin-left: -15px;
		width: 100%;
		box-shadow:0px -2px 10px 0px rgba(0, 0, 0, 0.08);
	}
}
</style>

