<template>
	<div v-show="showItem" class="g-fw-w v-sc-service-quality">
		<div class="g-pd-l-20">
			<oa-title title="投诉信息" class="g-m-l-15 g-m-b-10">
				<span v-if="$auth[266]" class="g-operation g-m-l-10" @click="addComplaint()">添加投诉</span>
			</oa-title>
			<div v-if="spin">
				<div v-if="contractList.length">
					<div v-for="item in contractList" :key="item.id" class="g-m-10 _complaint-card">
						<div class="g-m-b-20" style="paddingRight: 80px;">
							<div class="__complaint">
								<span class="__text-first">投诉对象：</span>
								<div v-if="item.complain_staff_name.length + item.complain_depart_name.length > 0" style="display:inline-block;">
									<i-tooltip 
										v-if="item.complain_staff_name.length + item.complain_depart_name.length > 15"
										placement="bottom" 
										max-width="300" 
									>
										{{ (item.complain_staff_name + ',' + item.complain_depart_name).substr(0, 15) + '...' }}
										<div slot="content">
											<p v-if="item.complain_staff_name">投诉员工：</p>
											<p>{{ item.complain_staff_name }}</p>
											<p v-if="item.complain_depart_name">投诉部门：</p>
											<p>{{ item.complain_depart_name }}</p>
										</div>
									</i-tooltip>
									<span v-else>{{ item.complain_staff_name + item.complain_depart_name }}</span>
								</div>
								<span v-else>--</span>
							</div>
							<span class="__first __text-special">投诉时间：</span>
							<span v-if="item.complain_time" class="g-c-black2">{{ item.complain_time.split(' ')[0] }}</span>
							<span v-else>--</span>
						</div>
						<div class="g-m-b-10 __long-text g-c-black2">
							{{ item.complain_content }}
						</div>
						<div>
							<v-imgs-preview :data-source="item.image"/>
						</div>
						<div class="g-m-tb-15">
							<div v-for="(e, index) in item.other" :key="index" class="g-lh-28">
								<span>{{ e.file_name }}</span>
								<span class="g-operation g-m-l-20" @click="handleDown(e)">下载</span>
							</div>
						</div>
						<div v-for="e in item.voice" :key="e.src">
							<oa-cus-audio :src="e.src" mode="mid" show-tip="never" style="width: 300px;"/>
						</div>
						<div class="g-tr __text">
							<span>{{ item.complain_name }}</span>
							<i-divider type="vertical" />
							<span>证明人：{{ item.prove_name }}</span>
							<i-divider type="vertical" />
							<span>{{ item.create_time }}</span>
						</div>
						<div class="__button-wrapper">
							<span v-if="$auth[267]" class="g-operation" @click="editComplaint(item)">编辑</span>
							<i-divider type="vertical" />
							<span v-if="$auth[268]" class="g-operation" @click="handleDelete(item)">删除</span>
						</div>
					</div>
				</div>
				<div v-else class="g-tc">暂无投诉记录</div>
			</div>
			<oa-loading v-else />
		</div>
	</div>
</template>

<script>
import { Message, Spin, Divider, Tooltip } from 'iview';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { Title, ServiceDetailItem } from '@components/sc/_common';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import CusAudio from '@components/sale/_common/audio/audio';
import { downloadFile } from '@utils/download';
import { AddComplaintModal } from '@components/hr/points-confirm/popup/add-complaint.vue';
import { EditComplaintModal } from '@components/hr/points-complaint/popup/edit-complaint.vue';
import { DeleteComplaintModal } from '@components/hr/points-complaint/popup/delete-complaint.vue';

export default {
	name: 'sc-detail-tabs-complaint',
	components: {
		'oa-title': Title,
		'i-spin': Spin,
		'i-divider': Divider,
		'oa-detail-item': ServiceDetailItem,
		'v-imgs-preview': ImgsPreview,
		'oa-cus-audio': CusAudio,
		'i-tooltip': Tooltip
	},
	props: {
		showItem: Boolean,
		type: String,
		contract_company_id: String
	},
	data() {
		return {
			contractList: [],
			isfetching: 0,
			spin: true,
		};
	},
	watch: {
		showItem(val, old) {
			val && this.isfetching === 0 && this.getComplaintList();
		}
	},
	created() {
		this.showItem && this.getComplaintList();
	},
	methods: {
		handleDown(e) {
			downloadFile({
				fileName: e.src,
			});
		},
		addComplaint() {
			AddComplaintModal.popup({
				contract_company_id: this.contract_company_id
			}).then(res => {
				this.getComplaintList();
			});
		},
		editComplaint(item) {
			EditComplaintModal.popup({
				datas: item,
				contract_company_id: this.contract_company_id
			}).then(res => {
				this.getComplaintList();
			});
		},
		getComplaintList() {
			this.spin = false;
			this.isfetching = 1;
			this.$request({
				url: API_ROOT['_HR_POINT_COMPLAINTLIST_LIST_GET'], // eslint-disable-line
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then((res) => {
				res.data.complain_records.forEach(rec => {
					rec.image = rec.image.map(img => img.src);
				});
				this.contractList = res.data.complain_records;
				this.spin = true;
			}).catch((error) => {
				this.spin = true;
				Message.error(error.msg);
			});
		},
		handleDelete(item) {
			DeleteComplaintModal.popup({
				complain_record_id: item.complain_record_id
			}).then((res) => {
				this.getComplaintList();
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-sc-service-quality {
	position: relative;
	min-height: 300px;
	max-height: 100%;
	overflow-y: auto;
	._complaint-card {
		position: relative;
		width: 870px;
		padding: 20px;
		border: 1px solid #efefef;
		border-radius: 3px;
		box-shadow:0px 0px 2px 1px #efefef;
		.__complaint {
			display: inline-block;
			width: 400px;
		}
		.__text {
			color: #818794;
			/deep/ .ivu-divider-vertical {
				background-color: #818794 !important;
			}
		}
		.__text-special {
			margin-left: 100px;
		}
		.__long-text {
			word-wrap: break-word;
		}
		.__button-wrapper {
			position: absolute;
			right: 20px;
			top: 20px;
		}
	}
	.__item {
		img {
			border: 1px solid #d4d7db;
		}
	}
}
</style>
