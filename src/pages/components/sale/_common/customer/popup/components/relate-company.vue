<template>
	<div class="v-sale-customer-popup-relate-customer g-box-shadow">
		<div class="g-pd-10 _relate-title">
			<span class="g-c-black4">公司名称：</span>
			<span class="g-c-black3">{{ data.company_name }}</span>
		</div>
		<div class="_content">
			<div style="height:85px">
				<div v-if="relateType==1" class="g-flex g-pd-l-10 g-pd-t-15">
					<span class="g-c-black4">相同联系方式：</span>
					<div class="g-c-black3 g-col g-blue-scroll" style="max-height:41px;overflow:auto" >
						<div v-for="tel in data.same_tel" :key="tel.original_tel">
							{{ tel.customer_name+'/'+tel.customer_role+'/'+tel.original_tel }}
						</div>
					</div>
				</div>
				<div class="g-pd-lr-10 g-pd-t-10">
					<span class="g-c-black4">负责人：</span>
					<span class="g-c-black3">{{ data.staff_name || '-' }}</span>
					<span v-if="!readOnly && data.can_get" class="g-operation g-m-l-10" @click="handleGetCustomer">领取资料</span>
				</div>
				<div v-if="relateType==2" style="height:55px">
					<div v-if="data.sign && data.sign.length" class="g-pd-lr-10 g-pd-t-10">
						<span class="g-c-black4">标记原因：</span>
						<span class="g-c-black3">{{ data.sign.join('、') }}</span>
					</div>
				</div>
			</div>
			<!-- footer -->
			<div class="g-pd-10 g-tr g-relative">
				<template v-if="relateType==1">
					<span v-if="unReportLink.length==0">
						举报中
					</span>
					<template v-else-if="!readOnly && getAuth(isOwn,1684 ,1691)">
						<i-tooltip 
							v-if="coinConfig.tip_5_1" 
							:content="coinConfig.tip_5_1" 
							:max-width="220"
							placement="top"  
							transfer
						>
							<img :src="OSS_PROP_ICON2" style="height:18px;width:18px;position: relative;top: 4px;" class="g-m-r-5 g-pointer">
						</i-tooltip>
						<span class="g-operation" style="position: relative;bottom: 2px;" @click="handleTipOff">举报</span>
					</template>
				</template>
				<template v-else-if="relateType==2 && data.label!='已领取'">
					<span v-if="!data.can_sign" class="g-c-orange-mid g-bold" >已标记</span>
					<template v-else-if="data.status===0 && getAuth(isOwn,1685,1692) && !readOnly">
						<i-tooltip 
							v-if="coinConfig.tip_2_1" 
							:content="coinConfig.tip_2_1"
							:max-width="220"
							placement="top"
							transfer
						>
							<img :src="OSS_PROP_ICON2" style="height:18px;width:18px;position: relative;top: 4px;" class="g-m-r-5 g-pointer">
						</i-tooltip>
						<span class="g-operation" style="position: relative;bottom: 2px;" @click="handleMark">标记</span>
					</template>
				</template>
				<span v-if="data.label " :class="'_tag ' + tagClass ">
					{{ data.label }}
					<span class="__tangle"/>
				</span>
			</div>
		</div>
		
	</div>
</template>
<script>
import { Tooltip } from 'iview';
import { OSS_PROP_ICON2 } from '@constants/constants';
import { Confirm } from '@common/confirm/confirm.vue';
import service from '@utils/service';
import { TipOffLink } from '../../tip-off-link';
import { DrawBack } from '../../draw-back';
import { getAuth } from '../../../util';


const colorConfig = {
	1: '_blue',
	2: '_green',
	3: '_red',
	4: '_orange',
};
const labelColor = {
	'已成交': '_blue',
	'存在公海': '_orange',
	'已关联': '_blue',
	'黑名单（待确认）': '_grey',
	'黑名单（已确认）': '_black',
	'已领取': '_green',
	'白名单': '_red'
};

