const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,

  latestTimestamp: state => state.websocket.latestTimestamp,
  sensorData: state => state.map_data.sensorData,
  topSpeedRanks: state => state.map_data.topSpeedRanks,
  streetAverages: state => state.map_data.streetAverages,
  overallAverageSpeed: state => state.map_data.overallAverageSpeed,
  initialMarkers: state => state.map_data.initialMarkers,
  sensorStreet:state=>state.map_data.sensor_street,

  predictLatestTimestamp: state => state.predictMapData.predictLatestTimestamp,
  predictSensorData: state => state.predictMapData.predictSensorData,
  predictTopSpeedRanks: state => state.predictMapData.predictTopSpeedRanks,
  predictStreetAverages: state => state.predictMapData.predictStreetAverages,
  predictOverallAverageSpeed: state => state.predictMapData.predictOverallAverageSpeed,
  predictInitialMarkers: state => state.predictMapData.predictInitialMarkers,

  getCurrentSpeeds: state => state.map.currentSpeeds,
  getRoutePath: state => state.map.routePath,
  getChart: state => state.map.chart,
  getPolyline: state => state.map.polyline,
  getMovingMarker: state => state.map.movingMarker,
  getCurrentLatLngIndex: state => state.map.currentLatLngIndex,

  dict: state => state.dict.dict,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  topbarRouters: state => state.permission.topbarRouters,
  defaultRoutes: state => state.permission.defaultRoutes,
  sidebarRouters: state => state.permission.sidebarRouters,
}
export default getters
