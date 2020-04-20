
<template>
	<i-drawer
		v-model="visible"
		class="page-drawer"
		width="1100"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<p slot="header">
			<span class="_header">报名详情</span>
		</p>
		<div class="_detail">
			<div class="_title">{{ status[applyDetail.status] }} <span v-if="applyDetail.status==3">（{{ applyDetail.audit_remark }}）</span> </div>
			<div class="g-flex">
				<div class="__body">
					<div>
						公司名称
						<span>{{ applyDetail.customer_company ? applyDetail.customer_company : '--' }}</span>
					</div>
					<div>
						客户姓名
						<span>{{ applyDetail.boss_name ? applyDetail.boss_name : '--' }}</span>
					</div>
					<div>
						合作时间
						<span>{{ applyDetail.cooperate_date ? applyDetail.cooperate_date : '--' }}</span>
					</div>
					<div>
						合作类别
						<span>{{ applyDetail.cooperate_category_explain ? applyDetail.cooperate_category_explain : '--' }}</span>
					</div>

					<div>
						是否参加过策略班
						<span>{{ applyDetail.is_join_strategy_label ? applyDetail.is_join_strategy_label : '--' }}</span>
					</div>
					<div>
						已招代理数
						<span>{{ applyDetail.proxy_num ? applyDetail.proxy_num : '--' }}</span>
					</div>
				</div>
				<div class="__body">
					<div>
						公司行业
						<span>{{ applyDetail.industry_name ? applyDetail.industry_name : '--' }}</span>
					</div>

					<div>
						客户电话
						<span>{{ applyDetail.boss_tel ? applyDetail.boss_tel : '--' }}</span>
					</div>
					<div>
						复训次数
						<span>{{ applyDetail.retrain_number_label }}</span>
					</div>
					<div>
						是否起盘
						<span>{{ applyDetail.lift_plate ? applyDetail.lift_plate : '--' }}</span>
					</div>
					<div>
						是否听完
						<span>{{ applyDetail.listen_finish_label }}</span>
					</div>
					<div>
						是否续费
						<span>{{ applyDetail.is_renew_name ? applyDetail.is_renew_name : '--' }}
							<span v-if="applyDetail.is_renew==2">
								({{ applyDetail.renew_type_name ? applyDetail.renew_type_name : '--' }})
							</span>
						</span>
					</div>
					<div
						v-for="(temp,index) in applyDetail.apply_users"
						v-if="index<1"
						:key="index"
						class="__body">
						<div >
							报名人{{ index+1 }}
							<span class="g-inline-block">
								{{ temp.username }}{{ temp.customer_company }}
								<span>({{ temp.position }}</span>
								<span class="g-m-lr-5">{{ temp.id_card }}</span>
								<span>{{ temp.phone }})</span>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div class="g-flex g-fw-w" style="width:880px;">
				<div
					v-for="(temp,index) in applyDetail.apply_users"
					v-if="index>0"
					:key="index"
					class="__body">
					<div >
						报名人{{ index+1 }}
						<span>
							{{ temp.username }}
							{{ temp.customer_company }}({{ temp.position }}
							{{ temp.id_card }})
						</span>
					</div>
				</div>
				<div >
					<div
						v-if="applyDetail.voucher"
						class="g-flex-ac g-fw-w g-m-t-10 "
						style="color: #818794;width: 400px; border-bottom: 1px solid #e7e7e7">
						查看凭证
						<v-imgs-preview
							:data-source="applyDetail.voucher.split(',')"
							:render-row="renderRow"
							style="margin-left:80px "
						/>
					</div>
				</div>
			</div>
		</div>
		<div slot="footer">
			<vc-debounce-click :tag="Button" type="text" @click="handleNull">取消</vc-debounce-click>
			<vc-debounce-click :tag="Button" type="error" @click="handleSave">保存</vc-debounce-click>
		</div>
	</i-drawer>
</template>

<script type="text/ecmascript-6">
import { Drawer, Tabs, TabPane, Input, Button } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import API from '@stores/apis/root';
import active from './active';
import list from './list';

export default {
	name: "list-detail",
	components: {
		"i-drawer": Drawer,
		"i-tabs": Tabs,
		"i-tabPane": TabPane,
		"i-input": Input,
		"oa-active": active,
		"oa-list": list,
		'v-imgs-preview': ImgsPreview,
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			status: ['', '待审核', '已通过', '已拒绝'],
			applyDetail: {
				apply_users: [],
				industry_name: ''
			},
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		let i = this.data.id;
		this.handleDetail(i);
	},
	methods: {
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
		handleSave() {
			this.visible = false;
		},
		handleNull() {
			this.visible = false;
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleDetail(i) {
			this.$request({
				url: API._SALE_MAIN_ACTIVEITY_APPLY_DETAIL_GET,
				type: "GET",
				param: {
					id: i,
				}
			}).then((res) => {
				this.applyDetail = res.data;
			});
		}

	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>

<style scoped lang="scss">
    .page {
        &-drawer {
            /deep/ .ivu-drawer-wrap .ivu-drawer-body {
                padding: 0 !important;
            }
        }
    }
    ._header {
        font-weight: normal;
        font-size: 16px;
        color: #000;
    }
	._title{
		font-size: 16px;
        color: #333;
	}
    ._detail {
		margin:20px 40px 40px 40px ;
		/deep/ .vc-imgs-preview{
			img{
				border: 1px solid #e8e8e8;
			}
		}
        .__body > div {
            font-size: 12px;
            width: 400px;
            height: 44px;
            line-height: 44px;
            color: #818794;
            border-bottom: 1px solid #d4d7db;
            margin-right: 40px;
            & > span {
                margin-left: 40px;
                color: #333;
                & > img {
                    width: 72px;
                    height: 72px;
                }
            }
        }
    }
</style>
