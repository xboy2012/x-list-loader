import IListLoaderConfig from './interfaces/IListLoaderConfig';
import IListLoader from './interfaces/IListLoader';
import * as LifeCycles from './interfaces/LifeCyles';

export default class ListLoader<T> implements IListLoader {
  public static create<T>(config: IListLoaderConfig<T>, scope?: any) {
    return new ListLoader(config, scope);
  }

  private readonly _config: IListLoaderConfig<T>;
  private readonly _scope: any;
  private _ssrData: T;
  private _started: boolean = false;
  private _loading: boolean = false;
  private _ended: boolean = false;

  private _ssrLoaded: boolean = false;

  constructor(config: IListLoaderConfig<T>, scope?: any) {
    this._config = config;
    this._scope = scope || config;
  }

  private invoke = (lifeCycle, ...args) => {
    const fn = this._config[lifeCycle];
    if (fn) {
      return fn.call(this._scope, ...args, this);
    }
  }

  // 加载下一页数据
  public async loadNext() {
    if (this._loading || this._ended) {
      return;
    }
    this._loading = true;
    const invoke = this.invoke;

    // 处理首屏SSR数据预加载逻辑
    if (!this._ssrLoaded) {
      this._ssrLoaded = true;
      this._ssrData = await invoke(LifeCycles.listLoadSSRData);
    }

    const ssrData = this._ssrData;

    const isFirstLoad = !this._started; // 是否是首次加载

    if (isFirstLoad) {
      this._started = true;
      await invoke(LifeCycles.listWillStart);
    }
    let error;
    let data;

    const isFirstSSRLoad = isFirstLoad && !!ssrData;

    try {
      if (isFirstSSRLoad) {
        data = ssrData;
      } else {
        await invoke(LifeCycles.listWillLoadData);
        data = await invoke(LifeCycles.listLoadData);
      }
    } catch (e) {
      error = e;
    }
    this._loading = false;
    if (error) {
      await invoke(LifeCycles.listDidCatch, error);
      return;
    }

    if (!isFirstSSRLoad) {
      await invoke(LifeCycles.listDidLoadData, data);
    }

    if (isFirstLoad) {
      await invoke(LifeCycles.listDidStart, data);
    }

    const isEnded = await invoke(LifeCycles.listShouldEnd, data);

    if (isEnded) {
      this._ended = true;
      await invoke(LifeCycles.listDidEnd, data);
    }
  }
}

