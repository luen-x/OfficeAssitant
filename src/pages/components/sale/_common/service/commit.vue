<template>
	<i-drawer 
		v-model="visible" 
		:mask-closable="false" 
		:mask="false"
		class="v-sale-commit-record"
		@on-close="handleCancel" >

		<h2 class="_detail-header g-fs-16 g-m-b-20">
			服务提交记录
		</h2>
		<div class="_detail-content" >
			<oa-loading v-if="loading"/>
			<div 
				v-if="!list.length" 
				class="g-flex g-jc-c g-ai-c"
				style="height:100%"
			>
				<div style="width:416px;">
					<img :src="OSS_SEARCH_EMPTY" >
					<div class="g-tc">暂无提交记录，赶快添加一条吧~ </div>
				</div>
			</div>
			<div v-else>
				<div
					v-for="item in list"
					:key="item.record_id"
					class="__item g-pd-10 g-m-b-10 g-m-r-20"
				>
					<div class="__top g-pd-b-10">
						<div>
							<div class="__tip g-flex g-jc-sb">
								<div class="g-flex">
									<span class="g-c-black4">审核信息：</span>
									<span 
										v-if="item.status === 2"
										class="__off-grade"
									>
										审核驳回
									</span>
									<span 
										v-else-if="item.status === 1 || item.status === 3"
										class="__up-grade"
									>
										审核通过
									</span>
									<span 
										v-else-if="item.status === 4"
										class="__up-grade"
									>
										已评
									</span>
									<span v-else class="__audit">待审核</span>
									<div 
										v-if="item.status"
										class="g-flex"
									>
										<span class="g-pd-lr-15">|</span>
										<div class="__tip">
											<span>审核人：</span>
											<span >{{ item.audit_staff_name }}</span>
										</div>
										<span class="g-pd-lr-15">|</span>
										<div class="__tip">
											<span>审核时间：</span>
											<span>{{ item.audit_time }}</span>
										</div>
									</div>
								</div>
								<div 
									v-if="!item.status" 
									class="g-c-blue-mid"
								>
									<span
										class="g-pointer"
										@click="handleEdit(item.record_id)"
									>
										重新编辑
									</span>
									<span class="g-pd-lr-10">|</span>
									<span
										class="g-pointer"
										@click="handleReset(item.record_id)"
									>
										撤回
									</span>
								</div>
							</div>
						</div>
						<div v-if="item.status" class="g-m-t-10">
							<span class="g-c-black4">审核备注：</span>
							<span class="g-lh-30 g-c-black3">{{ item.audit_mark || '--' }}</span>
						</div>
					</div>
					<div class="__middle">
						<div class="g-m-t-10">
							<span class="g-c-black4">服务备注：</span>
							<span class="g-lh-30 g-c-black3">{{ item.remarks || '--' }}</span>
						</div>
						<div class="g-m-t-10 g-flex">
							<div class="g-m-r-30">
								<span class="g-c-black4">服务次数：</span>
								<span class="g-lh-30 g-c-black3">{{ item.service_times }}</span>
							</div>
							<div class="g-m-l-30">
								<span class="g-c-black4">服务素材月份：</span>
								<span class="g-lh-30 g-c-black3">{{ item.material_month || '--' }}</span>
							</div>
						</div>
						<div class="g-m-t-10 g-flex">
							<span class="g-c-black4">服务凭证：</span>
							<oa-upload
								:max="6"
								:data-source="item.fileImage.map(it =>({
									type: it.img_url.substr(it.img_url.lastIndexOf('.')),
									url: it.img_url
								}))"
								disabled
								@preview-start="handlePreviewStart"
								@preview-end="handlePreviewEnd"
							>
								<span slot="trigger"/>
							</oa-upload>
						</div>
					</div>
					<div class="__bottom g-flex g-jc-fe">
						<div class="__tip">
							<span>提交人：</span>
							<span>{{ item.staff_name }}</span>
						</div>
						<span class="g-pd-lr-15 __tip">|</span>
						<div class="__tip">
							<span>提交时间：</span>
							<span>{{ item.create_time }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="_btn-box">
			<i-page 
				:total="totalCount"
				:current="currentPage"
				:page-size="pageSize"
				show-total 
				show-elevator 
				show-sizer
				class="g-m-t-15"
				@on-change="handleChange"
				@on-page-size-change="handlePageSizeChange"
			/>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Page } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import Upload from '@components/_common/upload/upload';
