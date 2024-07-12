<template>
  <div style="width:1800px;height:1000px;">
    <div id="map_cc7d1b7fb1ad09e0732bbbd940dd9c71"></div>
    <!-- 切换按钮 -->
    <div id="toggle_mode" class="toggle-mode-box">
      <button @click="toggleMode">{{ mode === 'speed' ? 'Switch to Flow' : 'Switch to Speed' }}</button>
    </div>
    <!-- 图标 -->
    <div :class="['timestamp-box', modeClass]" id="speed"></div>
    <div class="timestamp-box" id="LLM">

    </div>
    <!-- 搜索 -->
    <div id="search_bar" class="timestamp-box">
      <input type="text" v-model="searchQuery" placeholder="Enter Sensor ID or Street Name">
      <button @click="searchLocation">Search</button>
    </div>
    <!-- 时间和预测时长选择 -->
    <div id="predict_time_box" class="timestamp-box">
      <label for="selectedTime">Select Time:</label>
      <input type="datetime-local" v-model="selectedTime">

      <label for="forecastDuration">Forecast Duration:</label>
      <select v-model="forecastDuration">
        <option value="15min">15 minutes</option>
        <option value="30min">30 minutes</option>
        <option value="45min">45 minutes</option>
        <option value="60min">60 minutes</option>
      </select>
      <button @click="predictTraffic">Predict</button>
      <div id="result" style="margin-top: 10px;"></div>
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'font-awesome/css/font-awesome.min.css';
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'LeafletMap',
  data() {
    return {
      map: null,
      markers: [], // 保存标记和位置
      searchQuery: '', // 搜索查询
      mode: 'speed', // 初始模式为速度
      currentDateTime: '', // 当前时间
      selectedTime: '', // 选择的时间
      forecastDuration: '', // 预测时长
      sensorData: [] // 存储从后端获取的传感器数据
    };
  },
  computed: {
    ...mapState('predictMapData', {
      predictInitialMarkers: state => state.predictInitialMarkers
    }),
    modeClass() {
      return this.mode === 'speed' ? 'speed-mode' : 'flow-mode';
    }
  },
  mounted() {
    this.initMap();
    this.updateCurrentDateTime();
    // setInterval(this.updateCurrentDateTime, 1000); // 每秒更新一次时间
  },
  methods: {
    ...mapActions('predictMapData', ['predictUpdateSensorData', 'predictInitCurrentSpeeds']),

    toggleMode() {
      this.mode = this.mode === 'speed' ? 'flow' : 'speed';
      this.updateMarkers();
    },

    async predictTraffic() {
      console.log('Predict button clicked');
      const time = this.selectedTime || this.currentDateTime;
      const pretime = this.forecastDuration;
      console.log(`Selected time: ${time}, Forecast duration: ${pretime}`);

      // 格式化时间为 yyyy-mm-dd hh:mm:ss
      const formattedTime = new Date(time).toISOString().slice(0, 19).replace('T', ' ');
      console.log(`Formatted time: ${formattedTime}`);

      try {
        const response = await fetch(`http://127.0.0.1:5005/predict?hms=${formattedTime}&pretime=${pretime}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Error: ${errorData.error}`);
          return;
        }

        const data = await response.json();
        console.log('Successfully retrieved data:', data);

        // 解析 JSON 字符串数组为对象数组
        const parsedData = JSON.parse(data);
        console.log('Parsed data:', parsedData);

        this.updateMarkers(parsedData);
      } catch (error) {
        console.error("Error predicting traffic:", error);
        document.getElementById("result").textContent = `Error: ${error.message}`;
      }
    },

    updateSensorData(data) {
      this.predictUpdateSensorData(data);
    },

    updateMarkers(data) {
      console.log('Updating markers');
      // 清除现有标记
      this.markers.forEach(marker => {
        this.map.removeLayer(marker.markerInstance);
      });
      this.markers = [];
      //ok的
      // console.log(1111);

      console.log('Successfully data:', data);

      if (!Array.isArray(data)) {
        console.error('Expected data to be an array');
        return;
      }

      // 根据数据更新标记
      data.forEach(point => {
        const { sensor_id, lat, lon, speed, flow} = point;
        const value = this.mode === 'speed' ? speed : flow;
        console.log(2222);
        // 框内容
        const popupContent = `
          Sensor ID: ${sensor_id} <br>
          ${this.mode === 'speed' ? 'Speed' : 'Flow'}: ${value}
        `;

        console.log(122121);
        const marker = L.marker([lat, lon], {icon: this.createCustomIcon(value)})
          .addTo(this.map)
          .bindPopup(popupContent);

        this.markers.push({ sensor_id, markerInstance: marker });
      });
      console.log('Markers updated');
    },

    createCustomIcon(value) {
      let color = 'darkgreen'; // Default color
      if (this.mode === 'speed') {
        if (value < 35) color = 'rgb(234,67,53)';
        else if (value < 45) color = 'rgb(250,122,19)';
        else if (value < 50) color = 'rgb(251,188,5)';
        else if (value < 55) color = 'rgb(84,201,57)';
        else if (value < 60) color = 'rgb(52,168,83)';
        else if (value < 65) color = 'rgb(52,168,83)';
        else if (value < 70) color = 'rgb(36,108,55)';
      } else {
        if (value < 180) color = 'rgb(36,108,55)';
        else if (value < 210) color = 'rgb(52,168,83)';
        else if (value < 240) color = 'rgb(84,201,57)';
        else if (value < 270) color = 'rgb(251,188,5)';
        else if (value < 300) color = 'rgb(250,122,19)';
        else if (value < 330) color = 'rgb(250,122,19)';
        else color = 'rgb(234,67,53)';
      }

      return L.divIcon({
        html: `<i class="fa fa-map-marker fa-2x" style="color:${color};"></i>`,
        iconSize: [20, 20],
        className: 'custom-div-icon'
      });
    },

    updateCurrentDateTime() {
      const now = new Date();
      this.currentDateTime = now.toISOString().substring(0, 19).replace('T', ' '); // YYYY-MM-DD HH:MM:SS
    },

    searchLocation() {
      const query = this.searchQuery.trim().toLowerCase();
      if (!query) return;

      // 根据传感器ID查找
      let found = false;
      for (let marker of this.markers) {
        if (marker.sensor_id.toString() === query) {
          this.map.setView(marker.markerInstance.getLatLng(), 15);
          marker.markerInstance.openPopup();
          found = true;
          break;
        }
      }

      if (found) return;

      // 根据街道名查找
      for (let street in this.streetAverages) {
        if (street.toLowerCase().includes(query)) {
          const streetMarkers = this.markers.filter(marker => this.getStreetNameForSensor(marker.sensor_id).toLowerCase().includes(query));
          if (streetMarkers.length > 0) {
            this.map.setView(streetMarkers[0].markerInstance.getLatLng(), 15);
            streetMarkers.forEach(marker => marker.markerInstance.openPopup());
            break;
          }
        }
      }
    },
    getStreetNameForSensor(sensor_id) {
      for (let street in this.streetAverages) {
        if (this.streetAverages[street].includes(sensor_id)) {
          return street;
        }
      }
      return '';
    },

    initMap() {
      this.map = L.map('map_cc7d1b7fb1ad09e0732bbbd940dd9c71', {
        center: [37.344741424615385, -121.94008344615385],
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        detectRetina: false,
        maxNativeZoom: 19,
        maxZoom: 19,
        minZoom: 0,
        noWrap: false,
        opacity: 1,
        subdomains: 'abc',
        tms: false,
      }).addTo(this.map);

      // 初始化初始标记
      this.predictInitialMarkers.forEach(marker => {
        const {sensor_id, position, content, speed} = marker;
        const popup = L.popup({maxWidth: '100%'}).setContent(`<div style="width: 100%; height: 100%;">${content}</div>`);
        const markerInstance = L.marker(position, {icon: this.createCustomIcon(speed)}).addTo(this.map).bindPopup(popup);
        this.markers.push({sensor_id: sensor_id, position, content, markerInstance});
      });
    },
  },
  watch: {
    sensorData: 'updateMarkers'
  }
};
</script>

