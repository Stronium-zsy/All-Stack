import L from 'leaflet';
import 'leaflet-ant-path';

const state = {
  routeCoordinates: [],
  points: [],
  polylines: [], // Store each polyline separately
  map: null,
  visitedPoints: new Set(),
};

const mutations = {
  SET_ROUTE_COORDINATES(state, coordinates) {
    state.routeCoordinates = coordinates;
  },
  SET_POINTS(state, points) {
    state.points = points;
  },
  ADD_POINT(state, point) {
    state.points.push(point);
  },
  SET_POLYLINES(state, polylines) {
    state.polylines = polylines;
  },
  ADD_POLYLINE(state, polyline) {
    state.polylines.push(polyline);
  },
  CLEAR_POLYLINES(state) {
    state.polylines.forEach(polyline => state.map.removeLayer(polyline));
    state.polylines = [];
  },
  SET_MAP(state, map) {
    state.map = map;
  },
  ADD_VISITED_POINT(state, point) {
    state.visitedPoints.add(point);
  },
};

const actions = {
  async searchRoute({ commit, dispatch, state }, { startPoint, endPoint }) {
    commit('CLEAR_POLYLINES');

    try {
      const response = await fetch('http://localhost:4999/search_route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startId: startPoint, endId: endPoint }),
      });

      const result = await response.json();

      if (result.path && result.points) {
        commit('SET_ROUTE_COORDINATES', result.path);
        commit('SET_POINTS', result.points);
        result.points.forEach(point => {
          commit('ADD_VISITED_POINT', point);
        });
        dispatch('plotRoute', { path: result.path, points: result.points, color: 'blue' });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  },
  plotRoute({ commit, state }, { path, points, color }) {
    const latlngs = path.map(coord => [coord[1], coord[0]]);
    const antPolyline = L.polyline.antPath(latlngs, {
      paused: false,
      reverse: false,
      delay: 1200,
      dashArray: [10, 20],
      weight: 10, // Line thickness
      color: color,
      pulseColor: "black"
    }).addTo(state.map);

    commit('ADD_POLYLINE', antPolyline);
  },
  setMap({ commit }, map) {
    commit('SET_MAP', map);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
