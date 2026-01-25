<template>
    <div class="min-h-screen flex-center bg-slate-50 p-4 md:p-0">
        <UiCard class="max-w-md w-full p-7 bg-white">
            <div class="flex-center flex-col">
                <div class="flex-center w-15 h-15 bg-primary text-white rounded-[5px]">
                    <i class="mdi mdi-security text-2xl"></i>
                </div>
                <div class="text-center mt-4">
                    <h1 class="font-bold text-2xl">ยินดีต้อนรับ</h1>
                    <p class="text-[13px]">กรุณาเข้าสู่ระบบเพื่อใช้ ระบบประเมินบุคลากร</p>
                </div>

            </div>
            <div class="px-5 mt-3">
                <div>
                    <UiInput type="text" v-model="formLogin.username" label="Username" />
                    <UiInput type="password" v-model="formLogin.password" label="Password" />
                    <UiButton color="btn-primary w-full mt-3" title="เข้าสู่ระบบ"
                        @click="Insert('/api/auth/login', formLogin, 'login')" />
                </div>
                <div class="divider text-xs opacity-50 uppercase tracking-widest">หรือ</div>
                <div class="text-center">
                    <p class="text-slate-500 text-[12px]">ยังไม่มีบัญชีผู้ใช้งานใช่ไหม?</p>
                    <UiButton @click="showModal('modal_register')" color="btn-secondary btn-outline w-full mt-3" title="สมัครสมาชิก" />
                </div>
            </div>
        </UiCard>
    </div>

    <UiModal modal_id="modal_register" title="แก้ไขข้อมูลส่วนตัว">
        <div class="grid grid-cols-2 gap-4 space-y-2">
            <div>
                <UiInput v-model="formRegister.fname" label="ชื่อจริง" />
                <UiInput v-model="formRegister.lname" label="นามสกุล" />
            </div>
            <div>
                <UiInput v-model="formRegister.username" label="ชื่อผู้ใช้งาน" />
                <UiInput v-model="formRegister.password" label="รหัสผ่าน" />
            </div>
        </div>
        <div class="flex justify-end mt-2 space-x-2">
            <UiButton title="ยกเลิก" color="btn-neutral btn-soft" @click="CloseModal('modal_register')"/>
            <UiButton title="ตกลง" color="btn-primary" @click="Insert('/api/auth/register', formRegister, 'register')"/>
        </div>
    </UiModal>
</template>

<script setup>
const formRegister = ref({})
const formLogin = ref({})
</script>
