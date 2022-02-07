import StandardResponse from "../models/standardResponse.model";

const errorResponse = (status: number, message: string, data: any) => {
  const response: StandardResponse = {
    status,
    message,
    data,
  };
  return response;
};

export default errorResponse;
