<template>
    <div id="mapContainer" style="width: 100%; height: 400px;"></div>
    <div id="menu_wrap">
        <ul id="placesList"></ul>
        <div id="pagination"></div>
    </div>
</template>

<script>
export default {
    name: 'KakaoMap',
    props: {
        startLocation: String,
        endLocation: String,
    },
    data() {
        return {
            map: null,
            ps: null,
            geocoder: null,
            startLatLng: null,
            endLatLng: null,
            places: [],
            pagination: null,
            startMarker: null,
            endMarker: null,
        }
    },
    mounted() {
        if (window.kakao && window.kakao.maps) {
            this.loadMap();
        } else {
            this.loadScript();
        }
    },
    methods: {
        loadScript() {
            const script = document.createElement("script");
            const apikey = '25b1da76d2662810e4ed8f926629b445';
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apikey}&autoload=false&libraries=services`;
            script.onload = () => window.kakao.maps.load(() => { this.loadMap(); });
            document.head.appendChild(script);
        },
        loadMap() {
            const mapContainer = document.getElementById("mapContainer");
            const options = {
                center: new kakao.maps.LatLng(33.450701, 126.570667),
                level: 3
            };

            this.map = new window.kakao.maps.Map(mapContainer, options);
            this.ps = new kakao.maps.services.Places();
            this.geocoder = new window.kakao.maps.services.Geocoder();
        },
        searchPlaces(keyword) {
            if (!keyword.replace(/^\s+|\s+$/g, '')) {
                this.$emit('search-completed', []);
                return false;
            }
            this.ps.keywordSearch(keyword, this.placesSearchCB);
        },
        placesSearchCB(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                this.$emit('search-completed', data);
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                this.$emit('search-completed', []);
            } else if (status === kakao.maps.services.Status.ERROR) {
                alert('검색 결과 중 오류가 발생했습니다.');
                this.$emit('search-completed', []);
            }
        },
        displayPlaces(places) {
            const listEl = document.getElementById('placesList');
            const bounds = new kakao.maps.LatLngBounds();

            this.removeAllChildNods(listEl);

            for (let i = 0; i < places.length; i++) {
                const placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
                const itemEl = this.getListItem(i, places[i]);

                bounds.extend(placePosition);

                ((itemEl) => {
                    itemEl.onclick = () => {
                        this.$emit('place-selected', places[i]);
                    };
                })(itemEl);

                listEl.appendChild(itemEl);
            }

            this.map.setBounds(bounds);
        },
        getListItem(index, place) {
            const el = document.createElement('li');
            let itemStr = `<span class="markerbg marker_${index + 1}"></span>` +
                `<div class="info">` +
                `   <h5>${place.place_name}</h5>`;

            if (place.road_address_name) {
                itemStr += `    <span>${place.road_address_name}</span>` +
                    `   <span class="jibun gray">${place.address_name}</span>`;
            } else {
                itemStr += `    <span>${place.address_name}</span>`;
            }
            itemStr += `  <span class="tel">${place.phone}</span>` +
                `</div>`;

            el.innerHTML = itemStr;
            el.className = 'item';

            return el;
        },
        displayPagination(pagination) {
            const paginationEl = document.getElementById('pagination');
            const fragment = document.createDocumentFragment();

            while (paginationEl.hasChildNodes()) {
                paginationEl.removeChild(paginationEl.lastChild);
            }

            for (let i = 1; i <= pagination.last; i++) {
                const el = document.createElement('a');
                el.href = "#";
                el.innerHTML = i;

                if (i === pagination.current) {
                    el.className = 'on';
                } else {
                    el.onclick = (() => {
                        return () => {
                            pagination.gotoPage(i);
                        }
                    })();
                }

                fragment.appendChild(el);
            }
            paginationEl.appendChild(fragment);
        },
        removeAllChildNods(el) {
            while (el.hasChildNodes()) {
                el.removeChild(el.lastChild);
            }
        },
        displayMarker(type, place) {
            const markerPosition = new kakao.maps.LatLng(place.y, place.x);
            const marker = new kakao.maps.Marker({
                position: markerPosition
            });

            if (type === 'start') {
                if (this.startMarker) {
                    this.startMarker.setMap(null);
                }
                this.startMarker = marker;
            } else {
                if (this.endMarker) {
                    this.endMarker.setMap(null);
                }
                this.endMarker = marker;
            }

            marker.setMap(this.map);
            this.map.panTo(markerPosition);
        },

        handlePlaceSelected(type, place) {
            this.displayMarker(type, place);
            this.$emit('place-selected', type, place);
        },
    },
    watch: {
        startLocation(newVal) {
            if (newVal) {
                this.searchPlaces('start');
            }
        },
        endLocation(newVal) {
            if (newVal) {
                this.searchPlaces('end');
            }
        }
    }
};
</script>

<style scoped>
#menu_wrap {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;
    margin: 10px 0 30px 10px;
    padding: 5px;
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.7);
    z-index: 1;
    font-size: 12px;
    border-radius: 10px;
}

#placesList li {
    list-style: none;
}

#placesList .item {
    position: relative;
    border-bottom: 1px solid #888;
    overflow: hidden;
    cursor: pointer;
    min-height: 65px;
}

#placesList .item span {
    display: block;
    margin-top: 4px;
}

#placesList .item h5,
#placesList .item .info {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

#placesList .item .info {
    padding: 10px 0 10px 55px;
}

#placesList .info .gray {
    color: #8a8a8a;
}

#placesList .info .tel {
    color: #009900;
}

#pagination {
    margin: 10px auto;
    text-align: center;
}

#pagination a {
    display: inline-block;
    margin-right: 10px;
    color: #000;
}

#pagination .on {
    font-weight: bold;
    cursor: default;
    color: #777;
}
</style>
