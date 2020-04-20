<template>
	<div class="v-product-newprocess g-flex-cc">
		<div class="_content">
			<i-form ref="from" :model="formdata" :label-width="100" :rules="ruleValidate">
				<div class="g-flex g-m-t-20">
					<i-form-item label="流程名称：" prop="name">
						<i-input
							v-model="formdata.name"
							:maxlength="20"
							style="width:700px; margin-top: 5px"
							placeholder="输入流程名称"
						/>
					</i-form-item>
				</div>
				<div class="g-flex g-m-t-5">
					<i-form-item label="流程介绍：">
						<oa-limit-words
							v-model="formdata.describe"
							:max="200"
							placeholder="请输入流程介绍"
							style="width:700px"
						/>
					</i-form-item>
				</div>
				<div class="g-flex  g-m-t-5 ">
					<i-form-item >
						<template slot="label">
							<span class="_requrie"/> 流程步骤：
						</template>
						<div>
							<div class="g-flex _step" style="width:700px;background-color:#f0f4fc">
								<span class="g-col g-c-black1 g-tc">顺序</span>
								<span class="g-col g-c-black1 g-tl">步骤名称</span>
								<span class="g-col g-c-black1 g-tl">流程数量</span>
								<span class="g-col g-c-black1 g-tl">适用职位</span>
								<span class="g-col g-c-black1 g-tl">操作</span>
								<span class="g-col g-c-black1 g-tl">首页推送</span>
							</div>
							<div style="overflow-y:auto;min-width: 700px">
								<div
									v-for="(item,i) in process.product_process_step"
									:v-model="i"
									:key="i"
									:style="{ backgroundColor: i % 2 == 1 ? '#fafafa' : '', width: '700px' }"
									class="g-flex g-tl _step"
								>
									<span class="g-col g-tc">{{ i-0+1 }}</span>
									<span class="g-col ">
										<span v-if="item.step_name.length<=8">{{ item.step_name }} </span>
										<i-tooltip v-else :content="item.step_name" transfer >
											{{ item.step_name.substr(0, 8) + "..." }}
										</i-tooltip>
									</span>
									<span class="g-col">
										<i-dropdown>
											<a class="g-operation" href="javascript:void(0)">
												{{ item.product_component_num }}
											</a>
											<i-dropdown-menu
												v-if="process.product_process_step[i].product_component.length>0"
												slot="list"
												style="max-height:300px;overflow-y: auto;">
												<i-dropdown-item
													v-for="(item,index) in process.product_process_step[i].product_component "
													:key="index"
												>{{ item.component_label }}</i-dropdown-item>
											</i-dropdown-menu>
										</i-dropdown>
									</span>
									<span class="g-col" >
										<i-poptip
											v-if="item.position_id&&item.position_id.length>1"
											trigger="hover"
											transfer
											placement="bottom"
											content="content"
											max-width="{250}">
											{{ getPosition(item.position_id)[0]+'...' }}
											<div slot="content">
												<span
													v-for="(el ,m) in getPosition(item.position_id)"
													:key="m"
													class="g-m-r-5"
												>
													{{ el }}
												</span>
											</div>
										</i-poptip>
										<template v-else>
											<span
												v-for="(el ,m) in getPosition(item.position_id)"
												:key="m"
												class="g-m-r-5"
											>
												{{ el }}
											</span>
										</template>
									</span>
									<div class="g-col">
										<span class="g-operation _point" @click="handleEdit(i)">编辑</span>
										<span class="g-operation _point" @click="handleMove(i)">上移</span>
										<span class="g-operation " @click="handleDel(i)">删除</span>
									</div>
									<div class="g-col">
										<i-switch :value="!!item.is_push" @on-change="handleChangePush($event,i)"/>
									</div>
								</div>
							</div>
						</div>
					</i-form-item>
				</div>
				<div class="g-m-t-10 _preview">
					<vc-debounce-click :tag="Button" @click="handlePreviewForm">预览表单</vc-debounce-click >
					<vc-debounce-click :tag="Button" class="g-m-l-5" type="primary" @click="handleAddProcess">添加步骤</vc-debounce-click >
				</div>
			</i-form>

			<oa-footer
				@cancel="handleCancel(1)"
				@ok="handleSave"
			/>
		</div>
	</div>
</template>

<script>
import {
	Form, FormItem, Input, InputNumber,
	Select, Option, DatePicker, Cascader, Message, RadioGroup, Radio,
	Upload, Progress, Button, Tooltip, Dropdown, DropdownMenu, DropdownItem,
	Poptip, Switch
} from 'iview';
import Footer from '@components/_common/footer/footer';
import API from "@stores/apis/root";
import { mapState } from 'vuex';
import { SortList } from 'wya-vc';
import { services } from '@stores/services/hr';
import { Confirm } from "@components/_common/confirm/confirm";
import { saveTrue } from '../_common/popup/saveTrue';
import { AddStep } from './popup/add-step';
import { AddProcess } from './popup/add-process';
import { PreviewForm } from './popup/preview-form';
import { SaveConfirm } from '../product-new/popup/save-confirm';
import { delTrue } from './popup/del-true.vue';

