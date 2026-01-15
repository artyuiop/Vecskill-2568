import { defineStore } from "pinia";

export const dataStore = defineStore('data', {
    state: () => ({
        data_evaluatee: [],
        data_evaluator: [],
        data_evaluation: [],
        data_assignments: [],
        data_indicator: [],
    }),
    actions: {
        async fetchEvaluatee(){
            const res = await Fetch('/api/user/?role=evaluatee')
            this.data_evaluatee = res
        },
        async fetchEvaluator(){
            const res = await Fetch('/api/user/?role=evaluator')
            this.data_evaluator = res
        },
        async fetchEvaluation(){
            const res = await Fetch('/api/evaluation')
            this.data_evaluation = res
        },
        async fetchAssignments(){
            const res = await Fetch('/api/assignments')
            this.data_assignments = res
        },
        async fetchIndicator(){
            const res = await Fetch('/api/indicator')
            this.data_indicator = res
        }
    }
})