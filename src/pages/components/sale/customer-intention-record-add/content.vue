<template>
	<div
		class="v-sale-customer-form oa-sale-customer-intention-record-add g-m-t-20"
	>
		<div class="g-flex g-jc-c">
			<div class="g-pd-lr-20">
				<h2 style="color:#000;height:27px">
					{{ query.company_name }}
					<!-- 暂时隐藏提示 -->
					<i-poptip
						v-if="0"
						ref="know"
						width="300"
						class="_konw-tip"
						placement="bottom-end"
						popper-class="oa-sale-customer-intention-record-add-poptip"
						transfer
						word-wrap
					>
						<span class="g-pointer" >录入到账须知</span>
						<div slot="content">
							<!-- eslint-disable -->
							<div >①录入到账的入口：若客户首次成交，在意向客户的详情进入；若客户是再次成交或补交尾款，在成交客户的列表中找到这个客户，在列表或详情中进入；
补交尾款前必须先录入到账，录入到账审核通过后在客户合同中进行补交尾款；

②客户购买了或赠送了商学院产品必须选择线上培训或线下培训，如果客户买的产品多个都是线上或线下的，填写余额类型中的付款金额和部门分单业绩时先将这几个相同分类的产品金额相加即可（例如：客户购买了78000的线下内训和29800的招商会，那么余额类型选择线下培训，付款金额填写78000+29800=107800，部门分单填写31200+11920=43120）。

