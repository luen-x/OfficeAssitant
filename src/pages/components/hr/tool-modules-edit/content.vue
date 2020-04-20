<template>
	<div class="v-hr-school-send-email ">
		<i-form
			ref="form"
			:model="fromData"
			:rules="rules"
			:label-width="100"
			@submit.native.prevent>
			<i-form-item label="邮件主题：" prop="theme">
				<i-input
					v-model="fromData.theme"

					:maxlength="24"
					style="width:300px"
					placeholder="这里请输入邮件主题"
				/>
			</i-form-item>
			<i-form-item label="邮件内容：" prop="text">
				<div class="g-c-back-3">点击添加应聘者姓名、邀约人等信息，面试通知中会自动替换成真实信息。</div>
				<div v-for="(item,index) in texts" :key="index" class="g-red-btn-line  g-m-r-10" @click="handleReplace(item)">
					{{ item }}
				</div>
				<div class="g-m-t-20 ">
					<vc-editor
						ref="editor"
						v-model="fromData.text"
						:options="options"
						:disabled="disabled"
						style="min-width:400px;"
					/>
				</div>
			</i-form-item>
		</i-form>
		<footer class="g-flex-ac">
			<div class="g-gray-btn-small g-m-r-10" @click="handleCancel">取消</div>
			<vc-debounce-click class="g-red-btn-small" @click="handleSave">保存</vc-debounce-click>
		</footer>
	</div>
</template>

<script>
import { Input, Form, FormItem } from "iview";
import Upload from "@components/_common/upload/upload";
import MailInput from "@components/_common/mail-input/mail-input";
import Editor from "@components/_common/vc-reset/editor/editor";
import { debounce } from "lodash";
import { Confirm } from "@components/_common/confirm/confirm";
import { getParseUrl, getHashUrl, setItem, getItem } from "@utils/utils";
import API_ROOT from "@stores/apis/root";
import { DelTipModal } from '@components/hr/_common/delete-tip';

export default {
	name: 'oa-send-email',

	components: {
		"i-input": Input,
		"i-form": Form,
		"i-form-item": FormItem,
		"oa-upload": Upload,
		"oa-mail-input": MailInput,
		"vc-editor": Editor
	},

	data() {
		return {
			texts: ['#应聘者姓名#', '#邀约人姓名#', '#邀约人手机#', '#应聘职位#'],
			options: {
				modules: {
					toolbar: '#toolbar',
				}
			},
			disabled: false,
			fromData: {
				"offer_conf_id": 1, // 主键id
				"theme": "校招offer测试", // offer邮件主题
				"text": "11111", // offer正文邮件内
			},
			rules: {
				theme: [
					{ required: true, type: 'string', message: "请填写邮件主题", trigger: "blur" }
				],
				text: [
					{ required: true, type: 'string', message: "请填写邮件内容", trigger: "change" }
				]
			},
		};
	},
	computed: {

	},
	mounted() {
		const data = this.$route.params;
		Object.keys(this.fromData).forEach(key => {
			this.fromData[key] = data[key];
		});
	},
	methods: {
		loadEditorData() {
			this.$request({
				url: API_ROOT._HR_RECRUIT_SCHOOL_SUMMARY_EMAIL_EDITOR_GET,
				type: "GET",
				param: {
					offer_type: this.$route.query.recruitType == 'social' ? 1 : 2
				}
			}).then(res => {
				this.emailData.title = res.data.offer_type_name;
				this.emailData.content = res.data.text;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		// 加载邮件详情
		loadDetail(email) {
			this.$request({
				url: API_ROOT._HR_RECRUIT_EMAIL_DETAIL_GET,
				type: "GET",
				param: {
					email_id: email
				}
			}).then(res => {
				// 初始化详情数据

			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		// 加载收件人邮箱
		handleCancel() {
			Confirm.popup({
				title: '取消',
				msg: '确认取消？返回后将不会保存此次编辑的内容'
			}).then(res => {
				this.$router.back();
			}).catch(err => { err && console.error(err); });
		 },
		handleSave() {
			this.$refs.form.validate().then(valid => {
				if (valid) {
					this.$request({
						url: 'HR_TOOL_MODULES_OFFER_THEME_ADD_GET',
						type: "post",
						param: {
							...this.fromData,
						}
					}).then(res => {
						// 初始化详情数
						this.$router.push('/hr/tool/modules/upload');
						this.$Message.success(res.msg);
					}).catch(error => {
						this.$Message.error(error.msg);
					});
				}
			});
		},
		handleReplace(item) {
			const editor = this.$refs.editor.editor;
			let length;
			let selection = editor.getSelection();
			if (!selection) {
				length = editor.getLength();
			} else {
				length = selection.index;
			}
			editor.insertText(length, item, {
				'color': '#E74854',
			});
			// 光标向后移动一位
			editor.setSelection(length + item.length);
		},
	}
};
</script>

<style lang="scss">
.v-hr-school-send-email {
	margin-left: 10%;
	width: 80%;
	margin-bottom: 60px;
	._top{
		border-bottom: 1px solid #EBEEF1;

		.__span {
			display: inline-block;
			width: 80px;
			text-align: right;
			color: #818794;
		}
	}

	textarea{
		padding-top: 8px;
	}

	footer {
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #ffffff;
		width: 100%;
		height: 60px;
		padding-left: 45%;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}

	span.c-upload{
		display: inline-block !important;
	}
	.c-upload{
		margin-top: 0px;
	}

	em{
		font-style:italic;
	}

	b, strong{
		em{
			font-weight: bolder;
			font-style:italic;
		}
	}
}
</style>
