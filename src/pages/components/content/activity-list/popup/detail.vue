<template>
	<div>
		<i-drawer
			ref="drawer"
			v-model="visible"
			:mask="false"
			:mask-closable="false"
			:styles="styles"
			width="720"
			class="v-activity-list"
			@on-close="handleCancel"
		>
			<div v-if="!isLoading">
				<div name="head">
					<span class="_title _padding g-c-black1">{{ data.activity_name }}</span>
					<span class="g-c-orange-light">{{ data.status_name }}</span>
				</div>
				<div class="_undeline"/>
				<div :class="{ '_scroll': screenWidth <= 1366 }">
					<div class="_sub-title">
						<span style="font-size: 14px" class="_padding __title">活动详情</span>
						<span
							class="g-c-blue-mid"
							style="font-size: 12px; cursor: pointer"
							@click="handleEdit"
						>
							编辑
						</span>
					</div>

					<div v-if="!showEdit" class="g-flex g-fw-w">
						<oa-detail-item label="活动分类">{{ data.category_name }}</oa-detail-item>
						<oa-detail-item label="活动名称">
							<i-tooltip 
								:content="data.activity_name"
								max-width="220"
							>
								{{ data.activity_name.length > 15 ? data.activity_name.slice(0, 15) + '...' : data.activity_name }}
							</i-tooltip>
						</oa-detail-item>
						<oa-detail-item label="报名时间">{{ data.apply_start_time }}至{{ data.apply_end_time }}</oa-detail-item>
						<oa-detail-item label="活动时间">{{ data.start_time }}至{{ data.end_time }}</oa-detail-item>
						<div class="g-bb _width g-m-t-10 _width">
							<span style="display: inline-block;width: 130px;padding-top: 7px" class="g-c-black4">活动地址</span>
							<i-tooltip 
								:content="data.address"
								max-width="220"
							>
								{{ !!data.address
									? data.address.length > 15 ? data.address.slice(0, 15) + '...' : data.address
								: '--' }}
							</i-tooltip>
						</div>
						<oa-detail-item label="是否上传凭证">{{ + data.has_voucher ? '是' : '否' }}</oa-detail-item>
						<oa-detail-item v-if="data.status < 2" label="显示报名人数">{{ + data.show_apply_num ? '是' : '否' }}</oa-detail-item>
						<oa-detail-item v-if="data.status >= 2" label="已报名人数">{{ + data.apply_count }}人</oa-detail-item>
						<oa-detail-item label="填写复训次数">{{ + data.write_retrain_num ? "填写" : "不填写" }}</oa-detail-item>
						<oa-detail-item label="填写是否听完">{{ + data.write_listen_finish ? "填写" : "不填写" }}</oa-detail-item>
						<oa-detail-item label="填写是否参加过策略班">{{ +data.write_join_strategy ? "填写" : "不填写" }}</oa-detail-item>
						<oa-detail-item label="填写是否起盘">{{ +data.write_lift_plate ? "填写" : "不填写" }}</oa-detail-item>
						<oa-detail-item label="填写合作类别">{{ + data.write_category ? "填写" : "不填写" }}</oa-detail-item>
						<oa-detail-item label="填写已招代理数">{{ + data.write_proxy_num ? "填写" : "不填写" }}</oa-detail-item>
						<oa-detail-item label="填写续费">{{ + data.write_is_renew ? "填写" : "不填写" }}</oa-detail-item>
						<oa-detail-item label="每家报名限制人数">{{ data.apply_limit }}人</oa-detail-item>
						<oa-detail-item label="可多报名人数">{{ data.extra_apply }}人</oa-detail-item>
						<oa-detail-item label="可报客户类型">
							<span v-if="customerType.length < 15">{{ customerType }}</span>
							<i-tooltip 
								v-else
								:content="customerType"
								max-width="300">
								{{ customerType.slice(0, 14) + '...' }}
							</i-tooltip>
						</oa-detail-item>
						<div class="g-bb _width g-m-t-10 _width" style="padding-bottom: 8px;">
							<span style="display: inline-block;width: 130px;padding-top: 7px" class="g-c-black4">活动说明</span>
							<i-tooltip 
								:content="data.describe"
								max-width="300">
								{{ !!data.describe
									? data.describe.length > 15 ? data.describe.slice(0, 15) + '...' : data.describe
								: '--' }}
							</i-tooltip>
						</div>
						<div class="_img-wrapper g-m-l-15" >
							<span 
								style="display: inline-block; padding-top: 20px;"
								class="g-c-black4"
							>
								查看封面
							</span>
							<vc-imgs-preview 
								:data-source="[data.cover_image]"
								:render-row="renderRow"
								style="margin: -15px 0px 0 135px;"
							/>
						</div>
					</div>
				</div>
				<div v-if="$auth['76'] && data.status == 2" name="footer" class="_footer">
					<i-button type="primary" class="g-m-l-20" @click="handleCloseApply">关闭报名</i-button>
				</div>
			</div>
			<div v-if="isLoading">
				<oa-loading/>
			</div>
		</i-drawer>
	</div>
