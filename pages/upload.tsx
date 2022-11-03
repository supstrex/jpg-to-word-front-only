import React, { useState } from "react";
import { UploadingFile } from "../interfaces/intefaces";
import { NextPage } from "next";
import NextImage from 'next/image';
import { Document, ImageRun, Packer, Paragraph } from "docx";
import {ImageProps} from "../interfaces/intefaces"

let Upload: NextPage = ()=> {

  /*Used hooks*/
  const [file, setFile] = useState<UploadingFile>({data:"", ready: false});
  const [errorMsg, setErrorMsg] = useState("");

  /*File selection from local file system*/
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    /*Image validations*/
    if (!e.target.files) return;
    if (!e.target.files[0]) return;
    if (e.target.files[0].type !== 'image/jpeg' && e.target.files[0].type !== 'image/jpg'){
      setErrorMsg("Unsupported image type")
      return;
    }
    if (e.target.files[0].size > 50000000){
      setErrorMsg("Image is too large")
      return;
    }

    /*Set file state*/ 
    setFile({ data: e.target.files[0] , name: e.target.files[0].name, ready: false});    
    setErrorMsg("")
  }

  /*On submition convert image into docx*/
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (file.data && file.data instanceof Blob) {
      const imageProps = await convertBase64(file.data)
      const convertedFile = await docxConversion(imageProps);

      let newName = file.name?.slice(0, file.name.lastIndexOf(".")) + ".docx";

      if(convertedFile){
        setFile({ data: convertedFile, ready: true, name: newName });
      }
    } 
  }

  /*Converting from Blob to base64*/
  function convertBase64(file: Blob ): Promise<ImageProps> {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = (e) => {  
          /*Finding out original image dimensions*/
          if(typeof fileReader.result == 'string'){
            let image = new Image();
            image.src = fileReader.result;
            image.onload = () => {
              let width = image.width;
              let height = image.height;
              resolve({base64: fileReader.result, width, height})
            };
          }         
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
  };

  /*Converting base64 image to base64 docx file*/
  async function docxConversion(imageProps: ImageProps) { 
    if(!imageProps.base64){
      return;
    }
    /*Using docx package to build new docx file*/
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: imageProps.base64,
                  transformation: {
                    width:  imageProps.width || 400,
                    height:  imageProps.height || 300,
                  },
                }),
              ],
            }),
          ],
        },
      ],
    });

    return await Packer.toBase64String(doc); 
  }
    
  return (
    <div className="row-upload">
      <div className="file-pickers">
        <div className="file-selection">
          <label htmlFor="file-input">
            <div className="file-selection-image">
              <NextImage
                priority
                src="/media/fileSelectionIcon.png"
                alt="Icon for file selection"
                height={100}
                width={100}
              />
            </div>     
          </label>
          <input
            type="file"
            className="file-selection-input"
            name="file-input"
            id="file-input"
            accept=".png, .jpg, .jpeg"
            onChange={onFileChange}
          />
        </div>
        <div>
          <button className="picker-button">
            <div className="picker-button-image">
              <NextImage
                priority
                src="/media/googleDriveIcon.png"
                alt="Google Drive Icon"
                height={100}
                width={100}
              />
            </div>
          </button>
        </div>
        <div>
          <button className="picker-button">
            <div className="picker-button-image">
              <NextImage
                priority
                src="/media/dropboxIcon.ico"
                alt="DropBox Icon"
                height={100}
                width={100}
              />
            </div>
          </button>
        </div>
      </div>
      {file.data !== "" && !file.ready ? (
        <div className="convert">
          <form onSubmit={onSubmit}>
              <button className="action-button" type="submit">
                Convert
              </button>
          </form>
        </div>
      ) : file.ready ? (
        <div className="download">
          <a download={file.name} href={"data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64, " + file.data}>
            <button className="action-button">
              Download
            </button>
          </a>
        </div>
        ): (
        <></>
      )}
      <div>
        <p className="error-msg">{errorMsg}</p>
      </div>
    </div>
    );
}

export default Upload;
