<template>
	<i-form 
		ref="form" 
		:model="formdata" 
		:rules="ruleValidate" 
		:loading="true"
		:label-width="120"
		class="g-m-t-20 v-system-assess-integration-add"
		position="left"
	>
		<div 
			v-if="!disabled && query.ic_system_id" 
			class="g-pd-l-30 g-pd-b-10"
			style="color: #e84c57; borderBottom: 1px solid #EBEEF1"
		>
			<span>下月生效体系</span>
		</div>
		<i-form-item :label="`${name}体系名称:`" class="g-m-t-20" prop="system_name">
			<i-input 
				v-model="formdata.system_name" 
				:maxlength="10"
				:placeholder="`请输入${name}体系名称`" 
				:disabled="disabled"
				style="width: 220px"
			/>
		</i-form-item>
		<i-form-item :label="`${name}类型:`" prop="types">
			<span 
				v-if="!disabled && (cate === '1' ? $auth[1153] : $auth[1171])"
				class="g-red-btn-line g-m-b-20" 
				@click="() => handleAddType()">新增{{ name }}类型</span>
			<div v-if="formdata.types && formdata.types.length" class="_table">
				<div 
					v-for="(item, index) of formdata.types"
					:key="index"
					class="g-flex _item">
					<div style="flex: 2">{{ item.type_name }}</div>
					<div style="flex: 3">
						{{ name }}上限：{{ item.year_maximum === null ? '不限' : item.year_maximum }}
					</div>
					<div v-if="cate === '2'" style="flex: 3">
						每月上限：{{ item.month_maximum === null ? '不限' : item.month_maximum }}
					</div>
					<div style="flex: 5">{{ item.description }}</div>
					<div v-if="!disabled" style="flex: 2">
						<span 
							v-if="(cate === '1' ? $auth[1154] : $auth[1172])"
							class="g-operation" 
							@click="() => handleAddType(index + 1, item)">修改</span>
						<i-divider type="vertical"/>
						<span 
							v-if="(cate === '1' ? $auth[1155] : $auth[1173])"
							class="g-operation" 
							@click="() => handleDel(index)">删除</span>
					</div>										
				</div>
			</div>
		</i-form-item>
		<i-form-item label="适用范围:" prop="ranges">
			<div class="g-flex" style="paddingTop: 5px">
				<span 
					v-if="!disabled && (cate === '1' ? $auth[1156] : $auth[1174])"
					class="g-red-btn-line g-m-r-20" 
					@click="handleAddRange">新增范围</span>
				<span v-else />
				<div class="g-flex g-fw-w g-ai-c">
					<div 
						v-for="(item, index) of formdata.ranges"
						:key="index"
						class="_range g-flex g-ai-c g-m-r-15">
						<span>职位：{{ item.position_name }}</span>
						<span v-if="item.role_name">
							<span class="g-m-lr-5">|</span>
							<span>角色：{{ item.role_name }}</span>
						</span>
						<i 
							v-if="!disabled && (cate === '1' ? $auth[1158] : $auth[1176])"
							class="icon iconfont icon-close2 g-m-l-10 g-fs-12"
							@click="() => handleRangeDel(index)"
						/>
					</div>
				</div>
			</div>
		</i-form-item>
		<i-form-item label="规则文件">
			<!-- <vc-upload 
				v-model="formdata.rule_doc"
				:max="5"
				:disabled="disabled"
				prefix-cls="_upload"
				style="margin: 0"
				@file-success="handleFileSuccess"
			>
				<div class="g-flex g-ai-c">
					<i class="icon iconfont icon-folder g-fs-14" />
					<span class="g-m-l-5">请添加文件</span>
				</div> -->
			<!-- </vc-upload> -->
			<oa-upload 
				v-if="(cate === '1' ? $auth[1159] : $auth[1177])"
				v-model="formdata.rule_doc"
				:max="5"
				:disabled="disabled"
				style="margin: 0"
			>	
				<div slot="trigger" class="g-flex g-ai-c _upload g-m-b-20">
					<i class="icon iconfont icon-folder g-fs-14" />
					<span class="g-m-l-5">请添加文件</span>
				</div>
			</oa-upload>
		</i-form-item>
		<i-form-item>
			<!-- <span
				v-for="(item, index) of formdata.rule_doc"
				:key="index"
				class="_file"
			>
				{{ item.title }}
				<span class="g-operation g-m-l-5" @click="() => handleDelImg(index)">x</span>
			</span> -->
		</i-form-item>
		<oa-footer
			v-if="!disabled" 
			@ok="handleSave"
			@cancel="handleCancel"
		/>
	</i-form>
