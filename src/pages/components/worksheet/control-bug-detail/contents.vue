<template>
	<div class="v-worksheet-control-bug-detail g-pd-lr-20 g-pd-b-20">
		<div class="g-m-t-20 _top">
			<div 
				v-if="bugDetail.wait && (bugDetail.wait.wait_confirm || bugDetail.wait.wait_feedback || bugDetail.wait.wait_verify)" 
				class="g-pd-l-20 __remind"
			>
				<span class="g-fs-14 g-c-black2">我的工单提醒：</span>
				<span 
					v-if="bugDetail.wait.wait_confirm" 
					class="g-operation" 
					@click="handleControlBug(2)"
				>
					待您确认（{{ bugDetail.wait.wait_confirm }}）
				</span>
				<span
					v-if="bugDetail.wait.wait_feedback"
					class="g-pointer g-m-lr-10" 
					style="color: #ED8F4A;" 
					@click="handleControlBug(1)"
				>
					待您反馈（{{ bugDetail.wait.wait_feedback }}）
				</span>

				<span
					v-if="bugDetail.wait.wait_verify"
					class="g-pointer" 
					style="color: #CC6633;" 
					@click="handleControlBug(3)"
				>
					待您验证（{{ bugDetail.wait.wait_verify }}）
				</span>
			</div>

			<div 
				v-if="bugDetail.detail && bugDetail.detail.process" 
				class="g-flex g-m-t-20 __arrowhead"
			>
				<div class="g-flex __left">
					<div
						:style="{'background' : color[bugDetail.detail.process[0].status - 1]}"
						class="g-tc g-fs-14 g-c-white"
					>
						{{ bugDetail.detail.process[0].status_name }}
					</div>
					<div :style="{'border-color' : `transparent transparent transparent ${color[bugDetail.detail.process[0].status - 1]}`}"/>
				</div>
				<div class="g-flex g-relative __mid">
					<div class="g-absolute"/>
					<div
						:style="{'background' : color[bugDetail.detail.process[1].status - 1]}"
						class="g-tc g-c-white"
					>
						{{ bugDetail.detail.process[1].status_name }}
					</div>
					<div :style="{'border-color' : `transparent transparent transparent ${color[bugDetail.detail.process[1].status - 1]}`}"/>
				</div>
				<div class="g-flex g-relative __right">
					<div class="g-absolute"/>
					<div
						:style="{'background' : color[bugDetail.detail.process[2].status - 1]}"
						class="g-tc g-c-white"
					>
						{{ bugDetail.detail.process[2].status_name }}
					</div>
					<div :style="{'border-color' : `transparent transparent transparent ${color[bugDetail.detail.process[2].status - 1]}`}"/>
				</div>
			</div>

			<div 
				v-if="bugDetail.detail" 
				class="g-m-t-20 g-pd-t-25 g-pd-b-20 g-pd-l-20 g-fs-12 __basic"
			>
				<div class="g-flex g-fw-w" style="height: 80px;">
					<div style="margin-right: 80px;">
						<span class="g-tr g-inline-block" style="color: #818794;width:72px;">
							工单编号：
						</span>
						<span class="g-inline-block" style="color: #4B4F57;width: 160px;">
							{{ bugDetail.detail.bug_id }}
						</span>
					</div>
					<div style="margin-right: 80px;">
						<span class="g-tr g-inline-block" style="color: #818794;width:72px;">
							创建时间：
						</span>
						<span class="g-inline-block" style="color: #4B4F57;width: 160px;">
							{{ bugDetail.detail.create_time }}
						</span>
					</div>
					<div style="margin-right: 80px;">
						<span class="g-tr g-inline-block" style="color: #818794;width:72px;">
							所属模块：
						</span>
						<span v-if="bugDetail.detail.module_names.length < 12" class="g-inline-block" style="color: #4B4F57;width: 160px;">
							{{ bugDetail.detail.module_names }}
						</span>
						<i-tooltip
							v-else
							:content="bugDetail.detail.module_names"
							placement="bottom"
							max-width="250"
						>
							{{ bugDetail.detail.module_names.slice(0, 12) + '...' }}
						</i-tooltip>
					</div>
					<div style="margin-right: 80px;">
						<span class="g-tr g-inline-block" style="color: #818794;width:72px;">
							客户账号：
						</span>
						<span v-if="bugDetail.detail.customer_account.length < 12" class="g-inline-block" style="color: #4B4F57;width: 160px;">
							{{ bugDetail.detail.customer_account ? bugDetail.detail.customer_account : "--" }}
						</span>
						<i-tooltip
							v-else
							:content="bugDetail.detail.customer_account"
							placement="bottom"
							max-width="250"
						>
							{{ bugDetail.detail.customer_account.slice(0, 12) + '...' }}
						</i-tooltip>
					</div>
					<div style="margin-right: 80px;">
						<span class="g-tr g-inline-block" style="color: #818794;width:72px;">
							客户端来源：
						</span>
						<span class="g-inline-block" style="color: #4B4F57;width: 160px;">
							{{ ["PC","APP","H5"][bugDetail.detail.customer_source - 1] }}
						</span>
					</div>
					<div style="margin-right: 80px;">
						<span class="g-tr g-inline-block" style="color: #818794;width:72px;">
							抄送：
						</span>
						<span v-if="bugDetail.detail.copy_for_staff_name.length < 12" class="g-inline-block" style="color: #4B4F57;width: 160px;">
							{{ bugDetail.detail.copy_for_staff_name ? bugDetail.detail.copy_for_staff_name : "--" }}
						</span>
						<i-tooltip
							v-else
							:content="bugDetail.detail.copy_for_staff_name"
							placement="bottom"
							max-width="250"
						>
							{{ bugDetail.detail.copy_for_staff_name.slice(0, 12) + '...' }}
						</i-tooltip>
					</div>
					<div v-if="bugDetail.detail.assign_staff_name.length != 0" style="margin-right: 80px;">
						<span class="g-tr g-inline-block" style="color: #818794;width:72px;">
							当前指派：
						</span>
						<span class="g-inline-block" style="color: #4B4F57;width: 160px;">
							{{ bugDetail.detail.assign_staff_name }}
						</span>
					</div>
					<div style="margin-right: 80px;">
						<span class="g-tr g-inline-block" style="color: #818794;width:72px;">
							优先级：
						</span>
						<span class="g-inline-block" style="color: #4B4F57;width: 160px;">
							{{ bugDetail.detail.priority }}级
						</span>
					</div>
					<div style="margin-right: 80px;">
						<span class="g-tr g-inline-block" style="color: #818794;width:72px;">
							状态：
						</span>
						<span class="g-inline-block" style="color: #E74854;width: 160px;">
							{{ bugDetail.detail.process_status_name }}
						</span>
					</div>
					<div style="margin-right: 80px;">
						<span class="g-tr g-inline-block" style="color: #818794;width:72px;">
							解决方案：
						</span>
						<span class="g-inline-block" style="color: #4B4F57;width: 160px;">
							{{ bugDetail.detail.solve_type_name ? bugDetail.detail.solve_type_name: "--" }}
						</span>
					</div>
				</div>

				<div class="g-flex g-jc-sb g-m-t-5">
					<div class="g-m-l-15" style="margin-right: 80px;">
						<span style="color: #818794;">bug标题：</span>
						<span style="color: #4B4F57;">{{ bugDetail.detail.title }}</span>
					</div>

					<div class="g-flex g-flex-ac g-pointer" style="color: #2397f9;">
						<div v-for="(item,index) in bugDetail.detail.button" :key="index">
							<div 
								class="g-flex g-flex-ac g-m-r-20"
								@click="handleOperation(item)"
							>
								<i
									v-if="+item === 1 || +item === 8"
									:class="button[item - 1].icon"
									class="iconfont g-fs-10"
								/>
								<i  
									v-else
									:class="button[item - 1].icon"
									class="iconfont"
								/>
								<span class="g-m-l-5">{{ button[item - 1].name }}</span>
							</div>
						</div>
						<div v-if="$auth[1508]" class="g-m-r-20 g-flex g-flex-ac" @click="handleOperation(9)">
							<i class="iconfont icon-delete"/>
							<span class="g-m-l-5">删除</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-if="showChat.length > 0" class="g-m-t-20 g-flex _bottom">
			<div class="g-m-r-20 __bleft">
				<div class="g-b g-m-b-20 __connect">
					<div 
						class="g-flex g-jc-sb g-pd-lr-20 g-pointer __connectt"
						@click="handleToggle('connect')"
					>
						<span>沟通记录</span>
						<i
							:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
							class="iconfont g-fs-10"
						/>
					</div>
					<div>
						<vc-expand ref="connect" v-model="show">
							<div class="g-pd-t-20 __ask">
								<div
									v-for="(item,index) in showChat" 
									:key="index"
								>
									<div>
										<div class="g-m-t-10 g-flex g-jc-sb">
											<div>
												<span style="color: #E74854;">
													[{{ ["提问","反馈","激活","指派","编辑","解决","验证通过","关闭","创建"][item.type - 1] }}]
												</span>
												<span style="color: #4B4F57;">
													{{ item.staff_name }}：
												</span>
											</div>
											<div>{{ item.create_time }}</div>
										</div>

										<div
											:class="index != showChat.length - 1 ? 'g-bb' : ''"
											class="g-pd-b-20 g-m-tb-10"
										>
											<div style="width: 100%;">
												<div 
													v-if="item.sensitive_info"
													class="g-flex g-m-r-20"
												>
													<span class="g-inline-block" style="width: 60px;">敏感信息：</span>
													<span class="g-inline-block" style="width: 92%;">{{ item.sensitive_info }}</span>
												</div>

												<div v-if="item.assign_staff_name" class="g-m-t-10 g-flex">
													<div style="width: 60px;" class="g-tr">指派给：</div>
													<div>{{ item.assign_staff_name }}</div>
												</div>

												<div v-if="item.copy_for_staff_name" class="g-m-t-10 g-flex">
													<div style="width: 60px;" class="g-tr">抄送给：</div>
													<div>{{ item.copy_for_staff_name }}</div>
												</div>

												<div v-if="item.solve_type_name" class="g-m-t-10 g-flex">
													<div style="width: 60px;" class="g-tr">解决方案：</div>
													<div>{{ item.solve_type_name }}</div>
												</div>

												<div v-if="item.type != 5 && item.describe" class="g-flex g-m-t-10">
													<div style="width: 60px;" class="g-tr">
														{{ ["提问内容","反馈内容","备注","备注","","备注","备注","备注","问题描述"][item.type - 1] }}：
													</div>
													<div style="width: 85%;">
														<oa-editor-preview :content="item.describe"/>
													</div>
												</div>

												<div v-if="item.fileImage && item.fileImage.length > 0" class="g-m-t-10 g-flex">
													<div style="width: 60px;" class="g-tr">附件：</div>
													<div>
														<div 	
															v-for="(element, index) in item.fileImage"
															:key="index"
															class="g-m-b-5"
														>
															<div
																class="g-operation g-flex g-flex-ac"
																@click="handlePreview($event,element)"
															>
																<i class="iconfont icon-accessory g-fs-12 g-m-r-5"/>
																<span
																	v-if="element.file_name.length < 50"
																	style="width: 250px; word-break: break-all;line-height:14px;"
																>
																	{{ element.file_name }}
																</span>
																<i-tooltip
																	v-else
																	:content="element.file_name"
																	placement="top"
																	theme="light"
																	max-width="320"
																>
																	{{ element.file_name.slice(0, 50) + '...' }}
																</i-tooltip>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div class="g-flex g-jc-fe g-m-t-10">
												<vc-debounce-click
													class="g-red-btn-line g-m-r-10"
													@click="handleQuestion(item.chat_id,1)"
												>
													提问
												</vc-debounce-click>
												<vc-debounce-click
													class="g-red-btn-line"
													@click="handleQuestion(item.chat_id,2)"
												>
													反馈
												</vc-debounce-click>
											</div>
										</div>
									</div>
								</div>
							</div>
						</vc-expand>
					</div>
				</div>

				<div v-if="flag" class="g-m-t-20 g-b __feedback">
					<div class="g-pd-l-20 g-fs-14 __feedbackt">
						我要{{ flag === 1 ? "提问" : "反馈" }}
					</div>

					<i-form
						ref="form"
						:model="formData"
						:rules="rules"
						:label-width="40"
						class="g-m-t-20"
						style="padding-right: 50px;"
						@submit.native.prevent
					>
						<div class="g-m-b-15" style="margin-left: 40px;">
							<span class="g-fs-14" style="color: #ed4014;">*</span>
							<span>{{ flag === 1 ? "提问" : "反馈" }}内容：</span>
						</div>
						<i-form-item class="__dot" label=" " prop="describe">
							<vc-editor
								ref="editor"
								v-model="formData.describe"
								:options="options"
								:disabled="disabled"
							/>
						</i-form-item>

						<div class="g-m-b-15" style="margin-left: 40px;">
							<span>敏感信息：</span>
						</div>
						<i-form-item class="__dot" label=" " prop="">
							<oa-limit-words
								v-model="formData.sensitive_info"
								:max="200"
								placeholder="请在此处填写账号密码等敏感信息"
								style="width: 100%;"
							/>
						</i-form-item>
					</i-form>

					<div class="g-flex g-flex-cc" style="magin-top: 50px; margin-bottom: 33px;">
						<div 
							class="g-gray-btn-small g-m-r-10 g-inline-block"
							@click="handleCancel"
						>
							取消
						</div>
						<i-button
							:loading="loading"
							type="primary"
							@click="handleSend"
						>
							提交
						</i-button>
					</div>
				</div>
			</div>

			<div v-if="bugDetail.log" class="g-b __bright">
				<div class="g-pd-l-20 __brightt">bug的一生</div>

				<div class="g-pd-10">
					<oa-steps
						:data-source="bugDetail.log"
						:type="1"
						:render-title="renderTitle"
						min-width="100%"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Button, Form, FormItem, Tooltip } from "iview";
