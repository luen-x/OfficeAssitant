<template>
	<div>
		<div v-if="type === 'social-transform'">
			<social-transform :type="type"/>
		</div>
		<div v-if="type === 'entry-trend'">
			<entry-trend :type="type"/>
		</div>
		<div v-if="type === 'social-follow'">
			<social-follow :type="type"/>
		</div>
		<div v-if="type === 'interviewer-statistics'">
			<interviewer-statistics :type="type"/>
		</div>
		<div v-if="type === 'interview-record'">
			<interview-record :type="type"/>
		</div>
		<div v-if="type === 'social-statistics'">
			<social-statistics :type="type"/>
		</div>
		<div v-if="type === 'recruitment-form'">
			<recruitment-form :type="type"/>
		</div>
		<div v-if="type === 'position-analyze'">
			<position-analyze :type="type"/>
		</div>
		
	</div>
</template>

<script>
import socialTransform from './social-transform';
import socialFollow from './social-follow';
import entryTrend from './entry-trend';
import interviewerStatistics from './interviewer-statistics';
import interviewRecord from './interview-record';
import socialStatistics from './social-statistics';
import recruitmentForm from './recruitment-form';
import positionAnalyze from './position-analyze';


export default {
	name: 'oa-filter',
	components: {
		'social-transform': socialTransform,
		'social-follow': socialFollow,
		'entry-trend': entryTrend,
		'interviewer-statistics': interviewerStatistics,
		'interview-record': interviewRecord,
		'social-statistics': socialStatistics,
		'recruitment-form': recruitmentForm,
		'position-analyze': positionAnalyze,
		
	},
	data() {
		const { query = {} } = this.$route;
		return {
		};
	},
	computed: {
		type() {
			return this.$store.state.hrRecruitSocialStatistics.type;
		}
	}
};
</script>


