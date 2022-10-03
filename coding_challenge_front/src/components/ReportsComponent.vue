<template>
  <div class="main-container">
    <h1>{{ name }}</h1>
    <div class="table-container">
      <table>
        <tr>
          <th v-for="column in reports.columns" :key="column">
            {{ column }}
          </th>
        </tr>
        <tr v-for="(row, index) in reports.rows" :key="index">
          <td
            v-for="(value, valueIndex) in reports.rows[index]"
            :key="valueIndex"
          >
            {{ value }}
          </td>
          <td>
            <button
              @click="
                $emit('onClickValidation', {
                  id: row.id,
                  updateTo: true,
                })
              "
            >
              {{ "Validate" }}
            </button>
            <button
              @click="
                $emit('onClickValidation', {
                  id: row.id,
                  updateTo: false,
                })
              "
            >
              {{ "Disprove" }}
            </button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReportsComponent",
  data() {
    return {};
  },
  props: {
    name: String,
    reports: Object,
  },
  created() {},
};
</script>

<style>
.main-container {
  display: block;
  width: 100%;
}

.table-container {
  display: flex;
  justify-content: center;
}

table {
  border-collapse: collapse;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
</style>
