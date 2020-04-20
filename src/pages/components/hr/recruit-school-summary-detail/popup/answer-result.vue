<template>
	<div>
		<i-drawer
			ref="drawer"
			:mask="false"
			:mask-closable="false"
			:styles="styles"
			v-model="visible"
			:loading="true"
			:title="paper_theme || '--'"
			width="720"
			class="v-hr-recruit-school-summary-peper-pre g-fs-14"
			@on-close="handleClose"
		>
			<div>
				<div
					v-for="(question, i) in questions"
					:key="question.detail_id"
					:class="{'g-bb': i != questions.length - 1 }"
					style="width: 100%"
					class="g-m-b-20 g-pd-b-15"
				>
					<div class="g-c-black1 g-m-b-15">{{ i + 1 }}.{{ question.title }}</div>
					<i-radio-group v-model="question.option_id" style="width: 100%">
						<div
							v-for="(option, i) in question.option"
							:key="option.option_id"
							class="g-lh-30"
							style="display: flex"
						>   
							<div style="flex: 4">
								<i-radio :label="option.option_id" disabled>
									<span>{{ OPTION[i] }}</span>
									{{ option.option_name }}
								</i-radio>
							</div>
							<div style="flex: 4">
								{{ option.dimension_name }}：+{{ option.score }}
							</div>
						</div>
                        
					</i-radio-group>
				</div>
			</div>
		</i-drawer>
	</div>
</template>
<script>
import { Button, Drawer, RadioGroup, Radio, Col, Row } from "iview";
import { CreatePortal } from "wya-vc";
import Loading from '@components/_common/loading/loading';
import API_ROOT from '@stores/apis/root';
import { Confirm } from '@common/confirm/confirm';

const OPTION = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];


export default {
	name: "oa-hr-recruit-school-summary-peper-pre",
	components: {
		"i-button": Button,
		"i-drawer": Drawer,
		'oa-loading': Loading,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-col': Col,
		'i-row': Row
	},
	props: {
		paper_theme: String,
		paper_id: String | Number
	},
	data() {
		return {
			OPTION,
			visible: false,
			styles: {
				height: "calc(100% - 55px)",
				overflow: "hidden",
				paddingBottom: "100px",
				position: "static"
			},
			questions: []
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_HR_RECRUIT_SCHOOL_PAPER_QUESTION_PRE_GET',
				param: { 
					paper_id: this.paper_id,
					answer_id: this.$route.params.id
				},
				type: "GET"
			}).then(res => {
				this.questions = res.data.detail;
			});
		},
		handleClose() {
			this.$emit('close');
		},
	}
};
export const AnswerResultDrawer = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-hr-recruit-school-summary-peper-pre {
	.ivu-drawer-body {
		overflow: auto !important;
        padding: 20px;
	}
    .ivu-radio-wrapper {
        white-space: normal!important;
        color: #8b919c
    }
}
</style>

