<template>
	<div class="v-academy-train-detail-draw-provide">
		<oa-title>发放设置</oa-title>
		<div class="__setting">
			<div class="__img">
				<i class="icon iconfont icon-shexiangji g-c-red-mid" style="font-size: 66px"/>
			</div>
			<div class="__btn">
				<vc-debounce-click
					class="g-red-btn-line g-m-l-30 g-fs-14 g-m-b-15"
					@click="handleLinkToDraw">
					去投影到大屏
				</vc-debounce-click>
			</div>
		</div>

		<i-form 
			ref="formValidate"
			:model="formValidate" 
			:rules="ruleValidate"
			:label-width="110"
		>
			<i-form-item label="抽奖用户来源：" prop="user_source">
				<i-radio-group v-model="formValidate.user_source">
					<i-radio :label="1" >
						参与人员
						<span class="g-c-black5">（{{ participator_num ? `已有${participator_num}人` : '暂无签到人员' }}）</span>
					</i-radio>
					<i-radio :label="2" :disabled="!sign_num">
						签到人员
						<span class="g-c-black5">（{{ sign_num ? `已有${sign_num}人` : '暂无签到人员' }}）</span>
					</i-radio>
				</i-radio-group>
			</i-form-item>

			<i-form-item label="允许重复抽奖：" style="margin-top: -15px" prop="allow_repeat">
				<i-radio-group v-model="formValidate.allow_repeat">
					<i-radio :label="0">不允许</i-radio>
					<i-radio :label="1">允许</i-radio>
				</i-radio-group>
			</i-form-item>
		</i-form>

		<div class="_footer" style=" background-color: #fff">
			<i-button 
				type="primary"
				style="margin-right: 300px;" 
				@click="handleSubmit">保存</i-button>
		</div>
	</div>
</template>

<script>
import oaTitle from '@components/hr/academy-train-detail/_common/title';
import API_ROOT from '@stores/apis/root';
import { Form, FormItem, RadioGroup, Radio, Button } from 'iview';


export default {
	name: 'oa-tpl',
	components: {
		'oa-title': oaTitle,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-button': Button
	},
	data() {
		return {
			sign_num: null, // 签到人员个数
			participator_num: null, // 参与人员个数
			formValidate: { 
				user_source: 1, // 抽奖用户来源 1参与人员 2签到人员',
				allow_repeat: 0 // 允许重复抽奖 1 是 0 否'
			},
			ruleValidate: {
				user_source: { required: true, type: 'number' },
				allow_repeat: { required: true, type: 'number' }
			}
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_DRAW_DETAIL_GET,
				param: { 
					lottery_id: this.$route.query.lottery_id,
				},
				type: "GET"
			}).then(({ data }) => {
				this.formValidate = {
					user_source: Number(data.user_source),
					allow_repeat: Number(data.allow_repeat)
				};
				this.sign_num = data.sign_num;
				this.participator_num = data.participator_num;
			});
		},
		handleSubmit() {
			if (!this.$route.query.lottery_id) {
				this.$Message.error('请先完成编辑抽奖奥~');
				return;
			}
			this.$refs.formValidate.validateAndScroll((valid) => {
				if (valid) {
					this.$request({
						url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_DRAW_SEND_GET,
						param: {
							lottery_id: this.$route.query.lottery_id,
							...this.formValidate,
						},
						type: 'POST',
						loding: false
					}).then(res => {
						this.$Message.success(res.msg);
					}).catch(res => {
						this.$Message.error(res.msg);
					});
				}
			});
		},
		handleLinkToDraw() {
			if (!this.$route.query.lottery_id) {
				this.$Message.error('请先完成编辑抽奖奥');
				return;
			}
			this.$router.push({
				path: '/draw',
				query: { lottery_id: this.$route.query.lottery_id }
			});
		}
	},
};
</script>

<style lang="scss" scoped>
.v-academy-train-detail-draw-provide {
	padding: 20px 0 70px 30px;
	.__setting {
		padding: 30px 0 20px 0;
	}
	.__img {
		display: inline-block;
		width:67px;
		height:80px;
		line-height: 80px;
		text-align: center;
		transform: rotateY(180deg)
	}
	.__btn {
		display: inline-block;
		overflow: hidden;
	}
	._footer {
		position: fixed;
		bottom: 0;
		height: 45px;
		line-height: 45px;
		text-align: center;
		margin-left: -30px;
		width: 100%;
		box-shadow:0px -2px 10px 0px rgba(0, 0, 0, 0.08);
	}
}
</style>
