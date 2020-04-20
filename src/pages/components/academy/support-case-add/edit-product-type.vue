<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="编辑产品类型"
		width="400" 
		@on-ok="handleOk"
		@on-cancel="handleOk"
	>
		<div class="g-m-b-10">请在相应的行业类型下面添加产品类型：</div>
		<div v-for="industry in productType" :key="industry.industry_id" class="g-flex">
			<div style="padding-top:4px">{{ industry.industry_name }}：</div>
			<div class="g-col">
				<oa-product-type 
					v-for="item in industry.product_type_list" 
					:key="item.product_type_id" 
					:data="item"
					@delete="handleDelete(industry.product_type_list,item)"
				/>
				<i v-if="showAdd" class="icon iconfont icon-add1 g-c-blue-mid g-pointer g-dp-ib" @click="handleAddType(industry)"/>
			</div>
		</div>

		
	</i-modal>
</template>
<script>
import { Modal, Input } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import ProductType from './product-type';

export default {
	name: "oa-academy-edit-product-type",
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'oa-product-type': ProductType
		
	},
	props: {
		data: Object // customer_id
	},
	data() {
		return {
			visible: false,
			productType: []
		};
	},
	computed: {
		showAdd() {
			return !this.productType.find(industry => {
				return industry.product_type_list.find(type => {
					return type.inEdit == true;
				});
			});


		}
	},
	created() {
		this.loadProductType();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		async handleOk() {
			const result = await this.waitSave();
			if (result) {
				this.visible = false;
				this.$emit('sure');
			} else {
				this.$refs.modal.buttonLoading = false;
			}
		},
		// async handleCancel() {

		// 	this.visible = false;
		// 	this.$emit('close');
		// },
		loadProductType() {
			this.$request({
				url: "_ACADEMY_SUPPORT_CASE_PRODUCT_TYPE_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				res.data.forEach(industry => {
					industry.product_type_list.forEach(i => {
						i.inEdit = false;
						i.industry_id = industry.industry_id;
					});

				});
				this.productType = res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		handleSave() {
			
		},
		handleDelete(list, item) {
			list.splice(list.indexOf(item), 1);
		},
		handleAddType(industry) {
			industry.product_type_list.push({ industry_id: industry.industry_id, product_type_name: "", product_type_id: 0, inEdit: true });

		},
		waitSave() {
			return 	new Promise(resolve => {
				if (!this.productType.find(industry => industry.product_type_list.find(it => it.inEdit))) {
					resolve(1);
				} else {
					let count = 0;
					const timer = setInterval(() => {
						count++;
						// 如果没有一个处于编辑中
						if (!this.productType.find(industry => industry.product_type_list.find(it => it.inEdit))) {
							clearInterval(timer);
							resolve(1);
						} else if (count >= 10) {
							clearInterval(timer);
							resolve(0);
						}

					}, 100);
				}
			});
		}
		
	}
};
export const EditProductType = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>