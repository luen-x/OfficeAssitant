<template>
	<div v-show="showitem" class="g-fw-w v-content-search-result">
		<div class="_tip g-m-b-10" v-html="listInfo.result_str_top" />
		<oa-no-data v-if="!listInfo.data[1].length" />
		<div v-else class="_wrapper">
			<div v-for="(item, index) in listInfo.data[1] || []" :key="index" class="__product-wrapper" >
				<div class="__title">
					<span v-html="item.product_name" />
					<div class="g-fr __left-icon">
						<i class="iconfont icon-lianjie g-f-s-12"/>
						<span v-html="item.attachment.length" />
						<div class="__down-wrapper" @click="handleDown(item)">
							<i class="iconfont icon-download g-m-l-10"/>
							<span>下载附件</span>
						</div>
					</div>
				</div>
				<div class="__content">
					<p class="__text-gray" v-html="item.product_describe" />
					<p class="__text-title">产品基础信息</p>
					<i-row class="__info-wrapper ">
						<i-col span="6" class="__info-text">
							<span class="__left">产品价格：</span>
							<span v-html="item.product_price" />
						</i-col>
						<i-col span="6" class="__info-text">
							<span class="__left">制作部门：</span>
							<span v-html="item.depart_name" />
						</i-col>
						<i-col span="6" class="__info-text">
							<span class="__left">产品分类：</span>
							<span v-html="item.category_name" />
						</i-col>
						<i-col span="6" class="__info-text">
							<span class="__left">服务提成：</span>
							<span v-html="item.service_amount" />
						</i-col>
					</i-row>
					<p v-if="item.link_case.length" class="__text-title">产品案例</p>
					<div v-if="item.link_case.length" class="__example-wrapper">
						<div 
							v-for="(element, index) in item.link_case" 
							:key="index" 
							class="__example-name"
						>
							<span 
								class="g-oneline g-m-r-20" 
								@click="handleDetail(element)"
								v-html="element.title"
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="g-m-t-20 g-m-b-30">
				<span v-html="listInfo.result" />
			</div>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { Message, Row, Col } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { downloadFile } from '@utils/download';
import item from './item';
import noData from './no-data';

export default {
	name: 'content-search-tabs-product',
	components: {
		'oa-no-data': noData,
		'i-col': Col,
		'i-row': Row,
	},
	mixins: [item],
	props: {
		showitem: Boolean
	},
	data() {
		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentSearchResult.listInfo[9] || { data: {} };
		},
		keyword() {
			const { query = {} } = this.$route;
			return String(query.keyword || '');
		}
	},
	methods: {
		handleDown(e) {
			if (!e.attachment.length) {
				Message.warning('暂无可下载附件');
			} else {
				e.attachment.forEach(element => {
					downloadFile({
						fileName: element,
					});
				});
			}
		},
		handleDetail(e) {
			this.$router.push({
				path: '/content/preview',
				query: {
					material_id: e.material_id,
					material_type: '3',
					keyword: e.keyword,
					status: 4,
					key: this.$route.query.keyword,
					type: this.$route.query.type
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-content-search-result {
	._tip {
		color: #000;
		font-size: 14px;
		padding-left: 120px;
	}
	._wrapper {
		padding-left: 120px;
		.__product-wrapper {
		width: 80%;
		border: 1px solid #d4d9da;
		margin-bottom: 15px;
		.__title {
			padding: 10px 20px 10px 20px;
			border-bottom: 1px solid #d4d9da;
			background-color: #f2f2f2;
			.__left-icon {
				color: #828893;
				.__down-wrapper {
					display: inline-block;
					cursor: pointer;
				}
			}
		}
		.__content {
			padding: 10px 20px 20px 20px;
			.__text-gray {
				color: #a5a9b0;
				margin-bottom: 10px;
			}
			.__text-title {
				font-size: 14px;
				margin: 10px 0 10px 0;
			}
			.__info-wrapper {
				margin: 10px 0  10px 0;
				.__info-text {
					display: inline-block;
					width: 200px;
					padding-right: 15px;
					.__left {
						color: #a5a9b0;
					}
				}
			}
			.__example-wrapper {
				.__example-name {
					display: inline-block;
					width: 200px;
					margin-bottom: 10px;
					color: #2399f8;
					cursor: pointer;
				}
			}
		}
	}
	}
}
</style>