③客户分不同月份打款的，录入到账就需要分开录入，如果是一个月打款的可以一次性录入到账，成交时间填写最后一次打款时间即可。</div>
							<!-- eslint-enable -->
							<div
								class="g-tc g-pointer g-m-t-10"
								style="height:30px;font-size:13px"
								@click="handleCloseKnow"
							>
								<span class="__know-btn">知道了</span>
							</div>
						</div>
					</i-poptip>
				</h2>
				<div v-show="step==1">
					<i-form
						ref="form1"
						:model="form1"
						:rules="rule1"
						:label-width="120"
						inline
					>
						<div class="g-m-tb-20">
							<oa-title mode="red">基本信息</oa-title>
						</div>
						<div class="_form-block">
							<i-form-item label="客户合同公司：" prop="contract_company_name" class="_cus-error-tip">
								<i-input
									v-model="form1.contract_company_name"
									:maxlength="50"
									disabled
									placeholder="请输入客户合同公司"
									style="width:300px"
								/>
								<oa-explain
									style="position: absolute;left: 305px;top: 0px"
									placement="bottom-start"
									content="客户用于签订合同的公司名称"
								/>
							</i-form-item>
							<i-form-item label="我方合同公司：" prop="our_company_id">
								<i-select
									v-model="form1.our_company_id"
									style="width:300px"
									clearable
									placeholder="请选择我方合同公司"
									class="_our-company"
								>
									<i-option
										v-for="(item,index) in ourContractCompanys"
										:key="index"
										:value="item.contract_company_id"
									>
										{{ item.company_name }}
									</i-option>
								</i-select>
								<oa-explain
									style="position: absolute;left: 305px;top: 0px"
									placement="bottom-start"
									content="签订合同时我方使用的公司名称"
								/>
							</i-form-item>
							<i-form-item label="客户联系电话：" prop="link_id">
								<i-select
									v-model="form1.link_id"
									:disabled="disableLink"
									style="width:300px" 
									placeholder="请选择客户联系电话" 
									@on-change="handleLinkChange"
								>
									<i-option
										v-for="(item,index) in linkTelList"
										:key="index.link_id"
										:value="item.link_id"
									>
										{{ item.phone }}
									</i-option>

								</i-select>
							</i-form-item>
							<i-form-item label="客户姓名：" prop="customer_name">
								<i-input
									v-model="form1.customer_name"
									:maxlength="8"
									:disabled="disableCustomerName"
									placeholder="请输入客户姓名"
									style="width:300px"
									clearable
								/>
							</i-form-item>
							<i-form-item v-if="form1.link_id===0" label="客户联系电话：" prop="phone">
								<i-input v-model="form1.phone" style="width:300px" placeholder="请输入客户联系电话" clearable/>
							</i-form-item>

							<i-form-item ref="customerRole" label="客户角色：" prop="customer_role">
								<i-select 
									v-model="form1.customer_role"
									:disabled="disableCustomerRole"
									style="width:300px"
									placeholder="请选择客户角色"
									clearable
								>
									<i-option
										v-for="item in roleList"
										:value="item.customer_role_id"
										:key="item.customer_role_id"
									>
										{{ item.customer_role_str }}
									</i-option>
								</i-select>
							</i-form-item>
							<i-form-item label="微信号：" prop="wechat">
								<i-input
									v-model="form1.wechat"
									:maxlength="20"
									:disabled="disableWechat"
									placeholder="请输入微信号"
									style="width:300px"
									clearable
								/>
							</i-form-item>
							
							
							
							<i-form-item v-if="query.deal_status ==2" label="关联公司：" prop="relation_customer">
								<i-select
									ref="relation_customer"
									v-model="form1.relation_customer"
									:remote-method="loadRelationCompanys"
									:loading="searchLoading"
									:disabled="query.mode=='finance'"
									filterable
									remote
									multiple
									placeholder="请输入公司名称搜索"
									style="width:300px"
								>
									<i-option
										v-for="(item,index) in relationCompanys"
										:key="index"
										:value="item.customer_id"
									>
										{{ item.company_name }}
									</i-option>
								</i-select>
								<oa-explain
									style="position: absolute;left: 305px;top: 0px"
									title="当该客户存在多家公司时，可进行关联，防止之后掉入公海被其他人领取"
									content="举例：客户有公司A和公司B，这次用公司A签订了合同，如果不关联公司B的话，公司B可能会掉入公海被其他人领取，如果成交的话，客户其实是同一个，容易引发不必要的业绩纠纷"
								/>
							</i-form-item>
							<i-form-item label="具体行业：" prop="industry_id">
								<i-select
									v-model="form1.industry_id"
									clearable
									transfer
									placeholder="请选择行业"
									class="g-m-r-5"
									style="width:300px"
									@on-change="handleIndustryChange"
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
							<i-form-item ref="product_type_id" label="产品类型：" prop="product_type_id">
								<i-select
									v-model="form1.product_type_id"
									clearable
									transfer
									placeholder="请选择产品类型"
									class="g-m-r-5"
									style="width:300px"
								>
									<i-option
										v-for="item in productTypeList"
										:value="item.product_type_id"
										:key="item.product_type_id"
									>
										{{ item.product_type_name }}
									</i-option>
								</i-select>
							</i-form-item>
							<i-form-item label="具体产品：" prop="product_name">
								<i-input
									v-model="form1.product_name"
									:maxlength="20"
									placeholder="请输入具体产品"
									style="width:300px"
									clearable
								/>
							</i-form-item>
							
							<i-form-item label="客户类型：" prop="customer_type">
								<i-select 
									v-model="form1.customer_type"
									style="width:300px"
									placeholder="请选择客户类型" 
									clearable
								>
									<i-option
										v-for="item in customerTypeList"
										:value="item.customer_type_id"
										:key="item.customer_type_id"
									>
										{{ item.customer_type_str }}
									</i-option>
								</i-select>
							</i-form-item>
							<i-form-item label="客户微龄：" prop="wei_age">
								<i-select 
									v-model="form1.wei_age"
									style="width:300px"
									placeholder="请选择客户微龄" 
									clearable
								>
									<i-option
										v-for="item in weAgeList"
										:value="item.age_id"
										:key="item.age_id"
									>
										{{ item.age_name }}
									</i-option>
								</i-select>
							</i-form-item>


							<i-form-item
								v-if="form1.relation_customer.length>0 || checkedCustomerId.length>0"
								label="关联公司凭证："
								prop="relation_prove"
								style="width:430px"
							>
								<vc-imgs-picker
									v-model="form1.relation_prove"
									:max="5"
									@error="handleError"
								/>
							</i-form-item>
						</div>
					</i-form>
					<template v-if="relateCustomerList.length && query.deal_status ==2">
						<div class="g-m-tb-20">
							<span class="_title-bar g-bg-red-mid"/>
							<span class="g-fs-14 g-m-lr-5 g-c-red-mid">可关联客户</span>
						</div>
						<i-checkbox-group v-model="checkedCustomerId" >
							<i-table
								:columns="relateColumns"
								:data="relateCustomerList"
								class="g-col"
								stripe
							/>
						</i-checkbox-group>
					</template>

				</div>
				<div v-if="step==2">
					<i-form
						ref="form2"
						:model="form2"
						:rules="rule2"
						:label-width="120"
						inline>
						<div class="g-m-tb-20">
							<oa-title mode="red">款项信息</oa-title>
						</div>
						<div class="_form-block">
							<i-form-item
								:label-width="120"
								:rules="rule2.is_share"
								prop="is_share"
								label="是否分单："
								
							>
								<i-radio-group
									v-model="form2.is_share"
									style="display: inline-block;"
									@on-change="calcAfterPerformance"
								>
									<i-radio :label="1" style="margin-right:45px">
										是
									</i-radio>
									<i-radio :label="0">
										否
									</i-radio>
								</i-radio-group>
							</i-form-item>
							<i-form-item
								v-if="form2.is_share"
								:label-width="120"
								:rules="rule2.share_method"
								prop="share_method"
								label="分单方式："
							>
								<i-checkbox-group v-model="form2.share_method" @on-change="calcAfterPerformance"	>
									<i-checkbox :label="1" >
										个人分单
									</i-checkbox>
									<i-checkbox :label="2">
										部门分单
									</i-checkbox>
									<i-checkbox :label="3">
										外部合作
									</i-checkbox>
								</i-checkbox-group>
							</i-form-item>
							<span v-else>
								<i-form-item :required="false" :label-width="120" label="分单后业绩：" style="margin-right: 0px; !important">
									<i-input-number
										:value="form2.after_share_performance"
										:min="0"
										:max="20000000"
										:active-change="false"
										:precision="2"
										disabled
										clearable
										placeholder="填写缴款方式后显示"
										style="width:300px"
									/>
								</i-form-item>
							</span>
						</div>
						<template v-if="form2.is_share">
							<template v-if="form2.share_method.includes(1)">
								<div style="margin-left:20px;" class="g-m-b-10">
									<span class="g-c-black2 g-bold">个人分单</span> 
								<span class="g-c-black5">（分给市场部同事或商学院讲师）</span></div>
								<div class="_pay_method g-m-b-10" >
									<div>
										<i-form-item
											:label-width="90"
											:rules="rule2.share_type"
											prop="share_type"
											label="分单类型："
											style="width:410px"
										>
											<i-radio-group
												v-model="form2.share_type"
												style="display: inline-block;"
												@on-change="calcAfterPerformance"
											>
												<i-radio :label="2">
													固定金额
												</i-radio>
												<i-radio :label="1">
													固定比例
												</i-radio>
											</i-radio-group>
										</i-form-item>
										<br>
										<i-form-item
											:label-width="90"
											prop="staff_share"
											label="分单比例："
											class="_staff-share"
										>
											<div class="">
												<i
													v-if="form2.staff_share.length==0"
													class="icon iconfont icon-add1 g-c-blue-mid g-m-lr-10 g-pointer"
													style="display: inline-block;width:300px"
													@click="handleAddStaffShare"
												/>
												<template v-if="form2.share_type==2">
													<i-form-item
														v-for="(staff,index) in form2.staff_share"
														:key="staff.staff_id+'2'"
														:label-width="90"
														:rules="rule2.performance2"
														:label="staff.staff_name+'：'"
														:prop="'staff_share.'+index+'.performance2'"
														style="margin-right: 5px;"
													>
														<i-input-number
															v-model="staff.performance2"
															:min="0"
															:max="20000000"
															:active-change="false"
															:precision="2"
															placeholder="请输入金额"
															clearable
															style="width:120px"
															@on-change="calcAfterPerformance"
														/>
														<span class="_number-append">元</span>
														<span>
															<i
																class="icon iconfont icon-remove-circle g-c-red-mid g-pointer"
																style="position: relative;top: 3px;"
																@click="handleRemoveStaffShare(staff,index)"
															/>
															<i
																v-if="index ==form2.staff_share.length-1 && form2.staff_share.length<4"
																class="icon iconfont icon-add1 g-c-blue-mid g-m-r-10 g-pointer"
																style="position: relative;top: 3px;"
																@click="handleAddStaffShare"
															/>
														</span>
													</i-form-item>
												</template>
												<template v-else-if="form2.share_type==1">
													<i-form-item
														v-for="(staff,index) in form2.staff_share"
														:key="staff.staff_id+'1'"
														:label-width="90"
														:rules="rule2.performance1"
														:label="staff.staff_name+':'"
														:prop="'staff_share.'+index+'.performance1'"
														style="margin-right: 5px;margin-bottom: 0px !important;"
													>
														<i-input-number
															v-model="staff.performance1"
															:min="0"
															:max="100"
															:precision="0"
															placeholder="请输入比例"
															clearable
															style="width:120px"
															@on-change="calcAfterPerformance"
														/>
														<span class="_number-append">%</span>
														<span>
															<i
																class="icon iconfont icon-remove-circle g-c-red-mid g-pointer"
																@click="handleRemoveStaffShare(staff,index)"
															/>
															<i
																v-if="index ==form2.staff_share.length-1 && form2.staff_share.length<4"
																class="icon iconfont icon-add1 g-c-blue-mid g-m-r-10 g-pointer"
																@click="handleAddStaffShare"
															/>
														</span>
													</i-form-item>
												</template>
											</div>
										</i-form-item>
									</div>
								</div>
							</template>
							<template v-if="form2.share_method.includes(2)">
								<div style="margin-left:20px;" class="g-m-b-10">
									<span class="g-c-black2 g-bold">部门分单</span>
									<span class="g-c-black5">（无谈判讲师分给商学院业绩）</span>
								</div>
								<div v-if="departAll.length" class="_pay_method g-m-b-10">
									<div v-for="(dep,index) in form2.depart_share" :key="dep.uid" class="g-relative">
										<i-form-item
											:label-width="90"
											:prop="'depart_share.' + index + '.depart_id'"
											:rules="rule2.depart_share_depart"
											label="分单部门："
											style="width: 410px;"
										>
											<i-select
												v-model="dep.depart_id"
												transfer
												clearable
												placeholder="请选择分单部门"
												style="width:300px"
											>
												<i-option
													v-for="(item,index) in getFilterdDepart(dep.depart_id)"
													:key="index"
													:value="item.value"
													:disabled="item.disabled"
												>
													{{ item.label }}
												</i-option>
											</i-select>
										</i-form-item>
										<i-form-item
											:label-width="90"
											:prop="'depart_share.' + index + '.performance'"
											:rules="rule2.depart_share_performance"
											label="分单金额："
											style="width: 410px;"
										>
											<i-input-number
												v-model="dep.performance"
												:min="0"
												:max="20000000"
												:active-change="false"
												:precision="2"
												clearable
												placeholder="请输入分单金额"
												style="width:300px"
												@on-change="calcAfterPerformance"
											/>
											<span
												style="position:absolute;right: -40px;width: 50px;top:0"
											>
												<i
													v-if="form2.depart_share.length>1"
													class="icon iconfont icon-remove-circle g-c-red-mid g-pointer"
													@click="handleRemoveDepartShare(dep,index)"
												/>
												<i
													v-if="index == form2.depart_share.length-1 && form2.depart_share.length<2"
													class="icon iconfont icon-add1 g-c-blue-mid g-pointer"
													@click="handleAddDepartShare"
												/>
											</span>
										</i-form-item>
									</div>
								</div>
							</template>
							<template v-if="form2.share_method.includes(3)">
								<div style="margin-left:20px;" class="g-m-b-10">
									<span class="g-c-black2 g-bold">外部合作</span>
									<span class="g-c-black5">（跟其他公司合作的项目）</span>
								</div>
								<div class="_pay_method g-m-b-10">
									<i-form-item
										:label-width="90"
										:rules="rule2.cooperation_share"
										prop="cooperation_share.performance"
										label="分单金额："
									>
										<i-input-number
											v-model="form2.cooperation_share.performance"
											:min="0"
											:max="20000000"
											:active-change="false"
											:precision="2"
											clearable
											placeholder="请输入分单金额"
											style="width:300px"
											@on-change="calcAfterPerformance"
										/>
									</i-form-item>
								</div>
							</template>
						</template>
						<div v-if="form2.is_share">
							<i-form-item :label-width="120" label="分单后业绩：" >
								<i-input-number
									:value="form2.after_share_performance"
									:min="0"
									:max="20000000"
									:active-change="false"
									:precision="2"
									disabled
									clearable
									placeholder="填写缴款方式后显示"
									style="width:300px"
								/>
							</i-form-item>
						</div>
						<div style="width:110px;text-align: right;padding: 10px 12px 10px 0;">
							<span
								style="display: inline-block;margin-right: 4px;line-height: 1;font-family: SimSun;font-size: 12px;color: #ed4014;"
							>*</span>
							缴款方式
						</div>
						<div
							v-for="(item,index) in form2.payment_method"
							:key="item.uid"
							class="_form-block _pay_method g-m-b-20"
							style="position:relative"
						>
							<i-form-item
								:label-width="90"
								:prop="'payment_method.' + index + '.payment_time'"
								:rules="rule2.payment_time"
								label="付款时间："
							>
								<i-date-picker
									v-model="item.payment_time"
									:options="{disabledDate:disableDate}"
									transfer
									type="date"
									style="width:300px"
									clearable
									placeholder="请选择付款时间"
								/>
							</i-form-item>
							<i-form-item
								:label-width="90"
								:prop="'payment_method.' + index + '.method_id'"
								:rules="rule2.method_id"
								label="缴款方式："
							>
								<i-cascader
									:data="payMethods"
									v-model="item.method_id"
									style="width:300px"
									clearable
									placeholder="请选择缴款方式"
								/>
								<span
									v-if="item.method_id"
									style="position:absolute;color:gray;right:4px;top: 26px;"
								>
									{{ getPoundageMsg(item.method_id) }}
								</span>
								<span style="position:absolute;right: -40px;width: 50px;top:0">
									<i
										v-if="form2.payment_method.length>1"
										class="icon iconfont icon-remove-circle g-m-r-5 g-c-red-mid g-pointer"
										@click="handleRemovePayType(index)"
									/>
									<i
										v-if="index ==form2.payment_method.length-1"
										class="icon iconfont icon-add1 g-c-blue-mid  g-pointer"
										@click="handleAddPayType(index)"
									/>
								</span>
							</i-form-item>
							<i-form-item
								:label-width="90"
								:prop="'payment_method.' + index + '.payment_amount'"
								:rules="rule2.payment_amount_"
								label="缴款金额："
							>
								<i-input-number
									v-model="item.payment_amount"
									:min="0"
									:max="20000000"
									:active-change="false"
									:precision="2"
									placeholder="请输入金额"
									style="width:300px"
									@on-change="calcPaymentAmount"
								/>
							</i-form-item>
							<i-form-item
								:label-width="90"
								:prop="'payment_method.' + index + '.image_url'"
								:rules="rule2.image_url"
								label="上传凭证："
							>
								<vc-imgs-picker
									v-model="item.image_url"
									:max="3"
									style="width: 340px;"
									@error="handleError"
								/>
							</i-form-item>
						</div>
						<div class="_form-block">
							<i-form-item label="实付金额：" prop="payment_amount">
								<i-input-number
									v-model="form2.payment_amount"
									:min="0"
									:max="20000000"
									:precision="2"
									:active-change="false"
									placeholder="填写缴款方式后显示"
									disabled
									style="width:300px"
								/>
								<oa-explain
									style="position: absolute;left: 305px;top: 0px"
									placement="bottom-start"
									title="客户实际支付的金额"
									content="举例：客户想购买产品A，通过谈判最后确定的价格为10万，客户打款的10万为实付金额"
								/>
							</i-form-item>
							<i-form-item label="收款公司：" prop="received_company_id">
								<i-select
									v-model="form2.received_company_id"
									transfer
									clearable
									placeholder="请选择收款公司"
									style="width:300px"
								>
									<i-option
										v-for="(item,index) in ourContractCompanys"
										:key="index"
										:value="item.contract_company_id"
									>
										{{ item.company_name }}
									</i-option>
								</i-select>
								<oa-explain
									style="position: absolute;left: 305px;top: 0px"
									placement="bottom-start"
									content="客户打款时我方用于收款的公司主体，同时作为之后签订合同的我方公司名"
								/>
							</i-form-item>
							<i-form-item label="款项标签：" prop="payment_label">
								<i-select
									v-model="form2.payment_label"
									multiple
									transfer
									placeholder="请选择款项标签"
									style="width:300px"
									@on-change="handlePaymentLabelChange"
								>
									<i-option
										v-for="(item,index) in getFilterLabelList()"
										:value="item.label_id"
										:key="index" >
										{{ item.label_name }}
									</i-option>
								</i-select>
							</i-form-item>
							<i-form-item :class="{'_hide-required':!isOriginalTimeRequired}" label="原始时间：" prop="original_time" >
								<i-date-picker
									v-model="form2.original_time"
									transfer
									type="date"
									style="width:300px"
									clearable
									placeholder="请选择付款时间"
								/>
							</i-form-item>
							<i-form-item label="备注：" prop="remark">
								<oa-limit-words
									v-model="form2.remark"
									width="300px"
									placeholder="若有优惠，请注明优惠金额；若有分单，请注明分单人（部门）和分单金额；若分业绩给商学院，注明讲师姓名和金额"
								/>
							</i-form-item>
						</div>
						<template v-if="hasProductInfo">
							<div class="g-m-tb-20">
								<oa-title mode="red">选择产品<span class="g-fs-12 g-c-black4">（补交尾款不需要选择）</span></oa-title>
							</div>

							<i-form-item label="选择产品：" prop="products">
								<div style="max-width:802px;min-height:150px">
									<div class="_form-type">
										<i
											class="icon iconfont icon-add1 __icon"
											@click="handleChooseProduct"
										/>
									</div>
									<span 
										v-for="(item) in selectProducts" 
										:key="item.product_id+'-'+item.parent_product_id" 
										class="_source-item"
									>
										{{ item.product_name }}
										<i
											class="icon iconfont icon-guanbi g-pointer g-m-l-10"
											style="font-size: 12px;"
											@click="handleCloseProduct(item)"
										/>
									</span>
								</div>
							</i-form-item>
						</template>
					</i-form>
				</div>
				<div class="_footer">
					<span v-if="step===1">
						<i-button @click="handleCancel">取消</i-button>
						<i-button type="primary" @click="handleNext">下一步</i-button>
					</span>
					<span v-else>
						<i-button @click="handlePre">上一步</i-button>
						<i-button :loading="saveLoading" type="primary" @click="handleSave">保存</i-button>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ImgsPicker, Fragment } from "wya-vc";
