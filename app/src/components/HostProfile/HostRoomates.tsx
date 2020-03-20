import * as React from "react";
import { Link } from 'react-scroll'
import { Housemate } from '../../models/Housemate';
import { RoommateContainer } from "./style"

interface IHostRoomatesProps {
  roommates: Array<Housemate>;
}

const HostRoomates = ({ roommates }: IHostRoomatesProps) =>
  <RoommateContainer>
    <React.Fragment>
      <Link
        activeClass="active"
        to="additionalInfo"
        spy={true}
        smooth={true}
        duration={500}
      >
        <a href="#">
          more about your host
          </a>
      </Link>
    </React.Fragment>
  </RoommateContainer>

export default HostRoomates