import { Confirm } from '@components/_common/confirm/confirm';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import Loading from '@components/_common/loading/loading';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { ServiceSubmit } from './submit';

export default {
	name: "oa-commit-record",
	components: {
		'i-drawer': Drawer,
		'i-page': Page,
		'oa-loading': Loading,
		"oa-upload": Upload,
	},
	mixins: [orderModal],
	props: {
		curIndex: [String, Number],
		serviceItemId: [String, Number],
		contractCompanyId: [String, Number]
	},
	data() {
		return {
			visible: false,
			loading: false,
			totalCount: 0,
			currentPage: 1,
			pageSize: 10,
			list: [],
			OSS_SEARCH_EMPTY
		};
	},
	mounted() {
		this.visible = true;
		this.loadData({ page: 1 });
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData(initPage) {
			this.loading = true;
			this.list = [];

			this.$request({
				url: '_SALE_SERVICE_RECORD_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
					...initPage,
					contract_company_id: this.contractCompanyId,
					service_item_id: this.serviceItemId,
					pageSize: this.pageSize
				},
				autoTip: false
			}).then(res => {
				this.loading = false;
				this.totalCount = res.data.totalCount;
				this.currentPage = res.data.currentPage;
				this.list = res.data.list;
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		/**
		 * 监听页码的变化
		 */
		handleChange(page) {
			this.loadData({ page });
		},
		/**
		 * 监听每页显示条数的变化
		 */
		handlePageSizeChange(size) {
			this.pageSize = size;
			this.loadData({ page: 1 });
		},
		/**
		 * 编辑待审核状态的提交记录
		 */
		handleEdit(record_id) {
			this.$request({
				url: '_SALE_SERVICE_RECORD_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: {
					record_id
				},
				autoTip: false
			}).then(res => {
				ServiceSubmit.popup({
					setId: res.data.set_id,
					recordId: res.data.record_id,
					remarks: res.data.remarks,
					serviceName: res.data.service_name,
					serviceTimes: res.data.service_times,
					materialMonth: res.data.material_month,
					contractCompanyId: this.contractCompanyId,
					fileImage: res.data.fileImage.map((it, uid) => ({
						uid,
						title: it.img_url.substr(it.img_url.lastIndexOf('/') + 1),
						type: it.img_url.substr(it.img_url.lastIndexOf('.')),
						url: it.img_url
					}))
				}).then(data => {
					if (data.changed) {
						this.loadData({ page: 1 });
						this.$vc.emit('SALE_SERVICE_DO_EDIT', { index: this.curIndex, changed: true });
					}
				}).catch(error => {
					error && console.error(error);
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 撤回
		 */
		handleReset(record_id) {
			Confirm.popup({
				title: '确认撤回',
				msg: '确认撤回该服务项？'
			}).then(() => {
				this.$request({
					url: '_SALE_SERVICE_CANCEL_RECORD_POST',
					type: 'POST',
					loading: false,
					param: {
						record_id
					},
					autoTip: true
				}).then(res => {
					this.loadData({ page: 1 });
					this.$vc.emit('SALE_SERVICE_DO_EDIT', { index: this.curIndex, changed: true });
				});
			}).catch((error) => {
				error && console.error(error);
			});
		},
		handlePreviewStart() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handlePreviewEnd() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};

export const ServiceCommitRecord = CreatePortal({ alive: true }, module.exports.default);

</script>
<style lang="scss">
.v-sale-commit-record {
	._detail-header {
		color: #000;
		padding: 16px;
		font-weight: normal;
		border-bottom: 1px solid #d4d7db;
	}
	._detail-content {
		padding: 0 16px;
		height: calc(100% - 145px);
		overflow: auto;
		.__item {
			background-color: #f6f6f6;
			.__top {
				border-bottom: 1px solid #e8e8e8;
				.__audit {
					color: #ed8f4a;
				}
				.__up-grade {
					color: #4fc43d;
				}
				.__off-grade {
					color: #e84854;
				}
			}
			.__middle {
				.__img {
					width: 60px;
					height: 60px;
				}
			}
			.__tip {
				color: #818794;
			}
		}
	}
	._btn-box {
		width: 100%;
		height: 60px;
		position: fixed;
		background-color: #fff;
		bottom: 0px;
		padding: 0 16px;
		border-top: 1px solid #e8e8e8;
		-webkit-box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	.ivu-drawer-body {
		padding: 0;
	}
	.ivu-page {
		margin-left: 550px;
	}
}
</style>
