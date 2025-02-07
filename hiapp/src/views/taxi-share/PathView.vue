<template>
    <div class="path-view">
        <div class="header">
            <router-link to="/" class="back-button">←</router-link>
            <h1>경로 등록</h1>
        </div>

        <div class="location-inputs">
            <div class="input-group">
                <div class="search-container">
                    <input type="text" v-model="startLocation" @input="searchPlaces('start')"
                        placeholder="출발지를 입력하세요." />
                    <ul v-if="startSearchResults.length" class="search-results">
                        <li v-for="(place, index) in startSearchResults" :key="index"
                            @click="selectPlace('start', place)">
                            {{ place.place_name }}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="input-group">
                <div class="search-container">
                    <input type="text" v-model="endLocation" @input="searchPlaces('end')" placeholder="도착지를 입력하세요." />
                    <ul v-if="endSearchResults.length" class="search-results">
                        <li v-for="(place, index) in endSearchResults" :key="index" @click="selectPlace('end', place)">
                            {{ place.place_name }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="map-container">
            <div class="map">
                <KakaoMap ref="kakaoMap" :startLocation="startLocation" :endLocation="endLocation"
                    @search-completed="handleSearchCompleted" @place-selected="handlePlaceSelected" />
            </div>
            <div class="address-info">
                <p>출발지: {{ startLocation }}</p>
                <p>도착지: {{ endLocation }}</p>
            </div>
        </div>

        <button class="next-button" @click="nextStep">다음</button>
    </div>
</template>

<script>
import KakaoMap from "../../components/taxi-share/KakaoMap.vue";

export default {
    name: 'PathView',
    components: {
        KakaoMap,
    },
    data() {
        return {
            startLocation: '',
            endLocation: '',
            startLatLng: null,
            endLatLng: null,
            searchType: null,
            startSearchResults: [],
            endSearchResults: [],
        };
    },
    methods: {
        searchPlaces(type) {
            this.searchType = type;
            const location = type === 'start' ? this.startLocation : this.endLocation;
            if (location.length > 0) {
                this.$refs.kakaoMap.searchPlaces(location);
            } else {
                this[`${type}SearchResults`] = [];
            }
        },
        handleSearchCompleted(places) {
            if (this.searchType === 'start') {
                this.startSearchResults = places;
            } else {
                this.endSearchResults = places;
            }
        },
        handlePlaceSelected(type, place) {
            if (type === 'start') {
                this.startLocation = place.place_name;
                this.startLatLng = new kakao.maps.LatLng(place.y, place.x);
                this.startSearchResults = [];
            } else {
                this.endLocation = place.place_name;
                this.endLatLng = new kakao.maps.LatLng(place.y, place.x);
                this.endSearchResults = [];
            }
            this.$refs.kakaoMap.handlePlaceSelected(type, place);
        },
        selectPlace(type, place) {
            this.handlePlaceSelected(type, place);
        },
        nextStep() {
            if (!this.startLatLng || !this.endLatLng) {
                alert('출발지와 도착지를 모두 선택해주세요.');
                return;
            }

            this.$router.push({
                path: '/taxi-share/regist',
                state: {
                    latLngInfo: {
                        startLocation: this.startLocation,
                        endLocation: this.endLocation,
                        startLat: this.startLatLng.getLat(),
                        startLng: this.startLatLng.getLng(),
                        endLat: this.endLatLng.getLat(),
                        endLng: this.endLatLng.getLng()
                    }
                }
            });
        },
    },
};
</script>


<style scoped>
.path-view {
    padding: 16px;
    margin-top: 120px;
}

.header {
    display: flex;
    align-items: center;
}

.back-button {
    margin-right: 10px;
    text-decoration: none;
    font-size: 24px;
}

.location-inputs {
    margin: 20px 0;
}

.input-group {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    margin-left: 10px;
    padding: 10px;
    background-color: #4192ff;
    color: white;
    border: none;
    border-radius: 4px;
}

.map-container {
    margin: 20px 0;
}

.map {
    height: 500px;
    background-color: #eaeaea;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.address-info {
    margin-top: 10px;
}

.next-button {
    padding: 10px;
    background-color: #4192ff;
    color: white;
    border: none;
    border-radius: 4px;
    width: 100%;
}

.search-container {
    position: relative;
    flex: 1;
}

.search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    border-top: none;
    list-style-type: none;
    padding: 0;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
}

.search-results li {
    padding: 10px;
    cursor: pointer;
}

.search-results li:hover {
    background-color: #f0f0f0;
}
</style>
