import React, { useRef, useState } from 'react'
import { Button, Box, Paper } from '@material-ui/core'
// import Button from '../Registration/Button/Button'

function UploadImageButton() {
    const [selectedImage, setSelectedImage]: any = useState()
    const img: any = useRef('empty')

    const imageSelectHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event?.target as HTMLInputElement
        const file: File = (target.files as FileList)[0] //this only selects the first one, gotta change it
        // setSelectedImage(file) //old way
        img.current.innerText = file.name
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
            <Box
                boxShadow={3}
                display="flex"
                justifyContent="center"
                width={1 / 2}
            >
                <div>Div one</div>

                <div>Div two</div>
            </Box>
            {/* <div style={{ border: '1px solid orange' }}>
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
                <p ref={img}></p>
            </div> */}
        </>
    )
}

export default UploadImageButton

{
    /* <button onClick={fileUploadHandler}>Upload</button> */
} //might put back when needed

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
