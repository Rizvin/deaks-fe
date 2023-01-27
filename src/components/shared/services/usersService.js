import axios from "axios";

export const getUsersList = (params) => {
  console.log("data")
  return axios.get("/users", {
    params,
  });
};

export const getUsersCount = (params) => {
  return axios.get("/usersCount", {
    params,
  });
};

export const getUsersInfo = (id) => {
  return axios.get("/getUserInfoAdmin", {
    params: {
      userId: id,
    },
  });
};

export const getUpdateUserInfo = (params) => {
  return axios.patch("/updateUserInfo", {
    params,
  });
};

export const deleteUserId = (userId) => {
  return axios.post("/deleteUserId", { userId });
};

export const activateUser = (data) => {
  return axios.patch("/activateUser", data);
};

export const findManyUsers = (users) => {
  return axios.post("/findManyUsers", users);
};
