import { defineStore } from "pinia";

export const dataStore = defineStore("data", {
  state: () => ({
    evaluatee: [],
    evaluator: [],
    evaluation: [],
    assignments: [],
    indicator: [],
    isLoaded: false, // ตัวช่วยเช็คสถานะ
  }),
  actions: {
    async fetchAllData(force = false){
        if(this.isLoaded && !force) return;

        try{
            const [evaluatee, evaluator, evaluation, assignments, indicator] = await Promise.all([
                    Fetch('/api/users/getUserRole?role=evaluatee'),
                    Fetch('/api/users/getUserRole?role=evaluator'),
                    Fetch('/api/evaluations'),
                    Fetch('/api/assignments'),
                    Fetch('/api/indicator')
            ])

            this.evaluatee = evaluatee;
            this.evaluator = evaluator;
            this.evaluation = evaluation;
            this.assignments = assignments;
            this.indicator = indicator;

            this.isLoaded = true;
        }catch(e){
            return showAlert('ไม่สามารถแสดงข้อมูลได้', 'error')
        }
    }
  },
});
