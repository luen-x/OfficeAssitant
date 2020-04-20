<template>
	<div class="v-sale-property-center">
		<oa-loading v-if="loading" />
		<div v-else>
			<div v-if="itemData.length" class="_wrapper">
				<div v-for="(item, index) in itemData" :key="index" class="__wrapper-item">
					<div 
						:style="`background: url(${imageData[item.type_id - 1]});`" 
						class="__item-img g-pointer"
						@click="handleDetail(item)" 
					>
						<div 
							style="color: #fff;font-size: 25px;padding: 35px 0 0 20px;" 
						>{{ item.firstText }}</div>
						<div 
							style="color: #fff;font-size: 22px;padding-left: 20px;" 
						>{{ item.secondText }}</div>
						<div 
							v-if="item.thirdText" 
							:style="{ color: item.textColor}" 
							style="background-color: #fff;
							font-size: 16px;
							border-radius: 4px;
							padding: 3px 10px 3px 10px;
							width: 68px;
							margin: 10px 0 0 20px"
						>
							{{ item.thirdText }}
						</div>
					</div>
					<div class="g-pd-20">
						<div class="g-fs-16 __item-name">{{ item.prop_name }}</div>
						<div class="__item-desc">{{ item.title }}</div>
						<div class="g-flex g-jc-sb g-m-t-20">
							<div class="__item-coin g-relative">
								<img 
									:src="OSS_PROP_ICON3" 
									class="g-inline-block g-absolute"
									style="width: 20px;height: 20px;left: 0px;bottom: 6px;"
								>
								<span style="padding-left: 25px;">{{ item.price }} 微币</span>
							</div>
							<div class="__item-option">
								<div 
									class="__option-symbol g-inline-block g-pointer"
									style="margin-right: 29px;"
									@click="handleReduce(item, index)"
								>
									<i class="iconfont icon-chengguojishanghenggang" />
								</div>
								<i-input-number 
									v-model="item.num"
									:max="999"
									:min="0"
									class="__option-number g-inline-block"
									@on-change="handleNumChange" 
								/>
								<div 
									class="__option-symbol g-inline-block g-pointer"
									style="margin-left: 29px;"
									@click="handleAdd(item, index)"
								>
									<i class="iconfont icon-add3" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-else class="g-tc g-pd-t-30" style="margin: 0 auto;">
				<img :src="OSS_SEARCH_CUSTOMER" >
				<div class="g-fs-14">暂无道具上架</div>
			</div>
		</div>
		<div class="_footer g-flex-cc">
			<div class="g-m-r-10">预计消费<span style="color: #E74854">{{ totalPrice }}微币</span>（余额{{ all }}微币）</div>
			<i-button type="primary" @click="handleSave">确认购买</i-button>
		</div>
	</div>
</template>

<script>
import { Button, InputNumber } from 'iview';
import { debounce } from 'lodash';
import { Confirm } from "@components/_common/confirm/confirm";
import { getItem, setItem, delItem } from 'wya-utils';
import { OSS_SEARCH_CUSTOMER, OSS_PROP_BG_S01_, OSS_PROP_BG_S02, OSS_PROP_BG_S03, OSS_PROP_BG_S04,
	OSS_PROP_BG_S05, OSS_PROP_BG_S06, OSS_PROP_BG_S07, OSS_PROP_ICON3 } from '@constants/constants';
import { DetailModal } from "./popup/detail-modal";

