"use client";
import { patientApi, useAddPatientMutation } from "@/api/patient";
import DashboardLayout from "@/app/_layout/DashboardLayout";
import { useAppDispatch, useAppSelector } from "@/config/store";
import { Patient } from "@/types/patient";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AltArrowLeft as LeftIcon } from "solar-icon-set";

const AddPatient = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [addPatient, { isLoading }] = useAddPatientMutation();
  const [successToast, setSuccessToast] = useState(false);

  const patientId = `${nanoid(10)}`;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<Patient>();

  const handleAddPatient: SubmitHandler<Patient> = async (data) => {
    const _values: string[] = [];
    _values.push(patientId);
    _values.push(data.first_name);
    _values.push(data.last_name);
    _values.push(data.address);
    _values.push(data.email);
    _values.push(data.phone);
    _values.push(data.physician_id);
    _values.push(data.physician_first_name);
    _values.push(data.physician_last_name);
    _values.push(data.physician_phone);
    _values.push(data.physician_bill);
    _values.push(data.prescription);
    _values.push(data.dose);
    _values.push(data.visit_date);
    _values.push(data.next_visit);

    try {
      await addPatient({
        range: "patient!A:O",
        sheetId: user.sheetId,
        values: [_values],
      }).unwrap();
      dispatch(patientApi.util.invalidateTags(["Patients"]));
      reset();
      setSuccessToast(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex gap-2 items-center mb-4">
        <Link href="/dashboard">
          <IconButton>
            <LeftIcon size={24} />
          </IconButton>
        </Link>

        <h1 className="text-xl font-medium ">Add patient</h1>
      </div>

      <div className="bg-white w-full rounded-xl border p-5 mb-20">
        <form onSubmit={handleSubmit(handleAddPatient)}>
          <div className="flex gap-10 md:flex-row flex-col ">
            <div className="md:w-1/2">
              <h3 className="mb-6 text-gray-600 font-medium border-b pb-1">
                Patient detail
              </h3>
              <div className="flex flex-col gap-5">
                <TextField
                  label="Patient ID"
                  value={patientId}
                  disabled
                  {...(register("id"), { required: true })}
                />
                <div className="w-full flex gap-4 items-center">
                  <TextField
                    className="w-full"
                    label="First name"
                    {...register("first_name", {
                      required: true,
                    })}
                  />
                  <TextField
                    className="w-full"
                    label="Last name"
                    {...register("last_name", {
                      required: true,
                    })}
                  />
                </div>
                <div className="w-full flex gap-4 items-center">
                  <TextField
                    className="w-full"
                    label="Phone"
                    {...register("phone", {
                      required: true,
                    })}
                  />
                  <TextField
                    className="w-full"
                    label="Email"
                    {...register("email")}
                  />
                </div>
                <TextField
                  label="Address"
                  multiline
                  rows={3}
                  {...register("address", {
                    required: true,
                  })}
                />
              </div>
            </div>
            <div className="md:w-1/2 bg-green-100 p-4 rounded-xl">
              <h3 className="mb-6 text-gray-600 font-medium border-b pb-1">
                Physician detail
              </h3>
              <div className="flex flex-col gap-5">
                <TextField
                  label="Physician ID"
                  {...register("physician_id", {
                    required: true,
                  })}
                />
                <div className="w-full flex gap-4 items-center">
                  <TextField
                    className="w-full "
                    label="First name"
                    {...register("physician_first_name", {
                      required: true,
                    })}
                  />
                  <TextField
                    className="w-full"
                    label="Last name"
                    {...register("physician_last_name", {
                      required: true,
                    })}
                  />
                </div>
                <div className="w-full flex gap-4 items-center">
                  <TextField
                    className="w-full"
                    label="Phone"
                    {...register("physician_phone")}
                  />
                  <TextField
                    className="w-full"
                    label="Bill"
                    {...register("physician_bill")}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h3 className="mb-6 text-gray-600 font-medium border-b pb-1">
              Prescriptions
            </h3>
            <div className="flex flex-col gap-5">
              <div className="w-full flex gap-4 items-center">
                <TextField
                  className="w-full"
                  label="Prescription"
                  {...register("prescription", {
                    required: true,
                  })}
                />
                <TextField
                  className="w-full"
                  label="Dose"
                  {...register("dose", {
                    required: true,
                  })}
                />
              </div>
              <div className="w-full flex gap-4 items-center">
                <TextField
                  type="date"
                  className="w-full"
                  label="Visit date"
                  {...register("visit_date", {
                    required: true,
                  })}
                />
                <TextField
                  type="date"
                  className="w-full"
                  label="Next visit"
                  {...register("next_visit", {
                    required: true,
                  })}
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button
              disabled={isLoading}
              type="submit"
              size="large"
              variant="contained"
              className="rounded-xl normal-case bg-blue-600 shadow-sm font-normal hover:shadow-md mt-6 w-36"
            >
              {isLoading ? (
                <CircularProgress
                  style={{ width: "1.55rem", height: "1.55rem" }}
                />
              ) : (
                "Add"
              )}
            </Button>
          </div>
        </form>
      </div>
      <Snackbar
        open={successToast}
        autoHideDuration={6000}
        onClose={() => setSuccessToast(false)}
      >
        <Alert variant="filled" severity="success">
          Patient added
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default AddPatient;
