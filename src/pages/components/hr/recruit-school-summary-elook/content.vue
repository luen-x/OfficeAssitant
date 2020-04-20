<template>
	<div class="v-hr-recruit-school-look-email">
		<div class="g-flex g-flex-ac g-pd-t-20 g-pd-b-10 _top">
			<span class="g-m-r-20">主题：</span>
			<span>{{ detail.title }}</span>
		</div>
		<div class="g-flex g-flex-ac g-pd-t-20 g-pd-b-10 _top">
			<span class="g-m-r-20">发件人：</span>
			<span>{{ staffName }}</span>
		</div>
		<div class="g-flex g-flex-ac g-pd-t-20 g-pd-b-10 _top">
			<span class="g-m-r-20">发送时间：</span>
			<span>{{ detail.create_time }}</span>
		</div>
		<div class="g-flex g-flex-ac g-pd-t-20 g-pd-b-10 _top">
			<span class="g-m-r-20 g-inline-block" style="width: 80px;">收件人：</span>
			<span style="text-align:left;width: 95%;">{{ address }}</span>
		</div>
		<div class="g-flex g-flex-ac g-pd-t-20 g-pd-b-10 _top">
			<span class="g-m-r-20">抄送：</span>
			<span>{{ copy_person }}</span>
		</div>
		<div class="g-flex g-flex-ac g-pd-t-20 g-pd-b-10 _top" style="border-bottom: none;">
			<span class="g-m-r-20">发送状态：</span>
			<span
				style="color: #2397F9;text-align:left;"
				class="g-pointer"
				@click="handleToggle('expand')"
			>
				{{ show ? "收起" : "展开" }}
			</span>
		</div>

		<vc-expand
			ref="expand"
			v-model="show"
		>
			<i-table
				:columns="columns"
				:data="detail.addressee_lists"
				border
				class="g-m-t-20 g-m-l-30"
			/>
		</vc-expand>
		<div class="g-m-t-20 g-m-l-30">
			<oa-editor-preview :content="detail.content"/>
		</div>
		<div class="g-m-t-20 g-m-l-20">
			<i class="iconfont icon-lianjie g-fs-16 g-m-r-10"/>
			<span>附件（{{ detail.enclosure && detail.enclosure.length != 0 ? detail.enclosure.length : 0 }}个）</span>
			<oa-upload
				v-model="enclosure"
				:max="10"
				disabled
				class="g-m-t-15"
				style="cursor: pointer;color: #2397F9;"
			/>
		</div>

		<footer class="g-flex-ac">
			<vc-debounce-click class="g-gray-btn-small g-m-r-10" @click="handleGo">
				返回
			</vc-debounce-click>
			<vc-debounce-click class="g-red-btn-small" style="width: 80px;" @click="handleEdit">
				再次编辑
			</vc-debounce-click>
		</footer>
	</div>
</template>

<script>
import { Table } from "iview";
import Upload from "@components/_common/upload/upload";
import API_ROOT from "@stores/apis/root";
import { Expand } from "wya-vc";
import { setItem, getItem, getHashUrl } from "@utils/utils";
import EditorPreview from '@common/editor-preview/editor-preview';

export default {
	name: 'oa-send-email',

	components: {
		"i-table": Table,
		"oa-upload": Upload,
		"vc-expand": Expand,
		'oa-editor-preview': EditorPreview
	},

	data() {
		return {
			show: true,
			detail: {},
			enclosure: [],
			staffName: "", // 发件人
			columns: [
				  {
					title: "收件人",
					key: "address",
					render: (h, params) => {
						return (
							<div>{ params.row.addressee_emails.join(";") }</div>
						);
					}
				},
				{
					title: "投递状态",
					key: "status",
					render: (h, params) => {
						let status = this.handleStatus(Number(params.row.status));

						return (
							<div>{ status }</div>
						);
					}
				}
			]
		};
	},

	computed: {
		address() {
			if (this.detail.address && this.detail.address.length != 0) {
				let str = "";

				this.detail.address.forEach(item => {
					str += item.addressee_name + "<" + item.email + ">;";
				});

				return str;
			} else {
				return null;
			}
		},

		copy_person() {
			if (this.detail.copy_person && this.detail.copy_person.length != 0) {
				let str = "";
				this.detail.copy_person.forEach(item => {
					str += item.addressee_name + "<" + item.email + ">;";
				});
				return str;
			} else {
				return null;
			}
		}
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.$request({
				url: API_ROOT._HR_RECRUIT_EMAIL_DETAIL_GET,
				type: "GET",
				param: {
					email_id: this.$route.query.email_id
				}
			}).then(res => {
				this.detail = res.data;
				this.staffName = this.detail.staff_name + "<" + this.detail.email + ">";

				res.data.enclosure.forEach(item => {
					this.enclosure.push({
						url: item.url,
						title: item.url.substring(item.url.lastIndexOf("/") + 1, item.url.length),
						type: "." + item.url.substring(item.url.lastIndexOf(".") + 1, item.url.length),
						uid: item.url,
						file_id: item.email_id
					});
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleToggle(value) {
			this.$refs[value].toggle();
		},

		handleStatus(status) {
			switch (status) {
				case 1:
					return "发信中";

				case 2:
					return "被退信";

				case 3:
					return "发信成功";

				case 4:
					return "发信失败";

				case 11:
					return "收信被拦截";

				case 12:
					return "收信，邮件进入垃圾箱";

				case 13:
					return "收信成功，邮件在收件箱";

				case 14:
					return "收信成功，邮件在个人文件夹";

				case 15:
					return "未知状态";

				default:
					break;
			}
		},

		handleEdit() {
			if (this.$route.query.recruitType === 'school') {
				this.$router.push(getHashUrl('/hr/recruit/school/summary/email', {
					email_id: this.$route.query.email_id,
					recruitType: 'school'
				}));
			} else {
				this.$router.push(getHashUrl('/hr/recruit/social/summary/email', {
					email_id: this.$route.query.email_id,
					recruitType: 'social'
				}));
			}
		},

		handleGo() {
			this.$router.back();
		}
	},
};
</script>

<style lang="scss">
.v-hr-recruit-school-look-email{
	width: 80%;
	margin-bottom: 60px;

	._top{
		border-bottom: 1px solid #EBEEF1;

		span{
			display: inline-block;
			text-align: right;
			color: #818794;

			&:nth-of-type(1){
				width: 80px;
			}
		}

		input{
			width: 100%;
		}
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

	.__btn{
		display: none !important;
	}

	ul{
		li{
			list-style: disc !important;
		}
	}

	ol{
		li{
			list-style: decimal !important;
		}
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
