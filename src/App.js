import React from 'react';
import './App.css';

class App extends React.Component{
  state = {
    imageUrl: null,
    imageAlt: null,
  }
  handleImageUpload = () => {
    const { files } = document.querySelector('input[type="file"]')

    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', 'qvfwjbwg');

    const options = {
      method: 'POST',
      body: formData,
    };
  
    return fetch('https://api.cloudinary.com/v1_1/shirly/image/upload', options)
      .then(res => res.json())
      .then(res => {
        this.setState({
          imageUrl: res.secure_url,
          imageAlt: `An image of ${res.original_filename}`
        })
      })
      .catch(err => console.log(err));
  }

  openWidget = () => {
    window.cloudinary.createUploadWidget(
      {
        cloudName: 'shirly',
        uploadPreset: 'my-preset',
      },
      (error, { event, info }) => {
        if (event === 'success') {
          this.setState({
            imageUrl: info.secure_url,
            imageAlt: `An image of ${info.original_filename}`
          })
        }
      },
    ).open();
  };
  openEditor = () => {
    const myEditor = window.cloudinary.mediaEditor();
    myEditor.update({
      publicIds: ["sample"],
      cloudName: "demo", 
    })
   myEditor.show();
   myEditor.on("export",function(data){
    console.log(data);
  })
  }

  render() {
    const { imageUrl, imageAlt } = this.state;

    return (
      <main  className="App">
        <section className="left-side">
          <form>
            <div className="form-group">
              <input type="file"/>
            </div>
  
            <button type="button" className="btn" onClick={this.handleImageUpload}>Submit</button>
            <button type="button" className="btn widget-btn" onClick={this.openWidget}>Upload Via Widget</button>
            <button type="button" className="btn widget-btn" onClick={this.openEditor}>Media Editor</button>
          </form>
        </section>
        <section className="right-side">
          <p>The resulting image will be displayed here</p>
          {imageUrl && (
            <img src={imageUrl} alt={imageAlt} className="displayed-image"/>
          )}
        </section>
      </main>
    );
  }
}

export default App;