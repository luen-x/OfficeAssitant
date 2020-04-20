<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="查看作业"
		width="400px"
		class="v-academy-train-plan-train-detail-exam-voucher-modal"
		@on-ok="handleSubmit"
		@on-cancel="handleCancel"
	>
		<i-row class="g-m-b-15">
			<i-col span="5" style="width: 88px;" class="g-tr">课程：</i-col>
			<i-col span="17">{{ course_name }}</i-col>
		</i-row>
		<i-row class="g-m-b-15">
			<i-col span="5" style="width: 88px;" class="g-tr">作业：</i-col>
			<i-col span="17">
				<div
					v-for="(item, index) in imgs"
					:key="index"
				>
					<div
						class="g-operation g-flex"
						@click="handlePreview($event,item)"
					>
						<i class="iconfont icon-accessory"/>
						<span
							v-if="item.title.length < 18"
							style="width: 250px; word-break: break-all;line-height:
                                    14px;">
							{{ item.title }}
							<span
								style="display:inline-block;padding:0 20px"
								@click.stop="handleDownload(item)">
								<i class="iconfont icon-download"/>
							</span>
						</span>
						<i-tooltip
							v-else
							:content="item.title"
							placement="top"
							theme="light"
							max-width="320">
							{{ item.title.slice(0, 18) + '...' }}
							<span
								style="display:inline-block;padding:0 20px"
								@click.stop="handleDownload(item)">
								<i class="iconfont icon-download"/>
							</span>
						</i-tooltip>
					</div>
				</div>
				<div
					v-for="item in linkUrl"
					:key="item.img_url"
				>
					<div
						class="g-operation g-flex"
						@click="handleToUrl(item)"
					>
						<i class="iconfont icon-accessory"/>
						<span
							v-if="item.img_url.length < 18"
							style="width: 200px; word-break: break-all;line-height:
                                    14px;">
							{{ item.img_url }}
						</span>
						<i-tooltip
							v-else
							:content="item.img_url"
							placement="top"
							theme="light"
							max-width="300">
							{{ item.img_url.slice(0, 18) + '...' }}
						</i-tooltip>
					</div>
				</div>
				<span v-if="!imgs.length && !linkUrl.length">未上传作业</span>
			</i-col>
		</i-row>
	</i-modal>
</template>

<script>
import { Modal, Row, Col, Tooltip } from 'iview';
import { CreatePortal } from 'wya-vc';
import downloadFile from '@utils/download';
import API_ROOT from '@stores/apis/root';
import { FilePreview } from '@common/file-preview/file-preview';
import { dataValidity, objRegex } from '@utils/utils';
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "v-academy-train-plan-train-detail-exam-voucher-modal",
	components: {
		'i-modal': Modal,
		'i-col': Col,
		'i-row': Row,
		'i-tooltip': Tooltip,
	},
	mixins: [orderModal],
	props: {
		data: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			visible: false,
			course_name: '',
			imgs: [],
			linkUrl: [],
			vm: null,
		};
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;
		document.body.addEventListener('keyup', this.handleKeyUp);
	},
	beforeDestroy() {
		document.body.removeEventListener('keyup', this.handleKeyUp);
	},
	methods: {
		loadData() {
			this.course_name = this.data.course_name;
			this.data.fileImage.filter(v => v.type == 1).forEach(ele => {
				this.imgs.push({
					percent: "100.00",
					title: ele.img_url.split('/').pop(),
					url: ele.img_url });
			});
			this.data.fileImage.filter(v => v.type == 2).forEach(ele => {
				this.linkUrl.push({
					img_url: ele.img_url
				});
			});
		},
		handleDownload(item) {
			downloadFile({
				fileName: item.url
			});
		},
		handleToUrl(e) {
			let reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
			let url = e.img_url.match(reg) || e.img_url;
			let img_url = objRegex.validURLScheme.regex.test(url) ? url : `http://${url}`;
			window.open(img_url);
		},
		handlePreview(e, item) {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
			this.vm = null;
			FilePreview.popup({
				data: {
					fileUrl: item.url,
					x: e.clientX,
					y: e.clientY
				},
				getInstance: v => this.vm = v
			}).then((res) => {
			}).catch((err) => {

			}).finally(() => {
				this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
				this.vm = null;
			});
		},
		handleKeyUp(event) {
			if (event.keyCode === 27 && this.vm) {
				this.vm.visible = false;
				setTimeout(() => {
					this.vm.$emit('close');
					this.vm = null;
				}, 0);
			}
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSubmit() {
			this.visible = false;
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleChange(value) {
			// this.formValidate.selected = [];
		},
	}
};
export const VoucherModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-academy-train-plan-train-detail-exam-voucher-modal {
}	
</style>

