module.exports = {
  development: {
    url:
      process.env.DEV_URL ||
      "postgres://postgres:postgres@127.0.0.1:5432/postgres",
  },
  docker: {
    url:
      process.env.DOCKER_DB_URL ||
      "postgres://postgres:postgres@host.docker.internal:5555/postgres",
  },
};
