import * as React from "react"
import { ModalsStyle } from "./style"
import { Constants } from "../data/config"

const Modal = (props: any) => {
  const { visible, showElement } = props

  return (
    Object.values(visible).some(value => value) ? (
      <ModalsStyle.Modal>
        {Object.keys(visible).map((modal, i) =>
          visible[Object.keys(visible)[i]] ?
            (
              <React.Fragment>
                <ModalsStyle.TextHolder>
                  <ModalsStyle.ModalsText>
                    {i === 0 ? "Admin Page" :
                      i === 1 ? "Guest Matches" :
                        i === 2 ? "Interest Buttons" :
                          i === 3 ? "Annotation of Interested" :
                            "Annotation of Decline"
                    }
                  </ModalsStyle.ModalsText>
                  <ModalsStyle.X onClick={() =>
                    showElement({
                      ...showElement, [modal]: false
                    })}>
                    <span>
                      X
                    </span>
                  </ModalsStyle.X>
                </ModalsStyle.TextHolder>
                <ModalsStyle.ImageBorder
                  title={`${modal}`}
                  src={`${Constants.StaticFilePrefix}/img/${modal}.png`}
                  alt={`${modal}`}
                />
              </React.Fragment>
            ) : null
        )}
      </ModalsStyle.Modal>
    ) : null
  )
}

export default Modal
