<template>
	<div class="v-sc-main-supplement">
		<div class="g-flex g-jc-sb">
			<oa-title class="g-m-b-30" title="补款通知"/>

			<span class="g-operation" @click="handleLookMore">
				查看更多
			</span>
		</div>

		<div class="g-pd-tb-10 g-bg-white _supplement">
			<ul 
				v-show="supply_list && supply_list.length != 0" 
				ref="supplement"
			>
				<li 
					v-for="(item,index) in supply_list" 
					:key="index"
					class="g-pointer g-m-b-10 g-m-lr-20"
				>
					<div>
						<p 	
							class="g-fs-12"
							@click="handleSupplement(item.contract_company_name)"
						>
							{{ item.content }}
						</p>
						<div class="g-flex g-jc-sb">
							<span class="g-fs-12 g-block g-m-tb-10" style="color:#818794;">
								{{ item.create_time }}
							</span>
							<span
								v-if="$auth[300]"
								class="g-pointer g-m-tb-10 __ingnore" 
								style="color: #2397f9;"
								@click="handleIgnore(item)"
							>
								忽略
							</span>
						</div>
					</div>
				</li>
			</ul>
			
			<div v-if="supply_list && supply_list.length === 0" class="g-tc g-pd-t-30">
				<img :src="OSS_NOTICE_EMPTY" style="width: 200px;height: 154px;">
				<div class="g-fs-14 g-m-t-10">您暂时没有补款通知~</div>
			</div>
		</div>
	</div>
</template>

<script>
import { OSS_NOTICE_EMPTY } from '@constants/constants';
import { Confirm } from "@components/_common/confirm/confirm";
import Title from "./title";
import { DetailDrawer } from "./popup/detail.vue";

export default {
	name: "sc-main-supplement",

	components: {
		"oa-title": Title
	},
    
	data() {
		return {
			OSS_NOTICE_EMPTY,
			supply_list: [], // 补款列表
			page: 1,
			flag: false // 判断请求的数组是否为空
		};
	},
    
	mounted() {
		// 添加滚动事件
		this.$refs.supplement.addEventListener(
			"scroll",
			this.scrollBottom
		);

		// 补款列表
		this.loadSupplyData(this.page);
	},
    
	methods: {
		handleLookMore() {
			DetailDrawer.popup({}).then();
		},
        
		// 补款列表
		loadSupplyData(page) {
			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_GET_SUPPLY_GET",
				type: "GET",
				param: {
					page,
					is_ignore: 2
				}
			}).then(res => {
				this.flag = false;

				if (res.data.list.length == 0) {
					// 移除滚动事件
					this.$refs.supplement.removeEventListener("scroll", this.scrollBottom);

					return;
				}
				
				this.supply_list = [...this.supply_list, ...res.data.list];
				this.supply_list.forEach(item => {
					item.show = false;
				});
			}).catch(error => {});
		},
        
		handleIgnore(v) {
			Confirm.popup({
				title: "温馨提示",
				msg: "确定忽略该条补款通知？",
				content: "确定忽略该条补款通知？"
			}).then(res => {
				this.$request({
					url: "_SC_MAIN_SUPPLY_IGNORE_POST",
					type: "POST",
					param: {
						supply_id: v.supply_id,
						is_ignore: 1
					},
					loading: false
				}).then(ress => {
					this.$Message.success(ress.msg);
				}).then(() => {
					// 添加滚动事件
					this.$refs.supplement.addEventListener(
						"scroll",
						this.scrollBottom
					);
					this.supply_list = [];
			        this.loadSupplyData(1);
				}).catch(error => {
					this.$$Message.error(error.msg);
				});
			});
		},

		// 补款跳转
		handleSupplement(contract_company_name) {
			if (!this.$auth[300]) {
				return;
			}

			this.$router.push({
				path: "/sc/customer/cooperate",
				query: {
					search: contract_company_name,
					fixPosition: "true"
				}
			});
		},
        
		scrollBottom(e) {
			if (this.flag) {
				return;
			}

			if (e.target.scrollTop + e.target.clientHeight > e.target.scrollHeight - 10) {
				this.flag = true;
				this.page++; 
				this.loadSupplyData(this.page);
			}
		}
	}
};
</script>

<style lang="scss">
.v-sc-main-supplement{
	._supplement{
		width: 516px;
		height: 320px;
		box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);

		ul{
			overflow: hidden;
			height: 300px;

			&:hover{
				overflow: auto;
			}

			li{
				border-bottom: 1px solid #D4D7DB;

				.__ingnore{
					display: none;
				}

				&:hover{
					color: #2397f9;

					.__ingnore{
						display: inline-block;
					}
				}
			}
		}
	}
}
</style>