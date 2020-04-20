<template>
	<div v-show="showitem" class="g-fw-w v-content-search-result">
		<div class="_tip g-m-b-10" v-html="listInfo.result_str_top" />
		<oa-no-data v-if="!listInfo.data[1].length" />
		<div v-else class="_wrapper">
			<div class="__content-wrapper">
				<div class="__left-wrapper">
					<vc-paging
						:data-source="listInfo.data"
						:columns="serviceTitle" 
						:total="listInfo.total"
						:reset="listInfo.reset"
						:page-opts="commonPage"
						:table-opts="commonTable"
						:history="true"
						:load-data="loadData"
						:show="show"
						mode="piece"
					>
						<div slot-scope="it">
							<div class="__item-wrapper" @click="handleDetail(it)">
								<img v-if="it.pic_url" :src="it.pic_url" class="__img">
								<div class="__item">
									<div class="__top">
										<span v-html="it.title" />
									</div>
									<div class="__bottom">
										<div class="__bottom-e">
											<span v-html="it.staff_name" />
										</div>
										<div class="__bottom-t">
											<span v-html="it.create_time" />
										</div>
										<div class="__bottom-e">
											<i class="iconfont icon-lianjie g-f-s-12"/>
											<span v-html="it.attach_count" />
										</div>
										<div class="__bottom-e">
											<i class="iconfont icon-download g-f-s-12"/>
											<span v-html="it.download_number" />
										</div>
										<div class="__bottom-e">
											<i class="iconfont icon-preview g-f-s-12"/>
											<span v-html="it.browse_number" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</vc-paging>
				</div>
				<div class="__right-wrapper">
					<div class="__title">
						<span class="__left" />
						<span class="__right">相关素材</span>
					</div>
					<div class="__right-list">
						<div v-if="list.length == 0" class="g-tc">
							<span>暂无相关素材</span>
						</div>
						<div v-else>
							<div 
								v-for="(item, index) in list" 
								:key="index" 
								class="__example " 
								@click="handleDetail(item)"
							>
								<span v-html="item.title" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { Row, Col, Message } from 'iview';
import API_ROOT from '@stores/apis/root';
import item from './item';
import noData from './no-data';

export default {
	name: 'content-detail-tabs-consult',
	components: {
		'oa-no-data': noData,
		'vc-paging': Paging,
		'i-row': Row,
		'i-col': Col,
	},
	mixins: [item],
	props: {
		showitem: Boolean,
		loadData: Function
	},
	data() {
		return {
			infoEdit: true,
			contractList: [
				{
					id: 1
				},
				{
					id: 2
				}
			]
		};
	},
	computed: {
		list() {
			return Array.isArray(this.$store.state.contentSearch.data) ? this.$store.state.contentSearch.data : [];
		},
		listInfo() {
			return this.$store.state.contentSearchResult.listInfo[8];
		},
		keyword() {
			const { query = {} } = this.$route;
			return String(query.keyword || '');
		}
	},
	created() {
		
	},
	methods: {
		handleChangePageSize() {
			this.$store.commit('CONTENT_SEARCH_RESULT_CONSULT_LIST_INIT');
		},
		handleDetail(e) {
			this.$router.push({
				path: '/content/preview',
				query: {
					material_id: e.material_id,
					material_type: '1',
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
		.__content-wrapper {
			width: 75%;
			display: flex;
			.__left-wrapper {
				flex: 1;
				min-width: 600px;
				margin-right: 10px;
				.__item-wrapper {
					display: flex;
					// margin: 20px 0 20px 0;
					padding-top: 20px;
					padding-bottom: 10px;
					border-bottom: 1px solid #efefef;
					cursor: pointer;
					.__img {
						float: right;
						height: 90px;
						min-width: 155px;
						max-width: 155px;
						margin-right: 10px;
					}
					.__item {
						flex: 1;
						position: relative;
						.__top {
							color: #000;
							font-size: 15px;
							margin-bottom: 30px;
							padding-right: 20%;
							-webkit-line-clamp: 2;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
						}
						.__bottom {
							color: #828994;
							position: absolute;
							bottom: 0;
							.__bottom-e {
								display: inline-block;
								// width: 15%;
								margin-right: 20px;
							}
							.__bottom-t {
								display: inline-block;
								// width: 140px;
								margin-right: 20px;
							}
						}
					}
				}
			}
			.__right-wrapper {
				float: right;
				min-width: 300px;
				height: 680px;
				background: #f5f5f6;
				.__title {
					margin: 20px 20px 10px 20px;
					.__left {
						background: #e84854;
						width: 2px;
						height: 14px;
						display: inline-block;
						margin-right: 10px;
					}
					.__right {
						color: #4b4f54;
						font-size: 14px;
					}
				}
				.__right-list {
					margin: 10px 15px 0 15px;
					padding: 20px 10px 30px 10px;
					background-color: #fff;
					border:1px solid #efefef;
					border-radius: 3px;
					box-shadow:0px 0px  2px 1px #efefef;
					.__example {
						border-bottom: 1px solid #efefef;
						padding-bottom: 8px;
						margin-top: 5px;
						cursor: pointer;
						&:hover {
							color: #2397f9
						}
					}
				}
			}
		}
	}
}
</style>


