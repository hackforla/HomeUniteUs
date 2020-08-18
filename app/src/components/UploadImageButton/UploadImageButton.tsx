import React, { useRef, useState } from 'react'

function UploadImageButton() {
  const [selectedImage, setSelectedImage]: any = useState()

  // const imageSelectHandler = (event?: Event | undefined) => {
  const imageSelectHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event?.target as HTMLInputElement
    const file: File = (target.files as FileList)[0]
    setSelectedImage(file)
  }

  const fileUploadHandler = async () => {
    try {
      const fd = new FormData()
      fd.append('image', selectedImage)
      const posting = await fetch('http://localhost:8080/uploadImage', {
        method: 'POST',
        body: fd,
      })
      const postingJson = await posting.json()
      console.log(postingJson, '<---------------postingJson')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <div style={{ border: '1px solid orange', height: '10%' }}>
        <input
          type="file"
          accept="image/*"
          multiple={false}
          onChange={imageSelectHandler}
        />
        <button onClick={fileUploadHandler}>Upload</button>
      </div>
    </>
  )
}

export default UploadImageButton
