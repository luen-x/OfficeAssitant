<template>
	<div 
		:style="!product_progress.length ? 'height:calc(100% - 60px);' : 'height:auto;'" 
		class="g-relative g-pd-r-20"
	>
		<oa-loading v-if="loading"/>
		<div class="v-sale-service-progress">
			<div class="_detail-content">
				<div 
					v-if="!product_progress.length" 
					class="g-flex g-jc-c g-ai-c"
					style="height:100%;"
				>
					<div style="width:416px;">
						<img :src="OSS_SEARCH_EMPTY" >
						<div class="g-tc">暂无产品制作进度记录~</div>
					</div>
				</div>
				<div 
					v-for="(item, index) in product_progress"
					v-else 
					:key="index"
				>
					<div class="g-fs-14 g-m-tb-20">
						<span class="__title-bar"/>
						<span class="g-c-black3 g-pd-l-5">合同编号：</span>
						<span class="g-c-black3">
							{{ ['新建合同','补充协议','更换合同','续费合同'][+item.contract_type] + item.contract_num }}
						</span>
						<span 
							v-if="item.status === 3"
							class="g-bg-red-mid g-pd-lr-5 g-fs-12" 
							style="border-radius: 2px;padding: 1px 5px;"
						>
							已失效
						</span>
					</div>
					<div v-for="(it, i) in item.project" :key="i">
						<div v-if="it.hasOwnProperty('step') && it.hasOwnProperty('tracks')">
							<i-collapse v-model="it.fold" simple>
								<i-panel :hide-arrow="true" :name="it.project_id + ''">
									<div 
										class="g-flex g-jc-sb g-ai-c" 
										style="height: 60px;"
									>
										<div>
											<i class="icon iconfont icon-product"/>
											<span class="g-fs-14 g-c-black1">{{ it.product_name }}</span>
											<span 
												v-if="it.is_complete" 
												class="g-fs-14 g-c-black1"
											>
												（制作完成）
											</span>
											<span 
												v-else-if="it.lose_efficacy" 
												class="g-fs-14 g-c-black1"
											>
												（已失效）
											</span>
										</div>
										<div class="g-flex g-ai-c">
											<i-circle
												:percent="+it.progress"
												:size="45"
												:stroke-width="10"
												:trail-width="10"
												stroke-color="#2397f9"
											>
												<span class="demo-Circle-inner g-fs-12">
													{{ it.progress }}%
												</span>
											</i-circle>
											<i 
												v-if="it.fold.includes(it.project_id)" 
												class="icon iconfont icon-triangle-up g-fs-10 g-m-r-10 g-m-l-20"
											/>
											<i 
												v-else 
												class="icon iconfont icon-triangle-down g-fs-10 g-m-r-10 g-m-l-20"
											/>
										</div>
									</div>
									<div slot="content">
										<div style="background:#f6f6f6;height: 1px;margin:0 5px" />
										<div class="g-flex g-pd-tb-10">
											<div style="width: 50%">
												<div class="g-m-l-15 g-c-black1 g-m-b-10">制作进度</div>
												<oa-record 
													v-if="it.step.length" 
													:records="it.step"
												>
													<div slot-scope="{data}">
														<div class="g-fs-12">
															<div class="g-c-black3 g-m-r-10">{{ data.product_step_name }}</div>
															<div class="g-c-black7 g-m-r-10">{{ data.update_time }}</div>
														</div>
													</div>
												</oa-record>
												<oa-record v-else :records="step_empty">
													<div slot-scope="{data}">
														<div class="g-fs-12">
															<div class="g-c-black3 g-m-r-10">{{ data.label }}</div>
														</div>
													</div>
												</oa-record>
											</div>
											<div style="width: 50%">
												<div class="g-m-l-15 g-c-black1 g-m-b-10">跟进记录</div>
												<oa-record v-if="it.tracks.length" :records="it.tracks">
													<div slot-scope="{data}">
														<div class="g-fs-12">
															<div class="g-c-black3 g-m-b-5">
																<span class="g-m-r-10">{{ data.operator }}</span>
																<span>{{ data.create_time }}</span>
																<span>（{{ data.product_step_name }}）</span>
															</div>
															<div 
																v-if="data.type === 1" 
																class="g-c-black7 g-m-r-10"
															>
																<i-tooltip 
																	v-if="data.content.length > 22"
																	:content="data.content" 
																	:max-width="250" 
																	transfer
																>
																	<span>{{ data.content.substr(0, 22) + '...' }}</span>
																</i-tooltip>
																<span v-else>{{ data.content }}</span>
															</div>
															<div v-else-if="data.type === 2">
																<div 
																	v-for="_it in data.content"
																	:key="_it.element_id"
																	class="g-c-black7 g-flex g-m-b-5"
																>
																	<span class="g-m-r-10">{{ _it.field_code }}</span>
																	<div 
																		v-if="_it.type !== 6" 
																		class="g-m-r-10"
																	>
																		<i-tooltip 
																			v-if="_it.info.length > 22"
																			:content="_it.info" 
																			:max-width="250" 
																			transfer
																		>
																			<span>{{ _it.info.substr(0, 22) + '...' }}</span>
																		</i-tooltip>
																		<span v-else>{{ _it.info }}</span>
																	</div>
																	<oa-upload
																		v-else
																		:max="6"
																		:data-source="_it.info.map(_data => ({
																			type: _data.substr(_data.lastIndexOf('.')),
																			url: _data
																		}))"
																		disabled
																		@preview-start="handlePreviewStart"
																		@preview-end="handlePreviewEnd"
																	>
																		<span slot="trigger"/>
																	</oa-upload>
																</div>
															</div>
															<div v-else>
																<div class="g-c-black7 g-flex">
																	<span class="g-m-r-10">{{ data.content.content }}</span>
																	<oa-upload
																		:max="6"
																		:data-source="data.content.images.map(_data => ({
																			type: _data.substr(_data.lastIndexOf('.')),
																			url: _data
																		}))"
																		disabled
																		@preview-start="handlePreviewStart"
																		@preview-end="handlePreviewEnd"
																	>
																		<span slot="trigger"/>
																	</oa-upload>
																</div>
															</div>
														</div>
													</div>
												</oa-record>
												<oa-record v-else :records="track_empty">
													<div slot-scope="{data}">
														<div class="g-fs-12">
															<div class="g-c-black3 g-m-r-10">{{ data.label }}</div>
														</div>
													</div>
												</oa-record>
											</div>
										</div>
									</div>
								</i-panel>
							</i-collapse>
						</div>
						<div 
							v-else 
							class="g-flex g-jc-sb g-ai-c g-pd-lr-20 __item"
						>
							<div>
								<i class="icon iconfont icon-product"/>
								<span class="g-fs-14 g-c-black1">{{ it.product_name }}</span>
								<span 
									v-if="it.is_complete" 
									class="g-fs-14 g-c-black1"
								>
									（制作完成）
								</span>
								<span 
									v-else-if="it.lose_efficacy" 
									class="g-fs-14 g-c-black1"
								>
									（已失效）
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Collapse, Panel, Timeline, TimelineItem, Circle, Tooltip } from 'iview';
import Loading from '@components/_common/loading/loading';
import Upload from '@components/_common/upload/upload';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import Record from "../record";

