<template>
	<div ref="container" class="v-sale-customer-form v-sale-customer-intention-detail" >
		<div class="g-flex g-jc-c g-m-t-20 " >
			<i-form 
				ref="form" 
				:model="formData" 
				:rules="rules" 
				:label-width="110" 
				inline
			>
				<div class="_form-block">
					<i-form-item 
						:show-message="false" 
						:style="nameTips.res_array.length ? 'margin-bottom: 0px !important;':''"
						label="公司名称：" 
						prop="company_name"
						class="_cus-error-tip"
					>
						<i-input
							v-model="formData.company_name" 
							:maxlength="50"
							style="width:300px"
							placeholder="请输入公司名称"
							clearable
							@on-change="handleCompanyNameChange"
						/>
						<transition name="fade">
							<div>
								<div
									v-for="customer in nameTips.res_array"
									:key="customer.customer_id"
									class="ivu-form-item-error-tip"
									style="margin-bottom:0"
								>
									{{ customer.tips }}
									<span v-if="customer.can_get" class="g-operation " @click="handleSignCustomer(customer,'company_name') ">
										点击领取
									</span>
									<span v-else-if="customer.add_attention" class="g-operation " @click="handleConcernCustomer(customer) ">
										加入关注
									</span>
								</div>
								<div 
									v-if="nameTips.another_tips"
									class="ivu-form-item-error-tip"
									style="margin-bottom:0"
								>
									公司名称相似无法录入系统，如需录入请直接找超级管理员（张勇）处理
								</div>
							</div>
						</transition>
					</i-form-item>

					<i-form-item label="客户姓名：" prop="customer_name">
						<i-input 
							v-model="formData.customer_name" 
							:maxlength="10" 
							:disabled="disableAll" 
							placeholder="请输入客户姓名" 
							clearable
						/>
					</i-form-item>
					<i-form-item 
						:show-message="false" 
						:style="telTips.res_array.length ? 'margin-bottom: 0px !important;':''"
						label="客户电话："
						prop="tel"
						class="_cus-error-tip"
					>
						<i-input v-model="formData.tel" :maxlength="13" placeholder="请输入客户电话" clearable/>
						<transition name="fade">
							<div>
								<div
									v-for="customer in telTips.res_array"
									:key="customer.customer_id"
									class="ivu-form-item-error-tip"
									style="margin-bottom:0"
								>
									{{ customer.tips }}
									<span v-if="customer.can_get" class="g-operation " @click="handleSignCustomer(customer,'tel') ">
										点击领取
									</span>
								</div>
							</div>
						</transition>
					</i-form-item>
					<i-form-item label="行业：" prop="industry_id">
						<i-select 
							v-model="formData.industry_id" 
							:disabled="disableAll" 
							placeholder="请选择所属行业" 
							clearable
						>
							<i-option
								v-for="item in industryList"
								:value="item.industry_id"
								:key="item.industry_id"
							>
								{{ item.industry_name }}
							</i-option>
						</i-select>
					</i-form-item>
					<i-form-item label="信息来源：" prop="info_source_id">
						<i-select 
							v-model="formData.info_source_id" 
							:disabled="disableAll" 
							clearable 
							placeholder="请选择信息来源"
						>
							<i-option
								v-for="(item,index) in sourceList"
								:key="index"
								:value="item.source_id"
							>
								{{ item.source_name }}
							</i-option>
						</i-select>
						
						<span style="position: absolute;left: 305px;top: 0px;font-size:16px;width:60px">
							<oa-explain placement="bottom-start" content="选择该客户信息获取的渠道，如百度、微博等"/>
							<i
								v-if="$auth[377]"
								:class="disableAll ? '' : 'g-operation'"
								class="icon iconfont icon-add1 "
								style=" font-size: 16px;"
								@click="addSource"
							/>
						</span>
					</i-form-item>
					<i-form-item label="人员规模：" prop="scale_id">
						<i-select v-model="formData.scale_id" :disabled="disableAll" clearable placeholder="请选择公司规模">
							<i-option
								v-for="(item,index) in scaleList"
								:key="index"
								:value="item.scale_id"
							>
								{{ item.scale_name }}
							</i-option>
						</i-select>
					</i-form-item>
					<i-form-item label="客户等级：" prop="level">
						<i-select v-model="formData.level" :disabled="disableAll" placeholder="请选择客户等级">
							<i-option :value="0">临时客户</i-option>
							<i-option :value="1">普通客户</i-option>
							<i-option :value="2">重要客户</i-option>
						</i-select>
						<!-- eslint-disable -->
							<oa-explain 
								style="position: absolute;left: 305px;top: 0px" 
								placement="bottom-start"
							>
								<div slot="content">临时客户：保护期10天，即独家持有该客户信息10天，人数不限

