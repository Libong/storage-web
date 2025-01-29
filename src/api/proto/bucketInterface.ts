import http from "@/utils/http";
import { toCamelCaseObject, toSnakeCase } from "@/utils/tool";

// 基础类型定义
export interface Meta {
    id: string;
    name: string;
}

// Bucket类型定义
export interface IBucket {
    id: string;
    name: string;
    type: 'private' | 'public';
    description?: string;
    size: number;
    folderCount: number;
    fileCount: number;
    createTime: string;
    lastModified: string;
}

// 创建存储空间请求
export interface ICreateBucketReq {
    name: string;
    type: 'private' | 'public';
    description?: string;
}

// 创建存储空间响应
export interface ICreateBucketResp {
    bucketId: string;
}

// 获取存储空间列表响应
export interface IListBucketsResp {
    buckets: IBucket[];
    total: number;
}

// 获取存储空间详情响应
export interface IBucketDetailResp extends IBucket {
    owner: Meta;
    permissions: string[];
}

// 更新存储空间请求
export interface IUpdateBucketReq {
    bucketId: string;
    type?: 'private' | 'public';
    description?: string;
}

// 文件项类型
export interface IFileItem {
    id: string;
    name: string;
    size: number;
    type: string;
    isFolder: boolean;
    modifiedTime: string;
    path: string;
}

// 获取文件列表请求
export interface IListFilesReq {
    bucketId: string;
    path: string;
    pageSize?: number;
    pageToken?: string;
}

// 获取文件列表响应
export interface IListFilesResp {
    items: IFileItem[];
    nextPageToken?: string;
}

// 上传文件请求
export interface IUploadFileReq {
    bucketId: string;
    path: string;
    file: File;
}

// 上传文件响应
export interface IUploadFileResp {
    fileId: string;
    url: string;
}

// 创建文件夹请求
export interface ICreateFolderReq {
    bucketId: string;
    path: string;
    name: string;
}

// 删除文件请求
export interface IDeleteFileReq {
    bucketId: string;
    path: string;
    isFolder?: boolean;
}

// 接口实现
export function createBucketInterface(req: ICreateBucketReq): Promise<ICreateBucketResp> {
    return new Promise((resolve, reject) => {
        http
            .post("/bucket/create", true, toSnakeCase(req))
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as ICreateBucketResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function listBucketsInterface(): Promise<IListBucketsResp> {
    return new Promise((resolve, reject) => {
        http
            .get("/bucket/list", true, null)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as IListBucketsResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function getBucketDetailInterface(bucketId: string): Promise<IBucketDetailResp> {
    return new Promise((resolve, reject) => {
        http
            .get(`/bucket/${bucketId}/detail`, true, null)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as IBucketDetailResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function updateBucketInterface(req: IUpdateBucketReq): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post("/bucket/update", true, toSnakeCase(req))
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function deleteBucketInterface(bucketId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post(`/bucket/${bucketId}/delete`, true, null)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function listFilesInterface(req: IListFilesReq): Promise<IListFilesResp> {
    return new Promise((resolve, reject) => {
        http
            .get(`/bucket/${req.bucketId}/files`, true, {
                path: req.path,
                page_size: req.pageSize,
                page_token: req.pageToken
            })
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as IListFilesResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function uploadFileInterface(req: IUploadFileReq): Promise<IUploadFileResp> {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', req.file);
        formData.append('path', req.path);

        http
            .post(`/bucket/${req.bucketId}/upload`, true, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as IUploadFileResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function createFolderInterface(req: ICreateFolderReq): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post(`/bucket/${req.bucketId}/folder/create`, true, toSnakeCase(req))
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function deleteFileInterface(req: IDeleteFileReq): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post(`/bucket/${req.bucketId}/file/delete`, true, toSnakeCase(req))
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
} 