<template>
  <ImageUpload />
  <div class="lists-container">
    <Reports
      name="Evaluation Completed"
      :reports="completedEvaluation"
      @onClickValidation="validateReport"
    />
    <Reports
      name="Evaluation Not Completed"
      :reports="notCompletedEvaluation"
      @onClickValidation="validateReport"
    />
  </div>
</template>

<script>
import ImageUpload from "../components/ImageUploadComponent.vue";
import Reports from "../components/ReportsComponent.vue";
import axios from "axios";

export default {
  name: "BackofficeDashboard",
  data() {
    return {
      completedEvaluation: { columns: [], rows: [] },
      notCompletedEvaluation: { columns: [], rows: [] },
    };
  },
  components: {
    ImageUpload,
    Reports,
  },
  async created() {
    this.updateView();
  },
  methods: {
    async updateView() {
      this.completedEvaluation = await this.getCompletedReports();
      this.notCompletedEvaluation = await this.getNotCompletedEvaluation();
    },
    getCompletedReports() {
      return axios
        .get("/api/get-completed-reports")
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getNotCompletedEvaluation() {
      return axios
        .get("/api/get-not-completed-reports")
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    validateReport(data) {
      axios
        .post("/api/report-approval", {
          reportId: data.id,
          isApproved: data.updateTo,
        })
        .then((res) => {
          this.updateView();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.lists-container {
  width: 100%;
  display: flex;
}
</style>
