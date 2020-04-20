<template>
	<div class="v-sc-customer-product-progress g-pd-l-30 g-relative">
		<div v-if="spin">
			<oa-title title="制作进度" class="g-m-t-30 g-m-b-20"/>

			<div class="g-m-b-10">
				<h3
					class="g-fs-16 g-flex g-jc-sb g-flex-ac g-pointer"
					@click="handleToggle('first_expand')"
				>
					<span>
						<i 
							:class="show_first ? 'icon-triangle-down' : 'icon-triangle-right'" 
							class="iconfont g-fs-12" 
						/>
						{{ product_name }}({{ progress }} %)
					</span>
				
					<span
						v-if="complete"
						class="g-inline-block g-fs-12 g-tc g-c-white g-pointer"
						@click.stop="handleComleteTime"
					>
						制作完成
					</span>
					<div 
						v-else
						class="g-inline-block g-pointer g-fs-14"
						style="color: #4fc43d;"
						@click.stop="handleComleteTime"
					>
						已完成（完成时间{{ complete_time }}）
					</div>
				</h3>

				<vc-expand ref="first_expand" v-model="show_first">
					<div class="_fllow-records">
						<h5 class="g-flex g-flex-ac">
							<p class="g-pointer" @click="handleToggle('fllow_expand')">
								<i 
									:class="show_fllow ? 'icon-triangle-down' : 'icon-triangle-right'" 
									class="iconfont g-fs-12" 
								/>
								<span>跟进记录</span>
							</p>

							<p
								v-if="($auth[320] && flag == '1') || ($auth[327] && flag == '2')"
								class="g-fs-12 g-pointer g-m-l-20"
								@click="handleAddRecord(make_id)"
							>
								添加跟进记录
							</p>
						</h5>
					</div>

					<vc-expand ref="fllow_expand" v-model="show_fllow">
						<div class="g-pd-b-10 g-pd-t-5 _time-line">
							<div v-for="(item,index) in track_record" :key="index" class="g-flex g-jc-sb g-pd-r-30">
								<div class="g-flex" style="width: 90%;">
									<div style="width: 16px; margin-top: 4px" class="g-m-r-20">
										<div :class="index === 0 ? '_dot-active' : '_dot'"/>
										<div v-if="index < track_record.length - 1" class="_line" />
									</div>

									<div v-if="item.type == 1">
										<p class="g-fs-12 __time-top">
											<span>{{ item.operator_name }}</span>
											<span style="margin-left:20px;">{{ item.create_time }}</span>
										</p>

										<p class="g-m-b-10">
											<span>{{ item.content }}</span>
										</p>
									</div>

									<div v-else-if="item.type == 2">
										<p class="g-fs-12 __time-top">
											<span>{{ item.operator_name }}</span>
											<span style="margin-left:20px;">{{ item.create_time }}</span>
											<span>({{ item.product_step_name }})</span>
										</p>

										<p v-for="(element,val) in item.content" :key="val" class="g-m-b-10 g-flex __content">
											<span>{{ element.field_code }}：</span>
											<span v-if="element.type == '6'">
												<oa-upload
													v-model="element.info" 
													disabled
													style="width: 300px"
												/>
											</span>
											<span v-else>{{ element.info }}</span>
										</p>
									</div>

									<div v-else class="g-m-b-20">
										<p class="g-fs-12 __time-top g-m-b-10">
											<span>{{ item.operator_name }}</span>
											<span style="margin-left:20px;">{{ item.create_time }}</span>
											<span>({{ item.product_step_name }})</span>
										</p>

										<p class="g-m-b-10 g-flex __time-bottom">
											<span>情况说明：</span>
											<span>{{ item.content.content }}</span>
										</p>

										<p v-if="item.content.images.length != 0" class="g-flex">
											<span>凭证查看：</span>
											<span>
												<oa-upload
													v-model="item.content.images" 
													disabled
													style="width: 300px"
												/>
											</span>
										</p>
									</div>
								</div>

								<div>
									<span 
										class="g-pointer g-operation"
										@click.stop="handleEditRecords(item.record_id, item.step_id)"
									>
										编辑
									</span>
								</div>
							</div>
						</div>
					</vc-expand>
				</vc-expand>
			</div>

			<ul>
				<li 
					v-for="(item,index) in list" 
					:key="index"
					@click.once="handleGetRecord(item.step_id,item.have_record,item.show)"
				>
					<h4
						class="g-fs-14 g-c-black g-flex g-jc-sb g-flex-ac g-relative g-pointer"
						@mouseenter="item.shows = true" 
						@mouseleave="item.shows = false"
						@click="handleToggle(`expand_${index}`)"
					>
						<div class="g-absolute _position"/>
						<span>
							<i 
								:class="item.show && item.have_record ? 'icon-triangle-down' : 'icon-triangle-right'" 
								class="iconfont g-fs-12" 
							/>
							{{ item.product_step_name }}
						</span>

						<div>
							<i 
								v-if="item.shows && item.is_auth == '1'" 
								class="iconfont icon-attention"
								style="color:#ed8f4a;"
								@click.stop="handleVoucher(item.step_id, index, '', item.show)"
							/>
							<span 
								v-if="item.is_complete == '1'" 
								class="g-inline-block g-fs-12 g-tc _completed"
							>
								已完成
							</span>
							<span 
								v-else-if="item.have_record == '1'" 
								class="g-inline-block g-fs-12 g-tc _have-records"
							>
								有记录
							</span>
							<span 
								v-else-if="item.is_auth == '1'"
								class="g-inline-block g-fs-12 g-tc g-pointer _add-records" 
								@click.stop="handleRecords(item.step_id,index,true)"
							>
								添加记录
							</span>
						</div>
					</h4>

					<vc-expand 
						:ref="`expand_${index}`" 
						v-model="item.show"
					>
						<div v-if="item.have_record">
							<div v-if="data['step_' + item.step_id]">
								<div v-if="data['step_' + item.step_id].length != 0">
									<div 
										v-for="(val,k_index) in data['step_' + item.step_id]" 
										:key="k_index" 
										class="g-pd-b-20 g-flex g-jc-sb _qun"
									>
										<div v-if="val.type == 1" style="width: 90%;">
											<p 
												v-for="(key,value) in val.content" 
												:key="value"
												class="g-fs-12 g-relative g-m-b-20"
											>
												<span class="g-inline-block g-tr g-absolute">
													{{ key.field_code }}：
												</span>
												<span 
													v-if="key.type == '6'"
													class="g-inline-block g-relative"
												>
													<oa-upload
														v-model="key.info" 
														disabled
														style="width: 300px"
													/>
												</span>
												<span v-else class="g-inline-block g-relative">
													{{ key.info }}
												</span>
											</p>
											<p class="g-fs-12 g-relative g-m-b-20">
												<span class="g-inline-block g-tr g-absolute">
													记录人：
												</span>
												<span class="g-inline-block g-relative">
													{{ val.operator_name }}
												</span>
											</p>
											<p class="g-fs-12 g-relative g-m-b-20">
												<span class="g-inline-block g-tr g-absolute">
													记录时间：
												</span>
												<span class="g-inline-block g-relative">
													{{ val.create_time }}
												</span>
											</p>
										</div>

										<div v-else>
											<p class="g-fs-12 g-relative g-m-b-20">
												<span class="g-inline-block g-tr g-absolute">
													情况说明：
												</span>
												<span class="g-inline-block g-relative">
													{{ val.content.content }}
												</span>
											</p>

											<p
												v-if="val.content.images.length != 0" 
												class="g-fs-12 g-relative g-m-b-20"
											>
												<span class="g-inline-block g-tr g-absolute">
													凭证查看：
												</span>
												<span class="g-inline-block g-relative">
													<oa-upload
														v-model="val.content.images" 
														disabled
														style="width: 300px"
													/>
												</span>
											</p>
											<p class="g-fs-12 g-relative g-m-b-20">
												<span class="g-inline-block g-tr g-absolute">
													记录人：
												</span>
												<span class="g-inline-block g-relative">
													{{ val.operator_name }}
												</span>
											</p>
											<p class="g-fs-12 g-relative g-m-b-20">
												<span class="g-inline-block g-tr g-absolute">
													记录时间：
												</span>
												<span class="g-inline-block g-relative">
													{{ val.create_time }}
												</span>
											</p>
										</div>

										<div v-if="val.type == 1" class="g-m-t-20 g-m-r-20">
											<span 
												v-if="item.is_auth == '1'"
												@click.stop="handleRecords(item.step_id, index, false, 1, val.record_id)"
											>
												编辑
											</span>
											<span 
												v-if="item.is_complete == '0' && item.is_auth == '1'" 
												@click.stop="handleOperate('10', '0', val.record_id, item.step_id,index)"
											>
												删除
											</span>
										</div>

										<div v-else class="g-m-t-20 g-m-r-20">
											<span 
												v-if="item.is_auth == '1'"
												@click.stop="handleVoucher(item.step_id,'',val.record_id, item.show)"
											>
												编辑
											</span>
											<span 
												v-if="item.is_complete == '0' && item.is_auth == '1'" 
												@click.stop="handleOperate('10', '0', val.record_id, item.step_id,index)"
											>
												删除
											</span>
										</div>
									</div>
								</div>

								<div v-else class="g-tc _no-data">暂无数据</div>
							</div>

							<div style="background: #fafafa;padding-bottom:20px;">
								<span 
									v-if="item.have_record && item.is_auth == '1'"
									class="g-inline-block g-fs-12 g-tc g-pointer _add-records" 
									style="margin-left:40px;" 
									@click.stop="handleRecords(item.step_id, index, false)"
								>
									添加记录
								</span>
								<span
									v-if="item.have_record && ( is_show == 0 ? ($auth[319] && flag == '1'|| $auth[326] && flag=='2') : true) 
									&& item.is_complete == '0' && item.is_auth == '1'" 
									class="g-inline-block g-fs-12 g-tc g-c-white g-pointer g-m-l-10 _complete" 
									@click.stop="handleOperate('1',make_id,'0',item.step_id,index)"
								>
									完成步骤
								</span>
							</div>
						</div>
					</vc-expand>
				</li>
			</ul>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { Expand } from "wya-vc";
