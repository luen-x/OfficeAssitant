<template>
	<div class="g-m-b-30 v-sc-service-manage-complaint">
		<div v-if="spin" class="_detail-content">
			<div>
				<div>
					<oa-title title="投诉记录" class="g-m-b-20 g-m-t-30"/>
					
					<div v-if="list.length != 0">
						<div v-for="(item,index) in list" :key="index" class="__content">
							<div class="__item g-pd-10 g-m-b-10 g-pd-l-10 g-pd-r-10">
								<div 
									class="g-flex g-jc-sb g-ai-c g-pd-l-10 g-pd-r-10" 
									style="background-color: #f6f6f6;height:30px;line-height:30px;"
								>
									<div class="g-flex g-pd-5">
										<div v-if="item.complaint_staff_items.length > 0">
											<span>投诉员工：</span>
											<span v-if="item.complaint_staffs.length < 10">
												{{ item.complaint_staffs }}
											</span>
											<i-tooltip 
												v-else 
												:content="item.complaint_staffs" 
												placement="bottom" 
												max-width="200" 
												transfer
											>
												{{ item.complaint_staffs.slice(0,10) + "...." }}
											</i-tooltip>
										</div>
										<span v-if="item.complaint_staff_items.length > 0" class="g-pd-lr-20">|</span>
										<div v-if="item.complaint_depart_items.length > 0">
											<span>投诉部门：</span>
											<span v-if="item.complaint_departs.length < 10">
												{{ item.complaint_departs }}
											</span>
											<i-tooltip 
												v-else 
												:content="item.complaint_departs" 
												placement="bottom" 
												max-width="200" 
												transfer
											>
												{{ item.complaint_departs.slice(0,10) + "...." }}
											</i-tooltip>
										</div>
										<span v-if="item.complaint_depart_items.length > 0" class="g-pd-lr-20">|</span>
										<div>
											<span>投诉时间：</span>
											<span>{{ item.complaint_time }}</span>
										</div>
										<span class="g-pd-lr-20">|</span>
										<div>
											<span>投诉方式：</span>
											<span>
												{{ ["微信投诉","电话投诉","跑到办公室投诉","客户对外负面传播","其他"][item.complaint_type * 1 - 1] }}
											</span>
										</div>
									</div>

									<div style="color:#2397F9;">
										<span 
											class="g-pointer" 
											@click="handleEditComplaint(item.complaint_id)"
										>
											编辑
										</span>
										<span 
											class="g-pd-lr-10"
										>
											|
										</span>
										<span 
											class="g-pointer" 
											@click="handleDelete(item.complaint_id)"
										>
											删除
										</span>
									</div>
								</div>

								<div class="g-m-b-10 g-m-r-10 g-m-t-10 g-m-l-5 g-pd-l-10 g-pd-r-10 g-flex">
									<span class="g-inline-block" style="width: 65px;">投诉内容：</span>
									<span class="g-c-black g-inline-block" style="width: 750px;">{{ item.content }}</span>
								</div>

								<div class="g-flex g-fw-w g-m-l-5 g-pd-l-10 g-pd-r-10">
									<div class="g-m-tb-10 g-flex">
										<span>投诉凭证：</span>
										<oa-upload
											v-model="item.fileImage"
											disabled
											style="width: 700px"
										/>
									</div>
								</div>
								<div class="g-m-b-10 g-m-r-10 g-m-t-10 g-m-l-5 g-pd-l-10 g-pd-r-10">
									<span>投诉证明人：</span>
									<span class="g-c-black">
										{{ item.reference }}
									</span>
								</div>
								<div class="__bottom g-flex g-jc-fe g-m-t-10 g-pd-l-10 g-pd-r-10">
									<div>
										<span>添加人：</span>
										<span>{{ item.staff_name }}</span>
									</div>
									<span class="g-pd-lr-20">|</span>
									<div>
										<span>添加时间：</span>
										<span>{{ item.create_time }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div v-else class="_empty">
						<img :src="OSS_NO_MESSAGE03" style="width: 301px;height: 232px;">
	
						<div class="g-m-t-30" style="width: 301px;text-align:center;">
							<span class="g-fs-14">暂无投诉信息</span>
							<span  
								class="g-fs-14"
							>
								，
							</span>
							<span 
								class="g-fs-12 g-pointer" 
								style="color: #2397F9;"
								@click="handleAddComplaint"
							>
								点击添加
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { Table, Tooltip } from "iview";
import { Title } from "@components/sc/_common";
import API_ROOT from "@stores/apis/root";
import Upload from "@components/_common/upload/upload";
import { OSS_NO_MESSAGE03 } from "@constants/constants";
import { Confirm } from "@components/_common/confirm/confirm";
import { AddEditComplaintModal } from "./add-edit-complaint-modal";

export default {
	name: "service-manage-complaint",
    
	components: {
		"i-table": Table,
		"oa-title": Title,
		"i-tooltip": Tooltip,
		"oa-upload": Upload
	},

	props: {
		contract_company_id: Number,
		name: String
	},

	data() {
		return {
			OSS_NO_MESSAGE03,
			list: [], // 投诉信息列表
			spin: false
		};
	},

	computed: {
		// add() {
		// 	return ((this.$auth[342] && this.name === 'manage') || (this.$auth[349] && this.name === 'inspection') 
		// 	|| (this.$auth[895] && this.name === 'examine'));
		// },

		// edit() {
		// 	return ((this.$auth[343] && this.name === 'manage') || (this.$auth[350] && this.name === 'inspection')
		// 	|| (this.$auth[896] && this.name === 'examine'));
		// },

		// del() {
		// 	return ((this.$auth[344] && this.name === 'manage') || (this.$auth[351] && this.name === 'inspection')
		// 	|| (this.$auth[897] && this.name === 'examine'));
		// }
	},

	mounted() {
		this.loadData();
	},
    
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.spin = false;

			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_COMPLAINT_LIST_GET,
				type: 'GET',
				loading: false,
				param: {
					contract_company_id: this.contract_company_id
				}
			}).then(res => {
				this.spin = true;
				this.list = res.data;

				this.list.forEach(item => {
					let fileImage = [];

					item.fileImage.forEach(element => {
						fileImage.push({
							url: element.img_url,
							title: element.img_url.substring(element.img_url.lastIndexOf("/") + 1, element.img_url.length),
							type: "." + element.img_url.substring(element.img_url.lastIndexOf(".") + 1, element.img_url.length),
							uid: element.img_url
						});
					});

					item.fileImage = fileImage;
					item.complaint_staffs = item.complaint_staff_items && item.complaint_staff_items.join(",");
					item.complaint_departs = item.complaint_depart_items.length ? item.complaint_depart_items.join(",") : ''; 
				});
			}).catch(error => {
				this.spin = true;
				this.$Message.error(error.msg);
			});
		},

		// 编辑
		handleEditComplaint(complaint_id) {
			this.$auth[1354] ? AddEditComplaintModal.popup({
				complaint_id: Number(complaint_id),
				contract_company_id: Number(this.contract_company_id),
				name: "edit"
			}).then(res => {
				res && this.loadData();
			}) : '';
		},

		// 新增
		handleAddComplaint() {
			this.$auth[1353] ? AddEditComplaintModal.popup({
				contract_company_id: this.contract_company_id,
				name: "add"
			}).then(res => {
				res && this.loadData();
			}) : '';
		},

		// 删除
		handleDelete(complaint_id) {
			Confirm.popup({
				title: "温馨提示",
				msg: "确认删除这条投诉记录？"
			}).then(() => {
				this.$request({
					url: '_SC_MANAGE_INSPECTION_COMPLAINT_DELETE_POST',
					type: 'POST',
					loading: false,
					param: {
						complaint_id
					}
				}).then(res => {
					this.$Message.success(res.msg);
					this.loadData();
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			}).catch(error => {});
		}
	}
};
</script>

<style lang="scss">
.v-sc-service-manage-complaint {
	padding-left: 18px;
    padding-bottom: 100px;
	min-height: 90%;
	position: relative;

	._detail-content {
		padding: 0 16px;
		height: 100%;

		.__title {
			.__label {
				border-left: 2px solid #e84854;
			}
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

	._empty{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-70%);
		-webkit-transform: translate(-50%,-70%);
	}
}
</style>