export default {
	name: 'oa-sale-customer-parts-com-relate-customer',
	components: {
		'i-tooltip': Tooltip
	},
	props: {
		data: Object,
		coinConfig: [Array, Object],
		relateType: Number, // 1-电话关联， 2-公司名关联
		isOwn: Boolean,
		readOnly: Boolean
		//   {
		//     "customer_id": 398953,    // 关联出来的客户主键
		//     "same_tel": [    // 相同的电话数组
		//         {
		//             "link_id": 17318,
		//             "customer_id": 398953,
		//             "customer_type": 1,
		//             "customer_name": "客户",
		//             "original_tel": "13155558888",
		//             "customer_role": "法人"
		//         }
		//     ],
		//     "create_time": 1553612451,
		//     "company_name": "红薯",    // 公司名
		//     "staff_name": "小小一（杭三1部）",    // 负责人
		//     "label": "已领取",    // 标签状态
		//     "can_get": 0    // 是否可以领取
		// 		"status":0 , 0 表示在公海或黑名单待确认
		// }

		// "customer_id": 400231,    // 客户主键
		// "company_name": "五分钟内看的测试指派",    // 公司名
		// "staff_name": "",    // 负责人
		// "sign": ['已合作','已成交'],    // 标记
		// "label": "存在公海",    // 标签
		// "can_get": 1,    // 是否可以领取
		// "can_sign": 1    // 是否可以标记

	},
	data() {
		return {
			OSS_PROP_ICON2
		};
	},
	computed: {
		tagClass() {
			return labelColor[this.data.label] || '_blue';
			
		},
		unReportLink() {
			return this.data.same_tel.filter(i => !i.report);
		}

	},
	beforeCreate() {
		this.getAuth = getAuth;

	},
	methods: {
		handleTipOff() {
			Confirm.popup({
				title: "温馨提示",
				cancelText: '',
				renderContent: (h) => {
					return (
						<div style="color: #4b4f57" class="g-fs-14">
						恶意举报客户资料信息经核实后会受到处罚，请如实举报。
						{this.coinConfig.tip_16_1 && <span >（{this.coinConfig.tip_16_1}）</span>}
						<br/><br/>
						<span style="color: #818794">此类型的举报必须提供凭证，例如聊天截图、工商信息截图、通话录音等相关材料</span>
						</div>
					);
				}
			}).then(() => {
				TipOffLink.popup({
					companyName: this.data.company_name,
					linkList: [...this.unReportLink],
					customerId: this.data.customer_id,


				}).then(() => {
					this.$emit('change');
				}).catch(e => e && console.error(e));

			}).catch(e => e && console.error(e));
			


		},
		handleGetCustomer() {
			service.getCustomer(this.data.customer_id).then(() => {
				this.$emit('change');
				this.$store.commit('SALE_CUSTOMER_INTENTION_LIST_RESET');
			}).catch(e => e && console.error(e));
			// this.$request({
			// 	url: "_SALE_SEA_GET_CUSTOMER_POST",
			// 	type: 'POST',
			// 	loading: false,
			// 	param: {
			// 		customer_id: this.data.customer_id
			// 	},
			// 	autoTip: false
			// }).then(res => {
			// 	if (res.data.error_code) {
			// 		this.$Message.error(res.data.error_msg);
			// 	} else {
			// 		this.$Message.success(res.msg);
			// 		this.$emit('change');
			// 	}
			// }).catch(res => {
			// 	this.$Message.error(res.msg);
			// });
		},
		handleMark() {
			Confirm.popup({
				title: '温馨提示',
				renderContent: (h) => {
					return <div class="g-fs-14 g-c-black3">
						{this.coinConfig.tip_11_1}
						<br/><br/>
						<span class="g-fs-12 g-c-black4">
							此类型的举报必须提供凭证，例如已合作证明截图、工商信息截图等相关材料
						</span>
					</div>;
				},
				cancelText: '',
				okText: '确定'
			}).then(() => {
				DrawBack.popup({
					customer_id: this.data.customer_id,
					mode: 'sign'
				}).then(() => {
					this.$emit('change');

				});
			}).catch(e => e && console.error(e));
			
		},
		

	}
};
</script>
<style lang="scss">
.v-sale-customer-popup-relate-customer {
	border-radius: 4px;
	width: 320px;
	height: 170px;
	margin-right: 20px;
	margin-bottom: 20px;
	._relate-title {
		background:  #F0F4FC;
		border-radius: 4px 0  0 4px;
	}
	._content {
		border-radius: 0 4px 4px 0;

	}
	._tag {
		display: inline-block;
		position: absolute;
		left:-6px;
		height: 24px;
		// width: 60px;
		padding: 2px 10px 2px 10px;
		line-height: 20px;
		text-align: center;
		color: white;
		border-radius: 2px 2px 2px 0;
		overflow: visible;
		.__tangle {
			border-width: 3px 3px 3px 3px;
			border-style: solid;
			position: absolute;
			bottom: -6px;
			left: 0px;
			display: inline-block;
		}
		&._red  {
			background: #e74854;
			.__tangle {
				border-color: #e74854 #e74854 transparent transparent;
			}
		}
		&._blue  {
			background: #2397F9;
			.__tangle {
				border-color: #2397F9 #2397F9 transparent transparent;
			}
		}
		&._black  {
			background: #000;
			.__tangle {
				border-color: #000 #000 transparent transparent;
			}
		}
		&._grey  {
			background: #999;
			.__tangle {
				border-color: #999 #999 transparent transparent;
			}
		}
		&._orange  {
			background: #ED8F4A;
			.__tangle {
				border-color: #ED8F4A #ED8F4A transparent transparent;
			}
		}
		&._green  {
			background: #4fc43d;
			.__tangle {
				border-color: #4fc43d #4fc43d transparent transparent;
			}
		}
		

	}

}

</style>