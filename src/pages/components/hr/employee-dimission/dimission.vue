<template>
	<div class="v-hr-transfer">
		<div class="g-flex g-jc-sb _title">
			<div>员工申请</div>
			<i class="iconfont icon-long-arrow"/>
			<div>上级确认</div>
			<i class="iconfont icon-long-arrow"/>
			<div>上级签字</div>
			<i class="iconfont icon-long-arrow"/>
			<div>人事签字</div>
			<i class="iconfont icon-long-arrow"/>
			<div>转岗部门面谈</div>
			<i class="iconfont icon-long-arrow"/>
			<div>填写交接表</div>
			<i class="iconfont icon-long-arrow"/>
			<div>人事确认</div>
		</div>
		<div class="_content">
			<oa-title title="转岗流程"/>
			<p>Step1.员工通过右下角的“申请”按钮，进行转岗申请。</p>
			<p>Step2.与您直属上级沟通，并同意转岗。</p>
			<p>Step3.通知人事部转岗意愿，领取“转岗交接表”并填写。</p>
			<p/>
			<p>Step4.和直属上级及调职部门上级面谈，并得到他们的转岗许可。</p>
			<p/>
			<p>Step5.进行工作交接由直属领导确认签字交接完成，并和财务中心/财务部、行政部进行工作交接对接并在交接表上确认签字。</p>
			<p/>
			<p>Step6.交接表完成后由人事确认无误后，进行转岗。</p>
			<p/>
			<p>Step7.员工根据调职部门情况参与试岗，试岗通过后正式转岗，转岗流程结束。</p>
		</div>
		<div class="_need">
			<oa-title title="需要材料"/>
			<p>转岗交接表</p>
		</div>
		<footer class="g-flex-cc">
			<div class="g-gray-btn-small g-m-r-10" @click="$router.back()">返回</div>
			<div class="g-m-r-10 g-red-btn-small" @click="handleBtn">申请</div>
		</footer>
	</div>
</template>

<script>
import { Button } from "iview";
import Title from "../_common/title";
import { AuditModal } from "./popup/audit";

export default {
	name: "oa-tpl",
	components: {
		"oa-title": Title,
		"i-button": Button
	},
	data() {
		return {
			formValidate: []
		};
	},
	created() {},
	methods: {
		handleBtn() {
			const { query = {} } = this.$route;
			AuditModal.popup({
				title: "转岗申请",
				staff_id: query.staff_id
			}).then();
		}
	}
};
</script>

<style lang="scss" scoped>
.v-hr-transfer {
    padding: 20px;
    ._title {
        max-width: 1000px;
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

