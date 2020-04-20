<template>
	<div class="v-product-newgroup g-flex-cc">
		<div class="_content">
			<i-form ref="from" :model="formData" :rules="ruleValidate" :label-width="100">
				<i-form-item class="g-m-t-40" label="组合名称:" prop="product_name">
					<i-input
						v-model="formData.product_name "
						:maxlength="30"
						style="width:750px; margin-top: 5px"
						placeholder="输入组合名称"
					/>
				</i-form-item>
				<i-form-item class="g-m-t-20" label="组合介绍:">
					<oa-limit-words
						v-model="formData.product_describe"
						:max="200"
						placeholder="输入组合流程名称"
						style="width:750px"
					/>
				</i-form-item>
				<i-form-item label="选择产品:">
					<template slot="label">
						<span class="_requrie"/>包含产品：
					</template>
					<div>
						<div class="g-operation" @click="handleAddElement">
							<i class="iconfont icon-add1"/>
							<span>添加产品</span>
						</div>

						<div class="_step">
							<div class="g-flex-ac" style="background-color:#f0f4fc;height:40px">
								<span style="width:154px" class="_name g-c-black1 ">产品名称</span>
								<span class="g-col g-c-black1 " style="min-width: 220px;">规格类型</span>
								<span style="width:200px" class="g-c-black1 ">成本</span>
								<span style="width:120px" class="g-c-black1 ">价格</span>
								<span class="g-col g-c-black1 ">操作</span>
							</div>
							<div style="min-height: 30px;">
								<div
									v-for="(item,i) in formData.product_combine_data"
									:v-model="i"
									:key="i"
									:style="{ backgroundColor: i % 2 == 1 ? '#fafafa' : '', width: '750px' }"
									class="g-flex g-tc _step-name"
								>
									<i-poptip
										:content="item.product_name"
										style="max-width:150px;display: flex;align-items: center;"
										placement="bottom-start"
										class="g-col g-flex-ac"
										trigger="hover"
									>
										<div
											style="cursor: pointer;"
											class="_name g-c-black2"
										>{{ item.product_name }}</div>
									</i-poptip>
									<div class="g-flex g-col g-fw-w" >
										<div v-for="(ele,index) in item.combine_sku" :key="index" class="g-flex g-col g-m-tb-5" >
											<div class="g-col g-c-blue-mid " style="min-width: 220px;">
												<div v-if="item.has_sku==0">无</div>
												<div v-else >
													<template v-for="(ele,num) in ele.specs" >
														<i-select
															v-if="item.product_specs[num]"
															ref="select"
															v-model="ele.specs_value"
															:key="num"
															class="g-m-r-5 "
															placeholder="请选择"
															label-in-value
															style="width: 80px;"
															@on-change="handleMoreStuffs($event,ele,item)"
														>
															<i-option
																v-for="(el,index) in item.product_specs[num].values "
																:key="index"
																:value="el.specs_value"
															>{{ el.specs_name }}</i-option>
														</i-select>
													</template>
													<i
														v-if=" item.combine_sku.length !== 1"
														class="icon-remove-circle iconfont g-c-red-light"
														style="display: inline-block;vertical-align: middle;"
														@click="()=>{ item.combine_sku.splice(index, 1)}"
													/>
													<i
														v-if=" item.combine_sku.length - 1 ===index"
														class="icon-add1 iconfont g-c-blue-light"
														style="display: inline-block;vertical-align: middle;"
														@click="handleAddStuffs(item.combine_sku,ele)"
													/>
												</div>
											</div>
											<span class="g-col g-c-blue-mid" style="min-width: 200px;">
												<span v-if="ele.cost!==null">
													{{ (+ele.cost).toFixed(2) }}
													<span
														v-if="ele.cost_type!=3"
													>%</span>
													<span v-else>元</span>
													({{ type[+ele.cost_type] }})
													<i
														class="g-m-l-5 iconfont icon-edit1 g-operation"
														@click="handleEditCost(ele,i,index)"
													/>
												</span>
												<span v-else>
													请设置成本
													<i
														class="g-m-l-5 iconfont icon-edit1 g-operation"
														@click="handleEditCost(ele,i,index)"
													/>
												</span>
											</span>
											<!-- <div class="g-col">{{ ele.first_purchase.cost }}({{ type[+ele.first_purchase.cost_type] }})</div> -->
											<span v-if="ele.inputShow" :key="index" class="g-col">
												<i-input-number
													v-model="ele.price"
													:max="99999999"
													:min="0"
													:precision="2"
													:active-change="false"
													style="width:100px; line-height: 32px"
													@on-blur="handleSavePrice(ele)"
													@on-enter="handleSavePrice(ele)"
												/>
											</span>
											<span
												v-else
												class="g-col g-c-blue-mid"
												style="min-width: 120px;"
											>
												{{ ele.price!==null?(+ele.price).toFixed(2):'请设置价格' }}
												<i
													class="g-m-l-5 iconfont icon-edit1 g-operation"
													@click="handleEditPrice(ele)"
												/>
											</span>
										</div>
									</div>
									<div class="g-col __option g-flex-ac">
										<span class="g-operation" @click="handleDel(i)">删除</span>
									</div>
								</div>
							</div>
							<div
								class="g-flex-ac"
								style="width:750px;background-color:#f0f4fc;height:40px"
							>
								<span class="g-col _name ">总价</span>
								<span v-if="0" class="g-col"/>
								<span class="g-col"/>
								<span class="g-col" style="min-width: 310px;"/>
								<span class="g-col " >&yen;{{ (+totalPrice).toFixed(2) }}</span>
							</div>
						</div>
					</div>
				</i-form-item>
				<i-form-item label="附件信息:">
					<vc-debounce-click :tag="Button" class="__upload" @click="handleEnclosure">
						<i class="iconfont icon-accessory"/>编辑附件信息
					</vc-debounce-click>
				</i-form-item>
			</i-form>
		</div>
		<div class="__button g-flex-cc">
			<vc-debounce-click class="g-gray-btn-small g-m-r-10" @click="handleCancel(1)">取消</vc-debounce-click>
			<vc-debounce-click class="g-red-btn-small" @click="handleSave">保存</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import {
	Form, FormItem, Input, InputNumber,
	Select, Option, DatePicker, Cascader, Message, RadioGroup, Radio,
	Upload, Progress, Button, Poptip, Dropdown, DropdownMenu, DropdownItem
} from 'iview';
import { mapState } from 'vuex';
import { create } from 'domain';
import API from "@stores/apis/root";
import { setTimeout } from 'timers';
import { Confirm } from "@components/_common/confirm/confirm";
import breadcrumb from '../_common/breadcrumb';
import { EditCostModal } from './popup/edit-cost';
import { AddElement } from './popup/add-ele';
import { EditEncloModal } from './popup/edit-enclo';
import { SaveConfirm } from '../product-new/popup/save-confirm';
import { DelPro } from './popup/del-pro.vue';

