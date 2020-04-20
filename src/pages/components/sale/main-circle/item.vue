<template>
	<div 
		:key="data.collection_id" 
		class="g-pd-b-10 g-pd-t-10 v-sale-main-circle-item" 
		style="width:100%;border-bottom: 1px solid rgb(235, 235, 235);"
		@click="handleDetail"
	>
	
		<div>
			<span class="g-fs-16" style="font-weight:600" v-html="info.title"/>
			<span class="g-fr g-c-black7" @click.stop>
				<span class="g-m-l-40">{{ info.staff_name }}</span>
				<span class="g-m-l-40">{{ info.create_time }}</span>
			</span>
		</div>
		<div class="g-m-t-10">
			<template v-if="info.type==1" >
				<div v-html="info.text"/>
				<div class="g-m-t-10">
					<oa-upload
						v-model="showFiles"
						:max="20"
						:show-title="false"
						style="width: 800px"
						placeholder=""
						disabled
					/>
				</div>
				<vc-expand v-if="hideFiles.length" ref="expand" v-model="open">
					<oa-upload
						v-model="hideFiles"
						:max="20"
						:show-title="false"
						style="width: 800px"
						placeholder=""
						disabled
					/>
				</vc-expand>
			</template>
			<div v-else class="g-flex" >
				<div v-if="info.image" class="g-m-r-10">
					<img :src="info.image+'!1-2'" style="width:256px;height:144px">
				</div>
				<div class="g-col" >
					<div style="height: 125px;" class="_case-text" v-html="info.text"/>
				</div>
			</div>
			<div style="height:18px" @click.stop>
				<span v-if="info.type==1 && hideFiles.length " class="g-operation" style="padding-left:400px" @click="open=!open">
					{{ open?'收起':'展开' }}
					<i 
						:style="{transform:open?'':'rotate(180deg)',position:'relative'}" 
						class="icon iconfont icon-pack-up g-dp-ib g-fs-12 g-m-l-5"
					/>
				</span>
				<span class="g-fr ">
					<span >共{{ attachmentList.length }}个文件 </span>
					<span v-if="attachmentList.length" class="g-operation g-m-l-30" @click="handleDownload" >一键下载</span>
					<span v-else class="g-operation-disable g-m-l-30" >一键下载</span>
					<oa-satr 
						v-if="canCollect && $auth[1765]" 
						:collection-id="info.collection_id" 
						:source-type="2" 
						:source-id="info.circle_id" 
						@change="handleStarChange"
					>
						<span class="g-operation g-m-l-30">{{ info.collection_id?'已收藏':"收藏" }}</span>
					</oa-satr>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import downloadFile from '@utils/download';
import { Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
// import { ChangeCategory } from '../_common/modals/change-category';
import { Confirm } from '@common/confirm/confirm.vue';
import Upload from '@common/upload/upload';
import EditorPreview from '@common/editor-preview/editor-preview';
import Star from '@components/collect/_common/comp/star';


export default {
	name: "oa-item",
	components: {
		'i-dropdown': Dropdown,
		"i-dropdown-menu": DropdownMenu, 
		"i-dropdown-item": DropdownItem,
		'oa-upload': Upload,
		'oa-editor-preview': EditorPreview,
		'oa-satr': Star,
		'vc-expand': Expand



	},
	props: {
		data: Object,
		canCollect: Boolean
		
	},
	data() {
		return {
			open: false
		};
		

	},
	computed: {
		info() {
			return this.data || { attachment_list: [] };
		},
		attachmentList() {
			return this.info.attachment_list || [];
		},
		showFiles() {
			return this.attachmentList.filter((i, index) => index < 6);

		},
		hideFiles() {
			return this.attachmentList.filter((i, index) => index >= 6);
		}

	},
	methods: {
		invoke(name) {
			this[name]();
		},
		handleChangeCategory() {
			ChangeCategory.popup({
				title: '变更收藏夹',
				// sourceId: this.data.source_id,
				// sourceType: this.data.type,
				categoryId: this.data.category_id,
				collectionId: this.data.collection_id

			}).then(({ changed }) => {
				if (changed) {
					this.$emit('category-change');
					this.handleResetCur();
				}
			}).catch(({ changed }) => {
				if (changed) {
					this.$emit('category-change');
					this.handleResetCur();
				}
			});
		},
		handleDelete() {
			Confirm.popup({
				msg: "确认删除该素材吗吗？",

			}).then(() => {
				this.delete(this.data.circle_id);
			});

		},
		handleCancelCollect() {
			Confirm.popup({
				msg: "确认取消收藏吗？",

			}).then(() => {
				this.delete(this.data.collection_id);
			});
		},
		handleStarChange(res) {
			this.data.collection_id = res.collection_id;
			this.$forceUpdate();


		},
		delete(id) {
			this.$request({
				url: "_CONTENT_CIRCLE_DELETE_POST",
				type: "POST",
				param: {
					circle_id: id
				},
				loading: false,
			}).then(res => {
				this.$emit('category-change');
				this.handleResetCur();
			
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		handleEdit() {
		
			this.$router.push({
				path: '/content/circle/list/add',
				query: {
					circle_id: this.info.circle_id,
					action: 'update',
				}
			});

		},
		handleDetail() {
			if (this.data.type == 2) {
				this.$router.push({
					path: '/sale/main/circle/detail',
					query: {
						circle_id: this.data.circle_id
					}
				});
			}

		},
		handleResetFirst() {
			this.$store.commit('SALE_MAIN_CIRCLE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_MAIN_CIRCLE_LIST_RESET', { type: this.type });
		},
		handleDownload() {
			this.info.attachment_list.forEach(i => {
				downloadFile({
					fileName: i
				});
				
			});

		},
		handleDeleteDirectly(collectionId) {
			this.delete(collectionId);

		}
	}
};
</script>
<style lang="scss">
.v-sale-main-circle-item {
	._case-text {
		-webkit-line-clamp: 7;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		color:#333;
		line-height: 18px;

	}
	.c-upload {
		._item {
			width: 120px;
			.__thumbnail {
				width: 120px;
				height: 120px;
			}

		}
		.__mask {
			i {
				font-size: 25px
			}
		}
		
	}

}
</style>
