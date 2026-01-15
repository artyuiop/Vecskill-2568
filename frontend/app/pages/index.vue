<template>
    <div>
        <h1>สมัครสมาชิก</h1>
        <UiInput type="text" v-model="formRegister.fname"/>
        <UiInput type="text" v-model="formRegister.lname"/>
        <UiInput type="text" v-model="formRegister.username"/>
        <UiInput type="text" v-model="formRegister.password"/>
        <button class="btn btn-primary" @click="Insert('/api/auth/register', formRegister, 'register')">สมัครสมาชิก</button>
    </div>
    
    <div>
        <h1>เข้าสู่ระบบ</h1>
        <UiInput type="text" v-model="formLogin.username"/>
        <UiInput type="text" v-model="formLogin.password"/>
        <button class="btn btn-primary" @click="Insert('/api/auth/login', formLogin, 'login')">เข้าสู่ระบบ</button>
    </div>
</template>

<script setup>
const formRegister = ({})
const formLogin = ({})
</script>