const baseProduce = {
	product_id: "", // 子产品id
	product_name: "", // 产品名称
	// price_quantity: "", // 数量
	price: "", // 价格
	price_unit: "", // 单位
	cost_type: "", // 成本类型
	cost: "", // 成本比例或固定成本
	sku_id: '0',
	sku: [],
	has_sku: "",
	stuffId: '',
	showInput: false
};
export default {
	name: 'oa-tpl',
	components: {
		'oa-breadcrumb': breadcrumb,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-button': Button,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-progress': Progress,
		'i-uplodd': Upload,
		'i-poptip': Poptip,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
	},
	data() {
		return {
			list: [{
				name: '组合产品',
				path: this.$route.path,
			}],
			price: null, // 总价
			// inputShow: Number,
			unit: ['元', '元/年', '元/2年', '元/套', '元/篇', '元/月', '元/人', '元/半年', '元/张', '元/个', '元/组'],
			type: ['', '标准价成本', '成交金额成本', '固定成本'],
			selectList: [],
			formData: {
				product_name: "",
				product_describe: "",
				product_id: "",
				product_combine_data: [],
				attachment: Array
			},
			ruleValidate: {
				product_name: [
					{ required: true, type: 'string', message: '请输入产品组合名称', trigger: 'change' }
				],
			},
			stuffId: '',
		};
	},
	computed: {
		totalPrice() {
			let i = 0;
			this.formData.product_combine_data.forEach(ele => {
				if (ele.combine_sku[0].price) {
					ele.combine_sku[0].price = Number(ele.combine_sku[0].price);
					i = Number(ele.combine_sku[0].price) + i;
				}
			});
			return i;
		},

	},
	watch: {
		'formData.product_name': function (val) {
			this.$store.commit('SET_GROUP_PRODUCT_NAME', val);
		},
		'formData.product_describe': function (val) {
			this.$store.commit('SET_GROUP_PRODUCT_DESCRIBE', val);
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		let i = this.$route.query.product_id;
		if (i) {
			this.EditList(i);
			this.$store.commit('SET_GROUP_PRODUCT_ID', i);
		}
		this.handleTitleActive();
	},
	beforeDestroy() {
		this.handleTitleUnactive();
	},
	methods: {
		handleAddStuffs(combineSku, stuffs) {
			const com = {
				cost: null,
				cost_type: 1,
				price: null,
				price_unit: 1,
			};
			const spe = {
				specs_field: "",
				specs_name: "",
				specs_value: "",
			};
			let specs = [];
			stuffs.specs.forEach(ele => {
				let spe1 = { ...spe };
				spe1.specs_field = ele.specs_field;
				specs.push(spe1);
			});
			combineSku.push({ ...com, specs });
		},
		handleMoreStuffs(e, ele, item) {
			ele.specs_name = e.label;
			ele.specs_value = e.value;
			return;
		},
		handleTitleActive() {
			this.$nextTick(() => {
				const FirstTitle = document.getElementsByClassName('__menu-item')[1];
				FirstTitle.classList.remove('__menu-item-unactive');
				FirstTitle.classList.add('__menu-item-active');
			});
		},
		handleTitleUnactive() {
			const FirstTitle = document.getElementsByClassName('__menu-item')[1];
			FirstTitle.classList.remove('__menu-item-active');
			FirstTitle.classList.add('__menu-item-unactive');
		},
		EditList(val) {
			this.$request({
				url: API._CONTENT_PRODUCT_GROUP_EDIT_GET,
				type: "GET",
				param: {
					product_id: val
				}
			}).then(res => {
				this.formData.product_name = res.data.product_name;
				this.formData.product_describe = res.data.product_describe;
				this.formData.product_combine_data = res.data.product_combine_data;
				this.formData.attachment = res.data.attachment;
			}).catch(error => {
				console.error(error);
			});
		},
		handleAddElement() {
			this.selectList = [];
			if (this.formData.product_combine_data.length > 0) {
				this.formData.product_combine_data.forEach(ele => {
					this.selectList.push(ele.product_id);
				});
			}
			AddElement.popup({
				store: this.$store,
				data: {
					selectList: this.selectList,
					selectProductList: this.formData.product_combine_data
				}
			}).then((res) => {
				res.selectList.forEach(ele => {
					ele.combine_sku.slice(0, 1);
				});
				this.formData.product_combine_data = res.selectList;
				if (this.formData.attachment.length > 0) {
					this.formData.attachment = this.formData.attachment.concat(res.attachMents);
				} else {
					this.formData.attachment = res.attachMents;
				}
			}).catch((res) => {

			});
		},
		handleDel(index) {
			Confirm.popup({
				title: '确定删除？',
				msg: '请问确定要删除吗？',
			}).then((res => {
				this.formData.product_combine_data.splice(index, 1);
			}));
		},
		handleEditCost(ele, i, index) {
			// ele.cost = 0;
			EditCostModal.popup({
				store: this.$store,
				data: {
					product: ele,
				}
			}).then((product => {
				this.formData.product_combine_data[i].combine_sku[index] = product;
				this.$forceUpdate();
			}));

		},
		handleEnclosure(val) {
			EditEncloModal.popup({
				store: this.$store,
				data: {
					num: val,
					attachment: this.formData.attachment,
				}
			}).then(res => {
				this.formData.attachment = res.attachments;
			});
		},
		handleSave() {
			let vid = true;
			this.formData.product_combine_data.forEach(ele => {
				ele.combine_sku.forEach(item => {
					if (item.cost == null || item.price == null) {
						vid = false;
					}
					const v =	item.specs.find(it => {
						   return it.specs_value == undefined;
					   });
					if (v) { vid = false; }
				});
			});
			if (!vid) {
				this.$Message.error("数据请填写完整");
				return;
			}
			this.$refs.from.validate((msg) => {
				if (!msg) {
					this.valid = false;
				} else {
					if (this.formData.product_combine_data == 0) {
						this.$Message.error("请选择产品");
						return;
					}
					this.$request({
						url: API._CONTENT_PRODUCT_GROUP_SAVE_GET,
						type: "post",
						param: {
							product_id: this.$route.query.product_id,
							product_name: this.formData.product_name,
							product_describe: this.formData.product_describe,
							product_combine_data: this.formData.product_combine_data,
							attachment: this.formData.attachment,
						}
					}).then(res => {
						this.$router.push({ name: "content-product-group" });
					}).catch(error => {
						this.$Message.error(error.msg);
					});
				}
			});
		},
		handleCancel(i = 0) {
			Confirm.popup({
				title: '确定取消',
				msg: '取消后系统将不会保存此次编辑的内容，确认取消？',
			}).then(data => {
				i == 1 && this.$router.push({ name: "content-product-group" });
			}).catch(data => { });
		},
		handleEditPrice(product) {
			product.price = Number(product.price);
			product.inputShow = true;

			this.$forceUpdate();
		},
		handleSavePrice(product) {
			setTimeout(() => {
				product.inputShow = false;
				this.formData.product_combine_data = [...this.formData.product_combine_data];
			}, 0);
			this.$forceUpdate();

		},
	},
};
</script>

<style lang="scss" scoped>
    .v-product-newgroup {
        position: relative;
        /deep/ .ivu-input-number {
            .ivu-input-number-handler-wrap {
                display: none !important;
            }
        }
        .g-col {
            text-align: left;
        }
        ._requrie::after {
            content: " *";
            display: inline-block;
            line-height: 1;
            font-family: SimSun;
            font-size: 12px;
            color: #ed4014;
        }
        ._content {
            padding-bottom: 100px;
            position: absolute;
            left: 50%;
            top: -6px;
            transform: translateX(-50%);
            .__lable {
                margin-right: 10px;
                padding-top: 10px;
                min-width: 90px;
                text-align: right;
            }
            .__attachment {
                align-items: flex-end;
            }
            .__upload {
                text-align: center;
                height: 32px;
                background: #fafafa;
                border: 1px solid #d4d7d8 !important;
                color: #999 !important;
                border-radius: 4px;
            }
            .__upload:hover {
                border: 1px solid #e74854 !important;
                color: #e74854 !important;
            }
        }
        ._step {
            ._step-name {
                min-height: 40px;
            }
        }
        .__button {
            height: 60px;
            width: calc(100% - 160px);
            line-height: 60px;
            position: fixed;
            z-index: 2;
            right: 0;
            bottom: 0px;
            background: #fff;
            box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
        }
        .__option {
            span {
                padding: 0 5px;
                border-right: 1px solid currentColor;
            }
            span:last-child {
                border: none;
            }
        }
        .__step-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        ._name {
            width: 154px;
            padding-left: 20px;
            text-overflow: ellipsis;
            overflow-x: hidden;
            white-space: nowrap;
        }
    }
</style>
