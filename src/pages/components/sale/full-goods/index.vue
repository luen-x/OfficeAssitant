<template>
	<div class="v-page-goods">
		<div class="_good-info">
			<div class="_title">
				<span>{{ childProducts?'套餐产品':'商品信息' }}</span>
			</div>
			<div class="_info">
				<div class="_info-header g-flex-cc g-jc-sb">
					<div class="g-flex-cc">
						<i-tooltip
							v-if="goodsInfo.product_name&&goodsInfo.product_name.length>15"
							:content="goodsInfo.product_name"
							max-width="500"
						>
							<span style="cursor: pointer;" class="_info-title">{{ goodsInfo.product_name }}</span>
						</i-tooltip>
						<span v-else class="_info-title">{{ goodsInfo.product_name }}</span>
						<i-tooltip
							v-if="goodsInfo.product_describe&&goodsInfo.product_describe.length>15"
							:content="goodsInfo.product_describe"
							max-width="500" >
							<span style="cursor: pointer;" class="_info-introduce">{{ goodsInfo.product_describe }}</span>
						</i-tooltip>
						<span v-else class="_info-introduce">{{ goodsInfo.product_describe }}
						</span>
					</div>
					<div class="_info-handle">
						<span class="_link">
							<i class="iconfont icon-link"/>
							<span class="_text">{{ goodsInfo.attachment_num }}</span>
						</span>
						<span class="_download" @click="handledown(goodsInfo)">
							<i class="iconfont icon-xiazai"/>
							<span>下载附件</span>
						</span>
					</div>
				</div>
				<div class="_info-content g-m-t-20">
					<div class="_content-title">{{ goodsInfo.sku?'产品基础信息':'套餐基础信息' }}</div>
					<ul class="_content">
						<li v-if="goodsInfo.total_price">
							套餐价格：
							<span>{{ goodsInfo.total_price }}</span>
						</li>
						<template v-else>
							<li >
								产品价格：
								<i-tooltip v-if="goodsInfo.standard_price_str" placement="bottom-start" max-width="500" >
									<span v-if=" goodsInfo.standard_price_str[0].length>10">
										{{ goodsInfo.standard_price_str[0].substr(0,10)+"..." }}
									</span>
									<span v-else>{{ goodsInfo.standard_price_str[0] }}</span>
									<div v-for="(ele,index) in goodsInfo.standard_price_str" slot="content" :key="index">{{ ele }}</div>
								</i-tooltip>
							</li>
							<li >
								制作部门：
								<span>{{ goodsInfo.make_depart_name }}</span>
							</li>
							<li >
								产品分类：
								<span>{{ goodsInfo.category_name }}</span>
							</li>
							<li >
								服务提成：
								<span>{{ goodsInfo.has_service_amount }}</span>
							</li>
						</template>
					</ul>
					<div v-if=" goodsInfo.sku&&goodsInfo.sku.length>1" >
						<div class="g-m-t-20">产品规格名称：</div>
						<div v-for="(item,index) in goodsInfo.sku" :key="index" class="_content" >
							<div class="g-col">{{ item.sku_name }}</div>
							<div class="g-col">产品价格:{{ item.price }}元</div>
							<div class="g-col"/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="childProducts" class="_good-info g-m-t-20">
			<div class="_title">
				<span>套餐包含产品</span>
			</div>
			<div v-for="(item,i) in childProducts" :key="i" class="_info">
				<div class="_info-header g-flex-cc g-jc-sb">
					<div class="g-flex-cc">
						<i-tooltip
							v-if="item.product_name&&item.product_name.length>15"
							:content="item.product_name"
							max-width="500"
						>
							<span style="cursor: pointer;" class="_info-title">{{ item.product_name }}</span>
						</i-tooltip>
						<span v-else class="_info-title">{{ item.product_name }}</span>
						<i-tooltip
							v-if="item.product_describe&&item.product_describe.length>15"
							:content="item.product_describe"
							max-width="500">
							<span style="cursor: pointer;" class="_info-introduce">{{ item.product_describe }}</span>
						</i-tooltip>
						<span v-else class="_info-introduce">{{ item.product_describe }}
						</span>
					</div>
					<div class="_info-handle">
						<span class="_link">
							<i class="iconfont icon-link"/>
							<span class="_text">{{ item.attachment_num }}</span>
						</span>
						<span class="_download" @click="handledown(item)">
							<i class="iconfont icon-xiazai"/>
							<span>下载附件</span>
						</span>
					</div>
				</div>
				<div class="_info-content">
					<div class="_content-title">产品基础信息</div>
					<ul class="_content">
						<li v-if="item.sku_name" class="g-m-r-20" style="flex: inherit;">
							<span>{{ item.sku_name }}</span>
						</li>
						<li>
							产品价格：
							<i-tooltip placement="bottom-start" max-width="500" >
								<span v-if=" item.standard_price_str[0].length>10">
									{{ item.standard_price_str[0].substr(0,10)+"..." }}
								</span>
								<span v-else>{{ item.standard_price_str[0] }}</span>
								<div v-for="(ele,index) in item.standard_price_str" slot="content" :key="index">{{ ele }}</div>
							</i-tooltip>
						</li>
						<li>
							制作部门：
							<span>{{ item.make_depart_name }}</span>
						</li>
						<li>
							产品分类：
							<span>{{ item.category_name }}</span>
						</li>
						<li>
							服务提成：
							<span>{{ item.has_service_amount }}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<!-- <div class="_good-example" >
			<div class="_title">
				<span>相关案例</span>
			</div>
			<ul class="_example-list">
				<li
					v-for="(item,i) in list"
					:key="i"
					class="_item-hover"
					@click="handleDetail(item.material_id,item.keyword)"
				>
					<template v-if="showExample?1:i<5">
						<p class="_example-title">
							<span>{{ item.title }}</span>
						</p>
						<div class="_user-info">
							<span>{{ item.staff_name }}</span>
							<span>{{ item.create_date }}</span>
							<span>
								<i class="iconfont icon-accessory"/>
								{{ item.attachment_num }}
							</span>
							<span>
								<i class="iconfont icon-download"/>
								{{ item.download_number }}
							</span>
							<span>
								<i class="iconfont icon-open-eyes"/>
								{{ item.browse_number }}
							</span>
						</div>
					</template>
				</li>
			</ul>
			<div v-if="list.length>5" class="_show-all" @click="handleExampleList">
				<span>{{ !showExample?'查看全部案例':'收起全部案例' }}</span>
				<i
					:class="showExample ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont"
				/>
			</div>
		</div> -->
	</div>
