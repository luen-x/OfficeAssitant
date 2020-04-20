<template>
	<div>
		<i-drawer
			:mask="false"
			:mask-closable="false"
			:styles="styles"
			v-model="visible"
			:loading="true"
			title="报名详情"
			width="720"
			class="v-activity-audit g-fs-14"
			@on-close="handleClose"
		>
			<div v-if="!isLoading">
				<div style="height: 60px; line-height: 60px">
					<div v-if="data.status == 1" class="g-fs-16 g-flex-ac g-jc-c" >
						<i class="iconfont g-fs-30 g-c-orange-dark g-pd-r-10">&#xe613;</i>
						<div class="g-fs-16 g-c-black1">报名申请待审核!</div>
					</div>
					<div v-else-if="data.status == 2" class="g-fs-16 g-flex-ac g-jc-c" >
						<i class="iconfont g-fs-30 g-c-blue-dark g-pd-r-10">&#xe6f3;</i>
						<div class="g-fs-16 g-c-black1">报名申请已通过!</div>
					</div>
					<div v-else-if="data.status == 3" class="g-flex-ac g-jc-c">
						<i class="iconfont g-fs-30 g-c-red-dark g-pd-r-10" >&#xe6f0;</i>
						<div class="g-fs-16 g-c-black1">报名申请已拒绝!</div>
						<div>（{{ data.audit_remark }}）</div>
					</div>
				</div>
				<div class="_title g-tl g-fs-14 g-m-l-10">
					客户信息
					<span 
						v-if="!isEdit"
						class="g-c-blue-dark __edit"
						@click="isEdit = true">编辑</span>
					<span 
						v-if="isEdit"
						class="g-c-blue-dark __edit"
						@click="handleSaveChange">保存</span>
					<span 
						v-if="isEdit"
						class="g-c-blue-dark __edit"
						style="padding-left: 10px"
						@click="isEdit = false">取消</span>
				</div>

				<div v-if="!isEdit" key="detail">
					<div class="g-flex g-m-l-10">
						<div class="g-1of2 g-pd-l-10 ">
							<p class="g-bb">公司名称<span class="g-c-black2">{{ data.customer_company }}</span></p>
							<p class="g-bb">客户姓名<span class="g-c-black2">{{ data.boss_name }}</span></p>
							<p class="g-relative g-bb">
								客户类别<span class="g-c-black2">{{ data.customer_type_name }}</span>
								<span
									v-if="data.is_self_customer == 1"
									class="g-absolute g-c-red-mid"
									style="top: 20px; left: 70px">{{ data.is_self_customer.message }}</span>
							</p>
						</div>
						<div class="g-1of2">
							<p class="g-bb">公司行业<span class="g-c-black2">{{ data.industry_name }}</span></p>
							<p class="g-bb">客户电话<span class="g-c-black2">{{ data.boss_tel }}</span></p>
							<p class="g-bb">合作时间<span class="g-c-black2">{{ data.cooperate_date ? data.cooperate_date : '--' }}</span></p>
						</div>
					</div>

					<div class="g-flex" style="padding: 0 10px;">
						<div class="g-1of2 g-pd-l-10">
							<p class="g-bb">对接部门<span class="g-c-black2">{{ data.depart_name }}</span></p>
							<p class="g-bb">对接人<span class="g-c-black2">&nbsp;&nbsp;&nbsp;{{ data.staff_name }}</span></p>
							<p class="g-bb">合作类别
								<span class="g-c-black2">
									{{ data.cooperate_category_name ? data.cooperate_category_name : '--' }}
								</span>
							</p>
							<p class="g-bb">是否参加过策略班<span class="g-c-black2">{{ data.is_join_strategy_label }}</span></p>
							<p class="g-bb">已招代理数<span class="g-c-black2">{{ data.proxy_num_name || '--' }}</span></p>
						</div>
						<div class="g-1of2" style="padding-left: 5px">
							<p class="g-bb">部门简称<span class="g-c-black2">{{ data.abbreviation ? data.abbreviation : '--' }}</span></p>
							<p class="g-bb">复训次数<span class="g-c-black2">{{ data.retrain_number_label }}</span></p>
							<p class="g-bb">是否听完<span class="g-c-black2">{{ data.listen_finish_label }}</span></p>
							<p class="g-bb">是否起盘<span class="g-c-black2">{{ data.lift_plate }}</span></p>
							<p class="g-bb">
								是否续费客户
								<span 
									v-if="data.is_renew_name && data.is_renew_name === '是'" 
									class="g-c-black2" 
									style="padding-left: 10px;"
								>
									{{ data.is_renew_name }} ({{ data.renew_type_name }})
								</span>
								<span v-else class="g-c-black2" style="padding-left: 10px;">
									{{ data.is_renew_name }}
								</span>
							</p>
						</div>
					</div>

					<div class="g-flex g-fs-14" style="padding: 0 68px 0 20px;flex-direction: column">
						<p v-for="(user, i) in data.apply_users" :key="i" class="_apply-user g-bb">
							<span class="__name">
								报名人{{ i + 1 }}
								<span class="g-c-black2">
									{{ user.username }}（{{ user.position }}、身份证：{{ user.id_card }}、手机号：{{ user.phone }}）
								</span>
							</span>
						</p>
					</div>

					<div class="g-pd-l-10 g-fs-12 g-flex g-m-t-20" style="width: 80%">
						<div class="g-pd-r-30 g-pd-l-10 g-c-black4">查看凭证</div>
						<div v-if="!data.voucher" class="g-m-b-10">未上传凭证</div>
						<vc-imgs-preview
							v-else 
							:data-source="data.voucher.split(',')"
							:render-row="renderRow"
						/>
					</div>
					<div class="g-bb" style="width: 89%; margin-left: 23px;"/>

					<div
						v-if="data.status == 1"
						name="foot"
						class="_footer"
					>
						<vc-debounce-click
							:tag="Button"
							type="primary"
							style="margin: 0 6px 0 20px"
							@click="handleOk"
						>
							通过
						</vc-debounce-click>
						<vc-debounce-click
							:tag="Button"
							class="g-m-r-20"
							@click="handleCancel"
						>
							拒绝
						</vc-debounce-click>
					</div>
				</div>
				<div v-else key="editDetail">
					<oa-edit-detail ref="editDetail" :data-source="data" @sccess-save="handleSuccessSave"/>
				</div>
			</div>
			<div v-if="isLoading">
				<oa-loading/>
			</div>
		</i-drawer>
	</div>
