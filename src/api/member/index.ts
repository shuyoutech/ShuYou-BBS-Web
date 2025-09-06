import type {AxiosResponse} from "axios"
import type {MemberBindMobileBo, MemberBindThirdPartyBo, MemberUserVo} from "@/api/member/types.ts"
import api from "@/utils/axios.ts"

/**
 * 会员管理-获取个人信息
 */
export function memberGetProfileApi(): Promise<AxiosResponse<MemberUserVo>> {
  return api({
    url: '/member/user/get-profile',
    method: 'post',
  });
}

/**
 * 会员管理-绑定第三方用户
 */
export function memberBindThirdPartyApi(data: MemberBindThirdPartyBo): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/member/user/bind-third-party',
    method: 'post',
    data: data,
  });
}

/**
 * 会员管理-绑定手机号
 */
export function memberBindMobileApi(data: MemberBindMobileBo): Promise<AxiosResponse<boolean>> {
  return api({
    url: '/member/user/bind-mobile',
    method: 'post',
    data: data,
  });
}