export default {
	name: 'v-sale-property-center',
	components: {
		'i-button': Button,
		'i-input-number': InputNumber
	},
	data() {
		return {
			loading: false,
			itemData: [],
			all: 0,
			OSS_PROP_ICON3,
			OSS_SEARCH_CUSTOMER,
			imageData: [OSS_PROP_BG_S01_, OSS_PROP_BG_S03, OSS_PROP_BG_S07, OSS_PROP_BG_S02, OSS_PROP_BG_S06,
				OSS_PROP_BG_S04, OSS_PROP_BG_S05],
			configData: [
				{
					firstText: '当日领取客户',
					secondText: '',
					thirdText: '名额券',
					textColor: '#FD7452'
				}, {
					firstText: '一次性',
					secondText: '普通客户',
					thirdText: '保护券',
					textColor: '#2460DA'
				}, {
					firstText: '一次性',
					secondText: '重要客户',
					thirdText: '保护券',
					textColor: '#F21E1E'
				}, {
					firstText: '120天',
					secondText: '普通客户',
					thirdText: '名额券',
					textColor: '#FD5254'
				}, {
					firstText: '120天',
					secondText: '重要客户',
					thirdText: '名额券',
					textColor: '#5155D4'
				}, {
					firstText: '保护期',
					secondText: '延长盾牌',
					thirdText: '',
					textColor: '#00BFA5'
				}, {
					firstText: '抢资料',
					secondText: '优先令牌',
					thirdText: '',
					textColor: '#B654D6'
				}

			]
		};
	},
	computed: {
		totalPrice() {
			let number = this.itemData.reduce((prev, cur) => {
				return cur.price * cur.num + prev;
			}, 0);
			return number;
		},
		totalNumber() {
			let number = this.itemData.reduce((prev, cur) => {
				return cur.num + prev;
			}, 0);
			return number;
		},
	},
	created() {
		this.loadData();
		this.loadMycoinData();
	},
	methods: {
		loadData() {
			this.loading = true;
			this.$request({
				url: "_SALE_PROPERTY_CENTER_LIST_GET",
				type: 'GET',
				param: {},
				loading: false
			}).then((res) => {
				let data = getItem("property_list" + _global.version, 'localStorage');
				res.data.forEach(item => {
					item.num = 0;
					item.firstText = this.configData[item.type_id - 1].firstText;
					item.secondText = this.configData[item.type_id - 1].secondText;
					item.thirdText = this.configData[item.type_id - 1].thirdText;
					item.textColor = this.configData[item.type_id - 1].textColor;
					if (data) {
						const prop = data.find(i => i.type_id == item.type_id);
						if (prop) {
							item.num = prop.num || 0;
						}
					}
				});
				this.itemData = res.data;
				this.loading = false;
			});
		},
		loadMycoinData() {
			this.$request({
				url: "_HR_PERSONNEL_CURRENCY_BASE_COIN_GET",
				type: 'GET',
				param: {
					staff_id: this.$global.staff.staff_id
				},
				loading: false
			}).then((res) => {
				this.all = res.data.settled_coins;
			});
		},
		handleDetail(item) {
			DetailModal.popup({
				datas: item
			}).catch(err => err && console.error(err));
		},
		handleReduce(item) {
			if (item.num > 0) {
				item.num -= 1;
				this.handleNumChange();
			}
			

		},
		handleAdd(item) {
			if (item.num < 999) {
				item.num += 1;
				this.handleNumChange();
			}	
		},
		handleNumChange: debounce(function () {
			setItem("property_list" + _global.version, this.itemData, 'localStorage');
		}, 200),
		handleSave() {
			if (this.totalNumber) {
				if (this.totalPrice > this.all) {
					Confirm.popup({
						title: '提醒',
						msg: `当前您的微币余额不足，不可购买`,
						showIcon: true,
					}).then(result => {
					
					});
				} else {
					Confirm.popup({
						title: '确认购买',
						msg: `当前共计消费${this.totalPrice}微币，可获得${this.totalNumber}件道具，一旦确认购买，概不退换。`,
						showIcon: true,
					}).then(result => {
						this.$request({
							url: "_SALE_PROPERTY_CENTER_PROPERTY_BUY_POST",
							type: 'POST',
							param: this.itemData,
							loading: false
						}).then((res) => {
							// this.loadData();
							// this.loadMycoinData();
							this.$Message.success('购买成功');
							this.itemData.forEach(v => {
								v.num = 0;
							});
							setItem("property_list" + _global.version, this.itemData, 'localStorage');
							this.$router.push('/sale/property/mine');
						}).catch(err => {
							this.$Message.error(err.msg);
						});
					});
				}
			} else {
				this.$Message.warning('请添加购买道具');
			}
			
		}
	},
};
</script>

<style lang="scss">
.v-sale-property-center {
	._wrapper {
		margin: 30px 70px 70px 70px;
		.__wrapper-item {
			display: inline-block;
			margin-bottom: 20px;
			margin-right: 20px;
			width:300px;
			min-width: 300px;
			height:290px;
			background:rgba(255,255,255,1);
			border-radius:4px;
			box-shadow: 0px 0px 5px 0.1px rgba(0, 0, 0, 0.08);
			.__item-img {
				border-top-left-radius: 4px;
				border-top-right-radius: 4px;
				display: block;
				height: 169px;
				background-color: #776767;
			}
			.__item-name {
				color: #4B4F57;
			}
			.__item-desc {
				color: #818794;
			}
			.__item-coin {
				height: 32px;
				line-height: 32px;
				color: #E74854
			}
			.__item-option {
				position: relative;
				height: 32px;
				line-height: 32px;
				.__option-symbol {
					text-align: 19px;
					text-align: center;
					height: 32px;
					width: 32px;
					background-color: #F5F5F5;
					color: #999999;
					border-radius: 4px;
				}
				.__option-number {
					position: absolute;
					top: 0px;
					left: 35px;
					text-align: center;
					width: 56px;
				}
			}
		}
	}
	._footer {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 45px;
		background-color: #fff;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	.ivu-input-number {
		.ivu-input-number-handler-wrap {
			display: none;
		}
		input {
			text-align: center;
		}
	}
}	
</style>
