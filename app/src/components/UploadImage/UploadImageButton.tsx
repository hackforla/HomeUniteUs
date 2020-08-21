import React, { useState, CSSProperties } from 'react'
import { Button, Box, Container, Divider } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

const ContainerStyles: CSSProperties = {
    borderWidth: '2px',
    borderStyle: 'dashed',
    borderColor: '#D9D9D9',
    borderRadius: '4px',
    height: '8rem',
    width: '10rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0',
}

function UploadImageButton() {
    // const [selectedImage, setSelectedImage]: any = useState() //original
    const [selectedImage, setSelectedImage]: any = useState([])

    // const img: any = useRef('empty')

    const imageSelectHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event?.target as HTMLInputElement
        const file: any = (target.files as FileList)[0]
        let reader = new FileReader()
        let url = reader.readAsDataURL(file)
        reader.onloadend = () => {
            setSelectedImage([...selectedImage, reader.result])
        }
        // setSelectedImage([...selectedImage, file])

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

    let moreImage =
        selectedImage.length > 0 ? (
            <Box mt={2} mx={8} display="flex" justifyContent="space-evenly">
                <div style={ContainerStyles}>
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
                </div>

                <div style={ContainerStyles}>
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
                </div>

                <div style={ContainerStyles}>
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
                </div>
            </Box>
        ) : (
            ''
        )

    let displayImageOrBrowseBtn =
        selectedImage.length > 0 ? (
            <div style={{ height: '100%', width: '100%' }}>
                <img src={selectedImage} width="100%" height="100%" />
            </div>
        ) : (
            <>
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
            </>
        )

    return (
        <>
            <Box width="75%" margin="0 auto" mt={5}>
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
                            padding: '0',
                        }}
                        maxWidth="sm"
                    >
                        {displayImageOrBrowseBtn}
                    </Container>
                    {moreImage}
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
