<template>
	<div class="v-finance-services-complaint-record">
		<oa-loading v-if="spin" />
		<div v-else>
			<div v-if="list.length">
				<div
					v-for="(item, companyIndex) in list"
					:key="companyIndex"
					class="company_item">
					<oa-title :show-type="companyIndex === 0" type="expand" class="g-m-b-20">
						<span slot="title">{{ item.contract_company_name }}</span>
						<div slot="content" class="g-m-t-20">
							<div v-if="item.complaint_list.length">
								<div v-for="(it, index) in item.complaint_list" :key="index" class="__content">
									<div class="__item g-pd-10 g-m-b-10 g-pd-l-10 g-pd-r-10">
										<div
											class="g-flex g-jc-sb g-ai-c g-pd-l-10 g-pd-r-10"
											style="background-color: #f6f6f6;height:30px;line-height:30px;"
										>
											<div class="g-flex g-pd-5">
												<div v-if="it.complaint_staff_items.length > 0">
													<span>投诉员工：</span>
													<span v-if="it.complaint_staffs.length < 10">
														{{ it.complaint_staffs }}
													</span>
													<i-tooltip
														v-else
														:content="it.complaint_staffs"
														placement="bottom"
														max-width="200"
														transfer
													>
														{{ it.complaint_staffs.slice(0,10) + "...." }}
													</i-tooltip>
												</div>
												<span v-if="it.complaint_staff_items.length > 0" class="g-pd-lr-20">|</span>
												<div v-if="it.complaint_depart_items.length > 0">
													<span>投诉部门：</span>
													<span v-if="it.complaint_departs.length < 10">
														{{ it.complaint_departs }}
													</span>
													<i-tooltip
														v-else
														:content="it.complaint_departs"
														placement="bottom"
														max-width="200"
														transfer
													>
														{{ it.complaint_departs.slice(0,10) + "...." }}
													</i-tooltip>
												</div>
												<span v-if="it.complaint_depart_items.length > 0" class="g-pd-lr-20">|</span>
												<div>
													<span>投诉时间：</span>
													<span>{{ it.complaint_time }}</span>
												</div>
												<span class="g-pd-lr-20">|</span>
												<div>
													<span>投诉方式：</span>
													<span>
														{{ ["微信投诉","电话投诉","跑到办公室投诉","客户对外负面传播","其他"][it.complaint_type * 1 - 1] }}
													</span>
												</div>
											</div>
										</div>

										<div class="g-m-b-10 g-m-r-10 g-m-t-10 g-m-l-5 g-pd-l-10 g-pd-r-10 g-flex">
											<span class="g-inline-block" style="width: 65px;">投诉内容：</span>
											<span class="g-c-black g-inline-block" style="width: 750px;">{{ it.content }}</span>
										</div>

										<div class="g-flex g-fw-w g-m-l-5 g-pd-l-10 g-pd-r-10">
											<div class="g-m-tb-10 g-flex">
												<span>投诉凭证：</span>
												<oa-upload
													v-model="it.fileImage"
													disabled
													style="width: 700px"
												/>
											</div>
										</div>
										<div class="g-m-b-10 g-m-r-10 g-m-t-10 g-m-l-5 g-pd-l-10 g-pd-r-10">
											<span>投诉证明人：</span>
											<span class="g-c-black">
												{{ it.reference }}
											</span>
										</div>
										<div class="g-flex g-jc-fe g-m-t-10 g-pd-l-10 g-pd-r-10">
											<div>
												<span>添加人：</span>
												<span>{{ it.staff_name }}</span>
											</div>
											<span class="g-pd-lr-20">|</span>
											<div>
												<span>添加时间：</span>
												<span>{{ it.create_time }}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div v-else class="__empty g-flex g-fd-c g-ai-c g-jc-c">
								<img :src="OSS_NO_MESSAGE02">
								<div class="g-fs-12 g-tc g-m-t-10" style="width: 301px;">该客户暂无投诉</div>
							</div>
						</div>
					</oa-title>
				</div>
			</div>
			<div v-else class="_blank">
				<img :src="OSS_NO_MESSAGE03" style="width: 301px;height: 232px;">
	
				<div class="g-m-t-30" style="width: 301px;text-align:center;">
					<span class="g-fs-14">暂无投诉信息</span>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
import { Table, Row, Col, Tooltip } from "iview";
import Upload from '@components/_common/upload/upload';
import API_ROOT from '@stores/apis/root';
import { OSS_NO_MESSAGE02, OSS_NO_MESSAGE03 } from "@constants/constants";
import Title from './title';

export default {
	name: 'finance-services-commission',
	components: {
		"i-table": Table,
		'i-row': Row,
		'i-col': Col,
		'i-tooltip': Tooltip,
		'oa-title': Title,
		'oa-upload': Upload
	},
	props: {
		info: Object
	},
	data() {
		return {
			OSS_NO_MESSAGE02,
			OSS_NO_MESSAGE03,
			spin: true,
			list: []
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		async loadData() {
			this.spin = true;
			// 客户回款信息
			await this.$request({
				url: API_ROOT._FINANCE_DETAIL_COMPLAINT_LIST_GET,
				type: 'GET',
				loading: false,
				param: {
					staff_id: this.info.staff_id
				}
			}).then(res => {
				this.list = res.data;
				this.list.forEach(v => {
					v.complaint_list.forEach(e => {
						e.complaint_staffs = e.complaint_staff_items.map(k => k).join(',');
						e.complaint_departs = e.complaint_depart_items.map(k => k).join(',');
						let fileImage = [];
						e.fileImage.forEach(element => {
							fileImage.push({
								url: element.img_url,
								title: element.img_url.substring(element.img_url.lastIndexOf("/") + 1, element.img_url.length),
								type: "." + element.img_url.substring(element.img_url.lastIndexOf(".") + 1, element.img_url.length),
								uid: element.img_url
							});
						});
						e.fileImage = fileImage;
					});
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});

			this.spin = false;
		},
	}
};
</script>

<style lang="scss" scoped>
.v-finance-services-complaint-record {
	min-height: 500px;
	position: relative;
	.__content {
		.__item {
			width: 100%;
			border-radius: 5px;
			border: 1px solid #e8e8e8;
		}
	}
	.__empty {
		height: 156px;
		background: rgba(250,250,250,1);
		img {
			width: 100px;
			height: 100px;
		}
	}
	._blank{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-70%);
		-webkit-transform: translate(-50%,-70%);
	}
}
</style>