import Steps from "@components/_common/steps/steps";
import Upload from '@components/_common/upload/upload';
import { Title } from "@components/sc/_common";
import { AddFollowRecordModal } from "./add-follow-record";
import { AddRecordModal } from "./add-record";
import { RecordPromptModal } from "./record-prompt";
import { VoucherModal } from "./voucher";
import { Progress } from "./progress";

export default {
	name: 'sc-coooperate-product-progress',

	components: {
		"vc-expand": Expand,
		"oa-steps": Steps,
		"oa-upload": Upload,
		"oa-title": Title
	},
  
	props: {
		project_id: Number,
		flag: String
	},
  
	data() {
		return {
			spin: false,
			value: "1",
			show_first: false,
			show_fllow: true,
			product_name: "", // 制作流程名称
			progress: "", // 进度
			status: "", // 是否已制作完成 1待完成 2已完成 3已失效'
			make_id: "", // 产品制作id
			complete_time: "", // 完成时间
			list: [],
			data: {},
			track_record: [],
			is_show: "", // 0不显示 1显示
			len: ""
		};
	},

	computed: {
		complete() {
			return (
				this.status == 1 
				&& (this.is_show == 0 ? ((this.$auth[318] && this.flag == "1") || (this.$auth[325] && this.flag == "2")) : true)
				&& !this.complete_time);
		}
	},
  
	mounted() {
		this.loadData();
		this.loadTrackRecord();
	},
  
	methods: {
		// 更进记录
		loadTrackRecord() {
			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_GET_PRODUCT_TRACK_RECORD_GET",
				type: "GET",
				param: {
					project_id: this.project_id
				},
				loading: false
			}).then(res => {
				res.data.track_record.forEach(item => {
					if (item.type == 2) {
						item.content.forEach(element => {
							if (element.type == 6) {
								let len = element.info.length;
								let cont = [];

								for (let i = 0; i < len; i++) {
									cont.push({
										url: element.info[i],
										title: element.info[i].substring(element.info[i].lastIndexOf("/") + 1, element.info[i].length),
										type: "." + element.info[i].substring(element.info[i].lastIndexOf(".") + 1, element.info[i].length),
									});
								}

								element.info = cont;
							}
						});
					} else if (item.type == 3) {
						let arr = [];

						item.content.images.forEach(element => {
							arr.push({
								url: element,
								title: element.split("/")[6],
								type: "." + element.split("/")[6].split(".")[1]
							});	
						});

						item.content.images = arr;
					}
				});

				this.complete_time = res.data.complete_time;
				this.track_record = res.data.track_record;
			});
		},

		handleToggle(value) {
			if (this.$refs[value][0]) {
				this.$refs[value][0].toggle();
			} else {
				this.$refs[value].toggle();
			}
		},

		// 添加跟进记录
		handleAddRecord(make_id) {
			AddFollowRecordModal.popup({
				make_id
			}).then(res => {
				res	 && this.loadTrackRecord();
			});
		},

		// 填写添加记录
		handleRecords(step_id, index, show, flag, record_id) {
			AddRecordModal.popup({
				step_id,
				flag,
				record_id
			}).then(res => {
				if (res) {
					this.loadTrackRecord();

					this.list.forEach((item, val) => {
						index == val ? item.have_record = 1 : "";
						index == val ? item.show = true : "";
					});
					
					if (show) {
						this.handleToggle("expand_" + index);
					}

					this.handleGetRecord(step_id, true, true);
					this.loadTrackRecord();
				}
			});
		},

		/*
		* name 为1表示完成步骤 为10表示删除
		*/
		handleOperate(name, make_id, record_id, step_id, index) {
			RecordPromptModal.popup({ name, make_id, record_id, step_id }).then(async res => {
				if (res) {
					this.loadTrackRecord();

					if (name == "10") {
						await this.handleGetRecord(step_id, true, true);

						if (this.len == 0) {
							this.list.forEach((item, val) => {
								if (index == val) {
									item.have_record = 0;
									item.show = false;
									this.handleToggle("expand_" + index);
								}
							});
						}
					} else {
						this.list.forEach((item, val) => {
							if (index == val) {
								item.is_complete = "1";
							}
						});

						this.handleGetProcess(make_id);
						this.$store.commit(this.flag == 1 ? "SC_CUSTOMER_COOPERATE_LIST_RESET" : "SC_PRODUCT_LIST_RESET", {
							type: this.type
						});
						this.$emit("event", true);
					}
				}
			});
		},

		// 得到数据
		loadData() {
			this.spin = false;

			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_STEP_INFO_GET",
				type: "GET",
				param: {
					project_id: this.project_id
				},
				loading: false
			}).then(res => {
				this.product_name = res.data.product_name;
				this.progress = res.data.progress;
				this.status = res.data.status;
				this.make_id = res.data.make_id + '';
				this.is_show = res.data.is_show;

				res.data.step_list.forEach(item => {
					this.list.push({ show: false, shows: false, ...item });
				});		

				this.spin = true;
			}).catch(error => {
				this.spin = true;
			});
		},

		async handleGetRecord(step_id, have_record, show) {
			let length = 0;

			if (have_record && show) {
				await this.$request({
					url: "_SC_CUSTOMER_COOPERATE_STEP_RECORD_GET",
					type: "GET",
					param: {
						step_id
					},
					loading: false
				}).then(res => {
					this.handleChangeData(res.data);
					this.$set(this.data, 'step_' + step_id, res.data);
					this.len = res.data.length;
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			}
		},

		handleGetProcess(make_id) {
			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_PROCESS_GET",
				type: "GET",
				param: {
					make_id
				},
				loading: false
			}).then(res => {
				this.progress = res.data.progress;
			}).catch(error => {
			});
		},

		handleVoucher(step_id, index, record_id, show) {
			VoucherModal.popup({
				step_id,
				record_id
			}).then(res => {
				if (res) {
					!show && this.handleToggle("expand_" + index);
					this.loadTrackRecord();
					this.handleGetRecord(step_id, true, true);

					this.list.forEach((item, val) => {
						index == val ? item.have_record = 1 : "";
						index == val ? item.show = true : "";
					});
				}
			});
		},

		handleChangeData(list) {
			list.forEach(item => {
				item.shows = false;

				if (item.type == 1) {
					item.content.forEach(element => {
						if (element.type == 6) {
							let len = element.info.length;
							let cont = [];

							for (let i = 0; i < len; i++) {
								cont.push({
									url: element.info[i],
									title: element.info[i].substring(element.info[i].lastIndexOf("/") + 1, element.info[i].length),
									type: "." + element.info[i].substring(element.info[i].lastIndexOf(".") + 1, element.info[i].length)
								});
							}

							element.info = cont;
						}
					});
				} else {
					let arr = [];
					
					item.content.images.forEach(element => {
						arr.push({
							url: element,
							title: element.substring(element.lastIndexOf("/") + 1, element.length),
							type: "." + element.substring(element.lastIndexOf(".") + 1, element.length)
						});
					});

					item.content.images = arr;
				}
			});
		},

		handleEditRecords(record_id, step_id) {
			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_GET_EDIT_TRACK_RECORD_GET",
				type: "GET",
				param: {
					record_id
				},
				loading: false
			}).then(res => {
				if (res.data.type == 1) {
					let component_info = res.data.component_info;

					AddFollowRecordModal.popup({
						component_info,
						flag: 1,
						record_id
					}).then(ress => {
						if (ress) {
							this.loadTrackRecord();
						}
					});
				} else if (res.data.type == 2) {
					let component_info = res.data.component_info;

					AddRecordModal.popup({
						component_info,
						flag: 1,
						flags: 1,
						record_id
					}).then(ress => {
						if (ress) {
							this.loadTrackRecord();
							this.handleGetRecord(step_id, true, true);
						}
					});
				} else {
					let component_info = res.data.component_info;

					VoucherModal.popup({
						component_info,
						record_id,
						flag: 1
					}).then(ress => {
						if (ress) {
							this.loadTrackRecord();
							this.handleGetRecord(step_id, true, true);
						}
					});
				}
			}).catch(error => {
			});
		},

		handleDeleteRecordPrompt(name, record_id) {
			RecordPromptModal.popup({ name, record_id }).then(res => {
				res && this.loadTrackRecord();
			});
		},

		// 完成时间
		handleComleteTime() {
			Progress.popup(
				{
					make_id: Number(this.make_id),
					project_id: Number(this.project_id),
					complete_time: this.complete_time
				}
			).then(res => {
				if (res) {
					this.loadTrackRecord();
					this.$store.commit(this.flag == 1 ? "SC_CUSTOMER_COOPERATE_LIST_RESET" : "SC_PRODUCT_LIST_RESET", {
						type: this.type
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
.v-sc-customer-product-progress {
	min-height: 300px;
	padding-bottom: 60px;

	h3 {
		background: #f0f4fd;
		padding: 0 18px;
		color: #4b4f57;
		height: 50px;
		line-height: 50px;

		span:nth-of-type(2) {
			background: #e84854;
			height: 32px;
			line-height: 32px;
			width: 80px;
			border-radius: 5px;
		}
	}

	._fllow-records {
		background: #fafafa;

		h5 {
			padding: 20px 0 20px 40px;

			p:nth-of-type(2) {
				color: #2397f9;
			}
		}
	}

	._time-line {
		padding-left: 54px;
		background: #fafafa;
	}

	._complete {
		background: #e84854;
		height: 32px;
		line-height: 32px;
		width: 80px;
		border-radius: 5px;
	}

	._add-records {
		height: 32px;
		line-height: 32px;
		width: 80px;
		border-radius: 5px;
		border: 1px solid #e84854;
		color: #e84854;
	}

	h4 {
		background: #fafafa;
		padding: 0 18px;
		height: 50px;
		line-height: 50px;

		._position {
			width: 0;
			height: 0;
			border-top: 16px solid #ff5461;
			border-right: 16px solid transparent;
			top: 0;
			left: 0;
		}

		._completed {
			height: 32px;
			line-height: 32px;
			width: 80px;
			color: #4fc43d;
		}

		._have-records {
			height: 32px;
			line-height: 32px;
			width: 80px;
			color: #bbbbbb;
		}
	}

	._qun {
		padding-left: 40px;
		background: #fafafa;
		border-top: 1px solid #eaeef1;

		div:nth-of-type(1){
			p {
				&:nth-of-type(1) {
					margin-top: 18px;
				}

				span {
					&:nth-of-type(1) {
						width: 110px;
					}

					&:nth-of-type(2) {
						margin-left: 110px;
						width: 80%;
					}
				}
			}
		}

		div:nth-of-type(2) {
			cursor: pointer;
			color: #2397f9;
			width: 60px;
		}
	}

	ul {
		li {
			margin-bottom: 10px;
			list-style: none;
		}
	}

	._no-data{
		height: 40px;
		line-height: 40px;
		background: #fafafa;
	}

	._title{
		display: none;
	}

	.c-upload{
		width: 100% !important;
	}

	._dot {
		width: 12px;
		height: 12px;
		margin-left: 2px;
		border-radius: 6px;
		border: 1px solid #e74854;
	}

	._dot-active {
		width: 16px;
		height: 16px;
		border-radius: 8px;
		background-color: #e74854;
		border: 4px solid #f5b6bb;
	}

	._line {
		width: 1px;
		height: calc(100% - 22px);
		background-color: #cdcdcd;
		margin-left: 7px;
		margin-top: 4px;
	}

	.__time-top{
		margin:0 0 5px 0;
		color:#818774;
	}

	.__time-bottom{
		span:nth-of-type(1){
			display: inline-block;
			width: 80px;
		}

		span:nth-of-type(2){
			display: inline-block;
			width: 84%;
		}
	}

	.__content{
		span:nth-of-type(1){
			display: inline-block;
			width: 140px;
			text-align: left;
		}

		span:nth-of-type(2){
			display: inline-block;
			width: 84%;
		}
	}
}
</style>