<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="查看"
		class="v-hr-archives-employee-customer-watch-modal"
		width="680"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div ref="content" class="g-fs-14 _content">
			<div class="g-flex g-jc-sb g-fw-w">
				<i-row class="g-m-t-10 _row">
					<i-col span="10">提交人：</i-col>
					<i-col span="14">{{ details.staff_name }}</i-col>
				</i-row>
				<i-row class="g-m-t-10 _row">
					<i-col span="10">提交时间：</i-col>
					<i-col span="14">{{ details.create_time }}</i-col>
				</i-row>
				<i-row class="g-m-t-10 _row">
					<i-col span="10">质检人：</i-col>
					<i-col span="14">{{ details.audit_staff_name }}</i-col>
				</i-row>
				<i-row class="g-m-t-10 _row">
					<i-col span="10">审核时间：</i-col>
					<i-col span="14">{{ details.audit_time }}</i-col>
				</i-row>
			</div>
			<i-row class="g-m-t-10 _row">
				<i-col span="10">审核状态：</i-col>
				<i-col span="14">{{ details.status === '0' ? '待审核' : (details.status === '1' ? '审核通过' : '审核驳回') }}</i-col>
			</i-row>
			<i-row class="g-m-t-10 _row">
				<i-col span="10">备注：</i-col>
				<i-col span="14">{{ details.audit_mark }}</i-col>
			</i-row>
			<div class="g-m-t-20">
				<!-- <vc-imgs-preview :data-source="imgs" /> -->
				<oa-upload
					v-model="imgs"
					disabled
					@preview-start="handlePreviewStart"
					@preview-end="handlePreviewEnd"
				/>
			</div>
			<div>
				服务备注：{{ details.remarks }}
			</div>
		</div>
		<div
			:style="{top: topDis + 'px'}"
			class="_left"
			style="transform: rotate(180deg);"
			@click="handlePrev">
			<i class="iconfont icon-right" />
		</div>
		<div :style="{top: topDis + 'px'}" class="_right" @click="handleNext">
			<i class="iconfont icon-right" />
		</div>
	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Modal, DatePicker, Form, FormItem, Row, Col } from "iview";
import { CreatePortal, ImgsPreview } from "wya-vc";
import { formatMoment } from "@utils/utils";
import Upload from '@components/_common/upload/upload';
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "hr-archives-employee-customer-watch-modal",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		'i-date-picker': DatePicker,
		"i-row": Row,
		"i-col": Col,
		'vc-imgs-preview': ImgsPreview,
		"oa-upload": Upload,
	},
	mixins: [orderModal],
	props: {
		detail: Array
	},
	data() {
		return {
			visible: false,
			index: 0,
			topDis: 240,
			details: {},
			serviceList: []
		};
	},
	computed: {
		imgs() {
			if (this.details.fileImage && this.details.fileImage.length) {
				let arr = [];
				this.details.fileImage.forEach((item, index) => {
					arr[index] = {};
					arr[index].url = item.img_url;
					arr[index].type = item.img_url.substr(item.img_url.lastIndexOf('.'));
				});
				return arr;
			} else {
				return [];
			}
		}
	},
	watch: {
		'imgs': {
			handler() {
				this.$nextTick(() => {
					this.topDis = this.$refs.content.offsetHeight / 2 + 41;
				});
			}
		}
	},
	mounted() {
		this.visible = true;
		// this.loadData();
		this.serviceList = this.detail;
		this.index = 0;
		this.details = this.serviceList[0];
		this.$nextTick(() => {
			this.topDis = this.$refs.content.offsetHeight / 2 + 41;
		});
	},
	methods: {
		loadData() {
			// this.$request({
			// 	url: 'HR_ARCHIVES_EMPLOYEE_SERVICE_DETAIL_GET',
			// 	type: 'GET',
			// 	param: {
			// 		// this.info.service_item_id 39366
			// 		service_item_id: this.info.service_item_id
			// 	},
			// }).then((res) => {
			// 	if (res.data.length) {
			// 		this.serviceList = res.data;
			// 		this.index = 0;
			// 		this.details = this.serviceList[0];
			// 	}
			// }).catch((error) => {
			// });
		},
		handlePrev() {
			if (this.serviceList.length) {
				if (this.index === 0) {
					this.$Message.warning('到头了');
				} else {
					this.index--;
					this.details = this.serviceList[this.index];
				}
			} else {
				this.$Message.warning('暂无数据');
			}
		},
		handleNext() {
			if (this.serviceList.length) {
				if (this.index === this.serviceList.length - 1) {
					this.$Message.warning('到底了');
				} else {
					this.index++;
					this.details = this.serviceList[this.index];
				}
			} else {
				this.$Message.warning('暂无数据');
			}
		},
		handlePreviewStart() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handlePreviewEnd() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			this.$emit("sure");
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-archives-employee-customer-watch-modal {
	._content {
		max-height: 450px;
		overflow: auto;
		padding-left: 54px;
		padding-right: 54px;
		._row {
			width: 250px;
			line-height: 32px;
			border-bottom: 1px solid #EBEEF1;
			.ivu-col:first-of-type {
				width: 100px;
			}
			.ivu-col:last-of-type {
				width: 150px;
			}
		}
	}
	._left, ._right {
		width: 30px;
		height: 30px;
		position: absolute;
		line-height: 30px;
		border-radius: 50%;
		background:#C4C4C4;
		i {
			margin-left: 6px;
			color: #fff;
			font-size: 14px;
		}
	}
	._left {
		left: 10px;
	}
	._right {
		right: 10px;
	}
}
</style>

