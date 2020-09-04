import React, { Component } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import { model } from "./documents/index";
import * as cvstfjs from "@microsoft/customvision-tfjs";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { file: "", imagePreviewUrl: "" };
  }

  async _handleSubmit(e) {
    try {
      e.preventDefault();
      // TODO: do something with -> this.state.file
      console.log("handle uploading-", this.state.file);
    
      let model = new cvstfjs.ClassificationModel();
      await model.loadModelAsync("http://localhost:81/uploads/model.json");
      const image = document.getElementById("ImgChosen");
      const result = await model.executeAsync(image);
      console.log("Numbers",result);
      const MODEL_CLASSES={
        0:"Drawing",
        1:"Painting",
        2:"Sculpture"
      }
      let probabiilityArray=[]
      result.map((element)=>{
        console.log("element",element)
        return element.map((probabiility,index)=>{
          console.log('probabiility',probabiility,index)
          let prob={
           probabiility:probabiility,
           artCategory:MODEL_CLASSES[index]
          }
          return probabiilityArray.push(prob)

        })
      })
      console.log(probabiilityArray)
      // let model = await tf.loadGraphModel('http://localhost:81/uploads/model.json');
      // console.log( "Model loaded.",model );
      //     console.log("Model succesfully loaded", model);
      //     console.log( "Loading image...",this.state.file );
      //     let img = new Image()
      //     img.src=this.state.file.name;
      //     img.alt='img';
      //     img.width=500;
      //     img.height=500;
      //     console.log(img)
      //     let tensor = tf.browser.fromPixels(img, 3)
      //     .resizeNearestNeighbor([224, 224]) // change the image size
      //     .expandDims()
      //     .toFloat()
      //     .reverse(-1); 
      //      // RGB -> BGR
      //   let predictions = await model.predict(tensor).data();
      //   console.log(predictions)
   

      // let prediction = await model.predict(this.state.file);
      // prediction.map((element) => {
      //   return console.log("Preciction from model: ", element);
      // });
    } catch (error) {
      console.log(error);
    }
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }

  render() {
    console.log(tf);
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = <img id="ImgChosen" src={imagePreviewUrl} alt="" />;
    } else {
      $imagePreview = (
        <div className="previewText">Please select an Image for Preview</div>
      );
    }

    return (
      <div className="previewComponent">
        <form onSubmit={(e) => this._handleSubmit(e)}>
          <input
            className="fileInput"
            type="file"
            onChange={(e) => this._handleImageChange(e)}
          />
          <button
            className="submitButton"
            type="submit"
            onClick={(e) => this._handleSubmit(e)}
          >
            Upload Image
          </button>
        </form>
        <div className="imgPreview">{$imagePreview}</div>
      </div>
    );
  }
}
