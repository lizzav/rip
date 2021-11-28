import axios from "axios";

const $host = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const GetAll = async () => {
  const { data } = await $host.get("api/tasks");
  return data;
};

export const Create = async (name) => {
  const { data } = await $host.post("api/tasks", name);
  return data;
};

export const GetOne = async () => {};

export const Delete = async (id) => {
  const { data } = await $host.delete(`api/tasks`,{data: id});
  return data;
};

export const Update = async (params) => {
  const { data } = await $host.put(`api/tasks`,params);
  return data;
};
