<template>
	<div class="v-hr-transfer">
		<div class="g-flex g-jc-sb _title">
			<div>员工申请</div>
			<i class="iconfont icon-long-arrow"/>
			<div>上级确认</div>
			<i class="iconfont icon-long-arrow"/>
			<div>人事面谈</div>
			<i class="iconfont icon-long-arrow"/>
			<div>填写申请单</div>
			<i class="iconfont icon-long-arrow"/>
			<div>填写交接表</div>
			<i class="iconfont icon-long-arrow"/>
			<div>人事确认</div>
		</div>
		<div class="_content">
			<oa-title title="离职流程"/>
			<p>Step1.离职需要事先与您的直属上级说明，并点击右下角的申请按钮填写《离职申请单》。</p>
			<p>Step2.若您入职已满8个月，请先与人事部总监曾柳面谈，进行面谈、对接离职手续并提供《离职交接表》。</p>
			<p>Step3.入职8个月以下的：请去人事部招聘组，您的邀约人（接待你面试的人）会与您面谈、对接离职手续《离职交接表》。</p>
			<p>Step4.《离职申请单》将会被打印，并核实内容是否准确，如果和事实不符将需要修改申请单。</p>
			<p>Step5.归还公司提供的电话机、考勤卡、公司电脑交需要还给行政部对应负责人。</p>
			<p>
				Step6.《离职交接表》需要经理签字然后总监签字、财务签、人力资源签字及人力资源总监签字。
				(总监出差很久，可以由经理在微信向总监提出，总监同意后提供聊天记录截图。）
			</p>
			<p>Step7.如果本人未办理离职手续，视为主动放弃在公司的相关权利。</p>
			<p>Step8.公司PK的金钱，将核算完毕并发放至员工。</p>
			<p>Step9.如果工作日未满15天的离职人员，没有工资。</p>
		</div>
		<div class="_need">
			<oa-title title="需要材料"/>
			<p>离职面谈单</p>
			<p>离职申请单</p>
			<p>离职交接表</p>
		</div>
		<footer class="g-flex-cc">
			<div class="g-gray-btn-small g-m-r-10" @click="$router.back()">返回</div>
			<div class="g-m-r-10 g-red-btn-small" @click="handleBtn">申请</div>
		</footer>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { Button } from "iview";
import Title from "../_common/title";

export default {
	name: "v-hr-transfer",
	components: {
		"oa-title": Title,
		"i-button": Button
	},
	data() {
		return {};
	},
	created() {},
	methods: {
		handleBtn() {
			const { query = {} } = this.$route;
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_DIMISSION_GET,
				type: "GET",
				param: {
					staff_id: query.staff_id
				}
			}).then(res => {
				this.$Message.success(res.msg);
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-hr-transfer {
    padding: 20px;
    ._title {
        max-width: 900px;
        display: flex;
        align-items: center;
        align-content: center;
        div {
            width: 120px;
            height: 40px;
            line-height: 40px;
            background-color: #e84854;
            font-size: 13px;
            border-radius: 6px;
            display: flex;
            color: #fff;
            justify-content: center;
            align-content: center;
        }
        i {
            color: #e84854;
            font-size: 30px;
            margin: 0px 10px;
        }
    }
    ._content {
        margin-top: 30px;
        p {
            margin: 10px 0px 10px 0px;
        }
    }
    ._need {
        p {
            margin: 6px 0px 6px 0px;
        }
    }
    footer {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 999;
        background-color: #ffffff;
        width: 100%;
        height: 60px;
        box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
    }
}
</style>
