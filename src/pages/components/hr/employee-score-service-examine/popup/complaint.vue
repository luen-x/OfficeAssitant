<template>
	<div class="g-fw-w g-m-t-30 g-m-l-20 v-hr-service-quality-complaint">
		<oa-title title="投诉信息" class="g-m-l-15 g-m-b-10">
			<span class="g-operation g-m-l-10" @click="handleAddComplaint">添加投诉</span>
		</oa-title>

		<div v-if="spin">
			<div v-if="contractList.length">
				<div v-for="(item,index) in contractList" :key="index" class="g-m-10 _complaint-card">
					<div class="g-m-b-20 g-flex g-jc-sb" style="width:70%">
						<div v-if="item.complaint_staff_items.length > 0" class="g-flex">
							<span style="min-width:60px" class="__text">投诉员工：</span>
							<oa-auto-tooltip
								:content="item.complaint_staff_items.join(',')"
								theme="dark"
								width="120px"
								placement="bottom"
								label-class="g-pointer "/>
						</div>
						<div v-if="item.complaint_depart_items.length>0" class="g-flex">
							<span style="min-width:60px" class="__text">投诉部门：</span>
							<oa-auto-tooltip
								:content="item.complaint_depart_items.join(',')"
								theme="dark"
								width="120px"
								placement="bottom"
								label-class="g-pointer "/>
						</div>

						<div v-if="item.complaint_time.length > 0" style="min-width: 140px;">
							<span class="__text">投诉时间：</span>
							<span class="g-c-black2">{{ item.complaint_time }}</span>
						</div>
						<div v-if="item.status ==1" class="g-m-l-10" style="min-width: 100px;">
							<span class="__text">积分：</span>
							<span class="g-c-black2">{{ item.point }}</span>
						</div>
					</div>

					<div class="g-m-b-10 g-fs-14 __long-text">
						{{ item.content }}
					</div>

					<oa-upload
						v-model="item.fileImage"
						disabled
						style="width: 600px"
					/>
					<div class="g-tr __text">
						<span>{{ ["微信投诉","电话投诉","跑到办公室投诉","客户对外负面传播","其他"][item.complaint_type * 1 - 1] }}</span>
						<i-divider type="vertical" />
						<span>证明人：{{ item.reference }}</span>
						<i-divider type="vertical" />
						<span>{{ item.create_time }}</span>
					</div>

					<div class="__button-wrapper">
						<span v-if="item.status ==1&&$auth[1743]" class="g-operation" @click="handlePoint(item)">修改评分</span>
						<span v-else-if="$auth[1742]" class="g-operation" @click="handlePoint(item)">评分</span>
						<i-divider type="vertical"/>
						<span class="g-operation" @click="handleEditComplaint(item.complaint_id)">编辑</span>
						<i-divider type="vertical" />
						<span class="g-operation" @click="handleDelete(item.complaint_id)">删除</span>
					</div>
				</div>
			</div>

			<div v-else class="g-tc">暂无投诉记录</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { Message, Spin, Divider } from 'iview';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import API_ROOT from '@stores/apis/root';
import { Title } from '@components/sc/_common';
import { CreatePortal } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import CusAudio from '@components/sale/_common/audio/audio';
import { downloadFile } from '@utils/download';
import Upload from "@components/_common/upload/upload";
import { Confirm } from "@components/_common/confirm/confirm";
import { PointEdit } from "./point-edit";
import { AddEditComplaintModal } from '../../../sc/_common/service-manage-detail/add-edit-complaint';

export default {
	name: 'hr-detail-tabs-complaint',

	components: {
		'oa-title': Title,
		'oa-upload': Upload,
		'oa-cus-audio': CusAudio,
		'oa-auto-tooltip': AutoToolTip,
		'i-spin': Spin,
		'i-divider': Divider
	},

	props: {
		contract_company_id: Number
	},

	data() {
		return {
			contractList: [], // 投诉信息列表
			spin: true
		};
	},

	created() {
		this.loadData();
	},

	methods: {
		handlePoint(item) {
			PointEdit.popup({
				data: { ...item },
				title: item.status == 1 ? "修改评分" : '评分',
			}).then(
				() => {
					this.loadData();
				}
			).catch(e => { e && console.error(e); });
		},
		handleDown(e) {
			downloadFile({
				fileName: e.src,
			});
		},

		handleAddComplaint() {
			AddEditComplaintModal.popup({
				contract_company_id: this.contract_company_id,
				name: "add"
			}).then(res => {
				res && this.loadData();
			});
		},

		handleEditComplaint(complaint_id) {
			AddEditComplaintModal.popup({
				complaint_id: Number(complaint_id),
				contract_company_id: Number(this.contract_company_id),
				name: "edit"
			}).then(res => {
				res && this.loadData();
			});
		},

		loadData() {
			this.spin = false;

			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_COMPLAINT_LIST_GET,
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then((res) => {
				this.contractList = res.data;

				this.contractList.forEach(item => {
					// let fileImage = [];
					// item.fileImage.forEach(element => {
					// 	fileImage.push({
					// 		url: element.img_url,
					// 		title: element.img_url.split("/")[6],
					// 		type: "." + element.img_url.split("/")[6].split(".")[1],
					// 		uid: element.img_url
					// 	});
					// });

					// item.fileImage = fileImage;
					item.fileImage = item.fileImage.map(e => e.img_url);
				});
				this.spin = true;
			}).catch((error) => {
				this.spin = true;
				Message.error(error.msg);
			});
		},

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
.v-hr-service-quality-complaint {
	padding-bottom: 200px;

	._complaint-card {
		position: relative;
		width: 870px;
		padding: 20px;
		border: 1px solid #efefef;
		border-radius: 3px;
		box-shadow:0px 0px 2px 1px #efefef;

		.__text {
			color: #818794;
			.ivu-divider-vertical {
				background-color: #818794 !important;
			}
		}

		.__long-text {
			word-wrap: break-word;
		}

		.__button-wrapper {
			position: absolute;
			right: 20px;
			top: 20px;

			.__delete {
				padding-left: 6px;
				border-left: 1px solid #2e9dfa;
			}
		}
	}

	.__item {
		img {
			border: 1px solid #d4d7db;
		}
	}
}
</style>