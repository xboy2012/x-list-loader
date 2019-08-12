import * as LifeCycles from './LifeCyles';
import IListLoader from './IListLoader';

export default interface IListLoaderConfig<T> {
  [LifeCycles.listLoadSSRData]?: (loader: IListLoader) => T | Promise<T>; // 列表SSR首页数据
  [LifeCycles.listWillStart]?: (loader: IListLoader) => void | Promise<void>; // 列表即将开始加载
  [LifeCycles.listWillLoadData]?: (loader: IListLoader) => void | Promise<void>; // 列表即将开始加载前的逻辑
  [LifeCycles.listLoadData]?: (loader: IListLoader) => T | Promise<T>; // 加载数据的逻辑
  [LifeCycles.listDidLoadData]?: (data: T, loader: IListLoader) => void | Promise<void>; // 加载已结束
  [LifeCycles.listDidStart]?: (data: T, loader: IListLoader) => void | Promise<void>; // 初始加载已结束
  [LifeCycles.listShouldEnd]?: (data: T, loader: IListLoader) => boolean | Promise<T>; // 列表是否已结束
  [LifeCycles.listDidEnd]?: (data: T, loader: IListLoader) => void | Promise<void>; // 列表已加载完最后一页
  [LifeCycles.listDidCatch]?: (error: any, loader: IListLoader) => void | Promise<void>; // 加载出现异常
}
