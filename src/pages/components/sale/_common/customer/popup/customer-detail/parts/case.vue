<template>
	<div class="v-sale-customer-detail-case g-relative g-pd-t-20" style="height:100%;margin-right: -20px;" >
		<oa-loading v-if="loading"/>
		<template v-else-if="caseList.length==0" >
			<div v-if="showApplyCase " class="g-tc" style="margin-top:80px">
				
				<img :src="OSS_NO_MESSAGE02" style="width:180px" >
					
				<div>系统没有找到与当前客户匹配的案例，
					<span v-if="!readOnly" class="g-operation" @click="handleApplyCase">点击向X事业部提出相关案例的需求</span>。
				</div>
				
			</div>
			<div v-else class="g-tc" style="margin-top:80px">
				<img :src="OSS_NO_MESSAGE02" style="width:180px" >
				<div>
					系统没有找到与当前客户匹配的案例，请试着填写以下信息：客户地区、具体行业、客户类型、客户产品看看吧。
				</div>
			</div>
		</template>
		<div v-else style="height:100%;display:flex;flex-direction: column;">
			<oa-scroll 
				:loading="scrollLoading"
				style="overflow:auto;flex:1;margin-bottom:10px"
				@reach-bottom="loadData"
			>
				<oa-case-item 
					v-for="(item,index) in caseList" 
					:key="item.case_id" 
					:data="item"
					:read-only="readOnly"
					class="g-m-b-20"
					@click.native="handlePreview(index)"
				/> 
			</oa-scroll>
		</div>
	</div>
</template>
<script>
import { debounce } from 'lodash';
import { OSS_NO_MESSAGE02 } from '@constants/constants';
import { services } from '@stores/services/sale';
import Scroll from '@components/_common/scroll/scroll';
import { getPlainText } from '@components/sale/_common/util';
import CaseItem from '../../components/case-item';
import { ConfirmWithRemark } from '../../../confirm-remark';
import { CasePreview } from '../../../case-preview';

const tagList = [
	{ label: '相同地区', key: "same_province" },
	{ label: '相同行业', key: "same_industry_id" },
	{ label: '相同产品', key: "same_product_type_id" },
	{ label: '相同类型', key: "same_customer_type" }
];
export default {
	name: 'oa-sale-customer-detail-case',
	components: {
		'oa-case-item': CaseItem,
		'oa-scroll': Scroll
	},
	mixins: [
	],
	props: {
		customerId: Number,
		isOwn: Boolean,
		showApplyCase: Boolean,
		readOnly: Boolean

	},
	data() {
		return {
			OSS_NO_MESSAGE02,
			loading: true,
			scrollLoading: false,
			loadAllCasePromise: undefined,
			allCase: [],
			caseList: [
				// { "case_id": 9,
				// 	"title": "anli", // 标题
				// 	"content": "哈哈哈哈哈", // 内容
				// 	text: "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈",
				// 	"contract_company_name": "杭州大美妆", // 公司名称
				// 	"province": 110000,
				// 	"city": 110100,
				// 	"area": 110101,
				// 	"industry_id": 1,
				// 	"product_type_id": 1,
				// 	"customer_type": 1,
				// 	image: '-',
				// 	"age": 1,
				// 	"browse_num": 0, // 浏览数
				// 	"collection_num": 0, // 收藏数
				// 	"staff_name": "超管", // 上传人
				// 	"create_time": "2020-02-20 13:18:05", // 上传时间
				// 	"region": "北京市北京市辖区", // 地区
				// 	"industry_name": "大健康", // 行业
				// 	"customer_type_name": "传统", // 客户类型
				// 	"product_type_name": "", // 产品类型
				// 	"age_name": "1年不到", // 微龄
				// 	"attachment_list": [// 附件
				// 		"https://wyatest.oss-cn-hangzhou.aliyuncs.com/oa2/20190921/1569032188654/timg.jpeg",
				// 		"https://wyatest.oss-cn-hangzhou.aliyuncs.com/oa2/20190921/1569047495796/001.jpg"
				// 	],
				// 	"attachment_num": 2// 附件数
				// }
			],
			currentPage: 0,
			tagList
		};
	},
	watch: {
		customerId(newVal, oldVal) {
			this.freshData();
		
		}
	},
	created() {
		this.loadAllCasePromise = this.loadAllCase();
		this.loadData();

	},
	methods: {
		clearData() {
			this.currentPage = 0;
			this.scrollLoading = false;
			this.caseList = [];
		},
		freshData() {
			this.clearData();
			this.loadAllCasePromise = this.loadAllCase();
			this.loadData();
		},
		loadAllCase() {
			this.loading = true;
			return this.$request({
				url: "_SALE_CUSTOMER_INTENTION_CASE_RELATE_GET",
				type: "GET",
				param: { customer_id: this.customerId },
				loading: false,
			}).then(res => {
				this.loading = false;
				this.allCase = res.data;
				
			}).catch((res) => {
				this.loading = false;
				this.$Message.error(res.msg);
			});
		},
		loadData: debounce(async function () {
			this.scrollLoading = true;
			const customerId = this.customerId;// 加载中切换数据时的打断请求
			await this.loadAllCasePromise;
			const pageData = this.allCase.filter((i, index) => index >= this.currentPage * 10 && index < (this.currentPage + 1) * 10);
			if (pageData.length) {
				pageData.forEach(item => {
					item.tags = [];
					this.tagList.forEach(t => {
						if (item[t.key]) {
							item.tags.push(t.label);
						}
					});
					item.text = getPlainText(item.content);
				});
				this.caseList.push(...pageData);
				this.currentPage += 1;
			}
			this.scrollLoading = false;

		}, 100),
		handleApplyCase: debounce(function () {
			ConfirmWithRemark.popup({
				title: '申请案例',
				required: true,
				label: '案例描述',
				placeholder: "请对你需要的案例进行描述说明",
				okCallback: (remark) => {
					return this.$request({
						url: "_SALE_CUSTOMER_CASE_APPLY_POST",
						type: "POST",
						param: { 
							remark, 
						},
						loading: false,
					}).then(res => {
						this.$Message.success(res.msg);
						return res;
			
					}).catch((res) => {
						this.$Message.error(res.msg);
					});

				}

			});
			

		}, 200),
		handlePreview(index) {
			if (this.readOnly) return;
			CasePreview.popup({
				caseList: this.allCase,
				index,
			}).catch(e => e && console.error(e)).finally(() => {
				this.updateAllCaseStatus();
			});

		},
		updateAllCaseStatus() {
			return this.$request({
				url: "_SALE_CUSTOMER_INTENTION_CASE_RELATE_GET",
				type: "GET",
				param: { customer_id: this.customerId },
				loading: false,
			}).then(res => {
				this.allCase.forEach(item => {
					const sameCase = res.data.find(it => it.case_id === item.case_id);
					if (sameCase) {
						item.collection_id = sameCase.collection_id;
						item.collection_num = sameCase.collection_num;
						item.browse_num = sameCase.browse_num;
					}
				}); 
				this.$forceUpdate();
				
			}).catch((res) => {
				this.loading = false;
				this.$Message.error(res.msg);
			});

		}
		
	}
};
</script>
<style lang="scss">


</style>