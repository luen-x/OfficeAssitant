<template>
	<div class="v-hr-tool-offer-canvas">
		<div class="_panel g-flex-ac g-c-black4 vm-hack-editor">
			<div class="_link" @click.prevent="$router.back()">返回</div>
			<i class="iconfont icon-vertical-line g-m-lr-10" />
			<div 
				v-for="(route, index) in routes"
				:key="index"
			>
				<span 
					:class="index === routes.length - 1 ? 'g-c-black2' : route.path && '_link'"
					@click="route.path && $router.push(route.path)"
				>
					{{ route.name }}
				</span>
				<span v-if="index < routes.length - 1" class="_divider">/</span>
			</div>
			<i 
				title="撤销"
				style="margin-left: 100px"
				class="iconfont icon-repeal g-fs-20 g-m-lr-15 g-c-black2 g-pointer" 
				@click="handleRepeal"
			/>
			<i 
				title="还原" 
				class="iconfont icon-recover g-fs-20 g-m-lr-15 g-c-black2 g-pointer" 
				@click="handleRecover"
			/>
			<i
				title="删除" 
				class="iconfont icon-close g-fs-20 g-m-lr-15 g-c-black2 g-pointer"
				@click="handleDel"
			/>
			<div class="_save g-flex-ac">
				<div class="g-red-btn-line g-m-r-20" @click="handlePreview">预览</div>
				<div class="g-red-btn" @click="handleSave">保存模板</div>
			</div>
		</div>
		<div class="g-relative g-m-t-20">
			<div class="_color-picker">
				<i-color-picker 
					:value="color"
					style="width: 270px"
					@on-change="handleChangeColor"
				/>
			</div>
			<vm-school-combo
				v-if="$route.query.type == 2"
				ref="schoolCombo"
				:list="list"
				class="g-flex g-fw-w"
			/>
			<vm-social-combo
				v-if="$route.query.type == 3"
				ref="socialCombo"
				:list="list"
				class="g-flex g-fw-w"
			/>
		</div>
	</div>
</template>

<script>
import { ColorPicker } from 'iview';
import { getParseUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import SocialCombo from './social-combo';
import SchoolCombo from './school-combo';

export default {
	name: 'hr-tool-modules-offer-content',
	components: {
		'vm-school-combo': SchoolCombo,
		'vm-social-combo': SocialCombo,
		'i-color-picker': ColorPicker
	},
	data() {
		let { offer_id } = this.$route.query;

		return {
			list: [],
			routes: [
				{ path: '/hr/tool/modules/offer', name: 'offer模板' },
				{ path: '', name: offer_id ? '编辑模板' : '新增模板' }
			],
			ref: this.$route.query.type == 2 ? 'schoolCombo' : 'socialCombo',
		};
	},
	computed: {
		color: {
			 get() {
				return this.$store.state.hrToolModulesOfferAdd.color;
			},
			set(value) {
				this.$store.commit('HR_TOOL_MODULES_OFFER_ADD_COLOR', { color: value });
			},
		}
	},
	watch: {
		list(newVal) {
		}
	},
	created() {
		this.$route.query.offer_id && this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT['_HR_TOOL_MODULES_OFFER_DETAIL_GET'],
				type: "POST",
				param: {
					offer_id: this.$route.query.offer_id
				}
			}).then(res => {
				this.list = (res.data.content || []).map((item) => {
					return item;
				});
				this.list.length > 0 && this.$store.commit('HR_TOOL_MODULES_OFFER_ADD_COLOR', { color: this.list[0].color || '#333333' });
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleChangeColor(value) {
			this.color = value;
			this.$store.commit('HR_TOOL_MODULES_OFFER_ADD_COLOR', { color: value });
		},
		handleRepeal() {
			this.$refs[this.ref].$refs.combo.undo();
		},
		handleRecover() {
			this.$refs[this.ref].$refs.combo.redo();
		},
		handleDel() {
			this.$refs[this.ref].$refs.combo.delete();
		},
		handlePreview() {
			this.$refs[this.ref].$refs.combo.preview();
		},
		handleSave() {
			this.$refs[this.ref].$refs.combo.save();
		}
	},
};
</script>

<style lang="scss">
.v-hr-tool-offer-canvas {
	padding: 50px 20px 80px 20px;
	._color-picker {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 300px;
		background-color: #fafafa;
		border: 1px solid #ebeef1;
		padding: 15px;
	}
	._panel {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
		height: 44px;
		line-height: 44px;
		background-color: #ffffff;
		padding-left: 40px;
		font-size: 14px;
		box-shadow: 0 5px 12px -3px rgba(221, 222, 225, 0.5);
		user-select: none !important;
		._save {
			position: absolute;
			right: 40px;
			top: 6px
		}
		._link {
			cursor: pointer;
			&:hover {
				color: #e74854;
			}
		}
		._divider {
			margin: 0 6px;
		}
	}
	.vm-combo {
		.vm-tools-operation, .vm-tools-save {
			display: none !important;
		}
		.vm-tools-widget {
			margin-top: 64px;
			width: 300px;
			border: 1px solid #ebeef1;
			background-color: #fafafa;
			.__item {
				width: 90%;
				box-sizing: border-box;
				text-align: left;
				padding: 0 10px
			}
		}
		.__frame {
		}
		.vm-editor {
			width: 400px;
			padding: 20px;
			background-color: #fafafa;
		}
	}
}
.vm-tools-preview {
	.__mask {
		background-color: rgba(0, 0, 0, 0.7) !important;
	}
	.__frame {
		float: left;
		background-color: #ffffff;
		border: none;
		overflow: hidden;
	}
}

</style>