</template>

<script>
import API from '@stores/apis/root';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { downloadFile } from '@utils/download';
import { Tooltip } from 'iview';

export default {
	name: 'oa-tpl',
	components: {
		'i-tooltip': Tooltip,
	},
	data() {
		return {
			goodsInfo: {},
			childProducts: [],
			list: [],
			showExample: false
		};
	},
	created() {
		this.getGoodInfo();
	},
	methods: {
		handleExampleList() {
			this.showExample = !this.showExample;
		},
		getGoodInfo() {
			let { query = {} } = getParseUrl();
			this.$request({
				url: API.SALE_FULL_GOODS_GET,
				type: 'GET',
				param: {
					...query,
					is_control_role: query.status == 3 ? 0 : ''
				}
			}).then(res => {
				this.goodsInfo = res.data.product_info || res.data.combine_info.combine_data;
				this.childProducts = res.data.combine_info && res.data.combine_info.child_products;
				this.list = res.data.list;
			});
		},
		handleDetail(val, m) {
			let status = this.$route.query.status;
			this.$router.push({ name: "content-preview",
				query: {
					material_id: val,
					material_type: 3,
					key: this.$route.query.key ? this.$route.query.key : m,
					status: this.$route.query.status ? this.$route.query.status : '',
					flags: this.$route.query.flags,
					type: this.$route.query.type } });
		},
		handledown(v) {
			let list = v;
			if (!list.attachment || list.attachment.length == 0) {
				this.$Message.error('当前没有附件可下载');
				return;
			}
			list.attachment.forEach(ele => {
				downloadFile({ fileName: ele.attachment_url });
			});
		}
	},
};
</script>

<style lang="scss" scoped>
    .v-page-goods {
        margin-top: 20px;
		margin-bottom: 60px;
        ._good-info {
            margin-left: 120px;
            width: 700px;
            ._title {
                position: relative;
                padding: 0 10px;
                font-size: 14px;
                &::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 2px;
                    height: 16px;
                    background: #d03f2a;
                }
            }
            ._info {
                margin-top: 20px;
                box-sizing: border-box;
                border: 1px solid #e8e8e8;
                ._info-header /deep/.ivu-tooltip {
                    height: 35px;
                    .ivu-tooltip-rel {
                        height: 35px;
                    }
                    .ivu-tooltip-inner{
                        max-width: 100%;
                    }
                }
                ._info-header {
                    height: 35px;
                    line-height: 35px;
                    padding: 0 15px;
                    background: #f4f5f7;
                    ._info-title {
                        display: inline-block;
                        font-size: 14px;
                        max-width: 230px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    ._info-introduce {
                        display: inline-block;
                        font-size: 12px;
                        color: #a5aab2;
                        margin-left: 20px;
                        max-width: 280px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        display: inline-block;
                    }
                    ._info-handle {
                        float: right;
                        font-size: 12px;
                        ._link {
                            color: #a5aab2;
                            cursor: pointer;
                            .iconfont,
                            ._text {
                                display: inline-block;
                                vertical-align: middle;
                            }
                        }
                        ._download {
                            margin-left: 20px;
                            color: #3b91f5;
                            cursor: pointer;
                            .iconfont,
                            ._text {
                                display: inline-block;
                                vertical-align: middle;
                            }
                        }
                    }
                }
                ._info-content {
                    padding: 15px;
                    ._content-title {
                        font-size: 14px;
                    }
                    ._content {
                        margin-top: 15px;
                        display: flex;
                        li {
                            flex: 1;
                        }
                    }
                }
            }
        }
        ._good-example {
            margin-top: 30px;
            margin-left: 120px;
            width: 700px;
            ._title {
                position: relative;
                padding: 0 10px;
                font-size: 14px;
                &::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 2px;
                    height: 16px;
                    background: #d03f2a;
                }
            }
            ._example-list {
                li {
                    margin-top: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #efefef;
                    cursor: pointer;
                    ._example-title {
                        color: #3b91f5;
                        font-size: 14px;
                        padding-right: 20px;
                        box-sizing: border-box;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    ._user-info {
                        margin-top: 10px;
                        span {
                            display: inline-block;
                            vertical-align: middle;
                            margin-right: 40px;
                            color: #a5aab2;
                        }
                    }
                }
            }
            ._show-all {
                margin-top: 10px;
                cursor: pointer;
                span,
                .iconfont {
                    display: inline-block;
                    vertical-align: middle;
                }
                .iconfont {
                    font-size: 12px;
                }
            }
        }
        ._item-hover:hover {
            ._example-title {
                span {
                    border-bottom: 1px solid currentColor;
                }
            }
        }
    }
    .show-enter-active,
    .show-leave-active {
        transition: all 0.5s;
    }
    .show-enter,
    .show-leave-to {
        transform: scaleY(0);
    }
    .show-move {
        transition: transform 0.5s;
    }
</style>
