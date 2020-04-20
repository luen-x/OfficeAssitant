<template>
	<div class="v-hr-academy-rain-detail-group-group">
		<i-form 
			ref="form" 
			:model="formData" 
			:rules="formDataRule" 
			:label-width="100"
			class="g-m-t-20">
			<i-form-item 
				label="创建组数："
				prop="number"
			>
				<i-input
					v-model="formData.number"
					:maxlength="2"
					style="width: 300px;"
				>
					<span slot="suffix" style="height: 32px; line-height: 32px;">组</span>
				</i-input>
			</i-form-item>
			<i-form-item 
				ref="relation"
				label="关联事项："
				prop="label"
			>
				<span class="g-c-blue-mid g-pointer" @click="hadleRelatedMaster">关联事项</span>
				<span 
					v-if="formData.relation_type"
				>{{ formData.label }}</span>
			</i-form-item>
			<i-form-item label="分组用户来源:" prop="source">
				<i-radio-group v-model="formData.source" @on-change="handleChangeSource">
					<i-radio :label="1">
						参与人员
					</i-radio>
					<i-radio :label="2">
						签到人员
					</i-radio>
				</i-radio-group>
			</i-form-item>
			<i-form-item 
				label="分组方式："
			>
				<div class="g-flex">
					<div 
						class="_button g-pointer g-m-r-20"
						@click="handleSave(1)"
					>
						<div class="__text-top g-m-t-10">随机分组</div>
						<div class="__text">按组数将人员自动分组</div>
						<div>
							<i class="iconfont icon-randompwd g-fs-36"/>
							<i class="iconfont icon-randompwd g-fs-20"/>
						</div>
					</div>
					<div 
						class="_button g-pointer"
						@click="handleSave(2)"
					>
						<div class="__text-top g-m-t-10">手动分组</div>
						<div class="__text">手动将人员分到不同组中</div>
						<div>
							<i class="iconfont icon-set g-fs-36"/>
						</div>
					</div>
				</div>
			</i-form-item>
		</i-form>
	</div>
</template>

<script>
import { Form, FormItem, Input, Radio, RadioGroup } from 'iview';
import { getParseUrl, getHashUrl, setItem, getItem } from '@utils/utils';
import { PModalRetatedMatter } from '@components/hr/academy-train-detail/_common/popup/related-matter';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'oa-tpl',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-radio-group': RadioGroup,
		'i-radio': Radio
	},
	data() {
		const validateNumber = (rule, value, callback) => {
			const reg = /^[1-9][0-9]*$/; 
			if (!value && value !== 0) {
				callback();
			}
			if (!reg.test(value)) { 
				callback(new Error('请输入正确格式的正整数'));
			} else {
				callback();
			}
		};
		return {
			show: 0,
			formData: {
				label: null,
				relation_id: [],
				relation_type: '',
				number: 0,
				source: null
			},
			formDataRule: {
				number: [
					{ required: true, message: '组数不能为空', trigger: 'blur' },
					{ validator: validateNumber, trigger: 'blur' }
				],
				source: [{ type: 'number', required: true, message: '请选择人员来源', trigger: 'change' }],
				label: [{ required: true, message: '请选择关联事项', trigger: 'change' }]
			},
			number: ''
		};
	},
	created() {
	},
	methods: {
		handleChangeSource(e) {
			this.handlePeopleNumber();
		},
		hadleRelatedMaster() {
			PModalRetatedMatter.popup({ 
				type: 'group',
				datas: {
					relation_type: this.formData.relation_type,
					relation_id: this.formData.relation_id
				}
			}).then(res => {
				this.formData.label = res.label;
				this.formData.relation_id = res.relation_id;
				this.formData.relation_type = res.relation_type;
				if (this.$refs.relation) {
					this.$refs.form.validateField("label");
				}
			});
		},
		handlePeopleNumber() {
			let obj = {
				project_id: this.$route.query.project_id,
				course_ids: this.formData.relation_id.length ? this.formData.relation_id : '',
				source: this.formData.source
			};
			this.$request({
				url: API_ROOT['_HR_TRAIN_HAND_GOURP_GET'], // eslint-disable-line
				type: "GET",
				param: obj
			}).then((res) => {
				this.number = res.data.list.length;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleSave(v) {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					try {
						if (this.number < this.formData.number) {
							this.$Message.warning(`组数不能大于参与人员，当前参与人员${this.number}人`);
						} else {
							let route = ['/hr/academy/train/detail/group/1/random', '/hr/academy/train/detail/group/2/hand'];
							this.$router.push(getHashUrl(
								v == 1 ? route[0] : route[1], 
								{ 
									...this.$route.query,
									group_num: this.formData.number,
									course_ids: this.formData.relation_id,
									source: this.formData.source
								}
							));
						}
					} catch (error) {
						console.error(error);
					}
				}
			});
		}
	},
};
</script>

<style lang="scss" scoped>
.v-hr-academy-rain-detail-group-group {
	._button {
		display: inline-block;
		width:179px;
		height:129px;
		border:1px solid #D1D5D8;
		// box-shadow:0px 0px 6px 0px rgba(35,151,249,0.49);
		border-radius:4px;
		text-align: center;
		.__text-top {
			height: 20px;
		}
		.__text {
			height: 20px;
			margin-bottom: 20px;
		}
		&:hover {
			border:1px solid #2397F9;
			color: #2397F9;
		}
	}
}
</style>
