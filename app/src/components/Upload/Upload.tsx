import React, { useRef } from 'react'

function Upload() {
    const uploadedImg = useRef<HTMLImageElement>(null)

    const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        var input: EventTarget | HTMLInputElement | null = e.target

        console.log(input, '<-----------------wha is this?? input or nah?')
        const file = new File()
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
