<template>
	<div class="v-hr-academy-train-detail-group-random g-m-l-20">
		<div class="_title">
			<vc-debounce-click
				class="g-red-btn-line g-m-r-5"
				@click="handleReset">
				重新分组
			</vc-debounce-click>
			<span>随机分组：<span style="color: #E74854">{{ data.length }}</span>组</span>
			<span class="g-m-l-20">总人数: <span style="color: #E74854">{{ total }}</span>人</span>
			<div class="g-fr">
				<vc-debounce-click
					class="g-red-btn-line g-m-r-5"
					@click="loadData">
					换一换
				</vc-debounce-click>
				<vc-debounce-click
					class="g-red-btn-line g-m-r-20"
					@click="handleAdd">
					就是它了
				</vc-debounce-click>
			</div>
		</div>
		<div class="_content g-flex g-m-t-20">
			<div v-for="(item, index) in data" :key="index" class="__item">
				<div class="__class-name g-m-20">
					<!-- <i-tooltip 
						v-if="!item.show"
						placement="right"
					> -->
					<span v-show="!item.show" class="g-pointer" @click="handleEdit(item)">{{ item.group_name }}</span>
					<!-- <div slot="content">
							<span 
								class="g-pointer" 
								@click="handleEdit(item)"
							>
								点击修改
							</span>
						</div> -->
					<!-- </i-tooltip> -->
					<i-input
						v-if="item.show" 
						ref="input"
						v-model="item.group_name" 
						:maxlength="10"
						style="width: 100px;"
						@on-blur="handleSaveGroup(item, index)"
					/>(
					<span style="color: #E74854">
						{{ item.staff_list.length }}
					</span>
					人)
					<i 
						class="iconfont icon-bianji g-fr g-pointer" 
						@click="handleEditMember(item)"
					/>
				</div>
				<i-tooltip  
					v-if="item.staff_list.filter(res => res.is_leader == '1').length" 
					class="__charge-wrapper g-m-l-20"
					placement="right"
				>
					组长：
					<div class="__charge">
						<span v-if="item.staff_list.filter(res => res.is_leader == '1')[0].staff_name.length < 5">
							{{ item.staff_list.filter(res => res.is_leader == '1')[0].staff_name }}
						</span>
						<span v-else>
							{{ item.staff_list.filter(res => res.is_leader == '1')[0].staff_name.slice(0, 3) + '...' }}
						</span>
					</div>
					<div slot="content">
						<span 
							class="g-pointer" 
							@click="handleCancelCharge(item)"
						>
							取消组长
						</span>
					</div>
				</i-tooltip >
				<div class="__member-wrapper">
					<i-tooltip 
						v-for="(e, index1) in item.staff_list.filter(res => res.is_leader == '0')" 
						:key="index1"
						class="__member"
						placement="right"
					>
						<span v-if="e.staff_name.length < 5">{{ e.staff_name }}</span>
						<span v-else>{{ e.staff_name.slice(0, 3) + '...' }}</span>
						<div slot="content">
							<span 
								class="g-pointer" 
								@click="handleSetCharge(item, e)"
							>
								设置组长
							</span>
						</div>
					</i-tooltip>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Input, Button, Tooltip } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { MemberModal } from './popup/member-modal.vue';

