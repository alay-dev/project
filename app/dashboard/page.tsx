"use client";

import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../_layout/DashboardLayout";
import { MinimalisticMagnifer as SearchIcon } from "solar-icon-set";
import {
  Tuning as SettingsIcon,
  UserPlusRounded as AddPatientIcon,
} from "solar-icon-set";
import { Button } from "@mui/material";
import Link from "next/link";
import PatientTable from "./_component/PatientTable";
import { Patient } from "@/types/patient";
import { useAppSelector } from "@/config/store";
import { useFetchPatientsQuery } from "@/api/patient";

const Dashboard = () => {
  const [query, setQuery] = useState("");
  // const [data, setData] = useState<any[]>([]);
  const user = useAppSelector((state) => state.user);
  const { data: patients } = useFetchPatientsQuery(
    { range: `${user.page}!A:O`, sheetId: user.sheetId },
    { skip: !user.accessToken }
  );

  const data = useMemo(() => {
    if (!patients) return [];
    let _data: Patient[];
    _data = patients?.map((item) => {
      return {
        id: item[0],
        first_name: item[1],
        last_name: item[2],
        address: item[3],
        email: item[4],
        phone: item[5],
        physician_id: item[6],
        physician_first_name: item[7],
        physician_last_name: item[8],
        physician_phone: item[9],
        physician_bill: item[10],
        prescription: item[11],
        dose: item[12],
        visit_date: item[13],
        next_visit: item[14],
      };
    });
    _data.shift();
    _data.reverse();

    return _data;
  }, [patients]);

  if (!user.sheetId || !user.page) {
    return (
      <DashboardLayout>
        <div className="w-full flex flex-col items-center justify-center pt-12">
          <img src="/images/noFiles.jpg" className="w-[25rem] mb-7" />
          <h2 className="text-2xl font-medium">No sheet selected.</h2>
          <p className="w-[50vw] text-center text-gray-500 text-sm mb-10">
            Please select a sheet
          </p>
          <Link href="/dashboard/select-file">
            <Button
              size="large"
              variant="outlined"
              className="rounded-xl normal-case  font-normal gap-1"
            >
              Select sheet
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full">
        <h1 className="text-xl font-medium mb-7">Patients</h1>
        <div className="bg-white w-full rounded-xl border p-2 md:p-5 ">
          <div className="flex items-center justify-between mb-5">
            <div className="flex h-12 bg-card items-center md:w-[25rem] w-full input-focus-visible rounded-xl z-20 pl-4 pr-2.5 border border-input text-body mr-2">
              <SearchIcon size={22} aria-label="Search" className="mb-0.5" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search patients"
                className="text-base bg-card focus-within:outline-none pl-3 pr-1.5 flex-1 text-foreground "
              />
              <button
                aria-label="Settings"
                className="hidden p-2 ml-auto transition-colors rounded-full hover:bg-accent/20"
              >
                <SettingsIcon size={22} />
              </button>
            </div>
            <Link href="/dashboard/add-patient">
              <Button
                size="large"
                variant="contained"
                className="rounded-xl normal-case bg-blue-600 shadow-sm font-normal hover:shadow-md"
              >
                <AddPatientIcon iconStyle="BoldDuotone" size={30} />
                <p className="md:block hidden ml-2">Add patient</p>
              </Button>
            </Link>
          </div>
          <div className="overflow-auto">
            <PatientTable data={data || []} query={query} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
