export interface IDownloadable
{
    download(cb: Function): void;
    onDownloaded(cb: Function): void;
}