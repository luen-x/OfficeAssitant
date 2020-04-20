<template>
	<div 
		:key="data.collection_id" 
		class="g-pd-b-10 g-pd-t-10 v-collect-main-item" 
		style="width:100%;border-bottom: 1px solid rgb(235, 235, 235);"
		
	>
		<template v-if="data.status===0">
			<div >
				<span class="g-fs-16 g-pointer" style="font-weight:600" @click="handleDetail" v-html="info.title"/>
				<span v-if="data.type==1" class="_case-tag g-c-red-mid g-m-l-20">自定义案例</span>
				<span class="g-fr g-c-black7">
					<span class="g-m-l-40">{{ info.region }}</span>
					<span class="g-m-l-40">{{ info.industry_name }}</span>
					<span class="g-m-l-40">{{ info.customer_type_name }}</span>
					<span class="g-m-l-40">{{ info.product_type_name }}</span>
				</span>
			</div>
			<div v-if="data.source==1" class="g-flex g-m-t-20">
				<img 
					v-if="info.image" 
					:src="info.image+'!1-2'" 
					style="width:256px;height:144px" 
					class="g-m-r-20 g-pointer" 
					@click="handleDetail"
				>
				<div class="g-col">
					<div :style="info.image?'height:106px':''" class="_case-text g-pointer" @click="handleDetail" v-html="info.text"/>
					<div class="g-flex g-jc-sb g-pd-t-20" @click.stop >
						<div class="g-c-black7">
							<span>{{ info.staff_name }}</span>
							<span>{{ info.create_time }}</span>
						</div>
						<div>
							<span 
								v-if="info.attachment_list && info.attachment_list.length"
								class="g-operation g-m-r-40" 
								@click="handleDownload"
							>
								下载附件（ {{ info.attachment_list.length }} ）
							</span>
							<i-dropdown @on-click="invoke">
								<span class="g-operation" >
									更多<i class="iconfont icon-down g-fs-12"/>
								</span>
								<i-dropdown-menu slot="list">
									<i-dropdown-item v-if="data.status==0" name="handleChangeCategory">
										变更收藏夹
									</i-dropdown-item>
									<i-dropdown-item v-if="data.type==1" name="handleDelete">
										删除
									</i-dropdown-item>
									<i-dropdown-item v-else name="handleCancelCollect">
										取消收藏
									</i-dropdown-item>
									<i-dropdown-item name="handleEditCase">
										编辑案例
									</i-dropdown-item>
								</i-dropdown-menu>
							</i-dropdown>
						</div>

					</div>
				</div>
			</div>
			<div v-else-if="data.source==2" class="g-m-t-10">
				<!-- 图片视频类 -->
				<template v-if="info.type==1">
					<div class="g-pointer " @click="handleDetail" v-html="info.text"/>
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
				<!-- 文章类 -->
				<div v-else class="g-flex" @click="handleDetail" >
					<div v-if="info.image" class="g-m-r-10">
						<img :src="info.image+'!1-2'" class="g-pointer" style="width:256px;height:144px">
					</div>
					<div class="g-col" >
						<div style="height: 125px;" class="_case-text g-pointer" v-html="info.text"/>
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
						<span >共{{ (info.attachment_list || []).length }}个文件 </span>
						<span v-if="(info.attachment_list || []).length" class="g-operation g-m-l-30" @click="handleDownload" >一键下载</span>
						<span v-else class="g-operation-disable g-m-l-30" >一键下载</span>
						<i-dropdown @on-click="invoke">
							<span class="g-operation  g-m-l-30" >
								更多<i class="iconfont icon-down g-fs-12"/>
							</span>
							<i-dropdown-menu slot="list">
								<i-dropdown-item name="handleChangeCategory">
									变更收藏夹
								</i-dropdown-item>
								<i-dropdown-item name="handleCancelCollect">
									取消收藏
								</i-dropdown-item>
							</i-dropdown-menu>
						</i-dropdown>
					</span>
				</div>
			</div>
		</template>
		<div v-else class="g-tc">
			<span v-if="data.status==1">由于上传人员设置，该案例你已经没有权限查看了</span>
			<span v-else-if="data.status==2">管理人员删除了这个案例，你已经无法查看</span>
			<span class="g-operation" @click="handleDeleteDirectly(data.collection_id)">点击从我的收藏中移除</span>
		</div>
	</div>
</template>

<script>
import downloadFile from '@utils/download';
import { Dropdown, DropdownMenu, DropdownItem } from 'iview';
import Upload from '@common/upload/upload';
import { Expand } from 'wya-vc';
import { ChangeCategory } from '../_common/modals/change-category';
import { Confirm } from '../../_common/confirm/confirm.vue';


export default {
	name: "oa-item",
	components: {
		'i-dropdown': Dropdown,
		"i-dropdown-menu": DropdownMenu, 
		"i-dropdown-item": DropdownItem,
		'oa-upload': Upload,
		'vc-expand': Expand

	},
	props: {
		data: Object,
		
	},
	data() {
		return {
			open: false
		};

	},
	computed: {
		info() {
			return (this.data && this.data.item) || { attachment_list: [] };
		},
		showFiles() {
			return this.info.attachment_list.filter((i, index) => index < 6);

		},
		hideFiles() {
			return this.info.attachment_list.filter((i, index) => index >= 6);
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
				msg: "确认删除案例吗？",

			}).then(() => {
				this.delete(this.data.collection_id);
			});

		},
		handleCancelCollect() {
			Confirm.popup({
				msg: "确认取消收藏吗？",

			}).then(() => {
				this.delete(this.data.collection_id);
			});
		},
		delete(id) {
			this.$request({
				url: "_COLLECT_MAIN_COLLECT_DEL_POST",
				type: "GET",
				param: {
					collection_id: id
				},
				loading: false,
			}).then(res => {
				this.$emit('category-change');
				this.handleResetCur();
			
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		handleEditCase() {
			const query = this.data.type == 0 // 是否为自定义 type==1是自定义
				? { 
					old_case_id: this.data.item.case_id,
					collection_id: this.data.collection_id, 
				} 
				: { case_id: this.data.item.case_id };
			this.$router.push({
				path: '/collect/main/case/edit',
				query: {
					...query,
					action: 'update',
					mode: 'collect'
				}
			});

		},
		handleDetail() {
			if (this.data.status !== 0) return;
			if (this.data.source == 1) {
				this.$router.push({
					path: '/collect/main/case/detail',
					query: {
						case_id: this.data.item.case_id,
						is_self: this.data.type == 1 ? 1 : ""
					}
				});
			} else if (this.data.source == 2) {
				if (this.info.type == 2) {
					this.$router.push({
						path: '/collect/main/case/detail',
						query: {
							circle_id: this.data.item.circle_id
						}
					});
				}
			}
		},
		handleResetFirst() {
			this.$store.commit('COLLECT_MAIN_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('COLLECT_MAIN_LIST_RESET', { type: this.type });
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
.v-collect-main-item {
	._case-text {
		-webkit-line-clamp: 6;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		color:#333;
		line-height: 18px;
		word-break: break-all;
	}
	._case-tag {
			background: rgba(220,75,86,0.1);
			border-radius:3px;
			font-size: 12px;
			padding:4px 8px;
			// line-height: 18px;
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
