<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		class="v-hr-side-detail v-hr-academy-course-store-choose-staff "
		@on-close="handleCancel"
	>
		<div class="g-pd-tb-10 g-pd-l-20 g-fs-14 g-bold g-c-black1" style="font-weight:400">选择人员</div>
		<div class="g-flex" style="height:100%;flex:1">
			<div class="_left-container" style="overflow:auto">
				<div class="_top-bar">
					从组织架构中选择
				</div>
				<div style="padding:10px 0 0 18px">组织架构</div>
				<div class="g-pd-l-10">
					<i-tree 
						v-if="localDepartAll.length" 
						:data="localDepartAll" 
						multiple 
						show-checkbox 
						check-directly 
						@on-check-change="handleDepartChange"/>
				</div>
			</div>
			<div style="display: flex;flex-direction: column;">
				<div class="_right-container" style="width:590px;flex: 1;overflow: auto;display: flex;flex-direction: column;">
					<div class="g-pd-l-20 g-pd-t-10">

						<i-select 
							v-model="query.position" 
							placeholder="按职位选择" 
							style="width:220px"
							class="g-m-r-5"
							clearable
							@on-change="handleSearch"
						>
							<i-option 
								v-for="(item,index) in localDepartPosition" 
								:key="index" 
								:value="item.value"
							>
								{{ item.label }}
							</i-option>
							
						</i-select>
						<!-- <i-cascader
							v-model="query.position "
							:data="localDepartPosition ||[]"
							clearable
							placeholder="请选择职位"
							style="width: 220px"
							class="g-m-r-5"
							@on-change="handleSearch"
						/> -->
						<i-input 
							v-model="query.search" 
							placeholder="请输入员工姓名" 
							class="g-m-r-5" 
							style="width:220px" 
							@on-change="handleSearch"/>
						<i-button type="primary" @click="handleSearch">搜索</i-button>
					</div>
					<div class="g-pd-20 g-pd-t-20">
						<i-checkbox v-model="checkAll" @on-change="handleCheckAll">全选以下所有成员</i-checkbox>
					</div>
					<div style="overflow: auto;flex: 1" >
						<div v-for="(zone,index) in zones" :key="index">
							<div style="padding:10px 20px 10px 30px;background:rgba(245,245,246,1);border-bottom: 1px solid lightgrey;">
								<span>{{ zone.zoneName }}</span>
								<i-checkbox v-model="zone.checkAll" class="g-fr" @on-change="handleZoneCheckAll($event,zone)">全选</i-checkbox>
							</div>
							<div class="g-pd-l-20 g-pd-b-20" style="padding-right:-40px;overflow-y: auto;">
								<i-checkbox 
									v-for="(staff) in zone.staffs"
									:key="staff.id"
									v-model="staff.checked"
									style="width:100px;margin-top:20px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
									@on-change="handleCheckStaff($event,staff)"
								>
									<span class="g-m-l-5">{{ staff.name }}</span>
								</i-checkbox>
							</div>
						</div>
					</div>
					
				</div> 
				<div class="_right-container g-m-t-20" style="width: 590px;" >
					<div class="g-c-red-mid" style="padding:10px 20px 10px 30px;background:rgba(245,245,246,1)">
						已选择 {{ selectedMembers.length }}
					</div>
					<div style="padding:0px 20px 10px 20px;height: 148px;overflow-y: auto;">
						<span v-for="member in selectedMembers" :key="member.id" class="_tag" >
							{{ member.name }}
							<i class="icon iconfont icon-close g-fr g-fs-14 g-pointer g-m-l-20" @click="handleRemoveMember(member)"/>
						</span>
					</div>
				</div>

			</div>
			
			<div class="_footer">
				<i-button type="primary" @click="handleSave">确定</i-button>
				<i-button @click="handleReset">重置</i-button>
			</div>
		</div>
		<div style="height:70px;width:1px"/>

	
	</i-drawer>
