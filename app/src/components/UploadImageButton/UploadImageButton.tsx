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
        const fd = new FormData()
        fd.append('image', selectedImage, selectedImage.name)
        //testing for now but will remove later
        try {
            const uploadImg = await fetch(
                'https://localhost:8080/uploadImage',
                {
                    method: 'POST',
                    body: JSON.stringify(fd),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            const uploadImgJson = await uploadImg.json()
            //then do a fetch call here to backend
            console.log(uploadImgJson, '<------------what is this?')
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
