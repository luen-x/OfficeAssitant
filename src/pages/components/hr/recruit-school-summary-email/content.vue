<template>
	<div class="v-hr-school-send-email">
		<div class="g-flex g-jc-fe g-m-t-10 g-m-r-20">
			<div
				v-if="$auth[1257] || $auth[1268]"
				class="g-red-btn g-m-r-10"
				@click="handleEmailList"
			>
				邮件列表
			</div>
			<div
				v-if="$auth[1738] || $auth[153]"
				class="g-red-btn-line"
				@click="handleDownload"
			>
				下载附件
			</div>
		</div>
		<i-form ref="form" style="width: 80%;" @submit.native.prevent>
			<div class="g-flex g-flex-ac g-pd-t-20 g-pd-b-10 _top">
				<span class="g-m-r-20 __span">收件人：</span>
				<oa-mail-input ref="addressee" key="addressee" :data-source="addresseeList"/>
			</div>

			<div class="g-flex g-flex-ac g-pd-t-20 g-pd-b-10 _top">
				<span class="g-m-r-20 __span">抄送：</span>
				<oa-mail-input ref="copier" key="copier" :data-source="copierList"/>
			</div>

			<div class="g-flex g-flex-ac g-pd-t-20 g-pd-b-10 _top">
				<span class="g-m-r-20 __span">主题：</span>
				<i-input
					v-model="emailData.title"
					:maxlength="24"
					placeholder="这里请输入邮件主题"
				/>
			</div>

			<div class="g-m-t-20 g-m-l-20">
				<div class="g-m-b-20">
					<i class="iconfont icon-lianjie g-fs-16"/>
					<span>上传附件</span>
				</div>
				<oa-upload	
					v-model="emailData.enclosure"
					:max="10"
					:upload="{multiple: true, max: 10}"
					style="cursor: pointer;color: #2397F9;"
				>
					<span slot="trigger" class="g-m-b-20 g-inline-block">上传附件</span>
				</oa-upload>
			</div>

			<div class="g-m-t-20 g-m-l-30">
				<vc-editor
					ref="editor"
					v-model="emailData.content"
					:options="options"
					:disabled="disabled"
					style="min-width:400px;"
				/>
			</div>

			<div v-if="email_lists[0]" class="g-m-t-20 g-m-l-30">
				<span>
					发件人：{{ send_person }}
				</span>
				<span
					v-if="email_lists.length > 1"
					class="g-m-l-20"
					style="cursor: pointer;color: #2397F9;"
					@click="handleLoginEmail">
					切换邮箱
				</span>
			</div>
		</i-form>

		<footer class="g-flex-ac">
			<div class="g-gray-btn-small g-m-r-10" @click="handleCancel">取消</div>
			<vc-debounce-click class="g-red-btn-small" @click="handleSend">发送</vc-debounce-click>
		</footer>
	</div>
</template>

