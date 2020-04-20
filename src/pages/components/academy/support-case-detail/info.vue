<template>
	<div class="v-academy-support-case-detail-info">
		<div class="g-m-b-20">
			<vc-copy :value="text" @after="handleAfterCopy">
				<i-button
					class="g-m-r-5 g-fr"
				>
					复制内容
				</i-button>
			</vc-copy>
			<i-button
				v-if="showCollect"
				type="primary"
				class="g-m-r-5 g-fr"
				@click="handleCollect"
			>
				{{ info.collection_id?'已收藏':'收藏' }}
			</i-button>
			<span class="_info-title">{{ info.title || '--' }}</span> 
		</div>
		<div class="g-c-black7 g-fs-12 g-m-b-20">
			<span class="g-c-black7 g-fs-12 g-fr">
				<i class="icon iconfont icon-preview g-c-black7 g-fs-12 "/> {{ info.browse_num }}
				<oa-star 
					:source-id="info.case_id" 
					:collection-id="info.collection_id" 
					:source-type="1" 
					:disabled="!showCollect"
					class="g-m-l-30"
					@change="handleStarChange"/>
				{{ info.collection_num }}
				<i class="icon iconfont icon-lianjie g-c-black7 g-fs-12 g-m-l-30"/> {{ info.attachment_num }}
			</span>
			<span class="g-m-r-10">
				{{ info.staff_name }}
			</span>
			<span>
				{{ info.create_time }}
			</span>
		</div>
		<div class="g-flex g-pd-b-10 g-fw-w g-m-b-20" style="border-bottom:1px solid #EBEBEB">
			<div class="_company-info-item">客户公司：<span class="g-col">{{ info.contract_company_name }}</span></div>
			<div class="_company-info-item">地区：<span class="g-col">{{ region }}</span></div>
			<div class="_company-info-item">具体行业：<span class="g-col">{{ info.industry_name }}</span></div>
			<div class="_company-info-item">注册资金：<span class="g-col">{{ info.capital }} 万</span></div>
			<div class="_company-info-item">产品类型：<span class="g-col">{{ info.product_type_name }}</span></div>
			<div class="_company-info-item">具体产品：<span class="g-col">{{ info.product_name }}</span></div>
			<div class="_company-info-item">客户类型：<span class="g-col">{{ info.customer_type_name }}</span></div>
			<div class="_company-info-item">客户微龄：<span class="g-col">{{ info.age_name }}</span></div>
			<div class="_company-info-item">合作金额：<span class="g-col">{{ info.payment_amount }} 元</span></div>
			<div class="_company-info-item">代理人数：<span class="g-col">{{ info.agent_num?info.agent_num+' 人':'-' }}</span></div>
			<div class="_company-info-item">回款金额：<span class="g-col">{{ info.money_back }} 万</span></div>
		</div>
		<oa-editor-preview :content="info.content || ''" height="auto" />
		<div style="border-top:1px solid #EBEBEB" class="g-m-t-20 g-pd-t-10">
			<div class="g-m-b-10">
				<span class="g-pd-l-5" style="font-weight:600">附件下载：</span>  
				<span v-if="info.attachment_list.length" class="g-operation" @click="handleDownloadAll">一键下载</span>
			</div>
			<oa-upload
				v-model="info.attachment_list"
				:max="20"
				:show-title="true"
				style="width: 720px"
				placeholder="请上传凭证"
				disabled
			/>
		</div>


		<slot :data="info" />

	</div>
</template>
<script>
import { Input, Button } from 'iview';
import { Copy } from 'wya-vc';
import EditorPreview from '@common/editor-preview/editor-preview';
import Upload from '@common/upload/upload';
import downloadFile from '@utils/download';
import { Confirm } from '@common/confirm/confirm.vue';
import { ChangeCategory } from '@components/collect/_common/modals/change-category';
import Star from '@components/collect/_common/comp/star';
import { addBrowseNum } from '@components/collect/_common/util';
import { getPlainText } from '../../sale/_common/util';

