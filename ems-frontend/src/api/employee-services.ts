import axios, { AxiosResponse } from "axios";
import { Employee } from "../types/employee";

const BaseUrl = "http://localhost:8080/api/employees";

export const listEmployee = (): Promise<AxiosResponse<Employee[]>> => {
  return axios.get(BaseUrl);
};

export const addEmployee = (
  employee: Omit<Employee, "id">
): Promise<AxiosResponse<Employee>> => {
  return axios.post(BaseUrl, employee);
};

export const updateEmployee = (
  employee: Employee
): Promise<AxiosResponse<Employee>> => {
  return axios.put(`${BaseUrl}/${employee.id}`, employee);
};
export const getEmployeeById = (
  id: number
): Promise<AxiosResponse<Employee>> => {
  return axios.get(`${BaseUrl}/${id}`);
};
export const deleteEmployee = (
  id: number
): Promise<AxiosResponse<Employee>> => {
  return axios.delete(`${BaseUrl}/${id}`);
};