</template>
<script >
import { CreatePortal } from 'wya-vc';
import { debounce, cloneDeep } from 'lodash';
import { Button, Select, Option, Input, Checkbox, CheckboxGroup, Tree, Drawer, Cascader } from 'iview';
import { services } from '@stores/services/hr';
import '../../hr-side';

export default {
	name: "oa-hr-academy-choose-staff",
	components: {
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-input': Input,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
		'i-drawer': Drawer,
		'i-tree': Tree,
		'i-cascader': Cascader

	},
	mixins: [services.departAllTree(), services.departPosition(), services.topDepartId()],
	props: {
		members: Array
	},
	data() {
		return {
			visible: false,
			query: {
				position: '',
				search: ''
			},
			checkAll: false,
			localDepartAll: [],
			localDepartPosition: [],
			zones: [
				// { 
				// 	zoneName: '杭一战区',
				// checkAll:false,
				// 	staffs: [
				// 		{ id: '1', name: 'aaa', checked: false },
				// 		{ id: '2', name: 'baa', checked: false }, 
				// 		{ id: '3', name: '罗大罗大', checked: false }, 
				// 		{ id: '4', name: '罗大罗大', checked: false }, 
				// 		{ id: '5', name: '罗大罗大', checked: false }, 
				// 		{ id: '6', name: '罗大罗大', checked: false }, 
				// 		{ id: '7', name: '罗大罗大', checked: false }, 
				// 		{ id: '8', name: '罗大罗大', checked: false }, 
				// 		{ id: '9', name: '罗大罗大', checked: false }, 
				// 		{ id: '10', name: '罗大罗大', checked: false }, 
				// 		{ id: '31', name: '罗大罗大', checked: false }, 
				// 		{ id: '32', name: '罗大罗大', checked: false }, 
				// 		{ id: '33', name: '罗大罗大', checked: false }, 
				// 		{ id: '34', name: '罗大罗大', checked: false }, 
				// 		{ id: '35', name: '罗大罗大', checked: false }, 
				// 		{ id: '36', name: '罗大罗大', checked: false }, 
				// 		{ id: '37', name: '罗大罗大', checked: false }
				
				// 	]
				// 	 },
				// { 
				// 	zoneName: '杭二战区',
				// 	staffs: [
				// 		{ id: '41', name: 'aaa', checked: false }, 
				// 		{ id: '52', name: 'baa', checked: false }, 
				// 		{ id: '63', name: '罗大罗大', checked: false }
				// 	] 
				// }
			],
			saleDepartId: '',
			positions: [{ label: 'aaa', value: 1 }],
			selectedMembers: this.members.map(mem => ({ id: mem.staff_id, name: mem.staff_name, checked: true, depart_id: mem.depart_id })),
			departStaff: [], // 搜索获得的数据 // 战区数组
			selectedDeparts: [], // 勾选的部门
			filteredStaff: [],
			originMembers: this.members.map(mem => ({ id: mem.staff_id, name: mem.staff_name, checked: true, depart_id: mem.depart_id })),
		};
	},
	computed: {
		

	},
	created() {
		
	},
	async mounted() {
		this.visible = true;
		await this.handleFirstDepart();
		await this.handleSearch();
		await this.loadDepartAllTreePromise;
		await this.loadTopDepartIdPromise;
		 const localDepartAll = cloneDeep([{ ...this.departAllTree.find(item => item.value == this.topDepartId.sale), expand: true }]);
		localDepartAll[0].children.forEach(chi => chi.children = []); // 只要战区
		if (this.selectedMembers.length) {
			const expandDepartIds = [];
			this.selectedMembers.forEach(item => {
			 if (!expandDepartIds.includes(item.depart_id)) {
				 expandDepartIds.push(item.depart_id);
			 }
			});
			const secondDepartIds = [];
			expandDepartIds.forEach(id => {
				const node = this.findNode(id, this.departAllTree);
				if (node) {
					node.checked = true;
					let parent = this.findParentNode(id, this.departAllTree);
					// parent = this.findParentNode(parent.value, this.departAllTree);
					parent = this.findNode(parent.value, localDepartAll);
					if (parent.children.length > 0) {
						parent = this.findNode(id, localDepartAll);
					}
					parent.expand = true;
					parent.disabled = false;
					parent.checked = true;
					secondDepartIds.push(parent.value);
					
				} else {
					console.error('error depart id ' + id);
				}
			});
			this.localDepartAll = localDepartAll;
			this.handleDepartChange(secondDepartIds.map((i) => ({ value: i })));
			// this.zones = this.filterStaff(this.departStaff);
		} else {
			this.localDepartAll = localDepartAll;
		}
		await this.loadDepartPositionPromise;
		this.localDepartPosition = this.departPosition.find(dep => dep.value == this.topDepartId.sale).children;
		

	},
	methods: {
		handleOk(res) {
			this.visible = false;
			this.$emit("sure", res);
		},
		handleCancel() {
			this.visible = false;
			this.$emit("close");
		},
		formatDepart(arr) {
			const depart = arr.map(it => {
				const result = { value: it.depart_id, title: it.depart_name, checked: false };
				if (it.children && it.children.length > 0) {
					result.children = this.formatDepart(it.children);
				}
				return result;
			});
			return depart;

		},
		filterStaff(departStaff) { // 战区数组
			  const result = departStaff
			  .filter(dep => this.selectedDeparts.find(sel => sel.value == dep.depart_id))
			  .map(dep => { // 每个战区
					let staffs = dep.depart_staff.map(staff => ({
						id: staff.staff_id,
						name: staff.staff_name,
						checked: !!this.selectedMembers.find(it => it.id == staff.staff_id),
						depart_id: staff.depart_id
					}));
					// dep.children.forEach(it => { // 每个部门
					// 	if (this.selectedDeparts.find(sel => {
					// 		return sel.value == it.depart_id;
					// 	})
					// 	) {
					// 		staffs = [...staffs, ...it.depart_staff];
					// 	}
					// });
					// staffs = staffs.map(staff => ({
					// 	id: staff.staff_id,
					// 	name: staff.staff_name,
					// 	checked: !!this.selectedMembers.find(it => it.id == staff.staff_id),
					// 	depart_id: staff.depart_id
					// }));
					const checkAll = !staffs.find(i => !i.checked);
					return {
						zoneName: dep.depart_name,
						checkAll,
						staffs,

					};
				}).filter(i => i.staffs.length > 0);
			this.checkAll = !(result.length == 0 || result.find(i => !i.checkAll));
			return result;
		},

		
		handleDepartChange(arr) {
			this.selectedDeparts = arr;
			this.zones = this.filterStaff(this.departStaff);


		},
		handleCheckAll(val) {
			this.zones.forEach(zone => {
				if (zone.checkAll !== val) {
					this.handleZoneCheckAll(val, zone);
				}
			});
			// this.$forceUpdate();
		},
		handleZoneCheckAll(val, zone) {
			if (!zone) return;
			zone.checkAll = val;
			if (!this.zones.find(z => !z.checkAll)) {
				this.checkAll = true;
			} else {
				this.checkAll = false;
			}
			zone.staffs.forEach(staff => {
				if (staff.checked !== val) {
					this.handleCheckStaff(val, staff);		  
				}		
			});
		},
		async handleSearch() {
			const { data } = await this.$request({
				url: "_HR_HUMAN_DEPART_DEPART_STAFF",
				type: "GET",
				param: {
					position_id: this.query.position,
					search: this.query.search
				},
				loading: false,
			});
			this.departStaff = data[0].children.filter(v => v.depart_id == this.saleDepartId)[0].children; // 战区数组
			this.zones = this.filterStaff(this.departStaff);
		},
		async handleFirstDepart() {
			const { data } = await this.$request({
				url: "_HR_HUMAN_FIRST_DEPART_ID_GET",
				type: "GET",
				loading: false,
			});
			this.saleDepartId = data.sale;
			
		},
		
		handleCheckStaff(val, staff) {
			staff.checked = val;
			const curZone = this.zones.find(zone => {
				return zone.staffs.find(item => {
					return item.id === staff.id;
				});
			});
			if (this.zones.find(zone => {
				return zone.staffs.find(item => {
					return item.checked === false;
				});
			})) {
				this.checkAll = false;
			}
			if (!curZone.staffs.find(item => !item.checked)) {
				this.handleZoneCheckAll(true, curZone);
			} else {
				curZone.checkAll = false;
			}

			if (val) {
				const index = this.selectedMembers.findIndex(mem => mem.id === staff.id);
				index == -1 && this.selectedMembers.push(staff);
			} else {
				const index = this.selectedMembers.findIndex(mem => mem.id === staff.id);
				index > -1 && this.selectedMembers.splice(index, 1);
			}
		},
		handleRemoveMember(staff) {
			staff.checked = false;
			const index = this.selectedMembers.findIndex(mem => mem.id === staff.id);
			index > -1 && this.selectedMembers.splice(index, 1);
			this.zones = this.filterStaff(this.departStaff);
			this.checkAll = false;
		},
		handleSave() {
			this.handleOk(this.selectedMembers.map(mem => ({ staff_id: mem.id, staff_name: mem.name, depart_id: mem.depart_id })));
		},
		handleReset() {
			// this.selectedMembers = JSON.parse(JSON.stringify(this.originMembers));
			this.selectedMembers = [];
			this.zones = this.filterStaff(this.departStaff); 
		},
		async updateTree() {
			await this.loadDepartAllTreePromise;
			this.departAllTree;
		},
		findNode(id, arr) {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].value == id) {
					return arr[i];
				} else if (arr[i].children && arr[i].children.length > 0) {
					const exist = this.findNode(id, arr[i].children);
					if (exist) return exist;
				}
			}
		},
		findParentNode(id, arr, parent) {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].value == id) {
					return parent;
				} else if (arr[i].children && arr[i].children.length > 0) {
					const exist = this.findParentNode(id, arr[i].children, arr[i]);
					if (exist) return exist;
				}
			}
		},
	}
};

