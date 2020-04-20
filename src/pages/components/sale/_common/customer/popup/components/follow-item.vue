<template>
	<div class="v-sale-customer-popup-follow-item g-box-shadow g-pd-20 g-m-b-20">
		<div class="g-flex g-jc-sb">
			<span class="g-fs-14" style="color: #333;">
				{{ followType.label }}
				<span v-if="(data.type==1 || data.type==2) && data.connect_status" class="g-m-l-10">{{ data.connect_status }} </span>
				<span v-if="data.customer_intention" class="g-m-l-10"> {{ data.customer_intention }} </span>
				<span v-if="data.status==1" class="g-c-red-mid g-m-l-10">举报中</span>
			</span>
			<span style="color: #999;">
				<span class="g-m-r-10">{{ data.staff_name }}</span> {{ data.create_time }}
			</span>
		</div>
		<template v-if="data.type===1">
			<div class="g-flex g-m-t-10" >
				<span class="g-c-black4">沟通客户：</span>
				<span>{{ data.customer_name }}</span>
				<span class="g-c-black4 g-m-l-60">电话：</span>
				<span>{{ showTel?data.tel:'***********' }}</span>
			</div>
			<div class="g-m-t-10 g-pd-lr-20 _audio-background">
				<oa-cus-audio :src="data.tape_link" mode="mid" show-tip="never"/>
			</div>
		</template>
		<div v-if="data.handle_way !== 2 && data.remark" class="g-flex g-m-t-10">
			<span class="g-c-black4">{{ data.type===1?'备注':'跟进记录' }}：</span>
			<span class="g-col">{{ data.remark }}</span>
		</div>
		<div style="background:#EBEEF1;height:1px;" class="g-m-tb-10" />
		<div style="color:#BBBBBB">
			<template v-if="showLike">
				<i 
					:style="{color:data.self_fabulous?'#F49A58':'#BBBBBB'}" 
					class="icon iconfont g-m-l-10 icon-zan g-pointer"
					@click="handleGood"
				/> 
				( {{ data.fabulous }} )
				<i 
					:style="{color:data.self_not_good?'#F49A58':'#BBBBBB',top:'5px'}" 
					class="icon iconfont g-m-l-30 icon-cai g-pointer g-relative"
					@click="handleBad"
				/> 
				( {{ data.not_good }} )
			</template>
			<span v-if="data.staff_id !== $global.staff.staff_id && getAuth(isOwn,1683,1690) && data.is_new " class="g-m-l-30" >
				<i-tooltip 
					v-if="coinConfig.tip_5_1"
					:content="coinConfig.tip_5_1"
					:max-width="220"
					placement="top"
					transfer
				>
					<img :src="OSS_PROP_ICON2" style="height:18px;width:18px;position: relative;top: 4px;" class="g-m-r-5 g-pointer">
				</i-tooltip>
				<span class="g-operation" @click="handleTipOff">举报</span>
			</span>
		</div>
	</div>
</template>
<script>
import { Input, Button, Tooltip } from 'iview';
import CusAudio from '@components/sale/_common/audio/audio';
import { OSS_PROP_ICON2 } from "@constants/constants";
import { Confirm } from '@common/confirm/confirm.vue';
import { TipOffFollow } from '../../tip-off-follow.vue';
import { getAuth } from '../../../util';


const followTypes = [
	{ label: 'OA通话记录', value: 1 },
	{ label: '手机电话', value: 2 },
	{ label: '微信维护', value: 3 },
	{ label: '备注信息', value: 4 }
];

export default {
	name: 'oa-sale-customer-popup-follow-item',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-tooltip': Tooltip,
		'oa-cus-audio': CusAudio
	},
	props: {
		data: {
			type: Object,
			default: () => ({
				"record_id": 1,
				"type": 1,	// 0-全部，1-OA通话记录，2-手机电话，3-微信维护，4-备注信息
				"customer_id": 1,
				"remark": "", // 备注
				"call_id": 1,
				"staff_id": 1,
				"customer_intention": "", // 客户意向
				"connect_status": "", // 接通状态
				"create_time": "", // 创建时间
				"tape_link": '', // 录音地址
				"customer_name": "", // 客户名称
				"tel": "", // 电话
				"head_img": "",
				"staff_name": "", // 员工姓名
				"depart_name": "", // 员工部门
				"self_fabulous": 0,
				"self_not_good": 0,
				"fabulous": 0,
				"not_good": 0,
				"status": 1, // 1-举报中
			})
		},
		coinConfig: {
			type: Object,
			default: () => ({})
		},
		isOwn: Boolean,
		showLike: {
			type: Boolean,
			default: true
		},
		showTel: {
			type: Boolean,
			default: true

		}


	},
	data() {
		return {
			OSS_PROP_ICON2,
			followTypes,
			commentLoading: false
		};
	},
	computed: {
		followType() {
			return followTypes.find(item => item.value == this.data.type) || {};
		}
	},
	beforeCreate() {
		this.getAuth = getAuth;
	},
	methods: {
		handleGood() {
			// if (this.data.self_fabulous) return;
			this.comment(1);


		},
		handleBad() {
			// 	if (this.data.not_good) return;
			this.comment(2);
		},
		comment(type) {
			if (this.commentLoading) return;
			this.commentLoading = true;
			const record = this.data;
			this.$request({
				url: "_SALE_SALE_LOG_COMMENT_POST",
				type: "POST",
				param: {
					record_id: record.record_id,
					type
				},
				loading: false,
				autoTip: true
			}).then(res => {
				if (type == 1) {
					if (record.self_fabulous) {
						record.self_fabulous = 0;
						record.fabulous--;
					} else {
						record.fabulous++;
						record.self_fabulous = 1;
					}
					
				} else if (type == 2) {
					if (record.self_not_good) {
						record.self_not_good = 0;
						record.not_good--;
					} else {
						record.self_not_good = 1;
						record.not_good++;
					}
				}
			}).catch(err => console.error(e)).finally(() => this.commentLoading = false);
		},
		handleTipOff(row) {
			Confirm.popup({
				title: '温馨提示',
				renderContent: (h) => {
					return (
						<div>
							<div class="g-fs-14" style="color: #4b4f57">
								恶意举报跟进记录经核实后会受到处罚，请如实举报。
							{this.coinConfig.tip_12_1 && '（' + this.coinConfig.tip_12_1 + '）'}
							</div>
							<br/>
							<div style="color: #818794">
								举报规则：没有明确含义的文字表述、辱骂客户及虚假宣传录音可举报。
							</div>
					
						</div>
					);
				}

			}).then(() => {
				TipOffFollow.popup({
					customerId: this.data.customer_id,
					recordId: this.data.record_id,
					hasTape: this.data.type === 1
				}).then(() => {
					this.$emit('change');
				}).catch(e => e && console.error(e));

			}).catch(e => e && console.error(e));

			
			
		}

	}
};
</script>
<style lang="scss">
.v-sale-customer-popup-follow-item {
	._audio-background {
		background: #F5F5F6;
		border-radius: 4px;
	}


}
</style>