</template>
<script>
import { Button, Drawer, Input, Tooltip } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import Loading from '@components/_common/loading/loading';
import API_ROOT from "@stores/apis/root";
import { CreateModal } from './detail-edit-new';
import { getActivityStatus, switchCustomerType } from "../util";
import detailItem from './detail-item';
import detailEdit from './detail-edit';

export default {
	name: 'oa-activity-detail',
	components: {
		'i-button': Button,
		'i-drawer': Drawer,
		'oa-detail-item': detailItem,
		'i-input': Input,
		'oa-loading': Loading,
		'vc-imgs-preview': ImgsPreview,
		'i-tooltip': Tooltip,
		'oa-detail-edit': detailEdit
	},
	props: {
		detailData: {
			required: true,
			type: Object
		}
	},
	data() {
		return {
			visible: false,
			styles: {
				height: 'calc(100% - 55px)',
				overflow: 'hidden',
				paddingBottom: '53px',
				position: 'static'
			},
			showEdit: false,
			address: '',
			introduce: '',
			data: '',
			isLoading: false,
			screenWidth: window.screen.width
		};
	},
	computed: {
		customerType() {
			if (!this.data.customer_type) return '';
			return switchCustomerType(this.data.customer_type);
		},

	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadData() {
			this.isLoading = true;
			this.$request({
				url: API_ROOT._CONTENT_ACTIVITY_DETAIL_GET,
				type: 'GET',
				param: {
					id: this.detailData.activity_id
				},
				loading: false
			}).then(res => {
				this.isLoading = false;
				// this.$Message.success(res.msg);
				this.data = res.data;
			});
		},
		handleEdit() {
			CreateModal.popup({ data: this.data }).then((res) => {
				this.handleCancel();
			}).catch((res) => {
			});
		},
		handleCloseApply() {
			this.$request({
				url: API_ROOT._CONTENT_ACTIVITY_LIST_CLOSE_POST,
				type: 'POST',
				param: {
					id: this.detailData.activity_id
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.visible = false;
				app.$store.commit('CONTENT_ACTIVITY_LIST_RESET', { type: '' });
				this.handleCancel();
			}).catch(err => this.$Message.error(err.msg));
		},
		handleCancel() {
			this.$emit('close');
		},
		renderRow(h, params) {
			const { src, index } = params;
			return h('img', {
				attrs: {
					src: src + '!4-4',
					width: 70,
					height: 70,
				}
			});
		}
	},
};
export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>
<style lang="scss">
.v-activity-list {
	._title {
		font-size: 16px;
	}
	._undeline {
		height: 1px;
		width: 1000px;
		background-color: #ebeef1;
		margin: 15px 0 0 -10px;
	}
	._scroll {
		overflow-y: scroll;
		height: 432px;
		padding-bottom: 29px;
		
	}
	._sub-title {
		line-height: 20px;
		margin-top: 25px;
		.__left {
			background: #e84854;
			width: 2px;
			height: 14px;
			display: inline-block;
			margin-right: 10px;
		}
	}
	._padding {
		padding-right: 15px
	}
	._footer {
		width: 100%;
		position: absolute;
		height: 60px;
		line-height: 60px;
		bottom: 0;
		left: 0;
		box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	._width {
		width: 40%;
		margin-right: 50px;
		margin-left: 15px;
	}
	._desc {
		max-height: 150px;
		overflow-y: scroll;
		padding-top: 6px;
	}
	.ivu-checkbox-wrapper {
		margin-right: 20px;
	}
	._tips {
		position: absolute;
		font-size: 12px;
		color: #bbb;
		padding-right: 10px;
		top: 1px;
		right: -62px;
	}
	._img-wrapper {
		width: 365px;
		border-bottom: 1px solid #e6e6e6;
	}
	.__title{
		position: relative;
		padding-left: 10px;
		&::before {
			top: 3px;
			left: -3px;
			content: '';
			height: 14px;
			width: 2px;
			position: absolute;
			background: #ca1622;
		}
	}
	.__item {
		// margin-right: 10px!important;
		img {
		// width: 72px;
		// height: 72px;
		border: 1px solid #d4d7db;
	}
	}
	.ivu-tooltip-rel {
		color: #333
	}
}
</style>