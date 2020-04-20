<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:loading="true"
		title="导入数据"
		width="400px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-tb-30 g-fs-14 v-pk-import-data" style="color: #333">
			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="110">
				<i-form-item label="分类名称：" prop="month">
					<i-date-picker
						v-model="formValidate.month"
						clearable
						transfer
						type="month"
						placeholder="选择月份"
						style="width: 220px;"
						class="g-m-r-5"/>
				</i-form-item>
				<i-form-item label="选择上传文件：" prop="file" class="_customer-input">
					<div class="g-absolute g-fs-12 __tips">
						（请上传excel文件）
					</div>
					<label v-if="!formValidate.file.length" for="input">
						<span class="__upload">上传</span>
					</label>
					<input
						id="input"
						ref="inputer"
						type="file"
						@input="handleInput"
						@change="handleChange"><input>
					<div v-if="formValidate.file.length" style="width: 88%">
						{{ formValidate.file[0].name.length > 20
							? formValidate.file[0].name.slice(0, 20) + '...'
						: formValidate.file[0].name }}
						<span class="g-fr __operate" @click="handleDelete">删除</span>
					</div>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, DatePicker, Button, Progress } from 'iview';
import { CreatePortal, FilesPicker, Upload } from 'wya-vc';
import ROOT_API from '@stores/apis/root';
import orderModal from '@extends/mixins/orderModal';
import moment from 'moment';

export default {
	name: "oa-pk-import-data",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-date-picker': DatePicker,
		"vc-files-picker": FilesPicker,
		'i-progress': Progress,
	},
	mixins: [orderModal],
	data() {
		return {
			visible: false,
			formValidate: {
				month: '',
				file: []
			},
			ruleValidate: {
				month: [
					{ required: true, type: 'date', message: '该选项为必填项', trigger: 'change' }
				],
				file: [
					{ required: true, type: 'array', message: '请上传文件', trigger: 'change' }
				],
			},

		};
	},
	created() {

	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					let data = new FormData();
					data.append('file', this.formValidate.file[0]);
					data.append("month", moment(this.formValidate.month).format("YYYY-MM"));
					this.$refs.modal.buttonLoading = false;
					fetch(ROOT_API._SALE_MAIN_PK_IMPORT_DATA_POST, {
						method: 'post',
						body: data,
						headers: {
							'-token': this.$global.token,
						},
						credentials: 'include'
					}).then(async (res) => {
						this.visible = false;
						const { msg } = await res.json();
						this.$Message.success(msg);
						// app.$store.commit('CONTENT_ACTIVITY_CLASSIFY_LIST_RESET', { type: '' });
					}).catch(err => {
						console.error(err);
						this.$Message.error('上传失败');
					});
				} else {
					this.$refs.modal.buttonLoading = false;
					this.visible = true;
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleChange(e) {
			const excelType = ['xls', 'xlsx'];
			const file = this.$refs.inputer.files['0'];
			const type = file.name.split('.').pop();
			if (!excelType.includes(type)) {
				this.$Message.error('请上传正确文件格式');
				return;
			}
			this.formValidate.file.push(file);
			this.$refs.inputer.value = '';
			this.dispatch("FormItem", "on-form-change", this.formValidate.file);
		},
		handleInput(e) {
		},
		handleDelete() {
			this.formValidate.file = [];
			this.dispatch("FormItem", "on-form-change", this.formValidate.file);
		}
	}
};
export const PModalImport = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-pk-import-data {
	._upload {
		line-height: 32px;
		width: 80px;
		text-align: center;
		height: 32px;
		background: #fafafa;
		border: 1px solid #d4d7d8 !important;
		color: #000000;
		border-radius: 4px;
        margin: -20px;
		&:hover{
			color: #d9444f;
			border: 1px solid #d9444f !important;
		}
	}
    ._files {
        margin: -20px;
    }
    ._customer-input {
        input {
            display: none
        }
        .__operate {
            color: #2296f9 !important;
            cursor: pointer
        }
        .__upload {
            display: inline-block;
            line-height: 32px;
            width: 80px;
            text-align: center;
            height: 32px;
            background: #fafafa;
            border: 1px solid #d4d7d8 !important;
            color: #000000;
            border-radius: 4px;

            &:hover{
                color: #d9444f;
                border: 1px solid #d9444f !important;
            }
	}
		.__tips {
			top: 21px;
			left: -114px;
			color: #c0c0c0;
		}
}

}
</style>