</template>

<script>
import { 
	Form, FormItem, Input,
	Select, Option, Divider
} from 'iview';
// utils
import { dataValidity } from '@utils/utils';
import { ImgsPicker, Upload } from 'wya-vc';

import { ConfirmModal } from '@components/hr/_common/popup/confirm';
import OaUpload from '@components/_common/upload/upload';
import Footer from '@components/_common/footer/footer';
import { TypeModal } from './add-popup/type';
import { RangeModal } from './add-popup/range';

export default {
	name: 'oa-content',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-divider': Divider,
		'vc-upload': Upload,
		'oa-footer': Footer,
		'oa-upload': OaUpload
	},
	props: {
		cate: String,
		disabled: Boolean,
		info: {
			type: Object,
			default: () => {
				return {
					types: [],
					ranges: [],
					rule_doc: []
				};
			}
		}
	},
	data() {
		const { query } = this.$route;
		return {
			query,
			index: 1,
			name: this.cate === '1' ? '积分' : '学分',
			formdata: {
				...this.info
			},
			ruleValidate: {
				name: [
					{ required: true, message: '请输入客户公司名称' }
				],
				system_name: [
					{ required: true, message: '请输入体系名称' }
				],
				types: [
					{ required: true, type: 'array', message: '请添加类型' }
				],
				ranges: [
					{ required: true, type: 'array', message: '请添加范围' }
				],
			}
		};
	},
	watch: {
		info(val) {
			this.formdata = val;
		}
	},
	methods: {
		handleDel(index) {
			ConfirmModal.popup({
				content: `真的要删除我吗，删除数据后，${this.name}类型将无法恢复`
			}).then(res => {
				this.formdata.types.splice(index, 1);
			}).catch(err => {

			});
		},
		handleAddType(id, item) {
			TypeModal.popup({
				id,
				type: this.cate,
				item
			}).then(res => {
				const { data: { index, ...other } } = res;
				if (index) {
					this.formdata.types.splice(index - 1, 1, other);
				} else {
					
					this.formdata.types.length === 10 
						? this.$Message.error('最多添加10项类型') 
						: this.formdata.types.push(other);
				}
			}).catch(err => {

			});
		},
		handleAddRange() {
			RangeModal.popup({
			}).then(res => {
				this.formdata.ranges.push(res.data);
			}).catch(err => {

			});
		},
		handleRangeDel(index) {
			this.formdata.ranges.splice(index, 1);
		},
		handleFileSuccess(res, file) {
			const { url, title } = res.data;
			this.$Message.success('上传成功');
			this.formdata.rule_doc.push({ url, title });
		},
		handleDelImg(index) {
			this.formdata.rule_doc.splice(index, 1);
		},
		handleSave() {
			this.$refs.form.validate(item => {
				if (item) {
					this.$request({
						url: '_HR_SYSTEM_ASSESS_CREDITINTE_SYSTEM_SAVE_POST',
						type: 'POST',
						param: {
							...this.query,
							cate: this.cate,
							...this.formdata,
						},
					}).then(res => {
						this.$Message.success(res.msg);
						this.$router.go(-1);
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		},
		handleCancel() {
			this.$router.back();
		}
	},
};
</script>

<style lang="scss" scoped>
.v-system-assess-integration-add {
	border: 1px solid #EBEEF1;
	padding-top: 10px;
	border-radius: 5px;

	._upload {
		display: inline-block;
        line-height: 32px;
		padding: 0 15px;
		text-align: center;
        height: 32px;
        background: #fafafa;
		border: 1px solid #d4d7d8 !important;
        color: #000000;
		border-radius: 4px;
		cursor: pointer;

        &:hover{
            color: #d9444f;
            border: 1px solid #d9444f !important;
        }
	}
	._upload-disabled {
		 &:hover{
            color: #000000;
            border: 1px solid #d4d7d8 !important;
        }
	}
	._table {
		border-right: 1px solid #EBEEF1;
		border-top: 1px solid #EBEEF1;

		& > ._item {
			word-break: break-word;

			& > div {
				padding: 10px 15px;
				border-left: 1px solid #EBEEF1;
				border-bottom: 1px solid #EBEEF1;
			}
		}
	}
	._range {
		height: 20px;
		line-height: 20px;
		background: #E84C57;
		color: #fff;
		border-radius: 3px;
		padding: 0 5px;
	}

	._file {
		margin-right: 10px;
		background: #fafafa;
		padding: 5px 15px;
		border-radius: 14px;
		border: 1px solid #ebeef1;
	}
}
</style>