<script>
import { Input, Form, FormItem } from "iview";
import Upload from "@components/_common/upload/upload";
import MailInput from "@components/_common/mail-input/mail-input";
import { Editor } from "wya-vc";
import { debounce } from "lodash";
import { getParseUrl, getHashUrl, setItem, getItem } from "@utils/utils";
import API_ROOT from "@stores/apis/root";
import { DelTipModal } from '@components/hr/_common/delete-tip';
import { TipModal } from "./modal/tip";
import { LoginModal } from "./modal/login";

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
			addresser: [],
			options: {
				modules: {
					toolbar: '#toolbar'
				},
			},
			disabled: false,
			applicantIds: [], // 收件人id数组
			addresseeList: [], 	// 收件人邮箱号数组
			copierList: [],		// 抄送人
			email_lists: [], // 发件邮箱
			title: "", // 主题
			enclosure: [], // 附件
			content: "", // 富文本内容
			copy_person: [], // 抄送
			copy_person_str: "",
			account: "",
			emailData: {
				title: '',
				content: '',
				enclosure: [],
				staff_email_id: ''
			}
		};
	},
	computed: {
		send_person() {
			return getItem(`staff_${this.$global.version}`).staff.staff_name + "<" + this.account + ">";
		}
	},
	mounted() {
		if (this.$route.query.email_id) {
			this.loadDetail(this.$route.query.email_id);
		} else {
			this.applicantIds = [this.$route.query.applicant_id];
			this.loadData(this.applicantIds);
			this.loadEditorData();
		}
	},
	methods: {
		handleEmailList() {
			this.$router.push(getHashUrl('/hr/recruit/school/summary/elists', 
				{ 
					recruitType: this.$route.query.recruitType
				}));
		},
		handleDownload() {
			window.open(getHashUrl(API_ROOT['_HR_RECRUIT_SOCIAL_SUMMARY_OFFER_GET'], { // eslint-disable-line
				...this.$route.query,
				is_download: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
		loadEditorData() {
			this.$request({
				url: API_ROOT._HR_RECRUIT_SCHOOL_SUMMARY_EMAIL_EDITOR_GET,
				type: "GET",
				param: {
					offer_type: this.$route.query.recruitType == 'social' ? 1 : 2,
					applicant_id: this.$route.query.applicant_id,
					position_id: this.$route.query.position_id
				}
			}).then(res => {
				this.emailData.title = res.data.theme;
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
				this.emailData.title = res.data.title;
				this.emailData.content = res.data.content;
				this.emailData.staff_email_id = res.data.staff_email_id;
				res.data.enclosure.forEach(item => {
					this.emailData.enclosure.push({
						url: item.url,
						title: item.url.substring(item.url.lastIndexOf("/") + 1, item.url.length),
						type: "." + item.url.substring(item.url.lastIndexOf(".") + 1, item.url.length),
						uid: item.url,
						file_id: item.email_id
					});
				});
				res.data.address.forEach(item => {
					this.addresseeList.push({
						email: (item.addressee_name ? item.addressee_name : "") + "<" + item.email + ">"
					});
					this.applicantIds.push(item.attach_id);
				});
				res.data.copy_person.forEach(item => {
					this.copierList.push({
						email: (item.addressee_name ? item.addressee_name : "") + "<" + item.email + ">"
					});
				});
				this.email_lists = res.data.email_lists;
				this.account = res.data.email;
				this.applicantIds = [this.$route.query.applicant_id];
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		// 加载收件人邮箱
		loadData(ids) {
			this.$request({
				url: API_ROOT._HR_RECRUIT_EMAIL_GET,
				type: "POST",
				param: {
					ids,
					type: this.$route.query.recruitType === 'school' ? 2 : 3
				}
			}).then(res => {
				res.data.addressee_person.forEach(item => {
					this.addresseeList.push({
						email: (item.addressee_name ? item.addressee_name : "") + "<" + item.email + ">"
					});
				});
				this.email_lists = res.data.email_lists;
				this.account = this.email_lists[0].account;
				this.emailData.staff_email_id = this.email_lists[0].staff_email_id;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleCancel() {
			DelTipModal.popup({
				title: '取消',
				content: '确认取消？返回后将不会保存此次编辑的内容'
			}).then(res => {
				this.$router.back();
			});
		},
		handleSend() {
			let brr = [];
			let addresseeList = [];
			// 验证
			let emailList = this.$refs.addressee.emails;
			if (emailList.length === 0) {
				this.$Message.error("收件人不能为空");
				return;
			}
			for (let i = 0; i < emailList.length; i++) {
				if (emailList[i].valid) {
					this.$Message.error("收件人中有错误的格式");
					return;
				} else if (emailList[i].email.indexOf("<") > -1) {
					brr = emailList[i].email.split("<");
					addresseeList.push({
						addressee_name: brr[0],
						email: brr[1] && brr[1].slice(0, brr[1].length - 1)
					});
				} else {
					addresseeList.push({
						addressee_name: "",
						email: emailList[i].email
					});
				}
			}
			addresseeList.forEach((it, index) => {
				addresseeList[index].attach_id = this.applicantIds[index];
			});

			brr = [];
			let copierList = [];
			emailList = this.$refs.copier.emails;
			for (let i = 0; i < emailList.length; i++) {
				if (emailList[i].valid) {
					this.$Message.error("抄送中有错误的格式");
					return;
				} else if (emailList[i].email.indexOf("<") > -1) {
					brr = emailList[i].email.split("<");
					copierList.push({
						addressee_name: brr[0],
						email: brr[1] && brr[1].slice(0, brr[1].length - 1)
					});
				} else {
					copierList.push({
						addressee_name: "",
						email: emailList[i].email
					});
				}
			}

			if (!this.emailData.title) {
				this.$Message.error("主题不能为空");
				return;
			}
			if (!this.emailData.content) {
				this.$Message.error("内容不能为空");
				return;
			}
			// 附件
			let enclosure = [];
			this.emailData.enclosure.forEach(it => {
				enclosure.push(it.url);
			});

			DelTipModal.popup({
				title: '确认',
				content: '确认发送此邮件？'
			}).then(res => {
				// 发送邮件请求
				this.$request({
					url: API_ROOT._HR_RECRUIT_SEND_EMAIL_POST,
					type: "POST",
					param: {
						addressee_person: addresseeList,
						copy_person: copierList,
						...this.emailData,
						enclosure,
						type: this.$route.query.recruitType === 'school' ? 2 : 3
					}
				}).then(ress => {
					// 发送成功
					this.$Message.success(ress.msg);
					TipModal.popup({
						title: '温馨提示',
						content: '通过OA系统发邮件会有10分钟左右的延迟，请稍后查看发送结果。'
					}).then(response => {
						if (this.$route.query.recruitType === 'school') {
							this.$router.push(getHashUrl('/hr/recruit/school/summary/elists', {
								recruitType: 'school'
							}));
						} else {
							this.$router.push(getHashUrl('/hr/recruit/social/summary/elists', {
								recruitType: 'social'
							}));
						}
					});
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		},

		handleLoginEmail() {
			LoginModal.popup({
				email_lists: this.email_lists,
				staff_email_id: this.emailData.staff_email_id ? Number(this.emailData.staff_email_id) : Number(this.email_lists[0].staff_email_id)
			}).then(res => {
				if (res) {
					this.emailData.staff_email_id = res;

					this.email_lists.forEach(item => {
						if (item.staff_email_id === this.emailData.staff_email_id) {
							this.account = item.account;
						}
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
.v-hr-school-send-email {
	width: 100%;
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

	.ivu-input{
		border: none;
		resize:none;
		font-size: 12px;
		color: #000000;
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