export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-editor-preview': EditorPreview,
		'oa-star': Star,
		'oa-upload': Upload,
		'vc-copy': Copy

	},
	props: {
		caseId: [Number, String],
		data: Object, // caseId 和data只能传一个
		showCollect: Boolean

	},
	data() {
		return {
			info: {
				"case_id": 0, // 案例ID
				"title": "", // 案例标题
				"contract_company_id": '', // 案例公司ID
				"contract_company_name": "", // 公司名称
				"capital": "", // 注册资金
				"province": 0,
				"province_name": "", // 省
				"city": 0,
				"city_name": "", // 市
				"area": 0,
				"area_name": "", // 区
				"industry_id": 1,
				"industry_name": "", // 行业
				"product_type_id": 0,
				"prodcut_type_name": "", // 产品类型
				"product_name": "",
				"customer_type": 0,
				"customer_type_name": "", // 客户类型
				"age": 0,
				age_name: '',
				"money_back": "", // 回款数
				"payment_amount": 0, // 合作金额
				"agent_num": 10, // 代理人数
				"limit_condition": 0,
				"work_age_min": 0, // 工龄最小
				"work_age_max": 0, // 工龄最大
				"provider_staff_ids": [// 提供人ids数组
				],
				"image": "", // 封面url
				"content": "", // 案例内容
				"browse_num": 0, // 浏览量
				"collection_num": 0, // 收藏量
				"attachment_num": 0, // 附件数
				"staff_id": 0,
				"create_time": "", // 上传时间
				"staff_name": "", // 上传人
				"position_list": [], // 查看职位ids
				"attachment_list": [],
				collection_id: undefined,
				
			},
		};
		
	},
	computed: {
		text() {
			return getPlainText(this.info.content || '');
		},
		region() {
			if (this.info.region) {
				return this.info.region;
			}
			return [this.info.province_name, this.info.city_name].filter(Boolean).join(' ');

		}

	},
	watch: {
		caseId(val) {
			if (val) addBrowseNum(val);
			this.loadCaseDetail();
		},
		data: {
			immediate: true,
			handler(val) {
				if (!val) return;
				if (val && val.case_id) addBrowseNum(val.case_id); // 新增案例时的预览没有case_id
				this.info = val;
			},
			
			
		} 

	},
	created() {
		if (this.caseId) addBrowseNum(this.caseId);
		this.loadCaseDetail();

	},
	methods: {
		handleAfterCopy() {
			this.$Message.success('复制成功');
			
		},
		handleStarChange(data) {
			if (data.changed) {
				if (data.collection_id) {
					this.info.collection_id = data.collection_id;
					this.info.collection_num++;
				} else {
					this.info.collection_id = undefined;
					this.info.collection_num--;
				}
			}
		},
		handleCollect() {
			if (this.info.collection_id) {
				Confirm.popup({
					title: '取消收藏',
					msg: "确定取消收藏该案例吗？"
				}).then(() => {
					this.$request({
						url: "_SALE_MAIN_CASE_COLLECT_DELETE_POST",
						type: "POST",
						param: { collection_id: this.info.collection_id },
						loading: false,
					}).then(res => {
						this.info.collection_id = undefined;
						this.info.collection_num--;
						// this.loadCaseDetail();
					}).catch((res) => {
						this.$Message.error(res.msg);
					});
				});
			} else {
				ChangeCategory.popup({
					sourceId: this.info.case_id,
					sourceType: 1,
					mode: 'addCollect'

				}).then(res => {
					if (res && res.changed) {
						if (!this.info.collection_id && res.collection_id) {
							this.info.collection_num++;
						}
						this.info.collection_id = res.collection_id;
					}

				}).catch(res => {
					if (res && res.changed) {
						if (!this.info.collection_id && res.collection_id) {
							this.info.collection_num++;
						}
						this.info.collection_id = res.collection_id;
					}

				});

			}

		},
		handleDownloadAll() {
			this.info.attachment_list.forEach(i => {
				downloadFile({
					fileName: i.url
				});
				
			});
		},
		loadCaseDetail() {
			if (!this.caseId) return;
			this.$request({
				url: "_ACADEMY_SUPPORT_CASE_DETAIL_GET",
				type: "GET",
				param: { case_id: this.caseId },
				loading: false,
			}).then(res => {
				this.info = res.data;
			
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		}
	}
};
</script>
<style lang="scss">
.v-academy-support-case-detail-info {
	width: 800px;
	._info-title {
		font-size: 16px;
		color: black;
		font-weight: 600;
	}
	._company-info-item {
		width: 200px;
		margin-bottom: 10px;
		display: flex;

	}

}
</style>