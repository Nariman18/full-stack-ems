import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addEmployee,
  getEmployeeById,
  updateEmployee,
} from "../api/employee-services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { logEvent } from "@amplitude/analytics-browser";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." })
    .max(50, { message: "First name must be at most 50 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .max(50, { message: "Last name must be at most 50 characters." }),
  email: z
    .string()
    .min(2, { message: "Email must be at least 5 characters." })
    .max(50, { message: "Email must be at most 50 characters." })
    .email({ message: "Invalid email address." }),
});

function AddEmployee() {
  const navigation = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const { data: employee } = useQuery({
    queryKey: ["employee"],
    queryFn: () => getEmployeeById(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (employee) {
      form.reset({
        firstName: employee.data.firstName,
        lastName: employee.data.lastName,
        email: employee.data.email,
      });
    }
  }, [employee, form]);

  const addMutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["addEmployee"] });
      form.reset();
      toast.success("Employee added successfully!");
      navigation("/");
    },
    onError: () => {
      toast.error("Something went wrong and submission failed!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["updateEmployee"] });
      form.reset();
      toast.success("Employee updated successfully!");
      navigation("/");
    },
    onError: () => {
      toast.error("Something went wrong and update employee failed!");
    },
  });

  return (
    <div className="min-w-full">
      <h1 className="text-center text-4xl font-semibold mb-5 p-5">
        {id ? "Update Employee" : "Add Employee"}
      </h1>
      <div className="flex flex-col items-center justify-center mt-28">
        <div className="border-2 rounded-3xl p-10">
          <Form {...form}>
            <form
              className="space-y-5"
              onSubmit={form.handleSubmit((values) => {
                if (id) {
                  updateMutation.mutate({ id: Number(id), ...values });
                  logEvent("Updated_Employee", { id: Number(id), ...values });
                } else {
                  addMutation.mutate(values);
                  logEvent("Added_Employee", values);
                }
              })}
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name:</FormLabel>
                    <FormControl>
                      <Input
                        className="w-[250px]"
                        type="text"
                        placeholder="First Name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name:</FormLabel>
                    <FormControl>
                      <Input
                        className="w-[250px]"
                        type="text"
                        placeholder="Last Name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input
                        className="w-[250px]"
                        type="email"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="cursor-pointer" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </div>
        <button
          className="p-3 bg-none border-none hover:underline  underline-offset-5 cursor-pointer"
          onClick={() => {
            navigation("/");
            logEvent("Home_Click", {
              button_name: "Home page",
            });
          }}
        >
          Home page
        </button>
      </div>
    </div>
  );
}

export default AddEmployee;
