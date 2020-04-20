<template>
	<div class="v-sale-customer-intention-add ">
		<template v-if="customerList.length">
			<i-tabs
				v-model="tab"
				:animated="false"
				type="card"
				style="margin-top: 20px"
				@on-click="handleTabChange"
			>
				<i-tab-pane
					v-for="(item) in tabs"
					:key="item.value"
					:label="item.label"
					:name="item.value"
				/>
			</i-tabs>
			<div class="_company-container g-box-shadow">
				<div class="g-pd-lr-10 g-pd-tb-10">
					<vc-expand ref="expand" v-model="show" class="vc-expand">
						<div style="max-height:100px;overflow:auto" class="g-pd-b-10">
							<div 
								v-for="customer in customerList" 
								:key="customer.customer_id+'1'" 
								class="__company-name g-operation"
								@click="handleClickCustomer(customer.company_name)"
							>
								{{ customer.company_name }}
							</div>
						</div>
					</vc-expand>
					<div class="g-tc g-c-red-mid g-pointer" @click="handleExpand">
						{{ customerList.length }}个已成交客户数据待更新 
						<i 
							:style="{transform:show?'':'rotate(180deg)',position:'relative',top:'1px'}" 
							class="icon iconfont icon-pack-up g-dp-ib g-fs-12 g-m-l-5"
						/>
					</div>
				</div>
			</div>
		</template>
		<div class="g-flex g-jc-c g-m-t-20">
			<oa-search-customer />
		</div>
		<oa-paste-pane 
			v-model="formData.content"
			:rows="20" 
			:width="800" 
			class="g-m-t-20" 
			@get-info="handleGetInfo" 
		/>
		<div class="g-operation g-tc g-m-t-20" @click="handleToPersonal" >
			切换到个人客户添加 
			<i 
				class="icon iconfont icon-right g-dp-ib g-fs-12"
				style="position:relative;top:0px"
			/>
		</div>
	</div>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { debounce } from 'lodash';
import { Expand } from 'wya-vc';
import LimitWords from '@components/_common/limit-words/limit-words';
import { Confirm } from '@common/confirm/confirm';
import { setItem, objRegex } from '@utils/utils';
import { getInfo } from './search';
import PastPane from './paste-pane';
import { AddAttention } from './add-attention';
import SearchCustomer from './search-customer'; 

