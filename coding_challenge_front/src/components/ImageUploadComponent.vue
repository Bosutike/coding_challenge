<template>
  <div>
    <h2>Image upload</h2>
    <div class="buttons-container">
      <button :class="{ selected: state == 1 }" @click="state = 0">
        Upload File
      </button>
      <button :class="{ selected: state == 0 }" @click="state = 1">
        Add URL
      </button>
    </div>

    <form
      ref="formA"
      v-on:submit.prevent="onSubmit"
      v-on:submit="upload"
      v-if="state == 0"
    >
      <label>USER_ID</label><br />
      <input type="text" v-model="user_id" /><br />

      <br />
      <label>File upload</label><br />
      <input type="file" @change="onFileSelect" /><br />
      <label>Callback URL</label><br />
      <input type="text" v-model="callbackUrl" /><br />
      <input type="submit" value="Upload" />
    </form>

    <form
      ref="formB"
      v-on:submit.prevent="onSubmit"
      v-on:submit="upload"
      v-if="state == 1"
    >
      <label>USER_ID</label><br />
      <input type="text" v-model="user_id" /><br />

      <br />
      <label>URL</label><br />
      <input type="text" v-model="file" /><br />
      <label>Callback URL</label><br />
      <input type="text" v-model="callbackUrl" /><br />
      <input type="submit" value="Upload" />
    </form>

    <!-- <img style="width: 200px" :src="imageSrc" />
    <p v-show="imageUploaded">Image uploaded with sucess!</p> -->
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ImageUpload",
  data() {
    return {
      user_id: null,
      file: null,
      callbackUrl: null,
      state: 0,
    };
  },
  methods: {
    onFileSelect(e) {
      const file = e.target.files[0];
      this.file = file;
    },
    async upload() {
      const formData = new FormData();
      formData.append("user_id", this.user_id);
      formData.append("file", this.file);
      formData.append("callbackUrl", this.callbackUrl);

      try {
        const resp = await axios.post("/api/submit-report", formData);

        if (resp.status !== 200) {
          return console.log("Error on upload!");
        }

        this.$refs.formA.reset();
        this.$refs.formB.reset();
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
.buttons-container {
  display: flex;
  width: 250px;
  justify-content: space-between;
  padding: 10px;
}

button {
  width: 100px;
  height: 60px;
  background-color: rgb(89, 89, 89);
}

.selected {
  background-color: rgb(255, 255, 255);
}
</style>
