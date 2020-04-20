<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		class="v-add-element"
		title="添加产品"
		width="680"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div style="height:320px" @keyup.enter="handleSearch">
			<div class="g-flex">
				<i-select
					v-model="type"
					style="width:220px"
					clearable
					placeholder="请选择制作板块"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item,i) in componentsType"
						:key="i"
						:value="item.category_id"
					>{{ item.category_name }}</i-option>
				</i-select>
				<i-input v-model="keyword" style="width:220px" class="g-m-l-10" placeholder="请输入产品名称"/>
				<vc-debounce-click
					:tag="Button"
					type="primary"
					class="g-m-l-10"
					@click="handleSearch"
					@on-enter="handleSearch"
				>搜索</vc-debounce-click>
			</div>
			<div v-if="list[page]&&list[page].length" class="g-m-t-20">
				<i-checkbox-group v-model="selectList" class="g-flex g-fw-w">
					<div
						v-for="(item) in list[page]"
						:key="item.product_id"
						:class="getItemClass(item.product_id)"
						class="_element"
						@click="handleChecked(item.product_id)">
						<div class="g-flex g-jc-sb">
							<div class="g-fs-12 __name g-c-black3">{{ item.product_name }}</div>
							<div class>
								<i-checkbox :label="item.product_id"/>
							</div>
						</div>
						<div v-if="item.product_describe" class="g-fs-12">{{
							item.product_describe.length>20
						?item.product_describe.substring(0,18)+'...': item.product_describe }}</div>
					</div>
				</i-checkbox-group>
			</div>
			<div v-else style="height:276px;" class="g-flex-cc g-flex-ac">
				<div>暂无合适的搜索结果，换个关键词试试吧~</div>
			</div>
		</div>
		<div class="g-m-t-5">
			<i-page
				:total="total"
				:current="page"
				:page-size="12"
				class="g-fr"
				show-elevator
				@on-change="handleChangePage"
			/>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber, Checkbox, Select, Option, Page, CheckboxGroup } from 'iview';
import { CreatePortal } from 'wya-vc';
import API from '@stores/apis/root';

export default {
	name: "add-ele",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-checkbox": Checkbox,
		"i-select": Select,
		"i-option": Option,
		"i-page": Page,
		"i-checkbox-group": CheckboxGroup
	},
	props: {
		data: Object, // {selectedList}
	},
	data() {

		return {
			visible: false,
			formItem: {},
			componentsType: [],
			selectList: [...this.data.selectList], // checkbox选择的元素
			list: Array.from({ length: 20 }, () => ([])),			 // 请求到的数据 // 所有产品
			type: '', // 类型
			elementList: [], // 存放选择的元件详情
			total: null, // 总页数
			label: '',
			page: null, // 当前页
			keyword: "", // 搜索关键字
			dataList: []
		};
	},

	watch: {
		selectList(val) {
			this.elementList = [];
			this.selectList.forEach(item => {
				this.list.forEach(element => {
					if (item == element.product_id) {
						this.elementList.push(element);
					}
				});
			});
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.loadProductList(1);
		this.$request({
			url: API._CONTENT_PRODUCT_CATEGORY_GET,
			type: "GET",
			loading: false,
			param: {
			}
		})
			.then((res) => {
				this.componentsType = res.data;
			})
			.catch((err) => {
			});
	},
	mounted() {
		this.getdate();
		this.visible = true;
	},
	methods: {
		handleChecked(i) {
			const v = this.selectList.findIndex(it => it == i);
			if (v == -1) {
				this.selectList.push(i);
			} else {
				this.selectList.splice(v, 1);
			}
		},
		handleChangePage(page) {
			this.page = page;
			 if (!this.list[page].length) {
				this.loadProductList(+page);
			}

		},
		loadProductList(page = 1) {
			this.$request({
				url: API._CONTENT_PRODUCT_GROUP_ELE_GET,
				type: "GET",
				loading: false,
				param: {
					product_name: this.keyword,
					category_id: this.type,
					page,
				}
			}).then((res) => {
				const _list = res.data.list.map(item => {
					const exist = this.data.selectProductList.find(it => {
						return it.product_id == item.product_id;
					});
					if (exist) {
						return exist;
					} else {
						return { ...item, inputShow: false };
					}
				});
				this.list.splice(page, 1, _list);
				this.total = res.data.totalCount;
				this.page = res.data.currentPage;

			}).catch((err) => {
				console.error(err);
			});
		},
		getItemClass(id) {
			if (this.selectList.find(item => {
				return item == id;
			})) {
				return '_active';
			} else {
				return '';
			}
		},
		getdate() {
			this.$request({
				url: API._CONTENT_PRODUCT_GROUP_ELE_GET,
				type: "GET",
				loading: false,
				param: {
					get_num: 1
				}
			})
				.then((res) => {
					this.dataList = res.data;
				})
				.catch((err) => {
					console.error(err);
				});
		},
		handleSave() {
			this.visible = false;
		},
		handleNull() {
			this.visible = false;
		},
		handleOk() {
			let allProduct = [...this.data.selectProductList];
			this.list.forEach(_list => {
				allProduct = allProduct.concat(_list);

			});
			const selectedList = this.selectList.map(id => {
				const result = { ...allProduct.find(item => item.product_id == id) };
				if (result.has_sku == '0') {
					if (!this.data.selectList.find(_id => result.product_id == _id)) {
						result.price = parseFloat(result.combine_sku[0].price);
						result.cost = parseFloat(result.combine_sku[0].cost);
						result.cost_type = result.combine_sku[0].cost_type;
						result.price_unit = result.combine_sku[0].price_unit;
						result.sku_id = '0';
					}
				} else if (!this.data.selectList.find(_id => result.product_id == _id)) {
					result.combine_sku = result.combine_sku.slice(0, 1);
				}
				return result;
			});
			let attachMents = [];
			 selectedList.forEach(product => {
				 attachMents = attachMents.concat(product.attachment);
			 });
			this.$emit('sure', { selectList: selectedList, attachMents });
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleSearch() {
			this.pageSize = 1;
			this.loadProductList();
		}

	}
};
export const AddElement = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
    .v-add-element {
        ._element {
            width: 150px;
            height: 80px;
            border: 1px solid #ebeef1;
            border-radius: 4px;
            padding: 10px;
            margin-right: 12px;
            margin-bottom: 12px;
			cursor: pointer;
            .__name {
                height: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .ivu-checkbox-wrapper {
                margin: 0;
            }
            .__describe {
                color: #d4d7d8;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
		._active {
            border: 1px solid #e74854;
            box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
        }
        .ivu-checkbox-wrapper {
            span:last-child {
                display: none !important;
            }
        }
		.ivu-modal-footer{
			padding-top: 23px !important;
		}
    }
</style>