普通客户：保护期90天，即独家持有该客户信息90天，最多添加40人

重要客户：保护期180天，即独家持有该客户信息180天，最多添加10人
</div>
							</oa-explain>
							<!-- eslint-enable -->
					</i-form-item>
					<i-form-item label="注册资金：" prop="capital">
						<i-input-number 
							v-model="formData.capital" 
							:disabled="disableAll" 
							:min="1" 
							:max="999999999"
							type="number"
							placeholder="请输入注册资金"/>
						<span class="_number-append">万元</span>
					</i-form-item>
					<i-form-item label="地区：" prop="location">
						<i-cascader
							:data="region3"
							v-model="formData.location"
							:disabled="disableAll"
							placeholder="请搜索选择地区"
							clearable
							filterable
							transfer
							style="width:100%"
						/>
					</i-form-item>
					<i-form-item label="网址：" prop="url">
						<i-input v-model="formData.url" :disabled="disableAll" placeholder="请输入网址" clearable/>
						<span style="position: absolute;left: 305px;top: 0px;font-size:16px;width:30px">
							<oa-explain placement="bottom-start" content="与客户相关的网址，例如客户公司官网" />
						</span>
					</i-form-item>
					<i-form-item label="详细地址：" prop="address">
						<oa-limit-words v-model="formData.address" :disabled="disableAll" :max="50" placeholder="请输入详细地址"/>
					</i-form-item>
					<i-form-item label="添加图片：" prop="name">
						<vc-imgs-picker 
							v-model="formData.image" 
							:disabled="disableAll" 
							:max="3"
							@error="handleError"
						/>
						<span class="g-pd-l-15" style="position: absolute;margin-top: -5px;color:gray">最多3张</span>
					</i-form-item>
					<i-form-item label="备注：" prop="remarks">
						<oa-limit-words 
							v-model="formData.remarks" 
							:disabled="disableAll" 
							:row="10"
							:max="200" 
							placeholder="请输入备注"/>
					</i-form-item>
				</div>
			</i-form>
		</div>
		<div class="_footer">
			<i-button @click="handleCancel">取消</i-button>
			<i-button type="primary" @click="handleSave">保存</i-button>
		</div>
	</div>
</template>

<script >
import { ImgsPicker } from 'wya-vc';
import { Form, FormItem, Input, InputNumber, Select, Option, Cascader, Button } from 'iview';
import API from '@stores/apis/root';
import LimitWords from '@components/_common/limit-words/limit-words';
import Explain from '@components/_common/explain/explain';
import { services } from '@stores/services/sale';
import { debounce } from 'lodash';
import { dataValidity } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm';
import { AddSource } from '../_common/customer/add-source';
import _s from '../_common/customer/cus-form/style.scss';

