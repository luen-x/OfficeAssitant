<template>
	<div class="v-sale-customer-detail-follow-record g-relative g-pd-t-15" style="min-height:260px;">
		<oa-loading v-if="loading"/>
		<div v-if="showPublish" class="g-tr g-m-b-10">
			<i-button v-if="!readOnly" type="primary" @click="handleAddFollowRecord">
				<i-tooltip
					v-if="coinConfig.tip_4_1"
					:content="coinConfig.tip_4_1"
					:max-width="220"
					transfer 
					placement="top"
					style="position:relative;top:1px;"
				>
					<img :src="OSS_PROP_ICON4">
				</i-tooltip>

				<span style="position:relative;top:-3px;">
					添加跟进记录
				</span>
			</i-button>
		</div>
		<div style="width:680px;margin-right:30px;">
			<!-- <div class="g-m-tb-15">
				<span class="_title-bar g-bg-red-mid"/>
				<span class="g-fs-14 g-m-lr-5">跟进记录</span>
			</div> -->
			<div v-if="!records.length" class="g-flex g-jc-c">
				<div style="margin-top:80px">
					<img :src="OSS_SEARCH_EMPTY" >
					<div class="g-tc">暂无跟进记录</div>
				</div>
			</div>
			<oa-record
				v-else
				:records="records"
				class="g-col"
				style="overflow-y: auto"
			>
				<div slot-scope="{data}" class="_record">
					<div v-if="!(data.type===1 && data.handle_way == 2)" class="g-fs-14 g-c-black2">{{ data.remark }}</div>
					<div v-if="data.tape_link && data.type===1" class="g-m-t-5 _audio-background">
						<oa-cus-audio :src="data.tape_link" mode="mid" show-tip="never"/>
					</div>
					<div class="g-flex g-jc-sb">
						<div class="g-c-black4 g-pd-t-5" >
							<span v-if="data.connect_status" class="g-m-r-5">{{ data.connect_status }}</span>
							<span v-if="data.connect_status && data.customer_intention" class="g-m-r-5">--</span>
							<span v-if="data.customer_intention " class="g-m-r-5">
								{{ data.customer_intention }}
							</span>
							<span class="g-m-r-5">{{ data.staff_name }}</span>
							<span class="g-m-r-10">{{ data.create_time }}</span>
						</div>
						<div>
							<span v-if="data.status==1" class="g-c-red-mid g-m-l-10 g-pd-t-5">举报中</span>
							<span 
								v-else-if="data.staff_id !== $global.staff.staff_id && getAuth(isOwn,1683,1690) && data.is_new " 
								class="g-m-l-10 g-pd-t-5 __tip-off"
							>
								<i-tooltip 
									v-if="coinConfig.tip_5_1"
									:content="coinConfig.tip_5_1"
									:max-width="220"
									placement="top"
									transfer
								>
									<img :src="OSS_PROP_ICON2" style="height:14px;width:14px;position: relative;top: 4px;" class="g-m-r-5 g-pointer">
								</i-tooltip>
								<span v-if="!readOnly" class="g-operation" @click="handleTipOff(data)">举报</span>
							</span>
							<template v-if="!readOnly && showLike">
								<i 
									:style="{color:data.self_fabulous?'#F49A58':'#BBBBBB'}" 
									class="icon iconfont g-m-l-20 icon-zan g-pointer g-fs-14"
									@click="handleGood(data)"
								/> 
								( {{ data.fabulous }} )
								<i 
									:style="{color:data.self_not_good?'#F49A58':'#BBBBBB',top:'5px'}" 
									class="icon iconfont g-m-l-20 icon-cai g-pointer g-relative g-fs-14"
									@click="handleBad(data)"
								/> 
								( {{ data.not_good }} )
							</template>
						</div>
					</div>
				</div>
			</oa-record>
		</div>
	</div>
</template>
<script>
import { Input, Button, Form, FormItem, Select, Option, Tooltip } from 'iview';
import Loading from '@common/loading/loading';
import { OSS_PROP_ICON2, OSS_SEARCH_EMPTY, OSS_PROP_ICON4 } from '@constants/constants';
import TimeStep from '@common/time-step';
import { Confirm } from '@common/confirm/confirm';
import { services } from '@stores/services/sale';
import CusAudio from '@components/sale/_common/audio/audio';
import FollowItem from '../../components/follow-item';
import Record from '../../../../record';
import { getAuth } from '../../../../util';
import { AddFollowRecord } from '../../../add-follow-record';
import { TipOffFollow } from '../../../tip-off-follow.vue';

