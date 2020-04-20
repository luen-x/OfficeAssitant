<template>
	<div class="v-finance-tab">
		<div v-if="spin">
			<oa-title>
				<template slot="title">项目完成表</template>
				<div slot="content" class="g-m-t-20">
					<oa-title 
						v-for="item of data.project_complete" 
						:key="item.project_id" 
						:show-type="true" 
						type="expand"
						class="g-m-b-30">
						<template slot="title">
							<span class="g-fs-14">{{ item.product_name }}</span>
						</template>
						<div slot="content" class="g-fw-w g-pd-t-25">
							<div v-if="item.no_handover !== 1">
								<div v-if="item.status !== 0">
									<oa-detail-item 
										:content="item.staff_name" 
										label="上传人">{{ item.staff_name }}</oa-detail-item>
									<oa-detail-item 
										:content="item.upload_time" 
										label="上传时间">{{ item.upload_time }}</oa-detail-item>
									<oa-detail-item 
										:content="item.complete_time" 
										label="完成时间">{{ item.complete_time }}</oa-detail-item>
									<oa-detail-item 
										:content="item.images" 
										class="g-m-t-15" 
										label="图片">
										<oa-upload 
											v-if="spin"
											:data-source="item.images.map(item => ({ type: '.png', url: item }))"
											:show-title="false"
											disabled

										/>
									</oa-detail-item>
								</div>
								<div v-else class="g-tc g-m-t-30 _empty">
									<img :src="OSS_NO_MESSAGE04" style="width: 200px;height: 200px;">
									<p class="g-m-t-10">暂未上传项目完成表</p>
								</div>
							</div>
							<div v-else class="g-tc g-m-t-30 _empty">
								<img :src="OSS_NO" style="width: 200px;height: 200px;">
								<p class="g-m-t-10">无需项目完成表</p>
							</div>
						</div>
					</oa-title>
				</div>
			</oa-title>
			<oa-title class="g-m-t-30">
				<template slot="title">交付表</template>
				<div slot="content" class="g-m-t-20">
					<oa-title 
						v-for="item of data.project_delivery" 
						:key="item.project_id + '1'"
						:show-type="true" 
						type="expand" 
						class="g-m-b-30">
						<template slot="title">
							<span class="g-fs-14">{{ item.product_name }}</span>
						</template>
						<div slot="content" class="g-pd-t-25">
							<div v-if="item.no_handover !== 1">
								<div v-if="item.status !== 0">
									<template
										v-if="item.record"
									>
										<div 
											v-for="info of item.record"
											:key="info.record_staff_id"
										>
											<template v-if="info.status !== 0">
												<div>{{ info.record_staff_name }}（{{ info.role_name }}）</div>
												<div class="g-fw-w">
													<oa-detail-item 
														:content="info.staff_name" 
														label="上传人">{{ info.staff_name }}</oa-detail-item>
													<oa-detail-item 
														:content="info.upload_time" 
														label="上传时间">{{ info.upload_time }}</oa-detail-item>
													<oa-detail-item :content="info.images" class="g-m-t-15" label="交付表">
														<oa-upload 
															v-if="spin"
															:data-source="info.images.map(item => ({ type: '.png', url: item }))"
															:show-title="false"
															disabled

														/>
													</oa-detail-item>
												</div>
											</template>
										</div>
									</template>
									<template v-else class="g-fw-w">
										<div>
											<oa-detail-item :content="item.staff_name" label="上传人">{{ item.staff_name }}</oa-detail-item>
											<oa-detail-item :content="item.upload_time" label="上传时间">{{ item.upload_time }}</oa-detail-item>
											<oa-detail-item :content="item.images" class="g-m-t-15" label="交付表">
												<oa-upload 
													v-if="spin"
													:data-source="item.images.map(item => ({ type: '.png', url: item }))"
													:show-title="false"
													disabled 
												/>
											</oa-detail-item>
										</div>
										<template v-if="item.plate === 1">
											<div class="g-m-tb-15">审核信息</div>
											<div class="g-fw-w">
												<oa-detail-item 
													:content="item.status_name" 
													label="审核状态">{{ item.status_name }}</oa-detail-item>
												<oa-detail-item 
													:content="item.audit_staff_name" 
													label="审核人">{{ item.audit_staff_name }}</oa-detail-item>
												<oa-detail-item 
													:content="item.audit_time" 
													class="g-m-t-15" 
													label="审核时间">{{ item.audit_time }}</oa-detail-item>
												<oa-detail-item
													v-if="item.status !== 0"
													:content=" item.remark" 
													:label="item.status === 2 ? '通过说明' : '驳回原因'"
													class="g-m-t-15" 
												>
													{{ item.remark }}
												</oa-detail-item>
											</div>
										</template>
									</template>
								</div>
								<div v-else class="g-tc g-m-t-30 _empty">
									<img :src="OSS_NO_MESSAGE04" style="width: 200px;height: 200px;">
									<p class="g-m-t-10">暂未上传交接表</p>
								</div>
							</div>
							<div v-else class="g-tc g-m-t-30 _empty">
								<img :src="OSS_NO" style="width: 200px;height: 200px;">
								<p class="g-m-t-10">无需交接表</p>
							</div>
						</div>
					</oa-title>
				</div>
			</oa-title>
		</div>
		<oa-loading v-else fix/>
		<div v-if="data.length === 0 && spin" class="g-flex-cc" style="height: 300px">
			没有数据
		</div>
	</div>
</template>

<script>
import { Spin } from 'iview';
import Loading from '@components/_common/loading/loading';
import Upload from '@components/_common/upload/upload';
import { OSS_NO, OSS_NO_MESSAGE04 } from '@constants/constants';
import { ImgsPreview } from 'wya-vc';
import API_ROOT from '@stores/apis/root'; 
import DetailItem from '../../detail-item';
import Title from '../../title';

export default {
	name: 'finance-detail-tabs-delivery',
	components: {
		'oa-detail-item': DetailItem,
		'oa-title': Title,
		'vc-imgs-preview': ImgsPreview,
		'oa-loading': Loading,
		'oa-upload': Upload
	},
	props: {
		contractId: Number,
		show: Boolean
	},
	data() {
		return {
			data: {
				project_complete: [],
				project_delivery: []
			},
			spin: true,
			OSS_NO_MESSAGE04,
			OSS_NO,
			isfetching: 0
		};
	},
	watch: {
		show(val, old) {
			val && this.isfetching === 0 && this.loadData();
		},
		contractId() {
			this.loadData();
		}
	},
	created() {
		this.show && this.loadData();
	},
	methods: {
		loadData() {
			this.spin = false;
			this.isfetching = 1;
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_DELIVERY_GET,
				type: 'GET',
				param: {
					contract_id: this.contractId
				},
				loading: false
			}).then(res => {
				this.data = res.data;
				this.spin = true;
			}).catch(err => {
				this.$Message.error(err.msg);
				this.spin = true;
			});
		}
	}
};
</script>

<style lang="scss">

</style>


