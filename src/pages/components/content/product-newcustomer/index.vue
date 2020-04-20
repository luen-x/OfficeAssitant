<template>
	<div class="v-product-newprocess g-flex-cc">
		<div class="_content">
			<i-form ref="from" :model="formdata" :label-width="110" :rules="ruleValidate">
				<div class="g-flex g-m-t-20">
					<i-form-item label="客户信息名称：" prop="name">
						<i-input
							v-model="formdata.name"
							:maxlength="20"
							style="width:600px; margin-top: 5px"
							placeholder="输入客户信息名称"
						/>
					</i-form-item>
				</div>
				<div class="g-flex">
					<i-form-item label="客户信息介绍：">
						<oa-limit-words
							v-model="formdata.describe"
							:max="200"
							placeholder="请输入客户信息介绍"
							style="width:600px"
						/>
					</i-form-item>
				</div>
				<div class="g-flex">
					<i-form-item>
						<template slot="label">
							<span class="_requrie"/> 表单内容：
						</template>
						<div
							class="g-operation g-m-10"
							style="margin-top: 2px;"
							@click="handleAddElement"
						>
							<i class="iconfont icon-add1"/>
							<span>添加元件</span>
						</div>
						<div class="_step">
							<div class="g-flex" style="width:600px;background-color:#f0f4fc">
								<span class="g-col g-c-black1 g-tc">顺序</span>
								<span class="g-col g-c-black1">元件名称</span>
								<span class="g-col g-c-black1">元件类型</span>
								<span class="g-col g-c-black1">操作</span>
							</div>
							<div style="height:250px;overflow-x:auto;min-width: 600px">
								<div
									v-for="(item,i) in process"
									:v-model="i"
									:key="i"
									:style="{ backgroundColor: i % 2 == 1 ? '#fafafa' : '', width: '600px' }"
									class="g-flex"
								>
									<span class="g-col g-tc">{{ i-0+1 }}</span>
									<span
										:class="{_requrie:item.required==1}"
										class="g-col __step-name"
									>{{ item.component_label }}</span>
									<span class="g-col">{{ item.component_type_name }}</span>
									<div class="g-col ">
										<span class="_point g-operation" @click="handleEidt(i)">编辑</span>
										<span class="_point g-operation" @click="handleMove(i)">上移</span>
										<span class=" g-operation" @click="handleDel(i)">删除</span>
									</div>
								</div>
							</div>
						</div>
					</i-form-item>
				</div>
				<div class="g-m-t-20 _preview">
					<vc-debounce-click :tag="Button" @click="handlePreviewForm">预览表单</vc-debounce-click>
				</div>
			</i-form>
		</div>
		<oa-footer @cancel="handleClear(1)" @ok="handleSave"/>
	</div>
</template>

<script>
import {
	Form, FormItem, Input, InputNumber,
	Select, Option, DatePicker, Cascader, Message, RadioGroup, Radio,
	Upload, Progress, Button
} from 'iview';
import { mapState } from 'vuex';
import { create } from 'domain';
import API from "@stores/apis/root";
import Footer from '@components/_common/footer/footer';
import { Confirm } from "@components/_common/confirm/confirm";
import { saveTrue } from '../_common/popup/saveTrue';
import { PreviewForm } from './popup/preview-form';
import { AddElement } from './popup/add-ele';
import { SaveConfirm } from '../product-new/popup/save-confirm';
import { EditElement } from './popup/_common/edit-element';

