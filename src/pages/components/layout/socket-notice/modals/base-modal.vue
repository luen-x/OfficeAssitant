<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:mask="false"
		:class-name="'v-socket-notice-tip-'+indexC+' '+componentId"
		:footer-hide="footerHide"
		:title="title"
		draggable
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="_content">
			<slot/>
		</div>
		<div slot="footer">
			<i-button v-if="cancelText != ''" type="text" @click="handleCancel">{{ cancelText }}</i-button>
			<i-button type="primary" @click="handleOk">{{ okText }}</i-button>
		</div>
	</i-modal>
</template>
<script >
import { Modal, Button } from 'iview';

export default {
	name: "oa-sale-main-archieve-expire-tip",
	components: {
		'i-modal': Modal,
		'i-button': Button
	},
	props: {
		index: Number,
		footerHide: Boolean,
		cancelText: {
			type: String,
			default: '取消'
		},
		okText: {
			type: String,
			default: '确认'
		},
		title: {
			type: String,
			default: '提示'
		},
		alertId: [Number, String]
	},
	data() {
		return {
			visible: false,
		};
	},
	computed: {
		indexC() {
			if (this.index > 4) {
				return 4;
			} else {
				return this.index;
			}
		},
		componentId() {
			return 'v-socket-notice-tip-id' + this._uid;
		}
	},
	mounted() {
		this.visible = true;
		this.updateHeight();
	},
	methods: {
		handleOk(data) {
			this.visible = false;
			this.alertId && this.handleMark();
			this.$emit('sure', data);
			this.$emit('on-ok');
		},
		handleCancel(data) {
			this.visible = false;
			this.alertId && this.handleMark();
			this.$emit('close', data);
			this.$emit('on-cancel');
		},
		updateHeight() {
			this.$nextTick(() => {
				const modalContent = document.querySelector('.' + this.componentId + ' .ivu-modal-content');
				const content = document.querySelector('.' + this.componentId + ' ._content');
				modalContent.style.height = content.clientHeight + 140 + 'px';
			});
		},
		// 标记已读
		handleMark() {
			this.$request({
				url: "_NOTICE_READED_COUNT_POST",
				type: "POST",
				param: {
					alert_ids: [this.alertId]
				},
				loading: false,
			}).then(res => {
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
			
		}
		
	}
};

</script>
<style lang="scss">
.v-socket-notice-tip{
	&-0,&-1,&-2,&-3,&-4{
		.ivu-modal{
			position: fixed;
			bottom: 0px;
			right: 0px;
			.ivu-modal-content{
				position:fixed;
				height: 160px;
				._content {
					padding: 23px 20px 0px 20px

				}
			}
		}
	}
	&-0{
		.ivu-modal-content{
			bottom: 20px;
			right: 20px;
			
		}
	}
	&-1{
		.ivu-modal-content{
			bottom: 40px;
			right: 40px;
		}
	}
	&-2{
		.ivu-modal-content{
			bottom: 60px;
			right: 60px;
		}
	}
	&-3{
		.ivu-modal-content{
			bottom: 80px;
			right: 80px;
		}
	}
	&-4{
		.ivu-modal-content{
			bottom: 100px;
			right: 100px;
		}
	}

}

</style>