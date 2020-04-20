<template>
	<i-modal
		ref="modal"
		:value="visible"
		:mask-closable="false"
		:title="info.title"
		:mask="true"
		class-name="v-sale-main-msg-modal"
		draggable
		scrollable
	>
		<div class="_content">{{ info.content }}</div>
		<div slot="footer" class="g-flex-ac g-jc-fe">
			<div
				:class="info.wait_time> 0 && info.notice_type == 2 ? 'g-disabled-btn' : 'g-red-btn'"
				@click="handleOk"
			>
				{{ okText }}
			</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Message } from 'iview';
import API from "@stores/apis/root";

export default {
	name: 'sale-main-msg-modal',
	components: {
		'i-modal': Modal,
	},
	props: {
		title: String,
		content: String,
		hierarchy: String | Number,
		mask: String | Number,
		length: String | Number,

		info: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			visible: false,
			seconds: 10,
			notice: Array,
			okText: this.info.notice_type == 1 ? '确定并遵守' : `确定(${this.info.wait_time})`
		};
	},
	computed: {
		id() {
			return this.info.notice_id;
		},

	},
	created() {
		this.notice = JSON.parse(sessionStorage.getItem('notice'));
	},
	mounted() {
		this.visible = true;
		this.$refs.modal.$refs.content.style.top = `${this.hierarchy * 40}px`;
		this.$refs.modal.$refs.content.style.left = `${this.hierarchy * 40}px`;
		if (this.info.notice_type == 2) {
			this.timer = setInterval(() => {
				if (this.info.wait_time <= 0) {
					this.timer && clearInterval(this.timer);
					this.timer = null;
					this.okText = `确定`;
				} else {
					this.info.wait_time--;
					this.okText = `确定(${this.info.wait_time})`;
				}
			}, 1000);

		} else {
			if (this.mask == 0) {
				this.$refs.modal.$el.children[0].style.backgroundColor = 'rgba(55,55,55,.6)';
			}
			this.$refs.modal.$el.children[0].style.pointerEvents = 'visibleStroke';
		}
	},
	methods: {
		handleOk() {
			if (this.info.wait_time > 0 && this.info.notice_type == 2) return;
			this.visible = false;
			this.$refs.modal.$el.children[0].style.backgroundColor = 'transparent';
			this.$refs.modal.$el.children[0].style.pointerEvents = 'none';
			// 已读消息存入session
			this.notice = JSON.parse(sessionStorage.getItem('notice'));
			this.notice.splice(this.mask, 1, '2');
			sessionStorage.setItem("notice", JSON.stringify(this.notice));
			if (this.info.send_type == 1) {
				this.handleIsRead(this.info.notice_id);
			}
			this.$emit('close', { index: this.hierarchy });

		},
		handleIsRead(v) {
			this.$request({
				url: API._SALE_MAIN_IS_READ_NOTICE_POST,
				type: "post",
				param: {
					notice_id: v,
				}
			}).then(res => {
				this.set = !this.set;
			}).catch(error => {
				console.error(error);
			});
		},
	}
};
</script>

<style lang="scss">
.v-sale-main-msg-modal {
	.ivu-modal-close {
		display: none;
	}
	.ivu-modal-content {
		width: 450px !important;
	}
	.ivu-modal-body {
		min-height: 230px;
		display: flex;
		align-items: center;
		font-size: 14px;
	}
	.ivu-modal-footer {
		padding: 0 20px 20px 20px !important;
	}
	._content {
		min-height: 150px;
		padding:10px 20px 10px 20px;
		color: #333333;
		font-size: 14px;
	}
}
</style>