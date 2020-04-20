<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false"
		:title="title"
		class="v-collect-modal-change-category"
		width="400" 
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>	
		<div class="g-pd-l-20">
			<div class="g-m-b-10 g-flex g-jc-sb">
				请选择收藏夹
				<span class="g-operation g-m-r-20" @click="hanldleAddCategory">创建收藏夹</span>
				<!-- // <i-button type="primary" @click="hanldleAddCategory"> 创建收藏夹</i-button> -->
			</div>
			<div v-for="(item,index) in categoryList" :key="index" class="g-pd-10 g-flex g-m-b-10" style="background:#F0F0F0;width:330px">
				<div class="g-col">
					<div class="g-online">{{ item.category_name }}</div>
					<div>{{ item.count }}条内容</div>
				</div>
				<div :class="{_active:item.category_id === curCategoryId}" class="_collect-btn g-m-l-10" @click="hanldleAddCollect(item.category_id)">
					{{ item.category_id === curCategoryId?'已收藏':'收藏' }}

				</div>
			
			</div>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm';
import { AddCategory } from './add-category';

export default {
	name: "oa-collect-modal-change-category",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		// 添加收藏
		sourceId: Number, // 源文件id
		sourceType: Number, // "source": 1,//1 客户案例 2发圈文案
		// 变更类目
		categoryId: Number,
		collectionId: Number, 
		mode: {
			type: String,
			default: 'changeCategory' // changeCategory , addCollect
		}
		

	},
	data() {
		return {
			visible: false,
			curCategoryId: this.categoryId,
			curCollectionId: this.collectionId,
			categoryList: [],
			changed: false,
			modeConfig: {
				changeCategory: {
					title: '变更收藏夹',
				},
				addCollect: {
					title: "添加收藏"
				}
			}
		};
	},
	computed: {
		title() {
			return this.modeConfig[this.mode] && this.modeConfig[this.mode].title;
		}

	},
	created() {
		this.loadCollectCategory();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure', { changed: this.changed, category_id: this.curCategoryId, collection_id: this.curCollectionId });
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close', { changed: this.changed, category_id: this.curCategoryId, collection_id: this.curCollectionId });
		},
		loadCollectCategory() {
			this.$request({
				url: "_COLLECT_MAIN_COLLECT_CATEGORY_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				res.data.list.unshift({ category_name: "所有收藏", count: res.data.total, category_id: 0 });
				this.categoryList = res.data.list;
			}).catch((res) => {
				this.$Message.error(res.msg);
			}).finally(() => {
				this.loading = false;
			});
		},
		handleChange(categoryId) {
			if (categoryId == this.curCategoryId) return;
			// this.$refs.form.validate(valid => {
			// 	if (valid) {
			this.$request({
				url: '_COLLECT_MAIN_COLLECT_CHANGE_CATEGORY_POST',
				type: "POST",
				param: {
					category_id: categoryId,
					collection_id: this.curCollectionId
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);
				this.curCategoryId = categoryId;
				this.changed = true;
				this.loadCollectCategory();
				// this.visible = false;
				// this.$emit('sure');
			}).catch((res) => {
				this.$Message.error(res.msg);
				this.$refs.modal.buttonLoading = false;
			});
			// 	} else {
			// 		this.$refs.modal.buttonLoading = false;
			// 	}
			// });
		},
		hanldleAddCategory() {
			AddCategory.popup({
				sort: this.categoryList.length
			}).then(() => {
				this.loadCollectCategory();
			});
		},
		// 添加收藏
		hanldleAddCollect(categoryId) {
			if (this.curCategoryId || this.curCategoryId === 0) { // 如果已经有类目了，则走更换类目逻辑
				this.handleChange(categoryId);
			} else {
				this.$request({
					url: "_COLLECT_MAIN_COLLECT_ADD_COLLECT_POST",
					type: "POST",
					param: { source_id: this.sourceId, source: this.sourceType, category_id: categoryId },
					loading: false,
				}).then(res => {
					this.curCategoryId = categoryId;
					this.curCollectionId = res.data.collection_id;
					this.changed = true;
					this.loadCollectCategory();
					this.$Message.success(res.msg);
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}
			
		}
	}
};
export const ChangeCategory = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-collect-modal-change-category {
	._collect-btn {
		text-align: center;
		width:60px;
		height:32px;
		cursor: pointer;
		background:#E74854;
		border-radius:4px;
		color: white;
		padding-top: 8px;
		&._active {
			background:rgba(202,202,202,1);

		}
	}

}
</style>