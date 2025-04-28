import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { deleteEmployee, listEmployee } from "../api/employee-services";
import { Employee } from "../types/employee";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logEvent } from "@amplitude/analytics-browser";

function HomeClient() {
  const queryClient = useQueryClient();
  const navigation = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee deleted successfully!");
    },
    onError: () => {
      toast.error("Something went wrong and deletion failed!");
    },
  });

  const {
    data: employee,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: listEmployee,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-10 font-semibold">
        Loading...
      </div>
    );
  }

  if (error)
    return (
      <div className="flex items-center justify-center mt-10 text-red-500 text-2xl">
        Something went wrong!
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-w-full">
      <div>
        <h1 className=" text-center text-4xl font-semibold mb-5 p-5">
          List of Employees
        </h1>

        <Button
          onClick={() => {
            logEvent("Button_Click", { button_name: "Add Employees" });
            navigation("/add-employee");
          }}
          className="mb-5 cursor-pointer"
        >
          Add Employees
        </Button>

        <div className="border p-3">
          <Table className="w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>FirstName</TableHead>
                <TableHead>LastName</TableHead>
                <TableHead>Email ID</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employee?.data.map((data: Employee) => (
                <TableRow key={data.id} className="">
                  <TableCell className="font-medium">{data.id}</TableCell>
                  <TableCell>{data.firstName}</TableCell>
                  <TableCell>{data.lastName}</TableCell>
                  <TableCell>{data.email}</TableCell>

                  <TableCell className="flex justify-center space-x-4">
                    <Button
                      className="cursor-pointer hover:bg-amber-200"
                      variant="secondary"
                      onClick={() => {
                        navigation(`/update-employee/${data.id}`);
                        logEvent("Edit_Click", {
                          button_name: "Edit Employees",
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      className="cursor-pointer hover:bg-amber-200"
                      variant="destructive"
                      onClick={() => {
                        deleteMutation.mutate(data.id);
                        logEvent("Delete_Click", {
                          button_name: "Delete Employees",
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div>
            <input type="search" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeClient;
