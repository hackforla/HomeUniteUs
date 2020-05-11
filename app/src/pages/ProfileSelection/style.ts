import styled from 'styled-components'

export const Container = styled.div`
  min-height: 88.62vh;
  padding: 0;
  background-color: #fff;
  align-item: center;
`

export const Card = styled.div`
  width: 800px;
  height: 350px;
  z-index: 15;
  background: #f7fbfc;
  background: #d8f0f3;
  color: black;
  border-radius: 25px;
  margin: 0 auto;
  margin-top: 2rem;
  border: 1px solid whitesmoke;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const Image = styled.img`
  height: 10rem;
  width: 10rem;  
`

export const Btn = styled.button`
  width: 10rem;
  margin: 0 auto;
  box-shadow:inset 0px 1px 0px 0px #54a3f7;
	background:linear-gradient(to bottom, #007dc1 5%, #0061a7 100%);
	background-color:#007dc1;
	border-radius:3px;
	border:1px solid #124d77;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:13px;
	padding:6px 24px;
	text-decoration:none;
  text-shadow:0px 1px 0px #154682;
  &:hover {
    background:linear-gradient(to bottom, #0061a7 5%, #007dc1 100%);
	  background-color:#0061a7;
  }
  &:active {
    position:relative;
	  top:1px;
  }
`

export const BtnContainer = styled.div`
  margin: 10px auto;
`

export const CardHover = styled.div`
  text-align: center;
  height: 12rem;
  width: 12rem;
  &:hover {
    box-shadow: 10px 8px 20px -2px black;
    transition: box-shadow .5s;
    curser: pointer;
    
    border-radius: 50%;
    border-radius: 80px;
  }
  &:active {
    border: 0.8px solid orange;
  }
`