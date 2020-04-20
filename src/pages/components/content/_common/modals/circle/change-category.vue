<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false"
		:title="'变更类目'"
		class="v-content-modal-change-category"
		width="400" 
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>	
		<div class="g-pd-l-20">
			<div class="g-m-b-10 g-flex g-jc-sb">
				请选择类目进行变更
				<span class="g-operation g-m-r-20" @click="hanldleAddCategory">创建类目</span>
				<!-- // <i-button type="primary" @click="hanldleAddCategory"> 创建收藏夹</i-button> -->
			</div>
			<div v-for="(item,index) in categoryList" :key="index" class="g-pd-10 g-flex g-m-b-10" style="background:#F0F0F0;width:330px">
				<div class="g-col">
					<div class="g-online">{{ item.category_name }}</div>
					<div>{{ item.material_num }}条内容</div>
				</div>
				<div :class="{_active:item.category_id === curCategoryId}" class="_collect-btn g-m-l-10" @click="handleChange(item.category_id)">
					{{ item.category_id === curCategoryId?'已选择':'选择' }}

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
	name: "oa-content-modal-change-category",
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
		circleId: Number,
		categoryId: Number
		

	},
	data() {
		return {
			visible: false,
			curCategoryId: this.categoryId,
			categoryList: [],
			changed: false,
		
		};
	},
	computed: {
		title() {
			return this.modeConfig[this.mode] && this.modeConfig[this.mode].title;
		}

	},
	created() {
		this.loadCircleCategory();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure', { changed: this.changed, category_id: this.curCategoryId });
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close', { changed: this.changed, category_id: this.curCategoryId });
		},
		loadCircleCategory() {
			this.$request({
				url: "_CONTENT_CIRCLE_CATEGORY_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				// res.data.list.unshift({ category_name: "所有收藏", count: res.data.total, category_id: 0 });
				this.categoryList = res.data.category_list;
			}).catch((res) => {
				this.$Message.error(res.msg);
			}).finally(() => {
				this.loading = false;
			});
		},
		handleChange(categoryId) {
			if (categoryId == this.curCategoryId) return;
			
			this.$request({
				url: '_CONTENT_CIRCLE_CATEGORY_CHANGE_POST',
				type: "POST",
				param: {
					category_id: categoryId,
					circle_id: this.circleId
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);
				this.curCategoryId = categoryId;
				this.changed = true;
				this.loadCircleCategory();
			
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		hanldleAddCategory() {
			AddCategory.popup({
				sort: this.categoryList.length
			}).then(() => {
				this.loadCircleCategory();
				this.changed = true;
			});
		},
		
	}
};
export const ChangeCategory = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-content-modal-change-category {
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