export default {
	name: "oa-service-progress",
	components: {
		"i-collapse": Collapse,
		"i-panel": Panel,
		'i-timeline': Timeline,
		'i-timeline-item': TimelineItem,
		'i-circle': Circle,
		'i-tooltip': Tooltip,
		'oa-record': Record,
		'oa-loading': Loading,
		"oa-upload": Upload,
	},
	props: {
		contractCompanyId: [String, Number]
	},
	data() {
		return {
			loading: false,
			product_progress: [],
			step_empty: [
				{
					label: '暂无制作进度'
				}
			],
			track_empty: [
				{
					label: '暂无跟进记录'
				}
			],
			OSS_SEARCH_EMPTY
		};
	},
	watch: {
		contractCompanyId() {
			this.$emit('reset');
			this.loadData();
		}
	},
	mounted() {
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			let temp = [];
			this.loading = true;
			this.product_progress = [];
			this.$request({
				url: '_SALE_SERVICE_PRODUCT_PROGRESS_GET',
				type: 'GET',
				loading: false,
				param: {
					contract_company_id: this.contractCompanyId
				},
				autoTip: false
			}).then(res => {
				this.loading = false;
				// 默认展开第一个合同编号下的第一个产品

				if (Array.isArray(res.data) && res.data.length) {
					temp = res.data;
					temp.forEach((item, index) => {
						if (index == 0) {
							item.project.forEach((it, i) => {
								this.$set(it, 'fold', [item.project[0].project_id]);
							});
						} else {
							item.project.forEach((it, i) => {
								this.$set(it, 'fold', []);
							});
						}
					});
					this.product_progress = temp;
				}
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		handlePreviewStart() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handlePreviewEnd() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};

export const ServiceProgress = module.exports.default;

</script>

<style lang="scss">
.v-sale-service-progress {
	width: 100%;
	height: 100%;
	._detail-content {
		padding: 0 16px;
		height: 100%;
		.__item {
			height: 60px;
			border-radius: 5px;
			margin-bottom: 10px;
			border-top: none;
			border: 1px solid rgba(0, 0, 0, 0.1);
			&:hover {
				box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
			}
		}
		.__title-bar {
			display: inline-block;
			width: 2px;
			height: 14px;
			position: relative;
			top: 2px;
			background-color: #e84854;
		}
	}
    .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
        height: 60px;
		border: none;
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
}
</style>
