<template>
	<div v-show="showitem" class="g-fw-w v-content-search-result-all">
		<!-- <div class="_tip g-m-b-10">“{{ keyword }}”的全部搜索结果</div> -->
		<!-- 系统功能a  -->
		<oa-no-data v-if="dataShow" />
		<div v-else class="_wrapper">
			<div v-if="listInfo.system_function.list.length" class="__product-wrapper">
				<div class="__title">
					<span>系统功能类</span>
					<div class="g-fr __left-icon">
						<span v-html="listInfo.system_function.result_str" />
					</div>
				</div>
				<div class="__content">
					<div class="_sysytem-methods-wrapper">
						<div v-for="(item, index) in listInfo.system_function.list" :key="index" class="__item-wrapper" >
							<div class="__card-wrapper">
								<div class="__item-card" @click="handleToSys(item)">
									<i class="iconfont icon-product __item-icon"/>
									<div v-html="item.name" />
								</div>
							</div>
							<div class="__item-text" @click="handleToSys(item)">
								<span>点击进入</span><span v-html="item.parent_name" />
							</div>
						</div>
					</div>
					<div v-if="listInfo.system_function.all" class="g-fr">
						<span class="g-operation" @click="handleDetail(2)">查看全部>></span>
					</div>
				</div>
			</div>

			<!-- 服务工具包 -->
			<div v-if="listInfo.service_toolkit.list.length" class="__product-wrapper">
				<div class="__title">
					<span>服务工具包</span>
					<div class="g-fr __left-icon">
						<span v-html="listInfo.service_toolkit.result_str" />
					</div>
				</div>
				<div class="__content">
					<div class="__toolkit-wrapper" style="box-sizing: border-box;">
						<div 
							v-for="(item, index) in listInfo.service_toolkit.list" 
							:key="index"
							class="__toolkit-item" 
							@mouseover="handleHover(item, index)"
							@mouseout="handleOut(item, index)">
							<i :class="item.doc_type"/>
							<span class="__file-title" v-html="item.material_name" />
							<i-tool-tip content="点击下载">
								<i
									v-show="item.material_id == nowIndex" 
									class="iconfont icon-download g-m-l-5 g-c-blue-light __operate g-fs-14"
									@click="handleDownload(item)"
								/>
							</i-tool-tip>
							<i-tool-tip v-if="item.type == 1" content="点击预览">
								<i 
									v-show="item.material_id == nowIndex" 
									class="iconfont icon-audit g-m-l-5 g-c-blue-light __operate g-fs-14" 
									@click="handlePreview(item)" 
								/>
							</i-tool-tip>
						</div>
					</div>
					<div v-if="listInfo.service_toolkit.all" class="g-fr">
						<span class="g-operation" @click="handleDetail(3)">查看全部>></span>
					</div>
				</div>
			</div>

			<!-- 销售工具包 -->
			<div v-if="listInfo.sale_toolkit.list.length" class="__product-wrapper">
				<div class="__title">
					<span>销售工具包</span>
					<div class="g-fr __left-icon">
						<span v-html="listInfo.sale_toolkit.result_str" />
					</div>
				</div>
				<div class="__content">
					<div class="__toolkit-wrapper">
						<div 
							v-for="(item, index) in listInfo.sale_toolkit.list"
							:key="index" 
							class="__toolkit-item"
							@mouseover="handleHover(item, index)"
							@mouseout="handleOut(item, index)">
							<i :class="item.doc_type"/>
							<span class="__file-title" v-html="item.material_name" />
							<i-tool-tip content="点击下载">
								<i
									v-show="item.material_id == nowIndex" 
									class="iconfont icon-download g-m-l-5 g-c-blue-light __operate g-fs-14" 
									@click="handleDownload(item)"
								/>
							</i-tool-tip>
							<i-tool-tip v-if="item.type == 1" content="点击预览">
								<i 
									v-show="item.material_id == nowIndex" 
									class="iconfont icon-audit g-m-l-5 g-c-blue-light __operate g-fs-14" 
									@click="handlePreview(item)" 
								/>
							</i-tool-tip>
						</div>
					</div>
					<div v-if="listInfo.sale_toolkit.all" class="g-fr">
						<span class="g-operation" @click="handleDetail(4)">查看全部>></span>
					</div>
				</div>
			</div>

			<!-- 客户 -->
			<!-- <div v-if="listInfo.customer.list.length" class="__product-wrapper">
				<div class="__title">
					<span>客户</span>
					<div class="g-fr __left-icon">
						<span v-html="listInfo.customer.result_str)" />
					</div>
				</div>
				<div class="__content">
					<i-row v-for="(item, index) in listInfo.customer.list" :key="index" class="__list-item">
						<i-col span="6">
							<span>公司名称：</span>
							<span v-html="item.company_name)" />
						</i-col>
						<i-col span="4">
							<span>姓名：</span>
							<span v-html="item.customer_name)" />
						</i-col>
						<i-col span="5">
							<span>状态：</span>
							<span v-html="item.status_str)" />
						</i-col>
						<i-col span="5">
							<span>负责人：</span>
							<span v-html="item.staff_name)" />
						</i-col>
						<i-col span="4">
							<span>剩余保护时间：</span>
							<span v-html="item.expiration_time)" />
						</i-col>
					</i-row>
					<div v-if="listInfo.customer.all" class="g-fr">
						<span class="g-operation" @click="handleDetail(5)">查看全部>></span>
					</div>
				</div>
			</div> -->

			<!-- 资讯 -->
			<!-- <div v-if="listInfo.consultation.list.length" class="__product-wrapper">
				<div class="__title">
					<span>资讯</span>
					<div class="g-fr __left-icon">
						<span v-html="listInfo.consultation.result_str" />
					</div>
				</div>
				<div class="__content">
					<i-row v-for="(item, index) in listInfo.consultation.list" :key="index" class="__list-item">
						<i-col span="6" class="g-operation g-m-r-20">
							<span @click="handleDetailPreview(item, 2)" v-html="item.title" />
						</i-col>
						<i-col span="6" class="g-m-r-20">
							<span>阅读量：</span>
							<span v-html="item.browse_number" />
						</i-col>
						<i-col span="5" class="g-m-r-20">
							<span>发布人：</span>
							<span v-html="item.staff_name" />
						</i-col>
						<i-col span="5">
							<span>发布时间：</span>
							<span v-html="item.create_time" />
						</i-col>
					</i-row>
					<div v-if="listInfo.consultation.all" class="g-fr">
						<span class="g-operation" @click="handleDetail(7)">查看全部>></span>
					</div>
				</div>
			</div> -->

			<!-- 素材 -->
			<!-- <div v-if="listInfo.material.list.length" class="__product-wrapper">
				<div class="__title">
					<span>素材</span>
					<div class="g-fr __left-icon">
						<span v-html="listInfo.material.result_str" />
					</div>
				</div>
				<div class="__content">
					<i-row v-for="(item, index) in listInfo.material.list" :key="index" class="__list-item">
						<i-col span="6" class="g-operation g-m-r-20">
							<span @click="handleDetailPreview(item, 1)" v-html="item.title" />
						</i-col>
						<i-col span="6" class="g-m-r-20">
							<span>附件：</span>
							<span v-html="item.attach_count" />
						</i-col>
						<i-col span="5" class="g-m-r-20">
							<span>发布人：</span>
							<span v-html="item.staff_name" />
						</i-col>
						<i-col span="5">
							<span>发布时间：</span>
							<span v-html="item.create_time" />
						</i-col>
					</i-row>
					<div v-if="listInfo.material.all" class="g-fr">
						<span class="g-operation" @click="handleDetail(8)">查看全部>></span>
					</div>
				</div>
			</div> -->

			<!-- 员工 -->
			<div v-if="listInfo.staff.list.length" class="__product-wrapper">
				<div class="__title">
					<span>员工</span>
					<div class="g-fr __left-icon">
						<span v-html="listInfo.staff.result_str" />
					</div>
				</div>
				<div class="__content">
					<i-row v-for="(item, index) in listInfo.staff.list" :key="index" class="__list-item">
						<i-col span="5" class="g-m-r-20">
							<span>姓名：</span>
							<span v-html="item.staff_name" />
						</i-col>
						<i-col span="4" class="g-m-r-20">
							<span>部门：</span>
							<span v-html="item.depart_name" />
						</i-col>
						<i-col span="4" class="g-m-r-20">
							<span>职位：</span>
							<span v-html="item.position_name" />
						</i-col>
						<i-col span="4" class="g-m-r-20">
							<span>入职时间：</span>
							<span v-html="item.create_time" />
						</i-col>
						<i-col span="4" class="g-m-r-20">
							<span>工号：</span>
							<span v-html="item.staff_number" />
						</i-col>
					</i-row>
					<div v-if="listInfo.staff.all" class="g-fr">
						<span class="g-operation" @click="handleDetail(6)">查看全部>></span>
					</div>
				</div>
			</div>

			<!-- 产品 -->
			<!-- <div v-if="listInfo.product.list.length" class="__product-wrapper">
				<div class="__title">
					<span>产品</span>
					<div class="g-fr __left-icon">
						<span v-html="listInfo.product.result_str" />
					</div>
				</div>
				<div class="__content">
					<i-row v-for="(item, index) in listInfo.product.list" :key="index" class="__list-item">
						<i-col span="5" class="g-m-r-20">
							<span>产品名称：</span>
							<span v-html="item.product_name" />
						</i-col>
						<i-col span="4" class="g-m-r-20">
							<span>产品价格：</span>
							<span v-html="item.product_price" />
						</i-col>
						<i-col span="4" class="g-m-r-20">
							<span>制作部门：</span>
							<span v-html="item.depart_name" />
						</i-col>
						<i-col span="4" class="g-m-r-20">
							<span>产品分类：</span>
							<span v-html="item.category_name" />
						</i-col>
						<i-col span="4" class="g-m-r-20">
							<span>服务提成：</span>
							<span v-html="item.service_amount" />
						</i-col>
					</i-row>
					<div v-if="listInfo.product.all" class="g-fr">
						<span class="g-operation" @click="handleDetail(9)">查看全部>></span>
					</div>
				</div>
			</div> -->

			<!-- 客户案例 -->
			<!-- <div v-if="listInfo.case.list.length" class="__product-wrapper">
				<div class="__title">
					<span>客户案例</span>
					<div class="g-fr __left-icon">
						<span v-html="listInfo.case.result_str" />
					</div>
				</div>
				<div class="__content">
					<i-row v-for="(item, index) in listInfo.case.list" :key="index" class="__list-item">
						<i-col span="6" class="g-operation g-m-r-20">
							<span @click="handleDetailPreview(item, 3)" v-html="item.title" />
						</i-col>
						<i-col span="6" class="g-m-r-20">
							<span>关联产品：</span>
							<span v-html="item.link_info" />
						</i-col>
						<i-col span="5" class="g-m-r-20">
							<span>添加人：</span>
							<span v-html="item.staff_name" />
						</i-col>
						<i-col span="5">
							<span>发布时间：</span>
							<span v-html="item.create_time" />
						</i-col>
					</i-row>
					<div v-if="listInfo.case.all" class="g-fr">
						<span class="g-operation" @click="handleDetail(10)">查看全部>></span>
					</div>
				</div>
			</div> -->
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { Input, Col, Row, Tooltip } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { downloadFile } from '@utils/download';
import { debounce } from 'lodash';
import { PreviewModal } from './preview/content.vue';
import item from './item';
import noData from './no-data';

