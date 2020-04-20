<template>
	<div class="c-academy-elite-talent-header">
		<div v-if="(stage.condition && stage.condition.length) || (stage.subject && stage.subject.length)">
			<div class="g-m-b-10">
				<div style="max-height: 100px; overflow: auto">
					<div 
						v-for="(condition, condition_index) in stage.condition"
						:key="condition_index"
						class="__condition"
					>
						<div 
							class="__name">条件{{ ENUM[condition_index] }}：
						</div>
						<div class="__extend g-c-black2">
							<div 
								v-for="(extend, extend_index) in condition.extend"
								:key="extend.extend_id"
								class="__extend-item">
								<span v-if="extend_index !== 0">且</span>
								<span 
									v-for="(desc, desc_index) in afterCondition[extend.type - 1].showText"
									:key="desc_index"
									
								>
									{{ desc }}
									<span>{{ extend[afterCondition[extend.type - 1].key[desc_index]] }}</span>
								</span>
							</div>
						</div>
					</div>
					<div v-if="!stage.condition.length">条件：试岗新人</div>
				</div>
			</div>
			<div class="__subject">
				<div class="__name">课题：</div>
				<div class="__list">
					<div
						v-for="(subject) in stage.subject"
						:key="subject.subject_id"
						class="__item"
					>
						<div class="__top2 g-c-black3">
							<oa-custom-tooltip 
								:options="{ content: subject.subject_name, theme: 'light', maxWidth: '110px' }"/>
						</div>
						<div 
							:class="{ 'g-c-black5': !(+subject.course) }"
							class="__bottom2"
							@click="subject.course && handleSubjectDetail(subject.subject_id)"
						>课程：{{ subject.course }}个</div>
					</div>
				</div>
			</div>
		</div>
		<div v-else class="g-tc g-lh-40">这里空空如也奥~</div>
	</div>
</template>

<script>
import CustomTooltip from '@components/hr/academy-train-detail/_common/custom-tooltip';
import API_ROOT from '@stores/apis/root';
import { RelatedModal } from './popup/related-subject';
import { afterCondition } from '../academy-elite-add/add-condition/condition';

const ENUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', 
	'十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
	'二一', '二二', '二三', '二四', '二五', '二六', '二七', '二八', '二九', '三十'];

export default {
	components: {
		'oa-custom-tooltip': CustomTooltip
	},
	props: {
		data: Object,
		departId: Number | String,
		positionList: Array
	},
	data() {
		return {
			ENUM,
			afterCondition,
			stage: this.data,
		};
	},
	watch: {
		data(newVal) {
			this.handleInitPlanDetail(newVal);
			this.stage = newVal;
		}
	},
	methods: {
		handleSubjectDetail(subject_id) {
			RelatedModal.popup({
				subject_id
			});
		},
		handleInitPlanDetail(data) {
			if (data.condition && data.condition.length) {
				data.condition.forEach(condition => {
					if (condition.extend && condition.extend.length) {
						condition.extend.forEach(extend => {
							const type = extend.type - 1;
							let position_ids;
							let selectPositions;
							switch (type) {
								case 0: 
									return;
								case 1: 
									position_ids = extend.position_ids.map(Number);
									selectPositions = this.positionList.reduce((init, cur) => {
										position_ids.includes(Number(cur.position_id)) && init.push(cur.position_name);
										return init;
									}, []);
									extend.positions = selectPositions.join('、');
									break;
								case 2: 
								case 3: 
								case 4: 
								case 5: 
									if (extend.cumulative_months == 0) {
										extend.cumulative_months = '不限月数';
									} else if (!(extend.cumulative_months + '').includes('月')) {
										extend.cumulative_months += "个月";
									}
									break;
								case 6: 
									break;
								default: 
									break;
							}
						});
					}
				});
			}
		},
		handlePositionList() {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: 'GET',
				loading: false
			}).then(({ data }) => {
				this.positionList = data
					.filter(v => v.depart_id == this.departId)[0].positions
					.map(v => {
						Number(v.position_id);
						return v;
					});
			}).catch((error) => {});
		},
	}
};
</script>
<style lang="scss" scoped>
.c-academy-elite-talent-header {
    width: 100%;
    // height: 160px;
    padding: 15px 0 5px 25px;
    border: 1px solid rgba(212, 215, 219, 1);
    .__subject {
        display: flex;
        .__name {
            min-width: 40px;
            max-width: 40px;
        }
        .__list {
            display: flex;
            flex-wrap: wrap;
            .__item {
                display: flex;
                flex-direction: column;
                width: 170px;
                height: 90px;
                border: 1px solid rgba(212, 215, 219, 1);
                border-radius :4px;
                padding: 0 25px;
                justify-content: center;
                align-items: center;
                margin: 0 15px 15px 0;
                display: flex;
                .__top2 {
                    display: flex;
                    flex: 2;
                    text-align: center;
                    align-items: center;
                }
                .__bottom2 {
                    color: #4FC43D;
                    flex: 1;
                    align-items: flex-end;
                    cursor: pointer;
                }
            }
        }
    }
        .__condition {
            overflow: auto;
            display: flex;
            .__name {
                min-width: 50px;
                max-width: 50px;
            }
            .__extend {
                flex: 1;
                .__extend-item {
                    display: inline;
                }
            }
			}
}
 </style>
 
