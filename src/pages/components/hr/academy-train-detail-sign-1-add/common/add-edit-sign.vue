<template>
	<div 
		:style="{ marginTop: $route.path.includes('add') ? '-10px' : 0 }" 
		class="v-hr-academy-train-sign-add-edit">
		<i-form 
			ref="form" 
			:model="formData" 
			:rules="formRule" 
			:label-width="100">
			<i-form-item label="签到名称：" prop="sign_topic">
				<i-input
					v-model="formData.sign_topic"
					:maxlength="30"
					placeholder="请输入签到名称"
					style="width: 300px"/>
			</i-form-item>

			<i-form-item 
				class="ivu-form-item-required" 
				label="关联事项："
				prop="label"
				style="margin-top: -10px">
				<span class="g-c-blue-mid g-pointer" @click="hadleRelatedMaster">关联事项</span>
				<span 
					v-if="formData.relation_type"
				>{{ formData.label }}</span>
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
import { Form, FormItem, Select, Option, Radio, CheckboxGroup, Checkbox,
	Input, Button } from 'iview';
import { Expand } from 'wya-vc';
import { PModalRetatedMatter } from '@components/hr/academy-train-detail/_common/popup/related-matter';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl } from '@utils/utils';

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

	data() {
		this.isInEditPage = this.$route.path.includes('add');
		return {
			formData: {
				sign_id: '',
				project_id: '',
				sign_topic: '',
				relation_type: '',
				relation_id: [],
				relation_course: [],
				label: ''
			},
			formRule: {
				sign_topic: [
					{ required: true, message: '请填写签到名称', trigger: 'blur' }
				],
				label: [
					{ required: true, message: '请选择关联事项', trigger: 'blur' }
				]
			},
			visible: false,
		};
	},
	created() {
		this.handleInit();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		hadleRelatedMaster() {
			PModalRetatedMatter.popup({ 
				type: 'sign',
				datas: {
					relation_id: this.formData.relation_id,
					relation_type: this.formData.relation_type
				}
			}).then(res => {
				this.formData.relation_id = res.relation_id;
				this.formData.relation_type = +res.relation_type;
				this.formData.relation_course = res.relation_course;
				this.formData.label = res.label;
			});
		},
		handleSubmit() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.handleSubmitSign();
				}
			});
		},
		handleSubmitSign() {
			const URL = this.isInEditPage 
				? '_HR_ACADEMY_TRAIN_DETAIL_SIGN_ADD_POST'
				: '_HR_ACADEMY_TRAIN_DETAIL_SIGN_EDIT_POST';
			this.$request({
				url: API_ROOT[URL],
				type: "POST",
				param: {
					project_id: this.$route.query.project_id,
					...this.formData
				},
				loading: false,
			}).then(res => {
				this.$Message.success('保存成功');
				this.$router.push({
					path: '/hr/academy/train/detail/sign/0/manage',
					query: {
						project_id: this.$route.query.project_id,
					}
				});
			}).catch(res => {
				this.$Message.error(res.msg);
			});
		},
		handleCancel() {
			this.$router.back();
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleInit() {
			// 不同页面调用不同的数据初始化
			// 新建签到页面
			const { query = {} } = this.$route;
			this.formData.relation_type = +query.relation_type;
			this.formData.project_id = +query.project_id;
			this.formData.relation_id = (query.relation_id && query.relation_id.split(',').map(Number)) || [];
			this.formData.label = query.label;
			if (!this.isInEditPage) {
				this.formData.sign_topic = query.sign_topic;
				this.formData.sign_id = query.sign_id;
			}
		}
	}
};
</script>

<style lang="scss">
.v-hr-academy-train-sign-add-edit {
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
    ._sign-list {
        padding: 0 0 0 100px;
		margin-top: -10px;
        .__sign-item {
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
		.__add-sign {
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

