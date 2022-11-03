import  { ReactNode } from "react";

export interface UploadingFile {
    data: Blob| string,
    name?: string,
    ready?: boolean,
}

export interface LayoutProps {
    children: ReactNode,
}

export interface ImageProps {
    base64: string | ArrayBuffer | null;
    width: number;
    height: number; 
}



