
<template>
	<i-drawer
		v-model="visible"
		class="v-sale-notice-sign-up _drawer"
		width="1100"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<p slot="header">
			<span style="font-weight: normal; font-size:16px">为客户报名</span>
			<span class="g-fr clas" style="margin-right:40px">
				<i-poptip trigger="hover" placement="bottom-end" @on-popper-show="GetActiveDetail">
					<i class="g-c-blue-dark iconfont icon-warning"/>
					<div slot="title" style="text-aigin: center">活动详情</div>
					<div slot="content" style="font-weight:0" class="api">
						<div slot="content" style="width:350px">
							<div class="g-flex g-m-b-15">
								<div class="g-m-r-5 g-c-black4">活动分类:</div>
								<div class="_fontbold g-c-black2">
									<span>{{ activeDetail.category_name }}</span>
								</div>
							</div>
							<div class="g-flex g-m-b-15">
								<div class="g-m-r-5 g-c-black4">活动名称:</div>
								<div class="g-c-black2 _fontbold">
									<span>{{ activeDetail.activity_name }}</span>
								</div>
							</div>
							<div class="g-flex g-m-b-15">
								<div class="g-m-r-5 g-c-black4">活动时间:</div>
								<div class="_fontbold g-c-black2">
									<span>{{ activeDetail.start_time }}</span>
									至
									<span>{{ activeDetail.end_time }}</span>
								</div>
							</div>
							<div class="g-flex g-m-b-15">
								<div class="g-m-r-5 g-c-black4">报名时间:</div>
								<div class="_fontbold g-c-black2">
									<span>{{ activeDetail.apply_start_time }}</span>
									至
									<span>{{ activeDetail.apply_end_time }}</span>
								</div>
							</div>
							<div class="g-flex g-m-b-15" style="align-items: baseline;">
								<div class="g-m-r-5 g-c-black4">活动地址:</div>
								<div class="_fontbold g-c-black2">
									<span>{{ activeDetail.address }}</span>
								</div>
							</div>
							<div class="g-flex g-m-b-15 g-jc-sb">
								<div class="g-flex">
									<div class="g-m-r-5 g-c-black4">限制人数:</div>
									<div class="_fontbold g-c-black2">{{ activeDetail.apply_limit }}</div>
								</div>
								<div v-if="activeDetail.show_apply_num==1" class="g-flex">
									<div
										class="g-m-r-5 g-c-black4"
										style="margin-left: -142px;"
									>已报名人数:</div>
									<span
										class="_fontbold g-c-black2"
									>{{ activeDetail.apply_count }}</span>
								</div>
							</div>
							<div class="g-flex g-m-b-15">
								<div class="g-m-r-5 g-c-black4">可超人数:</div>
								<div class="_fontbold g-c-black2">
									<span>{{ activeDetail.extra_apply }}</span>
								</div>
							</div>
							<div class="g-flex g-m-b-15" style="align-items: baseline;">
								<div class="g-m-r-5 g-c-black4">活动说明:</div>
								<div class="_fontbold g-c-black2">{{ activeDetail.describe }}</div>
							</div>
						</div>
					</div>
				</i-poptip>
			</span>
		</p>
		<div class="_tabs">
			<i-tabs v-model="name">
				<i-tabPane label="客户报名" name="1">
					<div class="_sige g-m-b-30 g-c-black3">
						<div class="g-m-b-20">
							<span>活动名称：</span>
							<i-select v-model="activity_id" :disabled="apply_id?true:false" style="width:300px" @on-change="GetActiveDetail">
								<i-option
									v-for="item in activeList"
									:value="item.activity_id"
									:key="item.activity_id"
								>{{ item.activity_name }}</i-option>
							</i-select>
							<span class="g-fr g-operation" @click="handleDownloadCover">下载活动封面</span>
						</div>
						<i-collapse
							v-if="!apply_id||editDate.customer_type==1"
							v-model="show_type"
							class="g-m-b-20"
							@on-change="handleExtend(1)">
							<i-panel name="1" hide-arrow>
								<span class="g-fs-14 g-c-black2">已合作客户</span>
								<i
									v-if="!apply_id&&show&&allow_type[1]"
									class="g-c-blue-dark iconfont icon-add1"
									@click="handleAddFormList(1)"
								/>
								<i
									v-else-if="!apply_id&&!show&&allow_type[1]"
									class="g-c-blue-dark iconfont icon-add1"
									@click.stop="handleAddFormList(1)"
								/>
								<i v-else-if="!apply_id" class="iconfont icon-add1"/>
								<span class="g-fr g-m-r-20">
									{{ show?' 展开 ':'收起' }}
									<i
										v-if="show"
										style="font-size:10px"
										class="iconfont icon-triangle-down"
									/>
									<i v-else style="font-size:10px" class="iconfont icon-triangle-up"/>
								</span>
								<div slot="content">
									<oa-sale-main-sign-form
										v-for="(item,index) in formList1"
										:key="item"
										:type="1"
										:class="{_border:index!=(formList1.length-1)}"
										:activity_id="activity_id"
										:form-collection="formCollection1"
										:apply_limit="activeDetail.apply_limit"
										:extra_apply="activeDetail.extra_apply"
										:retraining-list="retrainingList"
										:proxy-list="proxyList"
										:cooperate-list="cooperateList"
										:position-list="positionList"
										:industry-list="industryList"
										:index="index"
										:activity_detail="activeDetail"
										:edit-date="editDate"
										customer_type="1"
										@delete="handleDelFormList(1,index)"
									/>
								</div>
							</i-panel>
						</i-collapse>
						<i-collapse
							v-if="!apply_id||editDate.customer_type==2"
							v-model="show_type"
							class="g-m-b-20"
							@on-change="handleExtend(2)">
							<i-panel name="2" hide-arrow>
								<span class="g-fs-14 g-c-black2">自己的未合作客户</span>
								<i
									v-if="!apply_id&&show1&&allow_type[2]"
									class="g-c-blue-dark iconfont icon-add1"
									@click="handleAddFormList(2)"
								/>
								<i
									v-else-if="!apply_id&&!show1&&allow_type[2]"
									class="g-c-blue-dark iconfont icon-add1"
									@click.stop="handleAddFormList(2)"
								/>
								<i v-else-if="!apply_id" class="iconfont icon-add1"/>
								<span class="g-fr g-m-r-20">
									{{ show1?'展开':'收起' }}
									<i
										v-if="show1"
										style="font-size:10px"
										class="iconfont icon-triangle-down"
									/>
									<i v-else style="font-size:10px" class="iconfont icon-triangle-up"/>
								</span>
								<div slot="content">
									<oa-sale-main-sign-form
										v-for="(item,index) in formList2"
										:key="item"
										:class="{_border:index!=(formList2.length-1)}"
										:type="2"
										:activity_id="activity_id"
										:apply_limit="activeDetail.apply_limit"
										:extra_apply="activeDetail.extra_apply"
										:form-collection="formCollection2"
										:retraining-list="retrainingList"
										:proxy-list="proxyList"
										:activity_detail="activeDetail"
										:cooperate-list="cooperateList"
										:position-list="positionList"
										:industry-list="industryList"
										:index="index"
										:edit-date="editDate"
										customer_type="2"
										@delete="handleDelFormList(2,index)"
									/>
								</div>
							</i-panel>
						</i-collapse>
						<i-collapse
							v-if="!apply_id||editDate.customer_type==3"
							v-model="show_type"
							class="g-m-b-20"
							@on-change="handleExtend(3)">
							<i-panel name="3" hide-arrow>
								<span class="g-fs-14 g-c-black2">非自己未合作客户</span>
								<i
									v-if=" !apply_id&&show2&&allow_type[3]"
									class="g-c-blue-dark iconfont icon-add1"
									@click="handleAddFormList(3)"
								/>
								<i
									v-else-if="!apply_id&&!show2&&allow_type[3]"
									class="g-c-blue-dark iconfont icon-add1"
									@click.stop="handleAddFormList(3)"
								/>
								<i v-else-if="!apply_id" class="iconfont icon-add1"/>
								<span class="g-fr g-m-r-20">
									{{ show2?'展开':'收起' }}
									<i
										v-if="show2"
										style="font-size:10px"
										class="iconfont icon-triangle-down"
									/>
									<i v-else style="font-size:10px" class="iconfont icon-triangle-up"/>
								</span>
								<div slot="content">
									<oa-sale-main-sign-form
										v-for="(item,index) in formList3"
										:key="item"
										:type="3"
										:class="{_border:index!=(formList3.length-1)}"
										:activity_detail="activeDetail"
										:extra_apply="activeDetail.extra_apply"
										:apply_limit="activeDetail.apply_limit"
										:activity_id="activity_id"
										:form-collection="formCollection3"
										:retraining-list="retrainingList"
										:proxy-list="proxyList"
										:cooperate-list="cooperateList"
										:position-list="positionList"
										:industry-list="industryList"
										:edit-date="editDate"
										:index="index"
										customer_type="3"
										@delete="handleDelFormList(3,index)"
									/>
								</div>
							</i-panel>
						</i-collapse>
					</div>
				</i-tabPane>
				<i-tabPane label="报名记录" name="2">
					<oa-list v-if=" name==2" :type="'1'" :activity_id="activity_id"/>
				</i-tabPane>
			</i-tabs>
		</div>
		<div v-if="name==1" class="_footer">
			<vc-debounce-click :tag="Button" type="primary" @click="handleSave()">报名</vc-debounce-click>
			<vc-debounce-click :tag="Button" class="g-m-l-5" @click="visible = false">取消</vc-debounce-click>
		</div>
	</i-drawer>
