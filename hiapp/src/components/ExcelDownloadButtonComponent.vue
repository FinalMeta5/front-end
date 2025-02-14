<template>
    <button class="btn btn-outline-secondary mb-2" @click="downloadExcel" type="button">.xlsx 다운로드</button>
</template>

<script setup>
import { authAxios } from '../store/auth/auth';

const downloadExcel = async () => {
    try {
        const response = await authAxios.get('/api/admin/excel', {
            responseType: 'blob' // 파일을 blob 형식으로 받음
        });
        console.log(response);
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'payments.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('엑셀 다운로드 실패', error);
    }
};
</script>