const emptyCheckField = ["customer_name", "tel", "industry_id", "info_source_id", "scale_id", 'capital', "address", "url", "remarks"];
const emptyCheckArray = ["image", "location"];
export default {
	name: 'v-sale-customer-intention-detail',
	components: {
		'vc-imgs-picker': ImgsPicker,
		'oa-limit-words': LimitWords,
		'oa-explain': Explain,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-cascader': Cascader,
		'i-button': Button
	},
	mixins: [services.industryList(), services.scaleList(), services.region3()],
	data() {
		const query = this.$route.query || {};
		return {
			show: false,
			value1: [],
			sourceList: [],
			nameTips: {
				res_array: [],
				another_tips: 0
			},
			telTips: {
				res_array: []
			},
			showRegion: false,
			formData: {
				company_name: query.company_name || '', // 公司名称
				customer_name: query.customer_name || "", // 客户名称
				tel: query.tel || "", // 客户电话
				industry_id: null, // 行业主键ID
				info_source_id: '', // 信息来源主键ID
				scale_id: null, // 公司规模主键ID
				level: 0, // 客户等级 0 临时客户 1 普通客户 2 重要客户
				province: null, // 省code
				city: null, // 市code
				area: null, // 区code
				capital: null, // 注册资本
				address: "", // 详细地址
				url: "", // 网址
				remarks: "", // 备注
				image: [],
				location: []
			},
			rules: {
				company_name: [{ required: true, validator: this.companyNameValidator, trigger: 'change' }],
				customer_name: [
					{ required: true, message: '请输入客户姓名', trigger: 'blur' },
					{ type: 'validName', validator: dataValidity, message: "客户姓名只能填写中文和英文", trigger: "blur" }
				],
				tel: [
					{ required: true, validator: this.telValidator, trigger: 'change' }
				],
				industry_id: [{ required: true, type: "number", message: '请选择所属行业', trigger: 'change' }],
				info_source_id: [{ required: true, type: "number", message: '请选择信息来源', trigger: 'change' }],
				scale_id: [{ type: "number", message: '请选择公司规模', trigger: 'change' }],
				level: [{ required: true, type: "number", message: '请选择客户等级', trigger: 'change' }],
				capital: [{ required: true, type: "number", message: '请输入注册资金', trigger: 'change' }],
				address: [],
				url: [],
				remarks: [{ max: 200, message: '备注最多200字', trigger: 'blur' }],
				image: [{ message: '请上传图片', trigger: 'blur' }],
				location: [{ required: true, type: 'array', message: '请选择所在地区', trigger: 'change' }],
			},
		};
	},
	computed: {
		disableAll() {
			return this.telTips.res_array.filter(customer => customer.customer_id !== undefined).length != 0
			 || this.nameTips.res_array.filter(customer => customer.customer_id !== undefined).length != 0;
		},
	},
	created() {
		this.loadSource();
	},
	methods: {
		addSource() {
			if (this.disableAll) return;
			AddSource.popup().then(() => {
				this.loadSource().then(res => {
					if (!this.formData.info_source_id) {
						this.formData.info_source_id = res.data[0].source_id;
					}
				});
			}).catch(res => { 
				this.loadSource();
			});
		},
		loadSource() {
			return this.$request({
				url: API._SALE_INTENTION_SOURCE_LIST_GET,
				type: "GET",
				loading: false
			}).then((res) => {
				this.sourceList = res.data;
				if (this.formData.info_source_id) {
					const exist = res.data.find(so => {
						return so.source_id == this.formData.info_source_id;
					});
					if (!exist) {
						this.formData.info_source_id = undefined;
					}
				}
				return res;
			}).catch((err) => {
				console.error(err);
			});
		},
		companyNameValidator: debounce(function (rule, val, callback) {
			if (val == '') {
				this.nameTips.res_array = [{ tips: "请输入公司名称" }];
				this.nameTips.another_tips = 0;
				return callback(new Error('请输入公司名称'));
			}
			this.$request({
				url: "_SALE_INTENTION_CHECK_NAME_GET",
				type: "GET",
				loading: false,
				param: {
					company_name: val
				}
			}).then((res) => {
				if (Array.isArray(res.data)) {
					this.nameTips = {
						res_array: []
					};
					return callback();
				} else {
					this.nameTips = res.data;
					if (res.data.res_array.length) {
						return callback(new Error('error'));
					} else {
						return callback();
					}
				}
			}).catch((res) => {});
		}, 100),
		telValidator: debounce(function (rule, val, callback) {
			if (val == '') {
				this.telTips.res_array = [{ tips: "请输入客户电话" }];
				return callback(new Error('请输入客户电话'));
			}
			this.$request({
				url: "_SALE_INTENTION_CHECK_TEL_GET",
				type: "GET",
				loading: false,
				param: {
					tel: val
				}
			}).then((res) => {
				if (Array.isArray(res.data)) {
					this.telTips = {
						res_array: []
					};
					return callback();
				} else {
					this.telTips = res.data;
					if (res.data.res_array.length) {
						return callback(new Error('error'));
					} else {
						return callback();
					}
				}
			}).catch((res) => {
			});
		}, 100),
		handleCancel() {
			if (this.isEmpty()) {
				this.$router.go(-1);
			} else { 
				Confirm.popup({ msg: "取消后你所填写的内容将无法恢复，确认取消？" }).then(() => {
					this.$router.go(-1);
				}).catch(() => {});
			}
		},
		handleSave() {
			if (this.formData.image.find(item => item.uid)) {
				this.$Message.error("请在图片上传完成后保存");
				return; 
			}
			this.$refs.form.validate().then((bool) => {
				if (!bool) return;
				const temp = { ...this.formData };
				const location = temp.location;
				temp.province = location[0];
				temp.city = location[1];
				temp.area = location[2];
				delete temp.location;
				temp.capital = parseFloat(temp.capital.toFixed(2));
				this.$request({
					url: API._SALE_INTENTION_SAVE_POST,
					type: "POST",
					param: {
						...temp
					}
				}).then((res) => {
					this.$Message.success(res.msg);
					this.$router.push('/sale/customer/intention');
				}).catch((res) => {
					this.$Message.error(res.msg);	
				});
			});
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		isEmpty() {
			for (let field of emptyCheckField) {
				if (this.formData[field]) {
					return false;
				}
			}
			for (let field of emptyCheckArray) {
				if (this.formData[field].length) {
					return false;
				}
			}
			return true;
		},
		handleCompanyNameChange(val) {
			val = val.target.value;
			if (val.includes(' ')) {
				setTimeout(() => {
					this.formData.company_name = val.replace(/ /g, '');	
				}, 10);
			}
		},
		handleSignCustomer({ company_name, customer_id }, field) {
			Confirm.popup({ msg: '确认领取 "' + company_name + '"?', title: "确认领取" }).then(() => {
				this.$request({
					url: "_SALE_SEA_GET_CUSTOMER_POST",
					type: "POST",
					param: {
						customer_id,
					},
					loading: false,
				}).then(res => {
					if (res.data.error_code) {
						this.$Message.error(res.data.error_msg);
					} else {
						this.$Message.success(res.msg);
						// this.$refs.form.validateField(field);
						this.$router.go(-1);
					}
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch(() => {});
		},
		handleConcernCustomer({ company_name, customer_id }) {
			Confirm.popup({ msg: '确认关注 "' + company_name + '" 吗?', title: "确认关注" }).then(() => {
				this.$request({
					url: "_SALE_CUSTOMER_ATTENTION_ADD_POST",
					type: "POST",
					param: {
						customer_id,
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.$router.push('/sale/customer/intention/concern');
						
				}).catch((res) => {
					this.$Message.error(res.msg);
				});

			});
		},
	}
};
</script>

<style lang="scss" >
.v-sale-customer-intention-detail{
	height: calc(100% - 55px);
    overflow-y: auto;
    margin-top: -6px;
}
</style>
