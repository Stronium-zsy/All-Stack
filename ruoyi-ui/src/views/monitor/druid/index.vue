<template>
  <div class="container">
    <div id="container">
      <div id="searchcard">
        <div id="title">数据统计面板</div>
        <form @submit.prevent="fetchData" id="search-form">
          <div class="form-group">
            <label>数据统计开始日期:</label>
            <input type="datetime-local" v-model="startTime" class="datetime-local" required>
          </div>
          <div class="form-group">
            <label>数据统计结束日期:</label>
            <input type="datetime-local" v-model="endTime" class="datetime-local" required>
          </div>
          <div class="form-group">
            <label>平均速度前N的传感器ID:</label>
            <input type="number" v-model.number="topNSensors">
          </div>
          <div class="form-group">
            <label>平均速度后N的传感器ID:</label>
            <input type="number" v-model.number="bottomNSensors">
          </div>
          <div class="form-group">
            <label>平均速度前N的街道名称:</label>
            <input type="number" v-model.number="topNStreets">
          </div>
          <div class="form-group">
            <label>平均速度后N的街道名称:</label>
            <input type="number" v-model.number="bottomNStreets">
          </div>
          <div class="form-group">
            <label>传感器ID:</label>
            <input type="text" v-model="sensorid" placeholder="Sensor ID">
          </div>
          <div class="form-group">
            <label>街道名称:</label>
            <input type="text" v-model="street" placeholder="Street">
          </div>
          <button type="submit" id="submit-button">统计数据</button>
        </form>
      </div>

      <div class="images-card" v-if="images.length">
        <div v-for="(image, index) in images" :key="index" class="result-image-container">
          <img :src="image.src" :alt="image.alt" class="result-image">
          <p>{{ image.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      startTime: '2024-01-01T00:00',
      endTime: '2024-01-01T00:00',
      topNSensors: null,
      bottomNSensors: null,
      topNStreets: null,
      bottomNStreets: null,
      sensorid: '',
      street: '',
      images: [],
    };
  },
  methods: {
    roundMinutesToNearest5(datetime) {
      let dateStr = datetime.replace('T', ' ');

      let [datePart, timePart] = dateStr.split(' ');

      let [hours, minutes] = timePart.split(':').map(Number);

      let roundedMinutes = Math.round(minutes / 5) * 5;

      if (roundedMinutes === 60) {
        roundedMinutes = 0;
        hours += 1;
        if (hours === 24) {
          hours = 0;
          let [year, month, day] = datePart.split('-').map(Number);
          day += 1;
          if (day > 30) {
            day = 1;
            month += 1;
            if (month > 12) {
              month = 1;
              year += 1;
            }
          }
          datePart = `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        }
      }

      let newTimePart = `${hours.toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`;

      return `${datePart} ${newTimePart}`;
    },
    async fetchData() {
      this.images = [];
      if (this.topNSensors) {
        await this.fetchTopSensors();
      }
      if (this.bottomNSensors) {
        await this.fetchBottomSensors();
      }
      if (this.topNStreets) {
        await this.fetchTopStreets();
      }
      if (this.bottomNStreets) {
        await this.fetchBottomStreets();
      }
      if (this.sensorid) {
        await this.fetchSensorSpeed();
      }
      if (this.street) {
        await this.fetchStreetSpeed();
      }
    },
    async fetchTopSensors() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/avg_top_sensors', {
          params: {
            start_time: this.roundMinutesToNearest5(this.startTime),
            end_time: this.roundMinutesToNearest5(this.endTime),
            n: this.topNSensors
          },
          responseType: 'blob'
        });
        this.images.push({ src: URL.createObjectURL(response.data), alt: 'Top Sensors', title: 'Top Sensors' });
      } catch (error) {
        console.error('Error fetching top sensors:', error);
      }
    },
    async fetchBottomSensors() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/avg_bottom_sensors', {
          params: {
            start_time: this.roundMinutesToNearest5(this.startTime),
            end_time: this.roundMinutesToNearest5(this.endTime),
            n: this.bottomNSensors
          },
          responseType: 'blob'
        });
        this.images.push({ src: URL.createObjectURL(response.data), alt: 'Bottom Sensors', title: 'Bottom Sensors' });
      } catch (error) {
        console.error('Error fetching bottom sensors:', error);
      }
    },
    async fetchTopStreets() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/max_top_street', {
          params: {
            timestep: this.roundMinutesToNearest5(this.startTime),
            n: this.topNStreets
          },
          responseType: 'blob'
        });
        this.images.push({ src: URL.createObjectURL(response.data), alt: 'Top Streets', title: 'Top Streets' });
      } catch (error) {
        console.error('Error fetching top streets:', error);
      }
    },
    async fetchBottomStreets() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/min_bottom_street', {
          params: {
            timestep: this.roundMinutesToNearest5(this.startTime),
            n: this.bottomNStreets
          },
          responseType: 'blob'
        });
        this.images.push({ src: URL.createObjectURL(response.data), alt: 'Bottom Streets', title: 'Bottom Streets' });
      } catch (error) {
        console.error('Error fetching bottom streets:', error);
      }
    },
    async fetchSensorSpeed() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/plot_sensor_speed', {
          params: {
            sensorid: this.sensorid,
            start_time: this.roundMinutesToNearest5(this.startTime),
            end_time: this.roundMinutesToNearest5(this.endTime)
          },
          responseType: 'blob'
        });
        this.images.push({ src: URL.createObjectURL(response.data), alt: 'Sensor Speed', title: 'Sensor Speed' });
      } catch (error) {
        console.error('Error fetching sensor speed:', error);
      }
    },
    async fetchStreetSpeed() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/plot_street_speed', {
          params: {
            street: this.street,
            start_time: this.roundMinutesToNearest5(this.startTime),
            end_time: this.roundMinutesToNearest5(this.endTime)
          },
          responseType: 'blob'
        });
        this.images.push({ src: URL.createObjectURL(response.data), alt: 'Street Speed', title: 'Street Speed' });
      } catch (error) {
        console.error('Error fetching street speed:', error);
      }
    },
  }
};
</script>

<style scoped>
.container {
  max-width: 100%;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  background-color: #242424;
  color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 0;

}
.form-group {
  margin-top: 30px;
}
.images-card {
  flex: 2;
  background-color: #242424;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  max-height: 1000px;
}

.form-card form {
  display: flex;
  flex-direction: column;
  width: 400px;
}

.form-card .form-group {
  display: flex;
  flex-direction: column;
}

.form-card label {
  margin-bottom: 5px;
  color: #bbb;
}

.form-card input {
  border: none;
  border-radius: 4px;
  background-color: #3a3f47;
  color: #fff;
  margin-bottom: 20px;
}

.datetime-local {
  padding: 6px;
  font-size: 14px;
  border: 1px solid white;
  border-radius: 4px;
  background-color: transparent;
  color: white;
  margin-bottom: 20px;
  -webkit-appearance: none; /* 移除浏览器默认样式 (Webkit) */
  -moz-appearance: none; /* 移除浏览器默认样式 (Mozilla) */
  appearance: none; /* 移除浏览器默认样式 */
}

.datetime-local::-webkit-calendar-picker-indicator {
  filter: invert(1); /* 反转颜色，使图标与背景对比更明显 */
}

.form-card button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-card button:hover {
  background-color: #0056b3;
}

.result-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.result-image {
  max-width: 100%;
  margin-top: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

#container {
  width: 1500px;
  height: 100%;
  background-color: transparent;
  padding: 0;
  display: flex;
  flex-direction: row;
}

#searchcard {
  width: 400px;
  border: 2px white groove;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  overflow: scroll;
  height: 900px;
  max-height: 100%;
  border-right: 1px #ccc dashed;
}
.form-group {
  transform: translateX(20px);
  width: 350px;
}
#title {
  color: white;
  font-size: 20px;
  font-weight: 600;
  margin-top: 30px;
  margin-left: 20px;
}
input {
  width: 335px;
  height: 30px;
  background-color: transparent;
  border: 0 solid transparent;
  border-bottom: 2px solid white;
  color: white;
  font-size: 15px;
}
.departureResults > li,
.destinationResults > li {
  height: 50px;
  transition: border-color 0.3s ease;
  border-radius: 3px;
  line-height: 50px;
  color: #ccc;
  width: 340px;
  background-color: transparent;
  border: none;
  list-style-type: none;
}

.departureResults > li:hover,
.destinationResults > li:hover {
  background-color: #383838;
  color: white;
  border-radius: 0;
}

#submit-button:hover {
  background-color: #CCCCCC;
  color: black;
}
#submit-button {
  width: 250px;
  height: 40px;
  background-color: transparent;
  border: 1px solid #CCCCCC;
  color: gray;
  margin-right: 20px;
  margin-top: 30px;
  border-radius: 0 5px 0 5px;
  margin-left: 20px;
}
</style>