export const ChooseStaff = CreatePortal({
	alive: true
}, module.exports.default);
</script>
<style lang="scss">
.v-hr-academy-course-store-choose-staff{
	.ivu-drawer-body{
		display: flex;
		flex-direction: column;

	}
	// .ivu-tree-title-selected{
	// 	background-color: white;
	// 	&:hover{
	// 		background-color: #eaf4fe;
	// 	}
	// }
	._left-container{
		width:280px;
		height:100%;
		border-radius:4px;
		border: 1px solid lightgray;
		.ivu-checkbox-wrapper {
			display: none;
		}
		.ivu-checkbox-wrapper-checked + .ivu-tree-title{
			background-color: rgb(232, 76, 87);
			color: white;
			&:hover {
				background-color:rgb(232, 76, 87)
			}
		}
		.ivu-tree-title {
			&:hover {
				background-color:rgba(232, 76, 87,0.1)
			}
		}
	}
	._right-container{
		border-radius:4px;
		margin-left: 10px;
		border: 1px solid lightgray
	}
	._top-bar{
		height:32px;
		background:rgba(245,245,246,1);
		border-radius:4px;
		padding-top: 7px;
		padding-left: 18px;
	}
	._tag{
		display: inline-block;
		margin:10px 10px 0 0;
		height:24px;
		padding: 2px 5px 4px 5px;
		background:rgba(245,245,245,1);
		border:1px solid rgba(212, 215, 220, 1);
		border-radius:4px;

	}


}
</style>