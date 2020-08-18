import React, { useState } from 'react'
import { Button, Box, Container, Divider } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

function UploadImageButton() {
    // const [selectedImage, setSelectedImage]: any = useState() //original
    const [selectedImage, setSelectedImage]: any = useState([])

    // const img: any = useRef('empty')

    const imageSelectHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event?.target as HTMLInputElement
        const file: any = target.files as FileList
        console.log(file, '<-----------------files??')
        setSelectedImage([...selectedImage, file])

        // const file: File = (target.files as FileList)[0] //this only selects the first one, gotta change it
        // setSelectedImage(file) //old way
        // img.current.innerText = file.name
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
                // boxShadow={3}
                // display="flex"
                // justifyContent="center"
                width="75%"
                margin="0 auto"
                // border={3}
                mt={5}
            >
                <Container
                    style={{
                        textAlign: 'center',
                        height: '40vh',
                    }}
                    maxWidth="md"
                >
                    <Container
                        style={{
                            borderWidth: '2px',
                            borderStyle: 'dashed',
                            borderColor: '#D9D9D9',
                            borderRadius: '4px',
                            height: '100%',
                            display: 'flex' /* establish flex container */,
                            flexDirection:
                                'column' /* make main axis vertical */,
                            justifyContent:
                                'center' /* center items vertically, in this case */,
                            alignItems: 'center',
                        }}
                        maxWidth="sm"
                    >
                        <div
                            style={{
                                background: '#E6E6E6',
                                opacity: '0.3',
                                width: '589px',
                                height: '340px',
                            }}
                        ></div>
                        <Button
                            variant="contained"
                            component="label"
                            style={{
                                position: 'absolute',
                                background: '#55B1EB',
                                color: '#fff',
                            }}
                        >
                            Browse
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={imageSelectHandler}
                                style={{ display: 'none' }}
                            />
                        </Button>
                    </Container>
                    <Divider
                        style={{
                            margin: '1.5rem auto',
                            width: '44.6vw',
                        }}
                    />
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Button style={{ color: '#55B1EB' }}>
                            <span
                                style={{
                                    padding: '0.4rem 1.3rem 0.4rem 1.3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <ArrowBackIosIcon /> Back
                            </span>
                        </Button>

                        <Button
                            variant="contained"
                            // color="#55B1EB"
                            style={{
                                margin: '0 3rem 0 7rem',
                                background: '#55B1EB',
                                color: '#fff',
                            }}
                        >
                            <span
                                style={{
                                    padding: '0.4rem 1.3rem 0.4rem 1.3rem',
                                }}
                            >
                                Skip for Now
                            </span>
                        </Button>

                        <Button
                            type="submit"
                            // disabled={!dirty || !isValid}
                            variant="contained"
                            // color="#55B1EB"
                            style={{ background: '#55B1EB', color: '#fff' }}
                        >
                            <span
                                style={{
                                    padding: '0.4rem 1.3rem 0.4rem 1.3rem',
                                }}
                            >
                                Save and Continue
                            </span>
                        </Button>
                    </div>
                </Container>
            </Box>
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
