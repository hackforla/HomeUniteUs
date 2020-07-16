import React, { useRef, useState } from 'react'

function Upload() {
    const [selectedImage, setSelectedImage]: any = useState()

    // const imageSelectHandler = (event?: Event | undefined) => {
    const imageSelectHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event?.target as HTMLInputElement
        const file: File = (target.files as FileList)[0]
        setSelectedImage(file)
    }

    const fileUploadHandler = () => {
        const fd = new FormData()
        fd.append('image', selectedImage, selectedImage.name)
        //then do a fetch call here to backend
        console.log('upload image to db')
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

export default Upload