<style scoped>
#map_cc7d1b7fb1ad09e0732bbbd940dd9c71 {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: black;
  left: 0;
  top: 0;
}
#LLM{
  width:310px;
  height:800px;
  transform:translate(1000px,0);
}
.timestamp-box {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  z-index: 1000;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: pulse 2s infinite;
}

.speed-mode {
  background-image: url('/speed.png');
}

.flow-mode {
  background-image: url('/flow.png');
}

#toggle_mode {
  position: absolute;
  top: 20px;
  left: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  z-index: 1100; /* 确保切换按钮在最上层 */
  text-align: center;
}

#toggle_mode button {
  padding: 20px 100px;
  background-color: rgba(0, 86, 179, 0.9);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

#toggle_mode button:hover {
  background-color: rgba(0, 86, 179, 0.9);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.4);
  }
}

.custom-div-icon .custom-icon {
  text-shadow: 0 0 2px #000; /* 添加阴影效果 */
}

#search_bar {
  width: 310px;
  height: 200px; /* 增加高度以适应按钮 */
  transform: translate(5px, 460px);
  display: flex;
  flex-direction: column; /* 将子元素按列排列 */
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
}

#search_bar input {
  width: 260px;
  height: 60px;
  padding: 10px;
  margin-bottom: 10px; /* 增加一些底部空间以便按钮与输入框分开 */
  border: none;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease;
}


#search_bar input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

#search_bar input:focus {
  background-color: rgba(255, 255, 255, 0.2);
  outline: none;
}

#speed {
  width: 310px;
  height: 70px;
  transform: translate(1150px, 0px);

  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

#search_bar button {
  width: 260px; /* 与输入框宽度一致 */
  padding: 5px 10px;
  background-color: rgba(0, 86, 179, 0.9);
  color: white;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  border: none;
  height: 45px;
}

#predict_time_box {
  position: absolute;
  top: 110px;
  left: 10px;
  width: 310px;
  height: 330px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  z-index: 1100;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

#predict_time_box label {
  display: block;
  margin-bottom: 15px;
}

#predict_time_box input,
#predict_time_box select {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease;
}

#predict_time_box select option {
  background-color: #ffffff; /* 设置选项的背景颜色为浅灰色 */
  color: black; /* 设置选项文字颜色为黑色 */
}

#predict_time_box input:focus,
#predict_time_box select:focus {
  background-color: rgba(255, 255, 255, 0.2);
  outline: none;
}

#predict_time_box button {
  width: 100%; /* 设置按钮宽度为100% */
  padding: 10px;
  background-color: rgba(0, 86, 179, 0.9);
  color: white;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  border: none;
  margin-top: 20px; /* 添加顶部间距 */
}

#predict_time_box button:hover {
  background-color: rgba(0, 86, 179, 0.9);
}
</style>
