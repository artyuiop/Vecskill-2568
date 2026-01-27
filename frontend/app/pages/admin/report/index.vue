<script setup>
definePageMeta({
    layout: 'main-layout'
});

const activeTab = ref('evaluator'); // 'evaluator' หรือ 'evaluatee'
const searchQuery = ref('');

// --- Mock Data: 5.1.11 ติดตามกรรมการ (ตัดข้อมูลส่วนเกินออก) ---
const evaluators = ref([
    { 
        id: 101, 
        name: "ดร. สมศักดิ์ ภักดี", 
        graded: 8, 
        total: 10, 
        status: "in_progress"
    },
    { 
        id: 102, 
        name: "คุณปราณี มีสุข", 
        graded: 15, 
        total: 15, 
        status: "completed"
    },
    { 
        id: 103, 
        name: "คุณวิชัย ใจดี", 
        graded: 0, 
        total: 5, 
        status: "pending"
    },
]);

// --- Mock Data: 5.1.12 ติดตามผู้รับการประเมิน ---
const evaluatees = ref([
    { 
        id: 1, 
        name: "นายสมชาย ตั้งใจเรียน", 
        self_assessment: true, 
        committee_progress: 3, 
        committee_total: 3, 
        status: "completed"
    },
    { 
        id: 2, 
        name: "นางสาววิไล รักงาน", 
        self_assessment: false, 
        committee_progress: 1, 
        committee_total: 3, 
        status: "pending"
    },
    { 
        id: 3, 
        name: "นายมานะ อดทน", 
        self_assessment: true, 
        committee_progress: 1, 
        committee_total: 2, 
        status: "in_progress"
    },
]);

// Filter Search
const filteredEvaluators = computed(() => 
    evaluators.value.filter(e => e.name.includes(searchQuery.value))
);
const filteredEvaluatees = computed(() => 
    evaluatees.value.filter(e => e.name.includes(searchQuery.value))
);

// Helper function
const getStatusColor = (status) => {
    switch(status) {
        case 'completed': return 'badge-success text-white';
        case 'in_progress': return 'badge-warning text-white';
        default: return 'badge-ghost';
    }
};

const getStatusText = (status) => {
    switch(status) {
        case 'completed': return 'เสร็จสิ้น';
        case 'in_progress': return 'กำลังดำเนินการ';
        default: return 'ยังไม่เริ่ม';
    }
};
</script>

<template>
    <div class="p-6 min-h-screen bg-base-100/50 space-y-6">
        <UiHeader 
            title="ติดตามสถานะการประเมิน" 
            description="ตรวจสอบความคืบหน้า (5.1.11, 5.1.12)"
        />

        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="tabs tabs-boxed bg-base-200 p-1 rounded-xl">
                <a 
                    class="tab tab-lg px-8 rounded-lg font-bold transition-all"
                    :class="activeTab === 'evaluator' ? 'tab-active bg-white text-primary shadow-sm' : ''"
                    @click="activeTab = 'evaluator'"
                >
                    กรรมการ (5.1.11)
                </a>
                <a 
                    class="tab tab-lg px-8 rounded-lg font-bold transition-all"
                    :class="activeTab === 'evaluatee' ? 'tab-active bg-white text-secondary shadow-sm' : ''"
                    @click="activeTab = 'evaluatee'"
                >
                    ผู้รับการประเมิน (5.1.12)
                </a>
            </div>

            <div class="form-control w-full md:w-auto">
                <input type="text" placeholder="ค้นหาชื่อ..." class="input input-bordered w-full md:w-64" v-model="searchQuery" />
            </div>
        </div>

        <div v-if="activeTab === 'evaluator'" class="card bg-base-100 shadow-sm border border-base-200 rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
                <table class="table w-full">
                    <thead class="bg-primary/5 text-primary">
                        <tr>
                            <th class="w-1/3">ชื่อกรรมการ</th>
                            <th>ความคืบหน้า</th>
                            <th class="text-center">สถานะ</th>
                            <th class="text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in filteredEvaluators" :key="row.id" class="hover:bg-base-100">
                            <td>
                                <div class="flex items-center space-x-3">
                                    <div class="avatar placeholder">
                                        <div class="bg-primary/10 text-primary rounded-full w-10">
                                            <span class="text-xs font-bold">{{ row.name.substring(0,2) }}</span>
                                        </div>
                                    </div>
                                    <div class="font-bold text-lg">{{ row.name }}</div>
                                </div>
                            </td>
                            <td class="pr-12">
                                <div class="flex items-center gap-3">
                                    <progress 
                                        class="progress w-full h-3" 
                                        :class="row.graded === row.total ? 'progress-success' : 'progress-primary'" 
                                        :value="row.graded" 
                                        :max="row.total"
                                    ></progress>
                                    <span class="font-bold text-sm whitespace-nowrap">{{ row.graded }} / {{ row.total }}</span>
                                </div>
                            </td>
                            <td class="text-center">
                                <div class="badge badge-lg font-medium" :class="getStatusColor(row.status)">
                                    {{ getStatusText(row.status) }}
                                </div>
                            </td>
                            <td class="text-right">
                                <button class="btn btn-ghost btn-sm text-primary" v-if="row.status !== 'completed'">
                                    เตือน
                                </button>
                                <button class="btn btn-ghost btn-sm">
                                    รายละเอียด
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="activeTab === 'evaluatee'" class="card bg-base-100 shadow-sm border border-base-200 rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
                <table class="table w-full">
                    <thead class="bg-secondary/5 text-secondary">
                        <tr>
                            <th class="w-1/3">ผู้รับการประเมิน</th>
                            <th class="text-center">ประเมินตนเอง</th>
                            <th class="text-center">กรรมการประเมิน</th>
                            <th class="text-center">สถานะรวม</th>
                            <th class="text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in filteredEvaluatees" :key="row.id" class="hover:bg-base-100">
                            <td>
                                <div class="font-bold text-lg">{{ row.name }}</div>
                            </td>
                            <td class="text-center">
                                <i class="mdi text-2xl" 
                                   :class="row.self_assessment ? 'mdi-check-circle text-success' : 'mdi-clock-outline text-gray-300'"
                                   :title="row.self_assessment ? 'ส่งแล้ว' : 'ยังไม่ส่ง'">
                                </i>
                            </td>
                            <td>
                                <div class="flex justify-center items-center gap-2">
                                    <div class="radial-progress text-[10px] font-bold text-secondary bg-secondary/10 border-4 border-transparent" 
                                         :style="`--value:${(row.committee_progress/row.committee_total)*100}; --size:2rem; --thickness: 3px;`">
                                        {{ row.committee_progress }}/{{ row.committee_total }}
                                    </div>
                                </div>
                            </td>
                            <td class="text-center">
                                <div class="badge badge-lg badge-outline font-medium" :class="row.status === 'completed' ? 'badge-success' : 'badge-warning'">
                                    {{ getStatusText(row.status) }}
                                </div>
                            </td>
                            <td class="text-right">
                                <button class="btn btn-ghost btn-sm" v-if="row.status === 'completed'">
                                    รายงาน
                                </button>
                                <button class="btn btn-ghost btn-sm text-error" v-else>
                                    ตามงาน
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>