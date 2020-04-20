<template>
	<div class="v-sc-manage-inspection-progress">
		<div class="_detail-content">
			<div
				v-for="(item, index) in product_progress"
				:key="index" 
			>
				<div class="__title g-fs-14 g-m-b-20 g-m-t-30 g-pd-lr-15 g-c-black3">
					合同编号：{{ item.contract_num }}
					（{{ ["新建合同","补充协议","更换产品","续费合同"][item.contract_type * 1] }}）
					<span 
						v-if="item.status == '3'" 
						class="g-inline-block g-fs-12 g-pd-l-5 g-pd-r-5"
						style="color: #ffffff;background: #e84854;border-radius: 2px;height:18px;line-height:18px;"
					>
						已失效
					</span>
				</div>

				<div 
					v-for="(element, element_index) in item.project" 
					:key="element_index"
					:class="element.step ? '' : '_prevent'"
					class="g-m-l-15"
				>
					<i-collapse v-model="element.fold" simple>
						<i-panel :name="String(element.project_id)" hide-arrow>
							<div class="g-flex g-jc-sb g-ai-c" style="height: 90px;">
								<div>
									<i class="icon iconfont icon-product"/>
									<span class="g-fs-14 g-c-black1 g-m-l-5">
										{{ element.product_name }}
										{{ ["",`（已完成，完成时间 ${element.complete_time}）`][element.is_complete * 1] }}
									</span>
									<span v-if="element.lose_efficacy == '1'">-</span>
									<span v-if="element.lose_efficacy == '1'" style="color: #e84854;">
										已失效
									</span>
								</div>

								<div v-if="element.step" class="g-flex g-ai-c">
									<i-circle
										:percent="Number(element.progress)"
										:size="50"
										:stroke-width="10"
										:trail-width="10"
										stroke-color="#2397f9"
									>
										<span class="demo-Circle-inner g-fs-12">
											{{ element.progress }}%
										</span>
									</i-circle>
									<i 
										v-if="element.fold.includes(String(element.project_id))" 
										class="icon iconfont icon-triangle-up g-fs-10 g-m-r-10 g-m-l-30"
									/>
									<i 
										v-else
										class="icon iconfont icon-triangle-down g-fs-10 g-m-r-10 g-m-l-20"
									/>
								</div>
							</div>

							<div v-if="element.step" slot="content" class="g-m-t-20 g-m-l-20">
								<div class="g-pd-tb-10">
									<div class="g-m-l-15 g-c-black1 g-m-b-10 g-fs-14">制作进度</div>

									<oa-steps
										:data-source="element.step"
										:type="1"
										:render-title="renderTitle"
										:render-content="renderContent"
										class="g-m-l-15"
									/>
								</div>
							</div>
						</i-panel>
					</i-collapse>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Collapse, Panel, Circle } from "iview";
import API_ROOT from "@stores/apis/root";
import Steps from "@components/_common/steps/steps";

export default {
	name: "sc-manage-inspection-progress",
    
	components: {
		"i-collapse": Collapse,
		"i-panel": Panel,
		"i-circle": Circle,
		"oa-steps": Steps
	},

	props: {
		contract_company_id: Number
	},
    
	data() {
		return {
			product_progress: []
		};
	},

	mounted() {
		this.loadData();
	},

	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.product_progress = [];
			let temp = [];

			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_PRODUCT_PROCESS_GET,
				type: 'GET',
				loading: false,
				param: {
					contract_company_id: this.contract_company_id
				},
				autoTip: false
			}).then(res => {
				// 默认展开第一个合同编号下的第一个产品
				temp = res.data;

				temp.forEach((item, index) => {
					if (index == 0) {
						item.project.forEach(it => {
							this.$set(it, "fold", [item.project[0].project_id]);
						});
					} else {
						item.project.forEach(it => {
							this.$set(it, "fold", []);
						});
					}

					// 如果无步骤则展示暂无制作进度
					item.project.forEach(it => {
						it.step && it.step.length == 0 && it.step.push({
							flag: true
						});
					});
				});

				this.product_progress = temp;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		renderTitle(h, params) {
			const { product_step_name, update_time, flag } = params.rows;

			if (product_step_name) {
				return (
					<div style="margin:0 0 0 10px;">
						<span class="g-fs-14 g-inline-block g-m-b-10">
							{product_step_name}
						</span>
					</div>
				);
			} else if (flag) {
				return (<div style="margin:0 0 0 10px;">
					<span class="g-fs-14 g-inline-block g-m-b-10">
							暂无制作进度
					</span>
				</div>);
			} else {
				return null;
			}
		},

		renderContent(h, params) {
			const { product_step_name, update_time } = params.rows;

			if (product_step_name) {
				return (
					<div style="margin:0 0 46px 10px;">
						<span style="color:#818794;" class="g-fs-12 g-inline-block;g-m-b-20">
							{update_time}
						</span>
					</div>
				);
			} else {
				return null;
			}
		},
	}
};
</script>

<style lang="scss">
.v-sc-manage-inspection-progress {
	padding-bottom: 100px;
	
	._detail-content {
		padding: 0 20px;
		height: 100%;

		.__title {
			border-left: 2px solid #e84854;
            height: 14px;
            line-height: 14px;
		}
	}

    .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
        height: 90px;
		border-bottom: 1px solid #EEEEEE;
        margin-left: 20px;
        margin-right: 20px;
    }

    .ivu-collapse {
        width: 100%;
        border: none;
    }
    
    .ivu-collapse > .ivu-collapse-item {
        border-radius: 5px;
        margin-bottom: 10px;
		border-top: none;
		border: 1px solid rgba(0, 0, 0, 0.1);

		&:hover {
			box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
		}
	}
	
	._prevent{
		pointer-events : none;
	}
}
</style>