import { Poptip, Tag, Checkbox, Table, Tooltip } from 'iview';
import LimitWords from "@common/limit-words/limit-words";
import Title from '@common/title/title';
import Explain from '@components/_common/explain/explain';
import { services } from "@stores/services/sale";
import API from "@stores/apis/root";
import { dataValidity, getItem, uid, objRegex } from "@utils/utils";
import service from '@utils/service';
import moment from "moment";
import { debounce } from "lodash";
import { Confirm } from '@common/confirm/confirm';
import _s from "../_common/customer/cus-form/style";
import iview from "../_common/iview";
import { ChooseProduct } from '../_common/customer/choose-product';
import { ChooseStaff } from '../_common/customer/choose-staff';
import AutoTooltip from '../../_common/auto-tooltip/auto-tooltip.vue';
import AutoPoptip from '../../_common/auto-poptip/auto-poptip.vue';


const routeName = {
	add: "录入到账",
	update: "编辑录入到账",
	readd: "重新录入到账"
};
export default {
	name: "v-sale-customer-form-v-sale-customer-intention-detail",
	components: {
		"vc-imgs-picker": ImgsPicker,
		"vc-fragment": Fragment,
		"oa-limit-words": LimitWords,
		'i-poptip': Poptip,
		'i-tag': Tag,
		'oa-explain': Explain,
		'oa-title': Title,
		'i-table': Table,
	},
	mixins: [
		iview,
		services.payMethods(),
		services.departAll(),
		services.firstDepartId(),
		services.paymentLabel(),
		// services.industryTree(), 
		services.industryList(),

		services.roleList(),
		services.customerTypeList(),
		services.weAgeList(),
		services.customerProductType()
	],
	data() {
		const { query = {} } = this.$route;
		query.staff_id && (query.staff_id = +query.staff_id);
		return {
			// 路由参数申明
			query: {
				staff_id: '', // 邀约人id  新增时从路由获取，编辑时从详情获取
				staff_name: '', // 邀约人名称  新增时从路由获取，编辑时从详情获取
				customer_id: '', // 客户id
				deal_status: '2', // deal_status  1已成交的 2是未成交的
				company_name: '', // 客户公司名称 新增时从路由获取，编辑时从详情获取
				contract_company_id: '', // 合同公司id
				payment_id: '', // 到账记录id
				mode: 'sale', // 或 finance
				action: 'add', // 操作类型 add/update/readd
				...query
			},
			saveLoading: false,
			step: 1,
			searchLoading: false,
			relationCompanys: [], // select 下拉
			ourContractCompanys: [],
			selectProducts: [],
			form1: {
				customer_id: query.customer_id,
				customer_name: query.customer_name,
				contract_company_id: query.contract_company_id,
				contract_company_name: query.company_name,
				phone: "",
				our_company_id: undefined,
				relation_customer: [],
				relation_prove: [],
				relate_id: '',
				// 2.2.3新增参数
				"customer_type": '', // 客户类型
				"link_id": '', // 关联主键
				"customer_role": '', // 客户角色ID
				"wechat": "", // 微信号
				// industry: [],
				industry_id: '',
				// 2.2.7 客户案例新增参数
				product_type_id: '',
				product_name: '',
				wei_age: ''

			},
			form2: {
				is_share: 0,
				share_method: [1],
				share_type: 2, // 个人分单类型 1 比例  2  金额
				staff_share: [], // [{ staff_name: '檀过问', staff_id: 1, performance1: 30,performance2:null }],
				depart_share: [{ depart_id: '', performance: null, share_type: 2, uid: uid() }],
				cooperation_share: { performance: null, share_type: 2 },
				payment_label: [],
				original_time: "",
				payment_amount: null,
				received_company_id: undefined,
				after_share_performance: null,
				payment_method: [
					{
						payment_time: undefined, // 付款时间
						payment_amount: null, // 金额
						method_id: [], // 缴款方式
						image_url: [],
						uid: uid()
					}
				],
				remark: "",
				product_ids: [],
			},
			rule1: {
				customer_name: [
					{ required: true, message: "请输入客户姓名", trigger: "blur" },
					{ type: 'validName', validator: dataValidity, message: "客户姓名只能填写中文和英文", trigger: "blur" }
				],
				contract_company_name: [{ required: true, validator: this.companyNameValidator, trigger: "change" }],
				phone: [
					{ required: true, message: "请输入客户联系电话", trigger: "blur" },
					{ type: "validMobile", message: "手机号格式不正确", validator: dataValidity, trigger: "blur" }
				],
				our_company_id: [{ required: true, type: "number", message: "请选择我方合同公司", trigger: "change" }],
				relation_customer: [{ validator: this.relationCustomerValidity, trigger: "change" }],
				relation_prove: [{ required: true, type: 'array', message: "请上传关联公司凭证", trigger: "change" }],
				link_id: [{ required: true, type: "number", message: "请选择客户联系电话", trigger: "change" }],
				customer_type: [{ required: true, type: "number", message: "请选择客户类型", trigger: "change" }],
				customer_role: [{ required: true, type: "number", message: "请选择客户角色", trigger: "change" }],
				wechat: [{ validator: dataValidity, type: 'validWeChat', trigger: 'blur' }],
				// industry: [{ required: true, type: 'array', message: "请选择行业", trigger: "change" }],
				industry_id: [{ required: true, type: 'number', message: "请选择行业", trigger: "change" }],
				wei_age: [{ required: true, type: 'number', message: "请选择客户微龄", trigger: "change" }]
			},
			rule2: {
				payment_amount: [{ required: false, type: "number", message: "请输入实付金额", trigger: "blur" }],
				is_share: [{ required: true, type: 'number', message: "请选择是否分单", trigger: "change" }],
				share_method: [{ required: true, type: "array", message: "请选分单方式", trigger: "change" }],
				share_type: [{ required: true, type: 'number', message: '请选择分单类型', trigger: 'change' }],
				staff_share: [{ required: true, type: 'array', message: "请选择分单人", trigger: 'change' }],
				performance1: [
					{ required: true, type: "number", message: "请输入分单比例", trigger: "blur" },
					{ validator: this.performance1Validator, trigger: "blur" }
				],
				performance2: [
					{ required: true, type: "number", message: "请输入分单金额", trigger: "blur" },
					{ validator: this.performance2Validator, trigger: "blur" }
				],
				depart_share_depart: [{ required: true, type: 'number', message: "请选择分单部门", trigger: 'change' }],
				depart_share_performance: [{ required: true, type: 'number', message: "请输入分单金额", trigger: 'blur' }],
				cooperation_share: [{ required: true, type: 'number', message: "请输入分单金额", trigger: 'blur' }],
				payment_label: [{ required: true, type: "array", message: "请选择款项标签", trigger: "change" }],
				original_time: [{ required: true, validator: this.originalTimeValidator, trigger: "change" }],
				method_id: [{ required: true, type: "array", message: "请选择缴款方式", trigger: "change" }],
				received_company_id: [{ required: true, type: "number", message: "请选择收款公司", trigger: "change" }], 
				remark: [],
				payment_time: [{ required: true, type: "date", message: "请选择付款时间", trigger: "change" }],
				payment_amount_: [{ required: true, type: "number", message: "请输入缴款金额", trigger: "blur" }],
				image_url: [{ required: true, type: "array", message: "请上传缴款凭证", trigger: "change" }]
			},
			hasProductInfo: 1,
			linkTelList: [],
			disableWechat: true,
			disableCustomerRole: true,
			disableCustomerName: true,
			disableLink: false,
			// 	{
			//     "customer_id": 398953,    // 关联出来的客户主键
			//     "same_tel": [    // 相同的电话数组
			//         {
			//             "link_id": 17318,
			//             "staff_id": 1,    // 添加人id
			//             "customer_id": 398953,
			//             "customer_type": 1,
			//             "customer_name": "客户",
			//             "original_tel": "13155558888",
			//             "customer_role": "法人",
			//         }
			//     ],
			//     "company_name": "红薯",    // 公司名
			//     "staff_name": "小小一（杭三1部）",    // 负责人
			//     "can_get": 0    // 是否可以领取
			// }
			relateColumns: [
				{
					title: ' ',
					key: '-',
					width: 120,
					render: (h) => {
						return <span class="_same-tag">相同电话号码</span>;
					}

				},
				{
					title: '公司名称',
					key: 'company_name',
					width: 200,
					render: (h, { row }) => {
						return <AutoTooltip content={row.company_name} theme="dark" placement="bottom" labelClass=" "/>;

					}
				},
				{
					title: '相同联系方式',
					key: 'same_tel',
					minWidth: 150,
					render: (h, { row }) => {
						const links = row.same_tel.map(i => ({ label: i.customer_name + '/' + i.customer_role + '/' + i.original_tel }));
						return <AutoPoptip data={links} labelClass=" "/>;
					}
				},
				{
					title: '负责人',
					key: 'staff_name',
					minWidth: 150,
				},
				{
					title: '操作',
					key: '-',
					width: 150,
					render: (h, { row, index }) => {
						return <span onClick={() => this.handleCheckTel(row)}><Checkbox label={row.customer_id}>关联此公司</Checkbox></span>;
					}
				}




			],
			relateCustomerList: [ // table数据
				// {
			    // "customer_id": 398953, // 关联出来的客户主键
			    // "same_tel": [ // 相同的电话数组
			    //     {
			    //         "link_id": 17318,
			    //         "staff_id": 1, // 添加人id
			    //         "customer_id": 398953,
			    //         "customer_type": 1,
			    //         "customer_name": "客户",
			    //         "original_tel": "13155558888",
			    //         "customer_role": "法人",
				// 		},
				// 		{
			    //         "link_id": 17318,
			    //         "staff_id": 1, // 添加人id
			    //         "customer_id": 398953,
			    //         "customer_type": 1,
			    //         "customer_name": "客户",
			    //         "original_tel": "13155558888",
			    //         "customer_role": "法人",
				// 		},
				// 		{
			    //         "link_id": 17318,
			    //         "staff_id": 1, // 添加人id
			    //         "customer_id": 398953,
			    //         "customer_type": 1,
			    //         "customer_name": "客户",
			    //         "original_tel": "13155558888",
			    //         "customer_role": "法人",
			    //     }
			    // ],
			    // "company_name": "红薯", // 公司名
			    // "staff_name": "小小一（杭三1部）", // 负责人
			    // "can_get": 0 // 是否可以领取
				// },
				// {
			    // "customer_id": 398993, // 关联出来的客户主键
			    // "same_tel": [ // 相同的电话数组
			    //     {
			    //         "link_id": 17318,
			    //         "staff_id": 1, // 添加人id
			    //         "customer_id": 398953,
			    //         "customer_type": 1,
			    //         "customer_name": "客户",
			    //         "original_tel": "13155558888",
			    //         "customer_role": "法人",
			    //     }
			    // ],
			    // "company_name": "红薯", // 公司名
			    // "staff_name": "小小一（杭三1部）", // 负责人
			    // "can_get": 0 // 是否可以领取
				// }
			],
			checkedCustomerId: []


		};
	},
	computed: {
		isOriginalTimeRequired() {
			return this.form2.payment_label.includes(3) || this.form2.payment_label.includes(5);
		},
		productTypeList() {
			const industry = this.customerProductType.find(i => i.industry_id === this.form1.industry_id);
			if (industry && industry.product_type_list) {
				return industry.product_type_list;
			} else return [];
		
		}
	},
	created() {
		if (this.query.payment_id) {
			this.loadPaymentRecord();
		}
		this.loadOurContractCompanys();
		this.$emit("create", [
			{ name: routeName[this.query.action], path: "" }
		]);
		
	},
	mounted() {
		if (this.query.customer_id) {
			// 查看是否之前有录入成功过，有则把（第一条）基本信息填进去
			this.loadPaymentCustomerCompanys(this.query.customer_id, this.query.contract_company_id);
			this.loadRelateCompany(this.query.customer_id);
		}
		// if (this.query.deal_status == '1') {
		// 	this.disableLink = true;
		// }
	},
	methods: {
		handleCancel() {
			Confirm.popup({
				msg: "取消后你所填写的内容将无法恢复，确认取消？"
			}).then(() => {
				this.$router.go(-1);
			}).catch(() => {});
		},
		loadOurContractCompanys() {
			this.$request({
				url: "_SALE_PAYMENT_OUR_CONTRACT_COMPANY_GET",
				type: "GET",
				param: {
					customer_id: this.query.customer_id
				},
				loading: false,
			}).then(res => {
				this.ourContractCompanys = res.data;
				const com = this.ourContractCompanys.find(company => company.selected);
				if (com) {
					this.form1.our_company_id = com.contract_company_id;
					this.form2.received_company_id = com.contract_company_id;
				}
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		companyNameValidator: debounce(function (rule, value, callback) {
			if (this.query.deal_status == '1') return callback();
			if (value) {
				this.$request({
					url: "_SALE_PAYMENT_VALIDATE_CUSTOMER_COMPANY",
					type: "GET",
					loading: false,
					param: {
						search: value,
						customer_id: this.form1.customer_id,
						contract_company_id: this.query.contract_company_id
					}
				}).then(res => {
					if (res.data.msg) {
						return callback(new Error(res.data.msg));
					} else { callback(); }
				}).catch(res => {});
			} else {
				callback(new Error("请输入公司名称"));
			}
		}, 200),
		originalTimeValidator(rule, value, callback) {
			if (this.isOriginalTimeRequired && !value) {
				callback('请选择付款时间');
			} else {
				callback();
			}
		},
		handleNext() {
			this.$refs.form1.validate().then(bool => {
				if (!bool) return;
				if (this.form1.relation_prove.find(item => item.uid)) {
					this.$Message.error("请在凭证上传完成后进入下一步");
					return;
				}
				this.step = 2;
			});
		},
		handlePre() {
			this.step = 1;
		},
		async validateForm2() {
			const bool = await this.$refs.form2.validateAndScroll();
			if (!bool) return false;
			if (this.form2.payment_method.find(item => {
				return item.image_url.find(it => it.uid);
			})) {
				this.$Message.error("请在凭证上传完成后保存");
				return false;
			}
			// 付款时间同月验证
			const payMethods = this.form2.payment_method;
			if (payMethods.length > 1) {
				const paymentMounth = payMethods[0].payment_time.getMonth();
				for (let i = 0; i < payMethods.length; i++) {
					if (paymentMounth != payMethods[i].payment_time.getMonth()) {
						this.$Message.error('付款时间必须是同一月份');
						return false;
					}
				}
			}
			// 个人分单比例验证
			if (this.form2.share_method.includes(1)) {
				if (this.form2.share_type == 1) {
					let all = 0;
					this.form2.staff_share.forEach(staff => {
						all += staff.performance1 || 0;
					});
					if (all > 100) {
						this.$Message.error('个人分单比例之和不能大于100%');
						return false;
					}
				}
			}
			// 分单后业绩验证
			if (this.form2.after_share_performance < 0) {
				this.$Message.error('分单后业绩不能小于0');
				return false;
			}
			return true;
		},
		async handleSave() {
			const bool = await this.validateForm2();
			if (!bool) return;
			this.saveLoading = true;
			let res;

			// 验证保护期
			if (this.query.deal_status == '2') {
				res = await this.$request({
					url: "_SALE_PAYMENT_PROTECT",
					type: "GET",
					param: { customer_id: this.form1.customer_id },
					loading: false
				}).catch(res_ => {
					this.saveLoading = false;
					this.$Message.error(res_.msg);
					return res_;
				});
			} else {
				res = { status: 1, data: { can_save: 1 } };
			}

			if (res.status) {
				if (!res.data.can_save) {
					const result = await Confirm.popup({
						title: "提示",
						msg: res.data.tips,
						cancelText: "",
						okText: "知道了"
					}).catch(() => {});
					this.$router.go(-1);
					return;
				} else if (res.data.tips) {
					const result = await Confirm.popup({
						title: "提示",
						msg: res.data.tips
					}).then(() => {
						return 1;
					}).catch(() => {
						return 0;
					});
					if (!result) {
						this.saveLoading = false;
						return;
					}
				}
			} else {
				this.saveLoading = false;
				this.$Message.error(res.msg);
				return;
			}

			// 提示不分单给创建人或添加人
			res = await this.$request({
				url: "_SALE_SEA_GET_STAFF_FOR_PAYMENT",
				type: "GET",
				param: {
					customer_id: this.form1.customer_id
				},
				loading: false,
			}).catch((res_) => {
				return res_;
					
			});
			if (res.status == 0) {
				this.$Message.error(res.msg);
				this.saveLoading = false;
				return;
			} else {
				let hasSame = false;
				if (res.data.includes(this.query.staff_id)) {
					hasSame = true;
				} else {
					const exist = res.data.find(staffId => {
						return this.form2.staff_share.find(staff => {
							return staff.staff_id == staffId;
						});
					});
					if (exist) hasSame = true;
				}
				if (!hasSame) {
					const ok = await Confirm.popup({
						title: '提示',
						msg: "系统检测到创建人或绕前台电话添加人与邀约人不是同一个人，确认不分单给相应的创建人或添加人？"
					}).then(() => true).catch(() => false);
					if (!ok) {
						this.saveLoading = false;
						return;
					}
				}

			}
			
			// 验证通过后
			let data = { ...this.form1, ...this.form2 };
			data.relation_customer = [...data.relation_customer];
			this.checkedCustomerId.forEach(id => {
				if (!data.relation_customer.includes(id)) {
					data.relation_customer.push(id);
				}
			});
			// 分单格式化
			if (data.is_share) {
			// 个人分单
				if (data.share_method.includes(1)) {

					data.staff_share = data.staff_share.map(staff => ({
						...staff,
						performance: staff['performance' + data.share_type],
						share_type: data.share_type,
						is_invite_staff: 0
					}));
					data.staff_share.forEach(staff => {
						delete staff.performance1;
						delete staff.performance2;
					});
				} else {
					data.staff_share = [];
				}
				// 部门分单
				if (!data.share_method.includes(2)) {
					data.depart_share = [];
				}
				// 外部分单
				if (data.share_method.includes(3)) {
					data.cooperation_share = [data.cooperation_share];
				} else {
					data.cooperation_share = [];
				}
			} else {
				data.staff_share = [];
				data.depart_share = [];
				data.cooperation_share = [];
			}
			if (data.original_time) {
				data.original_time = moment(data.original_time).format(
					"YYYY-MM-DD"
				);
			}
			data.payment_method = data.payment_method.map(item => {
				const temp = { ...item };
				temp.payment_time = moment(temp.payment_time).format(
					"YYYY-MM-DD"
				);
				return temp;
			});
			data = JSON.parse(JSON.stringify(data));
			data.payment_method.forEach(item => {
				item.item_id = item.method_id[1];
				item.method_id = item.method_id[0];
			});
			data.which_module = this.query.mode;

			let url = API._SALE_PAYMENT_SAVE_POST;
			if (this.query.action == "update") {
				data.payment_id = this.query.payment_id;
				url = API._SALE_PAYMENT_UPDATE_POST;
			} else if (this.query.action == "readd") {
				data.original_payment_id = this.query.payment_id;
			}
			// 添加产品信息
			// data.product_ids = this.getChildProducts();
			if (!this.checkProduct(data.product_ids)) {
				this.popError('不能选择相同的产品或子产品');
				this.saveLoading = false;
				return;
			}
			if (!this.checkSharePerormance()) {
				this.popError('市场部所分得的业绩必须大于0，请重新填写分单信息');
				this.saveLoading = false;
				return; 
			}
			// data.industry_id = data.industry[0];
			// data.industry_id = data.industry[1];
			// data.industry_id = data.industry[2];
			// delete data.industry;
			this.$request({
				url,
				type: "POST",
				loading: false,
				param: {
					...data
				}
			}).then(res1 => {
				this.$Message.success(res1.msg);
				if (this.query.mode == 'sale') {
					this.$router.replace({
						path: '/sale/customer/deal/arrive/success',
						query: {
							payment_id: res1.data.payment_id,
							company_name: this.form1.contract_company_name
						}
					});
				} else if (this.query.mode == 'finance') {
					this.$router.push({
						path: '/finance/customer/achi',
						query: {
							// staff_search: this.query.staff_name
						}
					});
				}
			}).catch(res1 => {
				this.popError(res1.msg);
				this.saveLoading = false;
			});
		},
		handleAddPayType() {
			this.form2.payment_method.push({
				payment_time: undefined, // 付款时间
				payment_amount: null, // 金额
				method_id: [], // 缴款方式
				image_url: [],
				uid: uid()
			});
		},
		handleRemovePayType(index) {
			this.form2.payment_method.splice(index, 1);
			this.calcPaymentAmount();
			this.calcAfterPerformance();
		},
		loadRelationCompanys(query) {
			this.searchLoading = true;
			this.$request({
				url: API._SALE_PAYMENT_RELATION_COMPANY_GET,
				type: "GET",
				loading: false,
				param: {
					search: query,
					customer_id: this.form1.customer_id
				}
			}).then(res => {
				this.searchLoading = false;
				const index = res.data.findIndex(item => {
					return item.customer_id == this.form1.customer_id;
				});
				if (index != -1) {
					res.data.splice(index, 1);
				}
				this.relationCompanys = res.data;
			}).catch(res => {
				this.searchLoading = false;
				this.$Message.error(res.msg);
			});
			// this.$refs.relation_customer.$children[0].resetInputState();
		},
		relationCustomerValidity(rule, value, callback) {
			if (value.length > 10) {
				return callback(new Error("关联公司数量不得大于10个"));
			} else {
				return callback();
			}
		},
		relationProveValidity(rule, value, callback) {
			if (this.form1.relation_customer.length === 0) return callback();
			if (value.length > 5) {
				return callback(new Error("关联公司凭证最多5张"));
			} else if (value.length === 0) {
				return callback(new Error("请上传关联公司凭证"));
			} else {
				return callback();
			}
		},
		loadPaymentCustomerCompanys(customerId, contractCompanyId) {
			this.$request({
				url: API._SALE_PAYMENT_CUSTOMER_COMPANY,
				type: "GET",
				loading: false,
				param: {
					customer_id: customerId,
					contract_company_id: contractCompanyId
				}
			}).then(({ data }) => {
				data.link_tels = data.link_tels.filter(it => objRegex.validMobile.regex.test(it.phone));
				
				this.linkTelList = [...data.link_tels, { phone: '以上号码都不正确', link_id: 0 }];
				data.industry = [data.industry_id, data.industry_id_second, data.industry_id_third];
				this.form1.industry_id = data.industry_id || '';
				this.form1.customer_type = data.customer_type || '';
				
				data.company_name && (this.form1.contract_company_name = data.company_name);
				const selectedLink = this.linkTelList.find(link => link.is_selected);
				if (selectedLink) {
					this.form1.link_id = selectedLink.link_id;
					this.handleLinkChange(selectedLink.link_id);
				}
				data.product_type_id && (this.form1.product_type_id = data.product_type_id);
				data.product_name && (this.form1.product_name = data.product_name);
				data.wei_age && (this.form1.wei_age = data.wei_age);
			}).catch(res => {
				this.$Message.error(res.msg);
			});
		},
		loadPaymentRecord() {
			this.$request({
				url: API._SALE_PAYMENT_DETAIL_GET,
				loading: false,
				type: "GET",
				param: {
					payment_id: this.query.payment_id
				}
			}).then(res => {
				res.data.base_info.industry = [
					res.data.base_info.industry_id,
					res.data.base_info.industry_id_second,
					res.data.base_info.industry_id_third
				];
				this.relationCompanys = res.data.relation_customer.customer_list || [];
				res.data.payment_info.payment_label = res.data.payment_info.payment_label.map(label => label.label_id);
				const data = {
					...res.data.base_info,
					...res.data.payment_info,
					relate_id: res.data.relation_customer.relate_id,
					relation_customer: (res.data.relation_customer.customer_list || []).map(item => item.customer_id),
					relation_prove: res.data.relation_customer.relation_prove || [],
					make_product_info: res.data.make_product_info || { has_payment: 0, product: [] },
				};
				data.after_share_performance = parseFloat(data.after_share_performance);
				data.payment_amount = parseFloat(data.payment_amount);
				data.received_amount = parseFloat(data.received_amount);
				data.payment_method.forEach(item => {
					item.payment_amount = parseFloat(item.payment_amount);
					item.uid = uid();
					if (item.item_id == 0) {
						item.method_id = [item.method_id];
					} else {
						item.method_id = [item.method_id, item.item_id];
					}
				});
				data.share_method = [];
				data.staff_share = data.staff_share.filter(staff => !staff.is_invite_staff);
				if (data.staff_share.length > 0) {
					data.share_method.push(1);
					data.staff_share.forEach(share => {
						if (share.share_type == 1) {
							share.performance1 = parseFloat(share.performance);
							share.performance2 = null;
						} else if (share.share_type == 2) {
							share.performance2 = parseFloat(share.performance);
							share.performance1 = null;
						}
					});
				}
				if (data.depart_share.length > 0) {
					data.share_method.push(2);
					data.depart_share.forEach(share => {
						share.performance = parseFloat(share.performance);
						share.uid = uid();
					});
				} else {
					data.depart_share = [{ depart_id: '', performance: null, share_type: 2 }];
				}

				if (data.cooperation_share.length > 0) {
					data.share_method.push(3);
					data.cooperation_share = { performance: parseFloat(data.cooperation_share[0].performance), share_type: 2 };
				} else {
					data.cooperation_share = { performance: null, share_type: 2 };

				}
				data.share_type = (data.staff_share[0] && data.staff_share[0].share_type) || 2;
				this.loadPaymentCustomerCompanys(data.customer_id, data.contract_company_id);
				this.loadRelateCompany(data.customer_id);
				this.setData(data);
			}).catch(res => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		async setData(data) {
			this.selectProducts = data.make_product_info.product.map(p => ({ 
				product_id: p.product_id, 
				product_name: p.product_name, 
				parent_product_id: p.parent_product_id, 
				parent_product_name: p.parent_product_name
			}));
			this.hasProductInfo = (this.query.action == 'readd' ? 1 : data.make_product_info.has_payment);
			Object.keys(this.form1).forEach(key => {
				this.form1[key] = data[key];
			});
			Object.keys(this.form2).forEach(key => {
				if (key == 'product_ids') {
					this.form2.product_ids = this.selectProducts.map(p => ({ 
						product_id: p.product_id, 
						parent_product_id: p.parent_product_id, 
					}));
				} else {
					this.form2[key] = data[key];
				}
			});
			this.query.staff_name = data.invite_staff_name.split("(")[0];
			this.query.staff_id = data.invite_staff_id;
			this.query.company_name = data.company_name;
			this.query.customer_id = data.customer_id;
		},
		disableDate(date) {
			return date.getTime() > new Date().getTime();
		},
		getPoundageMsg(ids) {
			const method = this.payMethods.find(item => {
				return item.value == ids[0];
			});
			if (!method) return "";
			const child = method.children.find(item => item.value == ids[1]);
			if (child) {
				return child.message;
			} else {
				return '';
			}
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		calcPaymentAmount() {
			let sum = 0;
			this.form2.payment_method.forEach((item) => {
				sum += +item.payment_amount;
			});
			if (sum == 0) {
				this.form2.payment_amount = null;
			} else {
				this.form2.payment_amount = sum;
			}
			this.calcAfterPerformance();
		},
		calcAfterPerformance() {
			if (!this.form2.payment_amount) {
				return null;
			}
			let result = this.form2.payment_amount;
			if (this.form2.is_share) {
				if (this.form2.share_method.includes(3)) {
					result -= this.form2.cooperation_share.performance || 0;
				}
				if (this.form2.share_method.includes(2)) {
					this.form2.depart_share.forEach(dep => {
						result -= dep.performance || 0;
					});
				}
				if (this.form2.share_method.includes(1)) {
					if (this.form2.share_type == 1) {
					// 比例
						let percent = 0;
						this.form2.staff_share.forEach(staff => {
							percent += staff.performance1 || 0;
						});
						result -= this.form2.payment_amount * percent / 100;
					} else if (this.form2.share_type == 2) {
						this.form2.staff_share.forEach(staff => {
							result -= staff.performance2;
						});
					}
				}
			}
			this.form2.after_share_performance = result;
		},
		handleCloseKnow() {
			this.$refs.know.handleClose();
		},
		handleChooseProduct() {
			const selected = this.selectProducts.map(pro => ({
				product_id: pro.product_id,
				product_name: pro.product_name,
				parent_product_id: pro.parent_product_id,
				parent_product_name: pro.parent_product_name

			}));
			
			ChooseProduct.popup({ selected, expandProduct: true }).then(list => {
				this.selectProducts = list;
				this.form2.product_ids = list.map(p => ({ product_id: p.product_id, parent_product_id: p.parent_product_id || '' }));
			}).catch(res => {
				res && console.error(res);
			});
		},
		handleCloseProduct(item) {
			if (item.parent_product_id) {
				for (let i = 0; i < this.selectProducts.length; i++) {
					if (this.selectProducts[i].parent_product_id === item.parent_product_id) {
						const index1 = this.selectProducts.findIndex(it => it.product_id == this.selectProducts[i].product_id);
						const index2 = this.form2.product_ids.findIndex(it => it.product_id == this.selectProducts[i].product_id);
						this.selectProducts.splice(index1, 1);
						this.form2.product_ids.splice(index2, 1);
						i--;
					}
				}
			} else {
				const index1 = this.selectProducts.findIndex(it => it.product_id == item.product_id);
				const index2 = this.form2.product_ids.findIndex(it => it.product_id == item.product_id);
				this.selectProducts.splice(index1, 1);
				this.form2.product_ids.splice(index2, 1);
			}
		},
		handleAddStaffShare() {
			ChooseStaff.popup({
				title: '选择分单人',
				selected: this.form2.staff_share,
				type: 'sharePerformance',
				inviteStaffId: this.query.staff_id,
				param: { type: 1 } // 默认0：全公司 ;1：销售和商学院员工
			}).then((staffs) => {
				this.form2.staff_share = staffs.map(staff => {
					const exist = this.form2.staff_share.find(item => item.staff_id == staff.staff_id);
					if (exist) {
						return exist;
					} else {
						return { 
							staff_name: staff.staff_name, 
							staff_id: staff.staff_id, 
							first_depart_id: staff.first_depart_id,
							performance1: null, 
							performance2: null 
						};
					}
				});
				this.$refs.form2.validateField('staff_share');
			});
		},
		handleRemoveStaffShare(staff, index) {
			this.form2.staff_share.splice(index, 1);
			this.$refs.form2.validateField('staff_share');
		},
		handleAddDepartShare() {
			this.form2.depart_share.push({ depart_id: '', performance: null, share_type: 2, uid: uid() });
		},
		handleRemoveDepartShare(depart, index) {
			this.form2.depart_share.splice(index, 1);
			this.calcAfterPerformance();
		},
		getFilterLabelList() {
			if (this.form2.payment_label.length == 0) {
				return this.paymentLabel;
			} else if (this.form2.payment_label.includes(5)) {
				return [this.paymentLabel.find(t => t.label_id == 5)];
			} else {
				return this.paymentLabel.filter(t => t.label_id != 5);
			}
		},
		getFilterdDepart(depId) {
			const result = JSON.parse(JSON.stringify((this.departAll || []).find(depart => depart.value == this.firstDepartId.bs)));
			if (result && result.children) {
				result.children.forEach(dep2 => {
					dep2.children = [];
					if (this.form2.depart_share.find(d => d.depart_id == dep2.value && dep2.value != depId)) {
						dep2.disabled = true;
					} else {
						dep2.disabled = false;
					}
				});
				return result.children;
			} else {
				return [];
			}
			
			
		},
		handlePaymentLabelChange(labelIds) {
			if (!this.isOriginalTimeRequired) {
				this.$refs.form2.validateField('original_time');
			}
		},
		checkProduct(product_ids) {
			for (let i = 0; i < product_ids.length - 1; i++) {
				for (let j = i + 1; j < product_ids.length; j++) {
					if (product_ids[i].product_id == product_ids[j].product_id) {
						return false;
					}
				}
			}
			return true;
		},
		checkSharePerormance() {
			if (this.form2.after_share_performance > 0) {
				return true;
			} else {
				const saleDepartId = this.firstDepartId.sale;
				if (this.form2.staff_share.find(staff => staff.first_depart_id === saleDepartId)) {
					return true;
				}
			}
			return false;
		},
		popError(msg) {
			if (msg.includes('网络不稳定')) {
				this.$Message.error(msg);
			} else { 
				return Confirm.popup({ title: '提示', msg, showIcon: true, status: 'error', cancelText: '', okText: '知道了' }); 
			}
		},
		performance1Validator(rule, value, callback) {
			if (value === 0) {
				callback('分单比例必须大于0');
			} else {
				callback();
			}
		},
		performance2Validator(rule, value, callback) {
			if (value === 0) {
				callback('分单金额必须大于0');
			} else {
				callback();
			}
		},
		handleLinkChange(linkId) {
			if (linkId) {
				const curLink = this.linkTelList.find(link => link.link_id === linkId);
				/**
				 *  "link_id":1,    // 关联主键
                "customer_name":"客户名",    // 客户名
                "customer_role":1,    // 客户角色ID
                "phone":"13211111111",    // 客户电话
                "wechat":"asdfg",    // 微信号
				 */
				if (!curLink) return console.error('找不到对应的link：', linkId, this.linkTelList);
				this.form1.customer_name = curLink.customer_name;
				this.form1.customer_name && this.$refs.form1.validateField('customer_name');

				this.form1.customer_role = curLink.customer_role;
				this.form1.phone = curLink.phone;
				this.form1.wechat = curLink.wechat;
				if (curLink.is_own || this.$global.staff.is_charge) {
					this.disableCustomerName = false;
					this.disableCustomerRole = false;
					if (this.form1.wechat) {
						this.disableWechat = true;
					} else {
						this.disableWechat = false;
					}
				} else {
					this.disableCustomerName = true;
					this.disableCustomerRole = true;
					this.disableWechat = true;

				}
			} else {
				this.form1.customer_name = '';
				this.form1.customer_role = '';
				this.$refs.customerRole && this.$refs.customerRole.resetField();
				this.form1.wechat = '';
				this.form1.phone = '';
				this.disableCustomerName = false;
				this.disableCustomerRole = false;
				this.disableWechat = false;
			}
		},
		updateLinkDisable() {
			this.disableCustomerName = true;
			this.disableCustomerRole = true;
			if (this.form1.link_id && this.form1.wechat) {
				this.disableWechat = true;
			} else {
				this.disableWechat = false;
			}
		},
		// 新增时mounted时执行，编辑时加载完到账记录再执行
		loadRelateCompany(customerId) {
			if (this.query.deal_status == 1) return;
			this.$request({
				url: "_SALE_CUSTOMER_RELATE_BY_TEL_FOR_PAYMENT_GET",
				type: "GET",
				param: { customer_id: customerId },
				loading: false,
			}).then(res => {
				this.relateCustomerList = res.data;
				if (this.$route.action == 'update' || this.$route.action == 'readd') {
					this.checkedCustomerId = this.relateCustomerList.map(i => i.customer_id).filter(i => this.form1.relation_customer.includes(i));
				}
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleCheckTel(row) {
			setTimeout(() => {
				if (this.checkedCustomerId.includes(row.customer_id)) {
					// 检查是否在公海
					if (row.can_get) {
						Confirm.popup({
							title: "温馨提示",
							msg: '该客户目前存在于公海，需要先领取才能关联，是否直接领取该客户到自己名下？'
						}).then(() => {
							service.getCustomer(row.customer_id).then(() => {
								this.loadRelateCompany(this.query.customer_id);
							}).catch(() => {
								this.checkedCustomerId = this.checkedCustomerId.filter(i => i !== row.customer_id);
							});
						}).catch(() => {
							this.checkedCustomerId = this.checkedCustomerId.filter(i => i !== row.customer_id);


						});
					}
				}
				
			}, 10);
		},
		handleIndustryChange() {
			this.$refs.product_type_id && this.$refs.product_type_id.resetField();
		}
	}
};
</script>

<style lang="scss" >
.oa-sale-customer-intention-record-add {
	height: calc(100% - 55px);
	padding-top: 30px;
	padding-bottom: 30px;
    overflow-y: auto;
	margin-top: -6px;
	.ivu-checkbox-group .ivu-checkbox-group-item {
		margin-left: 0px;
	}
	.ivu-checkbox-wrapper .ivu-checkbox-group-item .ivu-checkbox-default {
		margin-left: 0px !important;
	}
	._number-append {
        display: inline-block;
        position: absolute;
        left: 98px;
		top: 4px;
        vertical-align: bottom;
		width: 20px;
    }
    ._mask {
        background: rgba(100, 100, 100, 0.5);
		border-radius: 8px;
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        bottom: 0;
        > i {
            cursor: pointer;
            font-size: 35px;
            color: white;
            display: inline-block;
        }
        &:hover {
            opacity: 1;
        }
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    ._pay_method {
        background: #f5f5f6;
        padding: 20px 20px 0 20px;
		margin-left: 10px;
        max-width: 935px;
        .ivu-form-item {
            &:nth-of-type(2n-1) {
				margin-right: 54px;
                // border: 1px red solid;
            }
        }
    }
    ._form-type {
        width: 100px;
        line-height: 33px;
        .__icon {
            color: #2296f9;
			font-size: 16px;
			cursor: pointer;
        }
    }
	._scrify {
		.ivu-input {
			width: 226px;
		}
		.ivu-input-icon{
				left: 197px;
		}
        .ivu-input-group-append {
            background: #d9444f;
            color: white;
            border: none;
            cursor: pointer;
            position: relative;
            left: -1px;
		}
    }
	._our-company{
		.ivu-select-dropdown{
			max-height:180px !important
		}
	}
	._konw-tip {
		position: absolute;
		right: 40px;
		color: #4B4F57;
		font-size: 12px;
		background: #fff;
		border-radius: 3px;
		border:1px solid #BFBFBF;
		padding: 6px 10px;
		z-index: 10;
	}
	._required-mark {
		display: inline-block;
		line-height: 1;
		font-family: SimSun;
		font-size: 12px;
		color: #ed4014;
	}
	._hide-required.ivu-form-item-required .ivu-form-item-label:before{
		content: ''
	}
	._source-item {
        border-radius: 4px;
        padding: 5px 10px; 
        display: inline-block;
        background-color: #e84854;
        color: white;
		margin: 5px;
		line-height: 22px;
		&:hover{
			background-color: #fa646e;
		}
	}
	._staff-share {
		.ivu-form-item  .ivu-form-item-content {
			margin-left: 90px !important;
		}
	}
	// &.v-sale-customer-form ._form-block .ivu-form-item:nth-of-type(2n-1) {
	// 	margin-right: 20px;
	// }
	._same-tag {
		background: #e84854;
		color: white;
		border-radius: 4px;
		padding: 2px 5px;
	}
}
.oa-sale-customer-intention-record-add-poptip{
	.ivu-poptip-inner {
		background: inherit;
		.ivu-poptip-body {
			background:rgba(0, 0, 0, 0.6);
			border-radius: 4px;
			color: #fff;
			.__know-btn {
				border: 1px solid white;
				background: #dbd9d94f;
				border-radius: 4px;
				padding: 6px 10px;
			}
		}
	}
	.ivu-poptip-arrow:after{
			border-bottom-color: rgb(102, 102, 102) !important;
			border-top-color: rgb(102, 102, 102) !important;
	}
}
</style>