let count = 0;

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
		"i-tooltip": Tooltip,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'i-poptip': Poptip,
		'oa-footer': Footer,
		"i-switch": Switch,
		'vc-sort-list': SortList
	},
	mixins: [
		services.allPosition()
	],
	data() {
		return {
			list: [{
				name: '新建流程',
				path: this.$route.path,
			}],
			formdata: {
				name: "",
				describe: '',
			},
			ruleValidate: {
				name: [
					{ required: true, message: '请输入项目需求名称', trigger: 'blur' }
				]
			}
		};
	},
	computed: {
		...mapState({ process: state => state.contentProductNewprocess.process }),
		process_name: {
			set(val) {
				this.$store.commit('SET_PROCESS_NAME', val);
			},
			get() {
				return this.$store.state.contentProductNewprocess.process.process_name;
			}
		},
		describe: {
			set(val) {
				this.$store.commit('SET_DESCRIBE', val);
			},
			get() {
				return this.$store.state.contentProductNewprocess.process.describe;
			}
		},
	},
	watch: {
		'formdata.name': function (val) {
			this.$store.commit('SET_PROCESS_NAME', val);
		},
		'formdata.describe': function (val) {
			this.$store.commit('SET_DESCRIBE', val);
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		let i = this.$route.query.request_id;
		if (i) {
			this.$store.commit('SET_PROJECT_PROCESS_ID', i);
			this.EditList(i);
		}
		this.handleTitleActive();

	},
	beforeDestroy() {
		this.handleTitleUnactive();
		this.handleCancel();
	},
	methods: {
		handleChangePush(val, i) {
			 this.$store.commit('SET_PROJECT_PROCESS_STEP_PUSH', { val: Number(val), i });
		},
		getPosition(v = []) {
			if (v.length > 0) {

				const positionList = [];
				v.forEach(ele => {
					let position = this.allPosition.find(item => {
						return item.position_id == +ele;
					});
					position && positionList.push(position.position_name);
				});
				return positionList;
			}
			// let
			// v.map()
		},
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
				url: API._CONTENT_PRODUCT_SET_PROCESS_LIST_EDIT_GET,
				type: "GET",
				param: {
					process_id: val
				}
			}).then(res => {
				this.formdata.name = res.data.process_name;
				this.formdata.describe = res.data.describe;
				this.process_name = res.data.process_name;
				this.describe = res.data.describe;
				this.$store.commit('GET_PRODUCT_PROCESS_STEP', res.data.product_process_step);
				this.$store.commit('GET_PRODUCT_PROCESS_ID', res.data.process_id);
			}).catch(error => {
				console.error(error);
			});
		},
		handleAdd() {
			EditProcess.popup({

			}).then((res) => {

			}).catch((res) => {

			});
		},
		handleAddProcess() {
			AddProcess.popup({
				store: this.$store
			}).then((res) => {


			}).catch((res) => {

			});
		},
		handlePreviewForm() {
			if (this.process.product_process_step.length == 0) {
				this.$Message.error("请选择流程步骤");
				return;
			}
			PreviewForm.popup({
				store: this.$store
			}).then((res) => {
			}).catch((res) => {
			});
		},
		handleCancel(i = 0) {
			if (i == 1) {
				Confirm.popup({
					title: '确认取消？',
					msg: '取消后系统将不会保存此次编辑的内容，确认取消？'
				 }).then(data => {
					this.formdata.name = '';
					this.formdata.describe = '';
					this.$store.commit('DEL_PROCESS');
					this.$router.push({ name: 'content-product-set-process' });
				}).catch(data => { });
			} else {
				this.formdata.name = '';
				this.formdata.describe = '';
				this.$store.commit('DEL_PROCESS');
			}
		},
		async handleSave() {
			let edit = true;
			if (this.$route.query.request_id) {
				await Confirm.popup({
					   title: "确认保存",
					   msg: '流程管理更改后不会对已经下单的产品产生影响，后续新下单的产品将使用本次设置的内容，请知悉'
			   }).then((res) => {
			   }).catch((res) => {
				  edit = false;
			   });
			}
			this.$refs.from.validate((msg) => {
				if (msg) {
					if (this.process.product_process_step.length == 0) {
						this.$Message.error('请选择添加元件');
						return;
					} else if (edit) {
						this.$store.commit('SET_PROCESS_STEP_SORT');
						this.$request({
							url: API._CONTENT_PRODUCT_PROCESS_SAVE_POST,
							type: "post",
							param: {
								...this.process
							}
						}).then(res => {
							this.$Message.success(res.msg);
							this.$router.push({ name: 'content-product-set-process' });
						}).catch(error => {
							this.$Message.error(error.msg);
							console.error(error);
						});
					}
				}
			});
		},
		handleEdit(i) {
			AddStep.popup({
				store: this.$store,
				data: {
					num: i
				}
			});
		},
		handleDel(i) {
			delTrue.popup({
				store: this.$store,
			}).then((res) => {
				this.$store.commit('DEL_PROCESS_STEP', i);
			});
		},
		handleMove(i) {
			this.$store.commit('MOVE_PROCESS_STEP', i);
		}
	},
};
</script>

<style lang="scss" scoped>
    .v-product-newprocess {
		._point::after{
			padding-left: 5px;
			content: '|';
			height: 14px;
			width:1px;
			color:#2296f9;

		}
		._requrie::after{
			content: ' *';
			display: inline-block;
			line-height: 1;
			font-family: SimSun;
			font-size: 12px;
			color: #ed4014;
		}
        ._content {
			margin-bottom: 100px;
            .__lable {
                margin-right: 10px;
                padding-top: 10px;
                min-width: 90px;
                text-align: right;
            }
        }
        ._step {
			height: 40px;
			line-height: 40px;
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
		._preview{
			padding-left: 100px;
		}
		.__step-name{
			overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
			display: inline-block;
			max-width: 100px;
			cursor: pointer;
		}
    }
</style>