import { Editor, Expand } from "wya-vc";
import Steps from "@components/_common/steps/steps";
import EditorPreview from '@common/editor-preview/editor-preview';
import { Confirm } from "@components/_common/confirm/confirm";
import { FilePreview } from '@common/file-preview/file-preview';
import { CloseModal } from "../control-bug/popup/close-modal";
import { OrderModal } from "../control-bug/popup/order-modal";
import { ResolveModal } from "../control-bug/popup/resolve-modal";

export default {
	name: 'oa-worksheet-control-bug-detail',
	components: {
		"i-button": Button,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-tooltip": Tooltip,
		"oa-steps": Steps,
		"oa-editor-preview": EditorPreview,
		"vc-expand": Expand,
		"vc-editor": Editor
	},
	data() {
		return {
			color: ["#8DCBFF", "#2397F9", " #c0c3c9"],
			loading: false,
			formData: {
				describe: "",
				sensitive_info: ""
			},
			rules: {
				describe: [
					{ required: true, message: '反馈内容不可为空！', trigger: 'change' }
				]
			},
			options: {
				modules: {
					toolbar: '#toolbar'
				},
				placeholder: '若提供账号密码信息，请通过“敏感信息”方式添加'
			},
			showChat: [], // 沟通记录
			bugDetail: {}, // BUG详情
			button: [
				{
					name: '编辑',
					icon: 'icon-edit'
				},
				{
					name: '关闭',
					icon: 'icon-uncomplete'
				},
				{
					name: '不予解决',
					icon: 'icon-forbid'
				},
				{
					name: '指派',
					icon: 'icon-assign'
				},
				{
					name: '确认',
					icon: 'icon-completed'
				},
				{
					name: '验证通过',
					icon: 'icon-completed'
				},
				{
					name: '激活',
					icon: 'icon-activation'
				},
				{
					name: '解决',
					icon: 'icon-solve'
				},
				{
					name: '删除',
					icon: 'icon-delete'
				}
			],
			disabled: false,
			show: true,
			flag: null, // 1 提问 2反馈
			chatId: null
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	mounted() {
		this.loadShowChatData();
		this.loadInfoData();
	},
	methods: {
		// bug详情
		loadInfoData() {
			this.$request({
				url: "_WORKSHEET_CONTROL_BUG_DETAIL_INFO_GET",
				type: "GET",
				param: {
					bug_id: this.$route.query.bug_id
				},
				loading: false
			}).then(res => {
				this.bugDetail = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		// 沟通记录
		loadShowChatData() {
			this.$request({
				url: "_WORKSHEET_CONTROL_BUG_DETAIL_SHOW_CHAT_GET",
				type: "GET",
				param: {
					bug_id: this.$route.query.bug_id
				},
				loading: false
			}).then(res => {
				this.showChat = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		// 提问反馈
		handleQuestion(chatId, flag) {
			this.chatId = chatId;
			this.flag = flag;
		},

		// 提交
		handleSend() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.loading = true;
					let API = this.flag === 1 ? "_WORKSHEET_CONTROL_BUG_DETAIL_ASK_POST" : "_WORKSHEET_CONTROL_BUG_DETAIL_FEEDBACK_POST";

					this.$request({
						url: API,
						type: "POST",
						param: {
							parent_chat_id: this.chatId,
							...this.formData
						},
						loading: false
					}).then(res => {
						this.flag = null;
						this.chatId = null;
						this.formData.describe = "";
						this.formData.sensitive_info = "";
						this.$Message.success(res.msg);
						this.loadShowChatData();
					}).catch(error => {
						this.$Message.error(error.msg);
					}).finally(() => {
						this.loading = false;
					});
				} 
			});
		},

		// 取消
		handleCancel() {
			Confirm.popup({
				title: "",
				msg: '知道了取消后，所填写的内容将不会保存，是否确认取消？',
				showIcon: true
			}).then(() => {
				this.flag = null;
				this.chatId = null;
				this.formData.describe = "";
				this.formData.sensitive_info = "";
			}).catch(error => {
			});
		},

		handleControlBug(label_type) {
			this.$router.push({
				path: '/worksheet/control/bug',
				query: {
					label_type
				}
			});
		},

		handleToggle(value) {
			this.$refs[value].toggle();
		},

		renderTitle(h, params) {
			const { type_name, create_time, staff_name, response_time, remark, type } = params.rows;

			return (
				<div class="g-m-r-20">
					<div class="g-pd-l-10 g-flex g-jc-sb">
						<div class="g-m-r-30 g-flex g-flex-ac">
							<span>{type_name}</span>
						</div>
						<div class="g-c-black4">{create_time}</div>
					</div>
					<div class="g-m-t-5 g-pd-l-10 g-flex g-jc-sb">
						<span class="g-m-r-30">{staff_name}</span>
						{
							response_time 
								? <span class="g-c-black4">
									{[5, 7, 8].indexOf(+type) > -1 ? '解决时长' : '响应时长'}：{response_time}
								</span>
								: null
						}
					</div>
				</div>
			);
		},

		// 预览
		handlePreview(e, item) {
			this.$emit('preview-start');

			FilePreview.popup({
				data: {
					fileUrl: item.url,
					x: e.clientX,
					y: e.clientY
				}
			}).then(res => {
			}).catch(err => {
			}).finally(() => {
				this.$emit('preview-end');
			});
		},

		// 操作
		handleOperation(index) {
			let API = ["", "", "", "", 
				"", "_WORKSHEET_CONTROL_BUG_DETAIL_CONFIRM_POST", 
				"", "", "", "_WORKSHEET_CONTROL_BUG_DETAIL_DELETE_POST"];
			let msg = ["", "", "", "", "", 
				"是否确认该bug，确认后，请尽快处理", "", "", "", "是否确认删除该bug，删除后，将无法恢复"];

			if (+index === 1) {
				this.$router.push({
					path: '/worksheet/control/bug/add',
					query: {
						edit: 2,
						bug_id: this.bugDetail.detail.bug_id,
						status: this.bugDetail.detail.status
					}
				});

				return;
			} else if (+index === 2) {
				CloseModal.popup({
					data: {
						bug_id: this.bugDetail.detail.bug_id,
						status: this.bugDetail.detail.status
					}
				}).then(res => {
					this.loadInfoData();
				});
			} else if ([4, 7].indexOf(+index) > -1) {
				OrderModal.popup({
					data: {
						bug_id: this.bugDetail.detail.bug_id,
						status: this.bugDetail.detail.status,
						assign_staff_id: this.bugDetail.detail.assign_staff_id
					},
					is_order: +index
				}).then(res => {
					this.loadInfoData();
					this.loadShowChatData();
				});
			} else if ([6, 8].indexOf(+index) > -1) {
				ResolveModal.popup({
					is_order: index,
					data: {
						bug_id: this.bugDetail.detail.bug_id,
						solve_type: this.bugDetail.detail.solve_type,
						status: this.bugDetail.detail.status
					}
				}).then(res => {
					this.loadInfoData();
					this.loadShowChatData();
				});
			} else {
				Confirm.popup({
					title: "",
					msg: msg[index],
					showIcon: true
				}).then(() => {
					this.$request({
						url: API[index],
						type: "POST",
						param: {
							bug_id: this.bugDetail.detail.bug_id,
							status: this.bugDetail.detail.status
						}
					}).then(res => {
						this.$Message.success(res.msg);
					}).then(() => {
						if (+index === 9) {
							this.$router.push({
								path: '/worksheet/control/bug',
								query: {
									type: 1
								}
							});
						} else {
							this.loadInfoData();
						}
					}).catch(error => {
						this.$Message.error(error.msg);
					});
				}).catch(error => {
				});
			}
		}
	}
};
</script>

<style lang="scss">
.v-worksheet-control-bug-detail{
	._top{
		.__remind{
			height: 40px;
			line-height: 40px;
			background: #F6F6F7;
		}

		.__arrowhead{
			.__left,.__mid.__right{
				height: 40px;
			}

			.__left{
				width: 32%;

				div {
					&:nth-of-type(1){
						width: 100%;
						line-height: 40px;
					}

					&:nth-of-type(2){
						width:0;
						height:0;
						border-width:20px 0 20px 20px;
						border-style:solid;
					}
				}
			}

			.__mid{
				width: 34%;

				div{
					&:nth-of-type(1){
						width:0;
						height:0;
						border-width:20px 0 20px 20px;
						border-style:solid;
						border-color:transparent transparent transparent #ffffff;
					}

					&:nth-of-type(2){
						width: 100%;
						line-height: 40px;
					}

					&:nth-of-type(3){
						width:0;
						height:0;
						border-width:20px 0 20px 20px;
						border-style:solid;
					}
				}
			}

			.__right{
				width: 34%;

				div{
					&:nth-of-type(1){
						width:0;
						height:0;
						border-width:20px 0 20px 20px;
						border-style:solid;
						border-color:transparent transparent transparent #ffffff;
					}

					&:nth-of-type(2){
						width: 100%;
						line-height: 40px;
					}

					&:nth-of-type(3){
						width:0;
						height:0;
						border-width:20px 0 20px 20px;
						border-style:solid;
					}
				}
			}
		}

		.__basic{
			background: #F6F6F7;
		}
	}

	._bottom{
		.__bleft{
			width: 75%;

			.__connect{
				.__connectt{
					height: 40px;
					line-height: 40px;
					background: #F8F8F8;
				}

				.__ask{
					padding-left: 41px;
					padding-right: 31px;
				}
			}

			.__feedback{
				.__feedbackt{
					height: 40px;
					line-height: 40px;
					background: #F8F8F8;
				}
			}
		}

		.__bright{
			width: 24%;
			min-height: 600px;

			.__brightt{
				height: 40px;
				line-height: 40px;
				background: #F8F8F8;
			}
		}
	}

	.__dot{
		.ivu-form-item-label:before{
			content: '';
		}
	}

	.ivu-tooltip{
		width: 160px;
	}
}
</style>