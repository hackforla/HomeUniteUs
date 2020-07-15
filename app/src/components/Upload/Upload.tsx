import React, { useRef } from 'react'

function Upload() {
    const uploadedImg = useRef<HTMLImageElement>(null)

    const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files
        const readingFile = new FileReader()
    }

    return (
        <>
            <div>
                <input
                    type="file"
                    accept="image/*"
                    multiple={false}
                    onChange={handleImgUpload}
                />
            </div>

            <div>
                <img
                    ref={uploadedImg}
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                    }}
                />
            </div>
        </>
    )
}

export default Upload
