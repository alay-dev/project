"use client";
import {
  File,
  useFetchFilesQuery,
  useFetchSheetDetailMutation,
} from "@/api/files";
import { patientApi, useLazyFetchPatientsQuery } from "@/api/patient";
import DashboardLayout from "@/app/_layout/DashboardLayout";
import { GOOGLE_AUTH_URL } from "@/config/google";
import { useAppDispatch, useAppSelector } from "@/config/store";
import { cn } from "@/lib/utils";
import { setPage, setSheetId } from "@/slices/user";
import {
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Skeleton,
  TextField,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useEffect, useMemo, useState } from "react";
import {
  CloseCircle,
  MinimalisticMagnifer as SearchIcon,
} from "solar-icon-set";
import { Tuning as SettingsIcon, CheckCircle } from "solar-icon-set";

const SelectFile = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [fileCompatible, setFileCompatible] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const user = useAppSelector((state) => state.user);
  const [selectedSheet, setSelectedSheet] = useState<{
    id: string;
    name: string;
    mimeType: string;
    kind: string;
  } | null>(null);

  const {
    data: files,
    isLoading: filesLoading,
    isFetching: filesfetching,
    isError,
    error: fetchFilesError,
  } = useFetchFilesQuery(user.accessToken, {
    skip: !user.accessToken,
  });
  const [fetchPatient, { isFetching: compatibleFetching }] =
    useLazyFetchPatientsQuery();

  const [
    fetchSheetDetail,
    {
      isLoading: fetchSheetDetailLoading,
      data: sheetDetail,
      error: sheetDetailError,
    },
  ] = useFetchSheetDetailMutation();

  const initializeSheetDetail = async () => {
    const _file = files?.files.find((item) => item.id === user.sheetId);

    if (_file) {
      await fetchSheetDetail({ sheetId: user.sheetId }).unwrap();

      setSelectedSheet(_file);
      setSelectedPage(user.page);
      console.log(user.page, _file);
      checkPage(user.page, _file.id);
    }
  };

  useEffect(() => {
    if (user.page && user.sheetId) {
      initializeSheetDetail();
    }
  }, [files, user.page, user.sheetId]);

  useEffect(() => {
    if (fetchFilesError || sheetDetailError) {
      sessionStorage.removeItem("bhumio_access_token");
      window.location.reload();
    }
  }, [fetchFilesError, sheetDetailError]);

  const checkPage = async (page: string, sheetId: string) => {
    if (!page || !sheetId) return;
    try {
      const data = await fetchPatient({
        range: `${page}!A:O`,
        sheetId: sheetId,
      }).unwrap();

      const firstRow = data?.at(0);
      if (
        firstRow?.at(0) === "id" &&
        firstRow?.at(1) === "first_name" &&
        firstRow?.at(2) === "last_name" &&
        firstRow?.at(3) === "address" &&
        firstRow?.at(4) === "email" &&
        firstRow?.at(5) === "phone" &&
        firstRow?.at(6) === "physician_id" &&
        firstRow?.at(7) === "physician_first_name" &&
        firstRow?.at(8) === "physician_last_name" &&
        firstRow?.at(9) === "physician_phone" &&
        firstRow?.at(10) === "bill" &&
        firstRow?.at(11) === "prescription" &&
        firstRow?.at(12) === "dose" &&
        firstRow?.at(13) === "visit_date" &&
        firstRow?.at(14) === "next_visit"
      ) {
        setFileCompatible(true);
      } else {
        setFileCompatible(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePageChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setFileCompatible(true);
    setSelectedPage(e.target.value);
    await checkPage(e.target.value, selectedSheet?.id!);
  };

  const handleSaveSheet = () => {
    if (compatibleFetching) return;
    dispatch(setPage(selectedPage));

    dispatch(setSheetId(selectedSheet?.id));
    dispatch(patientApi.util.invalidateTags(["Patients"]));
    router.push("/dashboard");
  };

  const handleSheetChange = async (file: File) => {
    setSelectedSheet(file);
    const data = await fetchSheetDetail({ sheetId: file.id }).unwrap();
    checkPage(data?.sheets?.at(0)?.properties?.title!, file.id);
    setSelectedPage(data?.sheets?.at(0)?.properties?.title!);
  };

  const filteredFiles = useMemo(() => {
    if (!files) return [];
    if (query === "") return files?.files;
    return files?.files.filter((file) =>
      file.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, files]);

  if (filesLoading || filesfetching) {
    return (
      <DashboardLayout>
        <div className="w-full flex justify-center">
          <CircularProgress />
        </div>
      </DashboardLayout>
    );
  }

  if (!filesLoading && !filesfetching && !files?.files?.length) {
    return (
      <DashboardLayout>
        <div className="w-full flex flex-col items-center justify-center pt-12">
          <img src="/images/noFiles.jpg" className="w-[25rem] mb-7" />
          <h2 className="text-2xl font-medium">No files found</h2>
          <p className="w-[50vw] text-center text-gray-500 text-sm mb-10">
            Oops, no files found in your drive. This could be because you didnt
            provided all the permission or some other issue. Please try again
          </p>
          <Link href={GOOGLE_AUTH_URL}>
            <Button
              size="large"
              variant="outlined"
              className="rounded-xl normal-case  font-normal gap-1"
              startIcon={
                <img src="/images/googleLogo.svg" className="w-6 h-6" />
              }
            >
              Change google acount
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-xl font-medium ">Your files</h1>
      <p className="text-gray-400 text-sm mb-7">
        Select your file your want to use for saving/updating patient details
      </p>
      <div className="bg-white w-full rounded-xl border p-5 mb-8">
        <div className="mb-5">
          <div className="flex h-12 bg-card items-center w-full max-w-sm input-focus-visible rounded-xl z-20 pl-4 pr-2.5 border border-input text-body">
            <SearchIcon size={22} aria-label="Search" className="mb-0.5" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search file"
              className="text-base bg-card focus-within:outline-none pl-3 pr-1.5 flex-1 text-foreground"
            />
            <button
              aria-label="Settings"
              className="hidden p-2 ml-auto transition-colors rounded-full hover:bg-accent/20"
            >
              <SettingsIcon size={22} />
            </button>
          </div>
        </div>
        {selectedSheet && (
          <div className="my-4 w-full bg-blue-50  px-2 md:px-8 mb-8 py-5 rounded-xl flex flex-col md:flex-row justify-between md:items-center overflow-hidden">
            <div>
              <h3 className="text-gray-600 text-sm ">Your selected sheet</h3>
              <div className="flex gap-3 items-center mt-4">
                <img src="/images/sheets.png" className="w-16 " />
                <div>
                  <p>{selectedSheet?.name}</p>
                  <span className="text-gray-500 text-xs md:inline hidden">
                    {selectedSheet?.id}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 md:mt-0 mt-4 items-center">
              {fetchSheetDetailLoading ? (
                <>
                  <CircularProgress
                    style={{ width: "1.5rem", height: "1.5rem" }}
                    className="text-gray-500"
                  />
                  <p className="text-gray-500 text-sm">
                    Collecting your spreadsheet details
                  </p>
                </>
              ) : (
                <div>
                  <div className="flex md:flex-row flex-col gap-2 items-start">
                    <TextField
                      value={selectedPage}
                      select
                      className="min-w-[15rem]"
                      size="small"
                      helperText={
                        compatibleFetching
                          ? "Checking..."
                          : fileCompatible
                          ? "Sheet is compatible"
                          : "Sheet is not compatible"
                      }
                      error={!fileCompatible}
                      onChange={handlePageChange}
                    >
                      {sheetDetail?.sheets?.map((sheet) => {
                        return (
                          <MenuItem
                            key={sheet.properties.index}
                            value={sheet.properties.title}
                          >
                            {sheet.properties.title}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                    <Tooltip
                      title={
                        <div>
                          <p className="text-md">
                            {!fileCompatible
                              ? "Continue anyway"
                              : "Continue with this sheet"}
                          </p>
                        </div>
                      }
                    >
                      <Button
                        color={fileCompatible ? "primary" : "error"}
                        variant="outlined"
                        onClick={handleSaveSheet}
                      >
                        {compatibleFetching && (
                          <CircularProgress
                            style={{ width: "1.55rem", height: "1.55rem" }}
                            className="text-gray-500"
                          />
                        )}
                        {fileCompatible && !compatibleFetching && (
                          <CheckCircle
                            iconStyle="Bold"
                            size={25}
                            color="#1565C0"
                          />
                        )}
                        {!fileCompatible && !compatibleFetching && (
                          <CloseCircle
                            iconStyle="Bold"
                            size={25}
                            color="#D84315"
                          />
                        )}
                        <p className="ml-2">Continue</p>
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="grid sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredFiles.map((file) => {
            return (
              <div
                key={file.id}
                className={cn(
                  "border p-4 rounded-lg flex items-center gap-3 relative cursor-pointer",
                  selectedSheet?.id === file.id && "border-blue-400 shadow-md"
                )}
                onClick={() => handleSheetChange(file)}
              >
                {selectedSheet?.id === file.id && (
                  <div className="absolute top-0 right-0 translate-x-2 -translate-y-2 ">
                    <CheckCircle
                      size={20}
                      iconStyle="Bold"
                      color="#1976D2"
                      className="bg-white"
                    />
                  </div>
                )}
                <img src="/images/sheets.png" className="w-12 " />
                <div>
                  <p className="m-0 line-clamp-2"> {file.name}</p>
                  <span className="text-gray-400 text-sm m-0">spreadsheet</span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-gray-500 text-sm text-center mt-8">
          * Note we are showing only the spreadsheet that you own. We dont
          support other files.✌️
        </p>
      </div>
    </DashboardLayout>
  );
};

export default SelectFile;
