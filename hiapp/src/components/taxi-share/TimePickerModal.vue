<template>
    <div class="modal-overlay" @click="$emit('close')">
        <div class="modal-content" @click.stop>
            <h3>시간 선택</h3>
            <div class="time-picker">
                <div class="time-column">
                    <div v-for="hour in hours" :key="hour" @click="selectHour(hour)"
                        :class="{ 'selected': selectedHour === hour }">
                        {{ hour.padStart(2, '0') }}
                    </div>
                </div>
                <div class="time-column">
                    <div v-for="minute in minutes" :key="minute" @click="selectMinute(minute)"
                        :class="{ 'selected': selectedMinute === minute }">
                        {{ minute.padStart(2, '0') }}
                    </div>
                </div>
            </div>
            <button @click="confirmSelection">확인</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TimePickerModal',
    data() {
        return {
            hours: [...Array(24).keys()].map(i => i.toString()),
            minutes: [...Array(6).keys()].map(i => (i * 10).toString()),
            selectedHour: '',
            selectedMinute: '',
        };
    },
    methods: {
        selectHour(hour) {
            this.selectedHour = hour;
        },
        selectMinute(minute) {
            this.selectedMinute = minute;
        },
        confirmSelection() {
            if (this.selectedHour && this.selectedMinute) {
                const time = `${this.selectedHour.padStart(2, '0')}:${this.selectedMinute.padStart(2, '0')}`;
                this.$emit('select-time', time);
                this.$emit('close');
            }
        }
    }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 300px;
    width: 100%;
}

.time-picker {
    display: flex;
    justify-content: space-around;
    max-height: 200px;
    overflow-y: auto;
}

.time-column {
    flex: 1;
    text-align: center;
}

.time-column div {
    padding: 5px;
    cursor: pointer;
}

.time-column div.selected {
    background-color: #e0e0e0;
    font-weight: bold;
}

button {
    margin-top: 10px;
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>
