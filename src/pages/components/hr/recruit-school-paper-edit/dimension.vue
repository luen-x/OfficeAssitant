<template>
	<div class="v-hr-recruit-paper-dimension">
		<i-form 
			ref="formData" 
			:model="formData" 
			:rules="rules" 
			:label-width="115"
			@submit.native.prevent
		>
			<div 
				v-for="(item, index) in formData.dimensions" 
				:key="item.uid"
				class="g-flex g-ai-c g-jc-sb g-pd-t-20 g-m-b-20"
				style="background-color: #fafafa;"
			>
				<span class="g-m-l-30 g-inline-block g-c-black2 _sort">{{ index + 1 }}</span>
				<i-form-item 
					:prop="'dimensions.' + index + '.dimension_name'" 
					:rules="rules.dimension_name" 
					label="测试维度"
					style="width: 100%;"
				>
					<div>
						<i-input
							v-model="item.dimension_name" 
							:maxlength="10"
							clearable
							placeholder="请输入测试维度" 
							style="width:300px;"
						/>
						<span class="g-m-l-30">
							<span class="g-m-l-30">维度总分</span>
							<span class="g-m-l-10">{{ item.total_score }}分</span>
						</span>
					</div>
				</i-form-item>
				<div class="_btn-icon g-flex g-ai-c g-jc-fe g-m-r-20">
					<i 
						v-if="formData.dimensions.length !== 1"
						class="icon iconfont icon-remove-circle g-c-red-mid g-pointer"
						@click="handleDel(item, index)"
					/>
					<i 
						v-if="index === formData.dimensions.length - 1"
						class="icon iconfont icon-add1 g-c-blue-mid g-pointer g-m-l-5" 
						@click="handleAdd"
					/>
				</div>
			</div>
		</i-form>
		<div class="_submit">
			<i-button 
				type="primary" 
				@click="handleSave"
			>
				保存
			</i-button>
		</div>
	</div>
</template>
<script>
import { Form, FormItem, Input, Button } from 'iview';
import { uid } from '@utils/utils';

export default {
	name: 'oa-recruit-paper-dimension',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-button': Button,
	},
	props: {
		paperTheme: String,
		dimensions: {
			type: Array,
			default: () => ([])
		}
	},
	data() {
		const defaultDimension = { dimension_name: '', total_score: 0 };
		return {
			defaultDimension,
			formData: {// 表单
				paper_theme: this.paperTheme,
				dimensions: this.dimensions.length ? this.dimensions.map(it => ({
					uid: uid(),
					dimension_id: it.dimension_id,
					dimension_name: it.dimension_name,
					total_score: it.total_score
				})) : [this.getNewDimension()]
			},
			rules: {// 表单验证
				dimension_name: [
					{ required: true, message: '请输入测试维度', trigger: "blur" }
				]
			}
		};
	},
	watch: {
		dimensions(val) {
			this.formData.dimensions = val.length ? val.map(it => ({
				uid: uid(),
				dimension_id: it.dimension_id,
				dimension_name: it.dimension_name,
				total_score: it.total_score
			})) : [this.getNewDimension()];
		},
		paperTheme(val) {
			this.formData.paper_theme = val;
		}
	},
	methods: {
		handleAdd() {
			const dimension = this.getNewDimension();
			this.formData.dimensions.push({ ...dimension });
		},
		handleDel(item, index) {
			if (item.dimension_id) {
				this.$request({
					url: '_HR_RECRUIT_SCHOOL_DIMENSION_DEL_POST',
					type: 'POST',
					loading: false,
					param: {
						dimension_id: item.dimension_id
					},
					autoTip: true
				}).then(res => {
					this.$emit('reload', true);
				}).catch(error => {});
			} else {
				this.formData.dimensions.splice(index, 1);
			}
		},
		handleSave() {
			return this.$refs.formData.validate().then(valid => {
				if (valid) {
					const { query = {} } = this.$route;
					let param = {
						...(query.paper_id ? { paper_id: query.paper_id } : null),
						paper_theme: this.formData.paper_theme,
						dimensions: this.formData.dimensions.map(it => ({ 
							...(it.dimension_id ? { dimension_id: it.dimension_id } : null),
							dimension_name: it.dimension_name 
						}))
					};
					return this.$request({
						url: '_HR_RECRUIT_SCHOOL_DIMENSION_ADD_POST',
						type: "POST",
						loading: false,
						param,
						autoTip: true
					}).then(res => {
						this.$router.replace({
							name: 'hr-recruit-school-paper-edit',
							query: {
								action: "update",
								paper_id: res.data.paper_id
							}
						});
						this.$emit('reload', true);
						return true;
					}).catch(error => { return false; });
				} else {
					return false;
				}
			});
		},
		getNewDimension() {
			return { uid: uid(), dimension_name: '', total_score: 0 };
		}
	}
};

export const RecruitPaperDimension = module.exports.default;
</script>
<style lang="scss">
.v-hr-recruit-paper-dimension {
	margin-bottom: 80px;
	._sort {
		width: 15px;
		height: 15px;
		border: 1px solid #333;
		border-radius: 50%;
		margin-bottom: 24px;
		line-height: 12px;
		text-align: center;
	}
	._btn-icon {
		position: relative;
		top: -10px;
	}
	._submit {
		position: fixed;
		width: calc(100% - 160px);
		height: 60px;
		line-height: 60px;
		text-align: center;
		bottom: 0;
		right: 0;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		background: #fff;
	}
	.ivu-form-inline .ivu-form-item {
		margin-right: 0;
	}
}
</style>
