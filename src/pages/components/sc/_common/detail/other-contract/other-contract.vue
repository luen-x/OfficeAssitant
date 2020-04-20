<template>
	<div 
		:class="(name === 'cooperate' || name === 'product') ? 'g-m-t-30 g-m-l-30' : ''"
		class="v-sc-customer-other-contract g-pd-b-30 g-relative"
	>
		<div v-if="spin">
			<div v-if="detailData.length > 0">
				<oa-title title="客户其他合同" class="g-m-b-20 g-m-l-10"/>

				<div 
					v-for="(item,index) in detailData"
					:key="index"
					class = "g-pd-l-20 g-pd-tb-20 g-m-t-20 g-bg-white g-fs-12 g-relative _other-contract"
				>
					<div 
						v-if = "item.status == '3'" 
						class = "g-pd-l-10 g-pd-r-10 g-absolute" 
						style="background: #EAEAEA;top: 0px;right: 0px;height: 28px;line-height: 28px;"
					>
						已失效
						（{{ ["","合同退款", "换合同退款","","产品退款","换产品退款"][item.invalid_type * 1] }}）
					</div>
                
					<div class = "g-fs-15 g-c-black2 __header">
						<span>{{ item.contract_company_name }}</span>
						<span 
							v-if="item.type == '2'"
							class="g-m-l-10 g-fs-10 g-inline-block g-c-white g-tc __relevance"
						>
							关联公司
						</span>
						<span class="g-m-l-10 g-fs-12 __orderdate">下单日期：{{ item.create_time }}</span>
					</div>

					<div class="g-flex g-flex-cc __top">
						<span v-if="item.contract_nums.length <= 18">{{ item.contract_nums }}</span>
						<span v-else>
							<i-tooltip :content="item.contract_nums" max-width="200" placement="bottom">
								{{ item.contract_nums.slice(0,18) + "..." }}
							</i-tooltip>
						</span>
						<span>客户姓名：{{ item.customer_name }}</span>
						<span>合同金额：{{ item.contract_amount }}</span>
						<span>应付金额：{{ item.need_amount }}</span>
					</div>

					<div class="g-flex g-flex-cc __center">
						<span>实付金额：{{ item.payment_amount }}</span>
						<span>剩余尾款：{{ item.last_amount }}</span>
						<span>扣除成本：{{ item.total_cost_amount }}</span>
						<span>邀约人： {{ item.invite_staff_name }}</span>
					</div>

					<div class="__bottom">
						<span>部门经理： {{ item.leader_staff_name }}</span>
						<span v-if="item.product_names.length < 46" style="padding-left: 16px;">
							{{ item.product_names }}
						</span>
						<span v-else style="padding-left: 16px;">
							<i-tooltip :content="item.product_names" max-width="400" placement="bottom">
								{{ item.product_names.slice(0,46) + "..." }}
							</i-tooltip>
						</span>
					</div>
				</div>
			</div>

			<div v-else class="g-tc g-absolute _empty">
				<img :src="OSS_NO_MESSAGE05">
				<p>暂无其他合同</p>
			</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { Title } from "@components/sc/_common";
import API_ROOT from "@stores/apis/root";
import { OSS_NO_MESSAGE05 } from "@constants/constants";
import { Tooltip } from "iview";

export default {
	name: "other-contract",
    
	components: {
		"oa-title": Title,
		"i-tooltip": Tooltip
	},

	props: {
		contract_id: Number,
		contractId: Number,
		name: String
	},
    
	data() {
		return {
			detailData: [],
			spin: false,
			OSS_NO_MESSAGE05
		};
	},

	watch: {
		contractId(val, old) {
			val && Number(val) != Number(old) && this.loadData();
		}
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.spin = false;
			this.$request({
				url: '_SC_CUSTOMER_COOPERATE_OTHER_CONTRACT_GET',
				type: "GET",
				param: {
					contract_id: this.contract_id ? this.contract_id : this.contractId
				},
				loading: false
			}).then(res => {
				this.detailData = res.data;
				this.detailData.forEach(item => {
					item.contract_nums = `合同编号：${item.contract_num}（${["新建合同", "补充协议", "更换产品", " 续费合同"][item.contract_type * 1]}）`;
					item.product_names = "下单产品：";
					let arr = [];
					item.project.forEach(element => {
						arr.push(element.product_name);
					});
					item.product_names += arr.join("、");
				});
				this.spin = true;
			}).catch(error => {
				this.spin = true;
			});
		}
	}
};
</script>

<style lang="scss">
.v-sc-customer-other-contract{
	min-height: 95%;

    ._other-contract{
        width: 96%;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        color: #818794;
        font-family:MicrosoftYaHei;
        font-weight:400;

		&:hover {
			box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
		}

        .__header{
            .__relevance{
                width: 60px;
                height: 19px;
                background: #E84C57;
                border-radius:3px;
            }

            .__orderdate{
                color: #818794;
                font-family:MicrosoftYaHei;
                font-weight:400;
            }
        }

        .__top, .__center,.__bottom{
            margin-top: 18px;

            span{
                width: 25%;
                display: inline-block;
                border-right: 1px solid #D4D7DB;
                height: 12px;
                line-height: 12px;
                padding-left: 20px;

                &:nth-of-type(1){
                    padding-left: 0px;
                }

                &:nth-of-type(4){
                    border-right: none;
                }
            }
        }

        .__bottom{
            span{
                &:nth-of-type(2){
                    width: 70%;
                    border-right: none;
                }
            }
		}
	}
	
	._empty{
		height: 200px;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-70%);
		-webkit-transform: translate(-50%,-70%);

		img{
			width: 200px;
			height: 200px;
		}
	}
}
</style>