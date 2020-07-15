import React, { useRef } from 'react'

function Upload() {
    const uploadedImg = useRef<HTMLImageElement>(null)

    const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        var file: any | null = e.target.files

        console.log(file, '<----------e.target.files')

        let slicedFile: any | null = file?.item(0)?.name.split('.')[0]

        const newFile = new File([slicedFile], file?.item(0)?.name, {
            type: file?.item(0)?.type,
        })

        console.log(newFile, '<-------------------File()')
    }

    return (
        <>
            <div style={{ border: '1px solid orange', height: '10%' }}>
                <input
                    type="file"
                    accept="image/*"
                    multiple={false}
                    onChange={handleImgUpload}
                />
            </div>

            <div style={{ border: '1px solid red', height: '10%' }}>
                <img
                    ref={uploadedImg}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                />
            </div>
        </>
    )
}

export default Upload
