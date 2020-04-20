<template>
	<div class="collage-main-schedule">
		<div class="g-flex">
			<oa-main-calendar
				ref="calendar"
				@select="handleSelect"
				@filter-change="activeFilter = $event"
			/>
			<oa-note
				:date="curDate"
				:filter="activeFilter"
				@fresh="handleFresh"
				@toggle-open="$emit('toggle-open',$event)"
			/>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Tabs, TabPane, Cascader, Button, Select, Option } from 'iview';
import { services } from "@stores/services/hr";
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl, getItem } from "@utils/utils";
import { isArray } from 'util';
import MainCalendar from './schedule-detail';
import Note from './note';


export default {
	name: 'hr-academy-train-schedule',
	components: {
		'i-tab': Tabs,
		'i-tab-pane': TabPane,
		'oa-main-calendar': MainCalendar,
		'oa-note': Note,
		"i-cascader": Cascader,
		"i-select": Select,
		"i-button": Button,
		'i-option': Option
	},
	mixins: [services.departAll()],
	data() {
		const { query } = this.$route;
		return {
			daySchedule: {},
			curDate: moment().format("YYYY-MM-DD"),
			activeFilter: 0,

		};
	},
	created() {
		this.handleSelect(this.curDate);
	},
	methods: {
		handleSelect(date) {
			this.curDate = date;

		},
		handleFresh() {
			this.$refs.calendar.fresh();
			// this.handleSelect(this.curDate);
		}

	},
};
</script>

<style lang="scss" scoped>
.collage-main-schedule {
	._select {
		display: block;
	}
}
</style>
