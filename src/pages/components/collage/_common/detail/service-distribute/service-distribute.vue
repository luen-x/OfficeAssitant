<template>
	<div class="v-service-distribute g-m-b-20">
		<oa-loading v-if="loading"/>
		<div class="g-flex g-fs-14 g-m-tb-30 g-m-l-20">
			<div style="margin-right: 90px;">
				<span class="_title-bar"/>
				<span class="g-c-black4 g-pd-l-5">产品名称：</span>
				<span class="g-c-black2">{{ product_name || '--' }}</span>
			</div>
			<div style="margin-left: 90px;">
				<span class="g-c-black4">流程对接人：</span>
				<span v-if="staffName">
					<span class="g-c-black2">{{ staffName }}</span>
					<span 
						v-if="$auth[1296] && authType === 1"
						class="g-c-blue-mid g-m-l-10 g-pointer"
						@click="handleDistribute({role_type: 1}, '更改')"
					>
						更改
					</span>
				</span>
				<i 
					v-else-if="$auth[1295] && authType == 1"
					class="icon iconfont icon-add1 g-c-blue-mid g-pointer g-fs-18"
					style="position: relative;top: 2px;"
					@click="handleDistribute({role_type: 1}, '选择')"
				/>
			</div>
		</div>

		<div 
			v-for="(item, index) in list" 
			:key="index"
			class="g-m-t-30 g-m-l-20"
		>
			<div class="g-m-r-30 g-flex g-jc-sb g-ai-c">
				<div 
					class="g-fs-14 g-c-black g-m-b-10 g-pointer"
					@click="handleToggle(`expand_${index}`)"
				>
					<span class="_title-bar"/>
					<span class="g-pd-l-5">{{ item.lecture_set_name }}</span>
					<i
						:class="item.show ? 'icon-triangle-down' : 'icon-triangle-up'"
						class="iconfont g-fs-10"
					/>
				</div>
				<div class="g-m-b-10">
					<span v-if="lessonType === 2 && item.auth_type !== 3 && !item.lesson_status">
						<span class="g-c-black4">合作项目：</span>
						<span v-if="item.edit_project" class="g-m-r-30">
							<i-select
								v-model="item.product_id"
								clearable
								transfer
								label-in-value
								style="width:220px;"
								class="g-m-r-5"
								placeholder="请选择合作项目"
								@on-change="handleProductChange($event,item)"
							>
								<i-option 
									v-for="(_item, _index) in productList" 
									:key="_index"
									:value="_item.product_id"
								>{{ _item.product_name }}</i-option>
							</i-select>
							<span class="g-c-blue-mid g-pointer" @click="handleProjectSave(item)">保存</span>
						</span>
						<span v-else class="g-m-r-30">
							<span class="g-c-black2">{{ item.product_name }}</span>
							<i 
								v-if="$auth[1301]"
								class="icon iconfont icon-bianji g-c-blue-mid g-m-l-10 g-pointer"
								@click="handleEditProject(item)"
							/>
						</span>
					</span>
					<i-button 
						v-if="lessonType === 1 && $auth[1299] && item.auth_type !== 3 && !item.lesson_status"
						ghost 
						class="g-m-l-5 _btn" 
						@click="handleEditNest(item)"
					>
						更改套系
					</i-button>
					<i-button 
						v-if="$auth[1300] && item.auth_type !== 3 && !item.lesson_status"
						ghost 
						class="g-m-l-5 _btn"
						@click="handleDelDistribute(item.lesson_id)"
					>
						删除分配
					</i-button>
				</div>
			</div>

			<vc-expand :ref="`expand_${index}`" v-model="item.visible">
				<i-table 
					:columns="columns" 
					:data="item.assign.map(it => ({...it, auth_type: item.auth_type, lesson_status: item.lesson_status}))" 
					class="g-m-r-30"
				/>
			</vc-expand>
		</div>
	</div>
</template>

<script>
import { Button, Table, Select, Option } from "iview";
import { Expand } from "wya-vc";
import { Confirm } from "@components/_common/confirm/confirm";
import Loading from '@components/_common/loading/loading';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { setTimeout } from 'timers';
import { ChooseProcessDocker } from "./popup/process-docker";
import { ChooseOtherRole } from './popup/other-role';
import { DistributeNestEdit } from './popup/nest-edit';

