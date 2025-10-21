import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api", // mon backend Spring Boot
});

export default API;