export default {
	name: 'sc-detail-tabs-all',
	components: {
		'i-input': Input,
		'i-col': Col,
		'i-row': Row,
		'oa-no-data': noData,
		'i-tool-tip': Tooltip 
	},
	mixins: [item],
	props: {
		showitem: Boolean
	},
	data() {
		return {
			nowIndex: 0,
			checked_list: []
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentSearchResult.listInfo[1];
		},
		dataShow() {
			let flag = true;
			for (let e in this.listInfo) {
				if (this.listInfo[e].list && this.listInfo[e].list.length > 0) {
					flag = false;
				}
			}
			return flag;
		},
		keyword() {
			const { query = {} } = this.$route;
			return String(query.keyword || '');
		}
	},
	created() {
		
	},
	mounted() {

	},
	methods: {

		// 跳转系统功能
		handleToSys(e) {
			this.$router.push({
				path: e.frontend_url,
			});
		},

		// 跳转详情页面
		handleDetailPreview(e, type) {
			this.$router.push({
				path: '/content/preview',
				query: {
					material_id: e.material_id,
					material_type: type + '',
					keyword: e.keyword,
					status: 4,
					key: this.$route.query.keyword,
					type: this.$route.query.type
				}
			});
		},

		// 下载
		handleDownload: debounce(async function (e) {
			if (e.type == 1) {
				const can_download = await this.downloadWarning();
				if (can_download) {
					downloadFile({
						fileName: e.file_url,
						downRecordParams: {
							material_ids: [e.material_id],
							type: 4
						}
					});
				}
			} else {
				this.checked_list = await this.getAllFile(e);
				if (this.checked_list.length) {
					const can_download = await this.downloadWarning(this.checked_list.length);
					if (can_download) {
						this.checked_list.forEach(element => {
							downloadFile({
								fileName: element.file_url,
								downRecordParams: {
									type: 4,
									material_ids: [element.material_id]
								}
							});
						});
					}
				}
			}
		}, 300),
		getAllFile(e) {
			return this.$request({
				url: "_ACADEMY_SUPPORT_TOOL_FOLDER_ALL_GET",
				type: "GET",
				param: {
					material_id: e.material_id
				},
				loading: false,
			}).then(res => {
				res.data.forEach(v => {
					v.file_url = v.path;
				});
				return res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		downloadWarning(download_num) {
			return this.$request({
				url: "_TOOLKIT_DOWNLOAD_RECORD_LIMIT_POST",
				type: "GET",
				param: {
					download_num: download_num || 1,
					material_type: 4
				},
				loading: false,
			}).then(res => {
				if (res.status) {
					return true;
				} else {
					return false;
				}
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},

		// 预览
		handlePreview(element) {
			PreviewModal.popup({ datas: element }).then(res => {});
		},

		// 显示下载预览按钮
		handleHover(e) {
			this.nowIndex = e.material_id;
		},
		handleOut(e) {
			this.nowIndex = -1;
		},

		// 首页查看全部
		handleDetail(e) {
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type: e,
				page: 1,
				pageSize: 10
			};
			this.$router.replace(getHashUrl('/content/search/result', { ...query }));

		},
	}
};
</script>

<style lang="scss" scoped>
.v-content-search-result-all {
	._wrapper {
		padding-left: 120px;
		.__product-wrapper {
			width: 80%;
			min-width: 710px;
			border: 1px solid #d4d9da;
			margin-bottom: 20px;
			.__title {
				padding: 10px 20px 10px 20px;
				border-bottom: 1px solid #d4d9da;
				background-color: #f2f2f2;
				.__left-icon {
					color: #828893;
				}
			}
			.__content {
				padding: 20px 20px 20px 20px;
				._sysytem-methods-wrapper {
					display: flex;
					align-items: flex-start;
					flex-wrap: wrap;
					.__item-wrapper {
						display: inline-block;
						text-align: center;
						margin: 20px 40px 0 0;
						min-width: 150px;
						max-width: 150px;
						.__card-wrapper {
							display:flex;
							justify-content:center;
							.__item-card {
								align-self: center;
								min-width: 130px;
								max-width: 130px;
								margin-bottom: 10px;
								padding: 7px 20px 8px 20px;
								border: 1px solid #efefef;
								border-radius: 5px;
								box-shadow:0px 0px  2px 1px #efefef;
								cursor: pointer;
								.__item-icon {
									font-size: 26px;
								}
							}
						}
						.__item-text {
							cursor: pointer;
						}
					}
				}
				.__toolkit-wrapper {
					position: relative;
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
					width: 100%;
					.__toolkit-item {
						width: 20%;
						min-width: 250px;
						height: 30px;
						line-height: 30px;
						margin-right: 10px;
						display: flex;
						flex-wrap: wrap;
						.__file-title {
							display: inline-block;
							max-width: 75%;
							margin-right: 5px;
							margin-left: 9px;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
						.__operate {
							cursor: pointer;
						}
					}
				}
				.__list-item {
					margin-bottom: 10px;
					padding-bottom: 10px;
					border-bottom: 1px solid #e5e5e5;
				}
			}
		}
	}
}
</style>


