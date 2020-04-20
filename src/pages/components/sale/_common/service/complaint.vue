<template>
	<div 
		:style="!list.length ? 'height:calc(100% - 60px);' : 'height:auto;'"
		class="g-relative g-pd-r-20"
	>
		<oa-loading v-if="loading"/>
		<div class="g-m-b-30 v-sale-service-complaint">
			<div class="_detail-content">
				<div 
					v-if="!list.length" 
					class="g-flex g-jc-c g-ai-c"
					style="height:100%"
				>
					<div style="width:416px;">
						<img :src="OSS_SEARCH_EMPTY" >
						<div class="g-tc">该客户没有任何投诉记录,请继续保持，做好服务哦!</div>
					</div>
				</div>
				<div v-else>
					<div>
						<div class="g-m-tb-20 g-fs-14">
							<span class="__title-bar"/>
							<span class="g-pd-l-5">投诉记录</span>
						</div>
						<div class="__content">
							<div 
								v-for="(item, index) in list" 
								:key="index"
								class="__item g-pd-10 g-m-b-10"
							>
								<div 
									class="g-flex g-ai-c g-pd-5 g-c-black4" 
									style="background-color: #f6f6f6;"
								>
									<div>
										<span>投诉对象：</span>
										<span v-if="item.complaint_staff">
											<i-tooltip 
												v-if="item.complaint_staff.length > 5"
												:content="item.complaint_staff"
												:max-width="300"
												transfer
											>
												{{ item.complaint_staff.substr(0, 5) + '...' }}
											</i-tooltip>
											<span v-else>{{ item.complaint_staff }}</span>
										</span>
										<span v-else>--</span>
									</div>
									<span class="g-pd-lr-20">|</span>
									<div>
										<span>投诉部门：</span>
										<span>{{ item.complaint_depart || '--' }}</span>
									</div>
									<span class="g-pd-lr-20">|</span>
									<div>
										<span>投诉时间：</span>
										<span>{{ item.complaint_time || '--' }}</span>
									</div>
									<span class="g-pd-lr-20">|</span>
									<div>
										<span>投诉方式：</span>
										<span>
											{{ ['微信投诉','电话投诉','跑到办公室投诉','客户对外负面传播','其他'][item.complaint_type * 1 - 1] || '--' }}
										</span>
									</div>
								</div>
								<div class="__info g-m-b-10 g-m-r-10 g-m-t-10 g-m-l-5 g-flex">
									<div class="g-c-black4">投诉内容：</div>
									<div style="color: #333;">{{ item.content || '--' }}</div>
								</div>
								<div class="g-flex g-fw-w g-m-l-5">
									<div class="g-m-t-5 g-flex">
										<span class="g-c-black4">投诉凭证：</span>
										<oa-upload
											v-if="item.fileImage.length"
											:max="6"
											:data-source="item.fileImage.map(it => ({
												type: it.img_url.substr(it.img_url.lastIndexOf('.')),
												url: it.img_url
											}))"
											disabled
											@preview-start="handlePreviewStart"
											@preview-end="handlePreviewEnd"
										>
											<span slot="trigger"/>
										</oa-upload>
										<span v-else>--</span>
									</div>
								</div>
								<div class="__info g-m-b-10 g-m-r-10 g-m-l-5" style="margin-top: -5px;">
									<span class="g-c-black4">投诉证明人：</span>
									<span style="color: #333;">{{ item.reference || '--' }}</span>
								</div>
								<div class="__bottom g-flex g-jc-fe g-m-t-10 g-c-black4">
									<div>
										<span>添加人：</span>
										<span>{{ item.staff_name || '--' }}</span>
									</div>
									<span class="g-pd-lr-20">|</span>
									<div>
										<span>添加时间：</span>
										<span>{{ item.create_time || '--' }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Table, Tooltip } from 'iview';
import Upload from '@components/_common/upload/upload';
import Loading from '@components/_common/loading/loading';
import { OSS_SEARCH_EMPTY } from '@constants/constants';

export default {
	name: "oa-service-complaint",
	components: {
		'i-table': Table,
		'i-tooltip': Tooltip,
		'oa-loading': Loading,
		"oa-upload": Upload,
	},
	props: {
		contractCompanyId: [String, Number]
	},
	data() {
		return {
			loading: false,
			list: [], // 投诉信息列表
			OSS_SEARCH_EMPTY
		};
	},
	watch: {
		contractCompanyId() {
			this.$emit('reset');
			this.loadData();
		}
	},
	mounted() {
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.loading = true;
			this.list = [];
			this.$request({
				url: '_SALE_SERVICE_COMPLAINT_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
					contract_company_id: this.contractCompanyId
				},
				autoTip: false
			}).then(res => {
				this.loading = false;
				if (res.data.list.length) {
					this.list = res.data.list;
				}
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
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

export const ServiceComplaint = module.exports.default;

</script>

<style lang="scss">
.v-sale-service-complaint {
	width: 100%;
	height: 100%;
	._detail-content {
		padding: 0 16px;
		height: 100%;
		.__title-bar {
			display: inline-block;
			width: 2px;
			height: 14px;
			position: relative;
			top: 2px;
			background-color: #e84854;
		}
		.__content {
			.__item {
				width: 100%;
				border-radius: 5px;
				border: 1px solid #e8e8e8;
			}
		}
	}
	.ivu-table th {
		font-weight: normal;
	}
}
</style>
