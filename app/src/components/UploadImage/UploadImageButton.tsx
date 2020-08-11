import React, { useRef, useState } from 'react'
import { Button } from '@material-ui/core'
// import Button from '../Registration/Button/Button'

function UploadImageButton() {
    const [selectedImage, setSelectedImage]: any = useState()

    const imageSelectHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event?.target as HTMLInputElement
        const file: File = (target.files as FileList)[0] //this only selects the first one, gotta change it
        // setSelectedImage(file) //old way
    }

    // const fileUploadHandler = async () => {
    //     try {
    //         const fd = new FormData()
    //         fd.append('image', selectedImage)
    //         const posting = await fetch('http://localhost:8080/uploadImage', {
    //             method: 'POST',
    //             body: fd,
    //         }) //gotta change the fetch call
    //         const postingJson = await posting.json()
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    return (
        <>
            <div style={{ border: '1px solid orange', height: '10%' }}>
                <Button variant="contained" color="primary" component="label">
                    Browse
                    <input
                        type="file"
                        accept="image/*"
                        multiple={true}
                        onChange={imageSelectHandler}
                        style={{ display: 'none' }}
                    />
                </Button>
                {/* <button onClick={fileUploadHandler}>Upload</button> */}
            </div>
        </>
    )
}

export default UploadImageButton

{
    /* <input
accept="image/*"
className={classes.input}
id="contained-button-file"
multiple
type="file"
/>
<label htmlFor="contained-button-file">
<Button variant="contained" color="primary" component="span">
  Upload
</Button>
</label> */
}
