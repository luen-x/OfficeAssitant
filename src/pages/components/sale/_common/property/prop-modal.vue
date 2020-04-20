<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="道具介绍"
		width="400"
		class="v-prop-modal"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<div class="_wrapper">
			<div class="g-pd-r-30 g-pd-t-15">
				<i
					class="iconfont icon-tishi g-c-orange-mid g-m-r-5"
				/>
				<span style="color: #333;">
					{{ data[type].noticeText }}
				</span>
			</div>
			<div style="color: #666;margin-left: 24px;" class="g-m-t-15">
				可使用道具：
			</div>
			<div style="margin-left: 24px;">
				<div 
					v-for="(item, index) in data[type].card"
					:key="index"
					:class="item.click ? '__active' : ''"
					class="g-tc g-pd-10 __card"
					@click="handleClick(item)"
				>
					<div class="__prop-name">
						{{ item.name }}
					</div>
					<div class="g-m-t-5">
						<span v-if="item.number">拥有 <span class="g-c-black1">{{ item.number }}</span> 张</span>
						<span v-else class="g-pointer" style="color: #2397F9" @click="handlePurchase">
							前往购买
						</span>
					</div>
				</div>
				<div v-if="selectProp" class="g-m-t-10" style="color: #999">{{ selectProp.title }}</div>
			</div>
		</div>
		<div slot="footer" class="_footer g-tr">
			<i-button type="primary" @click="handleSave">确定使用</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button } from 'iview';
import { CreatePortal } from 'wya-vc';
import { PropertyCard } from './property-card';

export default {
	name: "v-prop-modal",
	components: {
		'i-modal': Modal,
		'i-button': Button
	},
	props: {
		type: {
			type: Number,
			default: 1
		}, // 情况 1、升级为普通客户 2、升级为重要客户 3、领取公海客户
		customerId: Number
	},
	data() {
		return {
			visible: false,
			data: {
				1: {
					noticeText: '持有普通客户数量已达到最大限制！',
					card: [{
						id: 2,
						name: '一次性普通客户保护劵',
						number: '',
						click: 0,
						title: ''
					}, {
						id: 4,
						name: '120天普通客户名额劵',
						number: '',
						click: 0,
						title: ''
					}
					// {
					// 	id: 6,
					// 	name: '保护期延长盾牌',
					// 	number: '',
					// 	click: 0,
					// 	title: ''
					// }
					]
				},
				2: {
					noticeText: '持有重要客户数量已达到最大限制！',
					card: [{
						id: 3,
						name: '一次性重要客户保护劵',
						number: 0,
						click: 0,
						title: ''
					}, {
						id: 5,
						name: '120天重要客户名额券',
						number: 0,
						click: 0,
						title: ''
					} 
					// {
					// 	id: 6,
					// 	name: '保护期延长盾牌',
					// 	number: 0,
					// 	click: 0,
					// 	title: ''
					// }
					]
				}, 
				3: {
					noticeText: '今日领取名额已满,请明日再领取!',
					card: [{
						id: 1,
						name: '当日领取客户名额券',
						number: 0,
						click: 0,
						title: ''
					}]
				}
			},
			selectProp: '', // 当前选中道具
		};
	},
	computed: {
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;

	},
	methods: {
		loadData() {
			this.$request({
				url: "SALE_PROPERTY_MINE_LIST_GET",
				type: 'GET',
				param: {},
				loading: false
			}).then((res) => {
				for (let key in this.data) {
					this.data[key].card.forEach(card => {
						const exist = res.data.list.find(it => it.type_id === card.id);
						if (exist) {
							card.title = exist.title;
							card.number = exist.remain_num;
						}
					});
				}
				// this.data[this.type].card.forEach(v => {
				// 	res.data.list.forEach(value => {
				// 		if (v.id == value.type_id) {
				// 			v.title = value.title;
				// 			v.number = value.remain_num;
				// 		}
				// 	});
				// });
			});
		},
		handleClick(item) {
			item.click = !item.click;
			this.data[this.type].card.forEach(v => {
				if (v.id !== item.id) {
					v.click = 0;
				}
			});
			this.selectProp = item.click ? item : '';
		},
		handleSave(res) {
			if (this.selectProp) {
				if (this.selectProp.number) {
					this.handleUseProp();
				} else {
					this.$Message.warning('该道具数量为零请购买');
				}
			} else {
				this.$Message.warning('请选择要使用的道具');
			}
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handlePurchase() {
			this.$router.push('/sale/property/center');
		},
		handleUseProp() {
			PropertyCard.popup({
				typeId: this.selectProp.id
			}).then(() => {
				if (this.type == 1 || this.type == 2) { // 升级为普通客户或重要客户
					this.$request({
						url: "_SALE_INTENTION_UPGRADE_POST",
						type: "POST",
						loading: false,
						param: {
							customer_id: this.customerId,
							level: this.type,
							prop_type: this.selectProp.id
						}
					}).then(res => {
						this.$Message.success(res.msg);
						this.handleOk();
					}).catch(res => {
						this.$refs.modal.buttonLoading = false;
						this.$Message.error(res.msg);
				
					});
				} else if (this.type == 3) {
					return this.$request({
						url: "_SALE_SEA_GET_CUSTOMER_POST",
						type: 'POST',
						loading: false,
						param: {
							customer_id: this.customerId,
							prop_type: 1
						},
						autoTip: false
					}).then(res => {
						if (res.data.error_code) {
							this.$Message.error(res.data.error_msg);
							this.handleCancel();

						} else {
							this.$Message.success(res.msg);
							this.handleOk();
						}
					}).catch(res => {
						this.$refs.modal.buttonLoading = false;
						this.$Message.error(res.msg);
					
					});
				}
			}).catch(e => e && console.error(e));

		}
	}
};
export const PropModal = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-prop-modal {
    .ivu-modal-body {
        width: 400px;
        max-height: 350px;
    }
    .ivu-modal-content {
        border-radius: 4px;
    }
    .ivu-modal-header {
        display: none;
    }
    ._wrapper {
        padding: 20px 0 30px 10px;
        .__card {
            display: inline-block;
            width:150px;
            height:66px;
			margin: 10px 15px 0 0;
            border:1px solid rgba(212, 215, 219, 1);
            .__prop-name {
                color: #333;
			}
			&.__active {
				border:1px solid rgba(35, 151, 249, 1);
				background-color: #e9f4fe;
				.__prop-name {
					color: #2397F9;
					}
			}
        }
    }
}
</style>

