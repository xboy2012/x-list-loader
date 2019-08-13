import IListLoaderConfig from './interfaces/IListLoaderConfig';
import IListLoader from './interfaces/IListLoader';

export default class ListLoader<T> implements IListLoader {
  public static create<T>(config: IListLoaderConfig<T>) {
    return new ListLoader(config);
  }

  private readonly _config: IListLoaderConfig<T>;
  private _ssrData: T;
  private _started?: boolean;
  private _loading?: boolean;
  private _ended?: boolean;
  private _ssrLoaded?: boolean;

  constructor(config: IListLoaderConfig<T>) {
    this._config = config;
  }

  private invoke = <T>(lifeCycle: keyof IListLoaderConfig<T>, ...args) => {
    const config = this._config;
    const fn = config[lifeCycle];
    if (fn) {
      return fn.call(config, ...args, this);
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
      this._ssrData = await invoke('listLoadSSRData');
    }

    const ssrData = this._ssrData;

    const isFirstLoad = !this._started; // 是否是首次加载

    if (isFirstLoad) {
      this._started = true;
      await invoke('listWillStart');
    }
    let error;
    let data;

    const isFirstSSRLoad = isFirstLoad && !!ssrData;

    try {
      if (isFirstSSRLoad) {
        data = ssrData;
      } else {
        await invoke('listWillLoadData');
        data = await invoke('listLoadData');
      }
    } catch (e) {
      error = e;
    }
    this._loading = false;
    if (error) {
      await invoke('listDidCatch', error);
      return;
    }

    if (!isFirstSSRLoad) {
      await invoke('listDidLoadData', data);
    }

    if (isFirstLoad) {
      await invoke('listDidStart', data);
    }

    const isEnded = await invoke('listShouldEnd', data);

    if (isEnded) {
      this._ended = true;
      await invoke('listDidEnd', data);
    }
  }
}