export default {

	name: 'oa-tpl',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-progress': Progress,
		'i-uplodd': Upload,
		'oa-footer': Footer
	},
	data() {
		return {
			list: [{
				name: '客户信息',
				path: this.$route.path,
			}],
			formdata: {
				name: "",
				describe: '',
			},
			selectList: [],
			component_field: [],
			ruleValidate: {
				name: [
					{ required: true, message: '请输入客户信息名称', trigger: 'blur' }
				]
			}
		};
	},

	computed: {
		...mapState({ process: state => state.contentProductNewcustomer.product_component }),
		process_name: {
			set(val) {
				this.$store.commit('SET_CUS_PROCESS_NAME', val);
			},
			get() {
				return this.$store.state.contentProductNewcustomer.process_name;
			}
		},
		describe: {
			set(val) {
				this.$store.commit('SET_CUS_DESCRIBE', val);
			},
			get() {
				return this.$store.state.contentProductNewcustomer.describe;
			}
		},
		process_id() {
			return this.$store.state.contentProductNewcustomer.process_id;
		}
	},
	watch: {
		'formdata.name': function (val) {
			this.$store.commit('SET_CUS_PROCESS_NAME', val);
		},
		'formdata.describe': function (val) {
			this.$store.commit('SET_CUS_DESCRIBE', val);
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		let i = this.$route.query.request_id;
		if (i) {
			this.$store.commit('SET_CUSTOMER_PROCESS_ID', i);
			this.EditList(i);
		}
		this.handleTitleActive();

	},
	beforeDestroy() {
		this.handleTitleUnactive();
		this.handleClear();
	},
	methods: {

		// 编辑
		handleTitleActive() {
			this.$nextTick(() => {
				const FirstTitle = document.getElementsByClassName('__menu-item')[2];
				FirstTitle.classList.remove('__menu-item-unactive');
				FirstTitle.classList.add('__menu-item-active');
			});
		},
		handleTitleUnactive() {
			const FirstTitle = document.getElementsByClassName('__menu-item')[2];
			FirstTitle.classList.remove('__menu-item-active');
			FirstTitle.classList.add('__menu-item-unactive');
		},
		EditList(val) {
			this.$request({
				url: API._CONTENT_PRODUCT_SET_CUSTOMER_LIST_EDIT_GET,
				type: "GET",
				param: {
					process_id: val
				}
			}).then(res => {
				this.formdata.name = res.data.process_name;
				this.formdata.describe = res.data.describe;
				this.process_name = res.data.process_name;
				this.describe = res.data.describe;
				this.$store.commit('SET_CUS_COMPONENT', res.data.product_component);
			}).catch(error => {
				console.error(error);
			});
		},
		handleAddElement() {
			this.component_field = [];
			this.selectList = [];
			this.process.forEach(ele => {
				this.component_field.push(ele.component_field);
			});
			AddElement.popup({
				store: this.$store,
				data: {
					selectList: this.selectList,
					component_field: this.component_field
				}
			}).then((res) => {
				this.component_field = [];
				this.selectList = res;
			}).catch((res) => {

			});
		},
		handleDel(val) {
			if (this.selectList.length > 0) {
				this.selectList.splice(val, 1);
			} else {
				this.component_field.splice(val, 1);
			}
			this.$store.commit('DEL_CUS_COMPONENT', val);
		},
		handleMove(val) {
			this.$store.commit('MOVE_CUS_COMPONENT', val);
		},
		handlePreviewForm() {
			if (this.process.length == 0) {
				this.$Message.error("请选择添加元件");
				return;
			}
			PreviewForm.popup({
				store: this.$store
			}).then((res) => {
			}).catch((res) => {
			});
		},
		handleEidt(i) {
			EditElement.popup({
				store: this.$store,
				data: {
					num: i,
				}
			});
		},
		async handleSave() {
			let edit = true;
			if (this.process_id) {
				await Confirm.popup({
					title: "确认保存",
					msg: '客户信息更改后不会对已经下单的产品产生影响，后续新下单的产品将使用本次设置的内容，请知悉'
				}).then((res) => {
				}).catch((res) => {
					edit = false;
				});
			}
			this.$refs.from.validate((msg) => {
				if (msg) {
					if (this.process.length == 0) {
						this.$Message.error('请选择添加元件');
						return;
					} else if (edit) {
						this.$store.commit('SET_NEWCUSTOMER_COM_SORT');
						this.$request({
							url: API._CONTENT_PRODUCT_SET_CUSTOMER_LIST_SAVE_GET,
							type: "post",
							param: {
								process_id: this.process_id,
								process_name: this.process_name,
								describe: this.describe,
								product_component: this.process,
							}
						}).then(res => {
							this.$router.push({ name: 'content-product-set-customer' });
						}).catch(error => {
							this.$Message.error(error.msg);
							console.error(error);
						});
					}
				}
			});

		},
		handleClear(i = 0) {
			if (i == 1) {
				Confirm.popup({
					title: '确认取消？',
					msg: '取消后系统将不会保存此次编辑的内容，确认取消？'
				 }).then(data => {
					this.formdata.name = '';
					this.formdata.describe = '';
					this.$store.commit('SET_CUS_DATA');
					this.$router.push({ name: 'content-product-set-customer' });
				}).catch(data => { });
			} else {
				this.formdata.name = '';
				this.formdata.describe = '';
				this.$store.commit('SET_CUS_DATA');
			}
		}
	},
};
</script>

<style lang="scss" scoped>
    .v-product-newprocess {
        padding-bottom: 60px;
        overflow: hidden;
        ._content {
            margin-bottom: 100px;
            .__lable {
                margin-right: 10px;
                padding-top: 10px;
                width: 100px;
                text-align: center;
            }
        }
        ._requrie::after {
            content: " *";
            display: inline-block;
            line-height: 1;
            font-family: SimSun;
            font-size: 12px;
            color: #ed4014;
        }
        ._step {
            div {
                height: 40px;
                line-height: 40px;
            }
        }
        ._preview {
            padding-left: 100px;
        }
        ._point::after {
            padding-left: 5px;
            content: "|";
            height: 14px;
            width: 1px;
            color: #2296f9;
        }
        .__step-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
</style>
