<template>
	<div class="v-sc-cooperate-send-email">
		<i-form ref="form" @submit.native.prevent>
			<div class="g-flex g-flex-ac g-pd-t-20 g-pd-b-10 _top">
				<span class="g-m-r-20 __span">收件人：</span>
				<oa-mail-input ref="contractMail" key="contractMail" :data-source="contract_arr"/>
			</div>

			<div class="g-flex g-flex-ac g-pd-t-20 g-pd-b-10 _top">
				<span class="g-m-r-20 __span">抄送：</span>
				<oa-mail-input ref="copyMail" key="copyMail" :data-source="copy_arr"/>
			</div>

			<div class="g-flex g-flex-ac g-pd-t-20 g-pd-b-10 _top">
				<span class="g-m-r-20 __span">主题：</span>
				<i-input 
					v-model="title"
					:maxlength="24"
					placeholder="这里请输入邮件主题"
				/>
			</div>

			<div class="g-m-t-20 g-m-l-20 g-flex">
				<i class="iconfont icon-lianjie g-fs-16 g-m-r-10"/>

				<oa-upload
					v-model="enclosure"
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
					v-model="content"
					:options="options"
					:disabled="disabled"
					style="min-width:400px;"
				/>	
			</div>

			<div v-if="email_lists[0]" class="g-m-t-20 g-m-l-30">
				<span>
					发件人：{{ send_person }}
				</span>
				<span class="g-m-l-20" style="cursor: pointer;color: #2397F9;" @click="handleLoginEmail">切换邮箱</span>
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
import { setItem, getItem } from "@utils/utils";
import API_ROOT from "@stores/apis/root";
import { PromptModal } from "./modal/prompt";
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
			contract_data: [], // 收件展示
			contract_data_str: "",
			copy_person: [], // 抄送
			copy_person_str: "",
			email_lists: [], // 可发邮箱
			title: "", // 主题
			enclosure: [], // 附件
			content: "", // 富文本内容
			send_people: "", // 发件人
			staff_email_id: "",
			account: "",
			contract_arr: [],
			copy_arr: []
		};
	},

	computed: {
		send_person() {
			return getItem(`staff_${this.$global.version}`).staff.staff_name + "<" + this.account + ">";
		}
	},

	mounted() {
		let contract_data = JSON.parse(JSON.parse(JSON.stringify(getItem(`contract_data_${this.$global.version}`))));

		if (contract_data) {
			this.loadData(contract_data);
		} else {
			this.loadLocalData();
		}
	},

	methods: {
		loadData(contract_data) {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_SEND_EMAIL_SHOW_GET,
				type: "POST",
				param: {
					ids: contract_data,
					type: 1
				}
			}).then(res => {
				this.contract_data = res.data.addressee_person;
				this.email_lists = res.data.email_lists;
				this.staff_email_id = this.email_lists[0].staff_email_id;
				this.account = this.email_lists[0].account;

				this.contract_data.forEach(item => {
					this.contract_arr.push({
						attach_id: item.attach_id,
						email: (item.addressee_name ? item.addressee_name : "") + "<" + item.email + ">"
					});
				});

				let url = this.$route.query.flag == 1 ? "/sc/customer/cooperate/send-email" : "/sc/product/send-email";
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		// 得到localStorage里面的数据
		loadLocalData() {
			let sendDetail = JSON.parse(JSON.parse(JSON.stringify(getItem(`look_mail_${this.$global.version}`))));

			this.contract_data = sendDetail.address ? sendDetail.address : sendDetail.addressee_person;
			this.copy_person = sendDetail.copy_person;
			this.content = sendDetail.content;
			this.title = sendDetail.title;
			this.email_lists = sendDetail.email_lists;
			this.account = sendDetail.account;
			this.staff_email_id = sendDetail.staff_email_id;
			let urlTitle = "";
			let urlType = "";

			sendDetail.enclosure.forEach(item => {
				urlTitle = item.url ? item.url.substring(item.url.lastIndexOf("/") + 1, item.url.length) 
					: item.substring(item.lastIndexOf("/") + 1, item.length);
				urlType = item.url ? "." + item.url.substring(item.url.lastIndexOf(".") + 1, item.url.length)
					: "." + item.substring(item.lastIndexOf(".") + 1, item.length);

				this.enclosure.push({
					url: item.url ? item.url : item,
					title: urlTitle,
					type: urlType,
					uid: item.url ? item.url : item,
					file_id: item.email_id
				});
			});

			this.contract_data.forEach(item => {
				this.contract_arr.push({
					attach_id: item.attach_id || "",
					email: item.addressee_name ? item.addressee_name + "<" + item.email + ">" : item.email
				});
			});

			this.copy_person.forEach(item => {
				this.copy_arr.push({
					email: item.addressee_name ? item.addressee_name + "<" + item.email + ">" : item.email
				});
			});
		},

		handleCancel() {
			PromptModal.popup({
				name: "2"
			}).then(res => {
				let url = this.$route.query.flag == 1 ? "/sc/customer/cooperate" : "/sc/product";
	
				res && this.$router.push({
					path: url
				}); 
			});
		},

		handleSend() {
			let brr = [];
			this.contract_data = [];

			for (let i = 0; i < this.$refs.contractMail.emails.length; i++) {
				if (this.$refs.contractMail.emails[i].valid) {
					this.$Message.error("收件人中有错误的格式");
					return;
				} else if (this.$refs.contractMail.emails[i].email.indexOf("<") > -1) {
					brr = this.$refs.contractMail.emails[i].email.split("<");
					let attach_id = this.$refs.contractMail.dataSource[i].attach_id;

					this.contract_data.push({
						attach_id: attach_id || "",
						addressee_name: brr[0],
						email: brr[1] && brr[1].slice(0, brr[1].length - 1)
					});
				} else {
					this.contract_data.push({
						addressee_name: "",
						email: this.$refs.contractMail.emails[i].email
					});
				}
			}

			if (this.contract_data.length === 0) {
				this.$Message.error("收件人不能为空");
				return;
			}

			brr = [];
			this.copy_person = [];

			for (let i = 0; i < this.$refs.copyMail.emails.length; i++) {
				if (this.$refs.copyMail.emails[i].valid) {
					this.$Message.error("抄送中有错误的格式");

					return;
				} else if (this.$refs.copyMail.emails[i].email.indexOf("<") > -1) {
					brr = this.$refs.copyMail.emails[i].email.split("<");

					this.copy_person.push({
						addressee_name: brr[0],
						email: brr[1] && brr[1].slice(0, brr[1].length - 1)
					});
				} else {
					this.copy_person.push({
						addressee_name: "",
						email: this.$refs.copyMail.emails[i].email
					});
				}
			}
				
			PromptModal.popup({
				name: "1"
			}).then(res => {
				let enclosure = [];

				this.enclosure.forEach(item => {
					enclosure.push(item.url);
				});

				let information = {
					addressee_person: this.contract_data,
					copy_person: this.copy_person,
					title: this.title,
					content: this.content,
					staff_email_id: this.staff_email_id,
					enclosure
				};

				this.$request({
					url: API_ROOT._SC_CUSTOMER_COOPERATE_SEND_EMAIL_POST,
					type: "POST",
					param: {
						...information,
						type: 1
					}
				}).then(ress => {
					this.$Message.success(ress.msg);
					let url = this.$route.query.flag == 1 ? "/sc/customer/cooperate/outbox" : "/sc/product/outbox";

					information.email_lists = this.email_lists;
					setItem(`look_mail_${this.$global.version}`, JSON.stringify(information));
			
					this.$router.push({
						path: url,
						query: {
							flag: this.$route.query.flag
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
				staff_email_id: this.staff_email_id ? Number(this.staff_email_id) : Number(this.email_lists[0].staff_email_id)
			}).then(res => {
				if (res) {
					this.staff_email_id = res;

					this.email_lists.forEach(item => {
						if (item.staff_email_id === this.staff_email_id) {
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
.v-sc-cooperate-send-email{
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