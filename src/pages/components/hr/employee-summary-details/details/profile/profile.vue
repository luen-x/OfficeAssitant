<template>
	<div class="g-flex g-fd-c v-hr-profile-form">
		<vc-debounce-click 
			class="g-red-btn-line"
			style="width:40px;textAlign:center;marginLeft:690px"
			@click="handlePrint"
		>
			打印
		</vc-debounce-click >
		<i-form
			ref="form1"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="120"
			style="width: 850px"
			position="center"
		>
			<div class="g-flex g-flex-ac">
				<oa-title title="个人资料" />
				<div
					v-if="($auth['210']||($auth['678']&&$auth['680']))&& queryStaffStatus !=='4'"
					class="g-m-lr-15 g-operation"
					@click="handleEdit('个人资料')"
				>
					<span v-if="infoStatus" class="g-fs-14">
						<span class="g-m-lr-15" @click="handleSubmit(1,'infoStatus')">保存</span>
						<span @click="handleCancel(1,'infoStatus')">取消</span>
					</span>
					<span v-else class="g-fs-14">编辑</span>
				</div>
			</div>
			<div v-if="infoStatus">
				<i-row >
					<i-col span="12">
						<i-form-item label="姓名：" prop="applicant_name">
							<i-input
								v-model="formValidate.applicant_name"
								:maxlength="10"
								style="width: 300px"
								placeholder="请输入姓名"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="性别：" prop="sex">
							<i-radio-group v-model="formValidate.sex">
								<i-radio label="0">男</i-radio>
								<i-radio label="1" style="margin-left:50px">女</i-radio>
							</i-radio-group>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="民族：">
							<i-select
								v-model="formValidate.nation_id"
								clearable
								placeholder="请选择民族"
								style="width: 300px"
							>
								<i-option
									v-for="(item, index) in nations"
									:key="index"
									:value="item.value"
								>{{ item.label }}</i-option>
							</i-select>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="婚否：" prop="is_married">
							<i-radio-group v-model="formValidate.is_married">
								<i-radio label="0">未婚</i-radio>
								<i-radio label="1" style="margin-left:50px">已婚</i-radio>
							</i-radio-group>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="手机号码：" prop="mobile">
							<i-input
								v-model="formValidate.mobile"
								:maxlength="11"
								style="width: 300px"
								placeholder="请输入手机号码"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="招商银行卡号：" prop="bank" >
							<i-input
								v-model="formValidate.bank"
								:maxlength="16"
								style="width: 300px"
								placeholder="请输入招商银行卡号"
							/>
						</i-form-item>
					</i-col>
				</i-row >
				<i-row >
					<i-col span="12">
						<i-form-item label="开户行：" >
							<i-input
								v-model="formValidate.opening_bank"
								:maxlength="50"
								style="width:300px"
								placeholder="请输入开户行"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="网银状态：" >
							<i-radio-group v-model="formValidate.e_bank_status" >
								<i-radio label="1">已开启</i-radio>
								<i-radio label="2" style="margin-left:50px">未开启</i-radio>
							</i-radio-group>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="入职时间：" prop="predict_entry_time">
							<i-date-picker
								v-model="formValidate.predict_entry_time"
								:split-panels="true"
								style="width: 300px"
								placeholder="请选择入职时间"
								type="date"
								transfer
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="入职部门：" prop="depart_id">
							<i-cascader
								v-model="formValidate.depart_id"
								:data="departAll"
								:change-on-select="true"
								:clearable="false"
								style="width: 300px"
								transfer
								trigger="click"
								placeholder="请选择部门"
								@on-change="handleChange"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="职位：" prop="position_id">
							<i-select
								v-model="formValidate.position_id"
								style="width: 300px"
								clearable
								filterable
								placeholder="请选择职位"
							>
								<i-option
									v-for="(item, index) in positionArr"
									:key="index"
									:value="item.position_id"
								>{{ item.position_name }}</i-option>
							</i-select>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="师傅是谁：">
							<i-input
								v-model="formValidate.master"
								:maxlength="10"
								style="width:300px"
								placeholder="请输入师傅"
							/>
						</i-form-item>
					</i-col>
				</i-row >
				<i-row >
					<i-col span="12">
						<i-form-item label="重大病史：" prop="has_medical_history">
							<i-radio-group v-model="formValidate.has_medical_history">
								<i-radio label="1">有</i-radio>
								<i-radio label="2" style="margin-left:50px">无</i-radio>
							</i-radio-group>
						</i-form-item>
					</i-col>
					<i-col v-if="formValidate.has_medical_history=='1'" span="12">
						<i-form-item label="病史说明：" prop="medical_history">
							<oa-limit-words
								v-model="formValidate.medical_history"
								:max="200"
								style="width:300px"
								placeholder="请详细说明情况，便于工作岗位和强度安排"
							/>
						</i-form-item>
					</i-col>
				</i-row>
			</div>
			<div v-else class="_oaitem">
				<oa-item label="姓名">{{ formValidate.applicant_name }}</oa-item>
				<oa-item label="性别">{{ formValidate.sex==0?'男':'女' }}</oa-item>
				<oa-item label="民族">{{ formValidate.nation_name }}</oa-item>
				<oa-item label="婚否">{{ formValidate.is_married==0?'未婚':'已婚' }}</oa-item>
				<oa-item label="手机号码">{{ formValidate.mobile }}</oa-item>
				<oa-item label="招商银行卡号">{{ formValidate.bank }}</oa-item>
				<oa-item label="开户行">{{ formValidate.opening_bank }}</oa-item>
				<oa-item label="网银状态">{{ formValidate.e_bank_status_name }}</oa-item>
				<oa-item label="入职时间">{{ formValidate.predict_entry_time }}</oa-item>
				<oa-item label="入职部门">{{ formValidate.depart_name }}</oa-item>
				<oa-item label="职位">{{ formValidate.position_name }}</oa-item>
				<oa-item label="师傅是谁">{{ formValidate.master }}</oa-item>
				<oa-item label="重大病史">{{ formValidate.has_medical_history_name }}</oa-item>
				<oa-item v-if="formValidate.has_medical_history=='1'" label="病史说明">{{ formValidate.medical_history }}</oa-item>
			</div>
		</i-form>
		<i-form
			ref="form2"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="120"
			style="width: 850px"
			position="left"
		>
			<div class="g-flex g-flex-ac g-m-t-10">
				<oa-title title="身份信息" />
				<div
					v-if="($auth['210']||($auth['678']&&$auth['680']))&& queryStaffStatus !=='4'"
					class="g-m-lr-15 g-operation"
					@click="handleEdit('身份信息')"
				>
					<span v-if="idStatus" class="g-fs-14">
						<span class="g-m-lr-15" @click="handleSubmit(2,'idStatus')">保存</span>
						<span @click="handleCancel(2,'idStatus')">取消</span>
					</span>
					<span v-else class="g-fs-14">编辑</span>
				</div>
			</div>
			<div v-if="idStatus">
				<i-row>
					<i-col span="12">
						<i-form-item label="身份证号：" prop="id_card">
							<i-input
								v-model="formValidate.id_card"
								:maxlength="18"
								style="width: 300px"
								placeholder="请输入身份证号"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="生日类型：" prop="birthday_type">
							<i-radio-group v-model="formValidate.birthday_type">
								<i-radio label="0">公历</i-radio>
								<i-radio label="1" style="margin-left:50px">农历</i-radio>
							</i-radio-group>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row>
					<i-col span="12">
						<i-form-item label="公历生日：" prop="birthday">
							<i-date-picker
								v-model="formValidate.birthday"
								style="width: 100%"
								type="date"
								placeholder="请选择公历生日"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="职称/技能：">
							<i-input
								v-model="formValidate.school_job"
								:maxlength="20"
								style="width: 300px"
								placeholder="请输入职称技能"
							/>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row>
					<i-col span="12">
						<i-form-item label="爱好/特长：">
							<i-input
								v-model="formValidate.hobby"
								:maxlength="20"
								style="width: 300px"
								placeholder="请输入爱好/特长"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="政治面貌：" prop="politics_status">
							<i-select
								v-model="formValidate.politics_status"
								clearable
								style="width: 300px"
								placeholder="请选择政治面貌"
							>
								<i-option
									v-for="(item, index) in politics"
									:key="index"
									:value="item.value"
								>{{ item.label }}</i-option>
							</i-select>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row>
					<i-col v-if="formValidate.politics_status===2" span="12">
						<i-form-item label="入党时间：" prop="party_standing_time">
							<i-date-picker
								v-model="formValidate.party_standing_time"
								style="width:300px"
								type="month"
								format="yyyy-MM"
								placeholder="请选择入党时间"
								@on-change="formValidate.party_standing_time=$event"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="身份证上传：" >
							<vc-imgs-picker
								v-model="formValidate.id_card_url"
								:max="2"
								class="g-m-t-10"
								@error="handleError"
							/>
						</i-form-item>
					</i-col>
				</i-row>
			</div>
			<div v-else class="_oaitem">
				<oa-item label="身份证号">{{ formValidate.id_card }}</oa-item>
				<oa-item label="生日类型">{{ formValidate.birthday_type==0?'公历':'农历' }}</oa-item>
				<oa-item label="公历生日">{{ formValidate.birthday }}</oa-item>
				<oa-item label="职称/技能">{{ formValidate.school_job }}</oa-item>
				<oa-item label="爱好/特长">{{ formValidate.hobby }}</oa-item>
				<oa-item label="政治面貌">{{ formValidate.politics_status_name }}</oa-item>
				<oa-item
					v-if="formValidate.party_standing_time_name"
					label="入党时间"
				>{{ formValidate.party_standing_time }}</oa-item>
				<oa-item
					:style="formValidate.id_card_url.length?'minHeight:84px;marginTop:10px':''"
					label="身份证上传"
				>
					<vc-imgs-picker v-model="formValidate.id_card_url" :max="2" :disabled="true" />
				</oa-item>
			</div>
		</i-form>
		<i-form
			ref="form3"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="120"
			style="width: 850px"
			position="left"
		>
			<div class="g-flex g-flex-ac g-m-t-10">
				<oa-title title="学历证明" />
				<div
					v-if="($auth['210']||($auth['678']&&$auth['680']))&& queryStaffStatus !=='4'"
					class="g-m-lr-15 g-operation"
					@click="handleEdit('学历证明')"
				>
					<span v-if="eduStatus" class="g-fs-14">
						<span class="g-m-lr-15" @click="handleSubmit(3,'eduStatus')">保存</span>
						<span @click="handleCancel(3,'eduStatus')">取消</span>
					</span>
					<span v-else class="g-fs-14">编辑</span>
				</div>
			</div>
			<i-row v-if="eduStatus">
				<i-col span="12">
					<i-form-item label="证明方式：" prop="has_degree_prove">
						<i-radio-group v-model="formValidate.has_degree_prove">
							<i-radio :disabled="!eduStatus" label="1">学历证书</i-radio>
							<i-radio :disabled="!eduStatus" label="0">证明人</i-radio>
							<i-radio :disabled="!eduStatus" label="2">暂无</i-radio>
						</i-radio-group>
					</i-form-item>
				</i-col>
			</i-row>
			<oa-item v-else label="学历证明方式" class="_oaitem">
				{{ formValidate.has_degree_prove_name }}
				<!-- <span v-if="formValidate.has_degree_prove==0">证明人</span>
				<span v-if="formValidate.has_degree_prove==1">学历证书</span>
                <span v-if="formValidate.has_degree_prove==2">暂无</span>-->
			</oa-item>
			<div v-if="eduStatus">
				<i-row v-if="formValidate.has_degree_prove=='0'">
					<i-col span="12">
						<i-form-item label="学历证明人：" prop="degree_witness">
							<i-input
								v-model="formValidate.degree_witness"
								:maxlength="10"
								style="width: 300px"
								placeholder="请输入学历证明人"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="证明人联系方式：" prop="degree_witness_phone">
							<i-input
								v-model="formValidate.degree_witness_phone"
								:maxlength="20"
								style="width: 300px"
								placeholder="请输入学历证明人联系方式"
							/>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row v-if="formValidate.has_degree_prove=='1'">
					<i-form-item label="学历：" prop="degree_prove">
						<vc-imgs-picker
							v-model="formValidate.degree_prove"
							:max="10"
							class="g-m-t-10"
						/>
					</i-form-item>
				</i-row>
				<i-row v-if="formValidate.has_degree_prove=='2'">
					<i-form-item label="暂无理由：" prop="no_degree_prove_reason">
						<oa-limit-words
							v-model="formValidate.no_degree_prove_reason"
							:max="200"
							style="width:300px"
							placeholder="请输入暂无理由"
						/>
					</i-form-item>
				</i-row>
			</div>
			<div v-else class="_oaitem">
				<div v-if="formValidate.has_degree_prove=='0'">
					<oa-item label="学历证明人">{{ formValidate.degree_witness }}</oa-item>
					<oa-item label="证明人联系方式">{{ formValidate.degree_witness_phone }}</oa-item>
				</div>
				<div v-if="formValidate.has_degree_prove=='1'">
					<oa-item
						:style="formValidate.has_degree_prove?'minHeight:84px;marginTop:10px':''"
						label="学历"
						class="g-m-t-10"
					>
						<vc-imgs-picker
							v-model="formValidate.degree_prove"
							:max="10"
							:disabled="true"
						/>
					</oa-item>
				</div>
				<div v-if="formValidate.has_degree_prove=='2'">
					<oa-item label="暂无理由">{{ formValidate.no_degree_prove_reason }}</oa-item>
				</div>
			</div>
		</i-form>
		<i-form
			ref="form4"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="120"
			style="width: 850px"
			position="left"
		>
			<div class="g-flex g-flex-ac g-m-t-10">
				<oa-title title="离职证明" />
				<div
					v-if="($auth['210']||($auth['678']&&$auth['680']))&& queryStaffStatus !=='4'"
					class="g-m-lr-15 g-operation"
					@click="handleEdit('离职证明')"
				>
					<span v-if="offStatus" class="g-fs-14">
						<span class="g-m-lr-15" @click="handleSubmit(4,'offStatus')">保存</span>
						<span @click="handleCancel(4,'offStatus')">取消</span>
					</span>
					<span v-else class="g-fs-14">编辑</span>
				</div>
			</div>
			<i-row v-if="offStatus">
				<i-col span="12">
					<i-form-item label="离职手续:" prop="leaving_procedure">
						<i-radio-group v-model="formValidate.leaving_procedure">
							<i-radio label="1">已经办完</i-radio>
							<i-radio label="2" class="g-m-l-10">尚未办完</i-radio>
							<i-radio label="3" class="g-m-l-10">首次工作</i-radio>
						</i-radio-group>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="劳动纠纷:" prop="labor_dispute">
						<i-radio-group v-model="formValidate.labor_dispute">
							<i-radio label="2">无</i-radio>
							<i-radio label="1" class="g-m-l-10">有</i-radio>
						</i-radio-group>
					</i-form-item>
				</i-col>
			</i-row>
			<div v-else class="_oaitem">
				<oa-item label="离职手续">
					{{ formValidate.leaving_procedure_name }}
				</oa-item>
				<oa-item label="劳动纠纷">
					{{ formValidate.labor_dispute_name }}
				</oa-item>
			</div>
			
			<i-row v-if="offStatus">
				<i-col v-if="!formValidate.depart_id.includes(formValidate.sale_depart_id)" span="12">
					<i-form-item label="竞业协议:" prop="competition_agreement">
						<i-radio-group v-model="formValidate.competition_agreement">
							<i-radio label="2">与原单位无有效协议</i-radio>
							<i-radio label="1" class="g-m-l-10">与原单位有有效协议</i-radio>
						</i-radio-group>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item label="证明方式：" prop="has_leaving_prove">
						<i-radio-group v-model="formValidate.has_leaving_prove">
							<i-radio label="1">离职证明</i-radio>
							<i-radio label="0" class="g-m-l-10">证明人</i-radio>
							<i-radio label="2" class="g-m-l-10">暂无</i-radio>
							<i-radio label="4" class="g-m-l-10">首次工作</i-radio>
						</i-radio-group>
					</i-form-item>
				</i-col>
			</i-row>
			<div v-else class="_oaitem">
				<oa-item v-if="!formValidate.depart_id.includes(formValidate.sale_depart_id)" label="竞业协议">
					{{ formValidate.competition_agreement_name }}
				</oa-item>
				<oa-item label="证明方式">
					{{ formValidate.has_leaving_prove_name }}
				</oa-item>
			</div>
			
			<div v-if="offStatus">
				<i-row v-if="formValidate.has_leaving_prove=='0'">
					<i-col span="12">
						<i-form-item label="原公司名称：" prop="leaving_witness_company">
							<i-input
								v-model="formValidate.leaving_witness_company"
								:maxlength="20"
								style="width: 300px"
								placeholder="请输入原公司名称"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="原公司地址：" prop="leaving_witness_address">
							<oa-limit-words
								v-model="formValidate.leaving_witness_address"
								:max="50"
								style="width:300px"
								placeholder="请输入原公司地址"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="直接上司：" prop="leaving_superior">
							<i-input
								v-model="formValidate.leaving_superior"
								:maxlength="10"
								style="width: 300px"
								placeholder="请输入直接上司"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="上司联系方式：" prop="leaving_superior_phone">
							<i-input
								v-model="formValidate.leaving_superior_phone"
								:maxlength="20"
								style="width: 300px"
								placeholder="请输入上司联系方式"
							/>
						</i-form-item>
					</i-col>
				</i-row>
			</div>
			<div v-else class="_oaitem">
				<div v-if="formValidate.has_leaving_prove=='0'">
					<oa-item label="原公司名称">{{ formValidate.leaving_witness_company }}</oa-item>
					<oa-item label="原公司地址">{{ formValidate.leaving_witness_address }}</oa-item>
					<oa-item label="直接上司">{{ formValidate.leaving_superior }}</oa-item>
					<oa-item label="上司联系方式">{{ formValidate.leaving_superior_phone }}</oa-item>
				</div>
			</div>
			<div v-if="offStatus">
				<i-form-item
					v-if="formValidate.has_leaving_prove=='1'"
					label="离职证明："
					prop="leaving_prove"
				>
					<vc-imgs-picker
						v-model="formValidate.leaving_prove"
						:max="10"
						class="g-m-t-10"
						@error="handleError"
					/>
				</i-form-item>
			</div>
			<div v-else>
				<oa-item
					v-if="formValidate.has_leaving_prove=='1'"
					:style="formValidate.leaving_prove?'minHeight:84px;marginTop:10px':''"
					label="离职证明："
					class="g-m-t-10"
				>
					<vc-imgs-picker
						v-model="formValidate.leaving_prove"
						:max="10"
						:disabled="true"
						@error="handleError"
					/>
				</oa-item>
			</div>
			<div v-if="offStatus">
				<i-form-item
					v-if="formValidate.has_leaving_prove=='2'"
					label="暂无理由"
					prop="no_leaving_prove_reason"
				>
					<oa-limit-words
						v-model="formValidate.no_leaving_prove_reason"
						:max="200"
						style="width:300px"
						placeholder="请输入暂无理由"
					/>
				</i-form-item>
			</div>
			<div v-else>
				<div v-if="formValidate.has_leaving_prove=='2'" class="_oaitem">
					<oa-item label="暂无理由">{{ formValidate.no_leaving_prove_reason }}</oa-item>
				</div>
			</div>
		</i-form>
		<i-form
			ref="form5"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="120"
			style="width: 850px"
			position="left"
		>
			<div class="g-flex g-flex-ac g-m-t-10">
				<oa-title title="家庭成员" />
				<div
					v-if="($auth['210']||($auth['678']&&$auth['680']))&& queryStaffStatus !=='4'"
					class="g-m-lr-15 g-operation"
					@click="handleEdit('家庭成员')"
				>
					<span v-if="familyStatus" class="g-fs-14">
						<span class="g-m-lr-15" @click="handleSubmit(5,'familyStatus')">保存</span>
						<span @click="handleCancel(5,'familyStatus')">取消</span>
					</span>
					<span v-else class="g-fs-14">编辑</span>
				</div>
				<div v-if="familyStatus">
					<div
						v-if="formValidate.family.length<3"
						class="g-operation g-m-lr-15 g-fs-14"
						style="fontSize:14px !important"
						@click="handleAddFamily"
					>添加</div>
				</div>
			</div>
			<div v-if="familyStatus">
				<div
					v-for="(item, index) in formValidate.family"
					:key="index+200"
					class="_education"
				>
					<span v-if="formValidate.family.length>1" class="g-operation _del" @click="handleDel(index)">删除</span>
					<i-row>
						<i-col span="12">
							<i-form-item
								:prop="'family.' + index + '.family_name'"
								:rules="ruleValidate.family_name"
								label="姓名："
							>
								<i-input
									v-model="item.family_name"
									:maxlength="10"
									style="width: 300px"
									placeholder="请输入姓名"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item
								:prop="'family.' + index + '.family_relation'"
								:rules="ruleValidate.family_relation"
								label="与本人关系："
							>
								<i-input
									v-model="item.family_relation"
									:maxlength="10"
									style="width: 300px"
									placeholder="请输入与本人关系"
								/>
							</i-form-item>
						</i-col>
					</i-row>
					<i-row>
						<i-col span="12">
							<i-form-item
								:prop="'family.' + index + '.family_phone'"
								:rules="ruleValidate.family_phone"
								label="手机号："
							>
								<i-input
									v-model="item.family_phone"
									:maxlength="11"
									style="width: 300px"
									placeholder="请输入手机号"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item
								:prop="'family.' + index + '.family_job_address'"
								:rules="ruleValidate.family_job_address"
								label="工作单位："
							>
								<i-input
									v-model="item.family_job_address"
									:maxlength="20"
									style="width: 300px"
									placeholder="请输入工作单位"
								/>
							</i-form-item>
						</i-col>
					</i-row>
					<i-row>
						<i-col span="12">
							<i-form-item
								:prop="'family.' + index + '.family_job_new_address'"
								:rules="ruleValidate.family_job_new_address"
								label="现住地址："
							>
								<oa-limit-words
									v-model="item.family_job_new_address"
									:max="50"
									style="width:300px"
									placeholder="请输入现住地址"
								/>
							</i-form-item>
						</i-col>
					</i-row>
				</div>
			</div>
			<div v-else>
				<div v-for="(item, index) in formValidate.family" :key="index" class="_edu">
					<div class="_itemFamily">
						<oa-item label="姓名">{{ item.family_name }}</oa-item>
						<oa-item label="与本人关系">{{ item.family_relation }}</oa-item>
						<oa-item label="手机号">{{ item.family_phone }}</oa-item>
						<oa-item label="工作单位">{{ item.family_job_address }}</oa-item>
						<oa-item label="现住地址">{{ item.family_job_new_address }}</oa-item>
					</div>
				</div>
			</div>
		</i-form>
		<i-form
			ref="form6"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="120"
			style="width: 850px"
			position="left"
		>
			<div class="g-flex g-flex-ac g-m-t-10">
				<oa-title title="紧急联系人" />
				<div
					v-if="($auth['210']||($auth['678']&&$auth['680']))&& queryStaffStatus !=='4'"
					class="g-m-lr-15 g-operation"
					@click="handleEdit('紧急联系人')"
				>
					<span v-if="emergencyStatus" class="g-fs-14">
						<span class="g-m-lr-15" @click="handleSubmit(6,'emergencyStatus')">保存</span>
						<span @click="handleCancel(6,'emergencyStatus')">取消</span>
					</span>
					<span v-else class="g-fs-14">编辑</span>
				</div>
			</div>
			<i-row v-if="emergencyStatus">
				<i-col span="12">
					<i-form-item prop="important_name" label="姓名：">
						<i-input
							v-model="formValidate.important_name"
							:maxlength="10"
							style="width: 300px"
							placeholder="请输入姓名"
						/>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item prop="important_relation" label="与本人关系：">
						<i-input
							v-model="formValidate.important_relation"
							:maxlength="10"
							style="width: 300px"
							placeholder="请输入与本人关系"
						/>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item prop="important_phone" label="手机号：">
						<i-input
							v-model="formValidate.important_phone"
							:maxlength="11"
							style="width: 300px"
							placeholder="请输入手机号"
						/>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item prop="important_company" label="工作单位：">
						<i-input
							v-model="formValidate.important_company"
							:maxlength="20"
							style="width: 300px"
							placeholder="请输入工作单位"
						/>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item prop="important_address" label="现住地址：">
						<oa-limit-words
							v-model="formValidate.important_address"
							:max="50"
							style="width:300px"
							placeholder="请输入现住地址"
						/>
					</i-form-item>
				</i-col>
			</i-row>
			<div v-else class="_oaitem">
				<oa-item label="姓名">{{ formValidate.important_name }}</oa-item>
				<oa-item label="与本人关系">{{ formValidate.important_relation }}</oa-item>
				<oa-item label="手机号">{{ formValidate.important_phone }}</oa-item>
				<oa-item label="工作单位">{{ formValidate.important_company }}</oa-item>
				<oa-item label="现住地址">{{ formValidate.important_address }}</oa-item>
			</div>
		</i-form>
		<i-form
			v-if="formValidate.is_show_my_opinion"
			ref="form7"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="120"
			style="width: 850px"
			position="left"
		>
			<div class="g-flex g-flex-ac g-m-t-10">
				<oa-title title="我的看法" />
				<!-- <div
					v-if="($auth['210']||($auth['678']&&$auth['680']))&& queryStaffStatus !=='4'"
					class="g-m-lr-15 g-operation"
					@click="handleEdit('我的看法')"
				>
					<span v-if="perspectiveStatus" class="g-fs-14">
						<span class="g-m-lr-15" @click="handleSubmit(7,'perspectiveStatus')">保存</span>
						<span @click="handleCancel(7,'perspectiveStatus')">取消</span>
					</span>
					<span v-else class="g-fs-14">编辑</span>
				</div> -->
			</div>
			<i-row v-if="perspectiveStatus">
				<i-col span="12">
					<i-form-item prop="my_opinion" label="公司环境">
						<oa-limit-words
							v-model="formValidate.my_opinion"
							:max="200"
							style="width:300px"
							placeholder="通过3天你和公司的互相交流，你觉得公司是一个什么样的环境的公司，与你之前了解的公司或者工作过的公司有何区别？（如果没有不一样的地方可略过）"
						/>
					</i-form-item>
				</i-col>
				<i-col span="12">
					<i-form-item prop="my_target" label="首月目标">
						<oa-limit-words
							v-model="formValidate.my_target"
							:max="200"
							style="width:300px"
							placeholder="接下来第一个月你给自己定的目标是什么？你是怎么计划完成你的目标的。"
						/>
					</i-form-item>
				</i-col>
			</i-row>
			<div v-else class="_oaitem">
				<div>
					<oa-item label="公司环境">{{ formValidate.my_opinion }}</oa-item>
				</div>
				<div>
					<oa-item label="首月目标">{{ formValidate.my_target }}</oa-item>
				</div>
			</div>
		</i-form>
		<!-- 打印内容 -->
		<div style="display: none">
			<vc-print ref="pageTarget">
				<oa-print :info="info"/>
			</vc-print>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import {
	Form,
	FormItem,
	Input,
	InputNumber,
	Select,
	Option,
	DatePicker,
	Message,
	Row,
	Col,
	RadioGroup,
	Radio,
	Cascader
} from "iview";
// utils
import { dataValidity, getHashUrl, unCode } from "@utils/utils";
import { ImgsPicker, Print } from "wya-vc";
import lodash from "lodash";
import moment from "moment";
import { services } from "@stores/services/hr";
import { log } from "util";
import LimitWords from "@components/_common/limit-words/limit-words";
import Title from "../../../_common/title";
import DetailItem from "../detail-item";
import ResumePrint from "../../../form/print/enter-register";

