import React, { useState, CSSProperties, useEffect } from 'react'
import { Button, Box, Container, Divider, Typography } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import DeleteIcon from '@material-ui/icons/Delete'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import styled, { StyledComponent } from 'styled-components'
import { Photo } from '../../models/v2'
import { useHostDashboardData } from '../../data/host-context'

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

const ImgDiv: CSSProperties = {
    width: '100%',
    height: '100%',
}

const DisplayImg: CSSProperties = {
    height: '100%',
    width: '100%',
    position: 'relative',
}

const DisplaySpan: CSSProperties = {
    position: 'absolute',
    left: '2px',
    top: '2px',
    cursor: 'pointer',
    zIndex: 'auto',
    borderRadius: '50%',
    border: '4px solid white',
    background: '#55B1EB',
    color: 'white',
    width: '23px',
    height: '20px',
}

const DisplayDiv: CSSProperties = {
    background: '#E6E6E6',
    opacity: '0.3',
    width: '589px',
    height: '340px',
}

const ContainerDiv: CSSProperties = {
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
}

const Span: CSSProperties = {
    padding: '0.4rem 1.3rem 0.4rem 1.3rem',
    display: 'flex',
    alignItems: 'center',
}

const Div: StyledComponent<'div', any, {}, never> = styled.div`
    display: 'flex' !important;
    flexdirection: 'column' !important;
    alignitems: 'center' !important;
`

const AddMoreBtn: StyledComponent<
    ({ ...other }: any) => JSX.Element,
    any,
    {},
    never
> = styled(({ ...other }) => <Button component="label" {...other} />)`
    color: #55b1eb !important;
    position: absolute !important;
    backgroundcolor: transparent !important;
`

const Boxes: StyledComponent<
    ({ ...other }: any) => JSX.Element,
    any,
    {},
    never
> = styled(({ ...other }) => <Box {...other} />)`
    margin: 2rem 5.125rem 0 5.125rem !important;
`

const BrowseBtn: StyledComponent<
    ({ style, ...other }: any) => JSX.Element,
    any,
    {},
    never
> = styled(({ style, ...other }) => (
    <Button variant="contained" component="label" {...other} classes={{}} />
))`
    position: absolute !important;
    background: #55b1eb !important;
    color: #fff !important;
`

interface UploadImageButtonProps {
    uploadAll?: (images: Array<File>) => void
    images?: Array<Photo>
}

const UploadImageButton: (props: UploadImageButtonProps) => JSX.Element = (
    props: UploadImageButtonProps
) => {
    //custom hook here
    // const { putPictureInfo } = useHostDashboardData()

    const [selectedImage, setSelectedImage]: any = useState<string[] | []>([])

    const [imageFiles, setImageFiles] = useState(new Array<File>())

    const imageSelectHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event?.target as HTMLInputElement
        const file: any = (target.files as FileList)[0]
        let reader: FileReader = new FileReader()
        let url: void = reader.readAsDataURL(file)
        reader.onloadend = () => {
            setSelectedImage([...selectedImage, reader.result])
            setImageFiles([...imageFiles, file])
        }
    }

    useEffect(() => {
        const promises = new Array<Promise<Response>>()
        props.images?.forEach((p: Photo) => {
            console.log(
                `UploadImageButton: promising to fetch photo: ${JSON.stringify(
                    p
                )}`
            )
            promises.push(fetch(`/api/host/images/download/${p.id}`))
        })
        Promise.all(promises)
            .then((responses: Response[]) => {
                const blobPromises = new Array<Promise<Blob>>()
                responses.forEach((r: Response) => {
                    blobPromises.push(r.blob())
                })
                return Promise.all(blobPromises)
            })
            .then((blobs: Array<Blob>) => {
                const images = new Array<any>()

                const readFile = (index: number) => {
                    console.log(`readFile(${index})`)
                    let reader: FileReader = new FileReader()
                    let url: void = reader.readAsDataURL(blobs[index])
                    reader.onloadend = () => {
                        images.push(reader.result)
                        if (index < blobs.length - 1) {
                            readFile(index + 1)
                        } else {
                            console.log(
                                `adding ${images.length} new images to state`
                            )
                            setSelectedImage([...selectedImage, ...images])
                        }
                    }
                }
                readFile(0)
            })
    }, [props.images])

    //TODO when api wrapper has fileupload callback
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

    const AddMoreButtons: () => JSX.Element = () => {
        return (
            <>
                <AddMoreBtn>
                    <Div>
                        <AddCircleOutlineIcon />
                        <Typography>Add more Images</Typography>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={imageSelectHandler}
                            style={{ display: 'none' }}
                        />
                    </Div>
                </AddMoreBtn>
            </>
        )
    }

    let addMoreImages: string | JSX.Element =
        selectedImage.length > 0 ? (
            <Boxes display="flex" justifyContent="space-evenly">
                {[1, 2, 3].map((i) => {
                    return (
                        <div style={ContainerStyles} key={i}>
                            {selectedImage[i] ? (
                                <div style={ImgDiv}>
                                    <img
                                        src={selectedImage[i]}
                                        width="100%"
                                        height="100%"
                                    />
                                </div>
                            ) : (
                                <AddMoreButtons />
                            )}
                        </div>
                    )
                })}
            </Boxes>
        ) : (
            ''
        )

    let displayImageOrBrowseBtn: JSX.Element =
        selectedImage.length > 0 ? (
            <div style={DisplayImg}>
                <span
                    style={DisplaySpan}
                    onClick={() => {
                        setSelectedImage(
                            [...selectedImage].filter((image, i) => i !== 0)
                        )
                        setImageFiles(
                            [...imageFiles].filter((image, i) => i !== 0)
                        )
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </span>
                <img src={selectedImage[0]} width="100%" height="100%" />
            </div>
        ) : (
            <>
                <div style={DisplayDiv} />
                <BrowseBtn>
                    Browse
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={imageSelectHandler}
                        style={{ display: 'none' }}
                    />
                </BrowseBtn>
            </>
        )

    const uploadAll = () => {
        if (props.uploadAll) {
            props.uploadAll(imageFiles)
        }
    }

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
                    <Container style={ContainerDiv} maxWidth="sm">
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
                            <span style={Span}>
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
                            disabled={selectedImage.length == 0 ? true : false}
                            variant="contained"
                            style={{ background: '#55B1EB', color: '#fff' }}
                            onClick={uploadAll}
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