export default {
	name: 'oa-service-distribute',
	components: {
		"i-button": Button,
		'i-table': Table,
		'i-select': Select,
		'i-option': Option,
		"vc-expand": Expand,
		'oa-loading': Loading
	},
	props: {
		type: [String, Number],
		productName: String,
		lessonType: [String, Number],
		projectId: [String, Number]
	},
	data() {
		return {
			loading: false,
			product_name: '',
			staffName: '',
			authType: '',
			list: [],
			productList: [],
			roleMap: { 1: '流程对接人', 2: '协助流程对接人', 3: '主持人', 4: '讲师', 5: '唱单', 6: '音控' },
			columns: [
				{
					title: '角色',
					key: 'role_name',
					minWidth: 120
				},
				{
					title: '负责人',
					key: 'staff_name',
					minWidth: 100,
					render: (h, { row }) => {
						return (
							<div>
								{
									row.staff_name ? <AutoTooltip 
										content={row.staff_name}
										theme="dark"
										placement="bottom"
										labelClass="g-c-black3"
									/> : '--'
								}
							</div>
						);
					}
				},
				{
					title: '分配人',
					key: 'assign_staff_name',
					minWidth: 100,
					render: (h, { row }) => {
						return (
							<div>
								{
									row.assign_staff_name ? <AutoTooltip 
										content={row.assign_staff_name}
										theme="dark"
										placement="bottom"
										labelClass="g-c-black3"
									/> : '--'
								}
							</div>
						);
					}
				},
				{
					title: '分配时间',
					key: 'update_time',
					minWidth: 160
				},
				{
					title: '操作',
					key: 'opt',
					width: 120,
					render: (h, { row }) => {
						return this.handleAuth(row);
					}
				}
			]
		};
	},
	mounted() {
		this.loadData();
		this.$vc.on('COLLAGE_RELOAD_SERVICE_DISTRIBUTE', () => {
			this.loadData();
		});
	},
	beforeDestroy() {
		this.$vc.off('COLLAGE_RELOAD_SERVICE_DISTRIBUTE');
	},
	methods: {
		loadData() {
			this.loading = true;
			this.list = [];
			this.product_name = '';
			this.staffName = '';
			this.authType = '';
			this.$request({
				url: '_COLLAGE_BUSINESS_ASSIGN_INFO_GET',
				type: 'GET',
				loading: false,
				param: {
					project_id: this.projectId
				},
				autoTip: false
			}).then(res => {
				this.product_name = res.data.product_name;
				this.staffName = res.data.staff_name;
				this.authType = res.data.auth_type;
				this.$emit('loadBtn', { authType: res.data.auth_type });
				if (res.data.lesson.length) {
					this.list = res.data.lesson.map(it => ({ ...it, visible: true, edit_project: false }));
				}
			}).catch(error => {
				this.$Message.error(error.msg); 
			}).finally(() => {
				this.loading = false;
			});
		},
		loadProjectData() {
			this.productList = [];
			this.$request({
				url: '_COLLAGE_BUSINESS_PRODUCT_GET',
				type: 'GET',
				loading: false,
				param: {
					type: this.lessonType
				},
				autoTip: false
			}).then(res => {
				if (res.data.length) {
					this.productList = res.data;
				}
			}).catch(error => {
				this.$Message.error(error.msg); 
			});
		},
		handleEditNest(item) {
			DistributeNestEdit.popup({
				title: '更改套系',
				isEdit: true,
				lessonId: item.lesson_id,
				lectureSetId: item.lecture_set_id
			}).then(res => {
				this.loadData();
				this.$vc.emit('COLLAGE_RELOAD_SERVICE_RECORD');
				this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleEditProject(item) {
			this.curProductId = item.product_id;
			const index = this.list.findIndex(it => it.lesson_id === item.lesson_id);
			this.list[index].edit_project = !this.list[index].edit_project;
			if (this.list[index].edit_project) {
				this.loadProjectData();
			}
		},
		handleDistribute(row, type) {
			if (type === '选择' || type === '更改') {
				ChooseProcessDocker.popup({
					title: type + this.roleMap[row.role_type],
					projectId: this.projectId,
					roleType: row.role_type,
					productName: this.productName
				}).then(({ staff_id }) => {
					this.$request({
						url: '_COLLAGE_BUSINESS_ASSIGN_MAIN_STAFF_POST',
						type: 'POST',
						loading: false,
						param: {
							project_id: this.projectId,
							staff_id
						},
						autoTip: true
					}).then(res => {
						this.loadData();
						this.$vc.emit('COLLAGE_RELOAD_SERVICE_RECORD');
						this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
					}).catch(error => {});
				}).catch(error => {
					error && console.error(error);
				});
			} else {
				switch (row.role_type) {
					case 1:
					case 2:
					case 5:
					case 6:
						ChooseProcessDocker.popup({
							title: type + this.roleMap[row.role_type],
							assignId: row.assign_id,
							projectId: this.projectId,
							roleType: row.role_type,
							productName: this.productName
						}).then(({ staff_id }) => {
							this.$request({
								url: '_COLLAGE_BUSINESS_LESSON_ASSIGN_POST',
								type: 'POST',
								loading: false,
								param: {
									project_id: this.projectId,
									staff_id: staff_id ? [staff_id] : [],
									role_type: row.role_type,
									assign_id: row.assign_id,
									lesson_id: row.lesson_id
								},
								autoTip: true
							}).then(res => {
								this.loadData();
								this.$vc.emit('COLLAGE_RELOAD_SERVICE_RECORD');
								this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
							}).catch(error => {});
						}).catch(error => {
							error && console.error(error);
						});
						break;
					case 3:
					case 4:
						ChooseOtherRole.popup({
							title: type + this.roleMap[row.role_type],
							assignId: row.assign_id,
							roleType: row.role_type,
							projectId: this.projectId,
							productName: this.productName
						}).then(({ staff_id }) => {
							this.$request({
								url: '_COLLAGE_BUSINESS_LESSON_ASSIGN_POST',
								type: 'POST',
								loading: false,
								param: {
									project_id: this.projectId,
									staff_id,
									role_type: row.role_type,
									assign_id: row.assign_id,
									lesson_id: row.lesson_id
								},
								autoTip: true
							}).then(res => {
								this.loadData();
								this.$vc.emit('COLLAGE_RELOAD_SERVICE_RECORD');
								this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
							}).catch(error => {});
						}).catch(error => {
							error && console.error(error);
						});
						break;
					default:
						break;
				}
			}
		},
		handleDelDistribute(lesson_id) {
			Confirm.popup({
				title: "删除提示",
				msg: "是否确认删除该套系分配信息及所有填写的服务信息？",
				showIcon: true
			}).then(() => {
				this.$request({
					url: '_COLLAGE_BUSINESS_DEL_LESSON_POST',
					type: 'POST',
					loading: false,
					param: {
						project_id: this.projectId,
						lesson_id
					},
					autoTip: true
				}).then(res => {
					this.loadData();
					this.$vc.emit('COLLAGE_RELOAD_SERVICE_RECORD');
					this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
				}).catch(error => {});
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleProjectSave(item) {
			const index = this.list.findIndex(it => it.lesson_id === item.lesson_id);
			if (index === -1) return;

			this.$request({
				url: '_COLLAGE_BUSINESS_LESSON_EDIT_PRODUCT_POST',
				type: 'POST',
				loading: false,
				param: {
					project_id: this.projectId,
					product_id: this.list[index].product_id,
					lesson_id: item.lesson_id,
					product_name: this.list[index].product_name
				},
				autoTip: true
			}).then(res => {
				this.list[index].edit_project = false;
				this.loadData();
				this.$vc.emit('COLLAGE_RELOAD_SERVICE_RECORD');
				this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
			}).catch(error => {});
		},
		handleProductChange({ label, value }, item) {
			const index = this.list.findIndex(it => it.lesson_id === item.lesson_id);
			this.list[index].product_name = label;
			this.list[index].product_id = value;
		},
		handleToggle(value) {
			this.$refs[value][0].toggle();
		},
		handleAuth(row) {
			if (row.staff_name) {
				if (this.$auth[1302]) {
					if (row.auth_type === 3) {
						return <span class="g-c-black7">修改</span>;
					} else if (row.role_type === 1 || row.lesson_status) {
						return <span class="g-c-black7">修改</span>;
					} else {
						return <span class="g-operation" onClick={() => { this.handleDistribute(row, '修改'); }}>修改</span>;
					}
				} else {
					return <span class="g-c-black7">修改</span>;
				}
			} else if (this.$auth[1303]) {
				if (row.auth_type === 3) {
					return <span class="g-c-black7">分配</span>;
				} else if (row.lesson_status || row.role_type === 1) {
					return <span class="g-c-black7">分配</span>;
				} else {
					return <span class="g-operation" onClick={() => { this.handleDistribute(row, '分配'); }}>分配</span>;
				}
			} else {
				return <span class="g-c-black7">分配</span>;
			}
		}
	}
};
</script>

<style lang="scss">
.v-service-distribute {
	._title-bar {
		display: inline-block;
		width: 2px;
		height: 16px;
		position: relative;
		top: 3px;
		background-color: #e84854;
	}
	._btn {
		height: 32px;
		line-height: 32px;
		color: #E84C57;
		border: 1px solid #E84C57;
	}
}
</style>