export default {
	name: 'oa-sale-customer-parts-follow-record',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-tooltip': Tooltip,
		'oa-loading': Loading,
		'oa-time-step': TimeStep,
		'oa-follow-item': FollowItem,
		'oa-record': Record,
		'oa-cus-audio': CusAudio
	},
	mixins: [
		services.coinConfig()

	],
	props: {
		customerId: Number,
		isOwn: Boolean,
		showPublish: {
			type: Boolean,
			default: true
		},
		showLike: {
			type: Boolean,
			default: true

		},
		readOnly: Boolean
	},
	data() {
		return {
			loading: false,
			OSS_PROP_ICON2,
			OSS_PROP_ICON4,
			OSS_SEARCH_EMPTY,
			// 2.2.5期上线时间，用于判断老数据不可举报
			TIME_LINE_2_2_5: (new Date(window.location.href.includes('oa.weiyian.com') ? '2019-12-27 13:30:00' : '2019-12-12 00:00:00')).getTime(),
			formData: {
				remark: '',
				type: '', // 1-OA通话记录，2-手机电话，3-微信维护，4-备注信息
				customer_intention: '', // 客户意向  1 无意向  2 待联系  3 跟进中
				connect_status: '', // 接通状态  0 未拨  1 已接  2 未接  3 拒接  4 空号  5 微信
				call_id: 0, // 通话记录ID
			},
			rules: {
				remark: [{ required: true, type: 'string', message: "请填写跟进记录", trigger: "blur" }],
				type: [{ required: true, type: 'number', message: "请选择跟进方式", trigger: "change" }],
				// customer_intention: [{ required: true, type: 'number', message: "请选择客户意向", trigger: "change" }],
				connect_status: [{ required: true, type: 'number', message: "请选择接通状态", trigger: "change" }]
			},
			followTypeList: [
				{ label: '手机电话', value: 2 },
				{ label: '微信维护', value: 3 },
				{ label: '备注信息', value: 4 }
			],
			currentFollowType: 0,
			intentionList: [
				{ label: '无意向', value: 1 },
				{ label: '待联系', value: 2 },
				{ label: '跟进中', value: 3 }
			],
			connectStatusList: [
				{ label: '未拨', value: 0 },
				{ label: '已接', value: 1 },
				{ label: '未接', value: 2 },
				{ label: '拒接', value: 3 },
				{ label: '空号', value: 4 },
				{ label: '微信', value: 5 }
			],
			records: [
				// {
				// 	"record_id": 2142,
				// 	"type": 1,
				// 	"customer_id": 399701,
				// 	"remark": "丹参粉是那发哦了多年佛兰德佛兰德发切断阀", // 备注
				// 	"call_id": 82421,
				// 	"staff_id": 1,
				// 	"customer_intention": "待联系", // 客户意向
				// 	"connect_status": "未接", // 接通状态
				// 	"create_time": "2019-12-10 15:29:14", // 创建时间
				// 	"tape_link": `https://oa-call.weiyian.com/web/recordPath/r
				// 		ecoredings/2019-12-05/cti_record_8167_1575506137464912_3f108a8b-19b1-4edf-9d3c-2f83a6964545.mp3`, // 录音地址
				// 	"customer_name": "叫叫叫", // 客户名称
				// 	"tel": "15089284795", // 电话
				// 	"head_img": "",
				// 	"staff_name": "超管", // 员工姓名
				// 	"depart_name": "公司", // 员工部门
				// 	"self_fabulous": 0,
				// 	"self_not_good": 0,
				// 	"fabulous": 0,
				// 	"not_good": 0,
				// 	"status": 1, // 1-举报中
				// }
			],
			commentLoading: false

		};
	},
	watch: {
		customerId(val) {
			this.currentFollowType = 0;
			this.loadData();

		}

	},
	beforeCreate() {
		this.getAuth = getAuth;

	},
	created() {
		this.loadData();

	},
	methods: {
		handleAddFollowRecord() {
			AddFollowRecord.popup({
				customerId: this.customerId
			}).then(() => {
				this.loadData();
				this.$emit('change');
			}).catch(e => e && console.error(e));

		},
		handlePublish() {
			this.$refs.form.validate(valid => {
				if (!valid) return;
				const param = {
					...this.formData,
					customer_id: this.customerId,
				};
				if (param.type !== 2) {
					param.connect_status = '';
				}
				this.$request({
					url: "_SALE_CUSTOMER_SALE_LOG_SAVE_POST",
					type: "POST",
					param,
					loading: false,
				}).then(res => {
					this.loadData();
					this.$emit('change');
					this.$refs.form.resetFields();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			});
			
		},
		handleClickFollowType(type) {
			this.currentFollowType = type;
			this.loadData();
		},
		loadData() {
			this.$request({
				url: "_SALE_CUSTOMER_SALE_LOG_RECORD_GET",
				type: "GET",
				param: {
					customer_id: this.customerId,
					type: this.currentFollowType
				},
				loading: false,
			}).then(res => {
				res.data.forEach(item => {
					item.is_new = (new Date(item.create_time)).getTime() > this.TIME_LINE_2_2_5;
				});
				this.records = res.data;

			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});

		},
		handleFollowChange() {
			this.loadData();
		},
		handleGood(row) {
			// if (this.data.self_fabulous) return;
			this.comment(1, row);


		},
		handleBad(row) {
			// 	if (this.data.not_good) return;
			this.comment(2, row);
		},
		comment(type, record) {
			if (this.commentLoading) return;
			this.commentLoading = true;
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
			}).catch(e => console.error(e)).finally(() => this.commentLoading = false);
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
					customerId: row.customer_id,
					recordId: row.record_id,
					hasTape: row.type === 1
				}).then(() => {
					this.loadData();
					this.$emit('change');
				}).catch(e => e && console.error(e));

			}).catch(e => e && console.error(e));

			
			
		}
	}
};
</script>
<style lang="scss">
.v-sale-customer-detail-follow-record {
	min-width: 680px;
	._audio-background {
		background: #F5F5F6;
		border-radius: 4px;
	}
	
	._record {
		.__tip-off {
			visibility: hidden;
		}
		&:hover {
			.__tip-off {
			visibility:visible;
			}
			
		}


	}
}
</style>