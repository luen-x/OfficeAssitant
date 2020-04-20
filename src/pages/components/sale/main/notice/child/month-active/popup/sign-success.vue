
<template>
	<i-drawer
		v-model="visible"
		class="_drawer"
		width="1100"
		title="报名完成"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<p slot="header" style="font-weight: normal; font-size: 16px;">
			<span>报名完成</span>
		</p>
		<div v-for="(item,i) in list" :key="i" class="_detail">
			<div class="__title">
				<span class="__border"/>
				客户{{ i+1 }}
				<span :class="item.status === 2 ? '_pass' : '_audit'">
					{{ item.status_name }}
					<span class="_trangle"/>
				</span>
			</div>
			<div class="g-flex">
				<div class="_detail-body">
					<div>
						公司名称
						<span>{{ item.customer_company ? item.customer_company : '--' }}</span>
					</div>
					<div>
						客户姓名
						<span>{{ item.boss_name ? item.boss_name : '--' }}</span>
					</div>
					<div>
						合作时间
						<span>{{ item.cooperate_date ? item.cooperate_date : '--' }}</span>
					</div>
					<div>
						合作类别
						<span>{{ item.cooperate_category_name ? item.cooperate_category_name : '--' }}</span>
					</div>
					<div>
						是否听完
						<span>{{ item.listen_finish }}</span>
					</div>
					<div>
						已招代理人数
						<span>{{ item.proxy_num ? item.proxy_num : '--' }}</span>
					</div>
				</div>
				<div class="_detail-body">
					<div>
						公司行业
						<span>{{ item.industry_name ? item.industry_name : '--' }}</span>
					</div>
					<div>
						客户电话
						<span>{{ item.boss_tel ? item.boss_tel : '--' }}</span>
					</div>
					<div>
						复训次数
						<span>{{ item.retrain_number ? item.retrain_number : '--' }}</span>
					</div>
					<div>
						是否起盘
						<span>{{ item.lift_plate_month }}</span>
					</div>
					<div>
						参加过策略班
						<span>{{ item.is_join_strategy }}</span>
					</div>
					<div>
						是否续费
						<span>{{ item.is_renew_name ? item.is_renew_name : '--' }}
							<span v-if="item.is_renew==2">
								({{ item.renew_type_name ? item.renew_type_name : '--' }})
							</span>
						</span>
					</div>
					<div v-for="(msg,n) in item.activityApplyUser" v-if="n<1" :key="n">
						报名人{{ n+1 }}
						<span >{{ msg.username }}({{ msg.position }} {{ msg.id_card }})</span>
					</div>
				</div>
			</div>
			<div class="g-flex g-fw-w" style="width:880px;">
				<div v-for="(msg,n) in item.activityApplyUser" v-if="n>0" :key="n" class="_apply-user" >
					报名人{{ n +1 }}
					<span >{{ msg.username }}({{ msg.position }} {{ msg.id_card }})</span>
				</div>
				<div v-if="item.voucher_url" class="_detail-body-img g-m-t-10 g-flex" style="width: 400px;border-bottom: 1px solid #e7e7e7" >
					<span style="vertical-align: top; width:64px">查看凭证</span>
					<vc-imgs-preview :data-source="item.voucher_url.split(',')" style="vertical-align: top;margin-left: 40px"/>
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
import active from './active';
import list from './list';

export default {
	name: "sign-success",
	components: {
		"i-drawer": Drawer,
		"i-tabs": Tabs,
		"i-tabPane": TabPane,
		"i-input": Input,
		"oa-active": active,
		"oa-list": list,
		'vc-imgs-preview': ImgsPreview
	},
	props: {
		data: Object,
	},
	data() {
		return {
			visible: false,
			list: [],
		};
	},
	mounted() {
		this.visible = true;
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.list = this.data.result;
	},
	methods: {
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
		}
	}
};
export const SignSuccess = CreatePortal({}, module.exports.default);
</script>

<style scoped lang="scss">
    ._drawer {
        /deep/ .ivu-drawer-wrap .ivu-drawer-body {
                padding: 0 !important;
        }
     }
    ._detail {
		margin: 40px;
		margin-top: 20px;
        .__title {
            font-size: 14px;
            margin-bottom: 20px;
			line-height: 21px;
			._pass{
				font-size: 12px;
				position: relative;
				height: 20px;
				line-height: 21px;
				display: inline-block;
				vertical-align: middle;
				background: #edf7e9;
				padding-left: 5px;
				margin-left: 8px;
				color: #46bc34;
				._trangle{
					position: absolute;
					width:0;
					height:0;
					border-width:10px 0 10px 10px;
					border-style:solid;
					border-color:transparent transparent transparent #edf7e9;
					top: 0;
					right: -10px;
				}
			}
			._audit{
				font-size: 12px;
				position: relative;
				height: 20px;
				line-height: 21px;
				display: inline-block;
				vertical-align: middle;
				background-color: #eaf4fe;
				padding-left: 5px;
				margin-left: 8px;
				color: #2397f9;
				._trangle{
					position: absolute;
					width:0;
					height:0;
					border-width:10px 0 10px 10px;
					border-style:solid;
					border-color:transparent transparent transparent #eaf4fe;
					top: 0;
					right: -10px;
				}
			}
            .__border {
                display: inline-block;
                margin-right: 10px;
                background: #e74854;
                width: 2px;
				height: 14px;
				vertical-align: middle;
            }
        }
        ._detail-body  > div {
			font-size: 12px;
            width: 400px;
            height: 44px;
            line-height: 44px;
            color: #818794;
            border-bottom: 1px solid #e7e7e7;
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
       ._detail-body > ._detail-body-img {
            height: 100px;
            line-height: 0px;
            img {
				margin-top: 10px;
				border: 1px solid #e7e7e7;
            }
        }
    }
	._apply-user {
			font-size: 12px;
            width: 400px;
            height: 44px;
            line-height: 44px;
            color: #818794;
            border-bottom: 1px solid #e7e7e7;
            margin-right: 40px;
            & > span {
				margin-left: 40px;
				color: #333;
            }
        }

</style>