export default {
	name: 'oa-sale-customer-intention-add',
	components: {
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'vc-expand': Expand,
		'oa-limit-words': LimitWords,
		'oa-paste-pane': PastPane,
		'oa-search-customer': SearchCustomer

	},
	data() {
		return {
			show: true,
			formData: {
				content: ''
			},
			tabs: [
				{ 
					label: '企查查', 
					value: '1', 
					url: "https://www.qichacha.com/search?key=" 
				},
				{ 
					label: '天眼查', 
					value: '2',
					url: "https://www.tianyancha.com/search?key=" 
				}
			],
			tab: '1',
			customerList: []
		};
	},
	computed: {
		canPaste() { 
			return !!this.formData.content.length;
		}
	},
	created() {
		this.loadCustomerList();
	},
	methods: {
		handleTabChange(val) {

		},
		handleExpand() {
			this.$refs.expand.toggle();
		},
		loadCustomerList() {
			this.$request({
				url: "_SALE_CUSTOMER_DEAL_CUSTOMER_LIST_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				this.customerList = res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleClear() {
			this.formData.content = '';
		},
		handlePaste() {
			if (this.formData.content) this.formData.content = '';
			setTimeout(() => {
				const text = this.formData.content;
				if (!text) return;
				const length1 = (text.match(/企查查/g) || []).length;
				const length2 = (text.match(/天眼查/g) || []).length;
				if (text.length < 500 || (length1 < 5 && length2 < 5)) {
					Confirm.popup({ msg: "未识别到正确的数据，请检查后再复制粘贴，谢谢您的合作！", okText: '确定，并清空信息' }).then(() => {
						this.formData.content = '';
					}).catch((e) => { e && console.error(e); });
					return;
				}
				const info = getInfo(text);
				// 检查是否有数据
				if (!info.company_name || !objRegex.validCompanyName.regex.test(info.company_name)) {
					Confirm.popup({ 
						msg: "暂时无法提取到该平台的信息，建议更换到另一个平台复制客户信息，或联系OA项目部", 
						okText: '确定，并清空信息' 
					}).then(() => {
						this.formData.content = '';
					}).catch((e) => { e && console.error(e); });
					return;
				}
				// 检查登陆
				if ((info.tel && info.tel.includes('*')) || (info.email && info.email.includes('*'))) {
					Confirm.popup({ msg: "检查到当前您未登录，请登录该平台后重新复制粘贴该客户的信息", okText: '确定，并清空信息' }).then(() => {
						this.formData.content = '';
					}).catch((e) => { e && console.error(e); });
					return;
				}
				// 远程验证
				this.$request({
					url: "_SALE_CUSTOMER_CUSTOMER_STATUS_GET",
					type: "GET",
					param: {
						company_name: info.company_name
					},
					loading: false,
				}).then(({ data }) => {
					/**
					 *  {
							"can_save": 1,    // 是否可以保存
							"customer_id": 398798,    // 客户ID 如果系统存在的话
							"is_new": 0,    // 是否为新的数据 0 否 1 是
							"is_update": 0,    // 是否已经更新过 0 未更新过 1 已更新过
							"is_delete": 0,    // 是否删除  0 未删除 1 删除 2 黑名单 3 白名单
							"status": 0,    // 客户状态：0 未领取 1 已领取 2 已下单
							"tips": "",    // 不能保存的原因
							"change_times": 1,    // 转手次数
							"exist_time": 244    // 已经存在天数
						}
					 */
					this.handleCustomerStatus(data, info);
				}).catch((res) => {
					console.error(res);
					this.$Message.error(res.msg);
				});
			}, 100);
		},
		handleInput(val, event) {
			if (val && val.length < 100) {
				this.$nextTick(() => this.formData.content = '');
			}
		},
		handleClickCustomer(name) {
			const url = this.tabs.find(tab => tab.value == this.tab).url;
			window.open(url + name);
		},
		handleToPersonal() {
			this.$router.push('/sale/customer/intention/add/personal');
		},
		handleGetInfo({ data, info }) {
			// "can_save": 1,    // 是否可以保存
			// "customer_id": 398798,    // 客户ID 如果系统存在的话
			// customer_name:''			// 老数据更新需要带到info里
			// tel:''			// 老数据更新需要带到info里
			// "is_new": 0,    // 是否为新的数据 0 否 1 是
			// "is_update": 0,    // 是否已经更新过 0 未更新过 1 已更新过
			// "is_delete": 0,    // 是否删除  0 未删除 1 删除 2 黑名单 3 白名单
			// "status": 0,    // 客户状态：0 未领取 1 已领取 2 已成交
			// "tips": "",    // 不能保存的原因
			// "change_times": 1,    // 转手次数
			// "exist_time": 244    // 已经存在天数
			
			const tip = () => Confirm.popup({ msg: data.tips, title: '提示', okText: '确认，并清空信息', cancelText: '取消' }).then(() => {
				this.formData.content = '';
			}).catch(e => e && console.error(e));
			const toUpdateCustomer = (type, to, manual_add) => {
				data.customer_name && (info.customer_name = data.customer_name);
				data.tel && (info.tel = data.tel);
				data.industry_id && (info.industry_id = data.industry_id);
				data.customer_type && (info.customer_type = data.customer_type);
				data.customer_id && (info.customer_id = data.customer_id);
			
				setItem('saleAddCustomerInfo_' + this.$global.version, info);
				this.$router.push({
					path: '/sale/customer/intention/add/confirm',
					query: {
						update_type: type,
						to,
						customer_id: data.customer_id,
						manual_add
					}
				});
			};
			// 新数据
			if (data.is_new) {
				console.log('全新客户资料');
				toUpdateCustomer(1);
				return;
			}
			// 已删除
			if (data.is_delete == 1) {
				console.log('已删除');
				toUpdateCustomer(1);
			// 白名单/黑名单
			} else if (data.is_delete == 2 || data.is_delete == 3) {
				console.log('白名单/黑名单');
				if (data.is_update) {
					console.log('更新过');
					tip();

				} else {
					console.log('没更新过');
					info.tips = data.tips;
					toUpdateCustomer(4, data.is_delete == 2 ? 'black' : 'white', data.manual_add);
				}
			// 未删除
			} else if (data.is_delete === 0) {
				console.log('未删除');
				// 未领取（公海）
				if (data.status === 0) {
					console.log('未领取（公海）');
					if (data.is_update) {
						console.log('更新过');
						this.$router.push({ path: '/sale/customer/intention/add/sea', query: { customer_id: data.customer_id } });
					// 	tip();

					} else {

						toUpdateCustomer(4, 'sea');
						console.log('没更新过');
					}
				} else if (data.status == 1 || data.status == 2) {
					console.log('已领取');
					if (data.is_own) {
						console.log('自己的客户');
						if (data.status == 2) {
							console.log("已成交");
							if (data.is_update) {
								console.log('更新过');
								tip();
							} else {
								console.log('没更新过');
								
								toUpdateCustomer(3);
							}

						} else {
							console.log('未成交');
							if (data.is_update) {
								console.log('更新过');
								tip();
							} else {
								console.log('没更新过');
								info.tips = data.tips;
								toUpdateCustomer(4);
							}
						}

					} else {
						console.log('别人的客户');
						if (data.status == 2) {
							console.log("已成交");
							tip();
						} else {
							console.log("未成交");
							AddAttention.popup({
								msg: data.tips,
								customerId: data.customer_id
							}).then(() => {
								this.formData.content = '';
							}).catch(e => e && console.error(e));
						}
					}
				}
			}
		}
	},
};
</script>

<style lang="scss">
.v-sale-customer-intention-add {
	._company-container {
		.__company-name {
			display: inline-block;
			width:120px;
			margin:5px 20px; 
			cursor: pointer;
			overflow: hidden; 
			text-overflow:ellipsis;
			white-space:nowrap;
		}
	}		
}
</style>
