<template>
	<div 
		:key="data.collection_id" 
		class="g-pd-b-10 g-pd-t-10 v-content-circle-item" 
		style="width:100%;border-bottom: 1px solid rgb(235, 235, 235);"
		@click="handleDetail"
	>
		<div >
			<span class="g-fs-16" style="font-weight:600" v-html="info.title"/>
			<span class="g-fr g-c-black7" @click.stop>
				<span class="g-m-l-40">{{ info.staff_name }}</span>
				<span class="g-m-l-40">{{ info.create_time }}</span>
				<i-dropdown v-if="$auth[1763] || $auth[1756] || $auth[1764]" @on-click="invoke">
					<span class="g-operation-hover g-m-l-40" >
						<i class="iconfont icon-more1 g-fs-14"/>
					</span>
					<i-dropdown-menu slot="list">
						<i-dropdown-item v-if="$auth[1763]" name="handleEdit">
							编辑
						</i-dropdown-item>
						<i-dropdown-item v-if="$auth[1756]" name="handleDelete">
							删除
						</i-dropdown-item>
						<i-dropdown-item v-if="$auth[1764]" name="handleChangeCategory">
							变更类目
						</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
			</span>
		</div>
		<div class="g-m-t-10">
			<template v-if="info.type==1">
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
				<span v-if="info.type==1 && hideFiles.length" class="g-operation" style="padding-left:400px" @click="open=!open">
					{{ open?'收起':'展开' }}
					<i 
						:style="{transform:open?'':'rotate(180deg)',position:'relative'}" 
						class="icon iconfont icon-pack-up g-dp-ib g-fs-12 g-m-l-5"
					/>
				</span>
				<span class="g-fr " >
					<span >共{{ attachmentList.length }} 个文件 </span>
					<!-- <span v-if="info.attachment_list.length" class="g-operation g-m-l-30" @click="handleDownload" >一键下载</span>
					<span v-else class="g-operation-disable g-m-l-30">一键下载</span> -->
					
					<span v-if="canCollect" class="g-operation g-m-l-30" @click="handleCollect">{{ info.collection_id?'取消收藏':"收藏" }}</span>
				</span>
			</div>
		</div>
		
	</div>
</template>

<script>
import downloadFile from '@utils/download';
import { Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import { Confirm } from '@common/confirm/confirm.vue';
import Upload from '@common/upload/upload';
import EditorPreview from '@common/editor-preview/editor-preview';
import { ChangeCategory } from '../_common/modals/circle/change-category';

export default {
	name: "oa-item",
	components: {
		'i-dropdown': Dropdown,
		"i-dropdown-menu": DropdownMenu, 
		"i-dropdown-item": DropdownItem,
		'oa-upload': Upload,
		'oa-editor-preview': EditorPreview,
		'vc-expand': Expand
	},
	props: {
		data: Object,
		canCollect: Boolean,
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
				categoryId: this.data.category_id,
				circleId: this.data.circle_id
			}).then(({ changed }) => {
				if (changed) {
					this.$emit('category-change');
				}
			}).catch(({ changed }) => {
				if (changed) {
					this.$emit('category-change');
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
		handleCollect() {

		},
		delete(id) {
			this.$request({
				url: "_CONTENT_CIRCLE_DELETE_POST",
				type: "POST",
				param: {
					circle_ids: [id]
				},
				loading: false,
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit('delete');
			
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
					path: '/content/circle/list/detail',
					query: {
						circle_id: this.data.circle_id
					}
				});
			}
		},
		handleDownload() {
			this.attachmentList.forEach(i => {
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
.v-content-circle-item {
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