export default {
	name: 'oa-tpl',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-tooltip': Tooltip
	},
	data() {
		return {
			data: [],
			total: 0
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			let obj = !this.$route.query.course_ids ? {
				group_num: +this.$route.query.group_num,
				project_id: this.$route.query.project_id,
				source: this.$route.query.source
			} : {
				group_num: +this.$route.query.group_num,
				course_ids: [this.$route.query.course_ids],
				source: this.$route.query.source
			};
			this.$request({
				url: API_ROOT['_HR_TRAIN_RANDOM_GOURP_GET'], // eslint-disable-line
				type: "GET",
				param: obj
			}).then((res) => {
				this.data = [];
				this.total = 0;
				res.data.forEach(v => {
					v.show = false;
					v.staff_list.forEach(e => {
						this.$set(e, 'is_leader', '0');
					});
					this.total += v.staff_list.length;
				});
				this.data = res.data;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		// 重新分配
		handleReset() {
			this.$router.push(`/hr/academy/train/detail/group/0/group?project_id=${this.$route.query.project_id}`);
		},
		// 保存组名 
		handleSaveGroup(item, index) {
			const valid = this.data.some((v, i) => v.group_name === item.group_name && index !== i);
			if (valid) {
				this.$refs.input[0].focus();
				this.$Message.error('组名不能重复奥');
				return;
			}
			this.data.forEach(res => {
				res.show = false;
			});
		},
		// 设置组名 
		handleEdit(item) {
			this.data.forEach(res => {
				if (res.group_name == item.group_name) {
					res.show = true;
				}
			});
			this.$nextTick(() => {
				this.$refs.input[0].focus();
			});
		},
		// 取消组长
		handleCancelCharge(item) {
			this.data.forEach(res => {
				if (item.group_name == res.group_name) {
					res.staff_list.forEach(e => {
						e.is_leader = '0';
					});
				}
			});
		},
		// 设置组长
		handleSetCharge(item, e) {
			this.data.forEach(res => {
				if (res.group_name == item.group_name) {
					res.staff_list.forEach(v => {
						v.is_leader = '0';
					});
					res.staff_list.forEach(v => {
						if (v.mobile == e.mobile) {
							v.is_leader = '1';
						}
					});
				}
				return;
			});
		},
		// 编辑组员
		handleEditMember(item) {
			this.data.map(v => {
				v.staff_list.map(e => {
					e.group_name = v.group_name;
					return;
				});
				return;
			});
			// 所有展示的组员
			const result = this.data.reduce((init, cur) => {
				return init.concat([...cur.staff_list.filter(v => v.is_leader == '0')]);
			}, []);

			MemberModal.popup({ 
				datas: result 
			}).then(res => {
				// 找出选中数据中原组不是本组的数据
				let tempA = res.filter(v => {
					return v.group_name !== item.group_name;
				});
				// 删除其他组内的选中数据
				this.data.forEach(v => {
					tempA.forEach((e, index) => {
						v.staff_list.forEach((k, index1) => {
							if (k.mobile == e.mobile) {
								v.staff_list.splice(index1, 1);
							}
						});
					});
				});
				// 在本组中添加选中数据
				this.data.forEach(v => {
					if (v.group_name == item.group_name) {
						tempA.forEach(e => {
							v.staff_list.push(e);
						});
					}
				});
			});

		},
		handleAdd() {
			this.$Message.success('保存成功');
		}	
	},
};
</script>

<style lang="scss" scoped>
.v-hr-academy-train-detail-group-random {
	._content {
		flex-wrap: wrap;
		.__item {
			width: 316px;
			height: 220px;
			// border: 1px solid #7B7B7B;
			box-shadow: 0px 1px 7px 0px rgba(123,123,123,0.3);
			border-radius: 4px;
			overflow-y: hidden;
			margin-right: 35px;
			margin-bottom: 30px;
			.__class-name {
				width: 275px;
				text-align: center;
				color: #4B4F57;
			}
			.__charge-wrapper {
				.__charge {
					display: inline-block;
					width: 73px;
					height: 26px;
					line-height: 26px;
					text-align: center;
					background:#ED8F4A;
					color: #fff;
					border-radius: 2px;
				}
			}
			.__member-wrapper {
				margin: 20px 10px 10px 10px;
				.__member {
					display: inline-block;
					margin: 0 10px 15px 10px;
					width: 73px;
					height: 26px;
					line-height: 26px;
					text-align: center;
					background:#F6F6F6;
					border-radius: 2px;
				}
			}
		}
		.__item:hover{
			overflow-y: auto;
		}
		.__item::-webkit-scrollbar {/*滚动条整体样式*/
			width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
			height: 1px;
		}
		.__item::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
			border-radius: 10px;
			-webkit-box-shadow:  0 0 5px #f1f1f1;
			background: #c1c1c1;
		}
		.__item::-webkit-scrollbar-track {/*滚动条里面轨道*/
			-webkit-box-shadow:  0 0 5px #c1c1c1;
			border-radius: 10px;
			background: #f6f6f6;
		}
	}
}
</style>
