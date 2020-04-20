<template>
	<div class="v-sc-main-todo g-flex-cc g-fd-c">
		<div class="_content g-col">
			<vc-collapse 
				v-if="remind.length != 0 || stepRemind.length != 0" 
				:accordion="true" 
				:value="stepRemind.length != 0 ? '2' : '1'"
			>
				<vc-collapse-item v-if="remind.length != 0" name="1" class="g-m-b-10">
					<div class="__title">
						<p class="g-oneline">今日{{ count }}个提醒</p>
						<span class="__tip" />
					</div>

					<span slot="icon" slot-scope="it" class="__icon" >
						<i :class="it.isExpend ? 'icon-up' : 'icon-down'" class="iconfont" />
					</span>

					<div slot="content" ref="content" class="__list">
						<div
							v-for="(item,index) in remind"
							:key="index"
							class="g-bb g-pd-lr-15 g-flex-ac g-jc-sb __item g-pointer"
						>
							<i-tip-item
								:record_id="item.record_id"
								:remind_date="item.remind_date"
								:remind_end_date="item.remind_end_date"
								:is_complete="item.is_complete"
								:content="item.content"
								:on-refresh="loadData"
							>
								<p 
									:class="item.is_complete != 0 && 'g-c-black7'" 
									class="g-m-l-10"
								>
									{{ item.content }}
								</p>
							</i-tip-item>
							<i 
								v-if="item.is_complete != 0"
								class="iconfont icon-completed g-c-blue-mid g-flex-cc _complete" 
							/>
						</div>

						<i-spin v-if="loading">
							<i-icon
								type="ios-loading"
								size="18"
								class="demo-spin-icon-load"
							/>
							<div>Loading</div>
						</i-spin>
					</div>
				</vc-collapse-item>

				<vc-collapse-item v-show="stepRemind.length != 0" name="2">
					<div class="__title">
						<p class="g-oneline">客户跟进提醒</p>
						<span class="__tip"/>
					</div>

					<span slot="icon" slot-scope="it" class="__icon" >
						<i :class="it.isExpend ? 'icon-up' : 'icon-down'" class="iconfont"/>
					</span>

					<div slot="content" ref="content" class="__list">
						<div
							v-for="(item,index) in stepRemind"
							:key="index"
							class="g-bb g-pd-lr-15 g-flex-ac g-jc-sb __item g-pointer"
							@click="handleStepRemind(item)"
						>
							<p 
								:class="item.is_complete != 0 && 'g-c-black7'" 
								class="g-m-l-10"
							>
								{{ item.contract_company_name }}需要你填写"{{ item.product_step_name }}"信息
							</p>
						</div>
					</div>
				</vc-collapse-item>
			</vc-collapse>

			<div v-else class="g-tc" >
				<img :src="OSS_EMPTY" style="max-width: 300px; width: 100%" >
				<p style="color: #8181794" class="g-fs-12">你暂时未设置提醒信息哦</p>
			</div>
		</div>

		<div class="g-m-tb-10">
			<router-link class="g-gray-btn-dash" to="/sc/main/schedule">查看本月安排</router-link>
		</div>
	</div>
</template>

<script>
import { Button, Spin, Icon } from "iview";
import { OSS_EMPTY } from '@constants/constants';
import API_ROOT from "@stores/apis/root";
import { Collapse } from "wya-vc";
import TipItem from "../_common/tip-item";


export default {
	name: "v-sc-main-todo",

	components: {
		"i-button": Button,
		"i-spin": Spin,
		"i-icon": Icon,
		"i-tip-item": TipItem,
		"vc-collapse": Collapse,
		"vc-collapse-item": Collapse.Item
	},

	props: {
		date: String
	},

	data() {
		return {
			OSS_EMPTY,
			remind: [],
			count: '',
			loading: false, // 是否展示加载中
			page: 1,
			flag: false, // 判断请求的数组是否为空
			stepRemind: []
		};
	},

	watch: {
		async date(val) {
			this.page = 1;
			this.remind = [];

			await this.loadData();
		}
	},

	mounted() {
		this.loadData();
		this.loadStepRemind();
	},

	methods: {
		loadData(page) {
			// 首页提醒本月安排展示
			this.$request({
				url: API_ROOT._SC_MAIN_MONTH_REMIND_GET,
				type: "GET",
				param: {
					date: this.date,
					page: 1
				},
				loading: false
			}).then(res => {
				this.remind = res.data.list;
				this.count = res.data.count;

				if (this.remind.length != 0) {
					// 添加滚动事件，检测滚动到UL底部
					this.$nextTick(() => {
						this.$refs.content.addEventListener(
							"scroll",
							this.scrollBottom
						);
					});
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		loadStepRemind() {
			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_STEP_REMING_GET",
				type: "GET",
				param: {},
				loading: false
			}).then(res => {
				this.stepRemind = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		scrollBottom(e) {
			// 获取当前节点可滚动的距离   节点滚动条总高度 - 节点本身高度
			// （1）滚动条到顶部的位置：scrollTop
			// （2）当前窗口内容可视区：windowHeight
			// （3）滚动条内容的总高度：scrollHeight
			//  判断到底部的等式: scrollTop+windowHeight=scrollHeight;
			if (!this.flag && e.target.scrollTop + e.target.clientHeight > e.target.scrollHeight - 10) {
				this.flag = true;

				this.handleGetData();
			}
		},

		handleGetData() {
			this.loading = true;
			// 首页提醒本月安排展示
			this.$request({
				url: API_ROOT._SC_MAIN_MONTH_REMIND_GET,
				type: "GET",
				param: {
					date: this.date,
					page: ++this.page
				}
			}).then(res => {
				this.flag = false;
	
				if (res.data.list.length == 0) {
					this.loading = false;

					// 移除滚动事件
					this.$refs.content.removeEventListener(
						"scroll",
						this.scrollBottom
					);

					return;
				}

				this.remind = [...this.remind, ...res.data.list];
				this.loading = false;
			}).catch(error => {});
		},

		handleStepRemind(v) {
			this.$router.push({
				path: "/sc/product",
				query: {
					project_id: v.project_id,
					flag: true
				}
			});
		}
	}
};
</script>

<style lang="scss">
.v-sc-main-todo {
    height: 362px;
	box-sizing: border-box;
	padding-top: 20px;
	overflow-y: auto;
	._content {
		width: 100%;
        color: #333333;
        font-size: 14px;
        position: relative;
		text-align: left;
        .__title {
            position: relative;
            height: 40px;
            line-height: 40px;
            padding: 0 20px 0 25px;
            background-color: #f8f8f8;
            border-bottom: 1px solid #eaeef1;
            cursor: pointer;
        }
        .__tip {
            position: absolute;
            left: 15px;
            top: 0;
            bottom: 0;
            margin: auto 0;
            width: 4px;
            height: 4px;
            border-radius: 2px;
            background-color: #2399fb;
        }
        .__list {
			max-height: 160px;
            overflow-y: auto;
            .__item {
				width: 100%;
				position: relative;
                height: 40px;
                background-color: #f8f8f8;
            }
        }
        .__icon {
            position: absolute;
            right: 10px;
            top: 10px;
            margin: auto 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
	._complete{
		position: absolute;
		right: 10px;
	}
}
</style>