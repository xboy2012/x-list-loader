import IListLoader from './IListLoader';

export default interface IListLoaderConfig<T> {
  listLoadSSRData?: (loader: IListLoader) => T | Promise<T>; // 列表SSR首页数据
  listWillStart?: (loader: IListLoader) => void | Promise<void>; // 列表即将开始加载
  listWillLoadData?: (loader: IListLoader) => void | Promise<void>; // 列表即将开始加载前的逻辑
  listLoadData?: (loader: IListLoader) => T | Promise<T>; // 加载数据的逻辑
  listDidLoadData?: (data: T, loader: IListLoader) => void | Promise<void>; // 加载已结束
  listDidStart?: (data: T, loader: IListLoader) => void | Promise<void>; // 初始加载已结束
  listShouldEnd?: (data: T, loader: IListLoader) => boolean | Promise<void>; // 列表是否已结束
  listDidEnd?: (data: T, loader: IListLoader) => void | Promise<void>; // 列表已加载完最后一页
  listDidCatch?: (error: any, loader: IListLoader) => void | Promise<void>; // 加载出现异常
}