</template>
<script>
import { Button, Drawer, Input } from "iview";
import { CreatePortal, ImgsPreview } from "wya-vc";
import Loading from '@components/_common/loading/loading';
import API_ROOT from '@stores/apis/root';
import editDetail from './edit-detail';
// eslint-disable-next-line import/no-cycle
import { CUSTOMER_TYPE } from "../item";
import { PModalRefuse } from './refuse';

export default {
	name: "oa-audit-detail",
	components: {
		"i-button": Button,
		"i-drawer": Drawer,
		"i-input": Input,
		'vc-imgs-preview': ImgsPreview,
		'oa-loading': Loading,
		'oa-edit-detail': editDetail,
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
			isEdit: false,
			styles: {
				height: "calc(100% - 55px)",
				overflow: "hidden",
				paddingBottom: "53px",
				position: "static"
			},
			data: '',
			isLoading: false,
			CUSTOMER_TYPE
		};
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
			this.isEdit = false;
			this.$request({
				url: API_ROOT._CONTENT_ACTIVITY_AUDIT_DETAIL_GET,
				type: 'GET',
				param: {
					id: this.detailData.apply_id
				},
				loading: false
			}).then(res => {
				this.isLoading = false;
				this.data = res.data;
			// this.$Message.success(res.msg);
			}).catch(err => this.$Message.error(err.msg));
		},
		handleOk() {
			this.$request({
				url: API_ROOT._CONTENT_ACTIVITY_AUDIT_PASS_POST,
				type: 'POST',
				param: {
					type: 1,
					apply_id: this.detailData.apply_id
				}
			}).then(res => {
				this.$Message.success(res.msg);
				app.$store.commit('CONTENT_ACTIVITY_AUDIT_LIST_RESET', { type: this.type });
			}).catch(err => this.$Message.error(err.msg));
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = true;
			PModalRefuse.popup({ data: this.detailData }).then(res => {
				this.visible = false;
				app.$store.commit('CONTENT_ACTIVITY_AUDIT_LIST_RESET', { type: this.type });
				this.handleClose();
			}).catch(() => {});
		},
		handleClose() {
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
		},
		handleSaveChange() {
			this.$refs.editDetail.handleSubmit();
		},
		handleSuccessSave() {
			this.isEdit = false;
			this.loadData();
		}
	}
};
export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>
<style lang="scss">
.v-activity-audit {
	position: relative;
  p {
    font-size: 12px;
    height: 35px;
		line-height: 35px;
		color: #818794;
		width: 365px;
		margin-top: 10px;
		span {
			padding-left: 40px;
		}
	}
	._apply-user {
		width: 368px;
		span {
			display: inline-block;
		}
		.__name {
			width: 666px;
			padding: 0
		}
		.__position {
			width: 200px;
		}
		.__id {
			width: 400px;
		}
	}
  ._title{
		position: relative;
		padding-left: 10px;
		&::before {
			top: 4px;
			left: -9px;
			content: '';
			height: 14px;
			width: 2px;
			position: absolute;
			background: #ca1622;
		}
		.__edit {
			font-size: 12px;
			cursor: pointer;
			padding-left: 30px;
		}
	}
	.__item {
		margin-right: 10px!important;
		img {
		width: 72px;
		height: 72px;
		border: 1px solid #d4d7db;
	}
	}
	._footer {
		width: 100%;
		position: absolute;
		background-color: #fff;
		left: 0;
		bottom: 0;
		height: 60px;
		line-height: 60px;
		box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	.ivu-drawer-header-inner {
		font-size: 16px;
		color: #000;
		font-weight: normal;
	}
	.ivu-drawer-body {
		overflow: auto !important;
	}
}
</style>