export default {
	name: "v-hr-profile-form",
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-row": Row,
		"i-col": Col,
		"vc-imgs-picker": ImgsPicker,
		"oa-title": Title,
		"i-cascader": Cascader,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"oa-item": DetailItem,
		"oa-limit-words": LimitWords,
		"oa-print": ResumePrint,
		"vc-print": Print
	},
	mixins: [services.nations(), services.politics(), services.departAll()],
	data() {
		const { query } = this.$route;
		return {
			info: {},
			infoStatus: false,
			queryStaffStatus: query.staff_status,
			idStatus: false,
			eduStatus: false,
			offStatus: false,
			familyStatus: false,
			emergencyStatus: false,
			perspectiveStatus: false,
			positionArr: [],
			formValidate: {
				applicant_name: "", // 姓名
				type: 0,
				mobile: "", // 手机号
				sex: "", // 性别 0：男；1：女
				is_married: "", // 婚否 0：未婚；1：已婚
				nation_name: "",
				bank: "", // 招商银行卡号
				nation_id: "", // 民族id
				id_card: "", // 身份证号
				birthday_type: "", // 生日类型 0：公历 1：农历
				birthday: "", // 公历生日
				id_card_url: [],
				school_job: "", // 职称或技能
				has_degree_prove: "1", // 1：学历证书，0：证明人
				degree_witness: "", // 学历证明人
				degree_witness_phone: "", // 证明人手机号
				degree_prove: [], // 证书文件 有的话是数组
				has_leaving_prove: "1", // 1：离职证书，0：证明人
				leaving_witness_company: "", // 原公司名称
				leaving_witness_address: "", // 原公司地址
				leaving_superior: "", // 直接上司
				leaving_superior_phone: "", // 直接上司手机号
				leaving_prove: [], // 离职证明文件，有的话是数组
				family: [], // 家庭成员
				important_name: "", // 紧急联系人
				important_relation: "", // 与本人的关系
				important_phone: "", // 紧急联系人电话
				important_company: "", // 紧急联系人工作单位
				important_address: "", // 姓紧急联系人现住址名
				party_standing_time: "",
				politics_status: null,
				depart_id: [],
				position_id: [],
				hobby: '',
				opening_bank: '',
				e_bank_status: '',
				has_medical_history: '',
				medical_history: '',
				master: '',
				predict_entry_time: '',
				e_bank_status_name: '',
				depart_name: '',
				position_name: '',
				has_medical_history_name: '',
				leaving_procedure: '',
				labor_dispute: '',
				competition_agreement: '',
			},
			ruleValidate: {
				applicant_name: [
					{
						required: true,
						message: "姓名为必填"
					},
					{
						type: "validCompellation",
						message: "请输入正确的姓名",
						validator: dataValidity,
						trigger: "blur"
					}
				],
				sex: [
					{
						required: true,
						message: "性别为必选",
						trigger: "change"
					}
				],
				bank: [
					{
						type: "validNum",
						message: "请输入数字",
						validator: dataValidity
					}
				],
				is_married: [
					{
						required: true,
						message: "婚姻为必选",
						trigger: "change"
					}
				],
				mobile: [
					{
						required: true,
						message: "手机号码为必填"
					},
					{
						type: "validMobile",
						message: "手机号格式不正确",
						validator: dataValidity
					}
				],
				degree_witness_phone: [
					{
						required: true,
						message: "学历证明人联系方式为必填"
					},
					{
						type: "validContact",
						message: "手机号格式不正确",
						validator: dataValidity
					}
				],
				id_card: [
					{
						required: true,
						message: "身份证号为必填"
					},
					{
						type: "validId",
						message: "身份证格式不正确",
						validator: dataValidity
					},
					{
						message: "身份证长度不正确",
						min: 18
					}
				],
				id_card_url: [
					{
						required: true,
						type: "array",
						message: "请选择图片",
						trigger: "change"
					}
				],
				position_name: [
					{
						required: true,
						message: "证明方式为必选",
						trigger: "change"
					}
				],
				birthday: [
					{
						required: true,
						type: "date",
						message: "公历生日为必选",
						trigger: "change"
					}
				],
				birthday_type: [
					{
						required: true,
						message: "生日类型为必选",
						trigger: "change"
					}
				],
				has_degree_prove: [
					{
						required: true,
						message: "学历证明方式为必选",
						trigger: "change"
					}
				],
				degree_witness: [
					{
						required: true,
						message: "学历证明人为必选"
					},
					{
						type: "validCompellation",
						message: "请输入正确的姓名",
						validator: dataValidity,
						trigger: "blur"
					}
				],
				degree_prove: [
					{
						required: true,
						type: "array",
						message: "请选择图片",
						trigger: "change"
					}
				],
				has_leaving_prove: [
					{
						required: true,
						message: "离职证明方式为必选",
						trigger: "change"
					}
				],
				leaving_prove: [
					{
						required: true,
						type: "array",
						message: "请选择图片",
						trigger: "change"
					}
				],
				leaving_witness_company: [
					{
						required: true,
						message: "原公司名称为必填"
					}
				],
				leaving_witness_address: [
					{
						required: true,
						message: "原公司地址为必填"
					}
				],
				leaving_superior: [
					{
						required: true,
						message: "直接上司为必填"
					},
					{
						type: "validCompellation",
						message: "请输入正确的姓名",
						validator: dataValidity,
						trigger: "blur"
					}
				],
				leaving_superior_phone: [
					{ required: true, message: "上司联系方式为必填" },
					{
						type: "validContact",
						message: "联系方式格式不正确",
						validator: dataValidity
					}
				],
				family_name: [
					{
						required: true,
						message: "姓名为必填",
						trigger: "blur"
					},
					{
						type: "validCompellation",
						message: "请输入正确的姓名",
						validator: dataValidity,
						trigger: "blur"
					}
				],
				family_relation: [
					{
						required: true,
						message: "与本人关系为必填",
						trigger: "blur"
					}
				],
				family_phone: [
					{
						required: true,
						message: "手机号为必填",
						trigger: "blur"
					},
					{
						type: "validMobile",
						message: "手机号格式不正确",
						validator: dataValidity
					}
				],
				family_job_address: [
					{
						required: true,
						message: "工作单位为必填",
						trigger: "blur"
					}
				],
				family_job_new_address: [
					{
						required: true,
						message: "现住地址为必填",
						trigger: "blur"
					}
				],
				important_name: [
					{
						required: true,
						message: "姓名为必填"
					},
					{
						type: "validCompellation",
						message: "请输入正确的姓名",
						validator: dataValidity,
						trigger: "blur"
					}
				],
				important_relation: [
					{
						required: true,
						message: "与本人关系为必填"
					}
				],
				important_phone: [
					{
						required: true,
						message: "紧急联系人电话为必填"
					},
					{
						type: "validMobile",
						message: "手机号格式不正确",
						validator: dataValidity
					}
				],
				important_company: [
					{
						required: true,
						message: "工作单位为必填"
					}
				],
				important_address: [
					{
						required: true,
						message: "现住地址为必填"
					}
				],
				party_standing_time: [
					{
						required: true,
						pattern: /.+/,
						message: "入党时间为必选",
						trigger: "change"
					}
				],
				politics_status: [
					{
						required: true,
						message: "政治面貌为必选",
						type: "number",
						trigger: "change"
					}
				],
				no_leaving_prove_reason: [
					{ required: true, message: "离职证明暂无的理由为必填" }
				],
				no_degree_prove_reason: [
					{ required: true, message: "学历证明暂无的理由为必填" }
				],
				my_opinion: [{ required: true, message: "公司环境为必填" }],
				my_target: [{ required: true, message: "首月目标为必填" }],
				predict_entry_time: [
					{
						required: true,
						pattern: /.+/,
						message: "入职时间为必选",
						trigger: "change"
					}
				],
				depart_id: [
					{
						required: true,
						type: "array",
						message: "入职部门为必选",
						trigger: "change"
					}
				],
				position_id: [
					{
						required: true,
						type: "number",
						message: "职位为必选",
						trigger: "change"
					}
				],
				has_medical_history: [
					{
						required: true,
						message: "重大病史为必选",
						trigger: "change"
					}
				],
				medical_history: [
					{
						required: true,
						message: "病史说明为必填",
						trigger: "blur"
					}
				],
				leaving_procedure: [
					{ required: true, message: "离职手续为必选", trigger: "change" }
				],
				labor_dispute: [
					{ required: true, message: "劳动纠纷为必选", trigger: "change" }
				],
				competition_agreement: [
					{ required: true, message: "竞业协议为必选", trigger: "change" }
				],
			}
		};
	},
	watch: {
		$route(to, from) {
			if (unCode(to.query.staff_id) != unCode(from.query.staff_id)) {
				this.loadProfileData("0");
			}
		}
	},
	mounted() {
		this.loadProfileData("0");
	},
	methods: {
		loadProfileData(type, name) {
			let staff_id = this.$route.query;
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_PROFILE_DETAILS_GET,
				type: "GET",
				param: {
					staff_id: unCode(this.$route.query.staff_id),
					type
				},
				loading: false
			})
				.then(res => {
					this.formValidate = { ...this.formValidate, ...res.data };
					this[name] = false;
					this.info = this.formValidate;
					this.$forceUpdate();
					res.data.depart_id[0] && this.handleEntryPosition(res.data.depart_id[0]);
				})
				.catch(err => {});
		},
		handleAddFamily() {
			if (this.formValidate.family && this.formValidate.family.length == 0) {
				this.formValidate.family.push({
					family_name: "", // 家庭成员名称
					family_relation: "", // 家庭成员与本人的关系
					family_phone: "", // 手机号
					family_job_address: "", // 工作单位
					family_job_new_address: "" // 现住住址
				},
				{
					family_name: "", // 家庭成员名称
					family_relation: "", // 家庭成员与本人的关系
					family_phone: "", // 手机号
					family_job_address: "", // 工作单位
					family_job_new_address: "" // 现住住址
				});
			} else {
				this.formValidate.family.push({
					family_name: "", // 家庭成员名称
					family_relation: "", // 家庭成员与本人的关系
					family_phone: "", // 手机号
					family_job_address: "", // 工作单位
					family_job_new_address: "" // 现住住址
				});
			}
			
		},
		handleChange(value, selectedData) {
			this.formValidate.position_id = "";
			this.positionArr = [];
			value[0] && this.handleEntryPosition(value[0]);
		},
		handleEntryPosition(id) {
			this.$request({
				url: API_ROOT.HR_POSITION_LIST_GET,
				type: "GET",
				param: {
					depart_id: id,
					type: 1
				},
				loading: false
			}).then(res => {
				this.positionArr = res.data.list;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleDel(index) {
			this.formValidate.family.splice(index, 1);
		},
		handleCancel(type, name) {
			this.loadProfileData(type, name);
		},
		handleEdit(type) {
			switch (type) {
				case "个人资料":
					this.infoStatus = true;
					break;
				case "身份信息":
					this.idStatus = true;
					break;
				case "学历证明":
					this.eduStatus = true;
					break;
				case "离职证明":
					this.offStatus = true;
					break;
				case "家庭成员":
					this.familyStatus = true;
					this.formValidate.family
                        && this.formValidate.family.length == 0
                        && this.handleAddFamily();
					break;
				case "紧急联系人":
					this.emergencyStatus = true;
					break;
				case "我的看法":
					this.perspectiveStatus = true;
					break;
				default:
					break;
			}
		},
		handleSubmit(type, name) {
			if (
				this.formValidate.family
                && this.formValidate.family.length == 0
			) {
				if (this.formValidate.birthday == "" && this.idStatus) {
					this.$refs[`form${type}`].validate();
					this.handleFetch(type, name);
					return;
				} else {
					this.$refs[`form${type}`].validate();
					this.handleFetch(type, name);
				}
			} else {
				this.$refs[`form${type}`].validate(isValid => {
					if (isValid) {
						this.handleFetch(type, name);
					}
				});
			}
		},
		handleFetch(type, name) {
			this.formValidate.birthday = this.formValidate.birthday ? moment(this.formValidate.birthday).format(
				"YYYY-MM-DD"
			) : '';
			this.formValidate.predict_entry_time = this.formValidate.predict_entry_time ? moment(this.formValidate.predict_entry_time).format(
				"YYYY-MM-DD"
			) : '';
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_PROFILE_EIND_INFO_POST,
				type: "POST",
				param: {
					staff_id: unCode(this.$route.query.staff_id),
					...this.formValidate,
					type,
				},
				loading: false
			})
				.then(res => {
					this[name] = false;
					// this.$router.replace(
					// 	getHashUrl("/hr/employee/summary/details", {
					// 		...this.$route.query,
					// 		name: Math.floor(Math.random() * 100)
					// 	})
					// );
					this.loadProfileData(type, name);
					this.$Message.success(res.msg);
				})
				.catch(err => {
					this.$Message.error(err.msg);
				});
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handlePrint() {
			this.$refs.pageTarget.print();
		},
	}
};
</script>

<style lang="scss">
.v-hr-profile-form {
    padding-bottom: 68px;
    ._oaitem {
        margin-left: 10px;
    }
    .ivu-form .ivu-form-item-label {
        color: #838695 !important;
    }
    .ivu-radio-wrapper:first-child {
        margin-right: 0px;
    }
    // .ivu-radio-wrapper:last-child {
    //     margin-left: 40px;
    // }
    ._add {
        display: inline-block;
        font-size: 14px;
        margin-left: 24px;
    }
    ._education {
        padding-top: 30px;
        width: 101%;
        background-color: #fafafa;
        margin-bottom: 10px;
        position: relative;
    }
    ._edu {
        padding-left: 10px;
        margin-left: -10px;
        background-color: #fafafa;
        margin-bottom: 10px;
    }
    ._del {
        position: absolute;
        top: 8px;
        right: 18px;
        font-size: 14px !important;
        display: inline-block;
    }
}
</style>