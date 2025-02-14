<template>
    <div>
        <div id="mapContainer" ref="mapContainer" style="width: 100%; height: 400px;"></div>
        <div id="menu_wrap">
            <ul id="placesList">
                <li v-for="(place, index) in places" :key="index" @click="selectPlace(place)">
                    {{ place.place_name }} ({{ place.location }})
                </li>
            </ul>
            <div id="pagination" ref="pagination"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'KakaoMap',
    props: {
        userLatitude: Number,
        userLongitude: Number,
        selectedPlace: Object, //선택된 장소를 받을 props
    },
    data() {
        return {
            map: null,
            ps: null,
            geocoder: null,
            places: [],
            marker : null,
        };
    },
    watch:{
        selectedPlace(newPlace){
            if(newPlace){
                this.displayMarker(newPalce);
            }
        }
    },
    mounted() {
        if (window.kakao && window.kakao.maps) {
            this.initializeMap();
        } else {
            this.loadScript();
        }
    },
    methods: {
        loadScript() {
            const script = document.createElement("script");
            const apikey = '25b1da76d2662810e4ed8f926629b445';
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apikey}&autoload=false&libraries=services`;
            script.onload = () => window.kakao.maps.load(this.initializeMap);
            document.head.appendChild(script);
        },
        initializeMap() {
            const lat = this.userLatitude || 37.5665; // 기본값: 서울
            const lng = this.userLongitude || 126.9780;
            this.map = new kakao.maps.Map(this.$refs.mapContainer, {
                center: new kakao.maps.LatLng(lat, lng),
                level: 3,
            });
            this.ps = new kakao.maps.services.Places(); // 장소 검색 객체를 생성합니다
            this.geocoder = new kakao.maps.services.Geocoder();
        },
        updateUserLocation(lat, lng) {
            if (this.map) {
                const newCenter = new kakao.maps.LatLng(lat, lng);
                this.map.setCenter(newCenter);
            }
        },
        searchPlaces(keyword) {
            if (!keyword.trim()) {
                this.places = [];
                return;
            }
            this.ps.keywordSearch(keyword, (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    this.places = data;
                } else {
                    this.places = [];
                }
            });
        },
        selectPlace(place) {
            this.$emit('place-selected', place);
            this.displayMarker(place);
        },
        displayMarker(place) {
            const position = new kakao.maps.LatLng(place.y, place.x);
            const marker = new kakao.maps.Marker({ position });

            if (this.startMarker) {
                this.startMarker.setMap(null);
            }
            this.startMarker = marker;
            marker.setMap(this.map);
            this.map.panTo(position);
        },
    },
    watch: {
        startLocation(newVal) {
            if (newVal) this.searchPlaces(newVal);
        },
        endLocation(newVal) {
            if (newVal) this.searchPlaces(newVal);
        },
    },
};
</script>

<style scoped>
#menu_wrap {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 250px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.9);
    z-index: 1;
    border-radius: 10px;
}

#placesList li {
    list-style: none;
    cursor: pointer;
    padding: 5px;
    border-bottom: 1px solid #ddd;
}

#placesList li:hover {
    background-color: #f5f5f5;
}
</style>
