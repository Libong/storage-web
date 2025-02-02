import http from "@/utils/http";
import {toCamelCaseObject, toSnakeCase} from "@/utils/tool";

// 基础消息类型定义
export interface IAccount {
    accountId: string;
    account: string;
    name: string;
    cid: string;
    phone: string;
}

// 请求响应类型定义
export interface IAddAccountReq {
    account: string;
    name: string;
    cid: string;
    phone: string;
    sex: number;
    idCardNo: string;
    email: string;
    avatar: string;
    roleIds: string[];
}

export interface IUpdateAccountReq {
    accountId: string;
    name: string;
    cid: string;
    phone: string;
    sex: number;
    idCardNo: string;
    email: string;
    avatar: string;
    roleIds: string[];
}

export interface IDeleteAccountReq {
    accountId: string;
}

export interface ISearchAccountsPageReq {
    fuzzyName?: string;
    phone?: string;
    pageNum?: number;
    pageSize?: number;
}

export interface ISearchAccountsPageResp {
    list: IAccount[];
    total: number;
}

export interface IAccountByIdReq {
    accountId: string;
}

export interface IAccountByIdResp {
    accountId: string;
    name: string;
    cid: string;
    phone: string;
    sex: number;
    idCardNo: string;
    email: string;
    avatar: string;
}

// 接口实现
export function addAccountInterface(req: IAddAccountReq): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post("/account/add", true, toSnakeCase(req))
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function updateAccountInterface(req: IUpdateAccountReq): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post("/account/update", true, toSnakeCase(req))
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function deleteAccountInterface(req: IDeleteAccountReq): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post("/account/delete", true, toSnakeCase(req))
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function searchAccountsPageInterface(req: ISearchAccountsPageReq): Promise<ISearchAccountsPageResp> {
    return new Promise((resolve, reject) => {
        http
            .get("/account/search/page", true, toSnakeCase(req))
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as ISearchAccountsPageResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function accountByIdInterface(req: IAccountByIdReq): Promise<IAccountByIdResp> {
    return new Promise((resolve, reject) => {
        http
            .get("/account/get", true, toSnakeCase(req))
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as IAccountByIdResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
} 