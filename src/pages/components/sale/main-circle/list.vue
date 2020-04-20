<template>
	<div class="g-flex v-main-circle-list">
		<div class="_category g-m-r-20" style="height:fit-content">
			<div 
				v-for="(cat,index) in categoryList" 
				:key="cat.category_id"
				:class="{'__active':cat.category_id==curCategory}"
				class="__category-item g-flex g-ai-c"
				@click="handleClickCategory(cat)"
			>
				<i v-if="index!==0" class="icon iconfont icon-dot g-c-red-mid g-m-r-10"/>
				<span :class="{'g-fs-14':index===0}" class="g-m-r-10 g-col">{{ cat.category_name }}</span>
				<span>{{ cat.material_num }}</span>
			</div>
			<!-- <div class="__category-item g-operation" style="border-bottom: none;" @click="handleEditCategory">
				<i 
					class="icon iconfont icon-edit1 g-fs-14 g-pointer g-c-blue-mid" 
				/>
				编辑类目
			</div> -->
		</div>
		<div class="g-col" style="margin-top: -12px;">
			<div v-if="!listInfo.data ||!listInfo.data[curPage] || !listInfo.data[curPage].length" class="g-tc" style="margin-top: 60px;">
				<img :src="OSS_NO_MESSAGE02" style="width:180px" >
				<div>暂无数据</div>
			</div>
			<vc-paging
				ref="tableTarget"
				:data-source="listInfo.data" 
				:total="listInfo.total"
				:reset="listInfo.reset"
				:history="true"
				:load-data="loadData"
				mode="piece"
				class="g-m-r-20 "
				@page-size-change="handleChangePageSize"
				@page-change="handlePageChange"
			>
				<oa-item 
					slot-scope="it"
					:data="it"
					can-collect
					class="_item"
					@category-change="handleResetCur"
				/> 
			</vc-paging>
		</div>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl, goBack } from '@utils/utils';
import { getPlainText, getImgUrl, getHeighLightHtml } from '@components/sale/_common/util'; 
import { OSS_NO_MESSAGE02 } from '@constants/constants';

// item
import Item from './item';
 
export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'oa-item': Item,
	},
	data() {
		const { query } = this.$route;

		return {
			OSS_NO_MESSAGE02,
			curPage: query.page || 1,
			categoryList: [
				// { category_name: "所有收藏", count: 0, category_id: '' }
			],
			curCategory: query.category_id || '',
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleMainCircle.listInfo;
		}
	},
	created() {
		// this.loadCircleCategory();

	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_MAIN_CIRCLE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_MAIN_CIRCLE_LIST_RESET', { type: this.type });
		},
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_MAIN_CIRCLE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
				initList: (list) => {
					list.forEach(i => {
						if (i.type == 2) {
							i.text = getPlainText(i.content);							
							if (i.image == '-') i.image = '';
							if (!i.image) {
								const urls = getImgUrl(i.content);
								urls && urls[0] && (i.image = urls[0]);	
							}
						} else {
							i.text = i.content;
						}
						if (query.keyword) {
							i.title = getHeighLightHtml(i.title, query.keyword);
							i.text = getHeighLightHtml(i.text, query.keyword);
						}
						
					});
					return list;

				}
			}).then((res) => {
				res.data.category_list.unshift({ category_name: "所有素材", material_num: res.data.total_count, category_id: '' });
				this.categoryList = res.data.category_list;

				
			}).catch(console.error);
		},
		handleChangePageSize() {
			this.$store.commit('SALE_MAIN_CIRCLE_LIST_INIT');
		},
		// loadCircleCategory() {
		// 	this.$request({
		// 		url: "_CONTENT_CIRCLE_CATEGORY_GET",
		// 		type: "GET",
		// 		param: {},
		// 		loading: false,
		// 	}).then(res => {
		// 		res.data.category_list.unshift({ category_name: "所有素材", material_num: res.data.all_material_num, category_id: '' });
		// 		this.categoryList = res.data.category_list;
		// 	}).catch((res) => {
		// 		this.$Message.error(res.msg);
		// 	});
		// },
		handleClickCategory(cat) {
			if (this.curCategory == cat.category_id) return;
			this.curCategory = cat.category_id;
			this.$router.replace({
				path: '/sale/main/circle',
				query: {
					...this.$route.query,
					category_id: this.curCategory
				}
			});
			this.$store.commit('SALE_MAIN_CIRCLE_LIST_INIT');
		},
		handleEditCategory() {
			EditCategory.popup().then(() => {
				this.handleResetCur();
				// this.loadCircleCategory();
			});

		},
		handlePageChange(page) {
			this.curPage = page;
		}
	}
};

</script>

<style lang="scss">
.v-main-circle-list {
	// display: flex;
	// flex-wrap: wrap;
	._category {
		border:1px solid #EBEBEB;
		width:160px;
		.__category-item {
			background:white;
			border-bottom: 1px solid #EBEBEB;
			padding: 10px 20px;
			&:hover{
				color: #2296f9;
			}
			cursor: pointer;
			.icon-dot {
				font-size: 12px;
				transform: scale(0.6);
				display: inline-block;
			}
			&.__active {
				background: #F6F6F6;
			}
		}

	}
	
	margin: 20px 0;
}

</style>
