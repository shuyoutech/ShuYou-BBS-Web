import api from '@/utils/axios.ts'
import type {PayPrepayBo, PayPrepayVo, PayWalletVo, QueryOrderBo, QueryOrderVo} from "@/api/pay/types.ts";
import type {AxiosResponse} from "axios";

/**
 * 支付管理-支付下单
 */
export function payPrepayApi(data: PayPrepayBo):  Promise<AxiosResponse<PayPrepayVo>> {
  return api({
    url: '/pay/prepay',
    method: 'post',
    data: data,
  });
}

/**
 * 支付管理-查询订单
 */
export function payQueryOrderApi(data: QueryOrderBo):  Promise<AxiosResponse<QueryOrderVo>> {
  return api({
    url: '/pay/query-order',
    method: 'post',
    data: data,
  });
}

/**
 * 钱包管理-获得用户钱包详情
 */
export function payGetWalletApi():  Promise<AxiosResponse<PayWalletVo>> {
  return api({
    url: '/pay/wallet/get',
    method: 'post',
  });
}
