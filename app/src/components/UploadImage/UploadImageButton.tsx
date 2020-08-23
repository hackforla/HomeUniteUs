import React, { useState, CSSProperties } from 'react'
import { Button, Box, Container, Divider, Typography } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import DeleteIcon from '@material-ui/icons/Delete'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'

const ContainerStyles: CSSProperties = {
    borderWidth: '2px',
    borderStyle: 'dashed',
    borderColor: '#D9D9D9',
    borderRadius: '4px',
    height: '7rem',
    width: '10rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0',
}

const UploadImageButton: () => JSX.Element = () => {
    const [selectedImage, setSelectedImage]: any = useState<string[] | []>([])

    const imageSelectHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event?.target as HTMLInputElement
        const file: any = (target.files as FileList)[0]
        let reader: FileReader = new FileReader()
        let url: void = reader.readAsDataURL(file)
        reader.onloadend = () => {
            setSelectedImage([...selectedImage, reader.result])
        }
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

    const addMoreButtons = () => {
        return (
            <>
                <Button
                    component="label"
                    style={{
                        position: 'absolute',
                        color: '#55B1EB',
                        backgroundColor: 'transparent',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <AddCircleOutlineIcon />
                        <Typography>Add more Images</Typography>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={imageSelectHandler}
                            style={{ display: 'none' }}
                        />
                    </div>
                </Button>
            </>
        )
    }

    let addMoreImages: string | JSX.Element =
        selectedImage.length > 0 ? (
            <Box
                display="flex"
                justifyContent="space-evenly"
                style={{ margin: '2rem 5.125rem 0 5.125rem' }}
            >
                <div style={ContainerStyles}>
                    {selectedImage[1] ? (
                        <div style={{ width: '100%', height: '100%' }}>
                            <img
                                src={selectedImage[1]}
                                width="100%"
                                height="100%"
                            />
                        </div>
                    ) : (
                        addMoreButtons()
                    )}
                </div>

                <div style={ContainerStyles}>
                    {selectedImage[2] ? (
                        <div style={{ width: '100%', height: '100%' }}>
                            <img
                                src={selectedImage[2]}
                                width="100%"
                                height="100%"
                            />
                        </div>
                    ) : (
                        addMoreButtons()
                    )}
                </div>

                <div style={ContainerStyles}>
                    {selectedImage[3] ? (
                        <div style={{ width: '100%', height: '100%' }}>
                            <img
                                src={selectedImage[3]}
                                width="100%"
                                height="100%"
                            />
                        </div>
                    ) : (
                        addMoreButtons()
                    )}
                </div>
            </Box>
        ) : (
            ''
        )

    let displayImageOrBrowseBtn: JSX.Element =
        selectedImage.length > 0 ? (
            <div
                style={{ height: '100%', width: '100%', position: 'relative' }}
            >
                <span
                    style={{
                        position: 'absolute',
                        top: '2px',
                        left: '2px',
                        zIndex: 'auto',
                        cursor: 'pointer',
                        border: '4px solid white',
                        borderRadius: '50%',
                        color: 'white',
                        background: '#55B1EB',
                        height: '20px',
                        width: '23px',
                    }}
                    onClick={() => (selectedImage[0] = '')}
                >
                    <DeleteIcon fontSize="small" />
                </span>
                <img src={selectedImage[0]} width="100%" height="100%" />
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
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '0',
                        }}
                        maxWidth="sm"
                    >
                        {displayImageOrBrowseBtn}
                    </Container>
                    {addMoreImages}
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
                            disabled={selectedImage.length == 0 ? true : false}
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