</template>

<script type="text/ecmascript-6">
import API from "@stores/apis/root";
import downloadFile from '@utils/download';
import { ImgsPicker, CreatePortal } from 'wya-vc';
import { Drawer, Select, Option, Poptip, Tabs, RadioGroup, Radio, Collapse, Panel, TabPane, Input, Button, Form, FormItem } from 'iview';
import active from './active';
import list from './list';
import { SignSuccess } from './sign-success';
import { PModal } from './index';
import SignForm from '../sign-form';

export default {
	name: "sign-up",
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		"i-drawer": Drawer,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-collapse": Collapse,
		"i-panel": Panel,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-tabs": Tabs,
		"i-tabPane": TabPane,
		"i-poptip": Poptip,
		"oa-active": active,
		"oa-list": list,
		'vc-imgs-picker': ImgsPicker,
		'oa-sale-main-sign-form': SignForm,
	},
	props: {
		data: Object,
	},
	data() {
		return {
			apply_id: this.data.apply_id,
			editDate: {},
			visible: false,
			name: '1',
			formList1: [],
			formList2: [],
			formList3: [],
			cooperateList: [], // 合作类别
			retrainingList: [], // 复训次数
			proxyList: [], // 代理数
			positionList: [], // 职位
			industryList: [], // 行业
			formCollection1: [],
			formCollection2: [],
			formCollection3: [],
			activeDetail: {}, // 活动详情
			courseList: [
				{
					value: 'New York',
					label: '总裁班'
				}
			],
			companiesList: [],
			list: [1],
			activity_id: undefined, // 活动名称；
			form: {},
			apply_list: [], // 上传的参数
			allow_type: [], // 允许报名的类型
			activeList: [],
			show: true,
			show1: true,
			show2: true,
			valid: true,
		};
	},
	computed: {
		show_type: {
			get() {
				return String(this.editDate.customer_type);
			},
			set() {}
		}
	},
	watch: {},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.loadRetain();// 获取基本行业、类别、职位
		if (this.data.apply_id) {
			this.handleDetail(this.data.apply_id);
		}
	},
	mounted() {
		this.visible = true;
		this.GetEffective();
		if (this.data.activeId) {
			this.activity_id = this.data.activeId;
			this.GetActiveDetail();
		}

	},
	methods: {
		handleDownloadCover() { // 下载封面
			if (!this.activeDetail.activity_id) { this.$Message.error('请先选择活动');	return; }
			downloadFile({
				fileName: this.activeDetail.cover_image
			});
		},
		handleRest() {
			this.formList1 = [];
			this.formList2 = [];
			this.formList3 = [];
			this.editDate = {};
			this.apply_id = '';
		},
		async handleSave() {
			let valid = true;
			if (this.data.apply_id) {
				await this['formCollection' + this.editDate.customer_type].forEach(form => {
					form.$refs.form.validate().then(bool => {
						if (!bool) {
							valid = false;
						} else {
							this.handleEditApply(form.$refs.form.model);
						}
					});
				});
				return;
			}
			this.apply_list = [];
			await this.formCollection1.forEach(form => {
				form.$refs.form.validate().then(bool => {
					if (!bool) {
						valid = false;
					} else {
						this.apply_list.push(form.$refs.form.model);
					}
				});
			});
			await this.formCollection2.forEach(form => {
				form.$refs.form.validate().then(bool => {
					if (!bool) {
						valid = false;
						return;
					} else {
						this.apply_list.push(form.$refs.form.model);
					}
				});
			});
			await this.formCollection3.forEach(form => {
				form.$refs.form.validate().then(bool => {
					if (!bool) {
						valid = false;
						return;
					} else {
						this.apply_list.push(form.$refs.form.model);
					}
				});
			});
			if (valid && this.apply_list.length > 0) {
				this.SaveList(this.apply_list);
			} else {
				this.$Message.error("请完善客户信息");
			}
		},
		handleNull() {
			this.visible = false;
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
		    this.visible = false;
			this.$emit('close');
		},
		handleDelFormList(type, index) {
			this['formList' + type].splice(index, 1);

		},
		handleAddFormList(type) {
			setTimeout(() => {
				this['formList' + type].push(Math.random());
			}, 500);
		},
		handledel(v) {
			this.CooperatList.splice(v, 1);
		},
		handleExtend(v) {
			if (v == 1) {
				this.show = !this.show;
			}
			if (v == 2) {
				this.show1 = !this.show1;
			}
			if (v == 3) {
				this.show2 = !this.show2;
			}
		},
		handleSignUP() {
			let apply_list = [];
			this.CooperatList.forEach(element => {
				element.formCooperat.activity_id = this.activity_id;
				apply_list.push(element.formCooperat);
			});
			this.SaveList(apply_list);
			this.visible = false;
		},
		// 获取活动
		GetEffective() {
			this.$request({
				url: API._SALE_MAIN_EFFECTIVE_ACTIVEITY_GET,
				type: "get",
			}).then(res => {
				this.activeList = res.data;
			}).catch(error => {
				console.error(error);
			});
		},
		handleEditApply(data) {
			this.$request({
				url: API._SALE_MAIN_ACTIVEITY_APPLY_EDIT_GET,
				type: "post",
				param: {
					apply_id: this.data.apply_id,
					active_id: this.activeId,
					...data,
					customer_type: this.editDate.customer_type
				}
			}).then(res => {
				// this.handleCancel();
				this.handleRest();
				if (this.data.apply_type == 1) {
					this.name = '2';
				} else {
					this.handleCancel();
				}
			}).catch(error => {
				this.$Message.error(error.msg);
				console.error(error);
			});
		},

		// 获取基本行业、类别、职位
		loadRetain() {
			this.$request({
				url: API._SALE_MAIN_ACTIVIOTY_APPLY__RETRAIN_NUM_GET,
				type: "GET",
				loading: false,
			}).then(res => {
				this.cooperateList = res.data.cooperate_category_list;
				this.retrainingList = res.data.retrain_number_list;
				this.proxyList = res.data.proxy_num_list;
				this.positionList = res.data.position_list;
				this.industryList = res.data.industry_list;
				return;
			});
		},


		// 活动详情
		GetActiveDetail(i) {
			this.$request({
				url: API._SALE_MAIN_ACTIVEITY_DETAIL_GET,
				type: "get",
				param: {
					id: this.activity_id
				}
			}).then(res => {
				this.allow_type = { 1: '', 2: '', 3: '' };
				this.activeDetail = res.data;
				let type = this.activeDetail.customer_type.split(',');
				type.forEach(ele => {
					if (ele == 1) {
						this.allow_type[1] = 1;
					}
					if (ele == 2) {
						this.allow_type[2] = 2;
					}
					if (ele == 3) {
						this.allow_type[3] = 3;
					}
				});
			});
		},
		// 保存客户
		SaveList(val) {
			this.$request({
				url: API._SALE_MAIN_ACTIVEITY_APPLY_POST,
				type: "post",
				param: {
					activity_id: this.activity_id,
					apply_list: val,
				}
			}).then(res => {
				this.visible = false;
				SignSuccess.popup({
					data: {
						result: res.data,
					}
				});
			}).catch(error => {
				this.$Message.error(error.msg);
				console.error(error);
			});

		},
		// 编辑
		handleDetail(i) {
			this.$request({
				url: API._SALE_MAIN_ACTIVEITY_APPLY_DETAIL_GET,
				type: "GET",
				param: {
					id: i,
				}
			}).then((res) => {
				this.editDate = res.data;
				this.handleAddFormList(res.data.customer_type);
				this.handleExtend(res.data.customer_type);
			});
		}
	}
};
export const PSignUp = CreatePortal({}, module.exports.default);
</script>

