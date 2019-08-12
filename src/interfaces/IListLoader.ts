export default interface IListLoader {
  loadNext: () => Promise<void>
}
