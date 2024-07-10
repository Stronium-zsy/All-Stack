// store/modules/map.js
import axios from 'axios';
import Chart from 'chart.js/dist/Chart';

const state = {
  chart: null,
  polyline: null,
  movingMarker: null,
  currentLatLngIndex: 0,
  moveInterval: null,
  refreshInterval: null,
  routePath: [],
  currentSpeeds: {},
};

const mutations = {
  SET_CHART(state, chart) {
    state.chart = chart;
  },
  SET_POLYLINE(state, polyline) {
    state.polyline = polyline;
  },
  SET_MOVING_MARKER(state, movingMarker) {
    state.movingMarker = movingMarker;
  },
  SET_ROUTE_PATH(state, path) {
    state.routePath = path;
  },
  UPDATE_CURRENT_LATLNG_INDEX(state, index) {
    state.currentLatLngIndex = index;
  },
  SET_MOVE_INTERVAL(state, interval) {
    state.moveInterval = interval;
  },
  SET_REFRESH_INTERVAL(state, interval) {
    state.refreshInterval = interval;
  },
  UPDATE_CURRENT_SPEED(state, { sensor_id, speed }) {
    state.currentSpeeds[sensor_id] = speed;
  }
};

const actions = {
  async fetchRoute({ commit, state, dispatch }, { startPoint, endPoint }) {
    try {
      const response = await axios.post('http://localhost:4999/search_route', {
        startPoint,
        endPoint
      });

      const result = response.data;

      if (result.path) {
        commit('SET_ROUTE_PATH', result.path);
        dispatch('plotRoute', { path: result.path, resetMarker: true });
        dispatch('startMovingMarker');
        const refreshInterval = setInterval(() => dispatch('refreshRoute', { endPoint }), 1000);
        commit('SET_REFRESH_INTERVAL', refreshInterval);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  },
  async refreshRoute({ state, commit, dispatch }, { endPoint }) {
    const currentLatLng = state.movingMarker.getLatLng();
    const currentPosition = [currentLatLng.lat, currentLatLng.lng];

    try {
      const response = await axios.post('http://localhost:4999/search_route', {
        startPoint: currentPosition,
        endPoint
      });

      const result = response.data;

      if (result.path) {
        dispatch('plotRoute', { path: result.path, resetMarker: false });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  },
  plotRoute({ state, commit }, { path, resetMarker }) {
    if (state.polyline) {
      state.polyline.removeFrom(state.map);
    }

    const latlngs = path.map(coord => [coord[1], coord[0]]); // 翻转经纬度顺序以符合 Leaflet 的格式

    const polyline = L.polyline(latlngs, { color: 'blue' }).addTo(state.map);
    commit('SET_POLYLINE', polyline);

    if (resetMarker) {
      if (state.movingMarker) {
        state.movingMarker.removeFrom(state.map);
      }
      const movingMarker = L.circleMarker(latlngs[0], {
        radius: 8,
        color: 'red'
      }).addTo(state.map);
      commit('SET_MOVING_MARKER', movingMarker);
      commit('UPDATE_CURRENT_LATLNG_INDEX', 0);
    }

    dispatch('plotSpeedChart', latlngs);
  },
  startMovingMarker({ state, commit, dispatch }) {
    const moveInterval = setInterval(() => {
      if (state.currentLatLngIndex < state.routePath.length - 1) {
        commit('UPDATE_CURRENT_LATLNG_INDEX', state.currentLatLngIndex + 1);
        const latlng = [state.routePath[state.currentLatLngIndex][1], state.routePath[state.currentLatLngIndex][0]];
        state.movingMarker.setLatLng(latlng);
      } else {
        clearInterval(state.moveInterval);
      }
    }, 5000);
    commit('SET_MOVE_INTERVAL', moveInterval);
  },
  plotSpeedChart({ state }) {
    const speeds = state.routePath.map(sensor_id => {
      const speedData = state.currentSpeeds[sensor_id];
      return speedData ? speedData : 0;
    });

    const labels = state.routePath.map(sensor_id => sensor_id);

    state.chart.data.labels = labels;
    state.chart.data.datasets[0].data = speeds;

    state.chart.update();
  },
  initChart({ commit }) {
    const ctx = document.getElementById('averageSpeedChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: '平均速度(英里/h)',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: '所有传感器此刻平均速度',
          fontColor: '#FFFFFF'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'minute',
              stepSize: 5, // 每5分钟一个时间间隔
              tooltipFormat: 'YYYY-MM-DD HH:mm', // 显示格式
              displayFormats: {
                minute: 'YYYY-MM-DD HH:mm'
              }
            },
            ticks: {
              fontColor: '#FFFFFF'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: '平均速度(英里/时)',
              fontColor: '#FFFFFF'
            },
            ticks: {
              fontColor: '#FFFFFF'
            }
          }]
        }
      }
    });
    commit('SET_CHART', chart);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