<style scoped lang="scss">
    ._border {
        border-bottom: 1px solid #ebeef1;
        margin-bottom: 10px;
    }
    ._drawer {
        .g-flex {
            align-items: center;
            font-weight: 500;
            ._fontbold {
                flex: 1;
            }
        }
        /deep/ .ivu-poptip-title {
            text-align: center;
        }
        /deep/ .ivu-drawer-wrap .ivu-drawer-body {
            padding: 0 !important;
        }
        /deep/ .ivu-drawer-header p,
        /deep/ .ivu-poptip-inner {
            white-space: normal;
        }
    }
    ._footer {
        width: 100%;
        position: fixed;
        bottom: 0;
        padding-left: 20px;
        text-align: left;
        background: #fff;
        height: 60px;
        line-height: 60px;
        box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
    }
    ._sige {
		height: 78vh;
		overflow-y:auto;
        padding: 20px;
        /deep/ .ivu-collapse {
            background: #f5f5f6;
            border-radius: 5px;
            .ivu-collapse-content {
                width: 100%;
            }
        }

        .api {
            font-weight: 100;
        }
    }
    ._tabs {
        /deep/ .ivu-tabs-bar {
            margin-bottom: 20px !important ;
        }
        /deep/ .ivu-tabs-nav {
            float: none !important;
            background: #f5f5f6;
		}
        /deep/ .ivu-tabs-ink-bar {
            background: none !important;
        }
        /deep/ .ivu-tabs-tab {
            color: #818794;
            margin-left: 20px;
            padding-left: 0;
            padding-right: 0;
        }
        /deep/ .ivu-tabs-nav-scroll {
            border-bottom: 2px solid #d4d7db;
        }
        /deep/ .ivu-drawer-header {
            border: none !important;
        }
        /deep/ .ivu-tabs-tab-active {
            color: #d9444f !important;
            border-bottom: 2px solid #d9444f !important;
        }
    }
</style>
