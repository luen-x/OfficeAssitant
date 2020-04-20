<template>
	<div class="v-hr-academy-train-enroll-add-edit">
		<i-form 
			ref="formValidate" 
			:model="formValidate" 
			:rules="ruleValidate" 
			:label-width="100"
			@submit.native.prevent>
			<i-form-item label="报名主题：" prop="apply_topic">
				<i-input
					v-model="formValidate.apply_topic"
					:maxlength="30"
					clearable
					placeholder="请输入报名主题"
					style="width: 300px"/>
			</i-form-item>

			<i-form-item label="关联事项：" prop="relation_id">
				<i-select
					v-model="formValidate.relation_id"
					clearable
					style="width: 300px"
					placeholder="请选择关联事项"
				>
					<i-option 
						v-for="course in courseData"
						:key="+course.course_id"
						:value="course.course_id">{{ course.course_name }}</i-option>
				</i-select>
			</i-form-item>

			<i-form-item label="报名说明：">
				<oa-limit-words
					v-model="formValidate.apply_describe"
					:max="200"
					style="width: 300px"
					placeholder="请输入报名说明，表示其报名的目的"
				/>
			</i-form-item>

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
import { Form, FormItem, Select, Option, Input, Button } from 'iview';
import { PModalRetatedMatter } from '@components/hr/academy-train-detail/_common/popup/related-matter';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { selectCourse } from '@stores/services/hr';
    
export default {
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-button': Button
	},
	data() {
		this.isInEditPage = this.$route.path.includes('add');
		return {
			courseData: [],
			project_id: this.$route.query.project_id,
			formValidate: {
				project_id: this.$route.query.project_id,
				apply_topic: '',
				apply_id: '',
				relation_type: +this.$route.query.relation_type, // 报名固定 课程 单选  
				relation_id: +this.$route.query.relation_id,
				// relation_course: '',
				apply_describe: '',
			},
			ruleValidate: {
				apply_topic: [
					{ required: true, message: '请填写报名名称', trigger: 'blur' }
				],
				relation_id: [
					{ required: true, type: 'number', message: '请选择关联课程', trigger: 'change' }
				]
			}
		};
	},
	inject: ['confimInfo'],
	async created() {
		await this.loadCourse();
		this.handleInit();
	},
	methods: {
		handleSubmit() {
			this.$refs.formValidate.validateAndScroll((valid) => {
				if (valid) {
					const URL = this.isInEditPage 
						? '_HR_ACADEMY_TRAIN_DETAIL_ENROLL_1_ADD_VOTE_POST'
						: '_HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_EDIT_VOTE_POST';
					this.$request({
						url: API_ROOT[URL],
						type: "POST",
						param: {
							...this.formValidate,
							relation_id: [this.formValidate.relation_id],
							apply_id: this.$route.query.apply_id || ''
						},
						loading: false,
					}).then(res => {
						this.confimInfo.show = false;
						this.$Message.success('保存成功');
						this.$router.push(getHashUrl(
							'/hr/academy/train/detail/enroll/0/manage',
							{
								project_id: this.$route.query.project_id
							}
						));
					}).catch(res => {
						this.$Message.error(res.msg);
					});
				} else {
					this.$refs.modal.buttonLoading = false;
					this.visible = true;
				}
			});
		},
		handleCancel() {
			ModalTip.popup({ content: '内容还没有保存，取消后将无法恢复，确定要取消吗？' }).then(() => {
				this.confimInfo.show = false;
				this.$router.back();
			});
		},
		handleInit() {
			// 不同页面调用不同的数据初始化
			// 新建页面
			const { query = {} } = this.$route;
			if (this.isInEditPage) {
				this.formValidate.relation_type = query.relation_type;
				this.formValidate.project_id = query.project_id;
				this.formValidate.relation_id = +query.relation_id;
			} else {
				// 在编辑页面
				this.$request({
					url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_ENROLL_DETAIL_GET,
					param: { apply_id: this.$route.query.apply_id },
					type: "GET"
				}).then(({ data }) => {
					this.formValidate = {
						apply_topic: data.apply_topic,
						relation_id: +data.relation_id[0].course_id,
						apply_describe: data.apply_describe
					};
				});
				
			}
		},
		async loadCourse() {
			const { data } = await this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_PROJECT_COURSE_SEARCH_GET,
				type: 'GET',
				param: {
					project_id: this.$route.query.project_id,
				},
				loading: false
			});
			this.courseData = data;
		}
	},
};
</script>
<style lang="scss" scoped>
.v-hr-academy-train-enroll-add-edit {
    padding: 15px 0 80px 15px;
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


