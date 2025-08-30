import api from '@/utils/axios.ts'
import type {AuthAuthorizeReq} from "@/api/auth/types.ts";
import type {AxiosResponse} from "axios";

export function authorize(data: AuthAuthorizeReq): Promise<AxiosResponse<string>> {
  return api({
    url: '/api/auth/authorize',
    method: 'post',
    data: data
  });
}

